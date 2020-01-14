/********************************风险管理系统********************************/
//授信列表查询
function getQueryCredit() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      page_no: 1,
      page_size: 20,
      page_total: 10,
      total: 100,
      datas: [
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          surplus_limit: 123123123,
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514151200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 1
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "BBB",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          surplus_limit: 123123123,
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514731200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "李鹏",
              role: ["Admin"]
            }
          ],
          status: 1
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "CCC",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          surplus_limit: 123123123,
          all_limit: 1514131200000,
          start_time: 1514131200000,
          end_time: 1514138200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 2
        }
      ]
    }
  };
}

//授信信息详情查询
function getInfoDetailCredit() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      group_no: "123123",
      name: "梦哆啦",
      all_limit: 123123123123,
      start_time: 12312313123,
      end_time: 12313123123,
      credit_decision: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      survey_report: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      operation_information: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      final_submission: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ]
    }
  };
}

//授信信息保存
function getSaveCredit() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

//授信信息提审
function getSubmitCredit() {
  return {
    code: "000000",
    desc: "成功",
    body: {}
  };
}

//授信审核列表查询
function getRmAuditingList() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      page_no: 1,
      page_size: 20,
      page_total: 10,
      total: 100,
      datas: [
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 123123123,
          end_time: 123123123,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 1,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 123123123,
          end_time: 123123123,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 2,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 123123123,
          end_time: 123123123,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 3,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 123123123,
          end_time: 123123123,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 4,
          reject_reason: "lalala"
        }
      ]
    }
  };
}

//授信历史文件查询
function getHistoryCredit() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      group_no: "123123",
      change_id: "123123",
      name: "梦哆啦",
      all_limit: 123123123123,
      start_time: 12312313123,
      end_time: 12313123123,
      credit_decision: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      survey_report: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      operation_information: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      final_submission: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ]
    }
  };
}

//授信审核通过
function getPassCredit() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

//授信审核驳回
function getRejectCredit() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

//授信申请列表查询
function getApplyListCredit() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      page_no: 1,
      page_size: 20,
      page_total: 10,
      total: 100,
      datas: [
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514831200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            }
          ],
          status: 1,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514731200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽1",
              role: ["Admin"]
            }
          ],
          status: 2,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514631200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽1",
              role: ["Admin"]
            }
          ],
          status: 3,
          reject_reason: "lalala"
        },
        {
          group_no: "123123",
          change_id: "123123",
          name: "AAAA",
          principal_name: "李鹏",
          principal_mobile: "13888888888",
          all_limit: 123123123,
          start_time: 1514131200000,
          end_time: 1514151200000,
          operation: [
            {
              no: 111,
              name: "张丽",
              role: ["Admin"]
            },
            {
              no: 111,
              name: "张丽1",
              role: ["Admin"]
            }
          ],
          status: 4,
          reject_reason: "lalala"
        }
      ]
    }
  };
}

//授信信息附件更新
function getUpDataCredit() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

//授信申请详情查询
function getApplyDetailCredit() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      group_no: "123123",
      change_id: "123123",
      name: "梦哆啦",
      all_limit: 123123123123,
      start_time: 12312313123,
      end_time: 12313123123,
      credit_decision: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      survey_report: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      operation_information: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ],
      final_submission: [
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        },
        {
          name: "文档.doc",
          path: "sfj13fjk1j2fjifndf",
          status: 1,
          id: "231234",
          suffix: ".doc"
        }
      ]
    }
  };
}

