import request from "../utils/request";
import mock from "../utils/mock";
//数据统计-工具统计-
export async function queryGroup(params) {
  return request("annoroad-cloud-mis-server/stat/tool/find", {
    method: "POST",
    body: params
  });
}

//失败任务-列表
export async function queryFailTask(params) {
  return request("annoroad-cloud-mis-server/task/fail/find", {
    method: "POST",
    body: params
  });
}
///测试任务-列表
export async function queryTaskTestGroup(params) {
  return request("annoroad-cloud-mis-server/task/find", {
    method: "POST",
    body: params
  });
}
//失败任务/测试任务-详情
export async function failTaskDetail(params) {
  /*return request("springboot-ssm-01/hello/failTaskDetail", {*/
    return request("annoroad-cloud-mis-server/task/detail", {
    method: "POST",
    body: params
  });
}

//失败任务/测试任务-详情
export async function toolsManagerDelete(params) {
    return request("annoroad-cloud-mis-server/tool/delete", {
    method: "POST",
    body: params
  });
}


//帮助中心/问题反馈-列表查询
export async function issueBackGroup(params) {
  /*return request("springboot-ssm-01/hello/issueBack", {*/
  return request("annoroad-cloud-mis-server/feedback/find", {
    method: "POST",
    body: params
  });
}
//帮助中心/问题反馈-已读
export async function savaIssueBackGroup(params) {
  /*return request("springboot-ssm-01/hello/issueBack", {*/
  return request("annoroad-cloud-mis-server/feedback/read", {
    method: "POST",
    body: params
  });
}

//仪表盘
export async function dashboardGroup(params) {
  /*return request("springboot-ssm-01/hello/Dashboard", {*/
  return request("annoroad-cloud-mis-server/dashboard/dashboard", {
    //
    method: "POST",
    body: params
  });
}

///应用管理-工具类型列表数据展示-列表
export async function toolsTypeGroup(params) {
  //return request("springboot-ssm-01/hello/toolsType", {
  return request("annoroad-cloud-mis-server/tool/type/list", {
    method: "POST",
    body: params
  });
}
///应用管理-工具类型列表数据展示-保存
export async function savaToolsTypeGroup(params) {
  //return request("springboot-ssm-01/hello/toolsType", {
  return request("annoroad-cloud-mis-server/tool/type/save", {
    method: "POST",
    body: params
  });
}

///应用管理-我的工具数据展示
export async function myToolsGroup(params) {
  /*return request("springboot-ssm-01/hello/versionFind", {*/
  return request("annoroad-cloud-mis-server/tool/version/find", {
    method: "POST",
    body: params
  });
}


///应用管理-我的工具-编辑-获取富文本以外的信息
export async function myToolsToolsGroup(params) {
  /*return request("springboot-ssm-01/hello/versionFind", {*/
  return request("annoroad-cloud-mis-server/tool/version/detail", {
    method: "POST",
    body: params
  });
}


//MIS端-获取所有工具名称->自动完成
export async function queryToolsNameList(params) {
  /*return request("springboot-ssm-01/hello/toolList", {*/
  /*return request("annoroad-cloud-mis-server/task/find", {*/
  return request("annoroad-cloud-mis-server/tool/list", {
    method: "POST",
    body: params
  });
}
//MIS端-测试任务-删除
export async function deleteTask(params) {
  // return mock.deleteTaskInfo();
  return request("annoroad-cloud-mis-server/task/delete", {
    method: "POST",
    body: params
  });
}
//MIS端-审核测试
export async function queryExamineGroup(params) {
  /*return request("springboot-ssm-01/hello/examine", {*/
  return request("annoroad-cloud-mis-server/audit/find", {
    method: "POST",
    body: params
  });
}
//MIS端-工具权限
export async function queryAuthorityGroup(params) {
  return request("annoroad-cloud-mis-server/tool/power/find", {
    method: "POST",
    body: params
  });
}
//MIS端-工具权限
export async function queryExamineToolsNameList(params) {
  return request("annoroad-cloud-mis-server/tool/list", {
    method: "POST",
    body: params
  });
}

//MIS端-工具类型删除
export async function toolsTypeDelete(params) {
  return request("annoroad-cloud-mis-server/tool/type/delete", {
    method: "POST",
    body: params
  });
}

//MIS端-工具类型删除
export async function rejectExamineGroup(params) {
  return request("annoroad-cloud-mis-server/audit/reject", {
    method: "POST",
    body: params
  });
}
//MIS端-审核测试下架
export async function downToolsType(params) {
  return request("annoroad-cloud-mis-server/audit/down", {
    method: "POST",
    body: params
  });
}


// 视频管理-视频类型列表数据
export async function videoTypeGroup(params) {
  //return mock.getVideoTypeGroup();
  return request("annoroad-cloud-mis-server/video/type/list", {
    method: "POST",
    body: params
  });
}
// 视频管理-授权-白名单列表数据
export async function whitelistList(params) {
  //return mock.getwhitelistGroup();
  return request("annoroad-cloud-mis-server/whitelist/find", {
    method: "POST",
    body: params
  });
}

// 视频管理-视频类型-保存
export async function saveVideoTypeGroup(params) {
  return request("annoroad-cloud-mis-server/video/type/save", {
    method: "POST",
    body: params
  });
}


// 通过视频编号删除工具类型
export async function videoTypeDelete(params) {
  return request("annoroad-cloud-mis-server/video/type/delete", {
    method: "POST",
    body: params
  });
}

// 视频列表信息
export async function themeList(params) {
  //return mock.getThemeList();
  return request("annoroad-cloud-mis-server/video/theme/find", {
    method: "POST",
    body: params
  });
}
// 视频列表信息
export async function themeFind(params) {
  //return mock.getThemeList();
  return request("annoroad-cloud-mis-server/video/theme/find", {
    method: "POST",
    body: params
  });
}


// 视频管理-视频列表-白名单导入
export async function importData(params) {
  //return mock.importDataList();
  return request("annoroad-cloud-mis-server/whitelist/import", {
    method: "POST",
    body: params
  });
}

// 视频管理-视频列表-白名单导入
export async function videoGroup(params) {
  return request("annoroad-cloud-mis-server/video/list", {
    method: "POST",
    body: params
  });
}

// 应用中心-工具权限-公开显示
export async function versionOvert(params) {
  // return mock.versionOvert();
  return request("annoroad-cloud-mis-server/tool/power/overt", {
    method: "POST",
    body: params
  });
}

// 应用中心-工具权限-非公开显示
export async function versionClosed(params) {
  console.log("接口参数-params")
  // return mock.versionClosed();
  return request("annoroad-cloud-mis-server/tool/power/closed", {
    method: "POST",
    body: params
  });
}
