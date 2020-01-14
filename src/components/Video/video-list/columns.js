//应用管理-我的工具
import { Progress, Tooltip } from "antd";
import styles from "../../../routes/APPLY/style.less";
import React from "react";
import { durationToTime, timestampToTime } from "../../../utils/utils";
import moment from "moment";
export const themeVideoColumns = [
  {
    title: "排序",
    dataIndex: "sort",
    key: "sort",
    width:'8%',
  },
  {
    title: "视频名称",
    dataIndex: "name",
    key: "name",
    width:'8%',
    render: (text, record) => {
      return (<Tooltip title={record.name}>
        <span>{record.name}</span>
      </Tooltip>);
    }
  },
  {
    title: "讲师",
    dataIndex: "lecturer",
    key: "lecturer",//
    width:'15%',
    render: (text, record) => {
      return  record.lecturer ? (<Tooltip title={record.lecturer}>
        <span>{record.lecturer}</span>
      </Tooltip>) : "-";
    }
  },
  {
    title: "时长",
    dataIndex: "duration",
    key: "duration",
    width:'10%',
    render: (text, record) => {
      return  record.duration && record.duration > 0 ? durationToTime(record.duration) : "-";
    }
  },
  {
    title: "上传时间",
    dataIndex: "createTime",
    key: "createTime",
    width:'15%',
    render: (text, record) => {
      // return  record.createTime ? timestampToTime(record.createTime, text, 2) : "-";
      return  record.createTime?moment(record.createTime).format('YYYY-MM-DD HH:mm'):"-";
    }
  },
  {
    title: "上传进度",
    dataIndex: "percent",
    key: "percent",
    width:'15%',
    render: (text, record) => {
      return  record.percent ? <Progress percent={record.percent}/> : <Progress percent={100}/>;
    }
  }
];
