import React, { Component } from "react";

import { Form, Modal, Button } from "antd";

const FormItem = Form.Item;
import ColFormItem from "components/ColFormItem/index";

@Form.create()
export default class Dismissal extends Component {
  constructor(props) {
    super(props);
  }

  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFieldsAndScroll((err, values) => {
      this.props.onOk(err, values);
    });
  };

  handlerOk = () => {
    //手动触发submit按钮 把确定按钮替换成submit
    const submit = document.getElementById("submit");
    submit.click();
  };

  render() {
    const { visible, confirmLoading, onCancel, form } = this.props;

    return (
      <Modal
        title="输入驳回原因"
        visible={visible}
        okText="确定"
        cancelText="取消"
        confirmLoading={confirmLoading}
        onOk={this.handlerOk}
        onCancel={onCancel}
      >
        <Form
          onSubmit={this.handleSubmit}
          hideRequiredMark
          style={{ minHeight: "100px" }}
        >
          <ColFormItem
            layout={{ span: 24 }}
            form={form}
            label="驳回原因"
            type="TextArea"
            parameter="reason"
            required={true}
            placeholder="输入驳回原因"
          />
          <Button
            id="submit"
            style={{ display: "none" }}
            type="primary"
            htmlType="submit"
          />
        </Form>
      </Modal>
    );
  }
}
