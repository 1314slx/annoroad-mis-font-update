import { deployTestData } from "../mock/APPLY/Tools/applyManage.js";
import {
  //queryFailTask,
  queryGroup,
  rejectDeployTest,//部署测试-驳回操作
  submitDeployTest,//提交审核
} from "../services/applyManage";
import { queryToolsNameList, toolsTypeDelete, toolsTypeGroup } from "../services/dataStatistics";
import {
  myToolsNameListData,
  toolsTypeListData
} from "../mock/APPLY/Tools/dataStatistics";
export default {
  namespace: "deployTest",
  state: {
    groupData: {},
    myToolNameGroupData: {},
    myToolTypeGroupData: {},
    rejectDeployTestStatus:0,
    SubmitDeployTestStatus:0,
  },

  effects: {
    /** queryFailTask({payload}, {call, put}) {
      const response = yield call(queryFailTask, payload);  //queryFailTask  为service下面的方法   payload为参数
      yield put({
        type: 'saveGroupList',
        payload: response,
      });
    },*/
    *queryGroup({ payload }, { call, put }) {
      const response = yield call(queryGroup, payload); //queryGroup  为service下面的方法   payload为参数
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },
    *queryToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryToolsNameList, payload);
      yield put({
        type: "saveToolsNameGroupList",
        payload: response
      });
    },
    *toolsTypeGroup({ payload }, { call, put }) {
      const response = yield call(toolsTypeGroup, payload);

      yield put({
        type: "saveToolsTypeGroupList",
        payload: response
      });
    },
    //b部署测试-驳回
    *rejectDeployTest({ payload }, { call, put }) {
      const response = yield call(rejectDeployTest, payload);
      yield put({
        type: "saveRejectDeployStatus",
        payload: response
      });
    },
    //b部署测试-提交审核
    *submitDeployTest({ payload }, { call, put }) {
      const response = yield call(submitDeployTest, payload);
      yield put({
        type: "saveSubmitDeployStatus",
        payload: response
      });
    },
  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: deployTestData(payload.payload)
      };
    },
    saveToolsNameGroupList(state, payload) {
      return {
        ...state,
        myToolNameGroupData: myToolsNameListData(payload.payload)
      };
    },
    saveToolsTypeGroupList(state, payload) {
      return {
        ...state,
        myToolTypeGroupData: toolsTypeListData(payload.payload)
      };
    },
    saveRejectDeployStatus(state, payload) {
      let _statusCode = 0;
      if (payload.payload.code === "000000") {
        _statusCode = 1;
      }else if(payload.payload.code === "000002"){
        _statusCode = 2;
      }else if(payload.payload.code === "160501"){
        _statusCode = 3;
      }else if(payload.payload.code == "160506"){
        _statusCode = 4;
      }else if(payload.payload.code === "160507"){
        _statusCode = 5;
      }
      return {
        ...state,
        rejectDeployTestStatus: _statusCode,

      };
    },
    saveSubmitDeployStatus(state, payload) {
      let _statusCode = 0;
      if (payload.payload.code === "000000") {
        _statusCode = 1;
      }else if(payload.payload.code === "000001"){
        _statusCode = 2;
      }else if(payload.payload.code === "000002"){
        _statusCode = 3;
      }else if(payload.payload.code === "160501"){
        _statusCode = 4;
      }else if(payload.payload.code == "160507"){
        _statusCode = 5;
      }
      return {
        ...state,
        SubmitDeployTestStatus: _statusCode,

      };
    },



  }
};
