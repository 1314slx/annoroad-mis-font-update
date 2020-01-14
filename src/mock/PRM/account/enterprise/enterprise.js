import { dataCheck, nullData } from "../../../../utils/utils";
import { getAccountType } from "../../../../utils/options";
//企业账号管理列表数据
export const businessAccountData = data => {
  //console.log('企业账号管理列表数据', data);
  const _body = dataCheck(data, "body");
  const _data = _body ? dataCheck(_body, "datas") : false;

  let _groupData = [];

  if (_data) {
    _data.map((value, index) => {
      const group_name = dataCheck(value, "group_name");
      const enterprise_name = dataCheck(value, "enterprise_name");
      const type = dataCheck(value, "type");
      const _status = dataCheck(value, "status");

      _groupData.push({
        key: index,
        accountId: dataCheck(value, "no"), //'ID',
        businessName: type === 1 ? group_name : enterprise_name, //'集团名称/企业名称',
        category: getType(type), //'类别',
        userName: dataCheck(value, "user_name"), // '客户名',
        loginPhone: dataCheck(value, "login_mobile"), //'登录手机号',
        status: _status === 1 ? true : false //开启状态
      });
    });

    data.body.dataSource = _groupData;
  }
  return _body && _data ? data.body : nullData();
};

//获取账号列表  企业/集团
function getType(data) {
  let _type = "";
  getAccountType.map(value => {
    if (value.key === data) {
      _type = value.value;
    }
  });

  return _type;
}
