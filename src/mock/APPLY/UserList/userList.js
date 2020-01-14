import { dataCheck, nullData, timestampToTime } from "../../../utils/utils";
import { check } from "../../utils";
//我的任务列表数据
export const userListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        userId: value.id, //'用户id',*/
        loginName: dataCheck(value, "loginName"), //'用户名称',
        mobile: dataCheck(value, "mobile"), //'用户手机号',
        email: dataCheck(value, "email"), //'用户邮箱',
        createTime: dataCheck(value, "createTime"), //'用户注册时间',
        emailAuth: dataCheck(value, "emailAuth") //'邮箱验证',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};
