import { Badge, Tooltip } from "antd";
import React from "react";
import styles from "../APPLY/style.less";
import moment from "moment";
/*测试任务*/
export const userListColumns = [
  {
    title: "用户ID",
    dataIndex: "userId",
    key: "userId"
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },
  {
    title: "用户名",
    dataIndex: "loginName",
    key: "loginName"
  },
  {
    title: "手机号",
    dataIndex: "mobile",
    key: "mobile"
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email"
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },

  {
    title: "邮箱验证",
    dataIndex: "emailAuth",
    key: "emailAuth",
    render: (text, record) => {
      if (record.emailAuth == 1) {
        return <span>已认证</span>;
      } else {
        return (
          <span>
            未认证<br />{" "}
          </span>
        );
      }
    }
  },
  {
    title: "注册时间",
    dataIndex: "createTime",
    key: "createTime",
    render:(text,record) => {
      return <span>{record.createTime?moment(record.createTime).format('YYYY-MM-DD HH:mm'):"-"}</span>
    }

  }
];

/*工具统计*/
export const toolsStatisticsColumns = [
  {
    title: "工具名称",
    dataIndex: "toolName",
    key: "toolName",
    width: "32%",
  },
  {
    title: "工具类型",
    dataIndex: "typeName",
    key: "typeName",
    width: "22%"
  },
  /* {
    title: "当前版本",
    dataIndex: "version",
    key: "version"
  },*/
  {
    title: "使用次数",
    dataIndex: "userCount",
    key: "userCount",
    width: "26%"
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },
  {
    title: "首次上架时间",
    dataIndex: "startTime",
    key: "startTime",
    render:(text,record)=>{
      return <span>{record.startTime?moment(record.startTime).format("YYYY-MM-DD HH:mm"):"-"}</span>
    }
  }
];

/*失败任务*/
export const failTaskColumns = [
  {
    title: "任务",
    dataIndex: "name",
    key: "name",
    width:"35%",
    render:(text,record)=>{
      return <Tooltip title={record.name}>
        <span className={styles.textOver}>{record.name}</span>
      </Tooltip>
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },
  {
    title: "提交时间",
    dataIndex: "startTime",
    key: "startTime",
    width:"20%",
    render:(text,record)=>{
      return <span>{record.startTime?moment(record.startTime).format("YYYY-MM-DD HH:mm:ss"):"-"}</span>
    }
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    key: "endTime",
    width:"20%",
    render:(text,record)=>{
      return <span>{record.endTime?moment(record.endTime).format("YYYY-MM-DD HH:mm:ss"):"-"}</span>
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    width:"12%",
    render: (text, record) => {
      if (record.status == 1) {
        return <Badge status="warning" text="排队中" />;
      } else if (record.status == 2) {
        return <Badge status="processing" text="执行中" />;
      } else if (record.status == 3) {
        return <Badge status="success" text="成功" />;
      } else {
        return <Badge status="error" text="失败" />;
      }
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  }
];

/*帮助中心/问题反馈*/
export const issueBackColumns = [
 /* {
    title: "ID",
    dataIndex: "id",
    key: "id"
  },*/
  {
    title: "用户ID",
    dataIndex: "userId",
    key: "userId"
  },
  {
    title: "手机号",
    dataIndex: "mobile",
    key: "mobile"
  },
  {
    title: "提交时间",
    dataIndex: "submitTime",
    key: "submitTime",
    render:(text,record)=>{
      return <span>{record.submitTime?moment(record.submitTime).format("YYYY-MM-DD HH:mm"):"-"}</span>
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (record.status === 1) {
        return <span>未读</span>;
      } else if (record.status === 2) {
        return <span>已读</span>;
      }
    }
  },
  {
    title: "操作人",
    dataIndex: "operatorName",
    key: "operatorName"
  },
  {
    title: "操作时间",
    dataIndex: "operateTime",
    key: "operateTime",
    render: (text, record) => {
      if (record.status === 1) {
        return <span></span>;
      } else if (record.status === 2) {
        // return <span>{record.operateTime}</span>;
        return <span>{record.operateTime?moment(record.operateTime).format("YYYY-MM-DD HH:mm"):"-"}</span>
      }
    }
  }
]; /*成员管理*/ /*
export const peopleManageColumns = [
  {
    title: "用户名",
    dataIndex: "loginName",
    key: "loginName",
  },
  {
    title: "姓名",
    dataIndex: "userName",
    key: "userName",
  },
  {
    title: "邮箱",
    dataIndex: "email",
    key: "email"
  },
  {
    title: "部门",
    dataIndex: "department",
    key: "department",
  },
  {
    title: "职位",
    dataIndex: "job",
    key: "job",
  },
  {
    title: "角色",
    dataIndex: "roles",
    key: "roles",
    render: (text, record) => {
      if(record.roles){
        return record.roles.map((value, index) => {
          return ( <span className={styles.operatorSpan}>{value.roleName}<i>、</i></span> );
        })
      }
    }
  },

];*/

/*成员管理*/ export const peopleManageColumns = [
  {
    title: "用户名",
    dataIndex: "loginName",
    key: "loginName"
    //editable: false
  },
  {
    title: "姓名",
    dataIndex: "userName",
    key: "userName"
    // editable: false
  },
  {
    title: "邮箱",
    dataIndex: "email"
    // editable: false
  },
  {
    title: "部门",
    dataIndex: "department"
    // editable: false
  },
  {
    title: "职位",
    dataIndex: "job"
    //editable: false
  }
  /* {
    title: "角色",
    dataIndex: "roles",
    key: "roles",
    //editable: true,
    render: (text, record) => {
      if (record.roles) {
        return record.roles.map((value, index) => {
          return (
            <span className={styles.operatorSpan}>
              {value.roleName}
              <i>、</i>
            </span>
          );
        });
      }
    }
  }*/
];

/*角色管理*/
export const roleManageColumns = [
  {
    title: "code",
    dataIndex: "code",
    key: "code",
    display: "none"
  },
  {
    title: "角色名称",
    dataIndex: "name",
    key: "name",
    // width:"10%"
  },
  {
    title: "用户数",
    dataIndex: "userCount",
    key: "userCount",
    // width:"10%"
  },
  {
    title: "描述",
    dataIndex: "remarks",
    key: "remarks",
    // width:"40%",
    render:(text,record)=>{
      return  <Tooltip title={record.remarks}>
        <span className={styles.maxWord}>{record.remarks}</span>
      </Tooltip>
    }
  },
  {
    title: "操作人",
    dataIndex: "updateByName",
    key: "updateByName",
    // width:"8%",
  },
  {
    title: "操作时间",
    dataIndex: "updateTime",
    key: "updateTime",
    render:(text,record)=>{
      return <span>{record.updateTime?moment(record.updateTime).format('YYYY-MM-DD HH:mm'):"-"}</span>
    }
    // width:"8%"
  }
];
