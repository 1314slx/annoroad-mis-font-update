import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal, Button, Form, message, AutoComplete, Input, TreeSelect, Tree, Select, Row, Col
} from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import styles from "../../style.less";

const FormItem = Form.Item;
import { hashHistory } from "react-router";
import { getMyToolStatus } from "../../../../utils/options";

const { Option } = Select;
/*class NewSignature extends Component {*/
let myStyle = {};
@Form.create()
export default class NewRadioFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      optionsList: [],
      value1: "",
      value2: "",
      isUpdate: false,
      _value: false,
      isAdd: false,
      visibleHelp: 0,
      newRandomKey: 0,
      selectValue: []
    };
    this.value = [];
  }

  componentWillReceiveProps(nextProps, nextStates) {
    if (nextProps.updateType === 3 && !this.state.isUpdate) {
      this.setState({
        isUpdate: true
      });
      if (nextProps.updateRecord.options.length > 0) {
        this.value[1] = nextProps.updateRecord.options[0].text;
        this.value[2] = nextProps.updateRecord.options[0].value;
        this.value[3] = nextProps.updateRecord.options[1].text;
        this.value[4] = nextProps.updateRecord.options[1].value;
      }

      this.setState({
        _value: true
      });
      if (!this.state.isAdd) {
        this.props.form.setFieldsValue(nextProps.updateRecord);
      }
      this.setState({ visible: true });
    }
  }


  //取消
  _onCancel = () => {
    this.setState({ visible: false });
    this.props.form.resetFields();
    this.setState({
      isUpdate: false,
      isAdd: false,
      value1: "",
      value2: ""
    });
    this.props.setUpdateType();

  };

  onChange = (e) => {
    /*console.log("e是什么：",e)
    console.log("e是什么：",e.target)
    console.log("e是id什么：",e.target.id)*/
    let _id = document.getElementById(e.target.id);
    let _targetId = e.target.id;
    let _prefix = _targetId ? _targetId.substring(_targetId.lastIndexOf("_") + 1, _targetId.length) : "";

    this.setState({ inputValue: e.target.value });
    if (e.target.value.length > 10) {
      if (_id && (_prefix % 2 != 0)) {
        _id.style.position = "relative";
      }
      this.setState({
        visibleHelp: 1
      });
    } else {
      if (_id && (_prefix % 2 != 0)) {
        _id.style.position = "initial";
      }
      this.setState({
        visibleHelp: 0
      });
    }
  };
  // 保存
  _onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const length = this.props.toolsType.dataSourceModal.length;
        let _optionsListData = [];
        _optionsListData.push(
          { text: values.inputPrompt_1, value: values.inputPrompt_2 },
          { text: values.inputPrompt_3, value: values.inputPrompt_4 }
        );

        this.state.optionsList ? this.state.optionsList.map(() => {

        }) : "";
        values.options = _optionsListData;
        const params = {
          //key:(this.props.updateRecord.key > -1)?this.props.updateRecord.key:this.props.toolsType.dataSourceModal.length,
          key: this.state.isAdd ? this.props.toolsType.dataSourceModal.length : this.props.updateRecord.key,
          fieldName: values.fieldName,//字段名称
          defaultValue: values.defaultValue,//示例参数
          type: 3,
          paramName: values.paramName,//参数名称
          //options:this.state.optionsList,  //可选项
          options: _optionsListData  //可选项
        };
        dispatch({
          type: "toolsType/inputFileSubmit",
          payload: params
        });
        this.props.form.resetFields();
        this.setState({ visible: false, isUpdate: false });
        this.props.setUpdateType();
        this.setState({ isAdd: false });


      }
    });
  };

  //保存
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
// 鼠标离开input框触发该方法
  handleInputChange = (event) => {
    let inputPrompt_1 = this.props.form.getFieldValue('inputPrompt_1');
    let inputPrompt_2 = this.props.form.getFieldValue('inputPrompt_2');
    let inputPrompt_3 = this.props.form.getFieldValue('inputPrompt_3');
    let inputPrompt_4 = this.props.form.getFieldValue('inputPrompt_4');
    let _optionsList = [];
    _optionsList.push(
      { text: inputPrompt_1, value: inputPrompt_2 },
      { text: inputPrompt_3, value: inputPrompt_4 }
    );
      this.setState({
        optionsList: _optionsList
      }, () => {
        if (!this.selectObj) {
          return;
        }
        for (let i = 0, j = _optionsList.length; i < j; i++) {
          const _tmpObj = _optionsList[i];
          if (this.selectObj.value == _tmpObj.value) {
            this.setState({
              selectValue: _tmpObj.value
            }, () => {
              this.props.form.setFieldsValue({
                defaultValue: this.state.selectValue
              });
              this.selectObj = {
                text: _tmpObj.text,
                value: _tmpObj.value
              };
            });
          }
          if (this.selectObj.text == _tmpObj.text) {
            this.setState({
              selectValue: _tmpObj.value
            }, () => {
              this.props.form.setFieldsValue({
                defaultValue: this.state.selectValue
              });
              this.selectObj = {
                text: _tmpObj.text,
                value: _tmpObj.value
              };
            });
          }
        }
        //this.selectObj


      });
    // });
  };


