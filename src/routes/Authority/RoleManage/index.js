import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Divider, message } from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import ContentTitle from "components/ContentTitle";
import ConfirmModal from "components/ConfirmModal";
import TooltipItem from "components/TooltipItem";

import { RoleManageColumns } from "../columns";
import { setItem } from "../../../utils/utils";

const searchs = [
  {
    type: "Input",
    label: "角色名称",
    required: false,
    placeholder: "请输入",
    parameter: "name"
  }
];
/**
 * 角色管理
 * */
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects["authority/roleQuery"]
}))
export default class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.submitParams = null; //记录当前查询条件

    this.columns = [
      ...RoleManageColumns,
      {
        title: "描述",
        dataIndex: "describe",
        key: "describe",
        width: "55%",
        render: text => <TooltipItem value={text} maxLength={30} />
      },
      {
        title: "操作",
        dataIndex: "handle",
        key: "handle",
        width: "15%",
        render: this.action
      }
    ];

    this.state = {
      confirmLoading: false,
      visible: false,
      currentRecord: null
    };
  }

  componentDidMount() {
    this.getListData();
  }

  //搜索提交查询
  onSubmit = (err, value) => {
    if (err) {
      return;
    }
    if (value["name"]) {
      //this.submitParams = value;
      const params = {
        ...value,
        page_no: 1,
        page_size: 10
      };
      this.getListData(params);
    }
  };

  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10
    };
    this.submitParams = value; //保存当前请求参数
    this.props.dispatch({
      type: "authority/roleQuery",
      payload: value
    });
  }

  //翻页
  pagination = pageNumber => {
    const params = {
      ...this.submitParams,
      page_no: pageNumber
    };
    this.getListData(params);
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    const _data = this.state.currentRecord;
    const _code = _data ? _data.code : false;

    if (_code) {
      const _params = {
        code: _code
      };
      this.props
        .dispatch({
          type: "authority/roleDelete",
          payload: _params
        })
        .then(() => {
          const { actionStatus } = this.props.authority;
          if (actionStatus) {
            message.success("操作成功！");
            this.setState({
              confirmLoading: false,
              visible: false,
              currentRecord: null
            });
            this.getListData({ ...this.submitParams });
          }
        });
    }
  };

  //删除确认
  _deleteConfirm(record) {
    this.setState({
      visible: true,
      currentRecord: record
    });
  }

  //编辑按钮
  _editHandler(record) {
    //console.log('编辑：', record);
    setItem("editRole", JSON.stringify(record));

    this.props.dispatch(routerRedux.push("/userauthority/new-role"));
  }

  //列表操作按钮
  action = (text, record) => {
    return (
      <Fragment>
        <a onClick={this._editHandler.bind(this, record)}>编辑</a>

        <Divider type="vertical" />

        <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
      </Fragment>
    );
  };

  render() {
    const { authority, loading } = this.props;
    const { roleList } = authority;
    const { page_no, total } = roleList;

    return (
      <PageHeaderLayout>
        <ContentTitle title="角色权限管理" />
        <ListQuery
          bordered={false}
          items={searchs}
          columns={this.columns}
          dataSource={roleList ? roleList.dataSource : []}
          current={page_no}
          total={total}
          loading={loading}
          link="/userauthority/new-role"
          linkName="新建角色"
          pagination={this.pagination}
          onSubmit={this.onSubmit}
        />

        <ConfirmModal
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          删除角色将会使
          <span style={{ color: "#ff0000" }}>
            与该角色关联的用户失去对应的权限
          </span>，
          <span style={{ color: "#999" }}>你还要继续吗？</span>
        </ConfirmModal>
      </PageHeaderLayout>
    );
  }
}
