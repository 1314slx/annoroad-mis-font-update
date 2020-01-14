import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination, Modal, Popconfirm, Tab, Tabs, Steps, message } from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import DescriptionList from "components/DescriptionList";
import { timestamp, timestampToTime, getItem } from "../../../utils/utils";

import request from "../../../utils/request";
import styles from "./data.less";
const confirm = Modal.confirm;
const TabPane = Tabs.TabPane;
const Step = Steps.Step;
import moment from "moment";
import { routerRedux } from "dva/router";
const { Description } = DescriptionList;
/**
 * 失败任务详情
 * */
@connect(({ failTask, dataManager, loading }) => ({
  failTask, dataManager,
  loading: loading.effects["failTask/failTaskDetail"]
}))
export default class FailTaskRate extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      conclusionInfo: []
    };
    this.conclusionInfo = "";
    this.url = ""; //输出数据地址==跳转地址
  }

  callback = key => {
    /*this.setState({ visible3: false });*/
  };

  componentDidMount() {
    this.getFailTaskData();
  }

  getJournal() {
    const failTask_id = getItem("failtask_mis_id");
    const failtask_mis_look_mark = getItem("failtask_mis_look_mark");
    // h获取标准输出
    const _task_c_status = getItem("task_c_status");
    if (_task_c_status === "3" || _task_c_status === "4" || _task_c_status === 3 || _task_c_status === 4) {
      request("/annoroad-cloud-mis-server/task/log-path", {
        body: {
          id: failTask_id,
          type: 1//标准输出
        }
      }).then((data) => {
        if (data) {
          if (data.code === "000000") {
            // message.success("获取信息成功！");
            // console.log(data.data.path, 1111)
            // this.setState({logpath_1:data.data.path})
            request(data.data.path, { method: "GET" }).then((data) => {
                if (data) {
                  data = data.replace(/\r\n/g, "<br />");
                  data = data.replace(/\n/g, "<br />");
                  data = data.split("<br />").map(list => (<p>{list}</p>));
                  this.setState({ logpath_1: data });
                } else {
                  // this.setState({logpath_1:""});
                }
              }
            );
          } else {
            // message.error("获取信息失败！");
          }
        } else {
          message.error("系统错误");
        }
      });

      // 获取日志输出
      request("/annoroad-cloud-mis-server/task/log-path", {
        body: {
          id: failTask_id,
          type: 2//标准输出
        }
      }).then((data) => {
        if (data) {
          if (data.code === "000000") {
            // this.setState({logpath_2:data.data.path})
            request(data.data.path, { method: "GET" }).then((data) => {
              if (data) {
                data = data.replace(/\r\n/g, "<br />");
                data = data.replace(/\n/g, "<br />");
                data = data.split("<br />").map(list => (<p>{list}</p>));
                this.setState({ logpath_2: data });
              } else {
                // this.setState({logpath_2:""});
              }
            });
          } else {
            //message.error("系统错误！");
          }
        } else {
          message.error("系统错误");
        }
      });

      if (parseInt(_task_c_status) === 4) {
        // 获取容器服务日志
        request("/annoroad-cloud-mis-server/task/container-log", {
          body: {
            id: failTask_id
          }
        }).then((data) => {
          if (data) {
            if (data.code === "000000") {
              let logpath_3 = data.data.logResult;
              this.setState({ logpath_3 });
            } else {
              //message.error("系统错误！");
            }
          } else {
            message.error("系统错误");
          }
        });
      }
    }
  }

  //获取列表数据
  // getListData(params) {
  getFailTaskData(params) {
    let that = this;
    const failTask_id = getItem("failtask_mis_id");
    const value = {
      id: failTask_id,
      //...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "failTask/failTaskDetail",
      payload: value
    }).then(() => {
      let url = this.props.failTask.failTaskDetailData && this.props.failTask.failTaskDetailData.params && this.props.failTask.failTaskDetailData.params.outputs ? this.props.failTask.failTaskDetailData.params.outputs[0] : "";
      if (url) {
        this.jumpMyData(1);
      }
      let isVisible = this.props.failTask.failTaskDetailData ? this.props.failTask.failTaskDetailData.conclusion : "";
      if (isVisible == 1) {
        request("/annoroad-cloud-mis-server/task/conclusion-path", {
          body: {
            id: this.props.failTask.failTaskDetailData.id
            // type:2,//标准输出
          }
        }).then((data) => {
          request(data.data.path, { method: "GET" }).then((datas) => {
            if (datas) {
              datas = datas.replace(/\r\n/g, "<br />");
              datas = datas.replace(/\n/g, "<br />");
              //datas = datas.split('<br />')
              this.conclusionInfo = datas;
              if (datas.length > 100) {
                this.setState({ conclusionInfo: datas.substring(0, 100), _mark: 1 });
              } else {
                this.setState({ conclusionInfo: datas, _mark: 0 });
              }
            } else {

              this.conclusionInfo = "";
              this.setState({ conclusionInfo: [] });
            }
          });
        });
      }
      const statu = this.props.failTask.failTaskDetailData ? this.props.failTask.failTaskDetailData.status : "";
      sessionStorage.setItem("task_c_status", statu);
      this.getJournal();
    });
  }

  /**
   * 我的任务跳转到我的数据
   */
  jumpMyData = (mark) => {
    let url = this.url.substring(0, this.url.length - 1);  //原路径拿掉最后一个/测试数据/slx-188/姜腾腾的工具撒娇_0.0.6_20190307_3
    let prefix = url.substring(0, url.lastIndexOf("/"));  //prafix值=测试数据/slx-188
    let parame = url.substring(url.lastIndexOf("/") + 1, this.url.length); // 姜腾腾的工具撒娇_0.0.6_20190307_3
    const value = { prefix: prefix };
    console.log("url+prefix+parame+value:",url+";"+prefix+";"+parame+";"+value)
    let _value =  value&&value.prefix? value.prefix:"";
    // let _type = _value && _value.substring(0,4)=="我的数据" ? "dataManager/myData":"dataManager/queryGroup";
    this.props.dispatch({
      type: "dataManager/queryGroup",
      payload: value
    }).then(() => {
      let arr = this.props.dataManager && this.props.dataManager.groupData ? this.props.dataManager.groupData.folders : [];
      let _arr = [];
      if (arr) {
        arr.map(value => {
          if (value.fileName == parame) {
            _arr.push(value);
          }
        });
      }
      if (_arr.length > 0) { //存在该路径
        if (mark == 1) {
          this.setState({
            isValue: true
          });
        } else {
          let _pathname = _value && _value.substring(0,4)=="我的数据" ? "/application/myData":"/apply/dataManager";
          this.props.dispatch(routerRedux.push({
            pathname: _pathname ,
            query: {
              params_url: url
            }
          }));
        }
      } else {
        if (mark != 1) {
          message.error("该目录已被删除");
        }
        this.setState({
          isValue: false
        });
      }
    });
  };

  /* _getConclusion = (data)=>{
     if(data){
       const _tmpStr = data.join();
       console.log('_tmpStr',_tmpStr)
       return data.map((value,index)=>{
         return <p key={index}>{value}</p>
       })
     }
   }*/

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
    const look_mark = getItem("failtask_mis_look_mark");
    var stepsStatus = status - 1;
    const des = (
      <div className={styles.stepLeft}>
        {/*提交时间<p>{timestampToTime(createTime)} </p>*/}
        提交时间<p>{createTime ? moment(createTime).format("YYYY-MM-DD HH:mm:ss") : "-"} </p>
      </div>
    );
    const des2 = (
      <div className={styles.stepRight}>
        {" "}
        {/*结束时间<p>{timestampToTime(endTime)}</p>*/}
        结束时间<p>{endTime ? moment(endTime).format("YYYY-MM-DD HH:mm:ss") : "-"} </p>
      </div>
    );
    this.url = failTaskDetailData && failTaskDetailData.params && failTaskDetailData.params.outputs ? failTaskDetailData.params.outputs[0] : "";

    const descript = (look_mark == 1 ? "我的任务" : look_mark == 3 ? "我的任务" : "失败任务");
    const _breadcrumbListTitlle = (look_mark == 1 ? "" : look_mark == 3 ? "应用中心" : "数据统计");
    const _breadcrumbListTitlle2 = (look_mark == 1 ? "" : look_mark == 3 ? "我的任务" : "失败任务");
    // let mystyle = this.state.isValue==true? {}: {color:"#1890ff",wordBreak:"break-all"}
    let mystyle = this.state.isValue == true ? {} : { color: "rgba(0, 0, 0, 0.65)" };
    let mystyleVisible = failTaskDetailData.conclusion && failTaskDetailData.conclusion == 1 ? { display: "block" } : { display: "none" };
    // const consolution = '12结论是否显示';
    let _outputs = failTaskDetailData&&failTaskDetailData.params&&failTaskDetailData.params.outputs&&failTaskDetailData.params.outputs.length>0?failTaskDetailData.params.outputs:[];
    _outputs = _outputs.length>0 && _outputs[0].length>0?_outputs[0].substring(0,4):"";
    return (
      <PageHeaderLayout
        title={descript}
        breadcrumbList={[{ title: _breadcrumbListTitlle }, { title: _breadcrumbListTitlle2 }]}
      >
        <div className={styles.taskDetail_war}>
          <Card title={name} style={{ marginBottom: 24 }} bordered={false}>
            <DescriptionList size="small" style={{ marginBottom: 16 }} col="1">
              <Steps progressDot current={stepsStatus}>
                <Step title="排队中" description={des}/>
                <Step title="执行中"/>
                {
                  stepsStatus === 3 ? <Step title="失败" description={stepsStatus === 3 ? des2 : ""}/> :
                    <Step title="成功" description={stepsStatus === 2 ? des2 : ""}/>
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
              title="输入数据"
              style={{ marginBottom: 16 }}
              col="1"
            >
              {failTaskDetailData.params &&
              failTaskDetailData.params.input && failTaskDetailData.params.input.length > 0 ?
                failTaskDetailData.params &&
                failTaskDetailData.params.input.map((value, index) => (
                  <Description term={value.fieldName}>
                    {value.value}
                  </Description>
                )) :
                <Description term=""></Description>
              }
            </DescriptionList>

            <DescriptionList
              title="运行参数"
              style={{ marginBottom: 24 }}
              className={styles.runTitle}
            >
              {failTaskDetailData.params &&
              failTaskDetailData.params.other && failTaskDetailData.params.other.length > 0 ?
                failTaskDetailData.params &&
                failTaskDetailData.params.other.map((value, index) => (
                  <Description term={value.fieldName}>
                    {value.value}
                  </Description>
                )) :
                <Description term=""></Description>
              }
            </DescriptionList>

            <div>
              <p style={{ marginBottom: "12px", color: "#000000", fontWeight: "650", marginTop: "18px" }}>输出数据</p>
              <a onClick={this.jumpMyData} style={mystyle}
                 className={styles.outdir}>{failTaskDetailData.params && failTaskDetailData.params.outputs && failTaskDetailData.params.outputs.length > 0 ? (_outputs =="我的数据" ? failTaskDetailData.params.outputs[0] : "数据管理/" + failTaskDetailData.params.outputs[0]) : ""}</a>
            </div>
            <div style={mystyleVisible}>
              <p style={{ marginBottom: "12px", color: "#000000", fontWeight: "650", marginTop: "18px" }}>结论显示</p>
              {/*测试时将文件换行再测试查看内容是否含有换行*/}
              {/*<p>{consolution.length>100?consolution.substring(0,100)+"...":consolution}</p>*/}

              <span
                dangerouslySetInnerHTML={{ __html: this.state.conclusionInfo }}></span><span>{this.state._mark == 1 ? "..." : ""}</span>
              {/*<p>{this.conclusionInfo.length>100?this.conclusionInfo.substring(0,100)+"...":this.conclusionInfo}</p>*/}

            </div>
          </Card>

          <Card
            title=""
            style={{ marginBottom: 24, float: "left", width: "100%", textIndent: "0em" }}
            bordered={false}
            className={styles.noCardHead}
          >
            <Tabs defaultActiveKey="1" size="small">
              <TabPane tab="标准输出日志" key="1">
                {/*标注输出日志*/}
                <div className={styles.tabContent} >
                  <pre>{this.state.logpath_1}</pre>
                </div>
              </TabPane>
              <TabPane tab="标准错误日志" key="2">
                {/*标注错误日志输出*/}
                <div className={styles.tabContent}  >
                  <pre>{this.state.logpath_2}</pre>
                </div>
              </TabPane>
              <TabPane tab="容器服务日志" key="3">
                {/*标注错误日志输出*/}
                <div className={styles.tabContentOut} >
                  <pre>{this.state.logpath_3}</pre>
                </div>
              </TabPane>
            </Tabs>
          </Card>

        </div>
      </PageHeaderLayout>
    );
  }
}
