import request from "../utils/request";

//项目管理列表查询
export async function roleManageList(params) {
  /*return request("springboot-ssm-01/hello/roleManage", {*/
  return request("annoroad-cloud-mis-server/role/find", {
    method: "POST", //此处可以注释，因为全项目都是POST， 然后在request的65行写 method: options.method || "POST",
    body: params
  });
}

//成员管理列表查询
export async function queryPeopleGroup(params) {
  /*return request("springboot-ssm-01/hello/peopleManage", {*/
  return request("annoroad-cloud-mis-server/member/find", {
    method: "POST",
    body: params
  });
}

//权限管理-搜索框获取所有的角色
export async function roleList(params) {
  return request("annoroad-cloud-mis-server/role/list", {
    method: "POST",
    body: params
  });
}

//权限管理-角色编辑 根据code获取角色导航
export async function roleNavList(params) {
  //return request("springboot-ssm-01/hello/roleNav", {
  return request("annoroad-cloud-mis-server/role/nav", {
    method: "POST",
    body: params
  });
}

//权限管理-角色编辑 根据code获取角色导航
export async function menuNavList(params) {
  /*return request("springboot-ssm-01/hello/MenuNav", {*/
  return request("annoroad-cloud-mis-server/nav", {
    method: "POST",
    body: params
  });
}
//权限管理-角色编辑 删除角色
export async function roleDelete(params) {
  return request("annoroad-cloud-mis-server/role/delete", {
    method: "POST",
    body: params
  });
}

//角色信息保存
export async function roleSave(params) {
  return request("annoroad-cloud-mis-server/role/save", {
    method: "POST",
    body: params
  });
}

export async function saveUserRole(params){
  return request("annoroad-cloud-mis-server/member/role/assign", {
    method: "POST",
    body: params
  });
}
