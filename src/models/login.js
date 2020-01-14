import { routerRedux } from "dva/router";
import { login, loginDingDing } from "../services/api";
import { setAuthority, setToken, removeItem } from "../utils/authority";
import { reloadAuthorized } from "../utils/Authorized";

export default {
  namespace: "login",

  state: {
    status: undefined
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(login, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      // Login successfully
      if (response && response.code === "000000") {
        reloadAuthorized();
        window.localStorage.setItem("annoroad-token", response.data.token);
        yield put(routerRedux.push("/Dashboard"));
      }
    },
   /* *loginDingDing({ payload }, { call, put }) {
      const response = yield call(loginDingDing, payload);
      yield put({
        type: "changeLoginStatus",
        payload: response
      });
      // Login successfully
      //console.log('loginDingDing', response);
      if (response && response.code === "000000") {
        reloadAuthorized();
        window.location.href = window.location.origin + "/";
        //yield put(routerRedux.push('/'));
      }
      /!*if (response && response.status === 'ok') {
        reloadAuthorized();
        /!*window.location.search = '';
        window.location.href.replace('?', '');*!/
        window.location.href = window.location.origin + '/';
        //yield put(routerRedux.push('/'));
      }*!/
    },*/
    *logout(_, { put, select }) {
      try {
        //不记录当前从哪退出，根据权限
        // get location pathname
        /*const urlParams = new URL(window.location.href);
        const pathname = yield select(state => state.routing.location.pathname);
        // add the parameters in the url
        urlParams.searchParams.set('redirect', pathname);
        window.history.replaceState(null, 'login', urlParams.href);*/
      } finally {
        yield put({
          type: "changeLoginStatus",
          payload: {
            status: false,
            currentAuthority: "guest"
          }
        });
        reloadAuthorized();
        //清除token
        sessionStorage.clear();
        //removeItem('token');
        yield put(routerRedux.push("/user/login"));
      }
    }
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      let _status = "error";
      let _user = "";
      if (payload && payload.hasOwnProperty("status")) {
        _status = payload["status"];
      }
      if (payload && payload.hasOwnProperty("currentAuthority")) {
        _user = payload["currentAuthority"];
      }
      //登录成功后存token
      if (payload && payload.code === "000000") {
        _user = "admin";
        setToken(payload.body.token);
        _status = "ok";
      }
      setAuthority(_user);
      //setAuthority(payload.currentAuthority);
      return {
        ...state,
        status: _status,
        //status: 'ok',
        type: "account"
      };
    }
  }
};
