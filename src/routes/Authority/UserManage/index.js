import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { Row, Col, Divider, Select, Spin, message } from "antd";

const { Option } = Select;
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import ContentTitle from "components/ContentTitle";
import ConfirmModal from "components/ConfirmModal";
import TooltipItem from "components/TooltipItem";
import ResetPassword from "./ResetPassword";
import styles from "../index.less";
import { UserManageColumns } from "../columns";
import Debounce from "lodash-decorators/debounce";
import TreeList from "./TreeList";

const searchs = [
  {
    type: "Input",
    label: "姓名",
    required: false,
    placeholder: "请输入",
    parameter: "name"
  },
  {
    type: "Input",
    label: "账户",
    required: false,
    placeholder: "请输入",
    parameter: "email"
  }
];
/**
 * 用户管理
 * */
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects["authority/userQuery"]
}))
export default class UserManage extends Component {
  constructor(props) {
    super(props);

    this.editableData = {};
    this.submitParams = null; //记录当前查询条件
    this.columns = [
      ...UserManageColumns,
      {
        title: "角色",
        dataIndex: "role",
        width: "20%",
        render: this.roleAction
      },
      {
        title: "操作",
        width: "15%",
        render: this.action
      }
    ];

    this.state = {
      data: [],
      confirmLoading: false,
      visible: false,
      currentRecord: null, //当前分配角色的对象
      resetVisible: false, //是否显示重置密码
      resetTarget: null, //要重置密码的对象
      newRandomKey: "", //重置resetPassword 状态用
      loading: false, //启用，禁止使用的loading
      roleOptionData: [] //分配角色列表数据
    };
  }

  componentDidMount() {
    this.getListData();

    this.getRoleData();
  }

  //获取角色列表信息
  getRoleData() {
    const value = {
      page_no: 1,
      page_size: 999999,
      user_relation: true //是否是用户管理分配角色用用数据
    };
    this.props
      .dispatch({
        type: "authority/roleQuery",
        payload: value
      })
      .then(() => {
        const { relationRoleList } = this.props.authority;
        this.setState({ roleOptionData: relationRoleList });
      });
  }

  //搜索提交查询
  onSubmit = (err, fieldsValue) => {
    if (err) {
      return;
    }
    if (fieldsValue["name"] || fieldsValue["email"]) {
      const value = {
        ...fieldsValue,
        page_no: 1,
        page_size: 10
      };
      this.getListData(value);
    }
  };

  //获取列表数据
  getListData(params) {
    //this.submitParams = params;
    const value = {
      ...this.submitParams,
      ...params,
      page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10
    };
    //console.log("请求参数", value);
    this.props
      .dispatch({
        type: "authority/userQuery",
        payload: value
      })
      .then(() => {
        this.submitParams = value; //保存当前请求参数
        //请求数据完成后更新列表数据
        const { userList } = this.props.authority;
        this.setState({
          data: userList.dataSource
        });
      });
  }

  //翻页
  pagination = pageNumber => {
    //console.log("pageNumber:", pageNumber);
    const params = {
      //...this.submitParams,
      page_no: pageNumber
    };
    this.getListData(params);
  };

  //获取当前操作对象
  _getRowByKey(key, newData) {
    return (newData || this.state.data).filter(item => item.key === key)[0];
  }

  //分配角色
  _distribution = (record, e) => {
    if (e) {
      e.preventDefault();
    }
    const _key = record.key;
    const _newData = this.state.data;
    const _target = this._getRowByKey(_key, _newData);

    //console.log(_target)
    if (_target) {
      //保存原有数据
      if (!_target.editable) {
        this.editableData[_key] = { ..._target };
      }
      _target.editable = !_target.editable;
      this.setState({ data: _newData });
    }
  };

  //取消分配角色操作
  //指针操作....
  _cancel(record, e) {
    e.preventDefault();
    const _key = record.key;
    const _newData = this.state.data;
    const _target = this._getRowByKey(_key, _newData);
    //1、恢复数据
    //2、显示不可编辑状态
    if (this.editableData[_key]) {
      //_target叫目标对象，后面的是源对象。
      //对象合并是指：将源对象里面的属性添加到目标对象中去，若两者的属性名有冲突，后面的将会覆盖前面的
      Object.assign(_target, this.editableData[_key]);
      _target.editable = false;
      delete this.editableData[_key];
    }
    this.setState({ data: _newData });
  }

  //保存分配角色
  _saveRole(record, e) {
    const event = e || window.event;
    event.preventDefault();
    //1.找到当前条
    //2、发送保存请求
    const _key = record.key;
    const _newData = this.state.data;
    const _target = this._getRowByKey(_key, _newData);
    // console.log("_target:", _target);
    if (_target) {
      this.setState({ loading: true });

      const _params = {
        id: _target.id,
        role_list: this._setRoleList(_target.role)
      };
      this.props
        .dispatch({
          type: "authority/userRoleSave",
          payload: _params
        })
        .then(() => {
          this.setState({ loading: false });
          const { actionStatus } = this.props.authority;
          if (actionStatus) {
            message.success("保存成功！");
            //_target 保存了当前操作行的所有数据
            this._distribution(record);
          }
        });
    }
  }

  _setRoleList(data) {
    let _list = [];
    if (data) {
      data.map(value => {
        _list.push({
          code: value
        });
      });
    }
    return _list;
  }

  //编辑角色数据
  _roleChange(record, value) {
    const _key = record.key;
    const _newData = this.state.data;
    const _target = this._getRowByKey(_key, _newData);

    if (_target) {
      _target["role"] = this._getShowText(value, 2);
      this.setState({ data: _newData });
    }
  }

