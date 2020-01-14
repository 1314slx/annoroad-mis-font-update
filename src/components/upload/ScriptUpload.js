import React, { Component } from "react";
import { Form, Icon, Upload , message} from "antd";
import {getOssClient} from '../../utils/oss';

const FormItem = Form.Item;
const Dragger = Upload.Dragger;

/**
 * 编辑工具-脚本上传组件
 */
export default class ScriptUpload extends Component {
  constructor(props) {
    super(props);
    this.state = {
      code: this.props.code,                          // 工具编号
      required: this.props.required || false,         // 是否进行必填验证
      message: this.props.message || "请上传后缀名为 .zip 格式的文件；只可上传一个文件",   // 提示信息
      fieldName: this.props.fieldName || "script",    // 字段名称
      initialValue: this.props.initialValue,          // 初始值
      form: this.props.form,                          // form
      fileList: this.props.initialValue ? [{
                  uid: '-1',
                  name: this.props.initialValue,
                  status: 'done',
                }] :[],                                // 文件列表，用于展示上传文件
    }
    this.script = null;                               // 脚本文件引用
  }
//
  UNSAFE_componentWillReceiveProps(nextProps, nextStates){
    if(this.props.initialValue != nextProps.initialValue){
      this.setState({
        initialValue: nextProps.initialValue,
        script: nextProps.initialValue,
        fileList: nextProps.initialValue ? [{
          uid: '-1',
          status: 'done',
          name: nextProps.initialValue
        }] :[],
      })
    }
  }

  /**
   * 暂存zip脚本文件
   * */
  stashScript = (file) => {
    let len = file.name.length;
    if(len < 4 || (len > 4 && file.name.substring(len-4, len) != ".zip")){
      message.error("请上传zip文件")
      return false;
    }
    this.script = file,
    this.setState({
      fileList: [{
        uid: '-1',
        name: file.name,
        status: 'done',
      }]
    })
    return false;
  }

  /**
   * 移除脚本列表信息
   */
  removeScript = (e) => {
    this.script = null,
    this.setState({
      fileList: [],
    })
    let obj = {};
    obj[this.state.fieldName] = undefined;
    this.props.form.setFieldsValue(obj);
  }

  /**
   * 修改表单提交时脚本字段上传信息
   * */
  getScriptName = (e) => {
    if(!this.script){
      return undefined;
    }
    return e.file.name;
  }

  /**
   * 上传zip脚本文件
   * */
  uploadScript = async () => {
    let isSuccess = true;
    if(this.script) {
      let name = this.script.name;
      this.setState({
        fileList: [{
          uid: '-1',
          name: name,
          status: 'uploading',
        }]
      })
      let client = getOssClient();
      if (client) {
        let result = await client.put("sys/tool/tmp/" + this.state.code + "/" + this.script.name, this.script)
        isSuccess = result.res.status === 200;
        this.setState({
          fileList: [{
            uid: '-1',
            name: name,
            status: isSuccess ? 'done' : 'error'
          }]
        })
      }
    }
    return isSuccess;
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <FormItem>
        {getFieldDecorator(this.state.fieldName, {
          rules: [{
            required: this.state.required, message: this.state.message,
          }],
          getValueFromEvent: this.getScriptName,
          initialValue: this.state.initialValue
        })(
          <Dragger
            accept=".zip"
            beforeUpload={(file, fileList) => this.stashScript(file, fileList)}
            fileList={this.state.fileList}
            onRemove={this.removeScript}
          >
            <p className="ant-upload-drag-icon">
              <Icon type="inbox" />
            </p>
            <p className="ant-upload-hint">
              点击或将文件拖拽到这里上传
            </p>
            <p className="ant-upload-hint">
              支持扩展名： .zip
            </p>
          </Dragger>
        )}
      </FormItem>
    );
  }
}
