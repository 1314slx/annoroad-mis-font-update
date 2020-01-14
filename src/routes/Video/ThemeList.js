import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import styles from "./style.less";
import {
  AutoComplete,  Button,  Card,  Col,  Divider,  Form,  Input,  Pagination,  Row,  Select,  Table,  TreeSelect,  message, Spin
} from "antd";
import { themeListColumns } from "./columns";
import { getVideoStatus } from "../../utils/options";
import * as routerRedux from "react-router-redux";
import request from "../../utils/request";
const FormItem = Form.Item;
const { Option } = Select;
const objName={};
import ConfirmModal from "components/ConfirmModal";
import { codeMark} from "../../utils/options";

/**
 * 视频列表-视频主题
 * */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects["video/themeList"]
}))
@Form.create()
export default class ThemeList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      editTable: false,//排序是否可编辑
      editKey: undefined,
      visible1:false,
      visible2:false,
      currentRecord: null,
      tools_code: undefined,
      edit_td:false,
      td_order:false,
      sort_field: null,
      sort_lifting: null,
      time_lifting: null,
      status: null,
      myStyle:{}
    };
    this.columns = [
      {
        title: "排序",
        width:'8%',
        dataIndex: "sort",
        render: this.isEditTable,
        sorter: (a, b) => a.sort - b.sort,
        // sortDirections: ['descend', 'ascend'],
      },
      ...themeListColumns,
      {
        width:'15%',
        title: "操作",
        render: this._handler
      }
    ];
    this.previousTime = 0;
  }

  componentDidMount() {
    this.getListData();
    this.getSearchData();
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 9999
    };
    const value = {
      status:1
    };
    dispatch({
      type: "video/videoTypeGroup",   //获取视频类型
      payload: value
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
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }
  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "video/themeList",
      payload: value
    });
  }
  //获取列表数据-检索数据接口（视频主题+操作人）
  getSearchData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 9999
    };
    this.props.dispatch({
      type: "video/themeFind",
      payload: value
    });
  }

  // 重置
  handleFormReset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      name:"",
      typeCode:"",
      principal:"",
      sort_field: null,
      sort_lifting: null,
      time_lifting: null,
      status: null
    });
    this.getListData();
  };

  //表单提交
  onSubmit = e => {
    if(e){
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        name:fieldsValue.name,
        typeCode:fieldsValue.typeCode,
        status:fieldsValue.status,
        updateByName:fieldsValue.updateByName,
      })
      if (err) return;
      const values = {
        ...fieldsValue,
        pageNo:  1,
        pageSize: 15
      };
      dispatch({
        type: "video/themeList",
        payload: values
      });
    });
  };
  // 列表操作
  _handler = (text, record) => {
    let sort_Word;
    if (this.state.editTable && record.key == this.state.editKey) {
      sort_Word = '0';
    }else{
      sort_Word = '1';
    }
    return (
      <div>
        {sort_Word==0?<a onClick={this._saveSort.bind(this, record)}>保存</a>:
          <a onClick={this._editSort.bind(this, record)}>排序</a>}
        <Divider type="vertical" />
        <a onClick={this._editHandler.bind(this, record)}>编辑</a>
        <Divider type="vertical" />
        <a onClick={this._authCheck.bind(this, record)}>授权</a>
        <Divider type="vertical" />
        {record.status==1?<a onClick={this._themeUp.bind(this, record)}>上架</a>:<a onClick={this._themeDown.bind(this, record)}>下架</a>}
      </div>
    );
  };
  // 编辑操作
  _editHandler = (record, e) => {
    let _data = null;
    if (e) {
      e.preventDefault();
      _data = record;
    }
    this.props.dispatch(routerRedux.push({
      pathname:"/video/theme-add",
      query:{
        code: record?record.code:"",
        sort: record?record.sort:"",
      }
    }))

  };
  // 授权操作
  _authCheck = (record, e) => {
    let _data = null;
    if (e) {
      e.preventDefault();
      _data = record;
    }
    this.props.dispatch(routerRedux.push({
      pathname:"/video/theme-check",
      query:{
        code: record?record.code:"",
        privacy: record?record.privacy:"",
        themeCode: record?record.themeCode:"",
        name: record?record.name:"",
      }
    }))
  };
  /**
   * 每2秒调用一次搜索接口
   */
  getDataByTime = () => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if(now - this.previousTime > 2000) {
      this.previousTime = now;
      const { dispatch } = this.props;
      const params = {
        pageNo: 1,
        pageSize: 15
      };
      const value = {
        ...params,
        pageNo: params && params.pageNo ? params.pageNo : 1,
        pageSize: 9999
      };
      dispatch({
        type: "video/themeFind",
        payload: value
      });

    }
  }
  // 点击上架
  _themeUp = (record)=>{
    this.setState({
      visible1: true,
      visible2: false,
      currentRecord: record
    });
  }

  // 点击下架
  _themeDown = (record)=>{
    this.setState({
      visible2: true,
      visible1: false,
      currentRecord: record
    });
  }

  // 排序编辑
  isEditTable = (text,record)=>{
    if(this.state.editTable  && record.key == this.state.editKey && this.state.edit_td ){
      return (
        <div className={styles.editSort}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
            >
              {this.props.form.getFieldDecorator('sort', {initialValue: record ? record.sort : "1",
                rules: [{
                  required: true, message: '请输入',
                }],
              })(
                <Input />
              )}
            </Form.Item>
            <Button
              id="_submit"
              style={{ display: "none" }}
              type="primary"
              htmlType="submit"
            />
          </Form>
        </div>
      );
    }else{
      return (
        <div>
          {record.sort}
        </div>
      );
    }
  }

  // 修改排序
  _editSort = (record, e)  => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      editTable:true,
      editKey:record.key,
      tools_code:record.code,
      edit_td:true
    })
  }

  // 排序保存
  _saveSort = () => {
    const _submit = document.getElementById("_submit");
    _submit.click();
  };

  // 保存序号修改
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if(values.sort>100 || values.sort<1){
        message.error("只能输入1-100的正整数。");
        return;
      }else if (!(/(^[1-9]\d*$)/.test(values.sort))) {
        message.error("只能输入1-100的正整数。");
        return false;
      }
      request('/annoroad-cloud-mis-server/video/theme/sort', {
        body: {
          code:this.state.tools_code,
          sort:parseInt(values.sort),
        }
      }).then((data) => {
        if(data){
          if(data.code==="000000"){
            this.setState({
              tools_code:undefined,
              visible:0,
              editTable:false,
            });
            message.success("修改成功！");
            const _params = this.getSearchData();
            this.getListData(_params);


          }
        }else{
          message.error("系统错误")
        }
      })
    })
  }
