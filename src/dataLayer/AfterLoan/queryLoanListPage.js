import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//融资列表
export const setLoanListData = value => {
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
  const loanList = [];

  data.map((value, index) => {
    loanList.push({
      key: index,
      ...value,
      amount: money.formatMoney(value.amount),
      lendAmount: money.formatMoney(value.lendAmount),
      valueDate: value.valueDate ? times.formatTime(value.valueDate) : "---",
      lendTime: value.lendTime ? times.formatTime(value.lendTime) : "---",
      status: statusFormat.loanStatus(value.status),
      sourceStatus: value.status
    });
  });

  value.body.datas = loanList;

  return value.body;
};
