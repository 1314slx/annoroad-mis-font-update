import React, { Component } from "react";
import { Icon } from "antd";
import styles from "./style.less";
import { bytesToSize, timestampToTime } from "../../utils/utils";

const overHidden = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "350px",
  display: "inline-block",
  color: "#878787"
};

const overHidden1 = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "100px",
  display: "inline-block",
  color: "#878787"
};

/**
 * 文件选择行组件
 */
export default class FileItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      onClick: this.props.onClick || (() => {
      }),
      search: this.props.search || false,
      bgColor: this.props.data.fileName == this.props.selectedName && this.props.data.path == this.props.searchPath ? "#e5f7fd" : "#FFF",
      isClick: this.props.data.fileName == this.props.selectedName && this.props.data.path == this.props.searchPath,
      onClickRow: this.props.onClickRow,
      onClickNext: this.props.onClickNext,
      isSearch: this.props.isSearch || false
    };
  }

  /**
   * props改变时触发
   */
  UNSAFE_componentWillReceiveProps(nextProps, nextContext) {
    let isMe = (nextProps.data.fileName == nextProps.selectedName
      && (!nextProps.isSearch || nextProps.data.path == nextProps.searchPath));
    this.setState({
      bgColor: isMe ? "#e5f7fd" : "#FFF",
      isClick: isMe,
      isSearch: nextProps.isSearch
    });
  }

  /**
   * 点击行，选中该行
   */
  clickRow = () => {
    if (this.state.onClickRow) {
      this.state.onClickRow(
        this.props.data.path,
        this.props.data.fileName,
        this.props.data.isDirectory
      );
    }
  };

  // 行双击事件
  doubleClick = () => {
    let _data = this.props.data;
    if (_data && _data.isDirectory == 1) {
      this.clickNext();
    } else {
      this.props.doubleClickRow(_data, 1);
    }
  };

  /**
   * 点击目录，跳转到下一层目录
   */
  clickNext = () => {
    if (!this.state.isSearch && this.props.data.isDirectory == 2) {
      // 2是文件
      return;
    }
    if (this.state.onClickNext) {
      this.state.onClickNext(
        this.state.isSearch ? this.props.data.path : null,
        this.props.data.fileName,
        this.props.data.isDirectory,
        true
      );
    }
  };

  /**
   * 鼠标悬浮
   */
  mouseOver = () => {
    this.setState({
      bgColor: "#e5f7fd"
    });
  };

  /**
   * 鼠标离开
   */
  mouseLeave = () => {
    this.setState({
      bgColor: this.state.isClick ? "#e5f7fd" : "#FFF"
    });
  };

  /**
   * 跳转到所在目录
   */
  gotoDir = () => {
    if (this.state.onClickNext) {
      this.state.onClickNext(
        this.props.data.path,
        this.props.data.fileName,
        this.props.data.isDirectory,
        false
      );
    }
  };

  render() {
    // 截取当前目录
    let currentDir = "";
    if (this.state.isSearch && this.props.data.path) {
      let path = this.props.data.path;
      let lastIndex = path.lastIndexOf("/");
      if (lastIndex > 0) {
        currentDir = path.substring(lastIndex + 1, path.length);
      } else {
        currentDir = path;
      }
    }

    return (
      <tr
        style={{
          marginLeft: "1%",
          borderBottom: "1px solid #d9d9d9",
          cursor: "pointer",
          backgroundColor: this.state.bgColor
        }}
        onClick={() => this.clickRow()}
        onDoubleClick={() => this.doubleClick()}
        onMouseOver={() => this.mouseOver()}
        onMouseLeave={() => this.mouseLeave()}
      >
        <td width="370" height="50" valign="middle"
            className={this.props.data.isDirectory == 1 ? styles.cursorColor : ""}>
          <a onClick={() => this.clickNext()} style={{ ...overHidden }}>
            {this.props.data.isDirectory == 1 ? (
              <Icon type="folder"/>
            ) : (
              <Icon type="file"/>
            )}&nbsp;{this.props.data.fileName}
          </a>
        </td>
        <td width="110" height="50" valign="middle">
          {this.props.data.size ? bytesToSize(this.props.data.size) : this.props.data.isDirectory == 2 ? "0B" : "-"}
        </td>
        <td width="140" height="50" valign="middle">
          {this.props.data.updateTime == 0
            ? "-"
            : timestampToTime(this.props.data, "updateTime")}
        </td>
        <td
          width="110"
          height="50"
          valign="middle"
          hidden={!this.state.isSearch}
        >
          <a onClick={() => this.gotoDir()} style={{ ...overHidden1 }}>
            {currentDir}
          </a>
        </td>
      </tr>
    );
  }
}
