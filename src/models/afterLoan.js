import { getQueryLoanList, getQueryRepaymentList } from "../services/afterLoan";

import { setLoanListData } from "../dataLayer/AfterLoan/queryLoanListPage";
import { setRepaymentListData } from "../dataLayer/AfterLoan/queryRepaymentListPage";

export default {
  namespace: "afterLoan",
  state: {
    loading: false,
    loanListData: [],
    repaymentListData: []
  },

  effects: {
    //放款列表
    *queryLoanListPage({ payload }, { call, put }) {
      const response = yield call(getQueryLoanList, payload);
      yield put({
        type: "saveLoanList",
        payload: response
      });
    },

    //还款列表
    *queryRepaymentListPage({ payload }, { call, put }) {
      const response = yield call(getQueryRepaymentList, payload);
      yield put({
        type: "saveRepaymentList",
        payload: response
      });
    }
  },
  reducers: {
    saveLoanList(state, { payload }) {
      return {
        ...state,
        loanListData: setLoanListData(payload)
      };
    },
    saveRepaymentList(state, { payload }) {
      return {
        ...state,
        repaymentListData: setRepaymentListData(payload)
      };
    },

    clear() {
      return {
        loading: false,
        loanListData: [],
        repaymentListData: []
      };
    }
  },
  subscriptions: {}
};
