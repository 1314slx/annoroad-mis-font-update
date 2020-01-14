import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";

import { getLoanListColumns } from "./Columns";
import Search from "../../../components/Search/index";
import { trim } from "../../../utils/utils";
import styles from "./AfterLoan.less";

@connect(({ afterLoan, loading }) => ({
  afterLoan,
  loading: loading.effects["afterLoan/queryLoanListPage"]
}))
export default class LoanQuery extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.columns = [...getLoanListColumns()];
  }

  //封装列表请求接口
  packageList(param) {
    const params = {
      pageNo: param && param.pageNo ? param.pageNo : 1,
      pageSize: 10,
      ...param
    };

    this.props.dispatch({
      type: "afterLoan/queryLoanListPage",
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
      valueStartDate:
        value && value.dateTime ? value.dateTime[0]._d.valueOf() : "",
      valueEndDate:
        value && value.dateTime ? value.dateTime[1]._d.valueOf() : "",
      applyCode: trim(value && value.applyCode ? value.applyCode : "")
    });
  };

  render() {
    const { afterLoan, loading } = this.props;
    const { loanListData } = afterLoan;
    const { datas, pageNo, total } = loanListData;
    const itemSearch = [
      {
        type: "Select",
        label: "产品状态",
        required: false,
        placeholder: "请选择",
        parameter: "status",
        options: [
          {
            key: 1,
            value: "放款中"
          },
          {
            key: 2,
            value: "放款完成"
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
        label: "起息日期",
        required: false,
        placeholder: "请输入",
        parameter: "dateTime"
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
