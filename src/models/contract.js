// 入参
import {
  getQueryContract,
  getDetailContract,
  getSaveContract,
  getSubmitContract,
  getPassContract,
  getRejectContract
} from "../services/contract";
// 返回结果处理格式
import { setContractData } from "../dataLayer/Contract/queryContractPage";
import { commonContract } from "../dataLayer/Common/index";

export default {
  namespace: "contract",

  state: {
    contractData: [],
    detailData: [],
    createStatus: false,
    loading: false,

    //上传协议 和 修改协议
    detailStatus: 1, //1.上传协议 2.修改协议  3.审核协议  4.查看协议  （注释：当为1：不调取详情查询接口，其他状态调取详情接口）

    //审核 和 查看
    buttonNumberStatus: 1 //1:显示取消 2.显示 通过 驳回 取消
  },

  effects: {
    //协议列表查询
    *queryContractPage({ payload }, { call, put }) {
      const response = yield call(getQueryContract, payload);

      yield put({
        type: "saveContract",
        payload: response
      });
    },

    //协议详情查询
    *detailContractPage({ payload }, { call, put }) {
      const response = yield call(getDetailContract, payload);

      //接受请求结果
      yield put({
        type: "saveDetailContractData",
        payload: response
      });
    },

    //协议保存
    *saveContractPage({ payload }, { call, put }) {
      const response = yield call(getSaveContract, payload);

      //接受请求结果
      yield put({
        type: "saveContractData",
        payload: response
      });
    },

    //协议提审
    *submitContractPage({ payload }, { call, put }) {
      const response = yield call(getSubmitContract, payload);

      //接受请求结果
      yield put({
        type: "saveSubmitContractData",
        payload: response
      });
    },

    //协议审核通过
    *passContractPage({ payload }, { call, put }) {
      const response = yield call(getPassContract, payload);

      //接受请求结果
      yield put({
        type: "savePassContractData",
        payload: response
      });
    },

    //协议审核驳回
    *rejectContractPage({ payload }, { call, put }) {
      const response = yield call(getRejectContract, payload);

      //接受请求结果
      yield put({
        type: "saveRejectContractData",
        payload: response
      });
    }
  },

  reducers: {
    saveContract(state, { payload }) {
      return {
        ...state,
        contractData: setContractData(payload)
      };
    },
    saveDetailContractData(state, { payload }) {
      return {
        ...state,
        detailData: commonContract(payload)
      };
    },
    saveContractData(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        saveData: payload,
        createStatus: _status
      };
    },
    saveSubmitContractData(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        submitData: payload,
        createStatus: _status
      };
    },
    savePassContractData(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        passData: payload,
        createStatus: _status
      };
    },
    saveRejectContractData(state, { payload }) {
      let _status = false;
      if (payload && payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        rejectData: payload,
        createStatus: _status
      };
    },
    setDetailStatus(state, { payload }) {
      return {
        ...state,
        detailStatus: payload.detailStatus
      };
    },
    setButtonStatus(state, { payload }) {
      return {
        ...state,
        buttonNumberStatus: payload.buttonNumberStatus
      };
    },

    clear() {
      return {
        contractData: [],
        detailData: [],
        createStatus: false,
        loading: false,

        //上传协议 和 修改协议
        detailStatus: 1, //1.上传协议 2.修改协议  3.审核协议  4.查看协议  （注释：当为1：不调取详情查询接口，其他状态调取详情接口）

        //审核 和 查看
        buttonNumberStatus: 1 //1:显示取消 2.显示 通过 驳回 取消
      };
    }
  }
};