/**************contract*****************/
function getQueryContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {
      pageno: 1,
      pagesize: 20,
      pagetotal: 2,
      total: 40,
      datas: [
        {
          group_id: "1063",
          change_id: "123",
          group_name: "昆明赢融味道餐饮有限公司1",
          group_principal_name: "熊迎春",
          group_principal_mobile: 13833333333,
          surplus_limit: 5000000,
          all_limit: 15000000,
          start_time: 1514131200000,
          end_time: 1514131200000,
          operation_principal: [
            {
              id: 123123,
              name: "张利飞"
            },
            {
              id: 123123,
              name: "张利飞1"
            }
          ],
          status: 1,
          reason: ""
        },
        {
          group_id: "1063",
          change_id: "123",
          group_name: "昆明赢融味道餐饮有限公司",
          group_principal_name: "熊迎春",
          group_principal_mobile: 13833333333,
          surplus_limit: 5000000,
          all_limit: 15000000,
          start_time: 1514131200000,
          end_time: 1514131200000,
          operation_principal: [
            {
              id: 123123,
              name: "张利飞"
            },
            {
              id: 123123,
              name: "张利飞1"
            }
          ],
          status: 2,
          reason: ""
        },
        {
          group_id: "1063",
          change_id: "123",
          group_name: "昆明赢融味道餐饮有限公司",
          group_principal_name: "熊迎春",
          group_principal_mobile: 13833333333,
          surplus_limit: 5000000,
          all_limit: 15000000,
          start_time: 1514131200000,
          end_time: 1514131200000,
          operation_principal: [
            {
              id: 123123,
              name: "张利飞"
            },
            {
              id: 123123,
              name: "张利飞1"
            }
          ],
          status: 3,
          reason: ""
        },
        {
          group_id: "1063",
          change_id: "123",
          group_name: "昆明赢融味道餐饮有限公司",
          group_principal_name: "熊迎春",
          group_principal_mobile: 13833333333,
          surplus_limit: 5000000,
          all_limit: 15000000,
          start_time: 1514131200000,
          end_time: 1514131200000,
          operation_principal: [
            {
              id: 123123,
              name: "张利飞"
            },
            {
              id: 123123,
              name: "张利飞1"
            }
          ],
          status: 4,
          reason: "驳回原因"
        }
      ]
    }
  };
}

function getDetailContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {
      group_id: "1063",
      group_name: "昆明赢融味道餐饮有限公司",
      change_id: "123",
      protocol_list: [
        {
          uid: 1,
          name: "xxx.png",
          url: "http://www.baidu.com/xxx.png"
        },
        {
          uid: 2,
          name: "xxx.png",
          url: "http://www.baidu.com/xxx.png"
        },
        {
          uid: 3,
          name: "xxx.png",
          url: "http://www.baidu.com/xxx.png"
        }
      ]
    }
  };
}

function getSaveContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

function getSubmitContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

function getPassContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

function getRejectContract() {
  return {
    desc: "成功",
    result: "000000",
    body: {}
  };
}

/********************************信贷交易系统********************************/
//融资申请列表查询
function getQueryApply() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      total: 5,
      pageTotal: 1,
      pageNo: 1,
      pageSize: 10,
      datas: [
        {
          customerProperty: 2,
          corporation: "小明",
          industry: 1,
          corporationMobile: "11132123123",
          responsibilityName: "",
          enterpriseName: "自测企业07",
          failReason: "",
          enterpriseId: 23,
          shortName: "自测企业07",
          status: 6,
          groupId: "1",
          creditAmount: 1500000.0,
          restAmount: 1500000.0,
          creditStart: 1525751466000,
          creditEnd: 1525751466000
        }
      ]
    }
  };
}

//企业信息详情
function getQueryEnterpriseInfo() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      customerProperty: 2,
      projectIntroduction: "我是项目简介",
      corporationIdcardNo: "220220220220220220",
      address: "凯德MALLC1803",
      organizationLicenseNo: "233333",
      corporation: "小明",
      industry: 1,
      businessLicenseNo: "123123",
      socialCreditCode: "12333333",
      baseFiles: [
        {
          address: "https://www.baidu.com",
          name: "营业执照xiugai"
        },
        {
          address: "https://www.baidu.com",
          name: "身份证xiugai"
        }
      ],
      corporationIdcardType: 1,
      corporationMobile: "11132123123",
      creditCode: "123123",
      industryFiles: [
        {
          address: "https://www.baidu.com",
          name: "营业许可证"
        }
      ],
      name: "自测企业07",
      id: 23,
      customerSource: 2,
      shortName: "自测企业07",
      taxLicense: "3213123",
      status: 6,
      bankPermiseCode: 111111
    }
  };
}

//融资申请提交
function getApplySubmit() {
  return {
    desc: "成功",
    code: "0000",
    body: {}
  };
}

//融资渠道列表
function getChannelList() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      total: 3,
      pageTotal: 1,
      pageNo: 1,
      pageSize: 999,
      datas: [
        {
          no: "001",
          name: "升值空间"
        },
        {
          no: "002",
          name: "线下"
        },
        {
          no: "003",
          name: "云信"
        }
      ]
    }
  };
}

