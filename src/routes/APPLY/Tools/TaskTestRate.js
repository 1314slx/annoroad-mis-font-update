import React, { Component } from "react";
import { connect } from "dva";
import {
  Card,
  Tab,
  Tabs,
  Steps
} from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import DescriptionList from "components/DescriptionList";
import styles from "./task.less";
const TabPane = Tabs.TabPane;
const Step = Steps.Step;

const { Description } = DescriptionList;
/**
 * 应用市场-我的任务
 * */
@connect(({ failTask, loading }) => ({
  failTask,
  loading: loading.effects["failTask/failTaskDetail"]
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class TaskTestRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%"
    };
  }
  callback = key => {
    //console.log(key);
  };
  componentDidMount() {
    this.getFailTaskData();
  }
  componentWillUnmount() {}
  //获取列表数据
  // getListData(params) {
  getFailTaskData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "failTask/failTaskDetail",
      payload: value
    });
  }

  render() {
    const { failTask, loading } = this.props;
    const { failTaskDetailData } = failTask; // failTaskDetailData 展示列表数据
    const {
      params,
      id,
      name,
      createTime,
      endTime,
      status,
      stdout,
      stderr
    } = failTaskDetailData;
    var stepsStatus = status - 1;
    const des = (
      <div className={styles.stepLeft}>
        提交时间<p>{createTime} </p>
      </div>
    );
    const des2 = (
      <div className={styles.stepRight}>
        {" "}
        结束时间<p>{endTime}</p>
      </div>
    );
    return (
      <PageHeaderLayout
        title="测试任务"
        breadcrumbList={[{title: "应用管理"},{title: "测试任务"}]}
      >
        <Card
          title={name}
          style={{ marginBottom: 24 }}
          bordered={false}
        >
          <DescriptionList size="small" style={{ marginBottom: 16 }} col="1">
            <Steps progressDot current={stepsStatus}>
              <Step title="排队中" description={des} />
              <Step title="执行中" />
              {
                stepsStatus === 3 ? <Step title="失败" description={stepsStatus === 3 ? des2 : ""}/>:<Step title="成功" description={stepsStatus === 2 ? des2 : ""}/>
              }
            </Steps>
          </DescriptionList>
        </Card>

        <Card
          title="参数详情"
          style={{ marginBottom: 24, float: "left", width: "100%" }}
          bordered={false}
        >
          <DescriptionList
            size="small"
            title="输入数据
            style={{ marginBottom: 24 }}
            col="1"
          >
            {failTaskDetailData.params &&
              failTaskDetailData.params.input.map((value, index) => (
                <Description term={value.fieldName}>{value.value}</Description>
              ))}
          </DescriptionList>

          <DescriptionList
            title="运行参数"
            style={{ marginBottom: 24 }}
            className={styles.runTitle}
          >
            {failTaskDetailData.params &&
              failTaskDetailData.params.other.map((value, index) => (
                <Description term={value.fieldName}>{value.value}</Description>
              ))}
          </DescriptionList>
          <DescriptionList
            size="small"
            title="输出数据"
            style={{ marginBottom: 16 }}
            col="1"
          >
            {failTaskDetailData.params &&
              failTaskDetailData.params.output.map((value, index) => (
                <Description term={value.fieldName}>{value.value}</Description>
              ))}
          </DescriptionList>
        </Card>

        <Card
          title=""
          style={{ marginBottom: 24, float: "left", width: "100%" }}
          bordered={false}
        >
          <DescriptionList size="small" style={{ marginBottom: 16 }} col="1">
            <Tabs defaultActiveKey="1" onChange={this.callback}>
              <TabPane tab="数据输出日志" key="1">
                2018-09-05 05:54:05,178 - SVG_to_other_format - INFO - Transform
                start time: 2018-09-05 05:54:05<br />
                2018-09-05 05:54:05,178 - SVG_to_other_format - INFO - You have
                select pdf formt to transform<br />
                2018-09-05 05:54:05,178 - SVG_to_other_format - INFO - Transform
                finish time: 2018-09-05 05:54:06<br />
                2018-09-05 05:54:05,178 - SVG_to_other_format - INFO - Total
                transform time for tansform: 1.81394886971 seconds
              </TabPane>
              <TabPane tab="标准错误日志" key="2">
                /usr/lib/python3.5/site-packages/matplotlib/font_manager.py:273:
                UserWarning: Matplotlib is building the font cache using
                fc-list. This may take a moment. warnings.warn('Matplotlib is
                building the font cache using fc-list. This may take a moment.')
                /usr/lib/python3.5/site-packages/matplotlib/font_manager.py:273:
                UserWarning: Matplotlib is building the font cache using
                fc-list. This may take a moment. warnings.warn('Matplotlib is
                building the font cache using fc-list. This may take a moment.')
              </TabPane>
            </Tabs>
          </DescriptionList>
        </Card>
      </PageHeaderLayout>
    );
  }
}
