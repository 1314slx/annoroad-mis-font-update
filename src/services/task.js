import request from "../utils/request";
import mock from "../utils/mock";

// 提交任务
export async function submitTask(params) {
  return request("annoroad-cloud-mis-server/task/submit", {
    method: "POST",
    body: params
  });
}

// 提交任务-工具介绍信息
export async function queryToolDetailList(params) {
  // return mock.queryToolDetailList();
   return request("/annoroad-cloud-mis-server/tool/version/detail", {
     method: "POST",
     body: params
   });
}
// 提交任务-参数说明 or 结果说明
export async function queryExplainList(params) {
  return request("/annoroad-cloud-mis-server/tool/version/richtext/detail", {
    method: "POST",
    body: params
  });
}
// 应用中心-分析工具-获取工具-工具查询-tool/version/find
export async function queryToolList(params) {
  return request("annoroad-cloud-mis-server/analysis/tool/find", {
    method: "POST",
    body: params
  });
}
// 应用中心-分析工具导航-工具类型
export async function queryToolsMenuList(params) {
  return request("annoroad-cloud-mis-server/analysis/tool/type/list", {
    //tool/type/list
    method: "POST",
    body: params
  });
}
//应用中心-分析工具-获取已上架所有工具名
export async function queryToolsNameList(params) {
  return request("annoroad-cloud-mis-server/analysis/tool/list", {
    method: "POST",
    body: params
  });
}
