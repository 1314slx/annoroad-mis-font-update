import React, { Component, Fragment } from "react";
import { connect } from "dva";
import {
  Modal, Button, Form, message, AutoComplete, Input, TreeSelect, Tree, Select, Row, Col, InputNumber
} from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import styles from "../../style.less";

const FormItem = Form.Item;
import { hashHistory } from "react-router";
import { getMyToolStatus, codeMark } from "../../../../utils/options";

const { Option } = Select;
/*class NewSignature extends Component {*/
import FileSelect from "../../../../components/custom/FileSelect";
import request from "../../../../utils/request";
import { setToken } from "../../../../utils/authority";
import { BOSS_PWD } from "../../../../utils/pattern";

@Form.create()
export default class NewInputFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      updateParams: false,//判断是新建还是编辑
      checkRule: [],
      value1: "",
      value2: "",
      value3: "",
      //_key : -1,
      isUpdate: false,
      isAdd: false,
      showMaxNumber: false//是否显示最大增加数量
    };
    this.fileSelect = React.createRef();
  }

  componentWillReceiveProps(nextProps, nextStates) {
    if (!this.state.isAdd) {
      if (nextProps.updateType === 1 && !this.state.isUpdate) {
        this.setState({
          isUpdate: true
        });
        if (!this.state.isAdd) {
          // 允许编辑最大参数
          if (nextProps.updateRecord && nextProps.updateRecord.dynamic === 1) {
            this.setState({
              showMaxNumber: true
            });
            nextProps.updateRecord.dynamic = 1;
          } else {
            nextProps.updateRecord.dynamic = 2;
          }
          this.props.form.setFieldsValue(nextProps.updateRecord);
        }
        this.setState({ visible: true, newRandomKey: Date.now() });
      }
    }
  }

  componentWillMount() {
    request("/annoroad-cloud-mis-server/dict/list", {
      body: {
        typeId: 1
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          this.setState({ checkRule: data.data });
        } else {
          message.error("参数错误");
        }
      } else {
        message.error("系统错误");
      }

    });
  }

  //取消
  _onCancel = () => {
    this.props.form.resetFields();
    this.setState({
      isUpdate: false,
      visible: false,
      isAdd: false,
      showMaxNumber: false,// 是否显示最大增加数量
      value1: "",
      value2: "",
      value3: "",
      updateParams: false
    });
    this.props.setUpdateType();
  };


  // 保存
  _onSubmit = e => {
    e.preventDefault();
    /*   const that = this;
       debugger;*/
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const { dispatch } = this.props;
        const length = this.props.toolsType.dataSourceModal.length;
        const params = {
          ...values,
          //key:(this.props.updateRecord.key > -1)?this.props.updateRecord.key:this.props.toolsType.dataSourceModal.length,
          key: this.state.isAdd ? this.props.toolsType.dataSourceModal.length : this.props.updateRecord.key,
          fieldName: values.fieldName,
          paramName: values.paramName,
          type: 1,
          defaultValue: values.defaultValue,
          prompt: values.prompt,
          rules: values.rules
        };
        // console.log("提交参数：", params);
        dispatch({
          type: "toolsType/inputFileSubmit",
          payload: params
        });
        this._onCancel();
        /*this.setState({ visible: false, isUpdate: false, isAdd: false });
        this.props.form.resetFields();
        this.props.setUpdateType();*/
      }
    });
  };

  //保存
  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };


  showFileSelect = () => {
    this.fileSelect.current.open("选择文件", false);
  };

  /**
   * 选择文件或文件夹后给文本框赋值
   */
  onFileOk = (path) => {
    let obj = {};
    obj["defaultValue"] = path;
    this.props.form.setFieldsValue(obj);
    /* if(this.props.onOk){
       this.props.onOk(this.props.data.type)
     }*/
  };

  children = (data) => {
    if (this.state.checkRule) {

      //debugger;
      return this.state.checkRule.map((value, index) => {
        return (
          <Option key={index} value={value.name}>
            {value.value}
          </Option>
        );
      });
    }
    //this.state.checkRule?return this.state.checkRule.map((value, index) => {}): return ""
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
// 校验输入提示字段长度长度
  checkPrompt = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value3: "输入提示"
      });
      callback("error");
    } else {
      this.setState({
        value3: ""
      });
      if (value.length < 1 || value.length > 30) {
        this.setState({
          value3: "请输入1-30个字符"
        });
        callback("error");
      } else {
        callback();
      }
    }
  };

  // 输入文件参数-modal弹出
  /* _showModal = (record) => {
     if(record.fieldName){
       this.props.form.setFieldsValue(record);
       this.setState({
         updateParams:true,
         _key:record.key
       })
     }

     this.setState({visible:true});
   };*/
  _showModal = () => {
    this.setState({ visible: true, isUpdate: false, isAdd: true, showMaxNumber: false });
    if (this.props.updateRecord) {
      this.props.updateRecord.dynamic = 2;
      this.props.updateRecord.maxNum = 1;
    }
    this.props.form.resetFields();
  };
  // 最大增加数量选择或者输入
  inputNumberChange = (value) => {
    this.props.form.setFieldsValue({
      maxNum: value
    });
  };

  // 自主增减选择
  dynamic = (e) => {
    let _flag = false;
    if (e.target.value === 1) {
      _flag = true;
    }
    this.setState({
      showMaxNumber: _flag
    });

  };

  render() {
    const { form, updateRecord } = this.props;
    const { getFieldDecorator } = form;
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
          输入文件
        </Button>
        <Modal title="输入文件"
               width={440}
               visible={this.state.visible}
               onOk={this._onSubmit}
          //key={this.state.newRandomKey}
               confirmLoading={this.state.confirmLoading}
               onCancel={this._onCancel}
        >
          <Form onSubmit={this._onSubmit}
                layout="horizontal"
                hideRequiredMark
                style={{ height: "auto", overflow: "hidden" }}
          >
            <FormItem  {...formItemLayout} label="字段名称" help={this.state.value1}
            >
              {getFieldDecorator("fieldName", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }, {
                    validator: this.checkFieldName
                  }
                ]
              })(<Input placeholder="输入文件"/>)}
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
            <FormItem {...formItemLayout} label="输入提示" help={this.state.value3}>
              {getFieldDecorator("prompt", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }, {
                    validator: this.checkPrompt
                  }
                ]
              })(<Input placeholder="用户填写时的注意事项"/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="示例文件">
              {getFieldDecorator("defaultValue", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ]
              })(<Input readOnly="readonly" placeholder="示例文件存储地址" onClick={this.showFileSelect}/>)}
            </FormItem>
            <FormItem {...formItemLayout} label="校验规则">
              {getFieldDecorator("rules", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  }
                ]
              })(
                <Select
                  mode="multiple"
                  style={{ width: "100%" }}
                  placeholder="请选择"
                  /*onChange={handleChange}*/
                >
                  {/*{this.children}*/}
                  {this.children(this.state.checkRule)}
                </Select>
              )}
            </FormItem>
            <ColFormItem form={form}
                         layout={{ span: 24 }}
                         label="自主增减"
                         type='RadioGroup'
                         formItemLayout={formItemLayout}
                         options={[{ key: 1, value: "允许" }, { key: 2, value: "不允许" }]}
                         initialValue={updateRecord && updateRecord.dynamic && updateRecord.dynamic === 1 ? 1 : 2}
                         parameter="dynamic"
                         onChange={this.dynamic}
            />
            {
              this.state.showMaxNumber ? <FormItem {...formItemLayout} label="最大增加数量">
                {getFieldDecorator("maxNum", {
                  rules: [{
                    required: true,
                    message: "请输入1-10之间的整数"
                  },{
                    pattern:/^(10|[1-9])$/,
                    message: "请输入1-10之间的整数"
                  }],
                  initialValue: updateRecord && updateRecord.maxNum ? updateRecord.maxNum : 1
                })(
                  <InputNumber min={1}
                               max={10}
                               style={{ width: 117 }}
                               onChange={this.inputNumberChange}/>
                )}
                &nbsp;个
              </FormItem> : <Fragment/>
            }


          </Form>

          <FileSelect ref={this.fileSelect}
                      {...this.props}
                      onOk={path => this.onFileOk(path)}
                      rootDir={"示例数据"}
                      isVisible={false}
                      requestUri={"/annoroad-cloud-mis-server/data/find"}/>

        </Modal>

      </div>
    );
  }
}

/*export default connect(({ toolsType, loading }) => ({
  toolsType
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(NewInputFile));*/