//
  getDataByTime = () => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if(now - this.previousTime > 2000) {
      this.previousTime = now;
      const { dispatch } = this.props;
      const params = {
        pageNo: 1,
        pageSize: 15
      };
      const value = {
        ...params,
        pageNo: params && params.pageNo ? params.pageNo : 1,
        pageSize: 9999
      };
      dispatch({
        type: "video/themeFind",
        payload: value
      });

    }
  }

  // 上架
  handle_themeUp = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    request('/annoroad-cloud-mis-server/video/theme/up',{body:{
        code:_data.code,
      }}).then((data)=>{
      if(data) {
        this.setState({visible1: false})
        if (data.code === "000000") {
          const _params = this.getSearchData();
          this.getListData(_params);
          this.setState({
            currentRecord: null,
          });
        }else{
          message.error(codeMark[data.code]);
        }
      }else{
        message.error("系统异常");
      }
    })
  }
  getSearchData = () =>{
    const params = {
      name:this.state.filename,
      typeCode:this.state.typeCode,
      principal: objName[this.state.principal],
      sortField: this.state.sort_field,
      lifting: this.state.sort_field == 1 ? this.state.sort_lifting : this.state.time_lifting,
      status: this.state.status,
    };
    return params;
  }

  // 下架
  handle_themeDown = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    request('/annoroad-cloud-mis-server/video/theme/down',{body:{
        code:_data.code,
      }}).then((data)=>{
      if(data) {
        if (data.code === "000000") {
          const _params = this.getSearchData();
          this.getListData(_params);
          this.props.form.resetFields();
          this.setState({
            currentRecord: null,
            visible2: false,
            name:"",
            typeCode:"",
            status: null,
            updateByName:'',
          });
        }
      }})
  }

  // modal 取消操作
  handleCancel = () => {
    this.setState({
      visible1: false,
      visible2: false
    });
  };


  // 列表翻页
  pagination = pageNumber => {
    const params = {
      name:this.state.filename,
      typeCode:this.state.typeCode,
      principal: objName[this.state.principal],
      sortField: this.state.sort_field,
      lifting: this.state.sort_field == 1 ? this.state.sort_lifting : this.state.time_lifting,

      status: this.state.status,
      pageNo: pageNumber,
      pageSize: 15
    };
    this.getListData(params);
  };

  // 表格排序号、上架时间排序
  _onChange = (pagination, filters, sorter) => {
    if(sorter.column&&sorter.column.dataIndex){
      let sortField = sorter.column.dataIndex === "sort" ? 1 : 2;
      let lifting = null;
      if (sorter.column.dataIndex === "sort") {
        lifting = this.state.sort_lifting == null ? 1 : this.state.sort_lifting == 1 ? 2 : 1;
        this.setState({
          sort_field: sortField,
          sort_lifting: lifting
        })
      } else {
        lifting = this.state.time_lifting == null ? 1 : this.state.time_lifting == 1 ? 2 : 1;
        this.setState({
          sort_field: sortField,
          time_lifting: lifting
        })
      }
      const values={
        name: this.state.name,
        typeCode: this.state.typeCode,
        principal: objName[this.state.principal],
        sortField: sortField,
        lifting: lifting,
        pageNo:1,
        pageSize:15
      };
      this.props.dispatch({
        type: "video/themeList",
        payload: values
      });
    }

  }

  render() {
    const {video, loading} = this.props;
    const {ThemeListData, groupData, ThemeFindData} = video;
    const {themeList, pageNo, total} = ThemeListData;
    const {form} = this.props;
    const {getFieldDecorator} = form;
    let list = [];
    ThemeFindData && ThemeFindData.datas ? ThemeFindData.datas.map((value, index) => {
      list.push(value.updateByName);
    }) : "";
    let arr = [];
    let result = [];
    // 负责人查重处理
    for (var i = 0; i < list.length; i++) {
      //如果当前数组的第i项已经保存进了临时数组，忽略掉
      //否则的话把当前项push到临时数组里面
      if (arr.indexOf(list[i]) < 0) {
        arr.push(list[i]);
        result.push({
          key: i,
          value: list[i]
        });
      }
      //indexOf 返回元素在result中的位置，如果没有返回-1；
    }
    return <PageHeaderLayout
      title="视频列表"
      breadcrumbList={[{title: "视频管理"}, {title: "视频列表"}]}
    >
      <div className={styles.video_wapper}   style={this.state.myStyle}>
          <Card>
            <Form onSubmit={this.onSubmit} layout="inline" className={styles.searchForm}>
              <Row>
                <Col md={8} sm={24}>
                  <FormItem label="视频主题">
                    {getFieldDecorator("name", {initialValue: this.state.name ? this.state.name : ""})(
                      <AutoComplete
                        placeholder="请输入"
                        // onChange={this.getToolsDataByTime}
                        onChange={this.getDataByTime}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {ThemeFindData && ThemeFindData.datas
                          ? ThemeFindData.datas.map(
                            (value, index) => (
                              <Option key={index} value={value.name}>{value.name}</Option>
                            )
                          )
                          : ""}
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="视频类型">
                    {getFieldDecorator("typeCode",{  initialValue: this.state.typeCode ? this.state.typeCode : undefined} )(
                      <Select placeholder="全部" style={{width: "100%"}}>
                        {groupData &&
                        groupData.dataSource
                          ? groupData &&
                          groupData.dataSource.map((value, index) => (
                            <Option key={index} value={value.code}>{value.name}</Option>
                          ))
                          : ""}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col md={8} sm={24}>
                  <FormItem label="视频状态">
                    {getFieldDecorator("status", {initialValue: this.state.status ? this.state.status : undefined})(
                      <Select placeholder="全部"  style={{width: "100%"}}>
                        {getVideoStatus.map((value, index) => (
                          <Option key={index} value={value.key}>{value.value}</Option>
                        ))}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col md={8} sm={24}>
                  <FormItem label="操作人">
                    {getFieldDecorator("updateByName", {initialValue: this.state.updateByName ? this.state.updateByName : ""})(
                      <AutoComplete
                        placeholder="请输入"
                        onChange={this.getDataByTime}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {result.map(
                          (value, index) => (
                            <Option key={index} value={value.value}>{value.value}</Option>
                          )
                        )
                        }
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                <Col md={16} sm={24}>
                  <div className={styles.searchBar}>
            <span className={styles.submitButtons}>
              <Button
                type="primary"
                htmlType="submit"
                style={{background: `${this.state.bgColorsa}`}}
              >
                查询
              </Button>
              <Button
                style={{marginLeft: 8}}
                onClick={this.handleFormReset}
              >
                重置
              </Button>
            </span>
                  </div>
                </Col>
              </Row>
              <Row>
                <Col md={8} sm={24}>
                  <FormItem>
                    <Button type="primary" icon="plus" onClick={this._editHandler}
                            style={{marginBottom: "24px"}}>新增视频</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading}>
              <Table
                // loading={loading}
                columns={this.columns}
                dataSource={themeList}
                size="middle"
                pagination={false}
                onChange={this._onChange}
                className={styles.themeList_wapper}
              />
              <Row type="flex" justify="end" className={styles.paginationBox}>
                <Pagination
                  showQuickJumper
                  pageSize={15}
                  onChange={this.pagination}
                  current={pageNo}
                  total={total}
                />
              </Row>
            </Spin>
          </Card>
      </div>

      <ConfirmModal
        visible={this.state.visible1}
        onOk={this.handle_themeUp}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.handleCancel}
        style={{top:190}}
      >
        <span style={{fontWeight: "800"}}>上架确认</span><br/>
        <span style={{color: "#999", margin: "12px 0 0 30px", display: "block",}}>确定上架吗？</span>

      </ConfirmModal>
      <ConfirmModal
        visible={this.state.visible2}
        onOk={this.handle_themeDown}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.handleCancel}
      >
        <span style={{fontWeight: "800"}}>下架确认</span><br/>
        <span style={{color: "#999", margin: "12px 0 0 30px", display: "block",}}>确定下架吗？</span>
      </ConfirmModal>
    </PageHeaderLayout>;
  }
}
