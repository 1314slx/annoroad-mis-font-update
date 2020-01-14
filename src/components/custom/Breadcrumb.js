import React, { Component } from "react";
import BreadItem from "./BreadItem";

const overHidden = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "155px",
  display: "inline-block"
};

/**
 * 文件选择modal导航屑
 */
export default class Breadcrumb extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: this.props.data,
      onClick: this.props.onClick || (() => {
      }),
      items: [this.props.rootDir]
    };
    this.search = false;
  }

  /**
   * 获取当前路径
   */
  getCurrentPath = () => {
    let path = "";
    this.state.items.forEach((item, index) => {
      path = path + (index != 0 ? "/" : "") + item;
    });
    return path;
  };

  /**
   * 添加面包屑下一层
   */
  pushItem = name => {
    this.state.items.push(name);
    this.setState({
      items: this.state.items
    });
  };

  /**
   * 重置导航屑
   * @param path 导航路径
   * @param isDir 是否是文件夹
   */
  resetItems = (path, isDir, isSearch) => {
    this.search = isSearch;
    this.clearItems();
    if (path) {
      let items = path.split("/");
      if (!isDir) {
        items.pop();
      }
      this.setState({
        items: items
      });
    }
  };

  /**
   * 清掉导航屑，恢复到根目录
   */
  clearItems = () => {
    this.setState({
      items: [this.props.rootDir]
    });
  };

  /**
   * 点击面包屑
   */
  onClick = index => {
    this.search = false;
    // 组装面包屑，并将items刷新
    let path = "";
    let items = [];
    for (let i = 0; i <= index; i++) {
      let item = this.state.items[i];
      path = i != 0 ? path + "/" + item : item;
      items.push(item);
    }
    this.setState({
      items: items
    });
    this.parentOnClick();
    this.props.request(path, false);
  };

  /**
   * 返回上一级
   */
  above = () => {
    let path = "";
    let items = [];
    // 循环数组中的length-1个数据，即可得上级目录
    for (let i = 0, len = this.state.items.length - 1; i < len; i++) {
      let item = this.state.items[i];
      path = i != 0 ? path + "/" + item : item;
      items.push(item);
    }
    this.setState({
      items: items
    });
    this.parentOnClick();
    this.props.request(path, false);
  };

  /**
   * 调用父类click事件
   */
  parentOnClick = () => {
    if (this.props.onClick) {
      this.props.onClick();
    }
  };

  /**
   * 渲染面包屑样式
   */
  forEachItem = () => {
    let index = 0;
    let options = [];
    let len = this.state.items.length;
    // 导航屑最多展示4层，计算要跳过多少导航屑
    let breakNum = len - 4 > 0 ? len - 4 : 0;
    // 如果导航大于一级，展示返回上一级
    if (len > 1) {
      options.push(
        <a key={"01234"} onClick={() => this.above()} style={{ ...overHidden }}>
          返回上一级|
        </a>
      );
    }
    // 如果需要跳过部分导航屑，跳过部分展示"..."
    if (breakNum > 0) {
      options.push(<span key={index + Math.random()} style={{ ...overHidden }}>&nbsp;...&gt;</span>);
    }
    // 循环需要展示的导航屑
    for (let i = breakNum; i < len; i++) {
      let item = this.state.items[i];
      // 如果index为0，说明第一次循环，不加">"
      if (index === 0) {
        index++;
      } else {
        options.push(<span key={index + Math.random()} style={{ ...overHidden }}> &gt; </span>);
      }
      // 如果是最后一层目录，不可点击(但是搜索后根目录可点击)
      if (len - 1 === i && !this.search) {
        options.push(<span key={index + Math.random()} style={{ ...overHidden }}>{item}</span>);
      } else {
        options.push(
          <BreadItem key={i}
                     name={item}
                     index={i}
                     onClick={index => this.onClick(index)}
          />
        );
      }
    }
    return options;
  };

  render() {
    return <div>{this.forEachItem()}</div>;
  }
}
