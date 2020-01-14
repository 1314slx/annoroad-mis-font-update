import request from "../utils/request";
// import mock from "../utils/mock";

//协议列表查询
export async function getQueryContract(params) {
  return request("/rm/mdlapi/rm/protocol/list", {
    method: "POST",
    body: params
  });
  // return mock.getQueryContract();
}

//协议详情查询
export async function getDetailContract(params) {
  return request("/rm/mdlapi/rm/protocol/detail", {
    method: "POST",
    body: params
  });
  // return mock.getDetailContract();
}

//协议保存
export async function getSaveContract(params) {
  return request("/rm/mdlapi/rm/protocol/save", {
    method: "POST",
    body: params
  });
  // return mock.getSaveContract();
}

//协议提审
export async function getSubmitContract(params) {
  return request("/rm/mdlapi/rm/protocol/submit", {
    method: "POST",
    body: params
  });
  // return mock.getSubmitContract();
}

//协议审核通过
export async function getPassContract(params) {
  return request("/rm/mdlapi/rm/protocol/pass", {
    method: "POST",
    body: params
  });
  // return mock.getPassContract();
}

//协议审核驳回
export async function getRejectContract(params) {
  return request("/rm/mdlapi/rm/protocol/reject", {
    method: "POST",
    body: params
  });
  // return mock.getRejectContract();
}
