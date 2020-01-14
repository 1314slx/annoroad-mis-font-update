import fetch from "dva/fetch";
import { notification, message } from "antd";
import { routerRedux } from "dva/router";
import store from "../index";

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

/**
 * 请求方法（默认POST请求）
 * options.body : 存放请求参数
 */
export default function request(url, options) {
  // 获取用户token
  const token = localStorage.getItem("annoroad-token");
  const defaultOptions = {
    headers: { token: token, 'App-Version':"2.1.0" },
    method: options.method || "POST",
    body: options.body
  };

  if (defaultOptions.method === "POST" || defaultOptions.method === "PUT") {

    if (defaultOptions.body instanceof FormData) {
      defaultOptions.headers = {
        Accept: "application/json",
        "Content-Type": "multipart/form-data",
        ...defaultOptions.headers
      };
    } else {
      defaultOptions.headers = {
        Accept: "application/json",
        "Content-Type": "application/json; charset=utf-8",
        ...defaultOptions.headers
      };
      defaultOptions.body = JSON.stringify(defaultOptions.body);
    }

  }


  return fetch(url, defaultOptions)
    .then(checkStatus)
    .then(response => {
      //日志文件-get  其余post
      if (defaultOptions.method === "GET") {
        return response.text();
      } else {
        return response.json();
      }
      //return response.json();
    })
    .then(checkCode)
    .catch(handlerError);

  /**
   * 检查网络状态
   */
  function checkStatus(response) {
    if (response.status >= 200 && response.status < 300) {
      return response;
    }
    const errortext = codeMessage[response.status] || response.statusText;
    // console.log("1111",response)
    // console.log("0000",response.url.match('/sys/logs/MIS/'))
    // const _path = response.substring(0,63)
    if (response.url.match("/sys/logs/") && (response.status == "404")) {
      return;
    } else {
      notification.error({
        message: `请求错误 ${response.status}`,
        description: errortext
      });
      const error = new Error(errortext);
      error.name = response.status;
      error.response = response;
      throw error;
    }

  }

  /**
   * 检查接口返回code（在该方法处理通用code处理）
   */
  function checkCode(response) {
    if (response.code === "900101") {
      localStorage.clear();
      store.dispatch(routerRedux.push("/user/login"));
      // return;
    } else if (response.code === "900102" || response.code === "160106") {//160106
      message.error("抱歉，您没有当前权限，请联系管理员！",3);
      setTimeout(() => {
        store.dispatch(routerRedux.push("/"));
      }, 500);
      // return;
    }else if(response.code=="900000"){
      // notification.error({
      //   //message: "",
      //   description: "该版本已停用，工程师正在更新，请稍后使用"
      // });
      localStorage.clear();
      store.dispatch(routerRedux.push("/user/login"));

    }
    return new Promise((resolve, reject) => {
      resolve(response);
    });
  }

  /**
   * 处理异常（在该方法跳转异常页面）
   */
  function handlerError(e) {
    // console.log(e);
  }
}
