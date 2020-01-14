import request from "../utils/request";

//企业账号列表查询
export async function queryAccount(params) {
  return request("/prm/mdlapi/prm/account/query", {
    method: "POST",
    body: params
  });
}

//企业账号创建
export async function createAccout(params) {
  return request("/prm/mdlapi/prm/account/create", {
    method: "POST",
    body: params
  });
}

//企业账号开启
export async function openAccout(params) {
  return request("/prm/mdlapi/prm/account/on", {
    method: "POST",
    body: params
  });
}

//企业账号关闭
export async function closeAccout(params) {
  return request("/prm/mdlapi/prm/account/off", {
    method: "POST",
    body: params
  });
}
