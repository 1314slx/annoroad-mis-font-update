import request from "../utils/request";

/*export async function fakeAccountLogin(params) {
  return request('/api/login/account', {
    method: 'POST',
    body: params,
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}*/

//C端账号密码登录
export async function login(params) {
  /*return request('/boss/mdlapi/boss/login/email', {*/
  return request("/annoroad-sso/user/login/byname", {
    method: "POST",
    body: params
  });
}

//钉钉扫码登录
export async function loginDingDing(params) {
  return request("/boss/mdlapi/boss/login/dingding", {
    method: "POST",
    body: params
  });
}

//用户信息查询
export async function userDetail() {
  return request("/boss/mdlapi/boss/user/detail", {
    method: "POST",
    body: {}
  });
}

//集团列表查询
export async function groupList() {
  return request("/prm/mdlapi/prm/group/list", {
    method: "POST",
    body: {}
  });
}
//企业列表查询
export async function enterpriseList() {
  return request("/prm/mdlapi/prm/enterprise/list", {
    method: "POST",
    body: {}
  });
}

/*MIS端后台仪表盘dashboard-工具使用次数*/
export async function fakeChartData() {
  return request("/api/fake_chart_data");
}
