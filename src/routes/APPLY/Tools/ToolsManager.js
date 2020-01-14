import React, { Component } from "react";
import { connect } from "dva";
import {
  Card,
  Table,
  Row,
  Button,
  Pagination,
  Divider,
  Form,
  Col,
  AutoComplete,
  Select, TreeSelect, message, Input, Spin
} from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import NewToolsManage from "./NewToolsManage";
import { toolsManageColumns } from "../columns";
import styles from "./myTools.less";

const FormItem = Form.Item;
const { Option } = Select;
import ConfirmModal from "components/ConfirmModal";
import request from "../../../utils/request";

const objName = {};
let _columnKey = "";//排序字段
let _order = "";//排序字段-升降序
/**
 * 应用管理-工具管理
 * */
@connect(({ toolsManager, loading }) => ({
  toolsManager,
  loading: loading.effects["toolsManager/toolsManagerGroup"]
}))
@Form.create()
export default class ToolsManager extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      name: "",
      typeCode: "",
      principal: "",
      newRandomKey: "",
      visible: false,
      toolsManageData: null,
      visible1: false,
      currentRecord: null,
      editTable: false,//排序是否可编辑
      editKey: undefined,
      tools_code: undefined,
      edit_td: false,
      sort_field: null,
      sort_lifting: null,
      time_lifting: null,
      myStyle: {}
    };
    this.columns = [
      {
        title: "排序",
        width: "8%",
        dataIndex: "sort",
        sorter: (a, b) => a.sort - b.sort,
        // sortDirections: ["descend", "ascend"],
        render: this.isEditTable
      },
      ...toolsManageColumns,
      {
        title: "操作",
        width: "14%",
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
      type: "toolsManager/toolsChargeGroup", //获取树形结构负责人的数据
      payload: params
    });
    dispatch({
      type: "toolsManager/queryToolsNameList", //获取工具名称
      payload: params
    });
    dispatch({
      type: "toolsManager/toolsTypeGroup", //获取工具类型
      payload: params
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function() {
      _this.setItemHeight();
    };
  }

  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.scrollHeight;
    let setHeight = clientHeight - 64 - 103 - 48 + "px";
    let mystyle = {
      minHeight: setHeight,
      background: "#ffffff",
      marginBottom: "24px"
    };
    this.setState({
      myStyle: mystyle
    });
  };
  //表单提交
  onSubmit = e => {
    if (e) {
      e.preventDefault();
    }
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (err) return;
      let principal = fieldsValue.principal;
      fieldsValue.principal = objName[principal];
      const values = {
        ...fieldsValue,
        pageNo: 1,
        pageSize: 15
      };
      this.setState({
        formValues: values
      });
      dispatch({
        type: "toolsManager/toolsManagerGroup",
        payload: values
      });
      this.setState({
        name: fieldsValue.name,
        typeCode: fieldsValue.typeCode,
        principal: principal
      });
    });
  };

  //编辑操作，显示签名编辑弹窗
  _editHandler = (record, e) => {
    let _data = null;
    if (e) {
      e.preventDefault();
      _data = record;
    }
    this._setModel(true, Math.random(), _data);
  };

  //删除操作
  _deleteConfirm(record) {
    this.setState({
      visible1: true,
      currentRecord: record
    });
  }

  //删除取消
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false
    });
  };
  //删除确定
  handleOk = () => {
    this.setState({
      confirmLoading: true
    });
    const _data = this.state.currentRecord;
    const _code = _data ? _data.code : false;

    if (_code) {
      const _params = {
        code: _code
      };
      this.props
        .dispatch({
          type: "toolsManager/toolsManagerDelete",
          payload: _params
        })
        .then(() => {
          const { actionStatus } = this.props.toolsManager;
          if (actionStatus) {
            message.success("操作成功！");
            this.setState({
              confirmLoading: false,
              visible1: false,
              currentRecord: null
            });
            this.getListData(this.state.formValues);
          }
        });
    }
  };
// 弹层
  _setModel = (flag, random, data) => {
    this.setState({
      newRandomKey: random ? random : "",
      visible: flag,
      toolsManageData: data
    });
    if(!flag){
      this.setState({
        name: "",
        typeCode: "",
        principal: "",
      });
      this.props.form.resetFields()
    }
  };
