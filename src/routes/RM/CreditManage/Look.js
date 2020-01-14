import React, { Component } from "react";
import { Link } from "dva/router";
import { connect } from "dva";
import { Card, Row, Col, Button, message } from "antd";

import RejectDialog from "../../../components/RejectDialog/index";
import LookInfoDetail from "../../../components/Credit/LookInfoDetail";

import { getItem, removeItem } from "../../../utils/utils";

import styles from "./Credit.less";

@connect(({ credit, loading }) => ({
  credit,
  loading: loading.effects["credit/queryCreditPage"]
}))
export default class Look extends Component {
  constructor(props) {
    super(props);

    this.state = {
      historyDataStatus: false,
      isShowReject: false
    };
  }

  //封装 授信信息详情查询
  packageDetail = param => {
    const params = {
      group_no: param && param.group_no
    };
    const { dispatch } = this.props;
    dispatch({
      type: "credit/infoDetailCreditPage",
      payload: params
    });
  };

  //封装 授信申请详情查询
  packageApplyDetail = param => {
    const params = {
      change_id: param && param.change_id,
      group_no: param && param.group_no
    };

    const { dispatch } = this.props;
    dispatch({
      type: "credit/applyDetailCreditPage",
      payload: params
    });
  };

  componentDidMount() {
    /*
     *  当apiStatus值为1时：授信详情查询接口
     *  当apiStatus值为2时：授信申请详情查询接口
     */
    const singleData = JSON.parse(getItem("singleData"));
    const { apiStatus } = this.props.credit;
    if (apiStatus === 1) {
      this.packageDetail(singleData);
    } else if (apiStatus === 2) {
      this.packageApplyDetail(singleData);
    }
  }

  componentWillUnmount() {
    //当离开当前页面的时候 删除从上一个页面活的单条公司信息
    removeItem("singleData");

    //当离开当前页面的时候 删除从授信审核详情页面
    // this.props.credit.creditDetailData = [];
    // this.props.credit.applyDetailCreditData = [];
    // this.props.credit.historyCreditData = [];
    this.props.dispatch({
      type: "credit/clear"
    });
  }

  //查看历史记录
  handleLookHistory = () => {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      group_no: singleData && singleData.group_no
    };
    const { dispatch } = this.props;
    dispatch({
      type: "credit/historyCreditPage",
      payload: params
    }).then(() => {
      this.setState({
        historyDataStatus: true
      });
    });
  };

  //通过
  handlePass = () => {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      group_no: singleData && singleData.group_no,
      change_id: singleData && singleData.change_id
    };
    // console.log(params);
    const { dispatch } = this.props;
    dispatch({
      type: "credit/passCreditPage",
      payload: params
    }).then(() => {
      message.info("审核通过");
      //返回把返回列表页面
      this.props.history.push("/creditManage/auditing");
    });
  };

  //封装隐藏方法
  setReject(flag, data) {
    this.setState({
      isShowReject: flag,
      overdue: data
    });
  }

  //显示 驳回dialog
  handleReject = value => {
    this.setReject(true, value);
  };

  //驳回内容提交
  onSubmit = value => {
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      group_no: singleData && singleData.group_no,
      change_id: singleData && singleData.change_id,
      reject_reason: value.reject_reason
    };
    // console.log(params);
    const { dispatch } = this.props;
    dispatch({
      type: "credit/RejectCreditPage",
      payload: params
    }).then(() => {
      this.setState({ isShowReject: false });
      //返回把返回列表页面
      this.props.history.push("/creditManage/auditing");
    });
  };

  //取消
  handleCancel = () => {
    const { returnBackUrlStatus } = this.props.credit;
    if (returnBackUrlStatus === 1) {
      this.props.history.push("/creditManage/credit");
    } else if (returnBackUrlStatus === 2) {
      this.props.history.push("/creditManage/apply");
    } else if (returnBackUrlStatus === 3) {
      this.props.history.push("/creditManage/auditing");
    }
  };

  render() {
    const { credit } = this.props;
    const {
      creditDetailData,
      applyDetailCreditData,
      apiStatus,
      historyCreditData,
      showHistoryStatus,
      buttonNumberStatus
    } = credit;
    const { isShowReject, historyDataStatus } = this.state;

    return (
      <div>
        <Card title={buttonNumberStatus === 1 ? "授信查看" : "授信审核"}>
          {showHistoryStatus === 1 &&
            apiStatus === 1 &&
            !historyDataStatus && <LookInfoDetail list={creditDetailData} />}
          {showHistoryStatus === 1 &&
            apiStatus === 1 &&
            historyDataStatus && <LookInfoDetail list={historyCreditData} />}
          {(showHistoryStatus === 2 || apiStatus === 2) && (
            <LookInfoDetail list={applyDetailCreditData} />
          )}
          {showHistoryStatus === 1 && (
            <Row gutter={24} className={styles.rowLineHeight}>
              <Col lg={{ span: 6 }} md={24} sm={24}>
                <b className={styles.left} />
                <Button
                  type="primary"
                  ghost
                  size="small"
                  className={styles.dashedBtn}
                  onClick={this.handleLookHistory.bind(this)}
                >
                  查看历史文件
                </Button>
              </Col>
              <Col lg={{ span: 6 }} md={24} sm={24} />
              <Col lg={{ span: 6 }} md={24} sm={24} />
            </Row>
          )}
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
        {buttonNumberStatus === 2 && (
          <RejectDialog
            visible={isShowReject}
            onSubmit={this.onSubmit}
            field_name={"reject_reason"}
            setShowStatus={this.setReject.bind(this)}
          />
        )}
      </div>
    );
  }
}
