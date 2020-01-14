import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";

import { getRepaymentListColumns } from "./Columns";
import Search from "../../../components/Search/index";
import { trim } from "../../../utils/utils";
import styles from "./AfterLoan.less";

@connect(({ afterLoan, loading }) => ({
  afterLoan,
  loading: loading.effects["afterLoan/queryRepaymentListPage"]
}))
export default class RepaymentQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.columns = [...getRepaymentListColumns()];
  }

  //封装列表请求接口
  packageList(param) {
    const params = {
      pageNo: param && param.pageNo ? param.pageNo : 1,
      pageSize: 10,
      ...param
    };

    this.props.dispatch({
      type: "afterLoan/queryRepaymentListPage",
      payload: params
    });
  }

  componentDidMount() {
    this.packageList();
  }

  componentWillUnmount() {}

  //翻页快速跳转到哪
  onChange = pageNumber => {
    this.packageList(pageNumber);
  };

  //查询
  handleSubmit = (err, value) => {
    if (err) {
      return;
    }
    this.packageList({
      status: value && value.status ? [value.status] : [],
      enterpriseName: trim(
        value && value.enterpriseName ? value.enterpriseName : ""
      ),
      planStartDate:
        value && value.dateTime ? value.dateTime[1]._d.valueOf() : "",
      planEndDate:
        value && value.dateTime ? value.dateTime[0]._d.valueOf() : "",
      applyCode: trim(value && value.applyCode ? value.applyCode : "")
    });
  };

  render() {
    const { afterLoan, loading } = this.props;
    const { repaymentListData } = afterLoan;
    const { datas, pageNo, total } = repaymentListData;
    // 1：未确认，2：待还款确认，3：已还款，4：逾期未还，5：逾期已还，6：还款确认中，7：还款失败
    const itemSearch = [
      {
        type: "Select",
        label: "还款状态",
        required: false,
        placeholder: "请选择",
        parameter: "status",
        options: [
          {
            key: 1,
            value: "未确认"
          },
          {
            key: 2,
            value: "待还款确认"
          },
          {
            key: 3,
            value: "已还款"
          },
          {
            key: 4,
            value: "逾期未还"
          },
          {
            key: 5,
            value: "逾期已还"
          },
          {
            key: 6,
            value: "还款确认中"
          },
          {
            key: 7,
            value: "还款失败"
          }
        ]
      },
      {
        type: "Input",
        label: "企业名称",
        required: false,
        placeholder: "请输入",
        parameter: "enterpriseName"
      },
      {
        type: "RangePicker",
        label: "计划还款日期",
        required: false,
        placeholder: "请输入",
        parameter: "dataTime"
      },
      {
        type: "Input",
        label: "融资号",
        required: false,
        placeholder: "请输入",
        parameter: "applyCode"
      }
    ];

    return (
      <Card title="" loading={loading}>
        <Search items={itemSearch} onSubmit={this.handleSubmit} />
        <Table
          loading={loading}
          columns={this.columns}
          dataSource={datas}
          size="middle"
          scroll={{ x: 1500 }}
          pagination={false}
        />
        <Row type="flex" justify="end" className={styles.paginationBox}>
          <Pagination
            showQuickJumper
            onChange={this.onChange}
            defaultCurrent={pageNo}
            total={total}
          />
        </Row>
      </Card>
    );
  }
}
