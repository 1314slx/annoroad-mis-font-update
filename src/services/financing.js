import request from "../utils/request";
// import mock from "../utils/mock";
//融资列表
export async function getQueryApply(params) {
  return request("/cts/mdlapi/cts/financing/apply/list", {
    method: "POST",
    body: params
  });
  // return mock.getQueryApply();
}

//企业信息详情
export async function getQueryEnterpriseInfo(params) {
  return request("/cts/mdlapi/cts/financing/enterprise/detail", {
    method: "POST",
    body: params
  });
  // return mock.getQueryEnterpriseInfo();
}

//融资申请提交
export async function getApplySubmit(params) {
  return request("/cts/mdlapi/cts/financing/apply/submit", {
    method: "POST",
    body: params
  });
  // return mock.getApplySubmit();
}

//融资渠道列表
export async function getChannelList(params) {
  return request("/cts/mdlapi/cts/financing/channel/list", {
    method: "POST",
    body: params
  });
  // return mock.getChannelList();
}

//融资审核列表
export async function getAuditingList(params) {
  return request("/cts/mdlapi/cts/financing/audit/list", {
    method: "POST",
    body: params
  });
  // return mock.getAuditingList();
}

//融资申请详情
export async function getApplyDetail(params) {
  return request("/cts/mdlapi/cts/financing/apply/detail", {
    method: "POST",
    body: params
  });
  // return mock.getApplyDetail();
}

//融资审核通过
export async function getApplyPass(params) {
  return request("/cts/mdlapi/cts/financing/apply/pass", {
    method: "POST",
    body: params
  });
  // return mock.getApplyPass();
}

//融资审核驳回
export async function getApplyReject(params) {
  return request("/cts/mdlapi/cts/financing/apply/reject", {
    method: "POST",
    body: params
  });
  // return mock.getApplyReject();
}
