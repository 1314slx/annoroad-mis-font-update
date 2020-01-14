import React, { Component } from "react";
import { Modal, Icon } from "antd";

/**
 * 确认弹窗
 * */
export default class ConfirmModal extends Component {
  render() {
    const { visible, confirmLoading, onOk, onCancel, children } = this.props;

    return (
      <Modal
        closable={false}
        visible={visible}
        width={340}
        onOk={onOk}
        confirmLoading={confirmLoading}
        onCancel={onCancel}
        style={{ top: 190 }}
        bodyStyle={{padding: "24px 24px 52px"}}
      >
        <Icon
          theme="filled"
          type="exclamation-circle"
          style={{ color: "#ffbf00", fontSize: "20px" }}
        />

        <span style={{ paddingLeft: "10px" }}>{children}</span>
      </Modal>
    );
  }
}
