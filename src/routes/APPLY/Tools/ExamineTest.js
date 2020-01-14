import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {
  Col,
  Row,
  Card,
  Form,
  Input,
  Button,
  Icon,
  Tabs,
  Tag,
  Modal,
  Select,
  Radio
} from "antd";
import styles from "../style.less";
/*import numeral from "numeral";*/

import ColFormItem from "components/ColFormItem";
import request from "../../../utils/request";
const TabPane = Tabs.TabPane;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

/*/!**
 * 应用市场-我的任务
 * *!/*/
@connect(({ myTools, loading }) => ({
  myTools
  //loading: loading.effects['customer/queryEnterprise']
}))
@Form.create()
export default class ExamineTest extends Component {
    constructor(props) {
      super(props);
      this.state = {
        visible: false,
        paramExplain:"",
        resultExplain:"",
      };
    }
  /*//tab切换*/
  componentDidUpdate(){
    //请求获取参数说明信息
    request('/annoroad-cloud-mis-server/tool/version/richtext/detail',{body:{
        code:sessionStorage.getItem('annoroad-edit-myTool-code'),
        type:1
      }}).then((data)=>{
      if (data.code === "000000") {
        this.setState({paramExplain:data.data.text})
      }
    })
    //请求获取结果说明信息
    request('/annoroad-cloud-mis-server/tool/version/richtext/detail',{body:{
        code:sessionStorage.getItem('annoroad-edit-myTool-code'),
        type:2
      }}).then((data)=>{
      if (data.code === "000000") {
        this.setState({resultExplain:data.data.text})
      }
    })
  }
  callback = key => {
    /*this.setState({ visible3: false });*/
    // console.log(key);
  };
  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };

    return (
      <PageHeaderLayout>
        <Row gutter={24}>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card bordered={false}>
              <div className={styles.salesBar}>参数设置</div>

              <Form>
                <FormItem
                  label="输入文件"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  {getFieldDecorator("note", {
                    /*rules: [{ required: true, message: '请输入!' }],*/
                    rules: [{ message: "请输入!" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem
                  label="输入框"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  {getFieldDecorator("note", {
                    /*rules: [{ required: true, message: '请输入!' }],*/
                    rules: [{ message: "请输入!" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem {...formItemLayout} label="单选Radio">
                  {getFieldDecorator("radio-group")(
                    <RadioGroup>
                      <Radio value="a">选项一</Radio>
                      <Radio value="b">选项二</Radio>
                      <Radio value="c">选项三</Radio>
                    </RadioGroup>
                  )}
                </FormItem>
                <FormItem
                  label="单选Select"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  {getFieldDecorator("gender", {
                    rules: [{ message: "Please select your gender!" }]
                  })(
                    <Select
                      placeholder="请选择"
                      onChange={this.handleSelectChange}
                    >
                      <Option value="male">male</Option>
                      <Option value="female">female</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem {...formItemLayout} label="多选Select">
                  {getFieldDecorator("select-multiple", {
                    rules: [{ message: "请选择", type: "array" }]
                  })(
                    <Select mode="multiple" placeholder="请选择">
                      <Option value="red">Red</Option>
                      <Option value="green">Green</Option>
                      <Option value="blue">Blue</Option>
                    </Select>
                  )}
                </FormItem>
                <FormItem
                  label="输出文件夹"
                  labelCol={{ span: 5 }}
                  wrapperCol={{ span: 12 }}
                >
                  {getFieldDecorator("note", {
                    rules: [{ message: "请输入!" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
                <FormItem wrapperCol={{ span: 12, offset: 6 }}>
                  <Button type="primary" htmlType="submit">
                    Submit
                  </Button>
                </FormItem>
              </Form>
            </Card>
          </Col>
          <Col xl={12} lg={24} md={24} sm={24} xs={24}>
            <Card>
              <Tabs defaultActiveKey="1" onChange={this.callback}>
                <TabPane tab="工具介绍" key="1">
                  <Tag color="blue">表格工具</Tag>
                  <Tag color="blue">版本号1.0.6</Tag>
                  <Tag color="green">上线时间 2018-09-10</Tag>
                  <Row clasName={styles.toolsIntroduction}>
                    <h3>工具简介：</h3>
                    <div>
                      组件拖出来特别多一个一个删麻烦11，这个问题，首先将组件拖入画布中，然后按住“shift”键，用鼠标点击要使用的组件，使该组件取消选择。再点击“delete”键
                      ，即可删除剩余不需要使用的组件。 Paragraph example.
                    </div>
                  </Row>
                  <Row clasName={styles.toolsIntroduction}>
                    <h3>注意事项：</h3>
                    <div>
                      组件拖出来特别多一个一个删麻烦22，这个问题，首先将组件拖入画布中，然后按住“shift”键，用鼠标点击要使用的组件，使该组件取消选择。再点击“delete”键
                      ，即可删除剩余不需要使用的组件。 Paragraph example.
                    </div>
                  </Row>
                </TabPane>
                <TabPane tab="参数说明" key="2">
                  {this.state.paramExplain}
                </TabPane>
              </Tabs>
            </Card>
          </Col>
        </Row>
      </PageHeaderLayout>
    );
  }
}
