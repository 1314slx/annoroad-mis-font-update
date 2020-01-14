import React, { Component } from "react";
import { connect } from "dva";
import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Input,
  Select,
  message,
  Modal
} from "antd";

import { getItem } from "../../../utils/utils";
import styles from "./Financing.less";

const FormItem = Form.Item;
const Option = Select.Option;
const confirm = Modal.confirm;

class Create extends Component {
  constructor(props) {
    super(props);
    this.state = {
      termStatus: 1
    };
  }

  //当前页面加载完成的时候执行的事件
  componentDidMount() {
    //获取融资渠道列表
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 1000
    };
    dispatch({
      type: "financing/ChannelListPage",
      payload: params
    });
  }

  //当离开当前页面的时候执行的事件
  componentWillUnmount() {}

  //select选择获取值
  handleChange = (type, value) => {
    //融资用途
    if (type === "purpose") {
      return value;
    }
    if (type === "repaymentMode") {
      /**
       * 1:一次性还本付息
       * 2：按月分期
       * 3：按周分期
       * */
      if (value === 1) {
        this.setState({
          termStatus: 1
        });
      } else if (value === 2) {
        this.setState({
          termStatus: 2
        });
      } else if (value === 3) {
        this.setState({
          termStatus: 3
        });
      }
      return value;
    }
    if (type === "channelNo") {
      return value;
    }
  };

  //封装提交请求入参
  handleParams = param => {
    const singleData = JSON.parse(getItem("singleData"));
    // console.log('====原数据==='+JSON.stringify(param));
    const params = {
      ...param,
      enterpriseId: singleData && singleData.enterpriseId,
      amount: param.amount && param.amount * 100,
      annualRate: param.annualRate && param.annualRate / 100,
      irr: param.irr && param.irr / 100,
      bail: param.bail && param.bail * 100,
      fee: param.fee && param.fee * 100,
      totalServiceCharge:
        param.totalServiceCharge && param.totalServiceCharge * 100,
      overdueRate: 0.0005,
      installmentRepayment: param.repaymentMode === 1 ? 1 : param.borrowingDays
    };
    // console.log('====处理后数据==='+JSON.stringify(params));
    return params;
  };

  //提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.props
          .dispatch({
            type: "financing/applySubmitPage",
            payload: this.handleParams(values)
          })
          .then(() => {
            const { financing } = this.props;
            if (financing.createStatus) {
              message.success("提交成功");
              setTimeout(() => {
                this.handleCancel();
              }, 1000);
            }
          });
      }
    });
  };

  //取消操作
  handleCancel = () => {
    this.props.history.push("/financing/apply");
  };

  render() {
    const { form, financing, loading } = this.props;
    const { getFieldDecorator } = form;
    const { channelListData } = financing;
    const singleData = JSON.parse(getItem("singleData"));
    const { termStatus } = this.state;

    return (
      <div>
        <div className={styles.pageHeader}>
          <h2>融资申请</h2>
        </div>
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
          <Card
            title=""
            className={styles.creditMoneyTitle}
            bordered={false}
            loading={loading}
          >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label="企业名称">
                  <Input
                    placeholder={singleData && singleData.enterpriseName}
                    disabled={true}
                  />
                </FormItem>
              </Col>
              <Col
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
              >
                <FormItem label="融资用途">
                  {getFieldDecorator("purpose", {
                    rules: [{ required: true, message: "请输入" }]
                  })(
                    <Select
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.handleChange.bind(this, "purpose")}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={1}>采购</Option>
                      <Option value={2}>房租</Option>
                      <Option value={3}>新店开支</Option>
                      <Option value={4}>其他</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ pan: 24 }}
                sm={24}
              >
                <FormItem label="年利率（%）">
                  {getFieldDecorator("annualRate", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label="IRR（%）">
                  {getFieldDecorator("irr", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
              >
                <FormItem label="保证金（元）">
                  {getFieldDecorator("bail", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ pan: 24 }}
                sm={24}
              >
                <FormItem label="手续费（元）">
                  {getFieldDecorator("fee", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label="还款方式">
                  {getFieldDecorator("repaymentMode", {
                    rules: [{ required: true, message: "请输入" }]
                  })(
                    <Select
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.handleChange.bind(this, "repaymentMode")}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      <Option value={1}>一次性还本付息</Option>
                      <Option value={2}>按月分期</Option>
                      <Option value={3}>按周分期</Option>
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
              >
                {termStatus === 1 && (
                  <FormItem label="天数">
                    {getFieldDecorator("borrowingDays", {
                      rules: [{ required: true, message: "请输入" }]
                    })(<Input placeholder="请输入" />)}
                  </FormItem>
                )}
                {termStatus === 2 && (
                  <FormItem label="期数（月）">
                    {getFieldDecorator("borrowingDays", {
                      rules: [{ required: true, message: "请输入" }]
                    })(
                      <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.handleChange.bind(this, "borrowingDays")}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value={3}>3个月</Option>
                        <Option value={6}>6个月</Option>
                        <Option value={9}>9个月</Option>
                        <Option value={12}>12个月</Option>
                      </Select>
                    )}
                  </FormItem>
                )}
                {termStatus === 3 && (
                  <FormItem label="期数（周）">
                    {getFieldDecorator("borrowingDays", {
                      rules: [{ required: true, message: "请输入" }]
                    })(
                      <Select
                        showSearch
                        placeholder="请选择"
                        optionFilterProp="children"
                        onChange={this.handleChange.bind(this, "borrowingDays")}
                        filterOption={(input, option) =>
                          option.props.children
                            .toLowerCase()
                            .indexOf(input.toLowerCase()) >= 0
                        }
                      >
                        <Option value={13}>13周</Option>
                        <Option value={26}>26周</Option>
                        <Option value={39}>39周</Option>
                        <Option value={52}>52周</Option>
                      </Select>
                    )}
                  </FormItem>
                )}
              </Col>
              <Col
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ pan: 24 }}
                sm={24}
              >
                <FormItem label="融资金额（元）">
                  {getFieldDecorator("amount", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                <FormItem label="总服务费">
                  {getFieldDecorator("totalServiceCharge", {
                    rules: [{ required: true, message: "请输入" }]
                  })(<Input placeholder="请输入" />)}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
              >
                <FormItem label="资金渠道">
                  {getFieldDecorator("channelNo", {
                    rules: [{ required: true, message: "请输入" }]
                  })(
                    <Select
                      showSearch
                      placeholder="请选择"
                      optionFilterProp="children"
                      onChange={this.handleChange.bind(this, "channelNo")}
                      filterOption={(input, option) =>
                        option.props.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                    >
                      {channelListData &&
                        channelListData.datas &&
                        channelListData.datas.map((value, index) => (
                          <Option key={value.key + index} value={value.no}>
                            {value.name}
                          </Option>
                        ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              <Col
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ pan: 24 }}
                sm={24}
              >
                <FormItem label="逾期利息（‱/天）">
                  <Input placeholder="5" disabled={true} />
                </FormItem>
              </Col>
            </Row>
            <div className={styles.bottomButton}>
              <Button
                type="primary"
                size="large"
                className={styles.cancelBtn}
                onClick={this.handleSubmit}
              >
                提交
              </Button>
              <Button
                size="large"
                className={styles.cancelBtn}
                onClick={this.handleCancel}
              >
                取消
              </Button>
            </div>
          </Card>
        </Form>
      </div>
    );
  }
}

export default connect(({ financing, loading }) => ({
  financing,
  submitting: loading.effects["financing/applySubmitPage"]
}))(Form.create()(Create));
