import React, { Component } from "react";
import { Form, Upload, message, Modal, Icon, Button } from "antd";
import {getOssClient} from '../../utils/oss';

const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  },
};

/**
 * 编辑工具-logo上传组件
 */
export default class ImageUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.code,                          // 工具版本编号
      label: this.props.label || "列表头图",          // label名称
      required: this.props.required || false,         // 是否进行必填验证
      message: this.props.message || "请上传符合大小50KB,格式png或jpg要求的图片",   // 提示信息
      fieldName: this.props.fieldName ||(this.props.difference==1?"cover": "logo"),      // 字段名称
      initialValue: this.props.initialValue,          // 初始值
      form: this.props.form,                          // form
      fileList: this.props.initialValue ? [{
                  uid: '-1',
                  status: 'done',
                  url: this.props.initialValue
                }] :[],                               // 文件列表，用于展示上传文件
      visible: false,                                 // 是否展示预览Modal
    }
    this.src = undefined;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextStates){
    if(this.props.initialValue != nextProps.initialValue){
      if(this.props.difference==1){
        this.setState({
          initialValue: nextProps.initialValue,
          cover: nextProps.initialValue,
          fileList: nextProps.initialValue ? [{
            uid: '-1',
            status: 'done',
            url: nextProps.initialValue
          }] :[],
        })
      }
      this.setState({
        initialValue: nextProps.initialValue,
        logo: nextProps.initialValue,
        fileList: nextProps.initialValue ? [{
          uid: '-1',
          status: 'done',
          url: nextProps.initialValue
        }] :[],
      })
    }
  }

  uploadButton = (
    this.props.difference==1?
    <div>
      <Button>
        <Icon type="upload" /> 上传（532*320）
      </Button>
    </div>:<div>
        <Icon type="plus" />
      <div className="ant-upload-text" style={{marginTop:"20px"}}>上传</div>
      </div>
  );

  /**
   * 预览
   */
  preview = () => {
    this.setState({
      visible: true
    })
  }

  /**
   * 取消预览
   */
  cancel = () => {
    this.setState({
      visible: false
    })
  }

  /**
   * 获取预览图片路径
   */
  getSrc = () => {
    let src = this.state.initialValue;
    if(this.src){
      src = this.src;
    }
    return src;
  }

  /**
   * 移除头图列表信息
   */
  removeImage = (e) => {
    this.src =  null;
    this.setState({
      fileList: [],
    })
    this.setValue(undefined);
  }


  /**
   * 设置值
   */
  setValue = (value) => {
    let obj = {};
    obj[this.state.fieldName] = value;
    this.props.form.setFieldsValue(obj);
  }

  /**
   * 上传头图文件
   * */
  uploadImage = (file) => {
    let len = file.name.length;
    let suffix = file.name.substring(len-4, len);
    if(len < 4 || (len > 4 && suffix != ".png" && suffix != '.jpg')){
      message.error("请上传符合大小50KB,格式png或jpg要求的图片")
      return false;
    }
    let isSuccess = true;
    if(file) {
      this.setState({
        fileList: [{
          uid: '-1',
          name: file.name,
          status: 'uploading',
        }]
      })
      let client = getOssClient();
      if (client) {
        let path = (this.props.difference==1?"source/video-cover/":"source/tool-logo/") + this.state.code + "/" + this.generateUUID() + suffix;
        client.put(path, file).then((result) => {
          isSuccess = result.res.status === 200;
          if (isSuccess) {
            client.putACL(path, 'public-read').then(() => {
              this.setState({
                fileList: [{
                  uid: '-1',
                  name: file.name,
                  url: result.url,
                  status: 'done'
                }]
              })
              this.src = result.url;
              this.setValue(result.url);
            })
          } else {
            this.setState({
              fileList: []
            })
            this.setValue(undefined);
            message.error("头图上传失败");
          }
        })
      }
    }
    return false;
  }

  /**
   * 生成图片唯一标识
   */
 generateUUID =() => {
    let d = new Date().getTime();
    let uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      let r = (d + Math.random()*16)%16 | 0;
      d = Math.floor(d/16);
      return (c=='x' ? r : (r&0x7|0x8)).toString(16);
    });
    return uuid;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem label={this.state.label} {...formItemLayout} required={false}>
        {getFieldDecorator(this.state.fieldName, {
          rules: [{
            required: this.state.required, message: this.state.message,
          }],
          initialValue: this.state.initialValue
        })(
            <Upload
              accept=".png,.jpg"
              listType="picture-card"
              beforeUpload={(file, fileList) => this.uploadImage(file, fileList)}
              fileList={this.state.fileList}
              onPreview={this.preview}
              onRemove={this.removeImage}
            >
              {this.state.fileList.length >= 1 ? null : this.uploadButton}
            </Upload>
        )}
        {this.props.difference==1?<span style={{display:"block",top:"-46px",position:"absolute",left:"200px"}}>.png，.jpg</span>:null}
        <div>
          <Modal
            zIndex={99999}
            visible={this.state.visible}
            footer={null}
            onCancel={this.cancel}
          >
            <img
              alt="logo"
              style={{ width: "100%" }}
              src={this.getSrc()}
            />
          </Modal>
        </div>

      </FormItem>

    );
  }
}
