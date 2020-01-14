import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//设置查询授信管理列表数据
export const setAuditingListCreditData = value => {
  const data =
    value && value.body && value.body !== "" ? value.body.datas : false;
  // console.log(data);
  if (!data) {
    return {
      body: {
        datas: []
      }
    };
  }
  //列表数据
  const credit = [];

  data.map((value, index) => {
    credit.push({
      key: index,
      change_id: value.change_id,
      group_no: value.group_no,
      name: value.name,
      principal_name: value.principal_name,
      principal_mobile: value.principal_mobile,
      surplus_limit:
        value.surplus_limit && money.formatMoney(value.surplus_limit),
      all_limit: value.all_limit && money.formatMoney(value.all_limit),
      start_time: value.start_time && times.formatTime(value.start_time),
      end_time: value.end_time && times.formatTime(value.end_time),
      operation: value.operation,
      reject_reason: value.reject_reason,
      status: statusFormat.creditApplyListStatus(value.status),
      source_status: value.status
    });
  });

  value.body.datas = credit;
  return value.body;
};
