import { dataCheck, nullData } from "../../../../utils/utils";
import { showRisk, check } from "../../utils";
import {
  getIndustry,
  getClientProperty,
  getBusinessStatus,
  getCorporationIdCardType
} from "../../../../utils/options";
//企业管理列表数据
export const businessData = data => {
  //console.log('企业管理列表数据', data)

  const _data = check(data);

  let _businessData = [];

  if (_data) {
    _data.map((value, index) => {
      _businessData.push({
        key: index,
        businessId: dataCheck(value, "no"), //'企业ID',
        businessName: dataCheck(value, "name"), //'企业名称',

        industry: getValue("industry_type", dataCheck(value, "industry_type")), //'行业',
        attribute: getValue("property_type", dataCheck(value, "property_type")), //'客户属性',
        status: getValue("status", dataCheck(value, "status")), //'审核驳回',

        representative: dataCheck(value, "corporation_name"), // '法人代表',
        repPhone: dataCheck(value, "corporation_mobile"), //'法人代表手机号',
        riskCharge: showRisk(dataCheck(value, "risk_control")), //'风控负责人',
        showReason: getStatus(dataCheck(value, "status")), //是否显示驳回原因  状态是驳回的时候显示
        reason: dataCheck(value, "reject_reason") //'驳回原因'
      });
    });

    data.body.dataSource = _businessData;
  }

  return _data ? data.body : nullData();
};

//企业详情查询
export const getEntDetail = data => {
  //console.log('企业详情查询', data);
  //修改查询企业详情不需要做参数转义
  const _body = dataCheck(data.response, "body");

  if (_body) {
    if (!data.flag) {
      _body.industry_type = getValue("industry_type", _body.industry_type);
      _body.project_type = getValue("industry_type", _body.project_type);
      _body.property_type = getValue("industry_type", _body.property_type);
      _body.corporation_idcard_type = getValue(
        "corporation_idcard_type",
        _body.corporation_idcard_type
      );
    }

    return _body;
  }
  return false;
};

//对数据转义
function getValue(params, data) {
  let _value = "";
  const _data = getData(params);
  _data.map(value => {
    if (value.key == data) {
      _value = value.value;
    }
  });
  return _value;
}

function getData(value) {
  switch (value) {
    case "property_type":
      return getClientProperty;
    case "industry_type":
      return getIndustry;
    case "status":
      return getBusinessStatus;
    case "corporation_idcard_type":
      return getCorporationIdCardType;
  }
}

//状态是驳回的时候返回true
function getStatus(value) {
  if (value == 3) {
    return true;
  }
  return false;
}
