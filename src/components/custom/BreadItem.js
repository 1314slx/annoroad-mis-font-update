import React, { Component } from "react";

const overHidden = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis",
  maxWidth: "140px",
  display: "inline-block"
};

/**
 * 文件选择导航屑item
 */
export default class BreadItem extends Component {
  constructor(props) {
    super(props);
  }

  click = () => {
    if (this.props.onClick) {
      this.props.onClick(this.props.index);
    }
  };

  render() {
    return (
      <a onClick={() => this.click()} style={{ ...overHidden }}>
        {this.props.name}
      </a>
    );
  }
}
