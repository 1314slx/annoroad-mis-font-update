import React, { Component, Fragment } from "react";
import { Alert } from "antd";
import styles from "./index.less";

export default class ContentTitle extends Component {
  render() {
    const { title, message, children, noStyle } = this.props;
    return (
      <div className={!noStyle ? styles.contentBox : ""}>
        <h1 className={styles.title}>{title}</h1>

        {message || children ? (
          <Alert message={message || children} type="info" />
        ) : (
          <Fragment />
        )}
      </div>
    );
  }
}
