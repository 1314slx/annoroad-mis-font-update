

* ## 使用

- $ npm install
- $ npm start         # 访问 http://localhost:8000  访问地址和端口自己可配置

====================================================================

* ## 包结构

* ├── mock                     # 本地模拟数据（作为接口数据的改造层）
* ├── public
* │   └── favicon.ico          # Favicon
* ├── src
* │   ├── assets               # 本地静态资源
* │   ├── common               # 应用公用配置，如导航信息
* │   ├── components           # 业务通用组件
* │   ├── e2e                  # 集成测试用例
* │   ├── layouts              # 通用布局
* │   ├── models               # dva model
* │   ├── routes               # 业务页面入口和常用模板
* │   ├── services             # 后台接口服务
* │   ├── utils                # 工具库
* │   ├── g2.js                # 可视化图形配置
* │   ├── theme.js             # 主题配置
* │   ├── index.ejs            # HTML 入口模板
* │   ├── index.js             # 应用入口
* │   ├── index.less           # 全局样式
* │   └── router.js            # 路由入口
* ├── tests                    # 测试工具
* ├── README.md
* └── package.json

====================================================================

* ## 页面跳转
* this.props.dispatch(routerRedux.push('/assets/special-query'))
* this.props.history.push('/assets/special-query')

* ## 有关用户登录注册这块的东西没变，因现在项目不涉及，以后再改
* # 浏览器title 在utils.js BROWSER_TITLE 变量设置
