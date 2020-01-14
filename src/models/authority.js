import {
  userQuery,
  accountOpen,
  accountClose,
  onlineQuery,
  queryLogout,
  platformLoginClose,
  platformLoginOpen,
  roleQuery,
  roleDelete,
  pwdSave,
  userRoleSave,
  departmentList,
  platformModuleList,
  roleSave,
  roleModuleQuery
} from "../services/authority";

import {
  getUserData,
  roleOptionData,
  departmentData
} from "../mock/Authority/UserManage/index";
import { getOnlineData } from "../mock/Authority/OnlineManage/index";
import {
  getRoleData,
  getPlatformModuleList,
  getRoleModuleData
} from "../mock/Authority/RoleManage/index";

/**
 * 用户权限管理
 * */
export default {
  namespace: "authority",

  state: {
    userList: [], //用户数据列表
    actionStatus: false, //操作状态
    onlineList: [], //谁在线上
    roleList: [], //角色列表
    relationRoleList: [], //用户管理关联角色信息列表数据
    departmentList: [], //部门信息
    platformModuleList: [], //平台信息
    roleModuleData: [] //角色模块信息查询
  },

  effects: {
    *userQuery({ payload }, { call, put }) {
      const response = yield call(userQuery, payload);
      yield put({
        type: "saveUserList",
        payload: response
      });
    },
    *accountOpen({ payload }, { call, put }) {
      const response = yield call(accountOpen, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *accountClose({ payload }, { call, put }) {
      const response = yield call(accountClose, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *onlineQuery({ payload }, { call, put }) {
      const response = yield call(onlineQuery, payload);
      yield put({
        type: "saveOnlineList",
        payload: response
      });
    },
    *queryLogout(_, { call, put }) {
      const response = yield call(queryLogout);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *platformLoginClose({ payload }, { call, put }) {
      const response = yield call(platformLoginClose, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *platformLoginOpen({ payload }, { call, put }) {
      const response = yield call(platformLoginOpen, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *roleQuery({ payload }, { call, put }) {
      const response = yield call(roleQuery, payload);
      let _save = "";
      if (payload && payload.user_relation) {
        _save = "saveRelationRoleList";
      } else {
        _save = "saveRoleList";
      }
      yield put({
        type: _save,
        payload: response
      });
    },
    *roleDelete({ payload }, { call, put }) {
      const response = yield call(roleDelete, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *pwdSave({ payload }, { call, put }) {
      const response = yield call(pwdSave, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *userRoleSave({ payload }, { call, put }) {
      const response = yield call(userRoleSave, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *departmentList({ payload }, { call, put }) {
      const response = yield call(departmentList, payload);
      yield put({
        type: "saveDepartmentList",
        payload: response
      });
    },
    *platformModuleList({ payload }, { call, put }) {
      const response = yield call(platformModuleList, payload);
      yield put({
        type: "savePlatformModuleList",
        payload: response
      });
    },
    *roleSave({ payload }, { call, put }) {
      const response = yield call(roleSave, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    *roleModuleQuery({ payload }, { call, put }) {
      const response = yield call(roleModuleQuery, payload);
      yield put({
        type: "saveRoleModule",
        payload: response
      });
    }
  },

  reducers: {
    //设置用户列表数据
    saveUserList(state, { payload }) {
      return {
        ...state,
        userList: getUserData(payload)
      };
    },
    //设置当前操作状态
    saveActionStatus(state, { payload }) {
      let _status = false;
      if (payload.code === "0000") {
        _status = true;
      }
      return {
        ...state,
        actionStatus: _status
      };
    },
    //谁在线上数据保存
    saveOnlineList(state, { payload }) {
      return {
        ...state,
        onlineList: getOnlineData(payload)
      };
    },
    //角色列表数据保存
    saveRoleList(state, { payload }) {
      return {
        ...state,
        roleList: getRoleData(payload)
      };
    },
    //用户管理关联角色角色列表数据
    saveRelationRoleList(state, { payload }) {
      return {
        ...state,
        relationRoleList: roleOptionData(payload)
      };
    },
    //部门信息
    saveDepartmentList(state, { payload }) {
      return {
        ...state,
        departmentList: departmentData(payload)
      };
    },
    //平台模块信息保存
    savePlatformModuleList(state, { payload }) {
      return {
        ...state,
        platformModuleList: getPlatformModuleList(payload)
      };
    },
    //角色模块信息保存
    saveRoleModule(state, { payload }) {
      return {
        ...state,
        roleModuleData: getRoleModuleData(payload)
      };
    }
  }
};
