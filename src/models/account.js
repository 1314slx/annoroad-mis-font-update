import { businessAccountData } from "../mock/PRM/account/enterprise/enterprise";
import { getList } from "../mock/PRM/utils";
import {
  queryAccount,
  createAccout,
  openAccout,
  closeAccout
} from "../services/account";

import { enterpriseList, groupList } from "../services/api";

export default {
  namespace: "account",
  state: {
    saveEntAccountList: {},
    loading: false,
    enterpriseList: null,
    groupList: null,
    createStatus: false, //创建状态
    accountStatus: false //账号状态，主要用于判断开启和关闭成功失败
  },

  effects: {
    *queryAccount({ payload }, { call, put }) {
      const response = yield call(queryAccount, payload);
      yield put({
        type: "saveEntAccount",
        payload: response
      });
    },
    *createAccount({ payload }, { call, put }) {
      const response = yield call(createAccout, payload);
      yield put({
        type: "saveCreateStatus",
        payload: response
      });
    },
    *openAccount({ payload }, { call, put }) {
      const response = yield call(openAccout, payload);
      yield put({
        type: "saveAccountStatus",
        payload: response
      });
    },
    *closeAccount({ payload }, { call, put }) {
      const response = yield call(closeAccout, payload);
      yield put({
        type: "saveAccountStatus",
        payload: response
      });
    },

    *queryEnterpriseList(_, { call, put }) {
      const response = yield call(enterpriseList);
      yield put({
        type: "saveEnterpriseList",
        payload: response
      });
    },
    *queryGroupList(_, { call, put }) {
      const response = yield call(groupList);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    }
  },
  reducers: {
    saveEntAccount(state, payload) {
      return {
        ...state,
        saveEntAccountList: businessAccountData(payload.payload)
      };
    },
    saveEnterpriseList(state, payload) {
      return {
        ...state,
        enterpriseList: getList(payload.payload)
      };
    },
    saveGroupList(state, payload) {
      return {
        ...state,
        groupList: getList(payload.payload)
      };
    },
    //保存创建状态的
    saveCreateStatus(state, payload) {
      let _status = false;
      if (payload.payload && payload.payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        createStatus: _status
      };
    },
    //保存账号操作状态
    saveAccountStatus(state, payload) {
      let _status = false;
      if (payload.payload && payload.payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        accountStatus: _status
      };
    },

    clear() {
      return {
        saveEntAccountList: {},
        loading: false,
        enterpriseList: null,
        groupList: null,
        createStatus: false,
        accountStatus: false
      };
    },
    subscriptions: {}
  }
};
