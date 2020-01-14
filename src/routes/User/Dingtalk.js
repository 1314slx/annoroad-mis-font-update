// import React, { Component } from "react";
// import config from "../../../config/index";
//
// /**
//  * 钉钉扫码登录
//  * */
// export default class Dingtalk extends Component {
//   componentDidMount() {
//     const _state = Date.now();
//     const _redirect_uri = config.redirect_uri;
//     const _apiid = config.apiid;
//     const _url = `https://oapi.dingtalk.com/connect/oauth2/sns_authorize?appid=${_apiid}&response_type=code&scope=snsapi_login&state=${_state}&redirect_uri=${_redirect_uri}`;
//
//     let obj = DDLogin({
//       id: "mdl_oos_login",
//       goto: encodeURIComponent(_url),
//       style: "border:none;background-color:#FFFFFF;padding-bottom:30px",
//       width: "365",
//       height: "320"
//     });
//     let handleMessage = function(event) {
//       let origin = event.origin;
//       console.log("origin", event.origin);
//       if (origin === "https://login.dingtalk.com") {
//         let loginTmpCode = event.data;
//         window.location.href = `${_url}&loginTmpCode=${loginTmpCode}`;
//       }
//     };
//     if (typeof window.addEventListener !== "undefined") {
//       window.addEventListener("message", handleMessage, false);
//     } else if (typeof window.attachEvent !== "undefined") {
//       window.attachEvent("onmessage", handleMessage);
//     }
//   }
//
//   render() {
//     return <div id="mdl_oos_login" />;
//   }
// }
