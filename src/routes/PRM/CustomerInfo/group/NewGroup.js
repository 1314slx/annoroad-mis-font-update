import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Spin, Card, Button, Form, Row, message } from "antd";

const FormItem = Form.Item;

import FooterToolbar from "components/FooterToolbar";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem/index";
import JumpLink from "components/Button/JumpLink";
import { removeItem, getItem } from "../../../../utils/utils";
import DescriptionList from "components/DescriptionList";
import { CELL_NUMBER } from "../../../../utils/pattern";
import { staffList } from "../../../../utils/options";

const { Description } = DescriptionList;

import styles from "../style.less";

class NewGroup extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      validating: "",

      businessLeader: null, //业务负责人
      businessChecker: null, //业务复核
      riskLeader: null, //风控负责人
      riskChecker: null, //风控复核
      riskLegal: null, //法务
      riskDirector: null, //风控总监
      generalManager: null //总经理
    };
  }

  componentDidMount() {
    staffList.map(value => {
      this.getStaffList(value.key);
    });

    this.getEnterpriseList();
    const groupId = this._getGroupId();
    if (groupId) {
      this.getGroupDetail(groupId);
    }
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "customer/clear"
    });
    removeItem("affiliated");
  }

  //获取集团id 集团详情查询和提交关联的时候需要
  _getGroupId() {
    const isAction = getItem("affiliated");
    const groupId = this.getParams(isAction, "groupId");
    if (groupId) {
      return groupId;
    }

    return false;
  }

  //获取员工列表数据
  getStaffList(code) {
    const params = {
      code: code,
      page_size: 99999,
      page_no: 1
    };

    this.props
      .dispatch({
        type: "customer/staffList",
        payload: params
      })
      .then(() => {
        const { staffList } = this.props.customer;

        this.setStaffData(code, staffList);
      });
  }

  //
  setStaffData(type, data) {
    switch (type) {
      case "BUSINESS_LEADER":
        this.setState({ businessLeader: data });
        break;
      case "BUSINESS_CHECKER":
        this.setState({ businessChecker: data });
        break;
      case "RISK_LEADER":
        this.setState({ riskLeader: data });
        break;
      case "RISK_CHECKER":
        this.setState({ riskChecker: data });
        break;
      case "RISK_LEGAL":
        this.setState({ riskLegal: data });
        break;
      case "RISK_DIRECTOR":
        this.setState({ riskDirector: data });
        break;
      case "GENERAL_MANAGER":
        this.setState({ generalManager: data });
        break;
    }
  }

  //获取企业列表
  getEnterpriseList() {
    this.props.dispatch({
      type: "customer/queryEnterpriseList"
    });
  }

  //获取集团列表详情
  getGroupDetail(groupId) {
    const params = {
      no: groupId
    };
    this.props.dispatch({
      type: "customer/groupDetail",
      payload: params
    });
  }

  //数据 选择数据 是否是企业  角色code前端写死的
  _getPerson(data, values, flag, roleCode) {
    let _list = [];
    if (!data && !values) {
      return [];
    }

    data.map(value => {
      values.map((v, i) => {
        if (value.value === v) {
          if (flag && flag === "Ent") {
            _list.push({
              id: value.index,
              name: value.value
            });
          } else {
            _list.push({
              no: value.index,
              name: value.value,
              role_code: roleCode
            });
          }
        }
      });
    });
    return _list;
  }

  _getDefault(data, roleCode) {
    let _list = [];
    if (data) {
      data.map((value, index) => {
        _list.push({
          no: value.index,
          name: value.value,
          role_code: roleCode
        });
      });
    }
    return _list;
  }

  newGroupHandler = e => {
    e.preventDefault();

    const { form, dispatch, customer } = this.props;
    const { enterpriseListData } = customer;
    const {
      businessLeader, //业务负责人
      businessChecker, //业务复核
      riskLeader, //风控负责人
      riskChecker, //风控复核
      riskLegal, //法务
      riskDirector, //风控总监
      generalManager //总经理
    } = this.state;

    form.validateFields((err, fieldsValue) => {
      if (err) {
        return;
      }
      const groupId = this._getGroupId();
      //默认显示已经关联的企业
      const initial = this._getEnterpriseList();
      //如果需要对参数做处理单独写方法
      const values = {
        ...fieldsValue,
        no: groupId ? groupId : "",
        operation: this._getPerson(
          businessLeader,
          fieldsValue["operation"],
          "",
          "BUSINESS_LEADER"
        ),
        operation_review: this._getPerson(
          businessChecker,
          fieldsValue["operation_review"],
          "",
          "BUSINESS_CHECKER"
        ),
        risk_control: this._getPerson(
          riskLeader,
          fieldsValue["risk_control"],
          "",
          "RISK_LEADER"
        ),
        risk_control_review: this._getPerson(
          riskChecker,
          fieldsValue["risk_control_review"],
          "",
          "RISK_CHECKER"
        ),
        enterprise: this._getPerson(
          groupId ? initial : enterpriseListData,
          fieldsValue["enterprise"],
          "Ent"
        ),
        //默认都传的三个
        risk_legal: this._getDefault(riskLegal, "RISK_LEGAL"),
        general_manager: this._getDefault(riskDirector, "RISK_DIRECTOR"),
        risk_director: this._getDefault(generalManager, "GENERAL_MANAGER")
      };

      dispatch({
        type: "customer/saveGroup",
        payload: values
      }).then(() => {
        const { customer, dispatch } = this.props;

        if (customer.submitStatus) {
          message.success("保存成功");

          setTimeout(() => {
            dispatch(routerRedux.push("/customer/group"));
          }, 1000);
        }
      });
    });
  };

  getParams(data, value) {
    if (data) {
      const _data = JSON.parse(data);

      if (_data && _data.hasOwnProperty(value)) {
        return _data[value];
      }
    }
  }

  //获取默认参数显示
  _getInitial(value) {
    const { groupDetailData } = this.props.customer;
    if (groupDetailData && groupDetailData.hasOwnProperty(value)) {
      return groupDetailData[value];
    }
    return [];
  }

  //获取企业列表信息，enterpriseListData 为查询到的企业列表
  //已经关联的企业将不被查出，所有要将查出来的企业信息和本集团已经关联的企业合并
  _getEnterpriseList() {
    const { enterpriseListData } = this.props.customer;
    //const enterprise_list = this._getInitial('enterprise_list');
    //const initial = enterprise_list.concat(enterpriseListData);
    /*if (initial) {
      return initial;
    }*/
    return enterpriseListData;
  }

  //设置layout
  //主要是区别第一个不需要偏移量
  getLayout(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 7, offset: !value ? 1 : 0 }
    };
  }

  getTextAreaLayout() {
    return {
      xl: { span: 15, offset: 1 },
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 }
    };
  }

  render() {
    const { loading, form, submitting } = this.props;

    const isAction = getItem("affiliated");

    const title = isAction ? "关联企业" : "新建集团";
    const {
      businessLeader, //业务负责人
      businessChecker, //业务复核
      riskLeader, //风控负责人
      riskChecker //风控复核
    } = this.state;

    return (
      <PageHeaderLayout title={title}>
        <Spin spinning={loading}>
          <Form onSubmit={this.newGroupHandler}>
            <Card style={{ marginBottom: "80px" }}>
              {isAction ? (
                <DescriptionList
                  size="large"
                  title=""
                  style={{ marginBottom: 32 }}
                >
                  <Description term="集团名称">
                    {this.getParams(isAction, "groupName")}
                  </Description>
                  <Description term="集团负责人">
                    {this.getParams(isAction, "groupCharge")}
                  </Description>
                  <Description term="负责人手机号">
                    {this.getParams(isAction, "chargePhone")}
                  </Description>
                </DescriptionList>
              ) : (
                <Row>
                  <ColFormItem
                    layout={this.getLayout(1)}
                    form={form}
                    label="集团名称"
                    parameter="name"
                  />

                  <ColFormItem
                    layout={this.getLayout()}
                    form={form}
                    label="集团负责人"
                    parameter="principal_name"
                  />

                  <ColFormItem
                    layout={this.getLayout()}
                    form={form}
                    label="负责人手机号"
                    pattern={CELL_NUMBER}
                    parameter="principal_mobile"
                    placeholder="请输入正确的手机号"
                  />
                </Row>
              )}

              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="业务负责人"
                  type="multiple"
                  options={businessLeader}
                  validating={this.state.validating}
                  initialValue={this._getInitial("operation_show")}
                  parameter="operation"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="业务复核"
                  type="multiple"
                  options={businessChecker}
                  initialValue={this._getInitial("operation_review_show")}
                  parameter="operation_review"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="风控负责人"
                  type="multiple"
                  options={riskLeader}
                  initialValue={this._getInitial("risk_control_show")}
                  parameter="risk_control"
                />
              </Row>

              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="风控复核"
                  type="multiple"
                  options={riskChecker}
                  initialValue={this._getInitial("risk_control_review_show")}
                  parameter="risk_control_review"
                />

                <ColFormItem
                  layout={this.getTextAreaLayout()}
                  form={form}
                  label="关联企业"
                  type="multiple"
                  initialValue={this._getInitial("enterprise_show")}
                  options={this._getEnterpriseList()}
                  parameter="enterprise"
                />
              </Row>
            </Card>

            <FooterToolbar>
              <FormItem className={styles.btnBox}>
                <Button type="primary" htmlType="submit" loading={submitting}>
                  保存
                </Button>

                <JumpLink name="取消" link="/customer/group" />
              </FormItem>
            </FooterToolbar>
          </Form>
        </Spin>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects["customer/staffList"],
  submitting: loading.effects["customer/saveGroup"]
}))(Form.create()(NewGroup));
