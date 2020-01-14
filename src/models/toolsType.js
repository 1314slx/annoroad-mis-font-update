import {
  toolsTypeListData,
  myToolsListData,
  myToolsNameListData,
  examineListData,
  authorityListData
  //getMyToolsToolsGroupList,
} from "../mock/APPLY/Tools/dataStatistics.js";
import { ToolsNameListData,upperToolsTypeGroup } from "../dataLayer/ToolsManager/queryToolsList.js"

import {
  toolsTypeGroup,
  savaToolsTypeGroup,
  myToolsGroup,
  queryExamineGroup,
  toolsTypeDelete,
  rejectExamineGroup,//审核测试驳回操作
  downToolsType,  //审核测试-下架
  versionOvert,  //应用中心-工具权限-公开
  versionClosed,  //应用中心-工具权限-非公开
  queryAuthorityGroup, //应用中心权限工具-列表数据查询
  queryExamineToolsNameList, //应用管理-审核测试-工具查询
  //myToolsToolsGroup,//获取富文本以外的信息
  //myToolsToolsGroup,//获取结果说明富文本的信息
  //myToolsToolsGroup,//获取参数说明富文本的信息
} from "../services/dataStatistics";
import {
queryToolsMenuList,//应用中心-分析工具-导航-工具类型
  queryToolsNameList,//应用中心-分析工具-导航-工具类型
} from "../services/task";
import { submitDeployTest } from "../services/applyManage";
import { roleDelete } from "../services/powerManage";
import { rejectDeployTest } from "../services/applyManage";

