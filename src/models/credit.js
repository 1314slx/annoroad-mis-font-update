import {
  getQueryCredit,
  getInfoDetailCredit,
  getSaveCredit,
  getSubmitCredit,
  getRmAuditingList,
  getHistoryCredit,
  getPassCredit,
  getRejectCredit,
  getApplyListCredit,
  getUpDataCredit,
  getApplyDetailCredit
} from "../services/credit";

import { setCreditData } from "../dataLayer/Credit/queryCreditPage";
import { setApplyListCreditData } from "../dataLayer/Credit/queryApplyListCreditPage";
import { setAuditingListCreditData } from "../dataLayer/Credit/queryAuditingListCreditPage";

import { commonContract } from "../dataLayer/Common/index";

export default {
  namespace: "credit",

  state: {
    creditData: [],
    applyListCreditData: [],
    auditingListData: [],
    historyCreditData: [],
    applyDetailCreditData: [],
    creditDetailData: [],
    loading: false,
    createStatus: false, //创建状态

    //'查看'和'审核'
    apiStatus: 1, //1:调用"授信信息查询接口" 2:调用"授信申请详情查询"
    showHistoryStatus: 1, //1:显示"查看历史文件"  2:隐藏"查看历史文件"
    returnBackUrlStatus: 1, //1:返回"授信管理列表" 2:返回"授信申请列表" 3:返回"授信审核列表"
    buttonNumberStatus: 1, //1:显示返回 2.显示 通过 驳回 返回

    //'授信'和'修改授信'
    applyDetailStatus: 1, //1:不调用"授信申请详情查询" 2：调用"授信申请详情查询"
    backUrlStatus: 1 //1:返回"授信管理列表"页面 2:返回"授信申请列表"页面
  },

  effects: {
    //授信列表查询
    *queryCreditPage({ payload }, { call, put }) {
      const response = yield call(getQueryCredit, payload);

      yield put({
        type: "saveCredit",
        payload: response
      });
    },
    //授信信息详情查询
    *infoDetailCreditPage({ payload }, { call, put }) {
      const response = yield call(getInfoDetailCredit, payload);

      yield put({
        type: "saveCreditDetail",
        payload: response
      });
    },

    //授信信息保存
    *saveCreditPage({ payload }, { call, put }) {
      const response = yield call(getSaveCredit, payload);

      yield put({
        type: "saveSaveCredit",
        payload: response
      });
    },

    //授信信息提审
    *submitCreditPage({ payload }, { call, put }) {
      const response = yield call(getSubmitCredit, payload);

      yield put({
        type: "saveSubmitCredit",
        payload: response
      });
    },

    //授信审核列表查询
    *auditingListPage({ payload }, { call, put }) {
      const response = yield call(getRmAuditingList, payload);

      yield put({
        type: "saveAuditingList",
        payload: response
      });
    },

    //授信历史文件查询
    *historyCreditPage({ payload }, { call, put }) {
      const response = yield call(getHistoryCredit, payload);

      //接受请求结果
      yield put({
        type: "saveHistoryCredit",
        payload: response
      });
    },

    //授信审核通过
    *passCreditPage({ payload }, { call, put }) {
      const response = yield call(getPassCredit, payload);

      //接受请求结果
      yield put({
        type: "savePassCredit",
        payload: response
      });
    },

    //授信审核驳回
    *RejectCreditPage({ payload }, { call, put }) {
      const response = yield call(getRejectCredit, payload);

      //接受请求结果
      yield put({
        type: "saveRejectCredit",
        payload: response
      });
    },
    //授信申请列表查询
    *applyListCreditPage({ payload }, { call, put }) {
      const response = yield call(getApplyListCredit, payload);

      //接受请求结果
      yield put({
        type: "saveApplyListCredit",
        payload: response
      });
    },

    //授信信息附件更新
    *upDataCreditPage({ payload }, { call, put }) {
      const response = yield call(getUpDataCredit, payload);

      //接受请求结果
      yield put({
        type: "saveUpDataCredit",
        payload: response
      });
    },

    //授信申请详情查询
    *applyDetailCreditPage({ payload }, { call, put }) {
      const response = yield call(getApplyDetailCredit, payload);

      //接受请求结果
      yield put({
        type: "saveApplyDetailCredit",
        payload: response
      });
    }
  },

  reducers: {
    //授信列表查询
    saveCredit(state, { payload }) {
      return {
        ...state,
        creditData: setCreditData(payload)
      };
    },
    //授信信息详情查询
    saveCreditDetail(state, { payload }) {
      return {
        ...state,
        creditDetailData: commonContract(payload)
      };
    },
    //授信信息保存
    saveSaveCredit(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        saveCreditData: payload,
        createStatus: _status
      };
    },

    //授信信息提审
    saveSubmitCredit(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        submitCreditData: payload,
        createStatus: _status
      };
    },
    //授信审核列表查询
    saveAuditingList(state, { payload }) {
      return {
        ...state,
        auditingListData: setAuditingListCreditData(payload)
      };
    },
    //授信历史文件查询
    saveHistoryCredit(state, { payload }) {
      return {
        ...state,
        historyCreditData: commonContract(payload)
      };
    },
    //授信审核通过
    savePassCredit(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        passCreditData: payload,
        createStatus: _status
      };
    },

    //授信审核驳回
    saveRejectCredit(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        rejectCreditData: payload,
        createStatus: _status
      };
    },
    //授信申请列表查询
    saveApplyListCredit(state, { payload }) {
      return {
        ...state,
        applyListCreditData: setApplyListCreditData(payload)
      };
    },
    //授信信息附件更新
    saveUpDataCredit(state, { payload }) {
      return {
        ...state,
        upDataCreditData: payload
      };
    },
    //授信申请详情查询
    saveApplyDetailCredit(state, { payload }) {
      return {
        ...state,
        applyDetailCreditData: commonContract(payload)
      };
    },

    setShowLookButton(state, { payload }) {
      return {
        ...state,
        apiStatus: payload.apiStatus,
        showHistoryStatus: payload.showHistoryStatus,
        returnBackUrlStatus: payload.returnBackUrlStatus,
        buttonNumberStatus: payload.buttonNumberStatus
      };
    },

    setApplyDetailStatus(state, { payload }) {
      return {
        ...state,
        applyDetailStatus: payload.applyDetailStatus,
        backUrlStatus: payload.backUrlStatus
      };
    },

    setClickButton(state, { payload }) {
      return {
        ...state,
        clickButtonStatus: payload.clickButtonStatus
      };
    },

    clear() {
      return {
        creditData: [],
        applyListCreditData: [],
        auditingListData: [],
        historyCreditData: [],
        applyDetailCreditData: [],
        creditDetailData: [],
        loading: false,
        createStatus: false,

        //'查看'和'审核'
        apiStatus: 1, //1:调用"授信信息查询接口" 2:调用"授信申请详情查询"
        showHistoryStatus: 1, //1:显示"查看历史文件"  2:隐藏"查看历史文件"
        returnBackUrlStatus: 1, //1:返回"授信管理列表" 2:返回"授信申请列表" 3:返回"授信审核列表"
        buttonNumberStatus: 1, //1:显示返回 2.显示 通过 驳回 返回

        //'授信'和'修改授信'
        applyDetailStatus: 1, //1:不调用"授信申请详情查询" 2：调用"授信申请详情查询"
        backUrlStatus: 1 //1:返回"授信管理列表"页面 2:返回"授信申请列表"页面
      };
    }
  }
};
