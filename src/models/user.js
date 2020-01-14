import { queryCurrent } from "../services/user";
import { getUserDetailData, getCurrentUser } from "../mock/Authority/index";
import { userDetail } from "../services/api";

export default {
  namespace: "user",

  state: {
    list: [],
    currentUser: {},
    userDetailData: null //用户信息保存
  },

  effects: {
    *fetchCurrent(_, { call, put }) {
      const response = yield call(queryCurrent);
      yield put({
        type: "saveCurrentUser",
        payload: response
      });
    },

    *userDetail({ payload }, { call, put }) {
      const response = yield call(userDetail, payload);
      yield put({
        type: "saveUserDetail",
        payload: response
      });
    }
  },

  reducers: {
    saveCurrentUser(state, action) {
      return {
        ...state,
        currentUser: action.payload
      };
    },
    //用户信息保存
    saveUserDetail(state, { payload }) {
      return {
        ...state,
        currentUser: getCurrentUser(payload),
        userDetailData: getUserDetailData(payload)
      };
    }
  }
};
