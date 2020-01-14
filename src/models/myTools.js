import {
  ToolsDetailListData,
  ParamsExplainListData,
  addToolDetailData,
  ToolsListData,//应用中心-分析工具-数据处理
  ToolsTypeListData,//应用中心-分析工具-数据处理
  ToolsNameListData,//应用中心-搜索-已上架的工具名称
} from "../dataLayer/ToolsManager/queryToolsList";
import {
  queryToolDetailList,
  queryExplainList,
  submitTask,
  queryToolList,//应用中心-分析工具-获取工具
  queryToolsMenuList,//应用中心-分析工具-导航-工具类型
  queryToolsNameList,//应用中心-分析工具-导航-工具类型
} from "../services/task";

let _toolsDataTest = {};
let isadd = 0;
export default {
  namespace: "myTools",
  state: {
    groupToolDetailData: {},     // 工具介绍信息
    groupParamsExplainData: {},  // 工具参数说明
    groupResultExplainData: {},  // 工具结果说明
    taskProgress: {},            // 提交任务后跳转页面的任务进度信息
    taskParamList: [],           // 提交任务参数信息
    addParamsData: [], // 新添加的参数
    groupData: {},
    loadToolsData: {},
    groupMenuData: {},//工具类型
    groupToolNameData: {},//搜索-已上架的工具名

  },

  effects: {
    // 提交任务
    *submitTask({ payload, callback }, { call, put }) {
      const response = yield call(submitTask, payload);
      yield put({
        type: "submitTaskDetail",
        payload: response
      });
      if (callback) {
        callback(response);
      }
    },
    // 查询工具介绍信息和任务参数列表
    *queryToolDetailList({ payload }, { call, put }) {
      const response = yield call(queryToolDetailList, payload);
      yield put({
        type: "saveToolsDetailList",
        payload: response
      });
    },
    // 查询工具参数说明
    *queryParamsExplain({ payload }, { call, put }) {
      const response = yield call(queryExplainList, payload);
      yield put({
        type: "saveParamsExplain",
        payload: response
      });
    },
    // 查询工具结果说明
    *queryResultExplain({ payload }, { call, put }) {
      const response = yield call(queryExplainList, payload);
      yield put({
        type: "saveResultExplain",
        payload: response
      });
    },
    //获取已上架的小工具-列表展示
    * queryToolList({ payload }, { call, put }) {
      const response = yield call(queryToolList, payload);
      yield put({
        type: "saveToolsList",
        payload: response
      });
    },
    //获取工具类型-menu
    * queryToolsMenuList({ payload }, { call, put }) {
      const response = yield call(queryToolsMenuList, payload);
      yield put({
        type: "saveToolsMenuList",
        payload: response
      });
    },
    //获取已上架的小工具-搜索名称
    * queryToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryToolsNameList, payload);
      yield put({
        type: "saveToolsNameList",
        payload: response
      });
    },
  },

  reducers: {
    // 保存提交任务后跳转页面的信息
    submitTaskDetail(state, payload) {
      return {
        ...state,
        taskProgress: payload.payload.data
      };
    },
    // 保存工具介绍信息
    saveToolsDetailList(state, payload) {
      return {
        ...state,
        groupToolDetailData: ToolsDetailListData(payload)
      };
    },
    // 保存工具参数说明
    saveParamsExplain(state, payload) {
      return {
        ...state,
        groupParamsExplainData: ParamsExplainListData(payload)
      };
    },
    // 保存工具结果说明
    saveResultExplain(state, payload) {
      return {
        ...state,
        groupResultExplainData: ParamsExplainListData(payload)
      };
    },
    // 清空工具参数和结果说明
    cleanText(state, payload) {
      return {
        ...state,
        groupResultExplainData: {},
        groupParamsExplainData: {},
        addParamsData: []  //清空
      };
    },
    //常用工具-自主增减输入文件-增加
    addToolDetailData(state, { payload }) {
      let originData = state.groupToolDetailData.params;
      return {
        ...state,
        addParamsData: addToolDetailData(originData,payload)
      };
    },
    saveToolsList(state, payload) {
      _toolsDataTest = ToolsListData(payload);
      return {
        ...state,
        loadToolsData: payload.data,
        groupData: ToolsListData(payload)
      };
    },
    saveToolsMenuList(state, payload) {
      return {
        ...state,
        groupMenuData: ToolsTypeListData(payload)
      };
    },
    saveToolsNameList(state, payload) {
      return {
        ...state,
        groupToolNameData: ToolsNameListData(payload)
      };
    },
    addToolsData(state, payload) {
      let groupData = state.groupData;
      let _list = groupData.datas;//第一页数据
      if (payload.payload.length > 0) {
        let list = _list.concat(payload.payload);
        groupData.datas = list;
      }
      return {
        ...state,
        groupData: groupData,
        isadd: isadd
      };
    },
  }
};
