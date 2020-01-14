import {
  failTaskData,
  failTaskDetailData,
} from "../mock/APPLY/Tools/dataStatistics.js";
import { queryFailTask, failTaskDetail, queryToolsNameList } from "../services/dataStatistics";
import { myToolsNameListData } from "../mock/APPLY/Tools/dataStatistics";
export default {
  namespace: "failTask",
  state: {
    groupData: {},
    failTaskDetailData: {},
    myToolNameGroupData: {}
  },

  effects: {
    // 获取失败任务列表数据
    *queryFailTask({ payload }, { call, put }) {
      const response = yield call(queryFailTask, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },
    // 失败任务详情
    *failTaskDetail({ payload }, { call, put }) {
      const response = yield call(failTaskDetail, payload);
      yield put({
        type: "saveFailTaskDetail",
        payload: response
      });
    },
    //搜索-工具名称-自动完成
    *queryToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryToolsNameList, payload);

      yield put({
        type: "saveToolsNameGroupList",
        payload: response
      });
    }
  },

  reducers: {
    // 获取失败任务列表数据处理
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: failTaskData(payload.payload)
      };
    },
    // 获取失败任务详情
    saveFailTaskDetail(state, payload) {
      return {
        ...state,
        failTaskDetailData: failTaskDetailData(payload.payload)
      };
    },
    // 获取失败任务-工具名称-搜索
    saveToolsNameGroupList(state, payload) {
      return {
        ...state,
        myToolNameGroupData: myToolsNameListData(payload.payload)
      };
    }
  }
};
