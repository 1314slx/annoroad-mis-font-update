import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal,
  Form,
  message,
  Input,
  TreeSelect,
  Select,
  Button
} from "antd";
import * as routerRedux from "react-router-redux";
import request from "../../../utils/request";
import styles from "./myTools.less";

const FormItem = Form.Item;
const { Option } = Select;
const objName = {};

class NewToolsManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      treeValue: ["sss", "leaf1"],
      getName: {}
    };
    this.previousTime = 0;
  }

  _onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      console.log("提交参数:", values);
      // let tmpArr = objName&&objName.length>0?[].concat(objName):[];
      for (let i = 0; i < values.principals.length; i++) {
        const nameTest = values.principals[i];
        values.principals[i] = nameTest.substring(nameTest.indexOf("_") + 1, nameTest.length);
      }
      if (values.principals.length > 0) {
        values.principals = values.principals.join(",");
      }
      const { dispatch } = this.props;
      values.sort = this.props.data ? this.props.data.sort : 1;
      dispatch({
        type: "toolsManager/newToolsManagerSubmit",
        payload: values
      }).then(() => {
        const { createStatus } = this.props.toolsManager;

        if (createStatus === 1) {
          message.success("保存完成");
          //返回把返回列表页面
          setTimeout(() => {
            this.setState({ confirmLoading: false });
            this.props.setModel(false, null);
            if (this.props.onRefresh) {
              this.props.onRefresh();
            }
            // this.props.dispatch(
            //   routerRedux.push("/apply/toolsManager")
            // );
          }, 10);
        } else if (createStatus === 6) {
          message.error("工具已存在");
          //返回把返回列表页面
        } else if (createStatus === 2) {
          message.error("工具不存在");
          //返回把返回列表页面
        } else if (createStatus === 3) {
          message.error("工具类型不存在");
          //返回把返回列表页面
        } else if (createStatus === 4) {
          message.error("工具版本已存在");
          //返回把返回列表页面
        } else if (createStatus === 5) {
          message.error("工具默认运行环境已存在");
          //返回把返回列表页面
        } else if (createStatus === 7) {
          message.error("标识名已存在");
          //返回把返回列表页面
        } else if (createStatus === 8) {
          message.error("工具已上架");
          //返回把返回列表页面
        }
      });
    });
  };


  //保存
  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };
  //取消
  _onCancel = () => {
    this.props.setModel(false, null);
  };
  //树形结构-负责人
  onChange = value => {
    this.setState({ value });
  };


  //修改负责人结构树格式
  getData = _data => {
    if (_data) {
      return _data.map(value => {
        if (value.leaf === 1) {
          objName[value.name] = value.userId;
          objName[value.userId] = value.name;
          return {
            title: value.name,
            //value: value.userId,
            value: value.name + "_" + value.userId,
            key: value.userId
          };
        } else {
          return {
            title: value.name,
            selectable: false,
            children: this.getData(value.childNodes)
          };
        }
      });
    }
  };

  render() {
    const { newRandomKey, visible, data } = this.props;
    const _title = data ? "编辑工具" : "新建工具";
    const { getFieldDecorator } = this.props.form;
    const tProps = {
      treeData: this.getData(
        this.props.toolsChargePerson ? this.props.toolsChargePerson.structure : []
      ),
      onChange: this.onChange,
      searchPlaceholder: "请输入",
      multiple: true
    };
    const formItemLayout = {
      labelCol: {
        span: 7
      },
      wrapperCol: {
        span: 14
      }
    };
    return (
      <Modal
        bodyStyle={{ padding: "33px 0" }}
        title={_title}
        /*width={350}*/
        style={{ width: "50%", top: 190 }}
        visible={visible}
        onOk={this._onSubmit}
        key={newRandomKey}
        confirmLoading={this.state.confirmLoading}
        onCancel={this._onCancel}
        footer={[
          <Button onClick={this._onCancel}>取消</Button>,
          <Button type="primary" onClick={this._onSubmit}>保存</Button>
        ]}
      >
        <Form
          onSubmit={this._onSubmit}
          layout="horizontal"
          hideRequiredMark
          style={{ height: "auto", overflow: "hidden" }}
        >
          <FormItem
            {...formItemLayout}
            label="工具编号"
            style={{ display: "none" }}
          >
            {getFieldDecorator("code", {
              initialValue: data ? data.code : "",
              rules: [
                {
                  required: false
                }
              ]
            })(<Input/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="工具名称">
            {getFieldDecorator("name", {
              initialValue: data ? data.name : "",
              rules: [
                {
                  required: true,
                  message: "请输入1-20个字符"
                }, {
                  max: 20,
                  message: "请输入1-20个字符"
                }
              ]
            })(<Input placeholder="请输入"/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="标识名">
            {getFieldDecorator("alias", {
              initialValue: data ? data.alias : "",
              rules: [
                {
                  required: true,
                  message: "字母、数字或两者的组合，最多输入15个字符，不允许输入空格"
                }, {
                  max: 15,
                  message: "字母、数字或两者的组合，最多输入15个字符，不允许输入空格"
                },
                {
                  pattern: /^[0-9a-zA-Z]*$/g,
                  message: "字母、数字或两者的组合，最多输入15个字符，不允许输入空格"
                }
              ]
            })(<Input placeholder="字母、数字或两者的组合，设置后不能修改" disabled={data ? (data.upTime == 0 ? "" : "true") : ""}/>)}
          </FormItem>
          <FormItem {...formItemLayout} label="工具类型">
            {getFieldDecorator("typeCode", {
              initialValue: data ? data.typeCode : undefined,
              rules: [
                {
                  required: true,
                  message: "请选择"
                }
              ]
            })(
              <Select style={{ width: "100%" }} placeholder={"请选择"}>
                {this.props.myToolTypeGroupData && this.props.myToolTypeGroupData.result ?
                  this.props.myToolTypeGroupData.result.map((value, index) => (
                    <Option value={value.code}>{value.name}</Option>
                  )) : ""}
              </Select>
            )}
          </FormItem>

          {/*树形结构-数据*/}
          <FormItem {...formItemLayout} label="负责人">
            {getFieldDecorator("principals", {
              /*initialValue: data ? data.operator.map((user) => user.userId) : "",*/
              initialValue: data ? data.operator.map((user) => user.userName + "_" + user.userId) : [],
              rules: [{ required: true, message: "请输入" }]
            })(<TreeSelect {...tProps} />)}
          </FormItem>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ toolsManager, loading }) => ({
  toolsManager
}))(Form.create()(NewToolsManage));
