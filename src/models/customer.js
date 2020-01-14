import {
  businessData,
  getEntDetail
} from "../mock/PRM/coustomer/business/business";
import {
  groupListData,
  staffListData,
  getGroupDetail
} from "../mock/PRM/coustomer/group/group";
import { getList } from "../mock/PRM/utils";
import {
  queryEnterprise,
  queryGroup,
  saveEnterprise,
  submitEnterprise,
  enterpriseDetail,
  saveGroup,
  groupDetail,
  passExamine,
  rejectExamine,
  staffList,
  enterpriseList
} from "../services/customer";

export default {
  namespace: "customer",
  state: {
    businessData: {},
    groupData: {},
    submitStatus: false,
    loading: false,
    submitting: false,
    staffList: [],
    enterpriseDetail: {},
    groupDetailData: {},
    enterpriseListData: [],
    actionStatus: false
  },

  effects: {
    *queryEnterprise({ payload }, { call, put }) {
      const response = yield call(queryEnterprise, payload);
      yield put({
        type: "saveBusiness",
        payload: response
      });
    },
    *saveEnterprise({ payload }, { call, put }) {
      const response = yield call(saveEnterprise, payload);
      yield put({
        type: "saveStatus",
        payload: response
      });
    },
    *submitEnterprise({ payload }, { call, put }) {
      const response = yield call(submitEnterprise, payload);
      yield put({
        type: "saveStatus",
        payload: response
      });
    },
    *enterpriseDetail({ payload }, { call, put }) {
      const response = yield call(enterpriseDetail, payload);
      if (payload.flag) {
        yield put({
          type: "saveEntDetail",
          payload: {
            response: response,
            flag: true
          }
        });
      } else {
        yield put({
          type: "saveEntDetail",
          payload: {
            response: response,
            flag: false
          }
        });
      }
    },
    *passExamines({ payload }, { call, put }) {
      const response = yield call(passExamine, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *rejectExamines({ payload }, { call, put }) {
      const response = yield call(rejectExamine, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *queryGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },
    *staffList({ payload }, { call, put }) {
      const response = yield call(staffList, payload);
      yield put({
        type: "saveStaffList",
        payload: response
      });
    },
    *saveGroup({ payload }, { call, put }) {
      const response = yield call(saveGroup, payload);
      yield put({
        type: "saveStatus",
        payload: response
      });
    },
    *groupDetail({ payload }, { call, put }) {
      const response = yield call(groupDetail, payload);
      yield put({
        type: "saveGroupDetail",
        payload: response
      });
    },
    *queryEnterpriseList({ payload }, { call, put }) {
      const response = yield call(enterpriseList, payload);
      yield put({
        type: "saveEnterpriseList",
        payload: response
      });
    },

    *uploadFile({ payload }, { call, put }) {
      const response = yield call(uploadFile, payload);
    }
  },
  reducers: {
    saveBusiness(state, payload) {
      return {
        ...state,
        businessData: businessData(payload.payload)
      };
    },
    saveStatus(state, payload) {
      let _status = false;
      if (payload.payload && payload.payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        submitStatus: _status
      };
    },
    saveEntDetail(state, payload) {
      return {
        ...state,
        enterpriseDetail: getEntDetail(payload.payload)
      };
    },
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: groupListData(payload.payload)
      };
    },
    saveStaffList(state, payload) {
      return {
        ...state,
        staffList: staffListData(payload.payload)
      };
    },
    saveGroupDetail(state, payload) {
      return {
        ...state,
        groupDetailData: getGroupDetail(payload.payload)
      };
    },
    saveEnterpriseList(state, payload) {
      return {
        ...state,
        enterpriseListData: getList(payload.payload, "multiple")
      };
    },
    saveActionStatus(state, payload) {
      let _status = false;
      if (payload.payload && payload.payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        actionStatus: _status
      };
    },
    clear() {
      return {
        businessData: {},
        groupData: {},
        submitStatus: false,
        loading: false,
        submitting: false,
        staffList: [],
        enterpriseDetail: {},
        groupDetailData: {},
        enterpriseListData: [],
        actionStatus: false
      };
    }
  },
  subscriptions: {}
};
