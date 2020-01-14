import request from "../utils/request";
// import mock from '../utils/mock';

//授信列表查询
export async function getQueryCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/query", {
    method: "POST",
    body: params
  });
  // return mock.getQueryCredit();
}

//授信信息详情查询
export async function getInfoDetailCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/detail", {
    method: "POST",
    body: params
  });
  // return mock.getInfoDetailCredit();
}

//授信保存
export async function getSaveCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/save", {
    method: "POST",
    body: params
  });
  // return mock.getSaveCredit();
}

//授信提交
export async function getSubmitCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/submit", {
    method: "POST",
    body: params
  });
  // return mock.getSubmitCredit();
}

//授信审核列表查询
export async function getRmAuditingList(params) {
  return request("/rm/mdlapi/rm/credit_extension/audit/query", {
    method: "POST",
    body: params
  });
  // return mock.getRmAuditingList();
}

//授信历史文件查询
export async function getHistoryCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/history/detail", {
    method: "POST",
    body: params
  });
  // return mock.getHistoryCredit();
}

//授信审核通过
export async function getPassCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/pass", {
    method: "POST",
    body: params
  });
  // return mock.getPassCredit();
}

//授信审核驳回
export async function getRejectCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/reject", {
    method: "POST",
    body: params
  });
  // return mock.getRejectCredit();
}

//授信申请列表查询
export async function getApplyListCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/query", {
    method: "POST",
    body: params
  });
  // return mock.getApplyListCredit();
}

//授信信息附件更新
export async function getUpDataCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/detail/updata", {
    method: "POST",
    body: params
  });
  // return mock.getUpDataCredit();
}

//授信申请详情查询
export async function getApplyDetailCredit(params) {
  return request("/rm/mdlapi/rm/credit_extension/apply/detail", {
    method: "POST",
    body: params
  });
  // return mock.getApplyDetailCredit();
}
