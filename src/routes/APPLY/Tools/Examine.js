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
  Select, Modal, message, Icon, Spin
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
import styles from "./myTools.less";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { examineColumns } from "../columns";
import { getExamineToolStatus } from "../../../utils/options";
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 邮件模板管理
 * */
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/queryExamineGroup"]
}))
@Form.create()
export default class Examine extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      visible1:false,
      visible2:false,
      visible3:false,
      visible4:false,
      toolName:"",
      toolTypeCode:"",
      status:null,
      myStyle:{},
    };
    this.columns = [
      ...examineColumns,
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
  componentWillUnmount() {}
  //提交
  onSubmit = e => {
    e.preventDefault();

    const { dispatch, form } = this.props;

    form.validateFields((err, fieldsValue) => {
      this.setState({
        toolName:fieldsValue["toolName"],
        toolTypeCode:fieldsValue["toolTypeCode"],
        status:fieldsValue["status"]
      });

      if (err) return;

      const values = {
        ...fieldsValue
      };

      this.setState({
        formValues: values
      });
      dispatch({
        type: "toolsType/queryExamineGroup",
        payload: values
      });
    });
  };

  //重置
  handleFormReset = () => {
    this.setState({
      toolName:"",
      toolTypeCode:"",
      status:null,
    })
    const { form, dispatch } = this.props;
    form.resetFields();
    this.getListData();

  };



  //审核测试-上架-确认
  _upOff(record) {
    this.setState({
      visible3: true,
      currentRecord: record
    });
  }



  //审核测试-通过-确认
  _rollsOff(record) {
    if(record.status==7 || record.status==9 ){
      this.setState({
        visible2: false,
        visible3: true,
        currentRecord: record
      });
    }else if(record.status==8){
      this.setState({
        visible2: false,
        visible3: false,
        visible4: true,
        currentRecord: record
      });
    }else{
      this.setState({
        visible2: true,
        visible3: false,
        currentRecord: record
      });
    }

  }

  //审核测试-通过
  handleOkDeploy = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const _params = {
        code: _data.code,
        status: _data.status,
      };
      this.props
        .dispatch({
          type: "toolsType/submitToolsType",
          payload: _params
        }).then(() => {
        const { saveSubmitToolsTypeStatus } = this.props.toolsType;
        if(saveSubmitToolsTypeStatus ==1) {
          message.success("操作成功！");
        }else if(saveSubmitToolsTypeStatus ==2) {
          message.error("参数错误！");
        }else if(saveSubmitToolsTypeStatus ==3) {
          message.error("工具版本不存在！");
        }else if(saveSubmitToolsTypeStatus ==4) {
          message.error("该工具版本未启动审核流程！");
        }else if(saveSubmitToolsTypeStatus ==5) {
          message.error("系统异常！");
        }
        this.setState({
          currentRecord: null,
          visible1: false,
          visible2: false,
          visible3: false,
          visible4: false,
        });
        setTimeout(() => {
          const params = {
            toolName:this.state.toolName,
            toolTypeCode:this.state.toolTypeCode,
            status:this.state.status,
            // pageNo: pageNumber
          };
          this.getListData(params);
        }, 1000);
      });

      /*this.props.onOk(err, values);*/
    });
  };
  //审核测试-下架
  handleOkDownDeploy = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const _params = {
        code: _data.code,
        reason: _data.reason,
      };
      this.props
        .dispatch({
          /*type: "toolsType/submitToolsType",*/
          type: "toolsType/downToolsType",
          payload: _params
        }).then(() => {
        const { rejectDeployTestStatus } = this.props.toolsType;
        if(rejectDeployTestStatus ==1) {
          message.success("操作成功！");

        }else  if(rejectDeployTestStatus ==2) {
          message.error("参数错误！");
        }else  if(rejectDeployTestStatus ==3) {
          message.error("工具版本不存在！");
        }else  if(rejectDeployTestStatus ==4) {
          message.error("当前状态不允许该操作！");
        }else  if(rejectDeployTestStatus ==5) {
          message.error("该工具版本未启动审核流程！");
        }else  if(rejectDeployTestStatus ==6) {
          message.error("系统异常！");
        }
        this.setState({
          currentRecord: null,
          visible1: false,
          visible2: false,
          visible3: false,
          visible4: false,
        });
        setTimeout(() => {
          const params = {
            toolName:this.state.toolName,
            toolTypeCode:this.state.toolTypeCode,
            status:this.state.status,
            // pageNo: pageNumber
          };
          this.getListData(params);
        }, 1000);
      });

    });
  };