// 排序编辑
  isEditTable = (text, record) => {
    if (this.state.editTable && record.key == this.state.editKey && this.state.edit_td) {
      return (
        <div className={styles.editSort}>
          <Form onSubmit={this.handleSubmit}>
            <Form.Item
              /*label={record.sort}*/
            >
              {this.props.form.getFieldDecorator("sort", {
                initialValue: record ? record.sort : "1",
                rules: [{
                  required: true, message: "请输入"
                }]
              })(
                <Input/>
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
    } else {
      return (
        <div>
          {record.sort}
        </div>
      );
    }
  };

  // 修改排序
  _editSort = (record, e) => {
    if (e) {
      e.preventDefault();
    }
    this.setState({
      editTable: true,
      editKey: record.key,
      tools_code: record.code,
      edit_td: true
    });
  };
// 排序保存
  _saveSort = () => {
    const _submit = document.getElementById("_submit");
    _submit.click();
  };
  // 保存序号修改
  handleSubmit = e => {
    e.preventDefault();
    // const _data = this.state.currentRecord;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      if (values.sort > 100 || values.sort < 1) {
        message.error("只能输入1-100的正整数。");
        return;
      } else if (!(/(^[1-9]\d*$)/.test(values.sort))) {
        message.error("只能输入1-100的正整数。");
        return false;
      }
      request("/annoroad-cloud-mis-server/tool/sort", {
        body: {
          code: this.state.tools_code,
          sort: values.sort
        }
      }).then((data) => {
        if (data) {
          if (data.code === "000000") {
            this.setState({
              tools_code: undefined,
              modalVisible1: false,
              renameParams: "",
              visible: 0,
              editTable: false,
            });
            message.success("修改成功！");
            const params = {
              name: this.state.filename,
              typeCode: this.state.typeCode,
              principal: objName[this.state.principal],
            };
            this.getListData(params);
          }
        } else {
          message.error("系统错误");
        }

      });
    });
  };

  //操作
  _handler = (text, record) => {
    let sort_Word;
    if (this.state.editTable && record.key == this.state.editKey) {
      sort_Word = "0";
    } else {
      sort_Word = "1";
    }
    if (record.status == 3) {
      return (
        <div>
          {sort_Word == 0 ? <a onClick={this._saveSort.bind(this, record)}>保存</a> :
            <a onClick={this._editSort.bind(this, record)}>排序</a>}
          <Divider type="vertical"/>
          <a onClick={this._editHandler.bind(this, record)}>编辑</a>
          <Divider type="vertical"/>
          <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
        </div>
      );
    }
    return (
      <div>
        {sort_Word == 0 ? <a onClick={this._saveSort.bind(this, record)}>保存</a> :
          <a onClick={this._editSort.bind(this, record)}>排序</a>}
        <Divider type="vertical"/>
        <a onClick={this._editHandler.bind(this, record)}>编辑</a>
      </div>
    );
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      name: this.state.filename,
      typeCode: this.state.typeCode,
      principal: objName[this.state.principal],
      sortField: this.state.sort_field,
      sort: this.state.sort_field == 1 ? this.state.sort_lifting : this.state.time_lifting,
      pageNo: pageNumber,
      pageSize: 15
    };
    this.getListData(params);
  };

  //获取列表数据
  getListData(params) {
    console.log("接收参数:",params)
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "toolsManager/toolsManagerGroup",
      payload: value
    });
  }

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
      name: "",
      typeCode: "",
      principal: "",
      sort_field: null,
      sort_lifting: null,
      time_lifting: null
    });
    const values = {
      pageSize: 15,
      pageNo: 1
    };
    dispatch({
      type: "toolsManager/toolsManagerGroup",
      payload: values
    });
  };

  // //树形结构-负责人
  // onChange = (value) => {
  //   // value 中文名
  //   this.setState({
  //     principal: value
  //   });
  // }
  //修改负责人结构树格式
  getData = _data => {
    if (_data) {
      return _data.map(value => {
        if (value.leaf === 1) {
          objName[value.name] = value.userId;
          objName[value.userId] = value.name;
          return {
            title: value.name,
            value: value.name,
            key: value.userId
          };
        } else {
          return {
            title: value.name,
            selectable: false,
            children: this.getData(value.childNodes)
          };
        }
      });
    }
  };

  getToolsDataByTime = (type) => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if (now - this.previousTime > 2000) {
      this.previousTime = now;
      const { dispatch } = this.props;
      const params = {
        pageNo: 1,
        pageSize: 15
      };
      if (type == "principal") {
        dispatch({
          type: "toolsManager/toolsChargeGroup", //获取树形结构负责人的数据
          payload: params
        });
      } else if (type == "toolName") {
        dispatch({
          type: "toolsManager/queryToolsNameList", //获取工具名称
          payload: params
        });
      } else {
        dispatch({
          type: "toolsManager/toolsTypeGroup", //获取工具类型
          payload: params
        });
      }
    }
  };
  // 表格排序
  _onChange = (pagination, filters, sorter) => {
    let sortField = sorter.column &&sorter.column.dataIndex == "sort" ? 1 : 2;
    let lifting = null;
    if (sorter.column&&sorter.column.dataIndex == "sort") {
      lifting = this.state.sort_lifting == null ? 1 : this.state.sort_lifting == 1 ? 2 : 1;
      this.setState({
        sort_field: sortField,
        sort_lifting: lifting
      });
    } else {
      lifting = this.state.time_lifting == null ? 1 : this.state.time_lifting == 1 ? 2 : 1;
      this.setState({
        sort_field: sortField,
        time_lifting: lifting
      });
    }
    const values = {
      name: this.state.name,
      typeCode: this.state.typeCode,
      principal: objName[this.state.principal],
      sortField: sortField,
      sort: lifting,
      pageNo: 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "toolsManager/toolsManagerGroup",
      payload: values
    });

  };

  render() {
    const { toolsManager, loading } = this.props;
    const { groupData, ToolsChargePerson, myToolNameGroupData, myToolTypeGroupData } = toolsManager;
    const { pageNo, pageSize, total, dataSource } = groupData;
    const treeDatas = this.getData(ToolsChargePerson ? ToolsChargePerson.structure : "");
    let _list = [];
    if (myToolNameGroupData.dataSourceTool) {
      myToolNameGroupData &&
      myToolNameGroupData.dataSourceTool.map((value, index) => {
        _list.push({
          key: value.name,
          value: value.name
        });
      });
    }
    let _toolTypeList = [];
    if (myToolTypeGroupData.dataSource) {
      myToolTypeGroupData &&
      myToolTypeGroupData.dataSource.map((value, index) => {
        _toolTypeList.push({
          key: value.code,
          value: value.name
        });
      });
    }

    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="工具管理"
        breadcrumbList={[{ title: "应用管理" }, { title: "工具管理" }]}
      >

        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title="">
            <Form onSubmit={this.onSubmit} layout="inline">
              <Row className={styles.row}>
                <Col className={styles.col}>
                  <FormItem label="工具名称">
                    {getFieldDecorator("name", { initialValue: this.state.name ? this.state.name : "" })(
                      <AutoComplete
                        placeholder="请输入"
                        onChange={() => this.getToolsDataByTime("toolName")}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {myToolNameGroupData.dataSourceTool
                          ? myToolNameGroupData &&
                          myToolNameGroupData.dataSourceTool.map((value, index) => (
                              <Option key={index} value={value.name}>{value.name}</Option>
                            )
                          )
                          : ""}
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="工具类型">
                    {getFieldDecorator("typeCode", { initialValue: this.state.typeCode ? this.state.typeCode : undefined })(
                      <Select placeholder="请选择" onChange={() => this.getToolsDataByTime("toolType")}
                              style={{ width: "100%" }}>
                        {myToolTypeGroupData && myToolTypeGroupData.dataSource
                          ? myToolTypeGroupData &&
                          myToolTypeGroupData.dataSource.map((value, index) => (
                            <Option key={index + value.code} value={value.code}>{value.name}</Option>
                          ))
                          : ""}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="负责人" className={styles.principals}>
                    {getFieldDecorator("principal", { initialValue: this.state.principal ? this.state.principal : [] })(
                      <TreeSelect
                        style={{ width: 300 }}
                        value={this.state.value}
                        dropdownStyle={{ maxHeight: 400, overflow: "auto" }}
                        treeData={treeDatas}
                        // searchPlaceholder="请输入"
                        showSearch={true}
                        treeDefaultExpandAll
                        onSearch={this.getToolsDataByTime("principal")}
                        // onChange={this.onChange}
                        placeholder="请输入"
                      />
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
              <Row className={styles.lastRow}>
                <Col md={8} sm={24}>
                  <FormItem>
                    <Button type="primary" icon="plus" onClick={this._editHandler}
                            style={{ marginBottom: "24px" }}>新建工具</Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading}>
              <Table
                columns={this.columns}
                dataSource={dataSource}
                size="middle"
                pagination={false}
                onChange={this._onChange}
                className={styles.toolsManagerTable}
              />
              <Row type="flex" justify="end" className={styles.paginationBox}>
                <Pagination
                  showQuickJumper
                  onChange={this.pagination}
                  pageSize={pageSize}
                  current={pageNo}
                  total={total}
                />
              </Row>
            </Spin>
            <NewToolsManage
              visible={this.state.visible}
              data={this.state.toolsManageData}
              newRandomKey={this.state.newRandomKey}
              setModel={this._setModel}
              toolsChargePerson={this.props.toolsManager.ToolsChargePerson}
              myToolTypeGroupData={this.props.toolsManager.myToolTypeGroupData}
              onRefresh={() => this.onSubmit()}
              style={{ width: "50%" }}

            />
          </Card>
        </div>
        <ConfirmModal
          visible={this.state.visible1}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
        >

          <span style={{ fontWeight: "800" }}>删除确认</span><br/>
          <span style={{ color: "#999", margin: "12px 0 0 30px", display: "block" }}>确定要删除吗？</span>
        </ConfirmModal>

      </PageHeaderLayout>
    );
  }
}
