import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//协议列表查询
export const setContractData = value => {
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
  const contract = [];

  data.map((value, index) => {
    contract.push({
      key: index,
      group_id: value.group_id,
      group_name: value.group_name,
      change_id: value.change_id,
      group_principal_name: value.group_principal_name,
      group_principal_mobile: value.group_principal_mobile,
      surplus_limit: money.formatMoney(value.surplus_limit),
      all_limit: money.formatMoney(value.all_limit),
      source_all_limit: value.all_limit,
      start_time: value.start_time ? times.formatTime(value.start_time) : "--",
      end_time: value.end_time ? times.formatTime(value.end_time) : "--",
      operation_principal: value.operation_principal,
      agreement_status: statusFormat.contractListStatus(value.agreement_status),
      source_status: value.agreement_status,
      reason: value.reason
    });
  });

  value.body.datas = contract;

  return value.body;
};
