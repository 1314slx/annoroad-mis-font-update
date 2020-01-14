import React, { Component } from "react";
import { Form, Radio, Row,Col } from "antd";

const FormItem = Form.Item;
const RadioGroup = Radio.Group;
const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
};

export default class AnrdRadioGroup extends Component {
  constructor(props) {
    super(props);
    const { ...otherProps } = this.props;
    this.other = otherProps;
    this.state = {
      dataSource: this.props.data.options || []
    };
  }

  radios = () => {
    const temp = [];
    let tmpData = this.props._data;
    temp.push(
      // this.state.dataSource.map((item, index) => {
      tmpData&&tmpData.options&&tmpData.options.map((item, index) => {
        const key = index;
        return (
          <Radio key={key} value={item.value}>
            {item.text}
          </Radio>
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
              rules: [{required: true, message: "请选择"}]
            })(<RadioGroup {...this.other}>{this.radios()}</RadioGroup>)}
          </FormItem>
        </Col>
        {/*<Col span={this.props.example == true ?4:0} style={{paddingLeft:10,lineHeight:'32px'}}>*/}
        <Col span={4} style={{paddingLeft: 10, lineHeight: '32px'}}>
        </Col>
      </Row>
    );
  }
}
