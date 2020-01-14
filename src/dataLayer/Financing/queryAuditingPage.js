import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//融资列表
export const setAuditingListData = value => {
  const data =
    value && value.body && value.body !== "" ? value.body.datas : false;
  if (!data) {
    return {
      body: {
        datas: []
      }
    };
  }
  //列表数据
  const auditingList = [];

  data.map((value, index) => {
    auditingList.push({
      key: index,
      ...value,
      amount: money.formatMoney(value.amount),
      repaymentMode: statusFormat.repayStatus(value.repaymentMode),
      status: statusFormat.auditingStatus(value.status),
      sourceStatus: value.status
    });
  });

  value.body.datas = auditingList;

  return value.body;
};
