import { createElement } from "react";
import dynamic from "dva/dynamic";

let routerDataCache;

const modelNotExisted = (app, model) =>
  // eslint-disable-next-line
  !app._models.some(({ namespace }) => {
    return namespace === model.substring(model.lastIndexOf("/") + 1);
  });

// wrapper of dynamic
const dynamicWrapper = (app, models, component) => {
  // transformed by babel-plugin-dynamic-import-node-sync
  if (component.toString().indexOf(".then(") < 0) {
    models.forEach(model => {
      if (modelNotExisted(app, model)) {
        // eslint-disable-next-line
        app.model(require(`../models/${model}`).default);
      }
    });
    return props => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return createElement(component().default, {
        ...props,
        routerData: routerDataCache
      });
    };
  }
  return dynamic({
    app,
    models: () =>
      models
        .filter(model => modelNotExisted(app, model))
        .map(m => import(`../models/${m}.js`)),
    // add routerData prop
    component: () => {
      if (!routerDataCache) {
        routerDataCache = getRouterData(app);
      }
      return component().then(raw => {
        const Component = raw.default || raw;
        return props =>
          createElement(Component, {
            ...props,
            routerData: routerDataCache
          });
      });
    }
  });
};

export const getRouterData = app => {

  const getShowRouter = {
    //用户权限管理
    "/userauthority/user-manage": {
      component: dynamicWrapper(app, ["authority"], () =>
        import("../routes/Authority/UserManage/index")
      )
    },
    "/userauthority/role-manage": {
      component: dynamicWrapper(app, ["authority"], () =>
        import("../routes/Authority/RoleManage/index")
      )
    },
    "/userauthority/new-role": {
      component: dynamicWrapper(app, ["authority"], () =>
        import("../routes/Authority/RoleManage/NewRole")
      )
    },
    "/userauthority/online-manage": {
      component: dynamicWrapper(app, ["authority"], () =>
        import("../routes/Authority/OnlineManage/index")
      )
    },

    "/apply/toolsType": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/ToolsType")
      )
    },

    "/apply/toolsManager": {
      component: dynamicWrapper(app, ["toolsManager"], () =>
        import("../routes/APPLY/Tools/ToolsManager")
      )
    },
    "/apply/myTools": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/MyTools")
      )
    },
    "/apply/tool/preview": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/ToolsDetail")
      )
    },
    "/apply/tool/test": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/ToolsDetail")
      )
    },
    "/apply/tool/rate": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/ToolsRate")
      )
    },
    "/apply/editMyTools": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/EditMyTools")
      )
    },
    "/apply/submitMyTools": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/submitMyTools")
      )
    },
    "/apply/deployTest": {
      component: dynamicWrapper(app, ["deployTest"], () =>
        import("../routes/APPLY/Tools/DeployTest")
      )
    },
    "/apply/examine": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/Examine")
      )
    },
    "/apply/examineTest": {
      component: dynamicWrapper(app, ["examine"], () =>
        import("../routes/APPLY/Tools/ExamineTest")
      )
    },
    "/apply/taskTest": {
      component: dynamicWrapper(app, ["taskTest"], () =>
        import("../routes/APPLY/Tools/TaskTest")
      )
    },

   /* component: dynamicWrapper(app, ["failTask"], () =>
      import("../routes/SYSTEM/Data/FailTaskRate")*/

    "/apply/taskTestRate": {
      component: dynamicWrapper(app, ["failTask"], () =>
        import("../routes/SYSTEM/Data/FailTaskRate")
      )
    },/*
    "/apply/taskTestRate": {
      component: dynamicWrapper(app, ["taskTest"], () =>
        import("../routes/APPLY/Tools/TaskTestRate")
      )
    },*/
    "/apply/dataManager": {
      component: dynamicWrapper(app, ["dataManager"], () =>
        import("../routes/APPLY/DataManager/DataManager")
      )
    },
    "/system/userList": {
      component: dynamicWrapper(app, ["userList"], () =>
        import("../routes/SYSTEM/User/UserList")
      )
    },
    "/video/type-list": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/VideoTypeList")
      )
    },
    "/video/theme-list": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/ThemeList")
      )
    },
    "/video/theme-add": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/ThemeAdd")
      )
    },
    "/data/toolsStatistics": {
      component: dynamicWrapper(app, ["toolsStatistics"], () =>
        import("../routes/SYSTEM/Data/ToolsStatistics")
      )
    },
    "/data/failTask": {
      component: dynamicWrapper(app, ["failTask"], () =>
        import("../routes/SYSTEM/Data/FailTask")
      )
    },
    "/data/failTaskRate": {
      component: dynamicWrapper(app, ["failTask"], () =>
        import("../routes/SYSTEM/Data/FailTaskRate")
      )
    },

    "/helpCenter/issueBack": {
      component: dynamicWrapper(app, ["issueBack"], () =>
        import("../routes/SYSTEM/HelpCenter/IssueBack")
      )
    },

    "/powerManage/peopleManage": {
      component: dynamicWrapper(
        app,
        ["peopleManage"],
        () => import("../routes/SYSTEM/PowerManage/PeopleManage") //成员管理
      )
    },
    "/powerManage/roleManage": {
      component: dynamicWrapper(
        app,
        ["roleManage"],
        () => import("../routes/SYSTEM/PowerManage/RoleManage") //角色管理
      )
    },
    "/powerManage/roleManageEdit": {
      component: dynamicWrapper(app, ["roleManage"], () =>
        import("../routes/SYSTEM/PowerManage/RoleManageEdit")
      )
    }
  };

  /*Dashboard+应用管理*/
  const getAPPLYRouter = {
    //Dashboard页面
    "/Dashboard": {
      name: "Dashboard",
      component: dynamicWrapper(app, ["issueBack"], () =>
        import("../routes/APPLY/Dashboard/Dashboard")
      )
    },
    /*应用管理*/
    "/apply/toolsType": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/ToolsType")
      )
    },
    "/apply/toolsManager": {
      component: dynamicWrapper(app, ["toolsManager"], () =>
        import("../routes/APPLY/Tools/ToolsManager")
      )
    },
    "/apply/myTools": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/MyTools")
      )
    },
    "/apply/deployTest": {
      component: dynamicWrapper(app, ["deployTest"], () =>
        import("../routes/APPLY/Tools/DeployTest")
      )
    },
    "/apply/examine": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/Examine")
      )
    },
    "/apply/examineTest": {
      component: dynamicWrapper(app, ["examine"], () =>
        import("../routes/APPLY/Tools/ExamineTest")
      )
    }
  };

  const getAPPLICATIONRouter = {
    //应用中心-我的任务-列表
    // 应用中心-工具权限
    "/application/authority": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/Application/Tools/Authority")
      )
    },
    // 应用中心-分析工具
    "/application/tools": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/Application/Tools/Tools")
      )
    },
    "/application/tool/analysis": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/ToolsDetail")
      )
    },

    "/application/tool/rate": {
      component: dynamicWrapper(app, ["myTools"], () =>
        import("../routes/APPLY/Tools/ToolsRate")
      )
    },
    // 应用中红心-我的数据
    "/application/myData": {
      component: dynamicWrapper(app, ["dataManager"], () =>
        import("../routes/Application/MyData/MyData")
      )
    },

   /* "/apply/examine": {
      component: dynamicWrapper(app, ["toolsType"], () =>
        import("../routes/APPLY/Tools/Examine")
      )
    },*/
  };
  const getSYSTEMRouter = {
    //我的任务
    "/task/find": {
      component: dynamicWrapper(app, ["taskTest"], () =>
        import("../routes/APPLY/Tools/TaskTest")
      )
    },
    //我的任务详情
    "/task/detail": {
      component: dynamicWrapper(app, ["failTask"], () =>
        import("../routes/SYSTEM/Data/FailTaskRate")
      )
    },
    //系统管理
    "/system/userList": {
      component: dynamicWrapper(app, ["userList"], () =>
        import("../routes/SYSTEM/User/UserList")
      )
    },
    "/video/type-list": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/VideoTypeList")
      )
    },
    "/video/theme-list": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/ThemeList")
      )
    },
    "/video/theme-add": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/ThemeAdd")
      )
    },
    "/video/theme-check": {
      component: dynamicWrapper(app, ["video"], () =>
        import("../routes/Video/ThemeCheck")
      )
    },
    "/data/toolsStatistics": {
      component: dynamicWrapper(app, ["toolsStatistics"], () =>
        import("../routes/SYSTEM/Data/ToolsStatistics")
      )
    },
    "/data/failTask": {
      component: dynamicWrapper(app, ["failTask"], () =>
        import("../routes/SYSTEM/Data/FailTask")
      )
    },
    "/helpCenter/issueBack": {
      component: dynamicWrapper(app, ["issueBack"], () =>
        import("../routes/SYSTEM/HelpCenter/IssueBack")
      )
    },
    "/powerManage/peopleManage": {
      component: dynamicWrapper(app, ["roleManage"], () =>
        import("../routes/SYSTEM/PowerManage/PeopleManage")
      )
    },
    "/powerManage/roleManage": {
      component: dynamicWrapper(app, ["roleManage"], () =>
        import("../routes/SYSTEM/PowerManage/RoleManage")
      )
    }
  };

  //默认不变的路由
  const routerConfig = {
    /*
      * 默认路由
      * */
    "/": {
      component: dynamicWrapper(app, ["user", "login"], () =>
        import("../layouts/BasicLayout")
      )
    },
    "/user": {
      component: dynamicWrapper(app, [], () => import("../layouts/UserLayout"))
    },

    // "/manage": {
    //   component: dynamicWrapper(app, [], () =>
    //     import("../layouts/ManagementModule")
    //   )
    // },
    // "/Dashboard": {
    //   component: dynamicWrapper(app, [], () =>
    //     import("../routes/APPLY/Dashboard/Dashboard")
    //   )
    // },

    //TODO  新增加路由此处填写  配置地址 、models、引入routers 地址
    ...getShowRouter,
    ...getAPPLYRouter,
    ...getAPPLICATIONRouter,
    ...getSYSTEMRouter,

    /*
      *
      * 异常处理路由
      *
      * 用户注册登录注册结果
      *
      * 保留antd-pro原有的
      * */
    "/exception/403": {
      component: dynamicWrapper(app, [], () =>
        import("../routes/Exception/403")
      )
    },
    "/exception/404": {
      component: dynamicWrapper(app, [], () =>
        import("../routes/Exception/404")
      )
    },
    "/exception/500": {
      component: dynamicWrapper(app, [], () =>
        import("../routes/Exception/500")
      )
    },
    "/exception/trigger": {
      component: dynamicWrapper(app, ["error"], () =>
        import("../routes/Exception/triggerException")
      )
    },

    "/user/login": {
      component: dynamicWrapper(app, ["login"], () =>
        import("../routes/User/Login")
      )
    },
    "/user/register": {
      component: dynamicWrapper(app, ["register"], () =>
        import("../routes/User/Register")
      )
    },
    "/user/register-result": {
      component: dynamicWrapper(app, [], () =>
        import("../routes/User/RegisterResult")
      )
    }
  };
  return routerConfig;
};
