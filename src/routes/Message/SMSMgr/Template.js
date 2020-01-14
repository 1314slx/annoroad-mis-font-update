import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ContentTitle from "components/ContentTitle";
import ListQuery from "components/ListQuery";
import { templateColumns } from "../columns";
import { getTemplateData } from "../../../mock/Message/SMSMgr/template";
import { setItem } from "../../../utils/utils";

const searchs = [
  {
    type: "Input",
    label: "模板ID",
    required: false,
    placeholder: "请输入",
    parameter: "status"
  },
  {
    type: "Input",
    label: "关键字",
    required: false,
    placeholder: "请输入短信内容关键字",
    parameter: "statused"
  }
];
/**
 * 模板管理
 * */
@connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class Template extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      ...templateColumns,
      {
        title: "操作",
        width: "5%",
        render: this._handler
      }
    ];
  }

  pagination = pageNum => {};

  onSubmit = (err, value) => {
    if (err) {
      return;
    }

    console.log(value);
  };

  //编辑模板
  _editTemplate = (record, e) => {
    e.preventDefault();
    setItem("template", JSON.stringify(record));
    this.props.dispatch(routerRedux.push("/message/sms-mgr/new-template"));
  };

  //操作
  _handler = (text, record) => {
    if (record.action) {
      return <a onClick={this._editTemplate.bind(this, record)}>编辑</a>;
    }
    return <span style={{ color: "#999" }}>编辑</span>;
  };

  render() {
    const { loading } = this.props;

    return (
      <PageHeaderLayout>
        <ContentTitle title="模板管理">
          因运营商要求，短信模板内容需审核，人工审核会在30分钟内操作，请耐心等待。
        </ContentTitle>
        {/*routes/Message/SMSMgr/NewTemplate*/}
        <ListQuery
          bordered={false}
          link="/message/sms-mgr/new-template"
          columns={this.columns}
          linkName="新增模板"
          items={searchs}
          scroll={1200}
          dataSource={getTemplateData()}
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
