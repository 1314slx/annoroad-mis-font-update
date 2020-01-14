import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
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
  Select,
  Modal,
  message,
  Icon,
  Spin,
  Switch
} from "antd";

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
import ConfirmModal from "components/ConfirmModal";
import ColFormItem from "components/ColFormItem/index";
import styles from "../../APPLY/Tools/myTools.less";

import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { authorityColumns } from "../columns";
import { getAuthorityToolStatus } from "../../../utils/options";

const FormItem = Form.Item;
const { Option } = Select;

/**
 * 邮件模板管理
 * */
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/queryAuthorityGroup"]
}))
@Form.create()
export default class Authority extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      toolName: "",
      toolTypeCode: "",
      status: null,
      myStyle: {},
      list:[]
    };
    this.columns = [
      ...authorityColumns,
      {
        title: "公开显示",
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
      type: "toolsType/queryUpperToolsNameList",
      payload: params
    });
    dispatch({
      type: "toolsType/toolsUpperTypeGroup",
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

  componentWillUnmount() {
  }

  //提交
  onSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    const _this = this;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        toolName: fieldsValue.toolName,
        toolTypeCode: fieldsValue.toolTypeCode,
        status: fieldsValue.overtStatus
      });
      if (err) return;
      this.setState({
        formValues: fieldsValue
      });
      _this.getListData(fieldsValue);
      /*dispatch({
        type: "toolsType/queryAuthorityGroup",
        payload: values
      });*/
    });
  };

  //重置
  handleFormReset = () => {
    this.setState({
      toolName: "",
      toolTypeCode: "",
      status: null
    });
    const { form, dispatch } = this.props;
    form.resetFields();
    this.getListData();
  };

  //取消操作
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
      pageNo:1
    });
  };


  _handler = (text, record) => {
    //overtStatus 是否公开，1：是，2：否
    return (
      <Switch checkedChildren="是" unCheckedChildren="否" onChange={() => this.changeSwitch(record)}
              checked={record.overtStatus == 2 ? false : true}/>
    );
  };

  setListStatus(code){
    const { list } = this.state;
    let _list = list;
    _list.map((value)=>{
      if(value.code === code){
        value.overtStatus = value.overtStatus===1?2:1;
      }
    });
    this.setState({
      list:_list
    });
  }
  //公开显示操作
  changeSwitch = (data) => {
    //data.overtStatus:是否公开，1：是，2：否

    let _type =  data.overtStatus==1 ? "toolsType/versionClosed": "toolsType/versionOvert";
    const _params = {
      code:data.code
    }
      this.props.dispatch({
        type: _type,
        payload: _params
      }).then(()=>{
        const {toolVersion } = this.props.toolsType;
        if(toolVersion.code=="000000"){
          // this.getListData();
        }else if(toolVersion.code=="160517"){
          message.error("当前已为“公开”");
        }else if(toolVersion.code=="160518"){
          message.error("当前已为“非公开”")
        }else{
          message.error(toolVersion.msg)
        }
        this.setListStatus(data.code);

      /*  const params = {
          toolName: this.state.toolName,
          toolTypeCode: this.state.toolTypeCode,
          overtStatus: this.state.status,
          pageNo: this.state.pageNo
        };
        const _this = this ;
        setTimeout(function() {
          _this.getListData(params);
        }, 1000);*/

      })
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      toolName: this.state.toolName,
      toolTypeCode: this.state.toolTypeCode,
      overtStatus: this.state.status,
      pageNo: pageNumber
    };
    this.setState({
      pageNo:pageNumber
    })
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
      type: "toolsType/queryAuthorityGroup",
      payload: value
    }).then(()=>{
      const { toolsType } = this.props;
      const { authorityGroupData } = toolsType;
      const { dataSourceExamine } = authorityGroupData;
      this.setState({
        list:dataSourceExamine
      })
    })
  }

  getToolsDataByTime = () => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if (now - this.previousTime > 2000) {
      this.previousTime = now;
      const { dispatch } = this.props;
      const params = {
        pageNo: 1,
        pageSize: 15
      };
      dispatch({
        type: "toolsType/queryUpperToolsNameList",
        payload: params
      });
      dispatch({
        type: "toolsType/toolsUpperTypeGroup",
        payload: params
      });
    }
  };

  render() {
    const { loading, toolsType } = this.props;
    const { examineGroupData, groupData, myToolNameGroupData,upperToolsTypeData,upperToolsNameData, authorityGroupData } = toolsType;
    const { dataSourceExamine, total, pageNo, pageSize } = authorityGroupData;
    const { datas, dataSourceTool } = myToolNameGroupData;
    const { dataSource } = groupData;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="工具权限"
        breadcrumbList={[{ title: "应用中心" }, { title: "工具权限" }]}
      >

        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title="">
            <Form onSubmit={this.onSubmit} layout="inline">
              <Row className={styles.row}>
                <Col className={styles.col}>
                  <FormItem label="工具名称">
                    {getFieldDecorator("toolName", { initialValue: this.state.toolName ? this.state.toolName : undefined })(
                      <AutoComplete
                        placeholder="请输入"
                        onChange={this.getToolsDataByTime}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {upperToolsNameData
                          ? upperToolsNameData.map(
                            (value, index) => (
                              <Option value={value.toolName}>{value.toolName}</Option>
                            )
                          )
                          : ""}
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="工具类型">
                    {getFieldDecorator("toolTypeCode", { initialValue: this.state.toolTypeCode ? this.state.toolTypeCode : undefined })(
                      <Select placeholder="请选择" onChange={this.getToolsDataByTime} style={{ width: "100%" }}>
                        {upperToolsTypeData &&
                        upperToolsTypeData.toolsNameSource
                          ? upperToolsTypeData &&
                          upperToolsTypeData.toolsNameSource.map((value, index) => (
                            <Option value={value.code}>{value.name}</Option>
                          ))
                          : ""}
                      </Select>
                    )}
                  </FormItem>
                </Col>
                <Col className={styles.col}>
                  <FormItem label="状态">
                    {getFieldDecorator("overtStatus", { initialValue: this.state.status ? this.state.status : undefined })(
                      <Select placeholder="请选择" style={{ width: "100%" }}>
                        {getAuthorityToolStatus.map((value, index) => (
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
                columns={this.columns}
                dataSource={this.state.list}
                size="middle"
                /*  scroll={{ x: 1200 }}*/
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
