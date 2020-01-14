//授信管理列表
export const getCreditColumns = () => [
  {
    title: "集团ID",
    key: "1",
    dataIndex: "group_no"
  },
  {
    title: "集团名称",
    key: "2",
    dataIndex: "name"
  },
  {
    title: "集团负责人",
    key: "3",
    dataIndex: "principal_name"
  },
  {
    title: "负责人手机",
    key: "4",
    dataIndex: "principal_mobile"
  },
  {
    title: "剩余额度",
    key: "5",
    dataIndex: "surplus_limit"
  },
  {
    title: "敞口额度",
    key: "6",
    dataIndex: "all_limit"
  },
  {
    title: "授信期限",
    key: "7",
    dataIndex: "credit_term",
    render: (text, record) => {
      return (
        <span>
          {record.start_time}
          <br /> {record.end_time}
        </span>
      );
    }
  },
  {
    title: "业务负责人",
    key: "8",
    dataIndex: "work_people",
    render: (text, record) => {
      return record.operation.map((value, index) => (
        <span key={index}>{value.name} </span>
      ));
    }
  }
];

//授信申请列表
export const getCreditApplyColumns = () => [
  {
    title: "集团ID",
    key: "1",
    dataIndex: "group_no"
  },
  {
    title: "集团名称",
    key: "2",
    dataIndex: "name"
  },
  {
    title: "集团负责人",
    key: "3",
    dataIndex: "principal_name"
  },
  {
    title: "负责人手机",
    key: "4",
    dataIndex: "principal_mobile"
  },
  {
    title: "申请授信额度",
    key: "5",
    dataIndex: "all_limit"
  },
  {
    title: "申请授信期限",
    key: "6",
    dataIndex: "credit_term",
    render: (text, record) => {
      return (
        <span>
          {record.start_time}
          <br /> {record.end_time}
        </span>
      );
    }
  },
  {
    title: "业务负责人",
    key: "7",
    dataIndex: "work_people",
    render: (text, record) => {
      return record.operation.map((value, index) => (
        <span key={index}>{value.name} </span>
      ));
    }
  },
  {
    title: "状态",
    key: "8",
    dataIndex: "credit_status",
    render: (text, record) => {
      return <span title={record.reject_reason}>{record.status}</span>;
    }
  }
];

//授信审核列表
export const getCreditAuditingColumns = () => [
  {
    title: "授信ID",
    key: "1",
    dataIndex: "group_no"
  },
  {
    title: "集团名称",
    key: "2",
    dataIndex: "name"
  },
  {
    title: "集团负责人",
    key: "3",
    dataIndex: "principal_name"
  },
  {
    title: "负责人手机",
    key: "4",
    dataIndex: "principal_mobile"
  },
  {
    title: "申请授信额度",
    key: "5",
    dataIndex: "all_limit"
  },
  {
    title: "申请授信期限",
    key: "6",
    dataIndex: "credit_term",
    render: (text, record) => {
      return (
        <span>
          {record.start_time}
          <br /> {record.end_time}
        </span>
      );
    }
  },
  {
    title: "业务负责人",
    key: "7",
    dataIndex: "work_people",
    render: (text, record) => {
      return record.operation.map((value, index) => (
        <span key={index}>{value.name} </span>
      ));
    }
  },
  {
    title: "状态",
    key: "8",
    dataIndex: "credit_status",
    render: (text, record) => {
      return <span title={record.reject_reason}>{record.status}</span>;
    }
  }
];
