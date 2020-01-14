import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import {
  Card,
  Table,
  Row,
  Button,
  Pagination,
  Divider,
  Col,
  Form,
  Select,
  AutoComplete, Spin
} from "antd";
import styles from "./myTools.less";

import { getMyToolStatus } from "../../../utils/options";

import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { myToolsColumns } from "../columns";
import { removeItem } from "../../../utils/utils";
const FormItem = Form.Item;
const { Option } = Select;
/**
 * 我的工具模块
 * */
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/myToolsGroup"]
}))
@Form.create()
export default class MyTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      toolName:"",
      toolTypeCode:"",
      status:null,
      myStyle:{}
    };

    this.columns = [
      ...myToolsColumns,
      {
        title: "操作",
        dataIndex: "action",
        render: this._handler
      }
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
      type: "toolsType/queryToolsNameList",
      payload: params
    });
    dispatch({
      type: "toolsType/toolsTypeGroup",
      payload: params
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
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
  componentWillUnmount() {
    removeItem("annoroad-edit-myTool-save")
  }
  _handler = (text, record) => {
    if (record.status == 1) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>工具预览</a>
          <Divider type="vertical" />
          <a onClick={() =>this.editMytool(record.code,record.typeCode,record.toolCode,1,record.status,record.upgrade)}>编辑工具</a>
        </div>
      );
    } else if (record.status == 2 || record.status == 4) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>工具预览</a>
          <Divider type="vertical" />
          <a onClick={() =>this.editMytool(record.code,record.typeCode,record.toolCode,1,record.status,record.upgrade)}>编辑工具</a>
          <Divider type="vertical" />
          <a onClick={() =>this.submitMytool(record.code,record.toolCode)}>提交部署</a>
        </div>
      );
    } else if (record.status == 3 || record.status == 5 || record.status == 6) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>工具预览</a>
          <Divider type="vertical" />
          <a onClick={() =>this.editMytool(record.code,record.typeCode,record.toolCode,2,record.status,record.upgrade)}>更新图文</a>
        </div>
      );
    } else if (record.status == 7 || record.status == 8 || record.status == 9) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>工具预览</a>
          <Divider type="vertical" />
          <a onClick={() =>this.editMytool(record.code,record.typeCode,record.toolCode,2,record.status,record.upgrade)}>更新图文</a>
          {record.upgrade ==1?
            (<span>
          <Divider type="vertical" />
          <a  onClick={() =>this.editMytool(record.code,record.typeCode,record.toolCode,3,record.status,record.upgrade)}>升级版本</a>
          </span>):""}
          </div>
      );
    } else {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>工具预览</a>
        </div>
      );
    }
  };


  /**
   * 工具预览
   */
  preview = (code,status) => {
    sessionStorage.setItem("examine_c_status",status);
    this.props.dispatch(routerRedux.push({
      pathname:"/apply/tool/preview",
      query:{
        /*code: "4e93e144c1fe486f8efe47ee5d1df717",*/
        code: code,
        interactive: false
      }
    }))
  };

  /**
   * 编辑工具
   */
  editMytool = (code,typeCode,toolCode,updateToolsType,toolStatus,isUpgrade) => {
    this.props.dispatch(routerRedux.push({
      pathname:"/apply/editMyTools",
      query:{
        code: code,
        toolCode: toolCode,
        updateToolsType: updateToolsType,
        toolStatus:toolStatus,
        isUpgrade:isUpgrade
        //interactive: false
      }
    }))
  };

  /**
   * 提交部署
   */
  submitMytool = (code,toolCode) => {
    this.props.dispatch(routerRedux.push({
      pathname:"/apply/submitMyTools",
      query:{
        code: code,
        toolCode: toolCode,
        updateToolsType:2
      }
    }))
  };




  onSubmit = e => {
    e.preventDefault();

    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        toolName:fieldsValue.toolName,
        toolTypeCode:fieldsValue.toolTypeCode,
        status:fieldsValue.status
      });
      const value = {
        ...fieldsValue,
      };
      this.props.dispatch({
        type: "toolsType/myToolsGroup",
        payload: value
      });
    });
  };
  //翻页
  pagination = pageNumber => {
    const params = {
    toolName:this.state.toolName,
    toolTypeCode:this.state.toolTypeCode,
    status:this.state.status,
    pageNo: pageNumber
    };
    this.getListData(params);
  };

  //获取列表数据
  getListData(params) {

    this.setState({
      toolName:"",
      toolTypeCode:"",
      status:null
    })
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };

    this.props.dispatch({
      type: "toolsType/myToolsGroup",
      payload: value
    });
  }

  //重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.getListData();

  };

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
        type: "toolsType/queryToolsNameList",
        payload: params
      });
      dispatch({
        type: "toolsType/toolsTypeGroup",
        payload: params
      });
    }
  }
  render() {
    const { loading, toolsType } = this.props;//myToolGroupData  我的工具列表信息
    const { groupData, myToolGroupData, myToolNameGroupData } = toolsType;
    const { pageNo, pageSize,total, toolDataSource } = myToolGroupData;
    const { datas, dataSourceTool } = myToolNameGroupData;
    const { dataSource } = groupData;
    let _list = [];
    if (dataSourceTool) {
      myToolNameGroupData &&
      myToolNameGroupData.dataSourceTool.map((value, index) => {
        _list.push({
          key: value.code,
          value: value.name
        });
      });
    }

    let _toolTypeList = [];
    if (dataSource) {
      groupData &&
      groupData.dataSource.map((value, index) => {
        _toolTypeList.push({
          key: index,
          /*code: value.code,*/
          value: value.name
        });
      });
    }
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="我的工具"
        breadcrumbList={[{title: "应用管理"},{title: "我的工具"}]}
      >
        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title="" >
            <Form onSubmit={this.onSubmit} layout="inline">
              <Row className={styles.row}>
                <Col className={styles.col}>
                  <FormItem label="工具名称">
                    {getFieldDecorator("toolName", { initialValue: this.state.toolName ? this.state.toolName : ""})(
                      <AutoComplete
                        placeholder="请输入"
                        onChange={this.getToolsDataByTime}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {dataSourceTool
                          ? myToolNameGroupData &&
                          myToolNameGroupData.dataSourceTool.map(
                            (value, index) => (
                              <Option value={value.name}>{value.name}</Option>
                            )
                          )
                          : ""}
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="工具类型">
                    {getFieldDecorator("toolTypeCode", {  initialValue: this.state.toolTypeCode ? this.state.toolTypeCode : undefined})(
                      <Select placeholder="请选择"  style={{ width: "100%" }}>
                        {dataSource
                          ? groupData &&
                          groupData.dataSource.map((value, index) => (
                            <Option value={value.code}>{value.name}</Option>
                          ))
                          : ""}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="状态">
                    {getFieldDecorator("status", {  initialValue: this.state.status ? this.state.status : undefined})(
                      <Select placeholder="请选择" style={{ width: "100%" }}>
                        {getMyToolStatus.map((value, index) => (
                          <Option value={value.key}>{value.value}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={24} sm={24}>
                  <div className={styles.searchBar}>
                    <span className={styles.submitButtons}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        style={{ background: `${this.state.bgColorsa}` }}
                      >
                        查询
                      </Button>
                      <Button
                        style={{ marginLeft: 8 }}
                        onClick={this.handleFormReset}
                      >
                        重置
                      </Button>
                    </span>
                  </div>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading}>
              <Table
                // loading={loading}
                columns={this.columns}
                dataSource={toolDataSource}
                size="middle"
                pagination={false}
              />
              <Row type="flex" justify="end" className={styles.paginationBox}>
                <Pagination
                  showQuickJumper
                  pageSize={pageSize}
                  onChange={this.pagination}
                  current={pageNo}
                  total={total}
                />
              </Row>
            </Spin>
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
