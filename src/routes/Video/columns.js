//工具管理列表信息
import React from "react";
import TooltipItem from "components/TooltipItem";
import { Badge, Tooltip } from "antd";
import LinkDownload from "../../components/LinkList/LinkDownload";
import DescriptionList from "components/DescriptionList";
const { Description } = DescriptionList;
import styles from "./style.less";
import { setParamsRules } from "../../utils/options";
import moment from "moment";


// 视频管理-视频主题
export const ListColumns = [
  {
    title: "视频主题",
    dataIndex: "name",
    key: "name"
  },
  {
    title: "视频类型",
    dataIndex: "typeName",
    key: "typeName"
  },
  {
    title: "子视频数",
    dataIndex: "count",
    key: "count"
  },
  {
    title: "隐私",
    dataIndex: "privacy",
    key: "privacy"
  },
  {
    title: "视频状态",
    dataIndex: "status",
    key: "status"
  },
  {
    title: "操作人",
    dataIndex: "updateByName",
    key: "updateByName"
  },
  {
    title: "上架时间",
    dataIndex: "upTime",
    key: "upTime"
  }
];


// 视频管理-视频主题
export const themeListColumns = [
  {
    title: "视频主题",
    dataIndex: "name",
    key: "name",
    width:'17%',
    render: (text, record) =>{
      return(
      <Tooltip title={record.name}>
        <span className={styles.tooltipSpan} >{record.name}</span>
      </Tooltip>
      )
    }
  },
  {
    title: "视频类型",
    dataIndex: "typeName",
    key: "typeName",
    render: (text, record) =>{
      return(
        <Tooltip title={record.typeName}>
          <span>{record.typeName}</span>
        </Tooltip>
      )
    }
  },
  {
    title: "子视频数",
    dataIndex: "count",
    key: "count",
    width:'8%'
  },
  {
    title: "隐私",
    dataIndex: "privacy",
    key: "privacy",
    width:'8%',
    render: (text, record) => {
      if (record.privacy==1) {
        return (
          <span className={styles.operatorSpan}>
           公开
          </span>
        )
      }else{
        return (
          <span className={styles.operatorSpan}>
           非公开
          </span>
        )
      }
    }
    //公开
  },
  {
    title: "视频状态",
    dataIndex: "status",
    key: "status",
    width:'9%',
    render: (text, record) => {
      if (record.status==1) {
        return (
          <span className={styles.operatorSpan}>
           未上架
          </span>
        )
      }else{
        return (
          <span className={styles.operatorSpan}>
           上架
          </span>
        )
      }
    }
  },
  {
    title: "操作人",
    dataIndex: "updateByName",
    key: "updateByName",
    width:'9%',
  },
  {
    title: "上架时间",
    dataIndex: "upTime",
    key: "upTime",
    width:'15%',
    /*sorter: (a, b) => a.upTime.length - b.upTime.length*/
    sorter: (a, b) => a.address - b.address,
    /*sorter: (a, b) => a.address.length - b.address.length,
    sortOrder: sortedInfo.columnKey === 'address' && sortedInfo.order,*/

    render: (text, record) => {
      return <span>{record.upTime?moment(record.upTime).format('YYYY-MM-DD HH:mm'):"-"}</span>
    }
  }
];