//融资审核列表
function getAuditingList() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      total: 5,
      pageTotal: 1,
      pageNo: 1,
      pageSize: 10,
      datas: [
        {
          amount: 15000000,
          code: "临时企业-20180516-0005",
          channelNo: "001",
          channelName: "升值空间",
          purpose: 1,
          borrowingDays: 30,
          fee: 10000,
          irr: 0.1,
          creatorId: 0,
          creatorName: "",
          updateTime: 1526461091362,
          annualRate: 0.01,
          bail: 1000000,
          repaymentMode: 1,
          enterpriseId: 1,
          serviceRate: 0.05,
          enterpriseName: "临时企业",
          status: 30,
          reason: "12112112112"
        },
        {
          amount: 15000000,
          code: "临时企业-20180516-0005",
          channelNo: "001",
          channelName: "升值空间",
          purpose: 1,
          borrowingDays: 30,
          fee: 10000,
          irr: 0.1,
          creatorId: 0,
          creatorName: "",
          updateTime: 1526461091362,
          annualRate: 0.01,
          bail: 1000000,
          repaymentMode: 1,
          enterpriseId: 1,
          serviceRate: 0.05,
          enterpriseName: "临时企业",
          status: 90,
          reason: "12112112112"
        },
        {
          amount: 15000000,
          code: "临时企业-20180516-0005",
          channelNo: "001",
          channelName: "升值空间",
          purpose: 1,
          borrowingDays: 30,
          fee: 10000,
          irr: 0.1,
          creatorId: 0,
          creatorName: "",
          updateTime: 1526461091362,
          annualRate: 0.01,
          bail: 1000000,
          repaymentMode: 1,
          enterpriseId: 1,
          serviceRate: 0.05,
          enterpriseName: "临时企业",
          status: 20,
          reason: "12112112112"
        }
      ]
    }
  };
}

//融资申请详情
function getApplyDetail() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      amount: 15000000,
      code: "临时企业-20180516-0005",
      channelNo: "001",
      channelName: "升值空间",
      purpose: 1,
      borrowingDays: 30,
      fee: 10000,
      irr: 0.1,
      creatorId: 0,
      creatorName: "",
      updateTime: 1526461091362,
      annualRate: 0.01,
      bail: 1000000,
      repaymentMode: 1,
      totalServiceCharge: 1000,
      loanTime: 0,
      installmentRepayment: 1,
      createTime: 1526459749217,
      overdueRate: 0.1,
      lockNo: "1",
      enterpriseId: 1,
      serviceRate: 0.05,
      enterpriseName: "临时企业",
      remarks: "i am remark",
      status: 10
    }
  };
}

//融资审核通过
function getApplyPass() {
  return {
    desc: "成功",
    code: "0000",
    body: {}
  };
}

//融资审核驳回
function getApplyReject() {
  return {
    desc: "成功",
    code: "0000",
    body: {}
  };
}


//放款列表
function getQueryLoanList() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      total: 3,
      pageTotal: 1,
      pageNo: 1,
      pageSize: 10,
      datas: [
        {
          applyId: 3,
          amount: 300000,
          createTime: 3,
          updateTime: 3,
          channelName: "升值空间",
          id: 3,
          applyCode: "3",
          enterpriseId: 3,
          valueDate: 1526461091362,
          loanedAmount: 40000,
          enterpriseName: "企业名称望湘园",
          lendTime: 1526461091362,
          status: 1
        },
        {
          applyId: 3,
          amount: 300000,
          createTime: 3,
          updateTime: 3,
          channelName: "升值空间",
          id: 3,
          applyCode: "3",
          enterpriseId: 3,
          valueDate: 1526461091362,
          loanedAmount: 40000,
          enterpriseName: "企业名称望湘园2",
          lendTime: 1526461091362,
          status: 2
        }
      ]
    }
  };
}

//还款列表
function getQueryRepaymentList() {
  return {
    desc: "成功",
    code: "0000",
    body: {
      total: 2,
      pageTotal: 1,
      pageNo: 1,
      pageSize: 10,
      datas: [
        {
          amount: 500000,
          principle: 10000,
          fee: 200000,
          planDate: 1526461091362,
          backDate: 1526461091362,
          repaymentPlanNo: "1",
          interest: 100000,
          channelName: "升值空间",
          applyCode: "临时企业-20180516-0001",
          paymentTime: 1526461091362,
          enterpriseName: "临时企业",
          status: 1,
          periodNo: "1"
        }
      ]
    }
  };
}

