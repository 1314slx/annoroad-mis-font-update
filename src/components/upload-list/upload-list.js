import React, { Component } from "react";
import { Modal, Button, Affix } from "antd";
import Item from "./item";

/**
 * 文件上传列表
 * */
export default class UploadList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource,
      uploadFiles: this.props.uploadFiles
    };
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      dataSource: nextProps.dataSource,
      uploadFiles: nextProps.uploadFiles
    });
  }

  /**
   * 关闭modal
   */
  handleCancel = () => {
    this.props.dispatch({
      type: "dataManager/setVisible",
      visible: false
    });
  };

  /**
   * 展示modal
   */
  setVisible = () => {
    this.props.dispatch({
      type: "dataManager/setVisible",
      visible: true
    });
  };

  /**
   * 上传文件进度信息
   * @returns {Array}
   */
  renderProcess = () => {
    let items = [];
    let num = this.state.dataSource.size;
    this.state.dataSource.forEach((checkpoint, taskCode) => {
      let name = checkpoint.name;
      name = name.substring(name.lastIndexOf("/") + 1, name.length);
      items.unshift(
        <Item index={num} name={name} checkpoint={checkpoint} {...this.props} />
      );
      num--;
    });
    num = this.state.dataSource.size + 1;
    this.state.uploadFiles.forEach((file) => {
      let name = file.name.substring(file.name.lastIndexOf("/") + 1, file.name.length);
      items.push(
        <Item index={num} name={name} checkpoint={file} {...this.props} />
      );
      num++;
    });
    if (items.length == 0) {
      items.push(
        <div style={{ textAlign: "center" }}>
          <span>您还没有上传过文件哦^_^</span>
        </div>
      );
    }
    return items;
  };

  render() {
    let uploadCount = this.props.dataManager.uploadingNames.size;
    let total = this.props.dataManager.allUploadNames.size + this.props.uploadFiles.size;
    let alreadyUploadSize = total - uploadCount;
    return (
      <div>
        <Modal
          title="上传文件列表"
          width={"60%"}
          visible={this.props.dataManager.visible}
          footer={null}
          onCancel={this.handleCancel}
        >
          <div style={{ position: "relative" }}>{this.renderProcess()}</div>
        </Modal>
        {total > 0 ? <Affix offsetBottom={20}>
          <Button onClick={() => this.setVisible()}>
            {uploadCount > 0 ? "正在上传(" : "上传完成("}{uploadCount > 0 ? alreadyUploadSize : total}/{total} {")"}
          </Button>
        </Affix> : ""}

      </div>
    );
  }
}
