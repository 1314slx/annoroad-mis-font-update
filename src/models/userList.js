import { userListData } from "../mock/APPLY/UserList/userList.js";
import { queryGroup } from "../services/user";
export default {
  namespace: "userList",
  state: {
    groupData: {}
  },

  effects: {
    *queryGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload); //queryGroup  为service下面的方法   payload为参数
      yield put({
        type: "saveGroupList",
        payload: response
      });
    }
  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: userListData(payload.payload)
      };
    }
  }
};
