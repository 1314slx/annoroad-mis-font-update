import React, { Component } from "react";

import { Icon } from "antd";
import styles from "./index.less";
import config from "../../../config/index";

export default class LinkDownLoad extends Component {
  render() {
    const { path, name } = this.props;

    //console.log(config.urlHost)
    return (
      <div className={styles.downloadBox}>
        <Icon type="link" />

        <a
          className={styles.linksBox}
          href={`${config.urlHost}${path}`}
          target="_blank"
        >
          {name}
        </a>
      </div>
    );
  }
}
