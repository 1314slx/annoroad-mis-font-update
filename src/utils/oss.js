import OSS from "ali-oss";
import $ from "jquery";
import { notification } from "antd";
import store from "../index";
import { routerRedux } from "dva/router";

/**
 * 获取OSS客户端连接
 */
export function getOssClient(times = 0) {
  if (times >= 10) {
    notification.error({
      message: "获取授权失败",
      description: "获取授权失败"
    });
    return;
  }
  let data = null;
  $.ajax({
    url: "/annoroad-cloud-mis-server/data/assume/role",
    type: "post",
    async: false,
    headers: { token: localStorage.getItem("annoroad-token"), 'App-Version':"2.1.0" },
    success: function(result) {
      data = result;
    },
    error: function() {
      return getOssClient(++times);
    }
  });
  if (data && data.code == "900101") {
    localStorage.clear();
    store.dispatch(routerRedux.push("/user/login"));
    return;
  }
  if (data && data.data) {
    return new OSS({
      endpoint: data.data.endpoint,
      accessKeyId: data.data.accessKeyId,
      accessKeySecret: data.data.accessKeySecret,
      stsToken: data.data.securityToken,
      bucket: data.data.bucketName
    });
  }
  return getOssClient(++times);
}



