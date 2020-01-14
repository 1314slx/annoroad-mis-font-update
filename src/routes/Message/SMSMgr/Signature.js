import React, { Component } from "react";
import { connect } from "dva";
import {} from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ContentTitle from "components/ContentTitle";
import ListQuery from "components/ListQuery";
import NewSignature from "./NewSignature";
import { signatureColumns } from "../columns";
import { getSignatureData } from "../../../mock/Message/SMSMgr/signature";

const searchs = [
  {
    type: "Input",
    label: "签名",
    required: false,
    placeholder: "请输入",
    parameter: "status"
  }
];
/**
 * 签名管理
 * */
@connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class Signature extends Component {
  constructor(props) {
    super(props);
    this.columns = [
      ...signatureColumns,
      {
        title: "操作",
        render: this._handler
      }
    ];

    this.state = {
      newRandomKey: "",
      visible: false,
      signatureData: null
    };
  }

  componentDidMount() {}

  pagination = pageNum => {};

  onSubmit = (err, value) => {
    alert("1233");
  };

  //编辑操作，显示签名编辑弹窗
  _editHandler = (record, e) => {
    let _data = null;
    if (e) {
      e.preventDefault();
      _data = record;
    }
    this._setModel(true, Math.random(), _data);
  };

  _setModel = (flag, random, data) => {
    this.setState({
      newRandomKey: random ? random : "",
      visible: flag,
      signatureData: data
    });
  };

  //操作
  _handler = (text, record) => {
    /* console.log(record);*/
    if (record.action) {
      return <a onClick={this._editHandler.bind(this, record)}>编辑</a>;
    }
    return <span style={{ color: "#999" }}>删除</span>;
  };

  render() {
    const { smsMgr, loading } = this.props;
    return (
      <PageHeaderLayout>
        {/* <ContentTitle title="签名管理">
          签名显示在短信内容的最前面，显示这条短信来自哪家公司/产品/网站。因运营商要求，签名需经过审核，审核时间约30分钟。
        </ContentTitle>*/}

        <ListQuery
          bordered={false}
          linkName="新增签名1212"
          items={searchs}
          columns={this.columns}
          dataSource={getSignatureData()}
          current={1}
          total={50}
          loading={loading}
          onClick={this._editHandler}
          pagination={this.pagination}
          onSubmit={this.onSubmit}
        />

        <NewSignature
          visible={this.state.visible}
          data={this.state.signatureData}
          newRandomKey={this.state.newRandomKey}
          setModel={this._setModel}
        />
      </PageHeaderLayout>
    );
  }
}
