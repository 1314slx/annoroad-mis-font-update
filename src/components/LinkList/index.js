import React, { Component, Fragment } from "react";

import LinkDownload from "./LinkDownload";
import styles from "./index.less";

export default class LinkList extends Component {
  getLinks(links) {
    const _data = links;

    if (!_data) {
      return;
    }

    return _data.map((value, index) => {
      return <LinkDownload key={index} path={value.path} name={value.name} />;
    });
  }

  render() {
    const { title, links } = this.props;

    return (
      <div className={styles.linkList}>
        <h3 className={styles.tableCell}>{title}：</h3>

        <div className={styles.tableCell}>{this.getLinks(links)}</div>
      </div>
    );
  }
}
