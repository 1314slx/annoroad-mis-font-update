import React, { Component } from "react";
import { Row, Col, Icon } from "antd";
import times from "../../utils/time";
import money from "../../utils/money";
import styles from "./Credit.less";
import config from "../../../config/index";

export default class LookInfoDetail extends Component {
  toJump = value => {
    // console.log(value);
    window.location.href = config.urlHost + value;
  };

  render() {
    const { list } = this.props;
    return (
      <div className={styles.LookInfoDetail}>
        {list && (
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>企业名称：</b>
              <span>{list.name}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>敞口额度：</b>
              <span>{money.formatMoney(list.all_limit)}</span>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b>授信期限：</b>
              <span>
                {list.start_time &&
                  times.formatTime(list.start_time) +
                    "~" +
                    times.formatTime(list.end_time)}
              </span>
            </Col>
          </Row>
        )}
        {list && (
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b className={styles.left}>尽调报告：</b>
              <p className={styles.fileContent}>
                {list.survey_report &&
                  list.survey_report.map((value, index) => (
                    <a
                      href="javascript:void(0)"
                      key={index}
                      onClick={this.toJump.bind(this, value.path)}
                    >
                      <Icon type="paper-clip" />
                      <span>{value.name}</span>
                      <br />
                      <em>
                        {value.create_time &&
                          times.formatTime(value.create_time)}
                      </em>
                    </a>
                  ))}
              </p>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b className={styles.left}>授信决议表：</b>
              <p className={styles.fileContent}>
                {list.credit_decision &&
                  list.credit_decision.map((value, index) => (
                    <a
                      href="javascript:void(0)"
                      key={index}
                      onClick={this.toJump.bind(this, value.path)}
                    >
                      <Icon type="paper-clip" />
                      <span>{value.name}</span>
                      <br />
                      <em>
                        {value.create_time &&
                          times.formatTime(value.create_time)}
                      </em>
                    </a>
                  ))}
              </p>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b className={styles.left}>终审意见书：</b>
              <p className={styles.fileContent}>
                {list.final_submission &&
                  list.final_submission.map((value, index) => (
                    <a
                      href="javascript:void(0)"
                      key={index}
                      onClick={this.toJump.bind(this, value.path)}
                    >
                      <Icon type="paper-clip" />
                      <span>{value.name}</span>
                      <br />
                      <em>
                        {value.create_time &&
                          times.formatTime(value.create_time)}
                      </em>
                    </a>
                  ))}
              </p>
            </Col>
          </Row>
        )}
        {list && (
          <Row gutter={24} className={styles.rowLineHeight}>
            <Col lg={{ span: 6 }} md={24} sm={24}>
              <b className={styles.left}>业务资料：</b>
              <p className={styles.fileContent}>
                {list.operation_information &&
                  list.operation_information.map((value, index) => (
                    <a
                      href="javascript:void(0)"
                      key={index}
                      onClick={this.toJump.bind(this, value.path)}
                    >
                      <Icon type="paper-clip" />
                      <span>{value.name}</span>
                      <br />
                      <em>
                        {value.create_time &&
                          times.formatTime(value.create_time)}
                      </em>
                    </a>
                  ))}
              </p>
            </Col>
            <Col lg={{ span: 6 }} md={24} sm={24} />
            <Col lg={{ span: 6 }} md={24} sm={24} />
          </Row>
        )}
      </div>
    );
  }
}
