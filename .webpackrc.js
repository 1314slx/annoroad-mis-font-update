const path = require("path");
//git commit --no-verify -m "修改"
export default {
  entry: "src/index.js",
  extraBabelPlugins: [
    ["import", { libraryName: "antd", libraryDirectory: "es", style: true }]
  ],
  env: {
    development: {
      extraBabelPlugins: ["dva-hmr"]
    }
  },
  alias: {
    components: path.resolve(__dirname, "src/components/")
  },
  ignoreMomentLocale: true,
  theme: "./src/theme.js",
  html: {
    template: "./src/index.ejs"
  },
  disableDynamicImport: true,
  publicPath: "",
  hash: true,
  proxy: {

    "/annoroad-cloud-mis-server": {
      //target: "http://localhost:60002", //目标主机
      // target: "http://40.73.36.226:60002", //测试环境-目标主机
      target: "http://dev-c.annuoyun.net", //开发环境
      // target: "http://192.168.12.87:60002", //目标主机  本地环境 36.226
      changeOrigin: true, // 需要虚拟主机站点
      ws: true, //是否代理websocket
      secure: false
      // pathRewrite: {"^/crm": ""} 异常
    },


    "/annoroad-sso": {
      //target: "http://localhost:60003", //目标主机
      // target: "http://40.73.36.226:60003", //测试环境-目标主机
      target: "http://dev-c.annuoyun.net", //开发环境
      // target: "http://40.73.38.231:60003", //开发环境-目标主机
      changeOrigin: true, // 需要虚拟主机站点
      ws: true, //是否代理websocket
      secure: false
      // pathRewrite: {"^/crm": ""} 异常
    }
  }
};
