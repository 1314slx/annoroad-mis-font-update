import times from "../../utils/time";
import money from "../../utils/money";
import statusFormat from "../../utils/status";

//融资列表
export const setApplyListData = value => {
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
  const applyList = [];

  data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      industry: statusFormat.industryStatus(value.industry),
      sourceIndustry: value.industry,
      customerProperty: statusFormat.customerPropertyStatus(
        value.customerProperty
      ),
      sourceCustomerProperty: value.customerProperty,
      creditAmount: money.formatMoney(value.creditAmount),
      restAmount: money.formatMoney(value.restAmount),
      creditStart: value.creditStart
        ? times.formatTime(value.creditStart)
        : "---",
      creditEnd: value.creditEnd ? times.formatTime(value.creditEnd) : "---"
    });
  });

  value.body.datas = applyList;

  return value.body;
};
