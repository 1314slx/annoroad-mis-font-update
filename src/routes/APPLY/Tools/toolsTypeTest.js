 /*
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/toolsTypeGroup"]
}))
export default class toolsTypeTest extends Component {}*/
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Form, InputNumber, Input, DatePicker, Button, Select } from 'antd';
import moment from 'moment';
// 推荐在入口文件全局设置 locale
import 'moment/locale/zh-cn';
moment.locale('zh-cn');

const FormItem = Form.Item;
const Option = Select.Option;

// 后台返回的数据格式
const data = [
  {
    'field': 'jobid',
    'text': '工号',
    'errorMessage': '请输入工号',
    'required': true,
    'type': 'int',
    'value': 100
  },{
    'field': 'date',
    'text': '日期',
    'errorMessage': '请输入日期',
    'required': false,
    'type': 'date',
    'value': '2017-10-20'
  },{
    'field': 'username',
    'text': '用户名',
    'errorMessage': '请输入用户名',
    'required': true,
    'type': 'char',
    'value': 'hello world'
  },{
    'field': 'customer',
    'text': '客户',
    'errorMessage': '请输入客户',
    'required': true,
    'type': 'select',
    'value': '中兴',
    'options': ['贝尔', '中兴', '烽火']
  }
]

// formItem css 样式
const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 6 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 14 },
  }
}

// 保存按钮 css 样式
const tailFormItemLayout = {
  wrapperCol: {
    xs: {
      span: 24,
      offset: 0,
    },
    sm: {
      span: 14,
      offset: 6,
    },
  }
}

// form css 样式
const formLayout = {
  width: 400,
  marginTop: 100,
  marginLeft: 'auto',
  marginRight: 'auto'
}


/*class App extends Component {*/
/*export default class toolsTypeTest extends Component*/
class App extends Component {
  handleSubmit(e) {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
      }
    });
  }

  /**
   * 根据后台返回的 data 中 type 类型生成不同的组件
   * @param item  json
   * @param Component
   */
  switchItem(item) {
    const type = item.type;
    switch (type) {
      case 'int':
        return <InputNumber style={{ width: '100%' }} />;
        break;
      case 'char':
        return <Input />;
        break;
      case 'date':
        return <DatePicker style={{ width: '100%' }} />;
        break;
      case 'select':
        return (
          <Select>
            {
              item.options.map((option, index) => {
                return (<Option key={index} value={option}>{option}</Option>)
              })
            }
          </Select>
        )
      default:
        return <Input />;
        break;
    }
  }

  render() {
    const { getFieldDecorator } = this.props.form;
    return (
      <Form onSubmit={this.handleSubmit} style={formLayout}>
        {
          data.map((item, index) => {
            // type 为 date 日期格式需要强制转化为 moment 格式
            item.value = item.type == 'date' ? moment(item.value, 'YYYY-MM-DD') : item.value;
            return (
              <FormItem
                key={index}
                {...formItemLayout}
                label={item.text}
                hasFeedback
              >
                {getFieldDecorator(item.field, {
                  initialValue: item.value,
                  rules: [{
                    required: item.required,
                    message: item.errorMessage
                  }],
                })(
                  this.switchItem(item)
                )}
              </FormItem>
            )
          })
        }
        <FormItem {...tailFormItemLayout}>
          <Button type="primary" htmlType="submit">
            保存
          </Button>
        </FormItem>
      </Form>
    )
  }
}

const AppForm = Form.create()(App);

ReactDOM.render(<AppForm />, document.getElementById('root'));
