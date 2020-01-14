import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal, Button, Form, message, AutoComplete, Input, TreeSelect, Tree, Select, Row, Col, Radio
} from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import styles from "../../style.less";

const FormItem = Form.Item;
import { hashHistory } from "react-router";
import { getMyToolStatus } from "../../../../utils/options";

const { Option } = Select;
const RadioGroup = Radio.Group;
/*class NewSignature extends Component {*/

import FileSelect from "../../../../components/custom/FileSelect";
import request from "../../../../utils/request";
import { setToken } from "../../../../utils/authority";

@Form.create()
export default class NewOutputFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      checkRule: [],
      value1: "",
      value2: "",
      //_key : -1,
      isUpdate: false,
      status: 2// 结论是否显示，默认为否（2）
    };
    this.fileSelect = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextStates) {
    if (nextProps.updateType === 6 && !this.state.isUpdate) {
      this.setState({
        isUpdate: true
      });

      // this.state.status
      this.setState({
        conclusion: nextProps.updateRecord.conclusion
      });
      this.props.form.setFieldsValue(nextProps.updateRecord);
      this.setState({ visible: true });
    }
  }

  componentWillMount() {
  }

  //取消
  _onCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
    this.setState({
      isUpdate: false,
      status: 2,
      value1: "",
      value2: "",
    });
    this.props.setUpdateType();
  };

  // 保存
  _onSubmit = e => {
    e.preventDefault();
    /*   const that = this;
       debugger;*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }

      const { dispatch } = this.props;
      const length = this.props.toolsType.dataSourceModal.length;
      const params = {
        key: (this.props.updateRecord.key > -1) ? this.props.updateRecord.key : this.props.toolsType.dataSourceModal.length,
        fieldName: values.fieldName,//字段名称
        paramName: values.paramName, //参数名称
        type: 6, //参数类型
        prompt: values.prompt, //输入提示
        conclusion: values.conclusion // 结论显示
      };
      dispatch({
        type: "toolsType/inputFileSubmit",
        payload: params
      });
      this.props.form.resetFields();
      //完成后modal框关闭
      this.setState({ visible: false, isUpdate: false, status: 2 });
      this.props.setUpdateType();
    });
  };

  //保存
  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

  // 多选的添加
  _showModal = () => {
    this.setState({ visible: true, isUpdate: false });
  };

  /**
   * 选择文件或文件夹后给文本框赋值
   */
  onFileOk = (path) => {
    let obj = {};
    obj["prompt"] = path;
    this.props.form.setFieldsValue(obj);
  };
// 校验字段名称长度
  checkFieldName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value1: "字段名称"
      });
      callback("error");
    } else {
      this.setState({
        value1: ""
      });
      if (value.length < 1 || value.length > 8) {
        this.setState({
          value1: "请输入1-8个字符"
        });
        callback("error");
      } else {
        callback();
      }
    }
  };
// 校验参数名称长度
  checkParamName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value2: "参数名称"
      });
      callback("error");
    } else {
      this.setState({
        value2: ""
      });
      if (value.length < 1 || value.length > 20) {
        this.setState({
          value2: "请输入1-20个字符"
        });
        callback("error");
      } else {
        callback();
      }
    }
  };

  /**
   * 切换单选按钮
   * @param e
   */
  onChange = (e) => {
    this.setState({
      status: e.target.value
    });

  };

  render() {
    const { form, newRandomKey, submitting, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };
    return (
      <div>
        <Button key="back" onClick={this._showModal} icon="plus"
                style={{ marginRight: "12px", width: "auto", float: "left" }}>
          输出文件夹
        </Button>
        <Modal
          title="输出文件夹"
          width={400}
          visible={this.state.visible}
          onOk={this._onSubmit}
          key={newRandomKey}
          confirmLoading={this.state.confirmLoading}
          onCancel={this._onCancel}
        >
          <Form
            onSubmit={this._onSubmit}
            layout="horizontal"
            hideRequiredMark
            style={{ height: "auto", overflow: "hidden" }}
          >
            <FormItem   {...formItemLayout} label="字段名称" help={this.state.value1}>
              {getFieldDecorator("fieldName", {
                rules: [
                  {
                    required: true,
                    message: "输出文件夹"
                  }, {
                    validator: this.checkFieldName
                  }
                ]
              })(<Input placeholder="输出文件夹"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="参数名称" help={this.state.value2}>
              {getFieldDecorator("paramName", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }, {
                    validator: this.checkParamName
                  }
                ]
              })(<Input placeholder="key"/>)}
            </FormItem>

            <FormItem {...formItemLayout} label="输入提示">
              {getFieldDecorator("prompt", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ], initialValue: "请选择结果输出文件夹"
              })(<Input readOnly="readonly" placeholder="示例文件存储地址"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="结论显示">
              {getFieldDecorator("conclusion", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ], initialValue: this.state.conclusion ? this.state.conclusion : this.state.status
              })(<RadioGroup onChange={this.onChange}>
                <Radio value={1}>公开</Radio>
                <Radio value={2}>非公开</Radio>
              </RadioGroup>)}
            </FormItem>

            {/*  <Form.Item
              label="隐私设置"
            >
              <RadioGroup onChange={this.onChange} value={this.state.status}>
                <Radio value={1}>公开</Radio>
                <Radio value={2}>非公开</Radio>
              </RadioGroup>
              <span style={{color:"rgba(0, 0, 0, 0.447)"}}>(客户默认被分享)</span>
            </Form.Item>*/}


          </Form>
          <FileSelect ref={this.fileSelect}
                      {...this.props}
                      onOk={path => this.onFileOk(path)}
                      rootDir={"示例数据"}
                      requestUri={"/annoroad-cloud-mis-server/data/find"}/>
        </Modal>
      </div>
    );
  }
}

/*export default connect(({ toolsType, loading }) => ({
  toolsType
}))(Form.create()(NewOutputFile));*/
