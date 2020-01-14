import { dataCheck, nullData } from "../../../../utils/utils";
import { showRisk, check } from "../../utils";
//集团管理列表数据
export const groupListData = data => {
  //console.log('集团管理列表数据', data);
  const _data = check(data);

  let _groupData = [];

  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        groupId: dataCheck(value, "no"), //'集团ID',
        groupName: dataCheck(value, "name"), //'企业名称',
        groupCharge: dataCheck(value, "principal_name"), //'集团负责人',
        chargePhone: dataCheck(value, "principal_mobile"), //'负责人手机号',
        riskCharge: showRisk(dataCheck(value, "risk_control")) //'风控负责人',
      });
    });

    data.body.dataSource = _groupData;
  }
  return _data ? data.body : nullData();
};

//企业员工
export const staffListData = data => {
  //console.log(data);
  let _list = [];
  const _data = check(data);
  if (_data) {
    _data.map(value => {
      _list.push({
        key: value.name,
        value: value.name,
        index: value.id
      });
    });
  }
  return _list;
};

//集团详情查询
export const getGroupDetail = data => {
  const _data = dataCheck(data, "body");
  if (_data) {
    _data.operation_show = getListArr(_data.operation); //业务负责人
    _data.operation_review_show = getListArr(_data.operation_review); //业务复核人
    _data.risk_control_show = getListArr(_data.risk_control); //风控负责人
    _data.enterprise_show = getListArr(_data.enterprise); //关联企业
    _data.risk_control_review_show = getListArr(_data.risk_control_review); //风控复核人
    _data.enterprise_list = setEnterprise(_data.enterprise); //历史企业信息push到原来的企业信息里边，因为关联过的企业查不出来了
  }

  //console.log(_data)

  return _data ? _data : [];
};

export const getList = data => {
  //console.log('获取信息：', data);
  const _body = dataCheck(data, "body");
  const _data = _body ? dataCheck(_body, "datas") : false;

  let _list = [];
  if (_data) {
    _data.map(value => {
      _list.push({
        key: value.no,
        value: value.name
      });
    });
  }
  return _list;
};

function getListArr(data) {
  let _list = [];
  if (data) {
    data.map((value, index) => {
      _list.push(value.name);
    });
  }
  return _list;
}

//对企业数据转义，各种不一样
function setEnterprise(value) {
  if (value) {
    value.map(value => {
      value.index = value.no;
      value.value = value.name;
      value.key = value.name;
    });
  }
  return value;
}
