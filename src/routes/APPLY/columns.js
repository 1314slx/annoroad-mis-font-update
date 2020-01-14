//工具管理列表信息
import React from "react";
import TooltipItem from "components/TooltipItem";
import { Badge, Tooltip } from "antd";
import LinkDownload from "../../components/LinkList/LinkDownload";
import DescriptionList from "components/DescriptionList";

const { Description } = DescriptionList;
import styles from "./style.less";
import moment from "moment";
import { setParamsRules } from "../../utils/options";

const screenWidth = window.screen.width;

//应用管理-工具管理
export const toolsManageColumns = [
  {
    title: "工具名称",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      if (record.name && screenWidth > 1680) {
        return record.name;
      } else {
        return (<Tooltip title={record.name}>
          <span className={styles.tooltipSpan}>{record.name}</span>
        </Tooltip>);
      }
    }

  },
  {
    title: "标识名",
    dataIndex: "alias",
    key: "alias",//
    render: (text, record) => {
      return (<span className={styles.maxSpan} style={{maxWidth:"17em"}}>{record.alias}</span>);

    }
  },
  {
    title: "工具类型",
    dataIndex: "typeName",
    key: "typeName",
    render: (text, record) => {
      if (record.typeName && screenWidth > 1680) {
        return record.typeName;
      } else {
        return (<Tooltip title={record.typeName}>
          <span className={styles.tooltipSpan}>{record.typeName}</span>
        </Tooltip>);
      }
    }
  },
  {
    title: "负责人",
    dataIndex: "operator",
    key: "operator",
    render: (text, record) => {
      if (record.operator) {
        let _operator =  record.operator.map((value, index) => (
          <span className={styles.operatorSpan}>
              {value.userName}
            <i>、</i>
            </span>
        ));
        return (<Tooltip title={_operator}>
          <span className={styles.tooltipSpan}>{_operator}</span>
        </Tooltip>);
      }
    }
  },
  {
    title: "操作人",
    dataIndex: "updateBy",
    key: "updateBy"
  },
  {
    title: "操作时间",
    dataIndex: "updateTime",
    key: "updateTime",
    sorter: (a, b) => a.sort - b.sort,
    // sortDirections: ["descend", "ascend"],
    render: (text, record) => {
      return <span>{record.updateTime ? moment(record.updateTime).format("YYYY-MM-DD HH:mm") : "-"}</span>;
    }
  }
];

//应用管理-我的工具-编辑工具-table列名
export const editMyToolsColumns = [
  /*{
    title: 'key',
    dataIndex: 'key',
  },*/{
    title: "字段名称",
    dataIndex: "fieldName",
    editable: true,
    width: "12%",
    render: (text, record) => {
      if (record.name && screenWidth > 1400) {
        return record.fieldName;
      } else {
        return (<Tooltip title={record.fieldName}>
          <span className={styles.tooltipSpan} style={{ maxWidth: "20em" }}>{record.fieldName}</span>
        </Tooltip>);
      }
    }
  }, {
    title: "类型",
    dataIndex: "type",
    width: "10%",
    render: (text, record) => {
      if (record.type === 1) {
        return <span>输入文件</span>;
      } else if (record.type === 2) {
        return <span>文本框</span>;
      } else if (record.type === 3) {
        return <span>单选Radio</span>;
      } else if (record.type === 4) {
        return <span>单选Select</span>;
      } else if (record.type === 5) {
        return <span>多选Select</span>;
      } else if (record.type === 7) {
        return <span>输入文件夹</span>;
      } else {
        return <span>输出文件夹</span>;
      }
    }
  }, {
    title: "参数名称",
    dataIndex: "paramName",
    width: "10%",
    render: (text, record) => {
      return <Tooltip title={record.paramName}>
        <span className={styles.maxSpan}>{record.paramName}</span>
      </Tooltip>;
    }
  }, {
    title: "示例参数",
    dataIndex: "defaultValue",
    width: "18%",
    render: (text, record) => {
      if (record.defaultValue) {
        // return <span>{record.defaultValue}</span>

        return <Tooltip title={record.defaultValue}>
          <span style={{
            maxWidth: "10em",
            display: "block",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap"
          }}>{record.defaultValue}</span>
        </Tooltip>;
      } else {
        return <span>-</span>;
      }


    }

  }, {
    title: "可选项",
    dataIndex: "options",
    width: "12%",
    render: (text, record) => {
      if (record.options) {
        if (record.options.length > 0) {
          let _options = record.options ? record.options.map((value, index) => value.text + ":" + value.value).join(",") : "";
          return <Tooltip title={_options}>
            <span style={{
              maxWidth: "10em",
              display: "block",
              overflow: "hidden",
              textOverflow: "ellipsis",
              whiteSpace: "nowrap"
            }}>{_options}</span>
          </Tooltip>;

        } else {
          return <span>-</span>;
        }
      } else {
        return <span>-</span>;
      }


    }
  }, {
    title: "输入提示",
    dataIndex: "prompt",
    width: "10%",
    // render: (text, record) => record.prompt?record.prompt:"-"
    render: (text, record) => {
      if (record.prompt) {
        return <Tooltip title={record.prompt}>
          <span className={styles.maxSpan}>{record.prompt}</span>
        </Tooltip>;
      } else {
        return "-";
      }

    }
  }, {
    title: "校验规则",
    dataIndex: "rules",
    width: "12%",
    render: (text, record) => {
      if (record.rules) {
        if (record.type === 2) {
          let arr = [];
          for (let i = 0; i < record.rules.length; i++) {
            arr[i] = setParamsRules[record.rules[i]];
          }
          if (record.rules.length > 0) {
            // return record.rules ? arr.join(",") : ""
            return record.rules ? <Tooltip title={arr.join(",")}>
              <span style={{
                maxWidth: "10em",
                display: "block",
                overflow: "hidden",
                textOverflow: "ellipsis",
                whiteSpace: "nowrap"
              }}>{arr.join(",")}</span>
            </Tooltip> : "";
            /* return<Tooltip title={record.defaultValue}>
               <span style={{maxWidth:"10em",display:"block",overflow: "hidden",textOverflow: "ellipsis", whiteSpace: "nowrap"}}>{record.defaultValue}</span>
             </Tooltip>*/
          } else {
            return <span>-</span>;
          }
        } else {
          if (record.rules.length > 0) {
            return record.rules ? record.rules.join(",") : "";
          } else {
            return <span>-</span>;
          }
        }
      } else {
        return <span>-</span>;
      }
    }
  }];

