import request from "../utils/request";

//企业列表查询
export async function queryEnterprise(params) {
  return request("/prm/mdlapi/prm/enterprise/query", {
    method: "POST",
    body: params
  });
}

//企业信息保存
export async function saveEnterprise(params) {
  return request("/prm/mdlapi/prm/enterprise/save", {
    method: "POST",
    body: params
  });
}

//企业信息提审
export async function submitEnterprise(params) {
  return request("/prm/mdlapi/prm/enterprise/apply/submit", {
    method: "POST",
    body: params
  });
}

//企业审核通过
export async function passExamine(params) {
  return request("/prm/mdlapi/prm/enterprise/apply/pass", {
    method: "POST",
    body: params
  });
}

//企业审核驳回
export async function rejectExamine(params) {
  return request("/prm/mdlapi/prm/enterprise/apply/reject", {
    method: "POST",
    body: params
  });
}

//企业详情查询
export async function enterpriseDetail(params) {
  return request("/prm/mdlapi/prm/enterprise/detail", {
    method: "POST",
    body: params
  });
}

//集团列表查询
export async function queryGroup(params) {
  return request("/prm/mdlapi/prm/group/query", {
    method: "POST",
    body: params
  });
}

//集团信息保存
export async function saveGroup(params) {
  return request("/prm/mdlapi/prm/group/save", {
    method: "POST",
    body: params
  });
}

//集团详情查询
export async function groupDetail(params) {
  return request("/prm/mdlapi/prm/group/detail", {
    method: "POST",
    body: params
  });
}

//员工列表查询
export async function staffList(params) {
  return request("/prm/mdlapi/prm/staff/query", {
    method: "POST",
    body: params
  });
}

//企业列表查询
export async function enterpriseList() {
  return request("/prm/mdlapi/prm/enterprise/list", {
    method: "POST",
    body: {}
  });
}
