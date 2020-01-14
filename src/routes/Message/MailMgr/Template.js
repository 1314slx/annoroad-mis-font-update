import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

/**
 * 邮件模板管理
 * */
@connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class Template extends Component {
  render() {
    return <PageHeaderLayout>邮件模板管理</PageHeaderLayout>;
  }
}
