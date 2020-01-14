import {
  getQueryApply,
  getQueryEnterpriseInfo,
  getApplySubmit,
  getChannelList,
  getAuditingList,
  getApplyDetail,
  getApplyPass,
  getApplyReject
} from "../services/financing";
import { setApplyListData } from "../dataLayer/Financing/queryApplyPage";
import { setAuditingListData } from "../dataLayer/Financing/queryAuditingPage";
import { setChannelList } from "../dataLayer/Financing/queryChannelListPage";
import { commonContract } from "../dataLayer/Common/index";

export default {
  namespace: "financing",
  state: {
    data: null,
    loading: false,
    createStatus: false,
    buttonNumberStatus: 1,
    applyListData: [],
    enterpriseInfoData: [],
    channelListData: [],
    auditingListData: [],
    applyDetailData: []
  },

  effects: {
    //融资申请列表
    *queryApplyPage({ payload }, { call, put }) {
      const response = yield call(getQueryApply, payload);
      yield put({
        type: "saveApplyList",
        payload: response
      });
    },

    //企业信息详情
    *queryEnterpriseInfoPage({ payload }, { call, put }) {
      const response = yield call(getQueryEnterpriseInfo, payload);
      yield put({
        type: "saveEnterpriseInfo",
        payload: response
      });
    },

    //融资申请提交
    *applySubmitPage({ payload }, { call, put }) {
      const response = yield call(getApplySubmit, payload);
      yield put({
        type: "saveApplySubmit",
        payload: response
      });
    },

    //融资渠道列表
    *ChannelListPage({ payload }, { call, put }) {
      const response = yield call(getChannelList, payload);
      yield put({
        type: "saveChannelList",
        payload: response
      });
    },

    //融资审核列表
    *auditingListPage({ payload }, { call, put }) {
      const response = yield call(getAuditingList, payload);
      yield put({
        type: "saveAuditingList",
        payload: response
      });
    },

    //融资申请详情
    *applyDetailPage({ payload }, { call, put }) {
      const response = yield call(getApplyDetail, payload);
      yield put({
        type: "saveApplyDetail",
        payload: response
      });
    },

    //融资审核通过
    *applyPassPage({ payload }, { call, put }) {
      const response = yield call(getApplyPass, payload);
      yield put({
        type: "saveApplyPass",
        payload: response
      });
    },

    //融资审核驳回
    *applyRejectPage({ payload }, { call, put }) {
      const response = yield call(getApplyReject, payload);
      yield put({
        type: "saveApplyReject",
        payload: response
      });
    }
  },
  reducers: {
    saveApplyList(state, { payload }) {
      return {
        ...state,
        applyListData: setApplyListData(payload)
      };
    },
    saveEnterpriseInfo(state, { payload }) {
      return {
        ...state,
        enterpriseInfoData: commonContract(payload)
      };
    },
    saveChannelList(state, { payload }) {
      return {
        ...state,
        channelListData: setChannelList(payload)
      };
    },
    saveApplySubmit(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        applySubmitData: payload,
        createStatus: _status
      };
    },
    saveAuditingList(state, { payload }) {
      return {
        ...state,
        auditingListData: setAuditingListData(payload)
      };
    },
    saveApplyDetail(state, { payload }) {
      return {
        ...state,
        applyDetailData: commonContract(payload)
      };
    },
    saveApplyPass(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        applyPassData: payload,
        createStatus: _status
      };
    },
    saveApplyReject(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        applyRejectData: payload,
        createStatus: _status
      };
    },
    setButtonStatus(state, { payload }) {
      return {
        ...state,
        buttonNumberStatus: payload.buttonNumberStatus
      };
    },
    clear() {
      return {
        data: null,
        loading: false,
        createStatus: false,
        buttonNumberStatus: 1,
        applyListData: [],
        enterpriseInfoData: [],
        channelListData: [],
        auditingListData: [],
        applyDetailData: []
      };
    }
  },
  subscriptions: {}
};
