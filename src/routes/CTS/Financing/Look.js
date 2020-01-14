import React, { Component } from "react";
import { connect } from "dva";
import { Card, Col, Row, Button, message } from "antd";

import RejectDialog from "../../../components/RejectDialog/index";

import { getItem } from "../../../utils/utils";
import statusFormat from "../../../utils/status";
import moneyFormat from "../../../utils/money";
import styles from "./Financing.less";

@connect(({ financing, loading }) => ({
  financing,
  loading: loading.effects["financing/applyDetailPage"]
}))
export default class Look extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowReject: false
    };
  }

  //封装审核通过和审核驳回 接口入参
  packageParams = param => {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      ...param,
      code: singleData && singleData.code
    };
    return params;
  };

  //封装融资申请详情接口
  packageList() {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      code: singleData && singleData.code
    };
    this.props.dispatch({
      type: "financing/applyDetailPage",
      payload: params
    });
  }

  //封装驳回dialog隐藏方法
  setReject = flag => {
    this.setState({ isShowReject: flag });
  };

  //当前页面加载完成的时候执行的事件
  componentDidMount() {
    this.packageList();
  }

  //当离开当前页面的时候执行的事件
  componentWillUnmount() {
    this.props.financing.applyDetailData = [];
  }

  //通过
  handlePass = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "financing/applyPassPage",
      payload: this.packageParams()
    }).then(() => {
      const { financing } = this.props;
      if (financing.createStatus) {
        message.success("操作成功");
        setTimeout(() => {
          this.handleCancel();
        }, 1000);
      }
    });
  };

  //驳回
  handleReject = value => {
    this.setReject(true, value);
  };

  //驳回内容提交
  onSubmit = value => {
    // console.log('onSubmit', value);
    const params = {
      ...this.packageParams(),
      reason: value.reason
    };
    // console.log(params);
    const { dispatch } = this.props;
    dispatch({
      type: "financing/applyRejectPage",
      payload: params
    }).then(() => {
      const { financing } = this.props;
      if (financing.createStatus) {
        this.setState({ isShowReject: false });
        message.success("操作成功");
        setTimeout(() => {
          this.handleCancel();
        }, 1000);
      }
    });
  };

  //取消操作
  handleCancel = () => {
    this.props.history.push("/financing/auditing");
  };

  render() {
    const { financing, loading } = this.props;
    const { applyDetailData, buttonNumberStatus } = financing;
    const { isShowReject } = this.state;
    return (
      <div>
        <div className={styles.pageHeader}>
          <h2>融资审核详情</h2>
        </div>
        <Card
          title=""
          className={styles.creditMoneyTitle}
          bordered={false}
          loading={loading}
        >
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>企业名称：</b>
              <span>{applyDetailData.enterpriseName}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>融资用途：</b>
              <span>{statusFormat.purposeStatus(applyDetailData.purpose)}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>年利率：</b>
              <span>{applyDetailData.annualRate * 100}%</span>
            </Col>
          </Row>
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>IRR：</b>
              <span>{applyDetailData.irr * 100}%</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>保证金（元）：</b>
              <span>{moneyFormat.formatMoney(applyDetailData.bail)}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>手续费（元）：</b>
              <span>{moneyFormat.formatMoney(applyDetailData.fee)}</span>
            </Col>
          </Row>
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>融资金额（元）：</b>
              <span>{moneyFormat.formatMoney(applyDetailData.amount)}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>总服务费（元）：</b>
              <span>
                {moneyFormat.formatMoney(applyDetailData.totalServiceCharge)}
              </span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>还款方式：</b>
              <span>
                {statusFormat.repayStatus(applyDetailData.repaymentMode)}
              </span>
            </Col>
          </Row>
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              {applyDetailData.repaymentMode === 1 && (
                <div>
                  <b>天数：</b> <span> {applyDetailData.borrowingDays}天</span>
                </div>
              )}
              {applyDetailData.repaymentMode === 2 && (
                <div>
                  <b>期数：</b>{" "}
                  <span> {applyDetailData.installmentRepayment}个月</span>
                </div>
              )}
              {applyDetailData.repaymentMode === 3 && (
                <div>
                  <b>期数：</b>{" "}
                  <span> {applyDetailData.installmentRepayment}周</span>
                </div>
              )}
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>逾期利息：</b>
              <span>{applyDetailData.overdueRate * 10000}‱/天</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>资金渠道：</b>
              <span>{applyDetailData.channelName}</span>
            </Col>
          </Row>
          {buttonNumberStatus === 1 && (
            <div className={styles.bottomButton}>
              <Button
                type="primary"
                size="large"
                className={styles.cancelBtn}
                onClick={this.handleCancel}
              >
                取消
              </Button>
            </div>
          )}
          {buttonNumberStatus === 2 && (
            <div className={styles.bottomButton}>
              <Button type="primary" size="large" onClick={this.handlePass}>
                提交
              </Button>
              <Button
                size="large"
                className={styles.cancelBtn}
                onClick={this.handleReject}
              >
                驳回
              </Button>
              <Button
                size="large"
                className={styles.cancelBtn}
                onClick={this.handleCancel}
              >
                取消
              </Button>
            </div>
          )}
        </Card>
        <RejectDialog
          visible={isShowReject}
          onSubmit={this.onSubmit}
          field_name={"reason"}
          setShowStatus={this.setReject.bind(this)}
        />
      </div>
    );
  }
}
