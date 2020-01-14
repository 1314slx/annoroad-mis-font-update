import { check } from "../../utils";
import { nullData } from "../../../utils/utils";

/**
 * 谁在线上
 * */
export const getOnlineData = data => {
  console.log("谁在线上", data);
  const _data = check(data);

  let _list = [];
  if (_data) {
    _data.map((value, index) => {
      _list.push({
        key: index,
        id: value.id, //数据id
        name: value.name, //姓名
        branch: getBranch(value.department_list), //部门
        position: value.position, //职位
        roleName: getRole(value.role_list) //角色
      });
    });
    data.body.dataSource = _list;
  }
  return _data ? data.body : nullData();
};

//获取部门
function getBranch(data) {
  return data ? data.join("，") : "";
}

//获取角色
function getRole(data) {
  //console.log(data)
  let _list = [];
  if (data) {
    data.map(value => {
      _list.push(value.name);
    });
  }
  return _list.join("，");
}
