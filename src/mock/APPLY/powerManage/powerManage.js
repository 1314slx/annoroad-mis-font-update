import { check, checkRole, checkNavTree } from "../../utils";
import { dataCheck, nullData, timestampToTime, isArray } from "../../../utils/utils";

//权限管理-角色管理-列表数据展示
export const roleManageListData = data => {
  const _data = check(data);

  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'用户ID',
        name: dataCheck(value, "name"), //'用户名称',
        userCount: dataCheck(value, "userCount"), //'用户数量',
        remarks: dataCheck(value, "remarks"), //'描述',
        updateByName: dataCheck(value, "updateByName"), //'操作人',
        updateTime: dataCheck(value, "updateTime") //'操作时间',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//权限管理-成员管理-列表数据展示
export const peopleManageListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        userId: dataCheck(value, "userId"), //'用户ID',
        loginName: dataCheck(value, "loginName"), //'用户名称',
        userName: dataCheck(value, "name"), //'用户姓名',
        email: dataCheck(value, "email"), //'用户邮箱',
        job: dataCheck(value, "job"), //'用户职位',
        department: dataCheck(value, "department"), //'部门',
        //roles: dataCheck(value, "roles") //'角色',
        roles: getRole(value.roles) //'角色',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};
function getRole(data) {
  let _list = [];
  if (data) {
    data.map(value => {
      _list.push(value.code);
    });
  }
  return _list;
}

//权限管理-j角色管理-搜索-所有角色
export const saveRoleListData = data => {
  const _data = checkRole(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'用户ID',
        name: dataCheck(value, "name"), //'用户名称',
        remarks: dataCheck(value, "remarks") //'备注',
      });
    });
    data.data.roleListDataSource = _groupData;
  }
  //console.log('汇报',data.data);
  return _data ? data.data : nullData();
};
//权限管理-j角色管理-角色编辑 根据code获取角色导航
export const saveRolesNavData = data => {
  const _data = dataCheck(data,"data");
/*  let _groupData = null;
  _groupData = _data ? _data : "";
  data.data._groupData = _groupData;*/
  return _data;
};
//权限管理-j角色管理-获取整个导航/菜单
export const saveMenuNavData = data => {
  const _data = checkNavTree(data);
  let _groupData = null;
  _groupData = _data ? _data : "";
  data.data._groupData = _groupData;
  return _data ? data.data : nullData();
};
