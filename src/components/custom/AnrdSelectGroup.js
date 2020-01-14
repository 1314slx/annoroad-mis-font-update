import React, { Component } from "react";
import { Col, Form, Row, Select } from "antd";

const Option = Select.Option;
const FormItem = Form.Item;
const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
};

export default class AnrdSelectGroup extends Component {
  constructor(props) {
    super(props);
    const { ...otherProps } = this.props;
    this.other = otherProps;
    this.state = {
      dataSource: this.props.data.options || []
    };
  }

  options = () => {
    const temp = [];
    let tmpData = this.props._data;
    temp.push(
      // this.state.dataSource.map((item, index) => {
      tmpData&&tmpData.options&&tmpData.options.map((item, index) => {
        const key = index;
        return (
          <Option key={key} value={item.value}>
            {item.text}
          </Option>
        );
      })
    );
    return temp;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Row>
        <Col span={20}>
        <FormItem {...formItemLayout} label={this.props._data.fieldName} required={false}>
          {getFieldDecorator(this.props._data.paramName, {
            rules: [{ required: true, message: "请选择" }]
          })(
            <Select {...this.other} mode={this.props.mode} placeholder={"请选择"}>
              {this.options()}
            </Select>
          )}
        </FormItem>
        </Col>
        <Col span={4} style={{paddingLeft:10,lineHeight:'32px'}}>
        </Col>
    </Row>
    );
  }
}
