import React, { Component } from "react";
import {
  Button,
  Progress,
  Icon,
  Tooltip,
  Popconfirm,
  notification,
  message
} from "antd";
import { getOssClient } from "../../utils/oss";
import {notify} from '../../utils/resource-task';
import {bytesToSize} from '../../utils/utils';
import {Base64} from 'js-base64';
import request from "./../../utils/request";

const overHidden = {
  whiteSpace: "nowrap",
  overflow: "hidden",
  textOverflow: "ellipsis"
};

/**
 * 文件上传列表
 * */
export default class Item extends Component {
  constructor(props) {
    super(props);
    this.state = {
      pause:  this.props.checkpoint.pause,
      continue: this.props.checkpoint.continue,
      clear:  this.props.checkpoint.clear,
    };
    this.ing = false;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextState) {
    this.setState({
      pause:
        nextProps.checkpoint.percent == 100
          ? true
          : nextProps.checkpoint.pause == null
            ? false
            : nextProps.checkpoint.pause,
      continue:
        nextProps.checkpoint.continue == null
          ? true
          : nextProps.checkpoint.continue,
      clear: nextProps.checkpoint.percent == 100 ? false : true
    }, () => {this.ing = false});
  }

  /**
   * 暂停上传
   */
  pause = () => {
    if(this.ing){
      return;
    }
    this.ing = true;
    try {
      this.props.checkpoint.client.cancel();
    } catch (e) {
      return;
    }
    this.props.checkpoint.client = null;
    this.props.checkpoint.pause = true;
    this.props.checkpoint.continue = false;
    this.props.dispatch({
      type: "dataManager/nullFunction"
    });
  };

  /**
   * 继续上传
   */
  continue = () => {
    if(this.ing){
      return;
    }
    this.ing = true;
    this.props.checkpoint.pause = false;
    this.props.checkpoint.continue = true;
    try {
      let client = getOssClient();
      if(client) {
        client.multipartUpload(null, null, {
          // parallel: 2,
          headers: {
            "x-oss-callback-var": Base64.encode("{\"x:subtaskCode\": \""+this.props.checkpoint.subtaskCode+"\"}"),
          },
          checkpoint: this.props.checkpoint,
          progress: (percent, cpt) => {
            if (cpt.file.size === 0) {
              this.props.checkpoint.pause = true;
              this.props.checkpoint.continue = false;
              notification["error"]({
                message: "文件不存在",
                description: this.props.checkpoint.name + "上传失败"
              });
              client.cancel();
              return;
            }
            cpt.percent = parseInt(percent * 100);
            cpt.client = client;
            this.props.dataManager.checkpoints.set(this.props.checkpoint.taskCode, cpt);
            if (cpt.percent === 100) {
              this.props.dataManager.uploadingNames.delete(this.props.checkpoint.taskCode);
              // 刷新页面，并减去对应文件大小
              this.props.refreshCallBack(cpt.file, this.props.checkpoint.taskCode, this.props.that);
            }
            this.props.dispatch({
              type: "dataManager/nullFunction"
            });
          }
        });
      }
    }catch (e) {
      notify(this.props.checkpoint.subtaskCode, 2, e.message);
      message.error("网络异常，请重新上传");
    }
  };

  /**
   * 取消上传/删除上传信息
   */
  clear = type => {
    if(this.ing){
      return;
    }
    this.ing = true;
    let isCancel = type === "cancel";
    if(isCancel){
      notify(this.props.checkpoint.subtaskCode, 1, "").then(()=>{
        this.clearCache();
      })
    }else{
      // 删除记录
      request("/annoroad-cloud-mis-server/resource/task/delete",{
        body:{
          code: this.props.checkpoint.taskCode
        }
      }).then((data)=>{
        if(data.code == "000000"){
          this.clearCache();
        }
      })
    }
  };

  clearCache = () => {
    if(this.props.checkpoint.already){
      this.props.dataManager.alreadyUpload.delete(this.props.checkpoint.taskCode);
    }else{
      this.props.dataManager.uploadingNames.delete(this.props.checkpoint.taskCode);
      this.props.dataManager.allUploadNames.delete(this.props.checkpoint.taskCode);
      this.props.dataManager.checkpoints.delete(this.props.checkpoint.taskCode);
    }
    this.props.dispatch({
      type: "dataManager/nullFunction"
    });
  }

  render() {
    return (
      <div style={{ marginTop: "10px" }}>
        <div style={{ display: "inline-block", width: "50%" }}>
          <Tooltip title={this.props.name}>
            <div style={overHidden}>
              <label>
                {this.props.index}.{this.props.name}
              </label>
            </div>
          </Tooltip>
          <Progress percent={this.props.checkpoint.percent} />
        </div>
        <div
          style={{
            display: "inline-block",
            marginLeft: "10%",
            minWidth: "17%"
          }}
        >
          {this.props.checkpoint.percent === 100 ? (
            <span style={{ fontSize: "90%", marginTop: "30%" }}>
              {bytesToSize(this.props.checkpoint.fileSize)}
            </span>
          ) : (
            <span style={{ fontSize: "90%", marginTop: "30%" }}>
              {bytesToSize(
                this.props.checkpoint.fileSize *
                  (this.props.checkpoint.percent / 100)
              )}/{bytesToSize(this.props.checkpoint.fileSize)}
            </span>
          )}
        </div>
        <div style={{ display: "inline-block", marginLeft: "10%" }}>
          {this.props.checkpoint.percent==100?"":
          <Tooltip title={"暂停"}>
            <Button
              size={"small"}
              hidden={this.state.pause}
              onClick={() => this.pause()}
            >
              <Icon
                type="pause"
                theme="outlined"
                style={{ color: "#52c41a" }}
              />
            </Button>
          </Tooltip>}
          {this.props.checkpoint.percent==100?
          <Tooltip title={"清除"}>
            <Button
              size={"small"}
              // hidden={this.state.clear}
              onClick={() => this.clear("clear")}
            >
              <Icon type="delete" theme="outlined" style={{ color: "red" }} />
            </Button>
          </Tooltip>:""}
          {this.props.checkpoint.percent==100?"":
          <Tooltip title={"继续"}>
            <Button
              size={"small"}
              style={{ width: "28px", textAlign: "center" }}
              hidden={this.state.continue}
              onClick={() => this.continue()}
            >
              <Icon
                type="caret-right"
                theme="outlined"
                style={{ color: "gray" }}
              />
            </Button>
          </Tooltip>}
          <Tooltip title={"取消"}>
            <Popconfirm
              title="确定要取消上传吗？"
              icon={<Icon type="question-circle-o" style={{ color: "red" }} />}
              onConfirm={() => this.clear("cancel")}
            >
              <Button
                size={"small"}
                style={{
                  marginLeft: "10px",
                  width: "28px",
                  textAlign: "center"
                }}
                hidden={this.state.continue}
              >
                <Icon type="close" theme="outlined" style={{ color: "red" }} />
              </Button>
            </Popconfirm>
          </Tooltip>
        </div>
      </div>
    );
  }
}
