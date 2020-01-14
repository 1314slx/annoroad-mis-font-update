import {
  videoTypeListData,
  videoThemeListData,
  getWhiteListData
  //videoListData,
} from "../mock/APPLY/Tools/dataStatistics.js";

import {
  videoTypeGroup,
  saveVideoTypeGroup,

  videoTypeDelete,
  themeList,//视频列表
  whitelistList,// 白名单列表
  importData,// 白名单导入
  themeFind, toolsTypeDelete,//视频列表-检索数据接口
  // queryThemeCode //初始化视频主题编号
} from "../services/dataStatistics";
import { deepClone } from "../utils/utils";

export default {
  namespace: "video",
  state: {
    groupData: {},// 视频类型列表数据
    actionStatus: false,
    actionStatusDelete: false,
    actionStatusCode: 0,//操作状态
    _statusCodeSave: 0,//操作状态
    saveSubmitToolsTypeStatus: 0,//审核测试-通过
    ThemeListData: {},// 视频主题列表信息
    ThemeFindData: {},// 视频主题列表信息-检索数据
    whiteListData: {},// 视频主题列表-授权-白名单列表
    searchWhiteListData: {},// 视频主题列表-授权-白名单搜索列表
    whiteDataSource: [],
    _saveDataCodeMark: "0",//保存提示编号
    videoGroupData: [],// 视频列表
    deleteVideoCode: [],//删除视频的编号
    initialiseVideoCode: ""//初始化视频主题编号（新建视频时用）

  },

  effects: {
    // 视频类型列表
    * videoTypeGroup({ payload }, { call, put }) {
      const response = yield call(videoTypeGroup, payload);
      yield put({
        type: "videoTypeList",
        payload: response
      });
    },

    * whitelistList({ payload }, { call, put }) {
      const response = yield call(whitelistList, payload);
      yield put({
        type: "whiteListGroup",
        payload: response
      });
    },
    /*
    白名单获取-搜索-每2s调用
     */
    * searchWhiteList({ payload }, { call, put }) {
      const response = yield call(whitelistList, payload);
      yield put({
        type: "searchWhiteListGroup",
        payload: response
      });
    },
    // 视频类型保存
    * saveVideoTypeGroup({ payload }, { call, put }) {
      const response = yield call(saveVideoTypeGroup, payload);
      yield put({
        type: "saveTypeGroupList",
        payload: response
      });
    },

    // 白名单导入列表
    * importData({ payload }, { call, put }) {
      const response = yield call(importData, payload);
      yield put({
        type: "saveImportData",
        payload: response
      });
    },

    // 删除视频类型
    * videoTypeDelete({ payload }, { call, put }) {
      const response = yield call(videoTypeDelete, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },

    // 视频主题列表
    * themeList({ payload }, { call, put }) {
      const response = yield call(themeList, payload);
      yield put({
        type: "getThemeList",
        payload: response
      });
    },
    // 视频主题列表-检索数据
    * themeFind({ payload }, { call, put }) {
      const response = yield call(themeFind, payload);
      yield put({
        type: "getThemeFind",
        payload: response
      });
    }
  },

  reducers: {
    videoTypeList(state, payload) {
      return {
        ...state,
        groupData: videoTypeListData(payload.payload)
      };
    },
    // ADD视频
    saveVideoGroup(state, payload) {
      if (Array.isArray(payload.payload)) {
        state.videoGroupData = payload.payload;
      } else {
        //查看code是否已经被删除
        let _statusCode = 0;
        if (state.videoGroupData.length > 0) {
          for (let i = 0; i < state.videoGroupData.length; i++) {
            if (state.videoGroupData[i].code === payload.payload.code) {
              _statusCode = 1;
              state.videoGroupData[i] = payload.payload;
              break;
            }
          }
          if (_statusCode == 0 || _statusCode === 0) {
            state.videoGroupData.push(payload.payload);
          }
        } else {
          state.videoGroupData.push(payload.payload);
        }
      }
      return {
        ...state,
        videoGroupData: state.videoGroupData
      };
    },
    //视频删除
    deleteVideo(state, { payload }) {
      let arr = [];
      let arrDele = [];
      for (let i = 0; i < state.videoGroupData.length; i++) {
        if (state.videoGroupData[i].code !== payload) {
          arr.push(state.videoGroupData[i]);
        }else{
          arrDele.push(state.videoGroupData[i].code);
        }
      }
      return {
        ...state,
        deleteVideoCode: arrDele,
        videoGroupData: arr
      };
    },
    whiteListGroup(state, payload) {
      return {
        ...state,
        whiteListData: getWhiteListData(payload.payload)
      };
    },
    searchWhiteListGroup(state, payload) {
      return {
        ...state,
        searchWhiteListData: getWhiteListData(payload.payload)
      };
    },

    saveTypeGroupList(state, payload) {
      let _status = false;
      let _statusCodeSave = 0;
      if (payload.payload.code === "000000") {
        _status = true;
      } else if (payload.payload.code === "161301") {
        _statusCodeSave = 1;
      } else if (payload.payload.code === "161303") {
        _statusCodeSave = 2;
      }
      return {
        ...state,
        actionStatus: _status,
        _statusCodeSave: _statusCodeSave
      };
    },

    saveImportData(state, { payload }) {
      //let list = [ ...state.whiteListData];
      let _status = false;
      if (payload && payload.code === "000000") {
        _status = true;
      }
      return {
        ...state,
        actionStatus: _status
        ///whiteDataSource: state.whiteListData,
        //_saveDataCodeMark: payload.payload.code
      };
    },
    getThemeList(state, payload) {
      return {
        ...state,
        ThemeListData: videoThemeListData(payload.payload)
      };
    },
    getThemeFind(state, payload) {
      return {
        ...state,
        ThemeFindData: videoThemeListData(payload.payload)
      };
    },
    saveApplySubmit(state, { payload }) {
      return {
        ...state,
        applySubmitData: payload
      };
    },
    // 删除视频类型-当前操作状态
    saveActionStatus(state, { payload }) {
      let _status = false;
      let _statusCode = 0;
      if (payload.code === "000000") {
        _status = true;
      } else if (payload.code === "161301") {
        _statusCode = 1;
      } else if (payload.code === "161302") {
        _statusCode = 2;
      } else if (payload.code == "161303") {
        _statusCode = 3;
      }
      return {
        ...state,
        actionStatusDelete: _status,
        actionStatusCode: _statusCode

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
  }
};
