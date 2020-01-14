import React from "react";
import TooltipItem from "../../../components/TooltipItem";
import { Icon } from "antd";
import styles from "./styles.less";
export const icon = (record) => {
  if (record.isDirectory == 2) {
    return <Icon type="file" style={{ marginRight: "5px" }} className={styles.fileNameIcon}/>;
  } else {
    return <Icon type="folder" style={{ marginRight: "5px" }} className={styles.fileNameIcon}/>;
  }
};
export const dataManagerColumns = (params) => {
  const columns = [
    {
      // icon: <Icon type="file" />,
      title: "文件名",
      dataIndex: "file_name",
      key: "fileName",
      width: "65%",
      render: (text, record) => {
        if (record.isDirectory == 1) {
          return <span style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42}
                                        canDownload={record.canDownload}/></span>;
        }else{
          return <span onClick={(e) => params.current.preview(e, record)} style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42}
                                        canDownload={record.canDownload}/></span>;
        }
      }
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "15%"
    },
    {
      title: "修改日期",
      dataIndex: "time",
      key: "time",
      width: "20%"
    }
  ];
  return columns;
};

export const dataManagerColumnsSearch = (params) => {
  const search = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "fileName",
      width: "55%",
      // render: (text, record) => <span>{icon(record)}<TooltipItem value={record.file_name} maxLength={25}/></span>
      render: (text, record) => {
        if (record.isDirectory == 1) {
          return <span style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42}
                                        canDownload={record.canDownload}/></span>;
        }else{
          return <span onClick={(e) => params.current.preview(e, record)} style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42}
                                        canDownload={record.canDownload}/></span>;
        }
      }
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "15%"
    },
    {
      title: "修改日期",
      dataIndex: "time",
      key: "time",
      width: "15%"
    },
    {
      title: "所在目录",
      dataIndex: "path",
      key: "path",
      width: "15%",
      render: (text, record) => {
        if (record.path) {
          //<TooltipItem value={record.file_name} maxLength={25}
          return record.path && record.path.indexOf("/") == -1 ? <a style={{color:"#1890ff"}} onClick={(e) => params.current.clickRow(e, record,1)}><TooltipItem value={record.path} maxLength={10} /></a> : <a
            onClick={(e) => params.current.clickRow(e, record,1)} style={{color:"#1890ff"}}><TooltipItem proColor ="1890ff" value={record.path != null ? record.path.substring(record.path.lastIndexOf("/") + 1, record.path.length) : ""} maxLength={15} /></a>;
        }
      }
    }];
  return search;
};

export const dataManagerColumnsCopy = (that) => {

  const columns = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "fileName",
      width: "60%",
      render: (text, record) => {
        if (record.isDirectory == 1) {
          return <span style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42} canDownload={record.canDownload}/></span>
        }else{
        return <span onClick={(e) => that.file.current.preview(e, record)} style={{
          color: record.canDownload && "#1890ff",
          cursor: record.canDownload && "pointer"
        }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42} canDownload={record.canDownload}/></span>
        }
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "10%",
      render: (text, record) => record.isDirectory == 2 ?
        <a onClick={() => that.copy(that.props.dataManager.currentPath + "/" + record.file_name)}>复制链接</a> :
        <span></span>
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "15%"
    },
    {
      title: "修改日期",
      dataIndex: "time",
      key: "time",
      width: "15%"
    }
  ];

  return columns;

};

export const dataManagerColumnsCopySearch = (that, params) => {

  const search = [
    {
      title: "文件名",
      dataIndex: "file_name",
      key: "fileName",
      width: "45%",
      // render: (text, record) => <span>{icon(record)}<TooltipItem value={record.file_name} maxLength={25}/></span>
      render: (text, record) => {
        if (record.isDirectory == 1) {
          return <span style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42} canDownload={record.canDownload}/></span>
        }else{
          return <span onClick={(e) => that.file.current.preview(e, record)} style={{
            color: record.canDownload && "#1890ff",
            cursor: record.canDownload && "pointer"
          }}>{icon(record)}<TooltipItem value={record.file_name} maxLength={42} canDownload={record.canDownload}/></span>
        }
      }
    },
    {
      title: "操作",
      dataIndex: "operation",
      key: "operation",
      width: "10%",
      render: (text, record) => record.isDirectory == 2 ?
        <a onClick={() => that.copy(that.props.dataManager.currentPath + "/" + record.file_name)}>复制链接</a> :
        <span></span>
    },
    {
      title: "大小",
      dataIndex: "size",
      key: "size",
      width: "15%"
    },
    {
      title: "修改日期",
      dataIndex: "time",
      key: "time",
      width: "15%"
    },
    {
      title: "所在目录",
      dataIndex: "path",
      key: "path",
      width: "15%",
     /* render: (text, record) => <a onClick={() => params.current.clickRow(record.path)}>{record.path.substring(record.path.lastIndexOf("/")+1, record.path.length)}</a>
    }];*/
      render: (text, record) => {
        if (record.path) {
          //<TooltipItem value={record.file_name} maxLength={25}
          return record.path && record.path.indexOf("/") == -1 ?
            <a style={{ color: "#1890ff" }} onClick={() => params.current.clickRow(record.path,1)}><TooltipItem value={record.path} maxLength={10}/></a> : <a
              onClick={() => params.current.clickRow(record.path,1)} style={{ color: "#1890ff" }}><TooltipItem
              proColor="1890ff"
              value={record.path != null ? record.path.substring(record.path.lastIndexOf("/") + 1, record.path.length) : ""}
              maxLength={15}/></a>;
        }
      }
    }]

  return search;
};
