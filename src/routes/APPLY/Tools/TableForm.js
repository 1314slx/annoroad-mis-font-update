import React, { PureComponent, Fragment } from "react";
import { Table, Button, Input, message, Popconfirm, Divider, Modal, Icon, Tooltip } from "antd";
import { routerRedux } from "dva/router";
import styles from "./style.less";
import ConfirmModal from "components/ConfirmModal";
import { trim, trimNum } from "../../../utils/utils";
import { connect } from "dva";
import  moment from 'moment';
import { CHECK_INTEGER } from "../../../utils/pattern";

/**
 * 工具类型-列表
 */
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/toolsTypeGroup"]
}))
export default class TableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};

  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      visible: false,
      visible1: false,
      currentRecord: null,
      trimNum: false
    };
    this.tips = ["工具类型不存在","工具数量不为零","工具类型已被删除","工具类型已存在"]
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      this.setState({
        data: nextProps.value
      });
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

  newMember = () => {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    newData.push({
      key: `NEW_TEMP_ID_${this.index}`,
      sort: "100", //排序
      name: "", //工具名称
      updateTime: "", //操作时间
      count: "", //工具数量
      updateBy: "", //操作人
      editable: true,
      isNew: true
    });
    this.index += 1;
    this.setState({ data: newData });
  };

//添加无保存时对应删除
  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  //删除数据确认
  _deleteConfirm(record) {
    if(record.count>0){
      this.setState({
        visible1: true,
        currentRecord: record
      });
    }else{
      this.setState({
        visible: true,
        currentRecord: record
      });
    }
  }
  //删除取消
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false
    });
  };

  //删除确定
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    const _data = this.state.currentRecord;
    const _code = _data ? _data.code : false;
    if (_code) {
      this.props
        .dispatch({
          type: "toolsType/toolsTypeDelete",
          payload: {code: _code}
        })
        .then(() => {
          const { actionStatusDelete,actionStatusCode } = this.props.toolsType;
          if(actionStatusDelete && actionStatusCode ==0) {
            message.success("操作成功！");
            // 刷新页面
            if(this.props.refresh){
              this.props.refresh();
            }
          }else{
            message.error(this.tips[actionStatusCode-1]);
          }
          this.setState({
            confirmLoading: false,
            visible: false,
            currentRecord: null
          });
        });
    }
  };

  handleKeyPress(e, key) {
    const target = this.getRowByKey(key);
    target.sort = target.sort;
    if (e.key === "Enter") {
      if (target.sort > 100 || target.sort < 1) {
        message.error("只能输入1-100的正整数。");
        return;
      }
      this.saveRow(e, key);
    }
  }
  //每一行的改变
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true
    });
    setTimeout(() => {
      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      target.name = trim(target.name);
      if(!CHECK_INTEGER.test(target.sort)){
        message.error("排序只能输入1-100的正整数。");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      if(trimNum(target.sort) != false){
        target.sort = trimNum(target.sort);
      }else{
        message.error("排序只能输入1-100的正整数。");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      if (this.state.trimNum==false && target.sort > 100 || target.sort < 1) {
        /*//校验用户输入是否信息完整*/
        message.error("排序只能输入1-100的正整数。");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      if (target.name.length==null || target.name.length >20 || target.name.length < 1) {
        /*//校验用户输入是否信息完整*/
        message.error("类型名称只能输入1-20个字符");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      if (!target.sort || !target.name) {
        /*//校验用户输入是否信息完整*/
        message.error("请填写完整信息。");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      const { dispatch } = this.props;
      const params = {
        code: target.code == undefined?null : target.code,
        sort: target.sort,
        name: target.name,
        parentCode: "single",//工具single流程pipeline,添加时必传
        /*  pageNo: 1,
        pageSize: 15*/
      };
      dispatch({
        type: "toolsType/savaToolsTypeGroup",
        payload: params
      }).then(() => {
        const { actionStatus ,_statusCodeSave} = this.props.toolsType;
        if (actionStatus) {
          message.success("保存成功！");
          if(this.props.refresh){
            this.props.refresh();
          }
        }else if(_statusCodeSave==1){
          message.error("工具类型不存在！");
        }else if(_statusCodeSave==2){
          message.error("工具类型已存在！");
        }
      });
      delete target.isNew;
      this.toggleEditable(e, key);
      this.setState({
        loading: false
      });
    }, 500);
  }

  cancel(e, key) {
    this.clickedCancel = true;
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (this.cacheOriginData[key]) {
      Object.assign(target, this.cacheOriginData[key]);
      target.editable = false;
      delete this.cacheOriginData[key];
    }
    this.setState({ data: newData });
    this.clickedCancel = false;
  }

  render() {
    const columns = [
      {
        title: "排序",
        dataIndex: "sort",
        key: "sort",
        width: "20%",
        render: (text, record) => {
          {
            /* <InputNumber
                value={text}
                autoFocus
                min={1} max={100}
                defaultValue={100}
                onChange={e => this.handleFieldChange(e, 'sort', record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
              />*/
          }
          if (record.editable) {
            return (
              <Input
                value={text}
                min={1}
                max={100}
                defaultValue={100}
                autoFocus
                onChange={e => this.handleFieldChange(e, "sort", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
              />
            );
          }
          return record.sort;
        }
      },
      {
        title: "类型名称",
        dataIndex: "name",
        key: "name",
        width: "22%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "name", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
               /* maxLength={20}*/
              />
            );
          }
          // return record.name;
          return<Tooltip title={record.name}>
            <span className={styles.tooltipSpan} >{record.name}</span>
          </Tooltip>

        }
      },
      {
        title: "工具数",
        dataIndex: "count",
        key: "count",
        width: "16%",

      },
      {
        title: "操作人",
        dataIndex: "updateBy",
        key: "updateBy",
        width: "14%",

      },
      {
        title: "操作时间",
        dataIndex: "updateTime",
        key: "updateTime",
        width: "18%",
        render: (text, record) => {
          if (record.updateTime) {
            return <span>{record.updateTime?moment(record.updateTime).format('YYYY-MM-DD HH:mm'):"-"}</span>
            // return <span>121212</span>
          }
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                   <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                    <a>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                <a onClick={e => this.cancel(e, record.key)}>取消</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
               <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
            </span>
          );
        }
      }
    ];
    const { loading, data } = this.state;
    return (
      <Fragment>
        <Table
          className={styles.textLeft}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => record.editable ? styles.editable : ""}
        />
        <Button
          style={{ width: "100%", marginTop: 16, marginBottom: 8 }}
          type="dashed"
          onClick={this.newMember}
          icon="plus"
        >
          新增工具类型
        </Button>
        <ConfirmModal
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <span style={{ color: "#ff0000" }}>
            该操作为删除工具类型
          </span>，
          <span style={{ color: "#999" }}>你确定还要继续吗？</span>
        </ConfirmModal>
        <Modal
          visible={this.state.visible1}
          title=""
          /* onOk={this.handleOk}*/
          onCancel={this.handleCancel}
          style={{ top: 190 }}
          footer={[
            <Button type="primary" key="back" onClick={this.handleCancel}>知道了</Button>
          ]}
        >
          <p style={{fontWeight:'650'}}><Icon type="close-circle" theme="filled" style={{ color: '#ff0000',fontSize:'18px',marginRight:'12px' }} />删除失败</p>
          <p style={{paddingLeft:'30px'}}>已有工具关联，无法进行删除操作</p>
        </Modal>
      </Fragment>
    );
  }
}
