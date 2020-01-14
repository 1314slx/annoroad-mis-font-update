import request from "../utils/request";
//部署测试-deployTest-列表数据获取
export async function queryGroup(params) {
  /*return request("springboot-ssm-01/hello/deployTest", {*/
  return request("annoroad-cloud-mis-server/deploy/find", {
    method: "POST",
    body: params
  });
}

//应用管理/工具管理-列表查询
export async function toolsManagerGroup(params) {
  /*return request("springboot-ssm-01/hello/toolsManager", {*/
  return request("annoroad-cloud-mis-server/tool/find", {
    method: "POST",
    body: params
  });
}

//我的工具获取所有组织人结构
export async function toolsChargeGroup(params) {
  /*return request("springboot-ssm-01/hello/toolsChargePerson", {*/
    return request("annoroad-cloud-mis-server/tool/principal/structure", {
    method: "POST",
    body: params
  });
}

//工具管理-提交
export async function saveToolsManager(params) {
  return request("springboot-ssm-01/hello/toolSave", {
    method: "POST",
    body: params
  });
}

//工具管理-提交
export async function newToolsManagerSubmit(params) {
  return request("annoroad-cloud-mis-server/tool/save", {
    method: "POST",
    body: params
  });
}
//部署测试-驳回操作
export async function rejectDeployTest(params) {
  return request("annoroad-cloud-mis-server/deploy/reject", {
    method: "POST",
    body: params
  });
}
//部署测试-提交审核操作
export async function submitDeployTest(params) {
  return request("annoroad-cloud-mis-server/tool/version/nextstep", {
    method: "POST",
    body: params
  });
}

//
