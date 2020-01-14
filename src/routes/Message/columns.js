import React from "react";
import TooltipItem from "components/TooltipItem";
//签名管理列表数据
export const signatureColumns = [
  {
    title: "申请时间",
    dataIndex: "time",
    key: "time"
  },
  {
    title: "签名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age"
  },
  {
    title: "签名状态",
    dataIndex: "status",
    key: "status",
    render: (text, record) =>
      record.action ? <TooltipItem status={text} value={record.reason} /> : text
  }
];

//模板管理列表数据
export const templateColumns = [
  {
    title: "模板ID",
    dataIndex: "id",
    key: "id",
    width: "10%"
  },
  {
    title: "申请时间",
    dataIndex: "time",
    key: "time",
    width: "15%"
  },
  {
    title: "短信类型",
    dataIndex: "typeText",
    key: "typeText",
    width: "10%"
  },
  {
    title: "短信内容",
    dataIndex: "content",
    key: "content",
    width: "25%",
    render: text => <TooltipItem value={text} maxLength={18} />
  },
  {
    title: "备注",
    dataIndex: "remarks",
    key: "remarks",
    width: "15%",
    render: text => <TooltipItem value={text} maxLength={10} />
  },
  {
    title: "审核状态",
    dataIndex: "status",
    key: "status",
    width: "10%",
    render: (text, record) =>
      record.action ? <TooltipItem status={text} value={record.reason} /> : text
  }
];

//日志管理
export const journalCloumns = [
  {
    title: "发送时间",
    dataIndex: "time",
    key: "time",
    width: "20%"
  },
  {
    title: "发送状态",
    dataIndex: "sendStatus",
    key: "sendStatus",
    width: "10%",
    render: (text, record) =>
      !record.sendOut ? (
        <TooltipItem status={text} value={record.sendReason} />
      ) : (
        text
      )
  },
  {
    title: "短信内容",
    dataIndex: "content",
    key: "content",
    width: "40%",
    render: text => <TooltipItem value={text} maxLength={25} />
  },
  {
    title: "手机号",
    dataIndex: "phone",
    key: "phone",
    width: "10%"
  },
  {
    title: "接收状态",
    dataIndex: "receiveStatus",
    key: "receiveStatus",
    width: "10%",
    render: (text, record) =>
      record.action ? (
        <TooltipItem status={text} value={record.receiveReason} />
      ) : (
        text
      )
  },
  {
    title: "计费条数",
    dataIndex: "number",
    key: "number",
    width: "10%"
  }
];
