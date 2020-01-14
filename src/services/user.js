import request from "../utils/request";

export async function query() {
  return request("/api/users");
}

export async function queryCurrent() {
  return request("/api/currentUser");
}

//项目管理列表查询
export async function queryGroup(params) {
  return request("annoroad-cloud-mis-server/user/find", {
    method: "POST",
    body: params
  });
}

/**
 * 获取用户信息
 */
export async function getUserDetail() {
  return request("/annoroad-cloud-mis-server/user/loginuser/detail", {
    method: "POST"
  });
}
