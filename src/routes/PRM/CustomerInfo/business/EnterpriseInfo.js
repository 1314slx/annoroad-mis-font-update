import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Spin, Card, Button, message } from "antd";
//import FooterToolbar from 'components/FooterToolbar';
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";

import DescriptionList from "components/DescriptionList";

import LinkList from "components/LinkList/index";

import JumpLink from "components/Button/JumpLink";

import Dismissal from "./Dismissal";
import { getItem, removeItem, dataCheck } from "../../../../utils/utils";

const { Description } = DescriptionList;

import styles from "../style.less";

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects["customer/enterpriseDetail"]
}))
export default class EnterpriseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      visible: false,
      confirmLoading: false
    };
  }

  componentDidMount() {
    const _id = this._getBusinessId();

    if (_id) {
      const params = {
        no: _id
      };

      this.props.dispatch({
        type: "customer/enterpriseDetail",
        payload: params
      });
    }
  }

  componentWillUnmount() {
    removeItem("examineOrLook");
  }

  //确认驳回
  handleOk = (err, value) => {
    //console.log(value);

    if (err) {
      return;
    }
    this.setState({ confirmLoading: true });

    const _id = this._getBusinessId();
    const params = {
      no: _id,
      reason: value["reason"]
    };

    this.props
      .dispatch({
        type: "customer/rejectExamines",
        payload: params
      })
      .then(() => {
        this.setState({
          visible: false,
          confirmLoading: false
        });
        this._jumpPage();
      });
  };

  //审核通过
  _passExamine = () => {
    //console.log('审核通过');
    const _id = this._getBusinessId();
    const params = {
      no: _id
    };
    this.props
      .dispatch({
        type: "customer/passExamines",
        payload: params
      })
      .then(() => {
        this._jumpPage();
      });
  };

  _jumpPage() {
    const { customer, dispatch } = this.props;
    if (customer.actionStatus) {
      message.success("操作成功！");

      setTimeout(() => {
        dispatch(routerRedux.push("/customer/business"));
      }, 1000);
    }
  }

  _getBusinessId() {
    const _enterpriseListMess = this._getBusinessData(true);
    if (
      _enterpriseListMess &&
      _enterpriseListMess.hasOwnProperty("businessId")
    ) {
      return _enterpriseListMess.businessId;
    }

    return false;
  }

  //获取当前企业的列表信息
  //获取当前操作是  查看  还是  审核
  //传入参数判断返回  obj 还是 Boolean
  _getBusinessData(isObj) {
    const _examineOrLook = JSON.parse(getItem("examineOrLook"));
    const _flag = _examineOrLook ? _examineOrLook.examineOrLook : false;
    if (isObj) {
      return _examineOrLook;
    } else {
      return _flag;
    }
  }

  render() {
    const { customer, loading } = this.props;

    const { enterpriseDetail } = customer;

    const examineOrLook = this._getBusinessData();
    const _title = examineOrLook ? "企业信息审核" : "企业信息查看";
    const _cancelType = examineOrLook ? "default" : "primary";

    return (
      <PageHeaderLayout title={_title}>
        <Spin size="large" spinning={loading} delay={200}>
          <Card>
            <DescriptionList
              size="large"
              title="企业基本信息"
              style={{ marginBottom: 32 }}
            >
              <Description term="企业名称">
                {dataCheck(enterpriseDetail, "name")}
              </Description>
              <Description term="行业">
                {dataCheck(enterpriseDetail, "industry_type")}
              </Description>
              <Description term="项目类型">
                {dataCheck(enterpriseDetail, "project_type")}
              </Description>
              <Description term="客户属性">
                {dataCheck(enterpriseDetail, "property_type")}
              </Description>
              <Description term="机构信用代码">
                {dataCheck(enterpriseDetail, "credit_code")}
              </Description>
              <Description term="统一社会信用代码">
                {dataCheck(enterpriseDetail, "social_credit_code")}
              </Description>
              <Description term="项目简介">
                {dataCheck(enterpriseDetail, "project_introduction")}
              </Description>
              <Description term="营业地址">
                {dataCheck(enterpriseDetail, "address")}
              </Description>
            </DescriptionList>

            <DescriptionList
              size="large"
              title="法人及联系人信息"
              style={{ marginBottom: 32 }}
            >
              <Description term="法人姓名">
                {dataCheck(enterpriseDetail, "corporation_name")}
              </Description>
              <Description term="证件类型">
                {dataCheck(enterpriseDetail, "corporation_idcard_type")}
              </Description>
              <Description term="法人证件号">
                {dataCheck(enterpriseDetail, "corporation_idcard_no")}
              </Description>
              <Description term="企业联系人">
                {dataCheck(enterpriseDetail, "linkman_name")}
              </Description>
              <Description term="联系人电话">
                {dataCheck(enterpriseDetail, "linkman_mobile")}
              </Description>
            </DescriptionList>

            <DescriptionList
              size="large"
              title="银行及其他信息"
              style={{ marginBottom: 32 }}
            >
              <Description term="开户许可证">
                {dataCheck(enterpriseDetail, "bank_account_license_code")}
              </Description>
              <Description term="所属银行">暂无</Description>
              <Description term="对公账户">暂无</Description>
              <Description term="法大大ID">暂无</Description>
              <Description term="业务经理手机号">暂无</Description>
            </DescriptionList>

            <LinkList
              title="基础资料"
              links={dataCheck(enterpriseDetail, "base_files")}
            />

            <LinkList
              title="行业资料"
              links={dataCheck(enterpriseDetail, "industry_files")}
            />

            <div className={styles.infoBtnBox}>
              {examineOrLook ? (
                <Fragment>
                  <Button
                    type="primary"
                    value="large"
                    onClick={this._passExamine}
                  >
                    通过
                  </Button>

                  <Button
                    value="large"
                    onClick={() => {
                      this.setState({ visible: true });
                    }}
                  >
                    驳回
                  </Button>
                </Fragment>
              ) : (
                <Fragment />
              )}

              <JumpLink
                type={_cancelType}
                name="取消"
                link="/customer/business"
              />
            </div>

            <Dismissal
              visible={this.state.visible}
              confirmLoading={this.state.confirmLoading}
              onOk={this.handleOk}
              onCancel={() => {
                this.setState({ visible: false });
              }}
            />
          </Card>
        </Spin>
      </PageHeaderLayout>
    );
  }
}