//驳回操作
  _showModal(record){
    this.setState({
      visible1: true,
      currentRecord:record,
    });
  }
  //驳回操作-确定
  handleOk = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };
  //取消操作
  handleCancel = () => {
    this.setState({
      visible: false,
      visible1: false,
      visible2: false,
      visible3: false,
      visible4: false,
    });
  };

  //驳回操作
  //提交驳回操作
  handleSubmit = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      const _params = {
        code: _data.code,
        reason:values.reason
      };
      this.props
        .dispatch({
          type: "toolsType/rejectExamineGroup",//toolsType/queryExamineGroup
          payload: _params
        }).then(() => {
        const { rejectDeployTestStatus } = this.props.toolsType;

        if(rejectDeployTestStatus ==1) {
          message.success("操作成功！");

        }else  if(rejectDeployTestStatus ==2) {
          message.error("参数错误！");
        }else  if(rejectDeployTestStatus ==3) {
          message.error("工具版本不存在！");
        }else  if(rejectDeployTestStatus ==4) {
          message.error("当前状态不允许该操作！");
        }else  if(rejectDeployTestStatus ==5) {
          message.error("该工具版本未启动审核流程！");
        }else  if(rejectDeployTestStatus ==6) {
          message.error("系统异常！");
        }
        this.setState({
          currentRecord: null,
          visible1: false
        });
        setTimeout(() => {
          const params = {
            toolName:this.state.toolName,
            toolTypeCode:this.state.toolTypeCode,
            status:this.state.status,
          };
          console.log("提交参数:",params)
          this.getListData(params);
        }, 1000);
      });

    });
  };



  _handler = (text, record) => {
    if (record.status == 5) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>测试</a>
          <Divider type="vertical" />
          <a onClick={this._rollsOff.bind(this, record)}>通过</a>
          <Divider type="vertical" />
          <a type="primary" onClick={this._showModal.bind(this, record)}> 驳回  </a>


        </div>
      );
    } else if (record.status == 7 || record.status == 9) {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>测试</a>
          <Divider type="vertical" />
          {/*<a>上架</a>{" "}*/}
          {/*<a onClick={this._rollsOff.bind(this, record)}>上架</a>*/}
          <a onClick={this._rollsOff.bind(this, record)}>上架</a>

        </div>
      );
    } else {
      return (
        <div>
          <a onClick={() =>this.preview(record.code,record.status)}>测试</a>
          <Divider type="vertical" />
          <a onClick={this._rollsOff.bind(this, record)}>下架</a>
        </div>
      );
    }
  };

  /**
   * 工具测试
   */
  preview = (code,status) => {
    sessionStorage.setItem("examine_c_status",status);
    //console.log("status:",status);
    this.props.dispatch(routerRedux.push({
      pathname:"/apply/tool/test",
      query:{
        //code: "4e93e144c1fe486f8efe47ee5d1df717",
        code: code,
        interactive: true
      }
    }))
  }




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
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "toolsType/queryExamineGroup",
      payload: value
    });
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
    const { loading, toolsType } = this.props;
    const { examineGroupData, groupData, myToolNameGroupData } = toolsType;
    const { dataSourceExamine ,total,pageNo,pageSize} = examineGroupData;
    const { datas, dataSourceTool } = myToolNameGroupData;
    const { dataSource } = groupData;

    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="审核测试"
        breadcrumbList={[{title: "应用管理"},{title: "审核测试"}]}
      >

        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title="" >
            <Form onSubmit={this.onSubmit} layout="inline">
              <Row className={styles.row}>
                <Col className={styles.col}>
                  <FormItem label="工具名称">
                    {getFieldDecorator("toolName", { initialValue: this.state.toolName ? this.state.toolName : undefined})(
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
                      <Select placeholder="请选择"  onChange={this.getToolsDataByTime}  style={{ width: "100%" }}>
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
                        {getExamineToolStatus.map((value, index) => (
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
                dataSource={dataSourceExamine}
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
        <Modal
          visible={this.state.visible1}
          centered
          title="驳回"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          destroyOnClose
          // okText="驳回"
          // cancelText="取消"
          style={{ top: -34 }}
          footer={
            <div>
              <Button  onClick={this.handleCancel}>取消</Button>
              <Button style={{background:"#ff0000",color:"#ffffff",border:0}}  onClick={this.handleOk}>驳回</Button>
            </div>
          }
          className={styles.cancleModal}
        >
          <Form
            onSubmit={this.handleSubmit}
            hideRequiredMark
            style={{ minHeight: "100px" }}
          >
            <ColFormItem
              formItemLayout={formItemLayout}
              layout={{ span: 24 }}
              form={this.props.form}
              label="问题描述"
              type="TextArea"
              parameter="reason"
              required={true}
              textSize={{ minRows: 7, maxRows: 7 }}
              placeholder="问题描述便于工具负责人快速定位问题原因"
            />
            <Button
              id="submit"
              style={{ display: "none" }}
              type="primary"
              htmlType="submit"
            />
          </Form>
        </Modal>

        <Modal
          visible={this.state.visible2}
          onOk={this.handleOkDeploy}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          width={"400px"}
          style={{ top: 190 }}
          footer={
            <div>
              <Button  onClick={this.handleCancel}>取消</Button>
              <Button type={"primary"} onClick={this.handleOkDeploy}>通过</Button>
            </div>
          }
        >
          <span style={{ fontWeight: "800" }}><Icon style={{color:"#FAAD14",fontSize:"22px",marginRight: "12px"}} type="exclamation-circle" theme="filled" />确定审核通过吗？<span style={{color:"#ff0000",fontWeight:"400"}}>当前操作不可逆！</span></span>
        </Modal>

        <Modal
          visible={this.state.visible3}
          onOk={this.handleOkDeploy}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          width={"400px"}
          style={{ top: 190 }}
          footer={
            <div>
              <Button  onClick={this.handleCancel}>取消</Button>
              <Button type={"primary"} onClick={this.handleOkDeploy}>上架</Button>
            </div>
          }
        >
          <span style={{ fontWeight: "800" }}><Icon style={{color:"#FAAD14",fontSize:"22px",marginRight: "12px"}} type="exclamation-circle" theme="filled" />确认上架吗？</span>
        </Modal>
        <Modal
          visible={this.state.visible4}
          onOk={this.handleOkDownDeploy}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          width={"400px"}
          style={{ top: 190 }}
          footer={
            <div>
              <Button  onClick={this.handleCancel}>取消</Button>
              <Button type={"primary"} onClick={this.handleOkDownDeploy}>下架</Button>
            </div>
          }
        >
          <span style={{ fontWeight: "800" }}><Icon style={{color:"#FAAD14",fontSize:"22px",marginRight: "12px"}} type="exclamation-circle" theme="filled" />确认下架吗？</span>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