//循环展示四个可选项input框
  optionsItem = () => {
    let items = [];
    for (let i = 1; i <= 4; i++) {
      items.push(
        /*this.props.form.getFieldDecorator("inputPrompt1", {*/
        this.props.form.getFieldDecorator(`inputPrompt_${i}`, {
          rules: [
            {
              required: true,
              message: "请输入"
            }
          ]
          , initialValue: this.state._value ? this.value[i] : ""
        })(i == 1 || i == 3 ?
          // , initialValue: this.state.isAdd ? (i%2==0?"value" :"选项名"): this.value[i]})(i==1||i==3?
          <Input key={i} style={{ width: "45%", marginRight: "3%" }} className={styles.inputItem}
                 onChange={this.onChange}
                 onBlur={event => {
                   this.handleInputChange(event);
                 }} placeholder={"选项名"}/>
          :
          <Input key={i} style={{ width: "48%", marginRight: "1%", marginBottom: "24px" }} onBlur={event => {
            this.handleInputChange(event);
          }} placeholder={"value"}/>
        )
      );
    }
    return items;
  };


  _onChange = (value) => {

    this.setState({
      selectValue: value
    }, () => {
      const _data = this.state.optionsList;
      for (let i = 0, j = _data.length; i < j; i++) {
        const _tmpObj = _data[i];
        if (value == _tmpObj.value) {
          this.selectObj = {
            text: _tmpObj.text,
            value: _tmpObj.value
          };
        }
      }

    });

  };
  //校验规则
  children = () => {
    let _list = [];
    const _data = this.state.optionsList;
    if (_data && _data != 0) {
      for (let i = 0, j = _data.length; i < j; i++) {
        const _tmpObj = _data[i];
        if (_tmpObj.value && _tmpObj.text) {
          _list.push(<Option key={i} value={_tmpObj.value}>
            {`${_tmpObj.text}-${_tmpObj.value}`}
          </Option>);
        }
      }
      /*return this.state.optionsList.map((value, index) => {
        return (
          <Option key={index} value={value.value}>
            {value.text + "-" + value.value}
          </Option>
        );
      });*/
    }
    return _list;
    //this.state.checkRule?return this.state.checkRule.map((value, index) => {}): return ""
  };

  // 弹出modal框
  _showModal = () => {

    this.setState({
      visible: true,
      isUpdate: false,
      isAdd: true,
      newRandomKey: Math.random(),
      optionsList: []
    });
    this.props.form.resetFields();
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

  render() {
    const { form, submitting, visible, data } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { newRandomKey } = this.state;
    myStyle = this.state.visibleHelp == 1 ? {
      position: "absolute",
      top: "25px",
      width: "10em",
      left: "0",
      color: "#f5222d",
      height: "24px",
      lineHeight: "24px",
      fontSize: "14px"
    } : { display: "none" };
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
          单选Radio
        </Button>
        <Modal
          title="单选Radio"
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
            <FormItem  {...formItemLayout} label="字段名称" help={this.state.value1}>
              {getFieldDecorator("fieldName", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }, {
                    validator: this.checkFieldName
                  }
                ]
              })(<Input placeholder="请输入"/>)}
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
            <FormItem {...formItemLayout} label="可选项">
              {this.optionsItem()}
              <span style={myStyle}>请输入1-10个字符</span>
            </FormItem>

            <FormItem {...formItemLayout} label="示例参数">
              {getFieldDecorator("defaultValue", {
                rules: [{
                  required: true,
                  message: "请输入"
                }],

                onChange: this._onChange

              })(
                <Select style={{ width: "100%" }}
                        placeholder="请选择"
                >
                  {this.children()}
                </Select>
              )}
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
}))(Form.create()(NewRadioFile));*/