// 视频类型列表查询
function getVideoTypeGroup() {
  return {
    code: "000000",
    msg: "成功",
    data: [
      {
        sort: 22,
        code: "fa5f8e7d64624749a028cda1017e842a",
        name: "springBoot",
        count: 1,
        updateBy: "limingmeng",
        updateTime: "孟黎明"
      },
      {
        sort: 55,
        code: "106e79a382dd47939a4fa75bb3732ec9",
        name: "java数据结构001",
        count: 0,
        updateByName: "小脑斧",
        updateTime: "1537937971662"
      },
      {
        sort: 1,
        code: "66f46cbbc11f4cccbb4143f4e7058f43",
        name: "22222",
        count: 0,
        updateByName: "小脑斧",
        updateTime: "1537937971662"
      },
      {
        sort: 1,
        code: "b2e24a3a8a09435385d4e51b75e19b19",
        name: "12",
        count: 0,
        updateByName: "小脑斧",
        updateTime: "1537937971662"
      }
    ]
  };
}
// 应用管理-我的任务-删除任务
function deleteTaskInfo() {
  return {
    code: "000000",
    msg: "成功",
    data: null
  }
}

// 视频列表查询
function getThemeList() {
  return {
    code: "000000",
    msg: "成功",
    data: {
      pageNo: 1,
      pageSize: 15,
      pageTotal: 1,
      total: 1,
      datas: [{
        code: "8bbbd209fd61421fa12d440239d02de7",
        sort : "1",
        name: "Hi-C系列培训教程",
        typeName: "Hi-C",
        count: 5,
        privacy: 1,
        status: 1,
        updateByName: "金西后",
        upTime: 1537937872911
      },{
        code: "8bbbd209fd61421fa12d440239d02de8",
        sort : "2",
        name: "大数据培训教程",
        typeName: "大数据",
        count: 2,
        privacy: 2,
        status: 2,
        updateByName: "小丸子",
        upTime: 1537937872919
      },{
        code: "8bbbd209fd61421fa12d440239d02de9",
        sort : "2",
        name: "大数据培训教程w",
        typeName: "大数据",
        count: 2,
        privacy: 2,
        status: 2,
        updateByName: "小丸子",
        upTime: 1537937872919
      }]
    }
  };
}

// 视频列表-授权-白名单查询
function getwhitelistGroup() {
  return {
    code: "000000",
    msg: "成功",
    data: {
      pageNo: 1,
      pageSize: 15,
      pageTotal: 1,
      total: 1,
      datas: [{
        code : "11",
        name: "李彦宏",
        mobile: "17810634661",
        units: "百度在线网络技术（北京）有限公司"
      }, {
        code : "22",
        name: "刘强东",
        mobile: "17810604661",
        units: "北京京东世纪贸易有限公司"
      }, {
        code : "33",
        name: "马云",
        mobile: "15910666415",
        units: "阿里巴巴网络技术有限公司"
      }]
    }
  }
}

// 视频列表-授权-白名单导入-返回数据
function importDataList() {
  return {
    code: "000000",
    msg: "成功",
    data: [{
      id : "50",
      name: "盛丽霞",
      mobile: "15863556001",
      units: "百度在线网络技术（北京）有限公司"
    }, {
      id : "51",
      name: "姜腾",
      mobile: "15863556002",
      units: "北京京东世纪贸易有限公司"
    }, {
      id : "52",
      name: "孟黎明",
      mobile: "15863556003",
      units: "阿里巴巴网络技术有限公司"
    }, {
      id : "53",
      name: "王雅洁",
      mobile: "15863556004",
      units: "阿里巴巴网络技术有限公司"
    }]
  }
}
//获取工具版本详情
function queryObjectCheck() {
  return {
    code: "161012",
    msg: "成功",
    data: null
  }}
//获取工具版本详情
function versionOvert() {
  return {
    code: "000000",
    msg: "成功",
    data: {
      "code":"8bbbd209fd61421fa12d440239d02de7"
    }
  }}
