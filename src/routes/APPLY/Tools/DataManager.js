import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";

/**
 * 应用市场-我的任务
 * */
@connect(({ dataManager, loading }) => ({
  dataManager
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class DataManager extends Component {
  render() {
    return <PageHeaderLayout>应用市场/数据管理</PageHeaderLayout>;
  }
}
