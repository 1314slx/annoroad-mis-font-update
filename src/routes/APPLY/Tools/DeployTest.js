import React, { Component } from "react";
import { connect } from "dva";
import {
  Card,
  Table,
  Row,
  Button,
  Pagination,
  Modal,
  Spin,
  Input,
  Form,
  message,
  Col,
  AutoComplete,
  Select,
  Divider, Icon
} from "antd";
import Search from "../../../components/Search/index";
/*import styles from "../style.less";*/
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
/*import ListQuery from 'components/ListQuery/index'; 接口调用*/
import ListQuery from "components/ListQuery";
import { deployTestColumns } from "../columns";
import ConfirmModal from "components/ConfirmModal";
import { timestamp } from "../../../utils/utils";
import config from "../../../../config";
import { routerRedux } from "dva/router";
const { TextArea } = Input;
import ColFormItem from "components/ColFormItem/index";
import {getOssClient} from '../../../utils/oss';
import { getDeployTestStatus } from "../../../utils/options";
const FormItem = Form.Item;
const { Option } = Select;
import styles from "./myTools.less";
const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
/**
 * 部署测试
 * */
@connect(({ deployTest, oss, loading }) => ({
  deployTest,oss,
  loading: loading.effects["deployTest/queryGroup"]
  //loading: loading.effects['customer/queryEnterprise']
}))
@Form.create()
export default class DeployTest extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      confirmLoading: false,
      visible: false,
      visibleRejectInfo: false,
      width: "100%",
      visible3: false,
      currentRecord: null,
      toolName:"",
      toolTypeCode:"",
      status:null,
      currentValue:"",
      myStyle:{}
    };
    this.columns = [
      ...deployTestColumns,
      {
        title: "操作",
        dataIndex: "action",
        render: this._handler
      }
    ];
    this.previousTime = 0;
  }

  _showModal(record){
    this.setState({
      visible3: true,
      currentRecord:record,
    });
  }

  handleOk = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };


  handleCancel = () => {
    this.setState({
      visible: false,
      visible3: false,
      visibleRejectInfo:false,
      currentValue:""
    });
  };


  componentDidMount() {
    this.getListData();
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 15
    };
    dispatch({
      type: "deployTest/queryToolsNameList",
      payload: params
    });
    dispatch({
      type: "deployTest/toolsTypeGroup",
      payload: params
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }

  }
  componentWillUnmount() {}
  setItemHeight = () => {
    let clientHeight = document.body.scrollHeight;
    // console.log("屏幕高度：",clientHeight)
    let setHeight = clientHeight-64-103-48+"px";
    // console.log("设置高度：",setHeight)
    let mystyle={
      minHeight: setHeight,
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }

  //提交
  onSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
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
        type: "deployTest/queryGroup",
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
    const value = {
      ...params,
      pageNo: params && params.page_no ? params.page_no : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "deployTest/queryGroup",
      payload: value
    });
  }

  /**
   * 下载脚本信息
   */
  downloadScript = (record) => {
    let client = getOssClient();
    if(client) {
      let url = client.signatureUrl("sys/tool/tmp/" + record.toolCode + "/" + record.script, { expires: 60480000, response: { "content-disposition": "attachment" }});
      // console.log("下载脚本信息",url)
      window.location.href = url;
      // window.location.href = ' http://annoroad-cloud-test.oss-cn-beijing.aliyuncs.com/%E7%A4%BA%E4%BE%8B%E6%95%B0%E6%8D%AE/tu.txt?OSSAccessKeyId=STS.NHWoZTUqU7rUdaUxUxihCtTyQ&Expires=1552358564&Signature=Sy7x2lOK%2FQOa5WRssxWaI6a%2Btcc%3D&security-token=CAISgwJ1q6Ft5B2yfSjIr4viJODguK50gLC%2BZkfknFUtZedvm5HSszz2IH1FfHdoBO8ftP8xn2pX7vsflqJ8RoN%2BWVf4ash96MyxW%2FQ3nc%2BT1fau5Jko1beXewHKeSOZsebWZ%2BLmNqS%2FHt6md1HDkAJq3LL%2Bbk%2FMdle5MJqP%2B%2FEFA9MMRVv6F3kkYu1bPQx%2FssQXGGLMPPK2SH7Qj3HXEVBjt3gb6wZ24r%2FtxdaHuFiMzg%2B46JdM%2B9uhf8T%2BPpY8bMsgAobp5oEsKPqdihw3wgNR6aJ7gJZD%2FTr6pdyHCzFTmU7bYrKKqoAwdVUiOPNgRPYZ8eKdnPt%2BvefXkJn724SM%2FWGcrJy1GoABkXAB9R%2BDqbN7khLneFPF%2FENXIpN2fSU%2F8yoxz7QqbaEIbkigW79BEgfsjWkCT3kGiYbMzpjCDgaOyCq6YaigZMvskmErT8HAhMvYLFaMg%2BYm2pZMQsDxWQmonoAYD6GsmJRUKEEXxY3IWGqjlmU7vM016qkMF%2Fwuc3cmChgzq%2Bs%3D';
    }
  };

  //提交审核确认
  _rollsOff(record) {
    this.setState({
      visible: true,
      currentRecord: record
    });
  }
