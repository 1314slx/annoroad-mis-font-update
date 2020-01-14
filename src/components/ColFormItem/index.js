import React, { Component } from "react";
import { Form, Col, Input, Select, Switch, Radio, } from "antd";

const FormItem = Form.Item;
const { Option } = Select;
const { TextArea } = Input;
const RadioGroup = Radio.Group;

/**
 *  lixin 2018.4.20  【】
 *  专门为各种表单提交做的封装  其实大概意思跟Search差不多，但是为了组件的独立性，不做关联
 *  这样可以保证直接把js文件拷走就能使用
 *
 *  layout            | object   | 栅格布局样式对象
 *  type              | string   | 类型，非必传，默认是Input(严格按照antd组件名字传递)
 *  label             | string   | Form 标题
 *  parameter         | string   | 提交的参数名字
 *  placeholder       | string   | 提示语 非必传 默认是'请输入'否则就是'请选择'
 *  required          | boolean  | 是否必填项 默认是必填项
 *  options           | array    | 如果 type = Select||multiple ||RadioGroup options必须传，否则默认为Input
 *  onChange          | function | 如果需要操作是传入  一般Select可能用的多些
 *  visible           | boolean  | 是否渲染，如果为false时该组件返回空
 *  form              | object   | Form对象传过来
 *  initialValue      |          | 组件默认值，可不传，默认为空
 *  pattern           |          | 正则验证信息
 *
 *
 * formItemLayout     | object   | 表示横着显示，可不传
 *
 *
 *  未完待续
 *
 * */

export default class ColFormItem extends Component {
  constructor(props) {
    super(props);
  }

  //如果是Select需要传入options
  switchItem(which, placeholder, options) {
    const _this = this;
    switch (which) {
      case "Input":
        return <Input placeholder={placeholder}/>;
      case "Select":
        return (
          <Select placeholder={placeholder}>{_this.getOption(options)}</Select>
        );
      case "TextArea":
        return (
          <TextArea
            placeholder={placeholder}
            autosize={this.props.textSize?this.props.textSize:{ minRows: 5, maxRows: 5 }}
          />
        );
      case "Switch":
        return (
          <Switch
            checkedChildren={"是"}
            unCheckedChildren={"否"}
            defaultChecked={true}
          />
        );
      case "multiple":
        return (
          <Select
            mode="multiple"
            style={{ width: "100%" }}
            placeholder={placeholder}
          >
            {_this.getOption(options)}
          </Select>
        );
      case "RadioGroup":
        return <RadioGroup>{_this.getRadio(options)}</RadioGroup>;

    }
  }

  getRadio(data) {
    if (data) {
      return data.map((value, index) => (
        <Radio key={index} value={value.key}>
          {value.value}
        </Radio>
      ));
    }
  }

  getOption(data) {
    if (!data) {
      return;
    }

    return data.map((value, index) => (
      <Option key={index} value={value.key}>
        {value.value}
      </Option>
    ));
  }

  onChange = value => {
    if (this.props.onChange) {
      this.props.onChange(value);
    }
  };

  onFocus = () => {
    //console.log('sdsds')
    if (this.props.onFocus) {
      this.props.onFocus();
    }
  };

  render() {
    const {
      form,
      layout,
      label,
      parameter,
      placeholder,
      required,
      type,
      options,
      visible,
      initialValue,
      pattern,
      formItemLayout
    } = this.props;
    const _this = this;
    const { getFieldDecorator } = form;

    let _type = type;
    let _options;
    let _rulesType = "string";

    if (_type === "Select" || _type === "multiple" || _type === "RadioGroup") {
      //输入内容是数组
      if (options && _type === "multiple") {
        _rulesType = "array";
      }

      if (options && (_type === "Select" || _type === "RadioGroup")) {
        _rulesType = "number";
      }
      if (options && (_type === "Select")) {
        _rulesType = "string";
      }

      options ? (_options = options) : (_type = "Input");
    } else {
      type ? (_type = type) : (_type = "Input");
    }

    if (_type === "Switch") {
      _rulesType = "boolean";
    }

    const _placeholder = !placeholder
      ? !_type || _type === "Input" ? "请输入" : "请选择"
      : placeholder;
    const _required = required === undefined ? true : required;

    if (visible !== undefined && !visible) {
      return <div/>;
    }
    const _formItemLayout = formItemLayout ? formItemLayout : {};

    return (
      <Col {...layout}>
        <FormItem label={`${label}：`} {..._formItemLayout} >
          {getFieldDecorator(parameter, {
            rules: [
              {
                required: _required,
                message: _placeholder,
                pattern: pattern ? pattern : "",
                type: _rulesType
              }
            ],
            initialValue: initialValue ? initialValue : undefined,
            onChange: this.onChange
            //onFocus: this.onFocus
          })(_this.switchItem(_type, _placeholder, _options))}
        </FormItem>
      </Col>
    );
  }
}
