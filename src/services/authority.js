import request from "../utils/request";

//用户信息列表查询
export async function userQuery(params) {
  return request("/boss/mdlapi/boss/user/query", {
    method: "POST",
    body: params
  });
}

//boss账号启用
export async function accountOpen(params) {
  return request("/boss/mdlapi/boss/account/open", {
    method: "POST",
    body: params
  });
}

//boss账号禁用
export async function accountClose(params) {
  return request("/boss/mdlapi/boss/account/close", {
    method: "POST",
    body: params
  });
}

//谁在线上
export async function onlineQuery(params) {
  return request("/boss/mdlapi/boss/user/online/query", {
    method: "POST",
    body: params
  });
}

//全员下线
export async function queryLogout() {
  return request("/boss/mdlapi/boss/user/list/logout", {
    method: "POST",
    body: {}
  });
}

//禁止登录
export async function platformLoginClose() {
  return request("/boss/mdlapi/boss/platform/login/close", {
    method: "POST",
    body: {}
  });
}

//允许登录
export async function platformLoginOpen() {
  return request("/boss/mdlapi/boss/platform/login/open", {
    method: "POST",
    body: {}
  });
}

//角色列表查询
export async function roleQuery(params) {
  return request("/boss/mdlapi/boss/role/query", {
    method: "POST",
    body: params
  });
}

//角色删除
export async function roleDelete(params) {
  return request("/boss/mdlapi/boss/role/delete", {
    method: "POST",
    body: params
  });
}

//密码重置
export async function pwdSave(params) {
  return request("/boss/mdlapi/boss/user/pwd/save", {
    method: "POST",
    body: params
  });
}

//用户角色关联关系保存
export async function userRoleSave(params) {
  return request("/boss/mdlapi/boss/user/role/save", {
    method: "POST",
    body: params
  });
}

//部门(组织架构)查询
export async function departmentList(params) {
  return request("/boss/mdlapi/boss/department/list", {
    method: "POST",
    body: params
  });
}

//平台模块信息查询
export async function platformModuleList(params) {
  return request("/boss/mdlapi/boss/platform/module/list", {
    method: "POST",
    body: params
  });
}

//角色信息保存
export async function roleSave(params) {
  return request("/boss/mdlapi/boss/role/save", {
    method: "POST",
    body: params
  });
}

//角色模块信息查询 15
export async function roleModuleQuery(params) {
  return request("/boss/mdlapi/boss/role/module/query", {
    method: "POST",
    body: params
  });
}
