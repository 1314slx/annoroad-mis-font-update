import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {
  Col,
  Row,
  Card,
  Form,
  Tabs,
  Tag,
  Modal,
  Divider, notification
} from "antd";
import styles from "../../../components/custom/style.less";
import TaskForm from "../../../components/custom/TaskForm";
import { getItem, removeItem } from "../../../utils/utils";

import { timestampToTime } from "../../../utils/utils";
import moment from "moment";
const TabPane = Tabs.TabPane;
/**
 * 提交任务
 */
@connect(({ myTools,dataManager, loading }) => ({
  myTools,dataManager
}))
@Form.create()
export default class ToolsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      resultVisible: false,
      interactive: false,
      analysisMark: false,
      title: "",
      myStyle:{}
    };
    // 将当前使用的工具版本code保存到本地，防止用户刷新页面
    let query = this.props.location.query;
    if (query) {
      localStorage.setItem("annoroad-task-mis-code",query.code);
      localStorage.setItem("annoroad-task-interactive",query.interactive);
      localStorage.setItem("annoroad-task-analysisMark",query.analysisMark);
    }
  }

  componentDidMount() {
    let interactive = localStorage.getItem("annoroad-task-interactive")
    let analysisMark = localStorage.getItem("annoroad-task-analysisMark")
    this.setState({
      interactive: interactive,
      title: interactive == "true" ? analysisMark=="true"?"分析工具":"审核测试" : "我的工具",
      analysisMark: analysisMark,
    })
    let code = localStorage.getItem("annoroad-task-mis-code");
    this.props.dispatch({
      type: "myTools/queryToolDetailList",
      payload: {"code": code},
      callback: (data) => {
        if(data.code != "000000"){
          notification.error({
            message: `请求错误`,
            description: data.msg
          });
        }
      }
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  //动态设置高度
  setItemHeight = () => {
    let clientHeight = document.body.offsetHeight;
    let setHeight = clientHeight-64-96-48+"px";
    let mystyle={
      minHeight: setHeight
    }
    this.setState({
      myStyle:mystyle
    })
  }

  /**
   * 切换tab
   */
  tabChange = (key) => {
    if(key !== 1 && (!this.props.myTools.groupParamsExplainData.text || !this.props.myTools.groupResultExplainData.text)){
      let _url =  key == 2 ?"myTools/queryParamsExplain":"myTools/queryResultExplain";
      let _type =  key == 2 ? 1 : 2 ;
      this.props.dispatch({
        // type: "myTools/queryParamsExplain",
        type: _url,
        payload: {
          code: localStorage.getItem("annoroad-task-mis-code"),
          // type: 1
          type: _type
        }
      })
    }
    setTimeout(() => {
      if(key !== 1 ){
        this.setTabHeight()
      }
    }, 100);
  };
  /**
   * 动态设置结果说明高度
   */
  setTabHeight = () =>{
    const _rightTab = document.getElementById("rightTab");
    const _resultTab = document.getElementById("resultTab");
    const _submit_task_nav = document.getElementById("submit_task_nav");
    if(_submit_task_nav && (_rightTab || _resultTab)){
      let h_submit_task_nav = _submit_task_nav.offsetHeight;
      _resultTab ? _resultTab.style.minHeight=h_submit_task_nav+20+"px":"";
      _rightTab ? _rightTab.style.minHeight= h_submit_task_nav+20+"px":"";
    }
  }


  /**
   * 展示或关闭结果说明
   */
  setModalVisible = (resultVisible) => {
    if(resultVisible && !this.props.myTools.groupResultExplainData.text){
      this.props.dispatch({
        type: "myTools/queryResultExplain",
        payload: {
          code: localStorage.getItem("annoroad-task-mis-code"),
          type: 2
        }
      })
    }
    this.setState({ resultVisible });
  }

  componentWillUnmount(){
    // 销毁的时候清空model中的大文本
    this.props.dispatch({
      type: "myTools/cleanText",
    })
    // removeItem("annoroad-task-analysisMark");
    // localStorage.removeItem("annoroad-task-analysisMark");
    // localStorage.removeItem("annoroad-task-mis-code");
    // localStorage.removeItem("annoroad-task-interactive");
  }

  render() {
    const { groupToolDetailData, groupParamsExplainData, groupResultExplainData } = this.props.myTools;
    let analysisMark = localStorage.getItem("annoroad-task-analysisMark")
    const {
      params,
      version,
      toolTypeName,
      introduction,
      attention,
      upTime,
      imageName,
    } = groupToolDetailData;
    return (
      <PageHeaderLayout
        title={this.state.title}
        breadcrumbList={[{title: "应用管理"},{title: this.state.title}]}
      >
        <div className={styles.toosDetail_wap} id="toosDetail_wap" style={this.state.myStyle}>
          <Row gutter={24}>
            <Col xl={12} lg={10} md={10} className={styles.cctoolDetailTab}>
              <TaskForm dataSource={(this.props.myTools.addParamsData && this.props.myTools.addParamsData.length > 0 ? this.props.myTools.addParamsData : params)} imageName={imageName} {...this.props} interactive={this.state.interactive} analysisMark={this.state.analysisMark} rootDir={analysisMark=="true"?"我的数据":"测试数据"} requestUri={analysisMark=="true"?"/annoroad-cloud-mis-server/data/mine/find":"/annoroad-cloud-mis-server/data/find"}/>
            </Col>
            <Col xl={12} lg={14} md={14} className={styles.toolDetailTab} >
              <Card>
                <Tabs
                  className={styles.cctoolDetailTabR}
                  defaultActiveKey="1"
                  onChange={(key) => this.tabChange(key)}
                >
                  <TabPane tab="工具介绍" key="1">
                    <Divider style={{ padding: "0px", margin: "0" }} />
                    <div className={styles.tabContent}>
                      <Tag color="blue">{toolTypeName}</Tag>
                      <Tag color="purple">版本号{version}</Tag>
                      <Tag color="green">
                        上线时间{
                        analysisMark=="true"?(groupToolDetailData&&groupToolDetailData.upTime?moment(groupToolDetailData.upTime).format("YYYY-MM-DD"):"-"):
                        (getItem("examine_c_status")==="8"|| getItem("examine_c_status")==="9"|| getItem("examine_c_status")==="10"||getItem("examine_c_status")===8|| getItem("examine_c_status")===9|| getItem("examine_c_status")===10)?
                          (groupToolDetailData&&groupToolDetailData.upTime?moment(groupToolDetailData.upTime).format("YYYY-MM-DD"):"-"):"-"
                      }
                      </Tag>

                      <Row className={styles.toolsIntroduction}>
                        <h3>工具简介：</h3>
                        <div style={{lineHeight:"22px",whiteSpace:"pre-line"}}>{introduction}</div>
                      </Row>
                      <Row className={styles.toolsIntroduction}>
                        <h3>注意事项：</h3>
                        <div  style={{lineHeight:"22px",whiteSpace:"pre-line"}}>{attention}</div>
                      </Row>

                     {/* <Row className={styles.toolsIntroduction}>
                        <a onClick={() => this.setModalVisible(true)}>
                          结果说明
                        </a>
                        <Modal
                          title="结果说明"
                          // style={{ top: 25 }}
                          centered='true'
                          visible={this.state.resultVisible}
                          onOk={() => this.setModalVisible(false)}
                          onCancel={() => this.setModalVisible(false)}
                          footer={null}
                          width={"64%"}
                          style={{top:"10px"}}
                          bodyStyle={{minHeight:'50vh',overflow:'auto',maxHeight:"75vh"}}
                        >
                          <div id="resultExplainDataWar" className={styles.loadImg} dangerouslySetInnerHTML = {{__html:groupResultExplainData.text}} ></div>
                        </Modal>
                      </Row>*/}
                    </div>
                  </TabPane>
                  <TabPane tab="参数说明" key="2">
                    <Divider style={{ padding: "0px", margin: "0" }} />
                    <div className={styles.tabContent} id="rightTab">
                      <div dangerouslySetInnerHTML = {{__html:groupParamsExplainData.text}} ></div>
                    </div>
                  </TabPane>
                  <TabPane tab="结果说明" key="3">
                    <Divider style={{ padding: "0px", margin: "0" }} />
                    <div className={styles.tabContent} id="resultTab">
                      {/*<div dangerouslySetInnerHTML = {{__html:groupParamsExplainData.text}} ></div>*/}
                      <div dangerouslySetInnerHTML = {{__html:groupResultExplainData.text}} ></div>
                    </div>
                  </TabPane>
                </Tabs>
              </Card>
            </Col>
          </Row>
        </div>
      </PageHeaderLayout>
    );
  }
}
