import { failTaskData } from "../mock/APPLY/Tools/dataStatistics.js";
import {
  queryTaskTestGroup,
  queryToolsNameList,
  deleteTask
} from "../services/dataStatistics";
import { myToolsNameListData } from "../mock/APPLY/Tools/dataStatistics";
export default {
  namespace: "taskTest",
  state: {
    groupData: {},
    myToolNameGroupData: {},
    deleteRusult:{},
  },

  effects: {
    *queryTaskTestGroup({ payload }, { call, put }) {
      const response = yield call(queryTaskTestGroup, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    }, //搜索-工具名称-自动完成
    *queryToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryToolsNameList, payload);

      yield put({
        type: "saveToolsNameGroupList",
        payload: response
      });
    },
    *deleteTask({ payload }, { call, put }) {
      const response = yield call(deleteTask, payload);
      yield put({
        type: "doDeleteTask",
        payload: response
      });
    }
  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: failTaskData(payload.payload)
      };
    },
    saveToolsNameGroupList(state, payload) {
      return {
        ...state,
        myToolNameGroupData: myToolsNameListData(payload.payload)
      };
    },
    doDeleteTask(state, payload) {
      return {
        ...state,
        deleteRusult:payload.payload
      };
    }
  }
};
