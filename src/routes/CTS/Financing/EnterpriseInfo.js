import React, { Component } from "react";
import { connect } from "dva";
import { Card, Col, Row, Button } from "antd";

import { getItem } from "../../../utils/utils";
import statusFormat from "../../../utils/status";
import styles from "./Financing.less";

@connect(({ financing, loading }) => ({
  financing,
  loading: loading.effects["financing/queryEnterpriseInfoPage"]
}))
export default class EnterpriseInfo extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  //返回操作
  handleCancel = () => {
    this.props.history.push("/financing/apply");
  };

  //封装企业信息详情请求接口
  packageList(param) {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      enterpriseId: singleData && singleData.enterpriseId,
      ...param
    };

    this.props.dispatch({
      type: "financing/queryEnterpriseInfoPage",
      payload: params
    });
  }

  //当前页面加载完成的时候执行的事件
  componentDidMount() {
    this.packageList();
  }

  //当离开当前页面的时候执行的事件
  componentWillUnmount() {
    this.props.financing.enterpriseInfoData = [];
  }

  render() {
    const { financing, loading } = this.props;
    const { enterpriseInfoData } = financing;
    return (
      <div>
        <div className={styles.pageHeader}>
          <h2>企业信息查看</h2>
        </div>
        {enterpriseInfoData && (
          <Card
            title=""
            className={styles.creditMoneyTitle}
            bordered={false}
            loading={loading}
          >
            <h3>企业基本信息</h3>
            <Row gutter={24} className={styles.rowLineHeight}>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>企业名称：</b>
                <span>{enterpriseInfoData.name}</span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>企业简称：</b>
                <span>{enterpriseInfoData.shortName}</span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>机构信用代码：</b>
                <span>{enterpriseInfoData.creditCode}</span>
              </Col>
            </Row>
            <Row gutter={24} className={styles.rowLineHeight}>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>客户属性：</b>
                <span>
                  {statusFormat.customerPropertyStatus(
                    enterpriseInfoData.customerProperty
                  )}
                </span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>统一社会信用代码：</b>
                <span>{enterpriseInfoData.socialCreditCode}</span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>营业地址：</b>
                <span>{enterpriseInfoData.address}</span>
              </Col>
            </Row>
            <h3>法人代表及联系人信息</h3>
            <Row gutter={24} className={styles.rowLineHeight}>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>法人代表：</b>
                <span>{enterpriseInfoData.corporation}</span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>证件类型：</b>
                <span>
                  {statusFormat.idCardStatus(
                    enterpriseInfoData.corporationIdcardType
                  )}
                </span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>法人代表证件号：</b>
                <span>{enterpriseInfoData.corporationIdcardNo}</span>
              </Col>
            </Row>
            <h3>银行及其他信息</h3>
            <Row gutter={24} className={styles.rowLineHeight}>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b>开户许可证：</b>
                <span>{enterpriseInfoData.bankPermiseCode}</span>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                {/*<b>企业简称：</b><span>{enterpriseInfoData.shortName}</span>*/}
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                {/*<b>机构信用代码：</b><span>{enterpriseInfoData.creditCode}</span>*/}
              </Col>
            </Row>
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
          </Card>
        )}
      </div>
    );
  }
}
