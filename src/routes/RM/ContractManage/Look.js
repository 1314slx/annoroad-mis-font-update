import React, { Component } from "react";
import { connect } from "dva";
import { Card, Row, Col, Button, Icon, message } from "antd";

import RejectDialog from "../../../components/RejectDialog/index";
import config from "../../../../config";

import styles from "./Contract.less";
import { getItem } from "../../../utils/utils";

@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects["contract/queryCreditPage"]
}))
export default class Look extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLook: 1,
      isShowReject: false
    };
  }

  //封装入参
  packageParams = () => {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      user_id: 1111,
      user_name: "admin",
      group_id: singleData && singleData.group_id,
      change_id: singleData && singleData.change_id ? singleData.change_id : ""
    };
    return params;
  };

  //封装协议详情查询
  packageDetail = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "contract/detailContractPage",
      payload: this.packageParams()
    });
  };

  //封装驳回dialog隐藏方法
  setReject = flag => {
    this.setState({ isShowReject: flag });
  };

  componentDidMount() {
    this.packageDetail();
  }

  //下载地址
  toJump = value => {
    window.location.href = config.urlHost + value;
  };

  //通过
  handlePass = () => {
    const { dispatch } = this.props;
    dispatch({
      type: "contract/passContractPage",
      payload: this.packageParams()
    }).then(() => {
      const { contract } = this.props;
      if (contract.createStatus) {
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
      type: "contract/rejectContractPage",
      payload: params
    }).then(() => {
      const { contract } = this.props;
      if (contract.createStatus) {
        this.setState({ isShowReject: false });
        message.success("操作成功");
        setTimeout(() => {
          this.handleCancel();
        }, 1000);
      }
    });
  };

  //取消
  handleCancel = () => {
    this.props.history.push("/contractManage/contract");
  };

  render() {
    const { detailData, buttonNumberStatus } = this.props.contract;
    const { isShowReject } = this.state;

    // console.log(detailData);

    return (
      <div>
        {buttonNumberStatus === 1 && (
          <div className={styles.pageHeader}>
            <h2>查看协议</h2>
          </div>
        )}
        {buttonNumberStatus === 2 && (
          <div className={styles.pageHeader}>
            <h2>协议审核</h2>
          </div>
        )}
        <Card title="" className={styles.partSecond}>
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>集团名称：</b>
              <span>{detailData && detailData.group_name}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24} />
            <Col lg={{ span: 6 }} md={24} sm={24} />
          </Row>
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b className={styles.left}>框架协议：</b>
              <p className={styles.fileContent}>
                {detailData &&
                  detailData.protocol_list &&
                  detailData.protocol_list.map((value, index) => (
                    <a
                      href="javascript:void(0)"
                      key={index}
                      onClick={this.toJump.bind(this, value.url)}
                    >
                      <Icon type="paper-clip" />
                      <span>{value.name}</span>
                    </a>
                  ))}
              </p>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24} />
            <Col lg={{ span: 6 }} md={24} sm={24} />
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
                通过
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
