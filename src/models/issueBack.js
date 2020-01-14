import {
  issueBackListData,
  dashboardListData
} from "../mock/APPLY/Tools/dataStatistics.js";
/*import { dashboardListData } from "../dataLayer/ToolsManager/queryChargePersonListPage";*/
import {
  issueBackGroup,
  dashboardGroup,
  savaIssueBackGroup
} from "../services/dataStatistics";
export default {
  namespace: "issueBack",
  state: {
    groupData: {},
    dashboardGroupData: {},
    submitLookStatus: false
  },

  effects: {
    *issueBackGroup({ payload }, { call, put }) {
      const response = yield call(issueBackGroup, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },

    *dashboardGroup({ payload }, { call, put }) {
      const response = yield call(dashboardGroup, payload);
      yield put({
        type: "saveDashboardGroupList",
        payload: response
      });
    },

    *savaIssueBackGroup({ payload }, { call, put }) {
      const response = yield call(savaIssueBackGroup, payload);
      yield put({
        type: "savaIssueBackGroupList",
        payload: response
      });
    }
  },
  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: issueBackListData(payload.payload)
      };
    },
    saveDashboardGroupList(state, payload) {
      return {
        ...state,
        dashboardGroupData: dashboardListData(payload.payload)

      };
    },
    savaIssueBackGroupList(state, payload) {
      let _status = false;
      if (payload && payload.payload.code === "000000") {
        _status = true;
      }
      return {
        ...state,
        applySubmitData: payload,
        submitLookStatus: _status
      };
    }
  }
};
