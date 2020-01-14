import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import { taskTestColumns } from "../columns";
import { setItem, timestamp } from "../../../utils/utils";
import {message} from "antd"
import { codeMark} from "../../../utils/options";
import styles from "./myTools.less";
import ConfirmModal from "components/ConfirmModal";
/**
 * 我的任务
 * */
@connect(({ taskTest, loading }) => ({
  taskTest,
  loading: loading.effects["taskTest/queryTaskTestGroup"]
}))
export default class TaskTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      toolName:"",
      status:null,
      _startTime:null,
      _endTime:null,
      taskInfo:"",
      myStyle:{},
      visible:false
    };
    this.columns = [
      ...taskTestColumns,
      {
        title: "操作",
        dataIndex: "action" ,
        render: (text, record) => this.renderOperation(record)
      }
    ];
    this.previousTime = 0 ;
  }
  //查看详情
  renderOperation(value) {
    return (
      <div>
        <a onClick={this.handleLook.bind(this, value.id, "upload",1,value.status)}>查看详情 </a>
        {value.status==3||value.status==4?<a onClick={this.handleDelete.bind(this, value.id, "upload",value.status)}>删除 </a>:<a>　　</a>}
      </div>
    );
  }

  /**
   * 删除
   * @param id
   * @param type
   * @param c_status
   */
  handleDelete = (id,type,c_status) => {
    this.setState({
      taskInfo:id,
      visible:true
    })
  }

  //确认删除
  handleOkDownDeploy = () => {
    const value = {
      id:this.state.taskInfo
    }
    this.props.dispatch({
        type: "taskTest/deleteTask",
        payload: value
      }
    ).then(()=>{
      let code = this.props.taskTest.deleteRusult.code;
      if(code == '000000'){
        this.setState({
          visible:false,
          taskInfo:''
        })
        const params = {
          toolName:this.state.toolName,
          status:this.state.status,
          _startTime:this.state._startTime,
          _endTime:this.state._endTime,
         /* pageNo: pageNumber,
          pageSize: 15*/
        };
        this.getListData(params);
        // this.getListData();
      }else{
        message.error(codeMark[code]);
      }
    })
  }
  handleCancel = () =>{
    this.setState({
      visible:false,
      taskInfo:''
    })
  }
  //查看操作
  handleLook = (id,type,look_mark,_status) => {
    sessionStorage.setItem("failtask_mis_id",id);
    sessionStorage.setItem("failtask_mis_look_mark",look_mark);
    sessionStorage.setItem("task_c_status",_status);
    /*this.props.history.push("/data/failTaskRate");*/
    // this.props.history.push("/apply/taskTestRate");
    this.props.history.push("/task/detail");
  };
  //封装单条信息存储到localstorage里面
  packageLocalStorage = id => {
    setItem("failtask_mis_id", id);
  };

  componentDidMount() {
    this.getListData();
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 15
    };
    dispatch({
      type: "taskTest/queryToolsNameList", //获取工具名称-搜索用
      payload: params
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  componentWillUnmount() {}
  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.scrollHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      background:"#ffffff",
      marginBottom:"24px"
    }
    this.setState({
      myStyle:mystyle
    })
  }
  getToolsDataByTime = () => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if(now - this.previousTime > 2000) {
      this.previousTime = now;
      const { dispatch } = this.props;
      const params = {
        pageNo: 1,
        pageSize: 15
      };
      dispatch({
        type: "taskTest/queryToolsNameList", //获取工具名称-搜索用
        payload: params
      });
    }
  }
  // 重置
  onReset=()=>{
    this.setState({
      toolName:"",
      status:null,
      _startTime:null,
      _endTime:null,
    })
    this.getListData();
  }
  onSubmit = (err, value) => {
    if (err) {
      return;
    }
    const _time = value["time"];
    const _startTime = _time
      ? _time[0].format("YYYY-MM-DD") + " 00:00:00"
      : undefined;
    const _endTime = _time
      ? _time[1].format("YYYY-MM-DD") + " 00:00:00"
      : undefined;
    // if (_time || value["toolName"] || value["status"]) {
    //toolName:"",
    //       status:null,

    this.setState({
      toolName:value["toolName"],
      status:value["status"],
      _startTime:_startTime,
      _endTime:_endTime,
    })
      const values = {
        ...value,
        startTime: timestamp(_startTime),
        endTime: timestamp(_endTime),
        pageNo: 1,
        pageSize: 15
      };
      this.getListData(values);
    // }
  };
  //翻页
  pagination = pageNumber => {
    const params = {
      toolName:this.state.toolName,
      status:this.state.status,
      _startTime:this.state._startTime,
      _endTime:this.state._endTime,
      pageNo: pageNumber,
      pageSize: 15
    };
    this.getListData(params);
  };
  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "taskTest/queryTaskTestGroup",
      payload: value
    });
  }

  render() {
    const { taskTest, loading } = this.props;
    const { groupData, myToolNameGroupData } = taskTest; // groupData 展示列表数据   myToolNameGroupData搜索-工具名称

    const { pageNo, total, dataSource } = groupData;

    let _myToolNameGroup = [];
    myToolNameGroupData && myToolNameGroupData.dataSourceTool
      ? myToolNameGroupData &&
        myToolNameGroupData.dataSourceTool.map((value, index) => {
          _myToolNameGroup.push({
            key: value.name,
            value: value.name
          });
        })
      : "";
    const searchs = [
      {
        type: "AutoComplete",
        label: "工具名称",
        required: false,
        placeholder: "请输入",
        parameter: "toolName",
        options: _myToolNameGroup
      },
      {
        type: "Select",
        label: "状态",
        required: false,
        placeholder: "请选择",
        parameter: "status",
        options: [
          { key: 1, value: "排队中" },
          { key: 2, value: "执行中" },
          { key: 3, value: "成功" },
          { key: 4, value: "失败" }
        ]
      },
      {
        type: "RangePicker",
        label: "提交时间",
        required: false,
        placeholder: "请输入",
        parameter: "time"
      }
    ];

    return (
      <PageHeaderLayout
        title="我的任务"
        breadcrumbList={[{title: ""},{title: ""}]}
      >
        <div style={this.state.myStyle} className={styles.taskWaper}>
          <ListQuery
          bordered={false}
          linkName=""
          columns={this.columns}
          items={searchs}
          dataSource={dataSource}
          current={pageNo}
          total={total}
          loading={loading}
          pagination={this.pagination}
          onSubmit={this.onSubmit}
          onReset={this.onReset}
          updateByTime={this.getToolsDataByTime}
          />
        </div>
        <ConfirmModal
          visible={this.state.visible}
          onOk={this.handleOkDownDeploy}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >
          <span style={{ fontWeight: "800" }}>确认删除所选任务吗？</span>
        </ConfirmModal>
      </PageHeaderLayout>
    );
  }
}
