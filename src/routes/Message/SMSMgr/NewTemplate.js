import React, { Component } from "react";
import { connect } from "dva";
import { Form, Card, Button, Row } from "antd";

import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem";
import FooterToolbar from "components/FooterToolbar";
import JumpLink from "components/Button/JumpLink";
import { getItem, removeItem } from "../../../utils/utils";

const FormItem = Form.Item;

/**
 * 新增模板
 * */
class NewTemplate extends Component {
  constructor(props) {
    super(props);

    this.state = {
      radioInitialValue: 2
    };
  }

  componentWillUnmount() {
    removeItem("template");
  }

  _newTemplate = e => {
    e.preventDefault();

    const { form } = this.props;

    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      console.log("新增模板", fieldsValue);
    });
  };

  _radioChange = e => {
    console.log("e:", e.target.value);

    this.setState({
      radioInitialValue: e.target.value
    });
  };

  render() {
    const { form, loading } = this.props;

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };
    const layout = {
      sm: { span: 24 },
      xl: { span: 16 }
    };

    const _template = getItem("template")
      ? JSON.parse(getItem("template"))
      : false;
    const _title = _template ? "编辑模板" : "新增模板";

    return (
      <PageHeaderLayout title={_title}>
        <Form onSubmit={this._newTemplate} layout="horizontal">
          <Card>
            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                type="Select"
                label="短信签名"
                options={[{ key: 1, value: "未知" }]}
                parameter="name"
              />
            </Row>

            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                type="RadioGroup"
                label="短信类型"
                initialValue={
                  _template ? _template["type"] : this.state.radioInitialValue
                }
                onChange={this._radioChange}
                parameter="namwwe"
                options={[
                  { key: 2, value: "通知类" },
                  { key: 1, value: "验证码类" }
                ]}
              />
            </Row>

            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                label="短信内容"
                type="TextArea"
                initialValue={_template ? _template["content"] : ""}
                placeholder="示例：亲爱的#name#，您的#card#于#time#消费#money#，感谢支持！"
                parameter="m"
              />
            </Row>

            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                label="备注"
                type="TextArea"
                initialValue={_template ? _template["remarks"] : ""}
                placeholder="请描述该短信模板的使用场景"
                parameter="m2"
              />
            </Row>

            <Row>
              {/*验证码类的是显示*/}
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                label="注册页"
                visible={this.state.radioInitialValue === 2 ? false : true}
                parameter="name2"
              />
            </Row>
          </Card>

          <div style={{ height: "40px" }} />

          <FooterToolbar>
            <FormItem style={{ marginTop: "10px" }}>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>

              <JumpLink name="取消" link="/message/sms-mgr/template" />
            </FormItem>
          </FooterToolbar>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ smsMgr, loading }) => ({
  smsMgr
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(NewTemplate));