//获取工具版本详情
function versionClosed() {
  return {
    code: "000000",
    msg: "成功",
    data: {
      "code":"8bbbd209fd61421fa12d440239d02de7"
    }
  }}
//获取工具版本详情
function queryToolDetailList() {
  return {
    code: "000000",
    msg: "成功",
    data: {
      code: "a5bcf19e24e34c53b1a4e4015e84064e",
      toolName: "slx-test",
      toolTypeName: "姜腾腾的",
      imageName:"common-smalltool:beta",
      version: "0.0.1",
      summary: "2",
      logo: "http://annoroad-cloud-test.oss-cn-beijing.aliyuncs.com/source/tool-logo/16c2146ef7a64ea182502126c841f0f4/0b942713-094d-4f6c-9875-0a7f3a9d3986.png",
      introduction: "该小工具可以对全基因组的范围内进行A/B组分分析",
      attention: "注意事项",
      script: "test123.zip",
      remarks: "12",
      status: 8,
      upTime: 1552361257917,
      params: [
        {
          fieldName: "123321",
          paramName: "test",
          type: 6,
          defaultValue: "",
          prompt: "请选择文件夹",
          rules: [],
          rule: "",
          options: [],
          paramCode:'11111111111111111'
        },
        {
          fieldName: "insert",
          paramName: "insert",
          type: 1,
          defaultValue: "示例数据/tu.txt",
          prompt: "insert",
          rules: ["txt"],
          rule: ".+\.(txt)$",
          options: [],
          dynamic:1,
          increase:true,
          maxNum:10,
          paramCode:'22222222222222222'
        },
        {
          fieldName: "slx",
          paramName: "slx",
          type: 1,
          defaultValue: "示例数据/tu.txt",
          prompt: "slx",
          rules: ["txt"],
          rule: ".+\.(txt)$",
          options: [],
          dynamic:1,
          increase:true,
          maxNum:5,
          paramCode:'33333333333333333'
        },
        {
          fieldName: "文本",
          paramName: "文本1",
          type: 2,
          defaultValue: "abc",
          prompt: "文本2",
          rules: ["lowercase"],
          rule: "^([a-z])+$",
          options: [],
          paramCode:'4444444444444444444'
        },
        {
          fieldName: "radio",
          paramName: "2",
          type: 3,
          defaultValue: "2",
          prompt: "",
          rules: [],
          rule: "",
          options: [{text: "1", value: "2"}, {text: "3", value: "4"}],
          paramCode:'555555555555555555'
        },
        {
          fieldName: "单选",
          paramName: "2slx",
          type: 4,
          defaultValue: "4",
          prompt: "",
          rules: [],
          rule: "",
          options: [{text: "1", value: "2"}, {text: "3", value: "4"}, {text: "5", value: "6"}],
          paramCode:'666666666666666'
        },
        {
          fieldName: "多选",
          paramName: "22",
          type: 5,
          defaultValue: "22,44",
          prompt: "",
          rules: [],
          rule: "",
          options: [{text: "11", value: "22"}, {text: "33", value: "44"}],
          paramCode:'77777777777777777'
        }
      ]
    }
  }
}
export default {
  //风险管理系统
  getQueryCredit,
  getInfoDetailCredit,
  getSaveCredit,
  getSubmitCredit,
  getHistoryCredit,
  getPassCredit,
  getRejectCredit,
  getRmAuditingList,
  getApplyListCredit,
  getUpDataCredit,
  getApplyDetailCredit,

  getQueryContract,
  getDetailContract,
  getSaveContract,
  getSubmitContract,
  getPassContract,
  getRejectContract,

  //信贷交易管理系统
  getQueryApply,
  getQueryEnterpriseInfo,
  getApplySubmit,
  getChannelList,
  getAuditingList,
  getApplyDetail,
  getApplyPass,
  getApplyReject,

  getQueryLoanList,
  getQueryRepaymentList,
  getThemeList,
  deleteTaskInfo, //我的任务-删除
  getVideoTypeGroup,
  getwhitelistGroup,
  importDataList,
  queryToolDetailList,//获取工具版本详情
  queryObjectCheck,//文件(夹)校验返回数据
  versionOvert,//工具版本公开
  versionClosed,//工具版本公开
};
