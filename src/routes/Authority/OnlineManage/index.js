import React, { Component } from "react";
import { connect } from "dva";
import { Divider, Popconfirm, message, Spin } from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import ContentTitle from "components/ContentTitle";
import { OnlineManageColumns } from "../columns";
import Debounce from "lodash-decorators/debounce";
import ConfirmModal from "components/ConfirmModal";

/**
 * 谁在线上
 * */
@connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects["authority/onlineQuery"]
}))
export default class OnlineManage extends Component {
  constructor(props) {
    super(props);
    this.columns = [...OnlineManageColumns];

    this.state = {
      loginStatus: false,
      confirmLoading: false,
      visible: false,
      loading: false
    };
  }

  componentDidMount() {
    this._getListData();
  }

  //获取列表数据
  _getListData(value) {
    const params = {
      page_no: value ? value.page_no : 1,
      page_size: 10
    };
    this.props
      .dispatch({
        type: "authority/onlineQuery",
        payload: params
      })
      .then(() => {
        const { onlineList } = this.props.authority;
        const { loginStatus } = onlineList;
        this.setState({
          loginStatus: !loginStatus //1开启，
        });
      });
  }

  //翻页
  pagination = pageNumber => {
    const params = {
      page_no: pageNumber
    };
    this._getListData(params);
  };
  //全部下线
  rollsOff = () => {
    console.log("全部下线");
    this.setState({ visible: true });
  };

  //确认全员下线
  handleOk = () => {
    this.setState({ confirmLoading: true });

    this.props
      .dispatch({
        type: "authority/queryLogout"
      })
      .then(() => {
        const { actionStatus } = this.props.authority;
        if (actionStatus) {
          message.success("操作成功！");
          this.setState({
            confirmLoading: false,
            visible: false
          });
        }
      });
  };

  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  //禁止登录  开启登录

  loginHandler = () => {
    this._handler();
  };

  @Debounce(600)
  _handler() {
    console.log("禁止登录  开启登录");
    this.setState({ loading: true });

    let _url = "";
    if (!this.state.loginStatus) {
      //禁止
      _url = "platformLoginClose";
    } else {
      //开启
      _url = "platformLoginOpen";
    }
    this.props
      .dispatch({
        type: `authority/${_url}`
      })
      .then(() => {
        const { actionStatus } = this.props.authority;
        if (actionStatus) {
          message.success("操作成功！");
          this.setState({
            loginStatus: !this.state.loginStatus,
            loading: false
          });
        }
      });
  }

  render() {
    const { authority, loading } = this.props;
    const { onlineList } = authority;
    const { page_no, total } = onlineList;
    const { loginStatus } = this.state;
    const _color = loginStatus ? "#1890FF" : "#FF0000";
    const _name = loginStatus ? "开启登录" : "禁止登录";

    return (
      <PageHeaderLayout>
        <Spin spinning={this.state.loading}>
          <ContentTitle title="谁在线上">
            当前在线人数：<b>{total}</b> 人 &nbsp;&nbsp;
            <a onClick={this.rollsOff}>全部下线</a>
            <Divider type="vertical" />
            <Popconfirm
              title={`确认${_name}?`}
              onConfirm={this.loginHandler}
              okText="Yes"
              cancelText="No"
            >
              <a style={{ color: _color }}>{_name}</a>
            </Popconfirm>
          </ContentTitle>

          <ListQuery
            bordered={false}
            columns={this.columns}
            dataSource={onlineList ? onlineList.dataSource : []}
            current={page_no}
            total={total}
            loading={loading}
            pagination={this.pagination}
          />

          <ConfirmModal
            visible={this.state.visible}
            onOk={this.handleOk}
            confirmLoading={this.state.confirmLoading}
            onCancel={this.handleCancel}
          >
            全部下线将会使
            <span style={{ color: "#ff0000" }}>
              当前所有在线人员立刻退出系统
            </span>，
            <span style={{ color: "#999" }}>你还要继续吗？</span>
          </ConfirmModal>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
