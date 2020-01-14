import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Button, Form } from "antd";
import ColFormItem from "components/ColFormItem";

class NewSignature extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false
    };
  }

  /*e.preventDefault();

  const { form } = this.props;

//提交校验
form.validateFieldsAndScroll((err, fieldsValue) => {
  if (err) {
    return;
  }
});*/
  _onSubmit = e => {
    e.preventDefault();

    const { form } = this.props;

    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.setState({ confirmLoading: true });

      setTimeout(() => {
        this.setState({ confirmLoading: false });
        this.props.setModel(false, null);
      }, 1000);
    });
  };

  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

  _onCancel = () => {
    this.props.setModel(false, null);
  };

  render() {
    const { form, newRandomKey, visible, data } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };

    const _title = data ? "编辑签名" : "新增签名";

    return (
      <Modal
        title={_title}
        width={350}
        visible={visible}
        onOk={this._onOkHandler}
        key={newRandomKey}
        confirmLoading={this.state.confirmLoading}
        onCancel={this._onCancel}
      >
        <Form
          onSubmit={this._onSubmit}
          layout="horizontal"
          style={{ height: "50px" }}
        >
          <ColFormItem
            form={form}
            layout={{ span: 24 }}
            label="签名"
            initialValue={data ? data.name : ""}
            placeholder="请输入3-8个字符"
            formItemLayout={formItemLayout}
            parameter="name"
          />
          <ColFormItem
            form={form}
            layout={{ span: 24 }}
            label="年龄"
            initialValue={data ? data.age : ""}
            placeholder="请输入年龄"
            formItemLayout={formItemLayout}
            parameter="age"
          />

          <Button
            type="primary"
            htmlType="submit"
            id="submit"
            /* style={{ display: "none" }}*/
          >
            保存12
          </Button>
        </Form>
      </Modal>
    );
  }
}

export default connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(NewSignature));
