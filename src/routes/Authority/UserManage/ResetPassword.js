import React, { Component } from "react";
import { connect } from "dva";
import { Form, Modal, Row, Button, Col, message } from "antd";
import ColFormItem from "components/ColFormItem";
import { BOSS_PWD } from "../../../utils/pattern";
import md5 from "blueimp-md5";

/**
 * 用户管理，重置密码弹窗
 * */
class ResetPassword extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      resetTarget: null
    };
  }

  componentDidMount() {}

  componentWillReceiveProps(nextProps) {
    this.setState({
      resetTarget: nextProps.resetTarget
    });
  }

  _onSubmit = e => {
    e.preventDefault();

    const { form } = this.props;

    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      const _password = fieldsValue["password"];
      const _confirmPwd = fieldsValue["confirmPwd"];
      if (_password === _confirmPwd) {
        this.setState({ confirmLoading: true });
        const _target = this.state.resetTarget;
        if (_target) {
          const _params = {
            email: _target.account,
            password: md5(_password)
          };
          this.props
            .dispatch({
              type: "authority/pwdSave",
              payload: _params
            })
            .then(() => {
              const { actionStatus } = this.props.authority;
              if (actionStatus) {
                message.success("重置成功！");
                this.setState({ confirmLoading: false });
                this.props.showResetModel(false, null);
              }
            });
        }
      } else {
        message.error("密码输入不一致！");
      }
    });
  };

  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

  _onCancel = () => {
    this.setState({ confirmLoading: false });
    this.props.showResetModel(false, null);
  };

  render() {
    const { visible, form, newRandomKey } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 8
      },
      wrapperCol: {
        span: 15
      }
    };

    const _data = this.state.resetTarget;

    return (
      <Modal
        width={350}
        visible={visible}
        onOk={this._onOkHandler}
        key={newRandomKey}
        title="重置密码"
        confirmLoading={this.state.confirmLoading}
        onCancel={this._onCancel}
      >
        <div style={{ height: "200px", fontSize: "14px", color: "#000" }}>
          <Row type="flex" justify="center">
            <Col span="8" style={{ textAlign: "right" }}>
              账号：
            </Col>
            <Col span="15">{_data ? _data.account : ""}</Col>
          </Row>
          <br />
          <Row type="flex" justify="center">
            <Col span="8" style={{ textAlign: "right" }}>
              姓名：
            </Col>
            <Col span="15">{_data ? _data.name : ""}</Col>
          </Row>

          <br />
          <Form onSubmit={this._onSubmit} layout="horizontal">
            <ColFormItem
              form={form}
              layout={{ span: 24 }}
              label="新密码"
              placeholder="8~16位数字、字母或符号组合"
              formItemLayout={formItemLayout}
              pattern={BOSS_PWD}
              parameter="password"
            />

            <ColFormItem
              form={form}
              layout={{ span: 24 }}
              label="确认新密码"
              placeholder="8~16位数字、字母或符号组合"
              formItemLayout={formItemLayout}
              pattern={BOSS_PWD}
              parameter="confirmPwd"
            />

            <Button
              type="primary"
              htmlType="submit"
              id="submit"
              style={{ display: "none" }}
            >
              保存
            </Button>
          </Form>
        </div>
      </Modal>
    );
  }
}

export default connect(({ authority, loading }) => ({
  authority
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(ResetPassword));
