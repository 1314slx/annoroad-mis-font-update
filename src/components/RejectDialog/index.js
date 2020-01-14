import React, { Component } from "react";
import { connect } from "dva";
import { Modal, Form, Row, Col, Input, Button, Spin } from "antd";

const FormItem = Form.Item;

class RejectDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      visible: nextProps.visible
    });
  }

  handleOk = e => {
    // console.log(e);
    const submit = document.getElementById("submit");
    submit.click();
  };

  handleCancel = e => {
    // console.log(e);
    this.hide();
  };

  handleEnterprise = e => {
    e.preventDefault();
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      this.props.onSubmit(fieldsValue);
    });
  };

  //隐藏弹窗Model
  hide() {
    this.props.setShowStatus(false);
  }

  render() {
    const { form, submitting, field_name } = this.props;
    const { getFieldDecorator } = form;
    return (
      <Modal
        title="驳回原因"
        visible={this.state.visible}
        onOk={this.handleOk}
        onCancel={this.handleCancel}
      >
        <Spin
          spinning={submitting === undefined ? false : submitting}
          delay={500}
        >
          {!this.state.visible ? (
            ""
          ) : (
            <Form onSubmit={this.handleEnterprise}>
              <Row gutter={24}>
                <Col span="24">
                  <FormItem label="请输入驳回原因">
                    {getFieldDecorator(field_name, {
                      rules: [{ required: true, message: "请输入驳回原因！" }]
                    })(<Input placeholder="请输入驳回原因" />)}
                  </FormItem>
                </Col>
              </Row>
              <Button
                id="submit"
                style={{ display: "none" }}
                loading={submitting}
                type="primary"
                htmlType="submit"
              />
            </Form>
          )}
        </Spin>
      </Modal>
    );
  }
}

export default connect(({ contract, loading }) => ({
  contract,
  submitting: loading.effects["contract/queryContractPage"]
}))(Form.create()(RejectDialog));
