//工具管理列表信息
import React from "react";
import TooltipItem from "components/TooltipItem";
import { Badge, Tooltip } from "antd";
import LinkDownload from "../../components/LinkList/LinkDownload";
import DescriptionList from "components/DescriptionList";
const { Description } = DescriptionList;
import styles from "./../APPLY/style.less";
import moment from "moment";
import { setParamsRules } from "../../utils/options";

const screenWidth = window.screen.width;

/*应用中心-工具权限*/
export const authorityColumns = [
  {
    title: "工具名称",
    dataIndex: "toolName",
    key: "toolName",
    render: (text, record) => {
      return (<Tooltip title={record.toolName}>
        <span className={styles.tooltipSpan}>{record.toolName}</span>
      </Tooltip>);
    }
  },
  {
    title: "工具类型",
    dataIndex: "toolTypeName",
    key: "toolTypeName",
    render: (text, record) => {
      return (<Tooltip title={record.toolTypeName}>
        <span className={styles.tooltipSpan}>{record.toolTypeName}</span>
      </Tooltip>);
    }
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
  },
  {
    title: "操作人",
    dataIndex: "operatorByName",
    key: "operatorByName",
    render: (text, record) => {
      return (
        <span>{record.operatorByName ? record.operatorByName : "-"}</span>
      );
    }
  },
  {
    title: "操作时间",
    dataIndex: "operatorTime",
    key: "operatorTime",
    render: (text, record) => {
      return (
        <span>{record.operatorTime ? moment(record.operatorTime).format("YYYY-MM-DD HH:mm") : "-"}</span>
      );
    }
  }
];

