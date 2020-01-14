import React, { Component } from "react";
import {
  Form,
  Row,
  Col,
  Input,
  Select,
  Button,
  DatePicker,
  AutoComplete
} from "antd";
import styles from './index.less'

const FormItem = Form.Item;

const { Option } = AutoComplete || Select;
const { RangePicker } = DatePicker;

/**
 *   lixin 2013.4.19
 *   items [{     | array     | 数组包含元素对象
 *   type         | string    | 类型 判断是选择还是输入 名字按照antd组件名字传入
 *   label        | string    | 标题
 *   required     | boolean   | 是否必填项  true / false
 *   placeholder  | string    | 描述
 *   parameter    | string    | 参数名字
 *   options      | array     | 如果type为Select必须传，否则认为此组件是Input
 *   pattern      |           | 正则
 *   }]
 *
 *
 *   onSubmit     | function  | 提交方法
 *
 *   未完待续...
 *
 * */
@Form.create()
class Search extends Component {
  constructor(props) {
    super(props);

    this.colLength = 3; //每行显示个数，暂时因为栅格布局不能修改
  }

  //根据items长度判断需要显示几行
  getChildren(items, getFieldDecorator, loading) {
    const len = items.length;
    const rowLen = Math.ceil(len / this.colLength);

    let rowArr = [];
    for (let i = 0, j = rowLen; i < j; i++) {
      rowArr.push(
        <Row key={i} gutter={96}>{this.getColItem(items, getFieldDecorator, i, loading)}</Row>
      );
    }
    if(len % this.colLength === 0){
      rowArr.push(
        <Row key={len+1} gutter={96} type={'flex'} justify={'end'}>
          <Col
            span={8}
            key={len+1}
            style={{ textAlign: "right" }}
            // offset={_offset}
            // className={styles.col}
            >
            <FormItem>
              <Button
                loading={loading}
                type="primary"
                style={{ marginRight: "12px" }}
                htmlType="submit"
              >
                查询
              </Button>
              <Button
                type="default"
                htmlType="button"
                onClick={this.handleReset}
              >
                重置
              </Button>
            </FormItem>
          </Col>        
        </Row>
      );
    }
    return rowArr;
  }

  //为每行里边塞Col
  getColItem(items, getFieldDecorator, start, loading) {
    const colArr = [];

    const _this = this;

    //从items数组第几个元素开始循环
    const _start = start * this.colLength;

    //剩余几个对象没有遍历渲染
    const _surplus = items.length - _start;

    let len;
    //如果剩下的小于3 长度直接登录items的长度
    if (_surplus < this.colLength) {
      len = items.length;
    } else {
      //如果剩下的大于3，那么长度等于开始索引加3
      len = _start + this.colLength;
    }

    for (let i = _start, j = len; i < j; i++) {
      const index = i;
      const value = items[i];
      const _offset = index % this.colLength == 0 ? 0 : 1;

      let _type = value.type;

      let _options;
      if (value.hasOwnProperty("options")) {
        _options = value.options;
      } else {
        if (_type === "RangePicker") {
          //
        } else {
          _type = "Input";
        }
      }
      let _rulesType = "number";

      if (_type === "Input" || _type === "AutoComplete") {
        _rulesType = "string";
      } else if (_type === "RangePicker") {
        _rulesType = "array";
      }

      // console.log("_rulesType:", _rulesType);
      const formItemLayout = {
        labelCol: {
          span: 7
        },
        wrapperCol: {
          span: 16
        }
      };
      colArr.push(
        <Col
          span={8}
          key={index}
          // offset={_offset}
          // className={styles.col}
        >
          <FormItem  onChange={this.handleChange()}  label={`${value.label}：`}>
            {getFieldDecorator(value.parameter, {
              rules: [
                {
                  required: value.required,
                  message: value.placeholder,
                  pattern: value.pattern ? value.pattern : "",
                  type: _rulesType
                }
              ]
            })(
              _this.switchItem(_type, value.placeholder, _options, value.sign)
              /*_this.switchItem(_type, value.placeholder, _options)*/
            )}
          </FormItem>
        </Col>
      );
      
    }
    if(len === items.length && len % this.colLength !== 0){
      colArr.push(
        <Row key={`${len}+1`} gutter={96} type={'flex'} justify={'end'}>
        <Col
          span={24}
          key={len+1}
          style={{ textAlign: "right" }}
          // offset={_offset}
          // className={styles.col}
          >
          <FormItem>
            <Button
              loading={loading}
              type="primary"
              style={{ marginRight: "12px" }}
              htmlType="submit"
            >
              查询
            </Button>
            <Button
              type="default"
              htmlType="button"
              onClick={this.handleReset}
            >
              重置
            </Button>
          </FormItem>
        </Col>
        </Row>
      );
    }

    return colArr;
  }

  //如果是Select需要传入options
  switchItem(which, placeholder, options, sign) {
    const _this = this;
    switch (which) {
      case "Input":
        return <Input placeholder={placeholder} />;
      case "Select":
        return (
          <Select placeholder={placeholder}>{_this.getOption(options)}</Select>
        );
      case "RangePicker":
        return <RangePicker />;
      case "AutoComplete":
        return (
          <AutoComplete
            placeholder={placeholder}
            filterOption={(inputValue, option) =>
              option.props.children
                .toUpperCase()
                .indexOf(inputValue.toUpperCase()) !== -1
            }
          >
            {_this.getOption(options, "auto", sign)}
          </AutoComplete>
        );
    }
  }

  getOption(data, flag, sign) {
    if (!data) {
      return;
    }

    if (sign) {
      return data.map((value) =>
        <Option key={value.value} value={value.key}>{value.value}</Option>
      )
    }

    if (flag === "auto") {
      return data.map((value, index) => 
        /*return <Option key={index} value={value.key} >{value.value}</Option>*/ //此处包含value后 会导致页面空白报错
         <Option key={value.value}>{value.value}</Option>
      );
    }
    return data.map((value, index) => (
        <Option key={index} value={value.key}>
          {value.value}
        </Option>
      ));
  }

  //重置输入框内容
  handleChange = () => {
    if(this.props.updateByTime){
      this.props.updateByTime();
    }

  };
  //重置输入框内容
  handleReset = () => {
    this.props.form.resetFields();
    if(this.props.onReset){
      this.props.onReset();
    }

  };

  //提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, fieldsValue) => {
      this.props.onSubmit(err, fieldsValue);
    });
  };

  render() {
    const { items, form, loading } = this.props;
    const { getFieldDecorator } = form;

    return (
      
      <Form onSubmit={this.handleSubmit} layout="horizontal">
        {this.getChildren(items, getFieldDecorator, loading)}

        {this.props.children}
      </Form>
    );
  }
}

export default Search;
