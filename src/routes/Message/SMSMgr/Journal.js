import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ContentTitle from "components/ContentTitle";
import ListQuery from "components/ListQuery";
import { journalCloumns } from "../columns";
import { getJournalData } from "../../../mock/Message/SMSMgr/journal";
import { timestamp } from "../../../utils/utils";

const searchs = [
  {
    type: "RangePicker",
    label: "发送时间",
    required: false,
    placeholder: "请输入",
    parameter: "time"
  },
  {
    type: "Input",
    label: "手机号",
    required: false,
    placeholder: "请输入",
    parameter: "phone"
  },
  {
    type: "Select",
    label: "接收状态",
    required: false,
    parameter: "status",
    placeholder: "请选择",
    options: [{ key: 1, value: "成功" }]
  }
];

/**
 *日志管理
 * */
@connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class Journal extends Component {
  constructor(props) {
    super(props);
    this.columns = [...journalCloumns];
  }

  pagination = pageNum => {
    console.log(pageNum);
  };

  //搜索提交
  onSubmit = (err, fieldsValue) => {
    if (err) {
      return;
    }
    const _time = fieldsValue["time"];
    const _startTime = _time
      ? _time[0].format("YYYY-MM-DD") + " 00:00:00"
      : undefined;
    const _endTime = _time
      ? _time[1].format("YYYY-MM-DD") + " 00:00:00"
      : undefined;

    const value = {
      ...fieldsValue,
      time: "",
      startTime: timestamp(_startTime),
      endTime: timestamp(_endTime)
    };

    if (_time || fieldsValue["phone"] || fieldsValue["status"]) {
      console.log(value);
    }
  };

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout>
        <ContentTitle title="日志管理" />

        <ListQuery
          bordered={false}
          columns={this.columns}
          items={searchs}
          scroll={1200}
          dataSource={getJournalData()}
          current={1}
          total={50}
          loading={loading}
          pagination={this.pagination}
          onSubmit={this.onSubmit}
        />
      </PageHeaderLayout>
    );
  }
}
