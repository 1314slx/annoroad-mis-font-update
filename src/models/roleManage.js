import {
  roleManageListData,
  peopleManageListData,
  saveRoleListData,
  saveRolesNavData,
  saveMenuNavData
} from "../mock/APPLY/powerManage/powerManage.js";
import {
  roleManageList,
  queryPeopleGroup,
  roleList,
  roleNavList,
  menuNavList,
  roleDelete, //删除角色
  roleSave,
  saveUserRole//给成员赋角色
} from "../services/powerManage";
export default {
  namespace: "roleManage",
  state: {
    groupData: {},
    groupPeopleData: {},
    saveRoleData: {},
    groupRoleNavData: [],
    groupMenuNavData: {},
    actionStatus: false //操作状态
  },

  effects: {
    *roleManageList({ payload }, { call, put }) {
      const response = yield call(roleManageList, payload);
      yield put({
        type: "saveGroupList",
        payload: response
      });
    },
    *queryPeopleGroup({ payload }, { call, put }) {
      const response = yield call(queryPeopleGroup, payload);
      //console.log("queryPeopleGroup", response);
      yield put({
        type: "savePeopleGroupList",
        payload: response
      });
    },
    *roleList({ payload }, { call, put }) {
      const response = yield call(roleList, payload);
      yield put({
        type: "saveRoleList",
        payload: response
      });
    },
    *roleNavList({ payload }, { call, put }) {
      const response = yield call(roleNavList, payload);
      yield put({
        type: "saveRoleNavList",
        payload: response
      });
    },
    *menuNavList({ payload }, { call, put }) {
      const response = yield call(menuNavList, payload);
      yield put({
        type: "savemenuNavList",
        payload: response
      });
    },
    //删除角色
    *roleDelete({ payload }, { call, put }) {
      const response = yield call(roleDelete, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },
    //保存角色
    *roleSave({ payload }, { call, put }) {
      const response = yield call(roleSave, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    },

    * saveUserRole({ payload }, { call, put }){
      const response = yield call(saveUserRole, payload);
      yield put({
        type: "saveActionStatus",
        payload: response
      });
    }

  },

  reducers: {
    saveGroupList(state, payload) {
      return {
        ...state,
        groupData: roleManageListData(payload.payload)
      };
    },
    savePeopleGroupList(state, payload) {
      return {
        ...state,
        groupPeopleData: peopleManageListData(payload.payload)
      };
    },
    saveRoleList(state, payload) {
      return {
        ...state,
        saveRoleData: saveRoleListData(payload.payload)
      };
    },
    saveRoleNavList(state, payload) {
      return {
        ...state,
        groupRoleNavData: saveRolesNavData(payload.payload)
      };
    },
    savemenuNavList(state, payload) {
      return {
        ...state,
        groupMenuNavData: saveMenuNavData(payload.payload)
      };
    },
    //设置当前操作状态
    saveActionStatus(state, { payload }) {
      let _status = false;
      if (payload.code === "000000") {
        _status = true;
      }
      return {
        ...state,
        actionStatus: _status
      };
    }
  }
};