//应用管理-我的工具
export const myToolsColumns = [
  {
    title: "工具名称",
    dataIndex: "toolName",
    key: "toolName",
    render: (text, record) => {
      if (record.toolName && screenWidth > 1680) {
        return record.toolName;
      } else {
        return (<Tooltip title={record.toolName}>
          <span className={styles.tooltipSpan}>{record.toolName}</span>
        </Tooltip>);
      }
    }
  },
  {
    title: "工具类型",
    dataIndex: "toolTypeName",
    key: "toolTypeName",
    render: (text, record) => {
      if (record.toolTypeName && screenWidth > 1680) {
        return record.toolTypeName;
      } else {
        return (<Tooltip title={record.toolTypeName}>
          <span className={styles.tooltipSpan}>{record.toolTypeName}</span>
        </Tooltip>);
      }
    }
  },
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
  },
  {
    title: "状态",
    dataIndex: "statusWord",
    key: "statusWord",
    render: (text, record) => {
      if (record.status === 4) {
        return <Tooltip title={record.deployRejectReason}>
          <span style={{ color: "#ff0000" }}>部署驳回</span>
        </Tooltip>;
      } else if (record.status === 6) {
        //auditRejectReason   6=审核驳回
        return <Tooltip title={record.deployRejectReason}>
          <span style={{ color: "#ff0000" }}>审核驳回</span>
        </Tooltip>;


      } else {
        return <span>{record.statusWord}</span>;
      }
    }
  },
  {
    title: "操作人",
    dataIndex: "operateUser",
    key: "operateUser"
  },
  {
    title: "操作时间",
    dataIndex: "operateTime",
    key: "operateTime",
    render: (text, record) => {
      if (record.status === 1) {
        return (
          <span className={styles.operatorSpan}>
            </span>
        );
      } else {
        return (
          <span className={styles.operatorSpan}>
            {record.operateTime ? moment(record.operateTime).format("YYYY-MM-DD HH:mm") : "-"}
            </span>
        );
      }
    }
  }
];

