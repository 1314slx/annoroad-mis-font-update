/**********************信贷交易管理系统**********************/
function industryStatus(status) {
  switch (status) {
    case 1:
      return "行业";
    case 2:
      return "酒店";
    case 3:
      return "餐饮";
    default:
      return "---";
  }
}

function customerPropertyStatus(status) {
  switch (status) {
    case 1:
      return "机构";
    case 2:
      return "个体户";
    case 3:
      return "自然人";
    default:
      return "---";
  }
}

function idCardStatus(status) {
  switch (status) {
    case 1:
      return "身份证";
    case 2:
      return "护照";
    case 3:
      return "台胞证";
    case 4:
      return "港澳证";
    default:
      return "---";
  }
}

function repayStatus(status) {
  switch (status) {
    case 1:
      return "一次性还本付息";
    case 2:
      return "按月分期";
    case 3:
      return "按周分期";
    default:
      return "---";
  }
}

function auditingStatus(status) {
  switch (status) {
    case 30:
      return "待审核";
    case 90:
      return "审核通过";
    case 20:
      return "驳回";
    default:
      return "---";
  }
}

function purposeStatus(status) {
  switch (status) {
    case 1:
      return "采购";
    case 2:
      return "房租";
    case 3:
      return "新店开支";
    default:
      return "---";
  }
}

function loanStatus(status) {
  switch (status) {
    case 1:
      return "放款中";
    case 2:
      return "放款完成";
    default:
      return "---";
  }
}

function repaymentStatus(status) {
  switch (status) {
    case 1:
      return "未确认";
    case 2:
      return "待还款确认";
    case 3:
      return "已还款";
    case 4:
      return "逾期未还";
    case 5:
      return "逾期已还";
    case 6:
      return "还款确认中";
    case 7:
      return "还款失败";
    default:
      return "---";
  }
}

function creditApplyListStatus(status) {
  switch (status) {
    case 1:
      return "草稿";
    case 2:
      return "待审核";
    case 3:
      return "审核通过";
    case 4:
      return "审核驳回";
    default:
      return "---";
  }
}

function contractListStatus(status) {
  switch (status) {
    case 1:
      return "待签署协议";
    case 2:
      return "提交审核";
    case 3:
      return "审核通过";
    case 4:
      return "审核驳回";
    case 5:
      return "审核中";
    default:
      return "---";
  }
}

export default {
  //信贷交易管理系统
  industryStatus,
  customerPropertyStatus,
  idCardStatus,
  repayStatus,
  auditingStatus,
  purposeStatus,
  loanStatus,
  repaymentStatus,
  //风险控制系统
  creditApplyListStatus,
  contractListStatus
};
