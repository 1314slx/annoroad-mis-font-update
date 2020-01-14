import request from "../utils/request";
// import mock from "../utils/mock";
//放款列表
export async function getQueryLoanList(params) {
  return request("/cts/mdlapi/cts/loan/list", {
    method: "POST",
    body: params
  });
  // return mock.getQueryLoanList();
}

//还款列表
export async function getQueryRepaymentList(params) {
  return request("/cts/mdlapi/cts/repayment/list", {
    method: "POST",
    body: params
  });
  // return mock.getQueryRepaymentList();
}
