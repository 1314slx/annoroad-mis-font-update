import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import { failTaskColumns } from "../columns";
import { timestamp,setItem } from "../../../utils/utils";
import styles from "../../APPLY/Tools/myTools.less";

const searchs = [
  {
    type: "input",
    label: "工具名称",
    required: false,
    placeholder: "请输入",
    parameter: "toolName"
  },
  {
    type: "RangePicker",
    label: "提交时间",
    required: false,
    placeholder: "请输入",
    parameter: "time"
  }
];

/**
 * 工具统计
 * */
@connect(({ failTask, loading }) => ({
  failTask,
  //loading:loading.effects['failTask/queryGroup']
  loading: loading.effects["failTask/queryFailTask"]
}))
export default class FailTask extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      name:"",
      _startTime:undefined,
      _endTime:undefined,
      myStyle:{}
    };
    this.columns = [
      ...failTaskColumns,
      {
        title: "操作",
        dataIndex: "action" /*/!*
         render: this._handler*!/*/,

        render: (text, record) => this.renderOperation(record)
       /* render: () => (
          <div>
            <a href="/#/data/failTaskRate">查看详情</a>
          </div>
        )*/
      }
    ];
    this.previousTime = 0;
  }
  //查看详情
  renderOperation(value) {
    return (
      <div>
        <a onClick={this.handleLook.bind(this, value.id, "upload",2,value.status)}>查看详情 </a>
      </div>
    );
  }

  //查看操作  this, value.id, "upload",2,value.status
  handleLook = (id,type,look_mark,_status) => {
    sessionStorage.setItem("failtask_mis_id",id);
    sessionStorage.setItem("failtask_mis_look_mark",look_mark);
    sessionStorage.setItem("task_c_status",_status);
    //this.packageLocalStorage(id);

    this.props.history.push("/data/failTaskRate");
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
      type: "failTask/queryToolsNameList", //获取工具名称-搜索用
      payload:params
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
    let clientHeight = document.body.clientHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      marginBottom: "24px",
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }
  //提交
//重置
  onReset=()=>{
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
    value.toolName = value.name;
    // if (_time || value["toolName"]) {
    this.setState({
      name:value.name,
      _startTime:value._startTime,
      _endTime:value._endTime,
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
  pagination = (pageNumber) => {
    const params = {
      toolName:this.state.name,
      _startTime:this.state._startTime,
      _endTime:this.state._endTime,
      pageNo: pageNumber
    };
    this.getListData(params);
  };
  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      /* page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10,*/
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "failTask/queryFailTask",
      payload: value
    });
  }
  // 每2s请求搜索数据的接口
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
        type: "failTask/queryToolsNameList",
        payload: params
      });
    }
  }

  render() {
    const { failTask, loading } = this.props;
    const { groupData, myToolNameGroupData} = failTask; // groupData 展示列表数据
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
        parameter: "name",
        options: _myToolNameGroup
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
        title="失败任务"
        breadcrumbList={[{title: "数据统计"},{title: "失败任务"}]}
      >
        <div style={this.state.myStyle} className={styles.failList}>
          <ListQuery
            bordered={false}
            /*linkName="新增签名"*/
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
           // onChange={this.onChange}
            updateByTime={this.getToolsDataByTime}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
