//授信管理查询列表数据
export const getContractColumns = () => [
  {
    title: "集团ID",
    key: "1",
    dataIndex: "group_id"
  },
  {
    title: "集团名称",
    key: "2",
    dataIndex: "group_name"
  },
  {
    title: "集团负责人",
    key: "3",
    dataIndex: "group_principal_name"
  },
  {
    title: "负责人手机",
    key: "4",
    dataIndex: "group_principal_mobile"
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
    dataIndex: "operation_principal"
    // render: (text, record) => {
    //   return (
    //     record.operation_principal.map((value, index) => (
    //       <span key={index}>{value.name} </span>
    //     )))
    // },
  },
  {
    title: "状态",
    key: "9",
    dataIndex: "agreement_status",
    render: (text, record) => {
      return <span title={record.reason}>{record.agreement_status}</span>;
    }
  }
];
