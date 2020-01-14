import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Divider, Tooltip } from "antd";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import { setItem, removeItem } from "../../../../utils/utils";
import { businessColumns } from "../columns";
import ListQuery from "components/ListQuery/index";
import { getBusinessStatus } from "../../../../utils/options";

const searchs = [
  {
    type: "Select",
    label: "企业状态",
    required: false,
    placeholder: "请选择",
    parameter: "status",
    options: getBusinessStatus
  },
  {
    type: "Input",
    label: "企业名称",
    required: false,
    placeholder: "请输入",
    parameter: "name"
  }
];

/**
 * 企业管理查询列表
 * */
@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects["customer/queryEnterprise"]
}))
export default class BusinessManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false
    };

    this.columns = [
      ...businessColumns,
      {
        title: "状态",
        dataIndex: "status",
        key: "status",
        render: this.renderStatus
      },
      {
        title: "操作",
        dataIndex: "action",
        key: "action",
        render: this.renderAction
      }
    ];
  }

  componentDidMount() {
    //挂载完成请求列表数据
    this.getListData();
  }

  componentWillUnmount() {}

  //提交查询方法
  onSubmit = (err, value) => {
    if (err) {
      return;
    }

    //请求数据二选一必传，否则不执行数据请求
    if (value.status || value.name || value.status === 0) {
      const values = {
        ...value,
        page_no: 1,
        page_size: 10
      };

      this.getListData(values);
    }
  };

  //获取列表数据
  getListData(params) {
    console.log("5555")
    const value = {
      ...params,
      page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10
    };
    //console.log('请求参数', value);
    this.props.dispatch({
      type: "customer/queryEnterprise",
      payload: value
    });
  }

  //翻页
  pagination = pageNumber => {
    console.log(pageNumber);
    const params = {
      page_no: pageNumber
    };
    this.getListData(params);
  };

  //到列表详情页去
  goEnterpriseInfo = (value, record, e) => {
    e.preventDefault();

    const { dispatch } = this.props;
    const _action = this.getAction(value);
    const params = {
      ...record,
      examineOrLook: _action.flag
    };
    //存到sessionStorage
    setItem("examineOrLook", JSON.stringify(params));

    dispatch(routerRedux.push(_action.url));
  };

  ///判断当前操作
  getAction(value) {
    let _flag = false;
    let _url = "/customer/enterprise-info";
    switch (value) {
      case "examine":
        _flag = true;
        break;
      case "modify":
        _flag = "modify";
        _url = "/customer/new-enterprise";
        break;
    }
    return {
      flag: _flag,
      url: _url
    };
  }

  //审核状态判断  如果是驳回状态 提示驳回原因
  renderStatus = (text, record) => {
    if (record.showReason) {
      return (
        <Tooltip title={record.reason}>
          <a style={{ color: "#f04134" }}>{text}</a>
        </Tooltip>
      );
    }
    return text;
  };

  //渲染操作按钮
  renderAction = (text, record) => {
    return (
      <Fragment>
        <a onClick={this.goEnterpriseInfo.bind(this, "look", record)}>查看</a>

        <Divider type="vertical" />

        <a onClick={this.goEnterpriseInfo.bind(this, "examine", record)}>
          审核
        </a>

        <Divider type="vertical" />

        <a onClick={this.goEnterpriseInfo.bind(this, "modify", record)}>修改</a>
      </Fragment>
    );
  };

  render() {
    const { customer, loading } = this.props;
    const { businessData } = customer;

    const { page_no, total, dataSource } = businessData;

    return (
      <PageHeaderLayout>
        <ListQuery
          items={searchs}
          columns={this.columns}
          dataSource={dataSource}
          current={page_no}
          total={total}
          loading={loading}
          link="/customer/new-enterprise"
          onSubmit={this.onSubmit}
          pagination={this.pagination}
        />
      </PageHeaderLayout>
    );
  }
}
