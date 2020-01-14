import { toolsManagerListData } from "../mock/APPLY/Tools/applyManage.js"; //src/mock/APPLY/Tools/applyManage.js
import { setChargePersonList } from "../dataLayer/ToolsManager/queryChargePersonListPage";
import {
  toolsManagerGroup,
  toolsChargeGroup,
  newToolsManagerSubmit,
  saveToolsManager,
  //savaToolsChargeGroup,//工具管理保存
} from "../services/applyManage";
import { queryToolsNameList, toolsTypeGroup, toolsManagerDelete } from "../services/dataStatistics";
import {
  myToolsNameListData,
  toolsTypeListData
} from "../mock/APPLY/Tools/dataStatistics";
import { roleDelete } from "../services/powerManage"; //src/services/applyManage.js
export default {
  namespace: "toolsManager",
  state: {
    groupData: {},
    ToolsChargePerson: {},
    myToolNameGroupData: {},
    myToolTypeGroupData: {},
    createStatus:0,
    actionStatus: false //操作状态
  },

  effects: {
    *toolsManagerGroup({ payload }, { call, put }) {
      const response = yield call(toolsManagerGroup, payload); //toolsManagerGroup  为service下面的方法   payload为参数
      // console.log("response", response);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },
    //获取所有组织人结构
    *toolsChargeGroup({ payload }, { call, put }) {
      const response = yield call(toolsChargeGroup, payload);
      // console.log("获取所有组织人结构", response);
      yield put({
        type: "saveToolsChargePerson",
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
    //工具管理保存
    *newToolsManagerSubmit({ payload }, { call, put }) {
      const response = yield call(newToolsManagerSubmit, payload);
      // console.log("model-service是否返回值", response);
      yield put({
        type: "saveNewToolsManagerSubmit",
        payload: response
      });
    },

    //删除工具管理
    *toolsManagerDelete({ payload }, { call, put }) {
      const response = yield call(toolsManagerDelete, payload);
      yield put({
        type: "saveActionDelete",
        payload: response
      });
    },
  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: toolsManagerListData(payload.payload)
      };
    },
    saveToolsChargePerson(state, payload) {
      return {
        ...state,
        ToolsChargePerson: setChargePersonList(payload.payload)
      };
    },

    saveToolsManager(state, payload) {
      return {
        ...state,
        saveToolsManagerData: payload
        // ToolsChargePerson: saveToolsManagerList(payload.payload)
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
    saveNewToolsManagerSubmit(state, { payload }) {
      let _status = 0;
      if (payload && payload.code === "000000") {
        _status = 1;
      }else if (payload && payload.code === "160301") {
        _status = 2;
      }else if (payload && payload.code === "160401") {
        _status = 3;
      }else if (payload && payload.code === "160508") {
        _status = 4;
      }else if (payload && payload.code === "160802") {
        _status = 5;
      }else if (payload && payload.code === "160304") {
        _status = 6;
      }else if (payload && payload.code === "160307") {
        _status = 7;
      }else if (payload && payload.code === "160310") {
        _status = 8;
      }
      return {
        ...state,
        //applySubmitData: payload,
          createStatus: _status
      };
    },
    //设置当前操作状态
    saveActionDelete(state, { payload }) {
      let _status = false;
      if (payload.code === "000000") {
        _status = true;
      }
      return {
        ...state,
        actionStatus: _status
      };
    }
  }
};
