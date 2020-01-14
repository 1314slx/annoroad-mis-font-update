import {
  toolsStatisticsData,
  myToolsNameListData,
  toolsTypeListData
} from "../mock/APPLY/Tools/dataStatistics.js";
import {
  queryGroup,
  queryToolsNameList,
  toolsTypeGroup
} from "../services/dataStatistics";

export default {
  namespace: "toolsStatistics",
  state: {
    groupData: {},
    myToolNameGroupData: {},
    toolsTypeList: {}
  },

  effects: {
    //数据统计-工具统计-列表
    *queryGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload);
      yield put({
        type: "saveGroupList",
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
    },
    //搜索-工具类型-自动完成
    *toolsTypeGroup({ payload }, { call, put }) {
      const response = yield call(toolsTypeGroup, payload);
      yield put({
        type: "savetoolsTypeGroupList",
        payload: response
      });
    }
  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: toolsStatisticsData(payload.payload)
      };
    },
    saveToolsNameGroupList(state, payload) {
      return {
        ...state,
        myToolNameGroupData: myToolsNameListData(payload.payload)
      };
    },
    savetoolsTypeGroupList(state, payload) {
      return {
        ...state,
        toolsTypeList: toolsTypeListData(payload.payload)
      };
    }
  }
};