export default {
  namespace: "toolsType",
  state: {
    groupData: {},
    myToolGroupData: {},
    myToolNameGroupData: {},
    upperToolsTypeData: {},//工具权限-已上架工具类型
    examineGroupData: {},
    authorityGroupData: {},//工具全信啊-已上架工具名称
    actionStatus: false,
    actionStatusDelete: false,
    actionStatusCode: 0,//操作状态
    _statusCodeSave: 0,//操作状态
    rejectDeployTestStatus: 0,//审核测试-驳回
    saveSubmitToolsTypeStatus: 0,//审核测试-通过
    downToolsTypeStatus: 0,//审核测试-通过
    dataSourceModal: [],
    //getMyToolsToolsGroupData:{},// 编辑工具详情-富文本除外
    testList: [
      {
        name: "test",
        age: 12,
        key: 132
      }
    ],
    modalInputData: [
      {
        id: 0,
        //field: "example",
        text: "选项名",
        value: "value"
      },
      {
        id: 1,
        //field: "example",
        text: "选项名",
        value: "value"
      },
      {
        id: 2,
        //field: "example",
        text: "选项名",
        value: "value"
      }
    ],
    getMulSelectData: [],
    tmpArray: [],
    toolVersion:{}
  },

  effects: {
    * toolsTypeGroup({ payload }, { call, put }) {
      const response = yield call(toolsTypeGroup, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },

    * savaToolsTypeGroup({ payload }, { call, put }) {
      const response = yield call(savaToolsTypeGroup, payload);
      yield put({
        type: "saveTypeGroupList",
        payload: response
      });
    },
    * myToolsGroup({ payload }, { call, put }) {
      const response = yield call(myToolsGroup, payload);
      yield put({
        type: "saveMyToolGroupList",
        payload: response
      });
    },
    * queryToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryExamineToolsNameList, payload);
      yield put({
        type: "saveToolsNameGroupList",
        payload: response
      });
    },
    //分析工具-工具权限-搜索-已上架-工具名称
    * queryUpperToolsNameList({ payload }, { call, put }) {
      const response = yield call(queryToolsNameList, payload);
      yield put({
        type: "saveUpperToolsNameGroup",
        payload: response
      });
    },
    //分析工具-工具权限-搜索-已上架-工具类型
    * toolsUpperTypeGroup({ payload }, { call, put }) {
      const response = yield call(queryToolsMenuList, payload);
      yield put({
        type: "saveUpperToolsTypeGroup",
        payload: response
      });
    },

    * queryExamineGroup({ payload }, { call, put }) {
      const response = yield call(queryExamineGroup, payload);
      yield put({
        type: "saveExamineGroupList",
        payload: response
      });
    },
    /* //工具类型提交
    *applySubmitPage({ payload }, { call, put }) {
      /!*const response = yield call(getApplySubmit, payload);*!/
      const response = yield call(getToolsTypeSubmit, payload);
      yield put({
        type: "saveToolsTypeSubmit",
        payload: response
      });
    }*/

    //删除工具类型
    * toolsTypeDelete({ payload }, { call, put }) {
      const response = yield call(toolsTypeDelete, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    //审核测试-驳回
    * rejectExamineGroup({ payload }, { call, put }) {
      const response = yield call(rejectExamineGroup, payload);
      yield put({
        type: "saveRejectExamineStatus",
        payload: response
      });
    },
    //审核测试-驳回
    * submitToolsType({ payload }, { call, put }) {
      const response = yield call(submitDeployTest, payload);
      yield put({
        type: "saveSubmitToolsType",
        payload: response
      });
    },
    //审核测试-驳回downToolsType
    * downToolsType({ payload }, { call, put }) {
      const response = yield call(downToolsType, payload);
      yield put({
        type: "saveRejectExamineStatus",
        payload: response
      });
    },
    //应用中心-工具权限-公开
    * versionOvert({ payload }, { call, put }) {
      const response = yield call(versionOvert, payload);
      yield put({
        type: "saveVersionOvert",
        payload: response
      });
    },
    //应用中心-工具权限-非公开
    * versionClosed({ payload }, { call, put }) {
      const response = yield call(versionClosed, payload);
      yield put({
        type: "saveVersionClosed",
        payload: response
      });
    },
    * queryAuthorityGroup({ payload }, { call, put }) {
      const response = yield call(queryAuthorityGroup, payload);
      yield put({
        type: "saveAuthorityGroupList",
        payload: response
      });
    },

  },

  reducers: {

    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: toolsTypeListData(payload.payload)
      };
    },
    saveTypeGroupList(state, payload) {
      let _status = false;
      let _statusCodeSave = 0;
      if (payload.payload.code === "000000") {
        _status = true;
      } else if (payload.payload.code === "160401") {
        _statusCodeSave = 1;
      } else if (payload.payload.code === "160404") {
        _statusCodeSave = 2;
      }
      return {
        ...state,
        actionStatus: _status,
        _statusCodeSave: _statusCodeSave
      };
    },
    saveMyToolGroupList(state, payload) {
      return {
        ...state,
        myToolGroupData: myToolsListData(payload.payload)
      };
    },

    saveToolsNameGroupList(state, payload) {
      return {
        ...state,
        myToolNameGroupData: myToolsNameListData(payload.payload)
      };
    },
    saveUpperToolsNameGroup(state, payload) {
      return {
        ...state,
        upperToolsNameData: ToolsNameListData(payload.payload)
      };
    },
    saveUpperToolsTypeGroup(state, payload) {
      return {
        ...state,
        upperToolsTypeData: upperToolsTypeGroup(payload.payload)
      };
    },
    saveExamineGroupList(state, payload) {
      return {
        ...state,
        examineGroupData: examineListData(payload.payload)
      };
    },
    //getToolsTypeSubmit
    saveApplySubmit(state, { payload }) {
      return {
        ...state,
        applySubmitData: payload
        //createStatus: _status
      };
    },
    //删除工具类型--当前操作状态
    saveActionStatus(state, { payload }) {
      let _status = false;
      let _statusCode = 0;
      if (payload.code === "000000") {
        _status = true;
      } else if (payload.code === "160401") {
        _statusCode = 1;
      } else if (payload.code === "160402") {
        _statusCode = 2;
      } else if (payload.code == "160403") {
        _statusCode = 3;
      } else if (payload.code === "160404") {
        _statusCode = 4;
      }
      return {
        ...state,
        actionStatusDelete: _status,
        actionStatusCode: _statusCode

      };
    },
    saveRejectExamineStatus(state, payload) {
      let _statusCode = 0;
      if (payload.payload.code === "000000") {
        _statusCode = 1;
      } else if (payload.payload.code === "000002") {
        _statusCode = 2;
      } else if (payload.payload.code === "160501") {
        _statusCode = 3;
      } else if (payload.payload.code == "160506") {
        _statusCode = 4;
      } else if (payload.payload.code === "160507") {
        _statusCode = 5;
      } else if (payload.payload.code === "000001") {
        _statusCode = 6;
      }
      return {
        ...state,
        rejectDeployTestStatus: _statusCode

      };
    },
    saveSubmitToolsType(state, payload) {
      let _statusCode = 0;
      if (payload.payload.code === "000000") {
        _statusCode = 1;
      } else if (payload.payload.code === "000002") {
        _statusCode = 2;
      } else if (payload.payload.code === "160501") {
        _statusCode = 3;
      } else if (payload.payload.code === "160507") {
        _statusCode = 4;
      } else if (payload.payload.code === "000001") {
        _statusCode = 5;
      }
      return {
        ...state,
        saveSubmitToolsTypeStatus: _statusCode

      };
    },
    addMulSelectFile(state, { payload }) {
      let _list = payload;
      for (let i = 0; i < _list.length; i++) {
        _list[i]["id"] = i;
      }
      return {
        ...state,
        getMulSelectData: _list
      };
    },
    inputFileSubmit(state, { payload }) {
      let list = [...state.dataSourceModal];
      if (Array.isArray(payload)) {
        let _list = payload;
        for (let i = 0; i < _list.length; i++) {
          _list[i]["key"] = i;
        }
        list = _list;
      } else if (payload.key < list.length) {
        //参数列表顺序修改
        if (payload.actionType == 1) {
          const tmpData_1 = list[payload.key];
          const tmpData_2 = list[payload.key - 1];
          tmpData_1.key = -1;
          tmpData_2.key = -2;
          list[payload.key] = tmpData_2;
          list[payload.key].key = payload.key;
          list[payload.key - 1] = tmpData_1;
          list[payload.key - 1].key = payload.key - 1;
        } else if (payload.actionType == 2) {
          const tmpData_1 = list[payload.key];    //该条数据
          const tmpData_2 = list[payload.key + 1];//该条数据下一条
          tmpData_1.key = -1;
          tmpData_2.key = -2;
          list[payload.key] = tmpData_2;
          list[payload.key].key = payload.key;
          list[payload.key + 1] = tmpData_1;
          list[payload.key + 1].key = payload.key + 1;
        } else {
          list[payload.key] = payload;
        }
      } else {
        list.push(payload);
      }
      return {
        ...state,
        dataSourceModal: [...list]
      };
    },
    deleteiFileSubmit(state, { payload }) {
      let list = [...state.dataSourceModal];
      list = list.filter(item => item.key !== payload);
      for (let i = 0; i < list.length; i++) {
        list[i]["key"] = i;
      }
      return {
        ...state,
        dataSourceModal: [...list]
      };
    },
    /* submitToolsFileSubmit(state, {payload}) {
       let list = [ ...state.dataSourceModal ];
       if(Array.isArray(payload)){
         let _list = payload;
         for(let i =0; i< _list.length;i++){
           _list[i]["key"] = i;
         }
         list = _list;
       }else{
         list.push(payload);
       }
       return {
         ...state,
         dataSourceModal: [ ...list ]
       };
     },
     submitdeleteiFileSubmit(state, {payload}) {
       let list = [ ...state.dataSourceModal ];
       list = list.filter(item => item.key !== payload);
       for(let i =0; i< list.length;i++){
         list[i]["key"] = i;
       }
       return {
         ...state,
         dataSourceModal: [ ...list ]
       };
     },*/

    updateTestList(state, payload) {
      return {
        ...state,
        testList: payload
      };
    },

    changeModalInputData(state, { payload }) {
      const { modalInputData } = state;
      if (payload.length > 0) {
        for (let i = 0; i < payload.length; i++) {
          payload[i]["id"] = i;
        }
        modalInputData.length = 0;
        modalInputData.push(...payload);
      }
      const { type, data, flag } = payload;
      const list = [...modalInputData];
      if (type === "add") {
        list.push({ ...data });
      } else if (type === "change") {
        const targetItem = modalInputData.find(item => item.id === data.id);
        const targetIndex = modalInputData.indexOf(targetItem);
        const insertItem = {
          ...targetItem,
          [flag]: data.value
        };
        list.splice(targetIndex, 1, insertItem);
      } else if (type === "delete") {
        const targetItem = modalInputData.find(item => item.id === data.id);
        const targetIndex = modalInputData.indexOf(targetItem);
        list.splice(targetIndex, 1);
        /* if(list.length>0){
           for(let j =0; j< list.length;j++){
            list[j]["id"] = j;
           }
         }*/
      }
      return {
        ...state,
        modalInputData: list
      };
    },
      //  工具版本公开-返回数据
    saveVersionOvert(state, payload) {
      return {
        ...state,
        toolVersion: payload.payload
      };
    },
      //  工具版本非公开-返回数据
    saveVersionClosed(state, payload) {
      return {
        ...state,
        toolVersion: payload.payload
      };
    },
    saveAuthorityGroupList(state, payload) {
      return {
        ...state,
        authorityGroupData: authorityListData(payload.payload)
      };
    },
  }
};
