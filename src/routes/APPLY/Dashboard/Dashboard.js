import React, { Component, FraissueBackgment } from "react";
import { Row, Col, Card, Icon, Tooltip } from "antd";
import { Link } from "dva/router";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "./dashboard.less";
import numeral from "numeral";
import { Bar } from "../../../components/Charts";
import { getOssClient } from "../../../utils/oss";

let first = 0;
/**
 * Dashboard
 * */
@connect(({ issueBack, loading }) => ({
  issueBack,
  loading: loading.effects["issueBack/dashboardGroup"]
}))
export default class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      dashboardGroupData: this.props.issueBack.dashboardGroupData || {},
    };
    this.getListData();

  }

  componentWillMount(){

  }

  getTimes = (useToolTimes) => {
      let times = useToolTimes || [];
      first = 0;
      const visitData2SLX1 = [];
      const beginDay = new Date();
      const curDay = this.dateFormat(new Date(), "dd");
      for(let i = 0, len = 13 - times.length; i < len; i++){
        times.unshift(0);
      }
      for (let i = times.length - 1; i >= 0; i -= 1) {
        visitData2SLX1.push({
          x: this.calcStr(beginDay, curDay),
          y: times[i]
        });
        beginDay.setDate(beginDay.getDate() - 1);
      }
      return visitData2SLX1.reverse()
  }

  calcStr = (dateObj, curentDay) => {
    const d = dateObj.getDay();
    const fCurDay = this.dateFormat(dateObj, "dd");
    let res = "";
    if (curentDay === fCurDay) {
      res = "今天";
    } else {
      switch (d) {
        case 6:
          res = "周六".concat(first >> 4 ? "" : " ");
          first = first | 240;
          break;
        case 0:
          res = "周日".concat(first | 0 ? "" : " ");
          first = first | 15;
          break;
        default:
          res = fCurDay + "日";
          break;
      }
    }
    return res;
  };

  dateFormat = (date, fmt) => {
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
      "q+": Math.floor((date.getMonth() + 3) / 3),
      S: date.getMilliseconds()
    };
    if (/(y+)/.test(fmt))
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    for (const k in o)
      if (new RegExp("(" + k + ")").test(fmt))
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length == 1
            ? o[k]
            : ("00" + o[k]).substr(("" + o[k]).length)
        );
    return fmt;
  };

  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 10
    };
    this.props.dispatch({
      type: "issueBack/dashboardGroup",
      payload: value
    });
  }

  render() {
    const { issueBack, loading } = this.props;
    const { dashboardGroupData } = issueBack;
    const { information, useToolRanking, useToolTimes } = dashboardGroupData;
    const topColResponsiveProps = {
      xs:
        information && information.auditAuth && information.deployAuth
          ? 25
          : 24,
      sm: 12,
      md:
        information && information.auditAuth && information.deployAuth ? 5 : 12,
      lg: 12,
      xl:
        information && information.auditAuth && information.deployAuth ? 5 : 6,
      style: { marginBottom: 24 }
    };
    const _length = dashboardGroupData&&dashboardGroupData.useToolRanking?dashboardGroupData.useToolRanking.length:0;
    let arr = [];
    for(let i =0;i<_length;i++){
      if(i>6){
        break;
      }else{
        arr.push({
          toolName:useToolRanking[i].toolName,
          toolUseTimes:useToolRanking[i].toolUseTimes,
        })
      }
    }
    return (
      <PageHeaderLayout
        title={"Dashboard"}
        breadcrumbList={[{title: " "}]}
      >
        <Row gutter={24} className={styles.topWar}>
          <Col {...topColResponsiveProps}>
            <div className="gutter-box">
              <Card>
                <Link
                  to={
                    information && information.feedbackAuth
                      ? "/helpCenter/issueBack"
                      : "/Dashboard"
                  }
                >
                  <div className="clear y-center">
                    <div className="pull-left mr-m">
                      <Icon type="exception" className="text-2x text-danger" />
                    </div>
                    <div className="clear">
                      <div className="textTile"> 问题反馈</div>
                      
                      <h2>{information && information.feedbackTimes}</h2>
                    </div>
                  </div>
                </Link>
              </Card>

            </div>
          </Col>
          <Col {...topColResponsiveProps}>
            <div className="gutter-box">
              <Card>
                {/*<Link  to="/system/userList">*/}
                <Link
                  to={
                    information && information.userAuth
                      ? "/system/userList"
                      : "/Dashboard"
                  }
                >
                  <div className="clear y-center">
                    <div className="pull-left mr-m">
                      <Icon type="user-add" className="text-2x" />
                    </div>
                    <div className="clear">
                      <div className="textTile">昨日新增</div>
                      <h2>{information && information.userAddTimes}</h2>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </Col>
          {}

          <Col {...topColResponsiveProps}>
            <div className="gutter-box">
              <Card>
                <Link
                  to={
                    information && information.userAuth
                      ? "/system/userList"
                      : "/Dashboard"
                  }
                >
                  <div className="clear y-center">
                    <div className="pull-left mr-m">
                      <Icon type="team" className="text-2x text-info" />
                    </div>
                    <div className="clear">
                      <div className="textTile">总用户数</div>
                      <h2> {information && information.userSumTimes}</h2>
                    </div>
                  </div>
                </Link>
              </Card>
            </div>
          </Col>
          {information && information.auditAuth ? (
            <Col {...topColResponsiveProps}>
              <div className="gutter-box">
                <Card>
                  <Link to="/apply/deployTest">
                    <div className="clear y-center">
                      <div className="pull-left mr-m">
                        <Icon
                          type="calendar"
                          className="text-2x text-success"
                        />
                      </div>
                      <div className="clear">
                        <div className="textTile">待部署</div>
                        <h2>
                          {information && information.deployTimes
                            ? information.deployTimes
                            : ""}
                        </h2>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            </Col>
          ) : (
            ""
          )}

          {information && information.deployAuth ? (
            <Col {...topColResponsiveProps}>
              <div className="gutter-box">
                <Card>
                  <Link to="/apply/examine">
                    <div className="clear y-center">
                      <div className="pull-left mr-m">
                        <Icon
                          type="exclamation-circle-o"
                          className="text-2x text-success"
                        />
                      </div>
                      <div className="clear">
                        <div className="textTile">待审核</div>
                        <h2> {information && information.auditTimes
                          ? information.auditTimes
                          : ""}</h2>
                      </div>
                    </div>
                  </Link>
                </Card>
              </div>
            </Col>
          ) : (
            ""
          )}
        </Row>

        <Card bordered={false} bodyStyle={{ padding: "27px 32px" }}>
          <div className={styles.salesCard}>
            <Row>
              <Col
                xl={14}
                lg={12}
                md={12}
                sm={24}
                xs={24}
                style={{ zIndex: "2" }}
              >
                <div className={styles.salesBar}>
                  <Bar
                    height={295}
                    title="工具使用次数"
                    data={this.getTimes(useToolTimes)}
                  />
                </div>
              </Col>
              <Col
                xl={10}
                lg={10}
                md={10}
                sm={24}
                xs={24}
                style={{ zIndex: "1" }}
              >
                <div className={styles.salesRank}>
                  <h4 className={styles.rankingTitle}>工具使用排名</h4>
                  <ul className={styles.rankingList}>
                    {/*后台处理数据*/}
                    {arr &&
                    arr.map((item, i) => (
                        <li key={item.toolName}>
                          <span className={i < 3 ? styles.active : ""}>
                            {i + 1}
                          </span>
                          {
                            item.toolName.length>10?(
                              <Tooltip title={item.toolName}>

                              <span className={styles.word_overite}>{item.toolName}</span>
                            </Tooltip>
                            ):(
                              <span>{item.toolName}</span>)
                          }


                          <span>
                            {numeral(item.toolUseTimes).format("0,0")}
                          </span>
                        </li>
                      ))}
                  </ul>
                </div>
              </Col>
            </Row>
          </div>
        </Card>
      </PageHeaderLayout>
    );
  }
}
