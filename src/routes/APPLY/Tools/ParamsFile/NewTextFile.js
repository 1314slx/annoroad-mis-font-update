import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal,  Button,  Form,  message,  AutoComplete, Input,  TreeSelect,  Tree, Select, Row, Col, } from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import styles from "../../style.less";
const FormItem = Form.Item;
import { hashHistory } from "react-router";
import { getMyToolStatus } from "../../../../utils/options";
const { Option } = Select;
/*class NewSignature extends Component {*/

@Form.create()
export default class NewTextFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      value1 : "",
      value2 : "",
      value3 : "",
      _key : -1,
      isUpdate: false,
      isAdd: false,

    };

  }
  componentWillReceiveProps(nextProps,nextStates){
    if(!this.state.isAdd) {
      if (nextProps.updateType === 2 && !this.state.isUpdate) {
        this.setState({
          isUpdate: true,
          _key: 0,
        })
        if (!this.state.isAdd) {
          this.props.form.setFieldsValue(nextProps.updateRecord);
        }
        this.setState({ visible: true });
      }
    }
  }

  componentWillMount(){
    this.setState({
      value1:"",
      value2 : "",
      value3 : ""
    })

  }
  //取消
  _onCancel = () => {
    this.setState({visible:false});
    this.props.form.resetFields();
    this.setState({
      isUpdate: false,
      isAdd: false,
      value1:"",
      value2 : "",
      value3 : ""
    })
    this.props.setUpdateType();
  };
  // 保存
  _onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if(err){
        return;
      }
      //判断校验规则是否同时选择了小数和其他的校验规则
      if(values.rules.length>1){
        let _rules = values.rules&&values.rules.length>0?values.rules:[]
        let arr = [];
        for(let i = 0;i<_rules.length;i++){
          if(_rules[i] == "decimal"){
            arr.push(_rules[i]);
            continue;
          }
        }
        if(arr.length>0){
          message.error("请勿同时选择小数和其他校验规则");
          arr = [];
          _rules = [];
          return;
        }
      }
        const { dispatch } = this.props;
        const length = this.props.toolsType.dataSourceModal.length;
        const params = {
          //key:this.props.toolsType.dataSourceModal.length,
          //key:(this.props.updateRecord.key > -1)?this.props.updateRecord.key:this.props.toolsType.dataSourceModal.length,
          key:this.state.isAdd?this.props.toolsType.dataSourceModal.length:this.props.updateRecord.key,
          fieldName:values.fieldName,
          type:2,
          paramName:values.paramName,
          prompt:values.prompt,
          defaultValue:values.defaultValue,
          rules:values.rules,
        };
        dispatch({
          type: "toolsType/inputFileSubmit",
          payload: params
        });
        this.setState({visible:false,isUpdate:false,isAdd:false});
        this.props.form.resetFields();
        this.props.setUpdateType();
    });
  };

  // modal-点击保存按钮
  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

 // select 切换2
  handleBlur = () => {
  };
 // select 切换3
  handleFocus = () => {
  };
 // select 切换3
  handleChange = () => {
  };
  // 展示弹出文本框modal
  _showModal = () => {
    this.setState({visible:true,isUpdate:false,isAdd:true});
  };

// 校验字段名称长度
  checkFieldName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value1: "字段名称",
      });
      callback("error");
    } else {
      this.setState({
        value1: ""
      });
      if (value.length < 1||value.length > 8) {
        this.setState({
          value1: "请输入1-8个字符",
        });
        callback("error");
      }else {
        callback();
      }
    }
  }
// 校验参数名称长度
  checkParamName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value2: "参数名称",
      });
      callback("error");
    } else {
      this.setState({
        value2: ""
      });
      if (value.length < 1||value.length > 20) {
        this.setState({
          value2: "请输入1-20个字符",
        });
        callback("error");
      }else {
        callback();
      }
    }
  }
// 校验输入提示字段长度长度
  checkPrompt = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value3: "字段名称",
      });
      callback("error");
    } else {
      this.setState({
        value3: ""
      });
      if (value.length < 1||value.length > 30) {
        this.setState({
          value3: "请输入1-30个字符",
        });
        callback("error");
      }else {
        callback();
      }
    }
  }

  render() {
    const { form, newRandomKey,submitting, visible, data } = this.props;
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
        <Button key="back" onClick={this._showModal}  icon="plus" style={{marginRight:"12px",width:"auto",float:"left"}} >
          文本框
        </Button>
        <Modal
          title="文本框"
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
            <FormItem
              {...formItemLayout}
              label="字段名称"
              help={this.state.value1}
            >
              {getFieldDecorator("fieldName", {
                rules: [
                  {
                    required: true,
                    message:"请输入"
                  },{
                    validator: this.checkFieldName
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="参数名称" help={this.state.value2}  >
              {getFieldDecorator("paramName", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  },{
                    validator: this.checkParamName
                  }
                ] })(<Input  placeholder="key" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="输入提示" help={this.state.value3} >
              {getFieldDecorator("prompt", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  },{
                    validator: this.checkPrompt
                  }
                ]
              })(<Input placeholder="用户填写时的注意事项" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="示例参数">
              {getFieldDecorator("defaultValue", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>
            <FormItem {...formItemLayout} label="校验规则">
              {getFieldDecorator("rules", {
                rules: [
                  {
                    required: true,
                    message: "请选择"
                  }
                ]
              })(<Select
                mode="multiple"
                style={{ width: "100%" }}
                placeholder="请选择"
                optionFilterProp="children"
                onChange={this.handleChange}
                onFocus={this.handleFocus}
                onBlur={this.handleBlur}
                filterOption={(input, option) => option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0}
              >

                <Option value="uppercase">大写字母</Option>
                <Option value="lowercase">小写字母</Option>
                <Option value="num">数字</Option>
                <Option value="chinese">中文</Option>
                <Option value="decimal">小数</Option>
                <Option value="special">特殊字符(逗号、冒号、顿号、点、/、\、|、_、-)</Option>
              </Select>,)}
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

/*export default connect(({ toolsType, loading }) => ({
  toolsType
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(NewTextFile));*/