  //禁用启用

  _enabledHandler = (record, e) => {
    e.preventDefault();

    this._getAccountStatus(record);
  };

  //防止快速重复点击处罚请求
  @Debounce(200)
  _getAccountStatus(record) {
    const _enabled = record.enabled; //启用/禁用

    if (_enabled) {
      this.setState({ loading: true });
      //启用
      this.props
        .dispatch({
          type: "authority/accountOpen",
          payload: {
            email: record.account
          }
        })
        .then(() => {
          this.setState({ loading: false });
          const { actionStatus } = this.props.authority;
          //操作成功刷新列表
          if (actionStatus) {
            message.success("启用成功！");
            this.getListData({ ...this.submitParams });
          }
        });
    } else {
      //禁用
      this.setState({
        visible: true,
        currentRecord: record
      });
    }
  }

  handleOk = () => {
    this.setState({ confirmLoading: true });

    //console.log(this.state.currentRecord)
    const _target = this.state.currentRecord;
    if (_target) {
      this.props
        .dispatch({
          type: "authority/accountClose",
          payload: {
            email: _target.account
          }
        })
        .then(() => {
          const { actionStatus } = this.props.authority;
          //操作成功刷新列表
          if (actionStatus) {
            message.success("禁用成功！");
            this.getListData({ ...this.submitParams });
            this.setState({
              confirmLoading: false,
              visible: false,
              currentRecord: null
            });
          }
        });
    }
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  //重置密码
  _resetPassword(record, e) {
    e.preventDefault();
    this._showResetModel(true, record);
  }

  //设置重置密码对象，显示，和重置
  _showResetModel(flag, data) {
    this.setState({
      resetVisible: flag,
      resetTarget: data,
      newRandomKey: data ? Math.random() : ""
    });
  }

  //表格操作
  action = (text, record) => {
    const _enabled = record.enabled; //启用/禁用

    if (record.editable) {
      return (
        <Fragment>
          <a onClick={this._saveRole.bind(this, record)}>保存角色</a>
          <Divider type="vertical" />
          <a onClick={this._cancel.bind(this, record)}>取消</a>
        </Fragment>
      );
    }

    return (
      <Fragment>
        <a
          style={{ color: _enabled ? "" : "#ff0000" }}
          onClick={this._enabledHandler.bind(this, record)}
        >
          {_enabled ? "启用" : "禁用"}
        </a>

        <Divider type="vertical" />

        <a onClick={this._distribution.bind(this, record)}>分配角色</a>

        <Divider type="vertical" />

        <a onClick={this._resetPassword.bind(this, record)}>重置密码</a>
      </Fragment>
    );
  };
  //角色编辑
  roleAction = (text, record) => {
    //dataIndex:'role'
    if (record.editable) {
      return (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          defaultValue={this._getShowText(record.role, 1)}
          onChange={this._roleChange.bind(this, record)}
        >
          {this._getOption(this.state.roleOptionData)}
        </Select>
      );
    }
    return <TooltipItem value={this._getShowText(text)} />;
  };
  //flag传1 则返回key数组
  //flag 2 返回index数组，传给后台用
  _getShowText(data, flag) {
    const _data = this.state.roleOptionData;
    if (!data || !_data) {
      return;
    }
    const _show = [];
    data.map(v => {
      _data.map(value => {
        //多选的特殊性 导致我们用数据的时候和给后台传递的时候都需要转义
        if (v === value.index) {
          _show.push(value.value);
        } else if (flag === 2 && v === value.key) {
          _show.push(value.index);
        }
      });
    });
    return flag && (flag === 1 || flag === 2) ? _show : _show.join("、 ");
  }

  _getOption(data) {
    if (!data) {
      return;
    }
    return data.map((value, index) => {
      return (
        <Option key={index} value={value.key}>
          {value.value}
        </Option>
      );
    });
  }

  //组织架构选择，选择后展示相应的表格数据
  treeSelect = (selectedKeys, info) => {
    //console.log(selectedKeys);
    //department_id//部门id
    const params = {
      department_id: parseInt(selectedKeys)
    };
    this.submitParams = null;
    this.getListData(params);
  };

  render() {
    const { authority, loading } = this.props;
    const { userList } = authority;
    const { page_no, total } = userList;

    return (
      <PageHeaderLayout>
        <Row className={styles.rowBox}>
          <Col span="6">
            <TreeList title="组织架构" onSelect={this.treeSelect} />
          </Col>

          <Col span="18" className={styles.leftBorder}>
            <ContentTitle title="用户管理" />
            <Spin spinning={this.state.loading}>
              <ListQuery
                bordered={false}
                items={searchs}
                columns={this.columns}
                dataSource={this.state.data}
                current={page_no}
                total={total}
                scroll={1300}
                loading={loading}
                pagination={this.pagination}
                onSubmit={this.onSubmit}
              />
            </Spin>
          </Col>
        </Row>

        <ConfirmModal
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          用户禁用将会使
          <span style={{ color: "#ff0000" }}>
            该用户立刻从系统中退出且无法再次登录
          </span>，
          <span style={{ color: "#999" }}>你还要继续吗？</span>
        </ConfirmModal>

        <ResetPassword
          visible={this.state.resetVisible}
          resetTarget={this.state.resetTarget}
          newRandomKey={this.state.newRandomKey}
          showResetModel={this._showResetModel.bind(this)}
        />
      </PageHeaderLayout>
    );
  }
}
