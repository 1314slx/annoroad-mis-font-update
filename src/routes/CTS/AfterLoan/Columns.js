//放款列表数据
export const getLoanListColumns = () => [
  {
    title: "融资号",
    key: "1",
    dataIndex: "applyCode"
  },
  {
    title: "企业名称",
    key: "2",
    dataIndex: "enterpriseName"
  },
  {
    title: "资金渠道",
    key: "3",
    dataIndex: "channelName"
  },
  {
    title: "融资金额(元)",
    key: "4",
    dataIndex: "amount"
  },
  {
    title: "已放款金额(元)",
    key: "5",
    dataIndex: "lendAmount"
  },
  {
    title: "起息日",
    key: "6",
    dataIndex: "valueDate"
  },
  {
    title: "放款完成时间",
    key: "7",
    dataIndex: "lendTime"
  },
  {
    title: "状态",
    key: "8",
    dataIndex: "status"
  }
];

//还款列表数据
export const getRepaymentListColumns = () => [
  {
    title: "融资号",
    key: "1",
    dataIndex: "applyCode"
  },
  {
    title: "企业名称",
    key: "2",
    dataIndex: "enterpriseName"
  },
  {
    title: "资金渠道",
    key: "3",
    dataIndex: "channelName"
  },
  {
    title: "计划还款日期",
    key: "4",
    dataIndex: "planDate"
  },
  {
    title: "还款金额(元)",
    key: "5",
    dataIndex: "amount"
  },
  {
    title: "还款本金(元)",
    key: "6",
    dataIndex: "principle"
  },
  {
    title: "服务费/利息(元)",
    key: "7",
    dataIndex: "interest"
  },
  {
    title: "实际还款日期",
    key: "8",
    dataIndex: "paymentTime"
  },
  {
    title: "状态",
    key: "9",
    dataIndex: "status"
  }
];
