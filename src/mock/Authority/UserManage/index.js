import { check } from "../../utils";
import { nullData } from "../../../utils/utils";

/**
 * 用户管理数据处理
 * */
export const getUserData = data => {
  console.log("用户管理数据处理", data);
  const _data = check(data);

  let _list = [];
  if (_data) {
    _data.map((value, index) => {
      _list.push({
        key: index,
        id: value.id, //数据id
        name: value.name, //姓名
        account: value.email, //账户
        branch: getBranch(value.department_list), //部门
        position: value.position, //职位
        role: getRole(value.role_list), //角色
        enabled: value.status !== 1 ? true : false //账号状态 (1:启用 2：禁用)true启用 / false禁用
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
      _list.push(value.code);
    });
  }
  return _list;
}

/**
 * 角色分类数据
 * */
export const roleOptionData = data => {
  console.log("角色分类数据", data);

  const _data = check(data);
  let _list = [];
  if (_data) {
    _data.map(value => {
      _list.push({
        index: value.code,
        key: value.name,
        value: value.name
      });
    });
  }

  return _list;
};

/**
 * 部门信息数据处理
 * */

export const departmentData = data => {
  console.log("部门信息:", data);
  const _data = check(data);
  let _list = [];
  if (_data) {
    _data.map(value => {
      _list.push({
        parent_id: value.parent_id,
        id: value.id, //查子节点的时候用id
        key: value.id,
        name: value.name,
        isLeaf: value.leaf === 1 ? true : false //返回false是叶子节点
      });
    });
  }

  return _list;
};
