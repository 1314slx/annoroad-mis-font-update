import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//融资列表
export const setRepaymentListData = value => {
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
  const repaymentList = [];

  data.map((value, index) => {
    repaymentList.push({
      key: index,
      ...value,
      planDate: value.planDate ? times.formatTime(value.planDate) : "---",
      paymentTime: value.paymentTime
        ? times.formatTime(value.paymentTime)
        : "---",
      amount: money.formatMoney(value.amount),
      principle: money.formatMoney(value.principle),
      interest: money.formatMoney(value.interest + value.fee),
      status: statusFormat.repaymentStatus(value.status),
      sourceStatus: value.status
    });
  });

  value.body.datas = repaymentList;

  return value.body;
};
