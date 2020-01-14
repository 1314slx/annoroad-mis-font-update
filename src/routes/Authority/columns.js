import React from "react";
import TooltipItem from "components/TooltipItem";
//权限管理所有表单的columns
export const UserManageColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
    width: "10%"
  },
  {
    title: "账户",
    dataIndex: "account",
    key: "account",
    width: "20%"
  },
  {
    title: "部门",
    dataIndex: "branch",
    key: "branch",
    width: "25%",
    render: text => <TooltipItem value={text} maxLength={20} />
  },
  {
    title: "职位",
    dataIndex: "position",
    key: "position",
    width: "10%"
  }
];
//角色权限管理
export const RoleManageColumns = [
  {
    title: "角色名称",
    dataIndex: "roleName",
    key: "roleName",
    width: "20%"
  },
  {
    title: "用户数",
    dataIndex: "userNum",
    key: "userNum",
    width: "10%"
  }
];
//谁在线上
export const OnlineManageColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "部门",
    dataIndex: "branch",
    key: "branch"
  },
  {
    title: "职位",
    dataIndex: "position",
    key: "position"
  },
  {
    title: "角色名称",
    dataIndex: "roleName",
    key: "roleName"
  }
];