//提交部署
  handleOkDeploy = e => {
    e.preventDefault();
    const _data = this.state.currentRecord;
    const _params = {
      code: _data.code,
      status: _data.status,
    };
      this.props
        .dispatch({
          type: "deployTest/submitDeployTest",
          payload: _params
        }).then(() => {
        const { SubmitDeployTestStatus } = this.props.deployTest;
        if(SubmitDeployTestStatus ==1) {
          message.success("操作成功！");
        }else if(SubmitDeployTestStatus ==2) {
          message.error("系统异常！");
        }else if(SubmitDeployTestStatus ==3) {
          message.error("参数错误！");
        }else if(SubmitDeployTestStatus ==4) {
          message.error("工具版本不存在！");
        }else if(SubmitDeployTestStatus ==5) {
          message.error("该工具版本未启动审核流程！");
        }
        this.setState({
          currentRecord: null,
          visible: false
        });
        setTimeout(() => {
          const params = {
            toolName:this.state.toolName,
            toolTypeCode:this.state.toolTypeCode,
            status:this.state.status,
          };
          this.getListData(params);
        }, 1000);
      });

      /*this.props.onOk(err, values);*/
  };
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
          type: "deployTest/rejectDeployTest",
          payload: _params
        }).then(() => {
          const { rejectDeployTestStatus } = this.props.deployTest;
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
          }
            this.setState({
              currentRecord: null,
              visible3: false
            });
            setTimeout(() => {
              const params = {
                toolName:this.state.toolName,
                toolTypeCode:this.state.toolTypeCode,
                status:this.state.status,
              };
              this.getListData(params);
            }, 1000);
          });

      /*this.props.onOk(err, values);*/
    });
  };


  handlerOk = () => {
    //手动触发submit按钮 把确定按钮替换成submit
    const submit = document.getElementById("submit");
    submit.click();
  };
  showModal = value => {
    this.setState({
      visibleRejectInfo:true,
      currentValue:value
    })
   /* confirm({
      title: 'Do you Want to delete these items?',
      content: 'Some descriptions',
      onOk() {
        console.log('OK');
      },
      onCancel() {
        console.log('Cancel');
      },
    });*/
  }
  //操作
  _handler = (text, record) => (
      <div className={styles.edit_word}>
        {/*<a onClick={this.info.bind(this, record.remarks)}>查看备注</a>*/}
        <a onClick={this.showModal.bind(this, record.remarks)}>查看备注</a>

        <Divider type="vertical" />
        <a onClick={this.downloadScript.bind(this, record)}>下载脚本</a>
        <Divider type="vertical" />
        <a type="primary" onClick={this._showModal.bind(this, record)}> 驳回  </a>

        <Divider type="vertical" />
        <a onClick={this._rollsOff.bind(this, record)}>提交审核</a>

      </div>
    );
  //弹出备注Modal
  info = value => {
    Modal.info({
      title: "备注",
      content: (
        <div>
          <p>{value}</p>
        </div>
      ),
      onOk() {}
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
  getToolsDataByTime = () => {
    // console.log("进来了");
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
        type: "deployTest/queryToolsNameList",
        payload: params
      });
      dispatch({
        type: "deployTest/toolsTypeGroup",
        payload: params
      });
    }
  }

  render() {
    const { deployTest, loading, form } = this.props;
    const { groupData, myToolNameGroupData, myToolTypeGroupData } = deployTest; // groupData 展示列表数据
    const { pageNo,pageSize, total, dataSource } = groupData; //dataSourceTool
    const { dataSourceTool } = myToolNameGroupData;
    const { getFieldDecorator } = form;
    let _list = [];
    if (dataSourceTool) {
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

    return (
      <PageHeaderLayout
        title="部署测试"
        breadcrumbList={[{title: "应用管理"},{title: "部署测试"}]}
      >
        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title=""  >
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
                      <Select placeholder="请选择" onChange={this.getToolsDataByTime} style={{ width: "100%" }}>

                        {myToolTypeGroupData.dataSource
                          ? myToolTypeGroupData &&
                          myToolTypeGroupData.dataSource.map((value, index) => (
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
                        {getDeployTestStatus.map((value, index) => (
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
               /* loading={loading}*/
                columns={this.columns}
                dataSource={dataSource}
                size="middle"
                pagination={false}
              />
              <Row type="flex" justify="end" className={styles.paginationBox}>
                <Pagination
                  showQuickJumper
                  pageSize={pageSize}
                  onChange={this.pagination}
                  defaultCurrent={pageNo}
                  total={total}
                />
              </Row>
            </Spin>
          </Card>
        </div>
        {/*驳回modal*/}
        <Modal
          visible={this.state.visible3}
          centered
          title="驳回"
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          bodyStyle={{padding:"24px 30px 24px 24px"}}
          className={styles.cancleModal}
          style={{ top: -14 }}
          destroyOnClose
          footer={
            <div>
              <Button  onClick={this.handleCancel}>取消</Button>
              <Button style={{background:"#ff0000",color:"#ffffff",border:0}}  onClick={this.handleOk}>驳回</Button>
            </div>
          }
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
          visible={this.state.visibleRejectInfo}
          title="备注"
          /* onOk={this.handleOk}*/
          onCancel={this.handleCancel}
          top={'35%'}
          style={{ top: 190 }}
          footer={[
            <Button type="primary" key="back" onClick={this.handleCancel}>知道了</Button>
          ]}
        >
          <p>{this.state.currentValue}</p>
        </Modal>

        {/*提交审核modal*/}
        <Modal
          visible={this.state.visible}
          onOk={this.handleOkDeploy}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          width={'400px'}
          style={{ top: 190 }}
          footer={
            <div>
              <Button onClick={this.handleCancel}>取消</Button>
              <Button type="primary" onClick={this.handleOkDeploy}>提交</Button>
            </div>
          }
        >
          <span style={{ fontWeight: "800" }}><Icon style={{color:"#FAAD14",fontSize:"22px",marginRight: "12px"}} type="exclamation-circle" theme="filled" />确认提交审核测试吗？</span>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
