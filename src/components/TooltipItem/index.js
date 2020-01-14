import React, { Component } from "react";
import styles from "./index.less";
import { Tooltip } from "antd";

/**
 * 带有Tooltip 提示的文字
 *  value        文字
 *  maxLength    显示长度
 *  status       有status 说明此时组件用户状态显示，status传的就是当前状态，如：'审核失败',value传的是失败原因
 * */
export default class TooltipItem extends Component {
  render() {
    const {
      value,
      maxLength,
      status, //
      canDownload
    } = this.props;
    const _len = maxLength ? maxLength : 18;
    let _color = status ? "#ff0000" : "rgba(0, 0, 0, 0.65)";

    if (canDownload) _color = '#1890ff'

    if (status || (value && value.length > _len)) {
      return (
        <Tooltip title={value}>
          <div className={styles.fileNameTooltip} style={{boxOient:"vertical", webkitBoxOient:"vertical"}}>
            <a style={{ color:this.props.proColor?this.props.proColor: _color ,}}>
              {/* {status ? status : `${value.substr(0, _len)}...`}*/}
              {value}
            </a>
          </div>

        </Tooltip>
      );
    }
    return value ? value : "";
  }
}
