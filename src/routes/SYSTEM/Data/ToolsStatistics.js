import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import { toolsStatisticsColumns } from "../columns";
import styles from "./data.less"

/**
 * 工具统计
 * */
@connect(({ toolsStatistics, loading }) => ({
  toolsStatistics,
  loading: loading.effects["toolsStatistics/queryGroup"]
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class ToolsStatistics extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      toolName:"",
      typeCode:"",
      myStyle:{}
    };
    this.columns = [
      ...toolsStatisticsColumns
    ];
    this.previousTime = 0;
  }
  componentDidMount() {
    this.getListData();
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 15
    };
    dispatch({
      type: "toolsStatistics/queryToolsNameList", //获取工具名称-搜索用
      payload: params
    });
    dispatch({
      type: "toolsStatistics/toolsTypeGroup", //获取工具类型-搜索用
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
        type: "toolsStatistics/queryToolsNameList",
        payload: params
      });
      dispatch({
        type: "toolsStatistics/toolsTypeGroup", //获取工具类型-搜索用
        payload: params
      });
    }
  }
  // 重置
  onReset=()=>{
    this.getListData();
  }
  // 搜索查询
  onSubmit = (err, value) => {
    if (err) {
      return;
    }
    this.setState({
      toolName:value.name,
      typeCode:value.typeCode,
    })
      const values = {
        ...value,
        pageNo: 1,
        pageSize: 15
      };
      this.getListData(values);
    //}
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      toolName:this.state.toolName,
      typeCode:this.state.typeCode,
      //page_no: pageNumber
      pageNo: pageNumber,
      pageSize: 15,
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
      type: "toolsStatistics/queryGroup",
      payload: value
    });
  }

  render() {
    const { toolsStatistics, loading } = this.props;
    const { groupData, myToolNameGroupData, toolsTypeList } = toolsStatistics; // groupData 展示列表数据   toolsTypeList-搜索-工具类型
    const { pageNo, total, dataSource } = groupData;
    const { dataSourceTool } = myToolNameGroupData;
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
    let _myToolTypeGroup = [];
    toolsTypeList && toolsTypeList.dataSource
      ? toolsTypeList &&
        toolsTypeList.dataSource.map((value, index) => {
          _myToolTypeGroup.push({
            key: value.code,
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
        type: "AutoComplete",
        label: "工具类型",
        required: false,
        placeholder: "请选择",
        parameter: "typeCode",
        options: _myToolTypeGroup,
        sign: true
      }
    ];

    return (
      <PageHeaderLayout
        title="工具统计"
        breadcrumbList={[{title: "数据统计"},{title: "工具统计"}]}
      >
        <div style={this.state.myStyle}>
          <ListQuery
            bordered={false}
            /*linkName="新增签名"*/
            linkName=""
            columns={this.columns}
            items={searchs}
            dataSource={dataSource}
            current={pageNo}
            total={total}
            scroll={800}
            loading={loading}
            pagination={this.pagination}
            onSubmit={this.onSubmit}
            onReset={this.onReset}
            updateByTime={this.getToolsDataByTime}
            className={styles.thirdColLeft}
          />
        </div>
      </PageHeaderLayout>
    );
  }
}
