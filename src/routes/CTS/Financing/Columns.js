//融资申请列表数据
export const getApplyListColumns = () => [
  {
    title: "企业ID",
    key: "1",
    dataIndex: "enterpriseId"
  },
  {
    title: "企业名称",
    key: "2",
    dataIndex: "enterpriseName"
  },
  {
    title: "行业",
    key: "3",
    dataIndex: "industry"
  },
  {
    title: "客户属性",
    key: "4",
    dataIndex: "customerProperty"
  },
  {
    title: "法人代表",
    key: "5",
    dataIndex: "corporation"
  },
  {
    title: "剩余额度/敞口额度",
    key: "6",
    dataIndex: "money",
    render: (text, record) => {
      return (
        <span>
          {record.restAmount}
          <br /> {record.creditAmount}
        </span>
      );
    }
  },
  {
    title: "授信期限",
    key: "7",
    dataIndex: "credit_term",
    render: (text, record) => {
      return (
        <span>
          {record.creditStart}
          <br /> {record.creditEnd}
        </span>
      );
    }
  }
];

//融资申请列表数据
export const getAuditingListColumns = () => [
  {
    title: "融资号",
    key: "1",
    dataIndex: "code"
  },
  {
    title: "企业名称",
    key: "2",
    dataIndex: "enterpriseName"
  },
  {
    title: "融资金额（元）",
    key: "3",
    dataIndex: "amount"
  },
  {
    title: "融资渠道",
    key: "4",
    dataIndex: "channelName"
  },
  {
    title: "还款方式",
    key: "5",
    dataIndex: "repaymentMode"
  },
  {
    title: "状态",
    key: "6",
    dataIndex: "status",
    render: (text, record) => {
      return <span title={record.reason}>{record.status}</span>;
    }
  }
];
