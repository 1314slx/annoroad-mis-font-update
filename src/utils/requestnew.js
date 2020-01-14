import fetch from "dva/fetch";
import { notification } from "antd";
import { routerRedux } from "dva/router";
import store from "../index";
import CryptoJS from "crypto-js";

const codeMessage = {
  200: "服务器成功返回请求的数据。",
  201: "新建或修改数据成功。",
  202: "一个请求已经进入后台排队（异步任务）。",
  204: "删除数据成功。",
  400: "发出的请求有错误，服务器没有进行新建或修改数据的操作。",
  401: "用户没有权限（令牌、用户名、密码错误）。",
  403: "用户得到授权，但是访问是被禁止的。",
  404: "发出的请求针对的是不存在的记录，服务器没有进行操作。",
  406: "请求的格式不可得。",
  410: "请求的资源被永久删除，且不会再得到的。",
  422: "当创建一个对象时，发生一个验证错误。",
  500: "服务器发生错误，请检查服务器。",
  502: "网关错误。",
  503: "服务不可用，服务器暂时过载或维护。",
  504: "网关超时。"
};

//处理返回
function checkStatus(response) {
  if (response.status >= 200 && response.status < 300) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [options] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default function request(url, options) {
  /**
   *
   * 调用 CryptoJS 的Encrypt方法进行加密
   * @type {string}
   */
  const secret = (9999999999999999 - Date.now()).toString();
  const encryptData = Encrypt(JSON.stringify(options.body), secret);

  const newOptions = {
    method: "POST",
    body: {
      client_id: "1234",
      data: encryptData
    }
  };
  //设置请求体
  if (newOptions.method === "POST" || newOptions.method === "PUT") {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...newOptions.headers,
        'App-Version':"2.1.0"
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        ...newOptions.headers,
        'App-Version':"2.1.0"
      };
    }
  }
  //console.log("---------lixin:", newOptions);

  //发送请求
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => {
      //暂时无用
      if (options.method === "DELETE" || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .catch(e => {
      const { dispatch } = store;
      const status = e.name;
      if (status === 401) {
        dispatch({
          type: "login/logout"
        });
        return;
      }
      if (status === 403) {
        dispatch(routerRedux.push("/exception/403"));
        return;
      }
      if (status <= 504 && status >= 500) {
        dispatch(routerRedux.push("/exception/500"));
        return;
      }
      if (status >= 404 && status < 422) {
        dispatch(routerRedux.push("/exception/404"));
      }
    });
}

//加密方法ßß
function Encrypt(data) {
  const key = CryptoJS.enc.Utf8.parse("9998487963031416");
  const srcs = CryptoJS.enc.Utf8.parse(JSON.stringify(data));
  const encrypted = CryptoJS.AES.encrypt(srcs, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7
  });
  return encrypted.toString();
}
