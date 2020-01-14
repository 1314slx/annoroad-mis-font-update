import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal, Button, Form, message, AutoComplete, Input, TreeSelect, Tree, Select, Row, Col, Upload, Icon, Table, Divider
} from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import Item from "../../upload-list/item";
import request from "../../../utils/request";
import { codeMark } from "../../../utils/options";

const FormItem = Form.Item;
const { Option } = Select;
import styles from "./styles.less";
import { heartbeat, notify, progress } from "../../../utils/resource-task";
import { themeVideoColumns } from "./columns";
import ConfirmModal from "components/ConfirmModal";
import store from "../../../index";
let _progress;
/**
 * 视频上传
 */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects["video/videoTypeGroup"]
}))
@Form.create()
export default class UploadVideo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      videoId: "",
      uploadAddress: "",
      uploadAuth: "",
      subtaskCode: "",
      visible: false,
      visible1: false,
      visibleDelte: false,//删除弹框
      uploader: null,
      currentRecord: null
    };
    _progress = 0;
    this.uploader = null;
    this.index = -1;
    this._uploader = [];
    this.enterFrameFlag = true;
    this.columns = [
      ...themeVideoColumns,
      {
        title: "操作",
        dataIndex: "action",
        width:'8%',
        render: this._handler
      }
    ];
  }

  componentDidMount(){
    this.props.onRef(this);
  }

  childFunciton = () =>{
    const videoGroupData = this.props.video.videoGroupData;
    for (let i=0;i<videoGroupData.length;i++){
      if(videoGroupData[i]._mark===1||videoGroupData[i]._mark===0){
        request("/annoroad-cloud-mis-server/video/delete", {
          body: {
            code: videoGroupData[i].code
          }
        })
      }
      if(this._uploader[i]){
          this._uploader[i].stopUpload();
          this.enterFrameFlag = false;
      }
    }store.dispatch(routerRedux.push("/video/theme-list"));
  }
  /**
   *
   * 表格操作（编辑+删除）
   * @param text
   * @param record
   * @returns {*}
   * @private
   */
  _handler = (text, record) => {
    return (
      <div>
        {record.duration && record.duration > 0 ?<a onClick={() =>this._editHandle(record)} >编辑</a>:<a style={{color:"#999999"}}>编辑</a>}
        <Divider type="vertical" />
        <a onClick={() =>this._deleHandle(record)} >删除</a>
      </div>
    );
  };
  /**
   * 编辑操作
   * @returns {*}
   */
  _editHandle = (value) => {
    this.setState({
      visible1: true,
      currentRecord: value
    });
  };

  /**
   * 保存
   */
  handleOk = () => {
    const video_submit = document.getElementById("submitVideo");
    video_submit.click();
  };
  /**
   * 取消
   */
  handleCancel = () => {
    this.enterFrameFlag = true;
   this.setState({
     visible:false,
     visible1:false,
     visibleDelte:false,
     currentRecord:null
   })
  };
  /**
   * 提交表单-编辑
   * @param e
   */
  handleSubmitVideo = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(!err){
        //判断视频排序值
        if (!values.sort) {
          message.error("排序不能为空");
          return;
        }
        const _name = values.name ? values.name : this.state.currentRecord.name;
        if (!_name) {
          message.error("视频名称不能为空");
          return;
        }
        let _sort = values.sort ? values.sort : this.state.currentRecord.sort;
        if (!(/(^[1-9]\d*$)/.test(_sort))) {
          message.error("只能输入正整数。");
          return;
        }
        let _list = this.props.list;
        for (let i = 0; i < _list.length; i++) {
          if (_list[i].name == values.name&&this.state.currentRecord.name !== values.name) {
            message.error("视频名称已存在");
            return;
          }
        }
        request("/annoroad-cloud-mis-server/video/modify", {
          body: {
            code: this.state.currentRecord.code,// 视频编号
            themeCode:this.props.themeCode,//视频主题编号
            // name: values.name ? values.name : this.state.currentRecord.name,
            name: values.name ? values.name : this.state.currentRecord.name,  //视频名称
            lecturer: values.lecturer, //讲师
            sort: _sort //排序
          }
        }).then((data) => {
          if (data) {
            if (data.code === "000000") {
              this.props.dispatch({
                type: "video/saveVideoGroup",
                payload: data.data
              });
              this.setState({
                visible1: false,
              });
              this.props.form.resetFields();
            } else {
              message.error(codeMark[data.code]);
            }
          } else {
            message.error("系统异常");
          }
        });
      }else{
        return;
      }
    });
  };
  /**
   * 编辑操作
   * @returns {*}
   */
  _deleHandle = (value) => {
    this.enterFrameFlag = false;
    this.setState({
      visibleDelte: true,
      currentRecord: value
    });
  };


  /**
   * 删除操作
   * @returns {*}
   */
  handleDelOk = () => {

    this.setState({
      confirmLoading: true
    });
    const code = this.state.currentRecord.code;
    const _index = this.state.currentRecord.index;
    // return;
    const that =this;
    request("/annoroad-cloud-mis-server/video/delete", {
      body: {
        code: code
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          this.enterFrameFlag = true;
          // this.uploader.deleteFile(_index);
          // that.deleteFile(0);this.state.currentRecord
          if (this._uploader&&this.state.currentRecord._mark==1) {
            this._uploader[_index].stopUpload();
          }
          setTimeout(() => {
            this.props.dispatch({
              type: "video/deleteVideo",
              payload: code
            });
            this.setState({
              visibleDelte: false,
              currentRecord:null,
              loading: false,
              confirmLoading: false
            })
          /*this.deleteFile(code);*/
          }, 0);
          this.setState({
            loading: false
          })
        } else {
          message.error(codeMark[data.code]);
        }
      } else {
        message.error("系统异常");
      }
    });
  };
  componentWillUnmount() {
    this._uploader.map((value) => {
      value.stopUpload();  //停止视频上传
    });
  }

  // 删除上传视频
  deleteFile = (uid) => {
    this.uploader.deleteFile(0);
   /* if (this._uploader) {
      this._uploader[0].stopUpload();
    }*/
  };

  /**
   * 视频上传
   */
  upload = (file, fileList) => {
    // alert(JSON.stringify(file))
    // return new Promise((resolve, reject) => {
    if (file) {
      file.filename = file.name.substr(0, file.name.lastIndexOf("."));
      const ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
      const file_name = file.name;
      if (file_name.length > 30 || file_name.length < 1) {
        message.error("视频名称过长");
        return;
      }
      const _videoGroupData = this.props.video.videoGroupData!=0?this.props.video.videoGroupData:[];
      // alert(JSON.stringify(_videoGroupData))
      let _error = [];
      _videoGroupData.map((item)=>{
        if(file.filename == item.name){
          _error.push(item.name);
        }
      });
      if(_error.length>0){
        message.error("视频名称重复");
        return ;
      }
      /*return;*/
      if (ext === "mp4" || ext === "flv") {
        request("/annoroad-cloud-mis-server/video/modify", {
          body: {
            size: file.size,
            name: file_name,
            themeCode:this.props.themeCode
          }
        }).then((data) => {
          if (data) {
            if (data.code === "000000") {
              this.index++;
              // videoId视频编号，主题保存、上传文件时需要
              //subtaskCode 资源子任务编号-》用来调消息通知接口用
              if (data.data.videoId && data.data.uploadAddress && data.data.uploadAuth, data.data.subtaskCode, data.data.taskCode) {
                //this.videoUpload(data.data.videoId, data.data.uploadAddress, data.data.uploadAuth, data.data.code, file, data.data.subtaskCode, data.data.taskCode);
                this.videoUpload(data.data.videoId, data.data.uploadAddress, data.data.uploadAuth, data.data.code, file, data.data.subtaskCode, data.data.taskCode, this.index);
              } else {
                message.error("参数缺失");
                return;
              }
              _progress = 0;
            } else {
              message.error(codeMark[data.code]);
            }
          } else {
            message.error("系统异常");
          }
        });
      } else {
        message.error("请上传符合要求的视频，如 .mp4,.flv");
        return;
      }
    }
    // reject();
    // });
    return false;
  };
  /**
   * 阿里上传
   * @param videoId
   * @param uploadAddress
   * @param uploadAuth 上传凭证
   * @param file
   * @param code 视频编号
   * @param subtaskCode 资源子任务编号
   * @param taskCode 资源任务编号
   */
  videoUpload = (videoId, uploadAddress, uploadAuth, code, file, subtaskCode, taskCode, index) => {
    // code 视频编号  subtaskCode 资源子任务编号
    const _this = this;
    // eslint-disable-next-line
    this._uploader[index] = new AliyunUpload.Vod({
      //阿里账号ID，必须有值 ，值的来源https://help.aliyun.com/knowledge_detail/37196.html
      userId: "1478542978847994",
      //上传到点播的地域， 默认值为'cn-shanghai',//eu-central-1,ap-southeast-1
      region: "cn-beijing",
      //分片大小默认1M，不能小于100K
      partSize: 1048576,
      //并行上传分片个数，默认5
      parallel: 5,
      //网络原因失败时，重新上传次数，默认为3
      retryCount: 3,
      //网络原因失败时，重新上传间隔时间，默认为2秒
      retryDuration: 2,
      // 开始上传
      "onUploadstarted": function(uploadInfo) {

        //从点播服务获取的uploadAuth、uploadAddress和videoId,设置到SDK里
        _this._uploader[index].setUploadAuthAndAddress(uploadInfo, uploadAuth, uploadAddress, videoId);
      },
      // 文件上传成功
      "onUploadSucceed": function(uploadInfo) {
        let _error =[];
        /*  let timer_heartBeat = setInterval(() => _this.heartBeat(), 1 * 60 * 1000);*/
        let _percent = 100;
        /** 此处调消息通知接口，类型为3-》上传视频成功*/
        notify(subtaskCode, 3, "");   // subtaskCode 资源子任务编号
        let timer = setInterval(()=> {
          let deleteVideoCode = _this.props.video.deleteVideoCode;
          for(let i = 0; i < deleteVideoCode.length; i++){
            if(code == deleteVideoCode[i]){
              _error.push(deleteVideoCode[i]);
              clearInterval(timer);
            }
          }
          if(_error.length>0){
            message.error("视频删除成功");
            return;
          }
          if(_this.enterFrameFlag){
            _progress++;
            if (_progress > 25) {
              let fail_percent = 99
              _this.saveVideoData(code, file, subtaskCode, fail_percent, _this, videoId, 1,index);
              clearInterval(timer);
              _progress = 0;
            }
            progress(taskCode, (data) => {   //获取资源操作进度progress接口：参数 codes 资源任务编号集合  5s掉一次  最多调用10次
              if (data) {
                if (data.succeeded === 1) {
                  _this.saveVideoData(code, file, subtaskCode, _percent, _this, videoId, 0,index);
                  //此处加判断若已经删除不需要走
                  message.success("视频上传成功！");
                  _this.getVideodetail(code, _this);
                  clearInterval(timer);
                  timer = null;
                }
              }

            });
          }
        }, 5000);
      },
      // 文件上传失败
      "onUploadFailed": function(uploadInfo, code, message) {
        notify(subtaskCode, 4, "");
        message.error("视频上传失败！");
        //  ** 此处调消息通知接口，类型为4-》上传视频失败
      },
      // 文件上传进度，单位：字节
      "onUploadProgress": function(uploadInfo, totalSize, loadedPercent) {
        const _loadedPercent = loadedPercent;
        const percent = parseInt(_loadedPercent * 99);
        if(percent>0&&percent<100){
          _this.saveVideoData(code, file, subtaskCode, percent, _this, videoId, 1,index);
          //console.log("onUploadProgress:file:" + uploadInfo.file.name + ", fileSize:" + totalSize + ", percent:" + Math.ceil(loadedPercent * 100) + "%");
        }/*if(percent==100){
          _this.saveVideoData(code, file, subtaskCode, _percent, _this, videoId, 0,index);
        }*/
      },
      // 上传凭证超时
      "onUploadTokenExpired": function(uploadInfo) {
        //实现时，根据uploadInfo.videoId调用刷新视频上传凭证接口重新获取UploadAuth
        //https://help.aliyun.com/document_detail/55408.html
        //从点播服务刷新的uploadAuth,设置到SDK里
        _this._uploader[index].resumeUploadWithAuth(uploadAuth);
      },
      //全部文件上传结束
      "onUploadEnd": function(uploadInfo) {
      }
    });

    let userData = "{\"Vod\":{}}";
    this._uploader[index].addFile(file, null, null, null, userData);
    this._uploader[index].startUpload();
    //uploader.addFile(file, null, null, null, null);
    //uploader.startUpload();

    //this._uploader[index] = uploader;
    //this.uploader = uploader;

  };


  /**
   * 添加视频
   * @param code  视频编号
   * @param file  上传文件信息
   * @param subtaskCode  资源子任务编号
   * @param percent    上传进度
   * @param _this
   * @param videoId
   */
  saveVideoData = (code, file, subtaskCode, percent, _this, videoId, _mark,index) => {
    const _that = this;
    const value = {
      sort: "",
      code: code,  //code 视频编号
      name: file.name.substr(0, file.name.length - 4),
      lecturer: "",
      duration: "",//时长
      uploadTime: "",
      videoId: videoId,
      taskCode: subtaskCode,
      percent: percent,
      _mark: _mark,
      index: index
    };
    _that.props.dispatch({
      type: "video/saveVideoGroup",
      payload: value
    })
  };
  /**
   * 获取视频详情
   * @param code  视频编号
   * @param _this
   */
  getVideodetail = (code) => {
    const _this = this;
    request("/annoroad-cloud-mis-server/video/detail", {
      body: {
        code: code
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          _this.props.dispatch({
            type: "video/saveVideoGroup",
            payload: data.data
          });
        } else {
          message.error(codeMark[data.code]);
        }
      } else {
        message.error("系统异常");
      }
    });
  };

  /**
   * 显示弹窗
   */
  info = () => {
    this.setState({
      visible: true
    });
  };

  render() {

    const { form, video } = this.props;
    const { getFieldDecorator } = form;
    return (
      <div>
        <div>
          <Upload accept='.mp4, .flv'
                  beforeUpload={(file, fileList) => this.upload(file, fileList)}
                  showUploadList={false}
                  multiple={true}
          >
            <Button type="primary">上传视频</Button>
          </Upload>
          <a style={{ marginLeft: "12px" }} onClick={this.info}><Icon type="question-circle"/></a>
        </div>
        {this.props.list.length > 0 ?
          <Table
            // loading={loading}
            columns={this.columns}
            dataSource={this.props.list}
            size="middle"
            pagination={false}
            style={{marginTop:"24px"}}
            className={styles.videoTable}
          /> : null}
        <Modal
          visible={this.state.visible}
          title="上传要求"
          // onOk={this.handleOk}
          onCancel={this.handleCancel}
          footer={[
            <Button type="primary" key="back" onClick={this.handleCancel}>知道了</Button>
          ]}
        >
          <p>支持扩展名： .mp4，.flv</p>
        </Modal>
        {/*<div style={{ position: "relative" }}>{this.renderProcess()}</div>*/}
        <Modal
          visible={this.state.visible1}
          centered
          title="编辑"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          okText="保存"
          cancelText="取消"
        >
          <Form
            onSubmit={this.handleSubmitVideo}
            /*hideRequiredMark*/
            style={{ minHeight: "100px" }}
            id="editForm"
            className={styles.editForm}
          >
            <FormItem
              help={this.state.value1}
              label="排序"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator("sort", {
                rules: [
                  { required: false, message: "排序不能为空" }
                ], initialValue: this.state.currentRecord ? this.state.currentRecord.sort : ""
              })(<Input placeholder="请输入"/>)}
            </FormItem>
            <FormItem
              help={this.state.value1}
              label="视频名称"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator("name", {
                rules: [
                  { required: false, message: "视频名称不能为空" },
                  { max: 30, message: "不能输入超过30个字符" }
                ], initialValue: this.state.currentRecord ? this.state.currentRecord.name : ""
              })(<Input placeholder="请输入"/>)}
            </FormItem>
            <FormItem
              help={this.state.value1}
              label="讲师"
              labelCol={{ span: 5 }}
              wrapperCol={{ span: 12 }}
            >
              {getFieldDecorator("lecturer", {
                rules: [
                  { required: false, message: "请输入" }
                ], initialValue: this.state.currentRecord ? this.state.currentRecord.lecturer : ""
              })(<Input placeholder="请输入"/>)}
            </FormItem>
            <FormItem>
              <Button
                id="submitVideo"
                style={{ display: "none" }}
                type="primary"
                htmlType="submit"
              />
            </FormItem>

          </Form>
        </Modal>
        <ConfirmModal
          visible={this.state.visibleDelte}
          onOk={this.handleDelOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <span style={{ fontWeight: "800" }}>删除确认</span><br/>
          <span style={{ color: "#999", margin: "12px 0 0 30px", display: "block" }}>确定要删除吗？</span>
        </ConfirmModal>
      </div>
    );
  }
}