/*应用管理-部署测试*/
export const deployTestColumns = [
  {
    title: "工具名称",
    dataIndex: "toolName",
    key: "toolName",
    render: (text, record) => {
      if (record.toolName && screenWidth > 1680) {
        return record.toolName;
      } else {
        return (<Tooltip title={record.toolName}>
          <span className={styles.tooltipSpan}>{record.toolName}</span>
        </Tooltip>);
      }
    }
  },
  {
    title: "工具类型",
    dataIndex: "toolTypeName",
    key: "toolTypeName",
    render: (text, record) => {
      if (record.toolTypeName && screenWidth > 1680) {
        return record.toolTypeName;
      } else {
        return (<Tooltip title={record.toolTypeName}>
          <span className={styles.tooltipSpan}>{record.toolTypeName}</span>
        </Tooltip>);
      }
    }
  },
  /*{
    title: "镜像名称",
    dataIndex: "imageName",
    key: "imageName"
  },
*/
  {
    title: "版本号",
    dataIndex: "version",
    key: "version"
    /* render: (text, record) => {
      if(record.status===3){
        return(
          <span>成功</span>
        );
      }else if(record.status===6){
        return(
          <span>成功2</span>
        );
      }
    /!*  return (
        <span>
          {record.restAmount}
          <br /> {record.creditAmount}
        </span>
      );*!/
    }*/
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (record.status === 3) {
        return <span>待部署</span>;
      } else if (record.status === 6) {
        return (
          <Tooltip title={record.auditRejectReason}>
            <span style={{ color: "#ff0000" }}>审核驳回</span>
          </Tooltip>
        );
      }
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.remarks}/> : text*/
  },
  {
    title: "提交人",
    dataIndex: "deploySubmitUser",
    key: "deploySubmitUser"
  },
  {
    title: "提交时间",
    dataIndex: "deploySubmitTime",
    key: "deploySubmitTime",
    render: (text, record) => {
      return (
        <span>
          {record.deploySubmitTime ? moment(record.deploySubmitTime).format("YYYY-MM-DD HH:mm") : "-"}
        </span>
      );
    }
  }
];

/*应用管理-审核测试*/
export const examineColumns = [
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
    title: "状态",
    dataIndex: "statusWord",
    key: "statusWord",
    render: (text, record) => {
      if (record.status == 5) {
        return <Badge status="warning" text="待审核"/>;
      } else if (record.status == 7) {
        return <Badge status="processing" text="审核通过"/>;
      } else if (record.status == 8) {
        return <Badge status="success" text="已上架"/>;
      } else {
        return <Badge status="error" text="已下架"/>;
      }
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },
  {
    title: "提交人",
    dataIndex: "auditSubmitUser",
    key: "auditSubmitUser"
  },
  {
    title: "提交时间",
    dataIndex: "auditSubmitTime",
    key: "auditSubmitTime",
    render: (text, record) => {
      return (
        <span>{record.auditSubmitTime ? moment(record.auditSubmitTime).format("YYYY-MM-DD HH:mm") : "-"}</span>
      );
    }
  }
];

/*应用管理-测试任务*/
export const taskTestColumns = [
  {
    title: "任务",
    dataIndex: "name",
    key: "name",
    render: (text, record) => {
      return (<Tooltip title={record.name}>
        <span className={styles.tooltipSpan}>{record.name}</span>
      </Tooltip>);
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  },
  {
    title: "提交时间",
    dataIndex: "startTime",
    key: "startTime",
    render: (text, record) => {
      return <span>{record.startTime ? moment(record.startTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</span>;
    }
  },
  {
    title: "结束时间",
    dataIndex: "endTime",
    key: "endTime",
    render: (text, record) => {
      if (record.status == 1 || record.status == 2) {
        return <span>-</span>;
      } else {
        return <span>{record.endTime ? moment(record.endTime).format("YYYY-MM-DD HH:mm:ss") : "-"}</span>;
      }
    }
  },
  {
    title: "状态",
    dataIndex: "status",
    key: "status",
    render: (text, record) => {
      if (record.status == 1) {
        return <Badge status="warning" text="排队中"/>;
      } else if (record.status == 2) {
        return <Badge status="processing" text="执行中"/>;
      } else if (record.status == 3) {
        return <Badge status="success" text="成功"/>;
      } else {
        return <Badge status="error" text="失败"/>;
      }
    }
    /*  render: (text, record) => record.action ? <TooltipItem status={text} value={record.reason}/> : text*/
  }
];


// 视频管理-视频列表-白名单-table列名
export const whitelistColumns = [
  {
    title: "姓名",
    dataIndex: "name",
    editable: true,
    width: "25%"
  }, {
    title: "手机号",
    dataIndex: "mobile",
    editable: true,
    width: "25%"
  }, {
    title: "单位",
    dataIndex: "units",
    editable: true,
    width: "25%"
  }
];
