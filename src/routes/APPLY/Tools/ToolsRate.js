import React, { Component } from "react";
import { Button, Steps, Card } from "antd";
import { routerRedux } from "dva/router";
import Result from "components/Result";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "../style.less";
const Step = Steps.Step;
/***
 * 任务进度（提交任务后跳转页面）
 * * */
@connect(({ myTools, loading }) => ({
  myTools
}))
export default class ToolsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = { isToggleOn: true, seconds: 5,myStyle:{} };
  }
  componentDidMount() {
    const _this = this;
    let timer = setInterval(() => {
      this.setState(
        preState => ({
          seconds: preState.seconds - 1
        }),
        () => {
          if (this.state.seconds == 0) {
            clearInterval(timer);
            // 进行页面跳转
            // this.goBack();
            // _this.props.dispatch(routerRedux.push("/apply/taskTest"));
            _this.props.dispatch(routerRedux.push("/task/find"));
          }
        }
      );
    }, 1000);
    _this.setItemHeight();
    window.onresize = function () {
      _this.setItemHeight();
    }

  }
  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.clientHeight;
    let setHeight = clientHeight-64-65+"px";
    let mystyle={
      minHeight: setHeight,
      background:"#ffffff",
      marginBottom:"24px"
    }
    this.setState({
      myStyle:mystyle
    })
  }

  /**
   * 返回审核测试列表
   */
  goBack = () => {
    let analysisMark = localStorage.getItem("annoroad-task-analysisMark");
    if(analysisMark=="true"){
      this.props.dispatch(routerRedux.push("/application/tools"));
    }else{
      this.props.dispatch(routerRedux.push("/apply/examine"));
    }
  };
  componentWillUnmount(){
    localStorage.removeItem("annoroad-task-analysisMark");
  }

  /**
   *  查看任务详情
   * */
  checkTask = () => {
    let id = this.props.myTools.taskProgress.id;
    /*localStorage.setItem("failtask_mis_id", id);*/
    sessionStorage.setItem("failtask_mis_look_mark",1);
    sessionStorage.setItem("failtask_mis_id",id);
    this.props.dispatch(
      routerRedux.push({
        pathname: "/task/detail",
      })
    );
  };

  render() {
    let status = this.props.myTools.taskProgress.status;
    const des = (
      <div className={styles.extraWrap}>
        <a className={styles.toolNameItem}  >{this.props.myTools.taskProgress.name}</a>
        <p className={styles.toolNameItem} >
          {this.props.myTools.taskProgress&&this.props.myTools.taskProgress.outputPath ? this.props.myTools.taskProgress.outputPath.replace(/\//g, " > "):""}
        </p>
        <div>
          <Steps progressDot current={status === 1 ? 0 : status === 2 ? 1 : 2}>
            <Step title="排队中" />
            <Step title="执行中" />
            <Step title="完成" />
          </Steps>
        </div>
      </div>
    );
    return (
      <PageHeaderLayout>
        <div className={styles.toolsRate_main} style={this.state.myStyle}>
          <Card bordered={false}>
            <Result
              type="success"
              title="提交成功"
              /* description={des}*/
              extra={des}
              style={{ marginTop: "32px", marginBottom: "32px",fontWeight:"800", }}
            />
            <div className={styles.btnBox} style={{width:"100%",textAlign:"center",marginTop:"24px",marginBottom:"32px"}}>
              <Button type="primary" onClick={() => this.goBack()}>
                返回列表
              </Button>
              <Button onClick={() => this.checkTask()} style={{marginLeft:"12px"}}>查看任务</Button>
            </div>
            <div style={{textAlign:"center"}}>{this.state.seconds}秒后跳转至我的任务</div>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
