import { findFile, findMyDataFile, spaceSize, deleteFile, newFolder, findAlreadyUploadFiles,objectCheck } from "../services/dataManager";

import {
  fileListData,
  exampleUsedSize,
  testUsedSize,
  myUsedSize,
  handlerUploadFile
} from "../dataLayer/DataManager/dataManager";

export default {
  namespace: "dataManager",

  state: {
    groupData: {},
    alreadyUpload: new Map(), // 已上传文件列表
    checkpoints: new Map(), // 上传文件断点
    currentPath: "", // 当前路径
    myCurrentPath: "", // 我的数据-当前路径
    exampleUsedSize: 0, // 示例数据空间大小
    testUsedSize: 0, // 测试数据空间大小
    myUsedSize: 0, // 应用中心-我的数据空间大小
    uploadingSize: 0, // 正在上传文件大小
    visible: false, // 是否展示文件上传列表
    uploadingNames: new Set(), // 正在上传中的文件名
    allUploadNames: new Set(), // 所有已上传的文件名
    checkedData: [],
    selectedRowKeys:[],
    objectCheckData:{},
    status: false //返回状态码
  },

  effects: {
    * queryGroup({payload}, {call, put}) {
      let response={};
      if(payload.isMyData && payload.isMyData == 1){
        response = yield call(findMyDataFile, payload);
      }else{
        response = yield call(findFile, payload);
      }
      if(response.code == "000001"){
        yield put({
          type: "saveStatus",
        });
      }else if(response.code == "000000"){
        yield put({
          type: "findFile",
          payload: response
        });
      }

    },
    //获取空间文件大小
    * spacesizeGet({payload}, {call, put}) {
      const response = yield call(spaceSize, payload);
      yield put({
        type: "spaceSize",
        payload: response
      });
    },
    /**
     * 删除文件/文件夹
     */
      * deleteFile({payload, callback}, {call}) {
      const response = yield call(deleteFile, payload);
      if (callback) {
        callback(response);
      }
    },

    /**
     * 新建文件夹
     */
      * newFolders({payload, callback}, {call, put}){
      const response = yield call(newFolder, payload);
      if(callback){
        callback(response);
      }
    },
    /**
     * 获取已上传文件列表
     */
      * findAlreadyUploadFiles({payload}, {call, put}){
      const response = yield call(findAlreadyUploadFiles, payload);
      yield put({
        type: "alreadyUpload",
        payload: response
      });
    },
    * objectCheck({payload}, {call, put}) {
      const response = yield call(objectCheck, payload);
      yield put({
        type: "getObjectCheck",
        payload: response
      });
    }

  },

  reducers: {
    nullFunction(state, payload) {
      return {
        ...state
      };
    },
    setLoadingSize(state, payload) {
      return {
        ...state,
        uploadingSize: state.uploadingSize + payload.uploadingSize
      };
    },
    setVisible(state, payload) {
      return {
        ...state,
        visible: payload.visible
      };
    },
    findFile(state, payload) {
      return {
        ...state,
        status: false,
        groupData: fileListData(payload.payload)
      };
    },
    saveStatus( state ) {
      return {
        ...state,
        status: true
      };
    },
    spaceSize(state, payload) {
      return {
        ...state,
        exampleUsedSize: exampleUsedSize(payload.payload), // 空闲空间大小
        testUsedSize: testUsedSize(payload.payload), // 总空间大小
        myUsedSize: myUsedSize(payload.payload) // 应用中心-我的数据-空间大小
      };
    },
    //更新state中的currentPath
    changeCurrentPath(state, payload) {
      return {
        ...state,
        currentPath: payload.payload
      };
    },
    //更新我的数据中state中的currentPath
    changeMyDataCurrentPath(state, payload) {
      return {
        ...state,
        myCurrentPath: payload.payload
      };
    },
    //更新state中的checkedData
    changeCheckedData(state, payload) {
      return {
        ...state,
        checkedData: payload.payload
      };
    },

    selectedRowKey(state, payload){

      return{
        ...state,
        selectedRowKeys:payload.payload
      }
    },
    getObjectCheck(state, payload){
      return {
        ...state,
        objectCheckData: payload.payload
      }
    }

  }//reducers结束
};
