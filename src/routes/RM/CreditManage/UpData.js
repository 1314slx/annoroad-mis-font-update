import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Upload,
  Icon,
  message,
  Modal
} from "antd";

import FooterToolbar from "components/FooterToolbar";
import config from "../../../../config";
import { getItem, removeItem } from "../../../utils/utils";

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const confirm = Modal.confirm;

import times from "../../../utils/time";
import { getToken } from "../../../utils/authority";
import money from "../../../utils/money";

import styles from "./Credit.less";

class UpData extends Component {
  constructor(props) {
    super(props);

    this.state = {
      fileArrayCredit: [],
      fileArrayReport: [],
      fileArrayBusiness: [],
      fileArraySuggest: [],
      statusType: 1, //1.有效  2.历史文件  3.无效

      loading: false,
      visible: false
    };
    this.fileArrayCredit = []; //授信决议表 一个
    this.fileArrayReport = []; //尽调报告 一个
    this.fileArrayBusiness = []; //业务资料 n个
    this.fileArraySuggest = []; //授信决议表 一个

    this.historyType = null;
    this.currentRemoveData = null;
  }

  //上传文件返回值格式处理
  getFileList(data, value) {
    let list = [];
    if (data && data.hasOwnProperty(value)) {
      //判断是否是数组
      data[value].map((value, index) => {
        list.push({
          ...value,
          uid: value.name + index,
          name: value.name,
          status: "done",
          path: value.path,
          create_time: value.create_time,
          url: config.urlHost + value.path
        });
      });
    }
    return list;
  }

  //上传文件返回值格式处理
  getCreateFileList(data) {
    if (data) {
      let list = [];
      data.map((value, index) => {
        list.push({
          uid: value.uid,
          name: value.name,
          status: value.status == "done" ? 1 : value.status,
          path: value.path,
          create_time: value.create_time,
          url: config.urlHost + value.path
        });
      });
      return list;
    }
    return [];
  }

  //当当前页面加载完成的时候执行的事件
  componentDidMount() {
    const { dispatch } = this.props;
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      group_no: singleData && singleData.group_no,
      change_id: singleData && singleData.change_id ? singleData.change_id : ""
    };

    dispatch({
      type: "credit/infoDetailCreditPage",
      payload: params
    }).then(() => {
      const { creditDetailData } = this.props.credit;

      const defaultArrayReport = this.getFileList(
        creditDetailData,
        "survey_report"
      );
      const defaultArrayBusiness = this.getFileList(
        creditDetailData,
        "operation_information"
      );
      const defaultArraySuggest = this.getFileList(
        creditDetailData,
        "final_submission"
      );
      const defaultArrayCredit = this.getFileList(
        creditDetailData,
        "credit_decision"
      );
      this.setState({
        fileArrayReport: defaultArrayReport,
        fileArrayCredit: defaultArrayCredit,
        fileArrayBusiness: defaultArrayBusiness,
        fileArraySuggest: defaultArraySuggest
      });
    });
  }

  //当离开当前页面的时候执行的事件
  componentWillUnmount() {
    //当离开当前页面的时候 删除从上一个页面活的单条公司信息
    removeItem("singleData");

    //当离开当前页面的时候 删除从授信审核详情页面
    // this.props.credit.applyDetailCreditData = [];
    this.props.dispatch({
      type: "credit/clear"
    });
  }

  handleParams = values => {
    const { creditDetailData } = this.props.credit;
    //创建授信 入参处理
    const createParams = {
      group_no: creditDetailData && creditDetailData.group_no,
      // change_id: creditDetailData && creditDetailData.change_id ? creditDetailData.change_id : '',
      all_limit: creditDetailData.all_limit,
      start_time: creditDetailData.start_time,
      end_time: creditDetailData.end_time,
      credit_decision: this.getCreateFileList(this.state.fileArrayCredit),
      survey_report: this.getCreateFileList(this.state.fileArrayReport),
      operation_information: this.getCreateFileList(
        this.state.fileArrayBusiness
      ),
      final_submission: this.getCreateFileList(this.state.fileArraySuggest)
    };
    return createParams;
  };

  //提交
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.fileArrayCredit.length === 0) {
          message.info("请上传授信决议表");
          return false;
        }
        if (this.state.fileArrayReport.length === 0) {
          message.info("请上传尽调报告");
          return false;
        }
        if (this.state.fileArrayBusiness.length === 0) {
          message.info("业务资料");
          return false;
        }
        if (this.state.fileArraySuggest.length === 0) {
          message.info("请上传终审意见书");
          return false;
        }
        // console.log('-----最终提交的入参数据---', this.handleParams(values));
        this.props
          .dispatch({
            type: "credit/upDataCreditPage",
            payload: this.handleParams(values)
          })
          .then(() => {
            message.success("提交成功");
            setTimeout(() => {
              this.handleCancel();
            }, 1000);
          });
      }
    });
  };

  //取消
  handleCancel = () => {
    this.props.history.push("/creditManage/credit");
  };

  setList(type, data) {
    if (type === "credit_decision") {
      this.setState({ fileArrayCredit: data });
    } else if (type === "survey_report") {
      this.setState({ fileArrayReport: data });
    } else if (type === "operation_information") {
      this.setState({ fileArrayBusiness: data });
    } else if (type === "final_submission") {
      this.setState({ fileArraySuggest: data });
    }
  }

  //当文件发生改变是操作
  handleOnChange = (type, info) => {
    console.log("-=-=-=-:type", type);
    console.log("-=-=-=-:onchange", info);
    console.log("-=-=-=-:status", info.file.status);

    /**
     * credit_decision   survey_report      operation_information    final_submission
     * fileArrayCredit   fileArrayReport    fileArrayBusiness        fileArraySuggest
     */

    const upload_status = info.file.status;
    const upload_name = info.file.name;
    const fileNumber = info.fileList.length;

    if (upload_status === "done") {
      message.success(`${upload_name} 上传成功！`);
    } else if (upload_status === "error") {
      message.error(`${upload_name} 上传失败！`);
    }

    let fileData;
    if (type === "credit_decision") {
      if (fileNumber > 1) {
        message.error(`只能上传一张`);
        return false;
      } else {
        fileData = this.fileArrayCredit;
      }
    } else if (type === "survey_report") {
      if (fileNumber > 1) {
        message.error(`只能上传一张`);
        return false;
      } else {
        fileData = this.fileArrayReport;
      }
    } else if (type === "operation_information") {
      fileData = this.fileArrayBusiness;
    } else if (type === "final_submission") {
      if (fileNumber > 1) {
        message.error(`只能上传一张`);
        return false;
      } else {
        fileData = this.fileArraySuggest;
      }
    }

    if (upload_status === "removed") {
      if (type === "credit_decision") {
        fileData = this.state.fileArrayCredit;
      } else if (type === "survey_report") {
        fileData = this.state.fileArrayReport;
      } else if (type === "operation_information") {
        fileData = this.state.fileArrayBusiness;
      } else if (type === "final_submission") {
        fileData = this.state.fileArraySuggest;
      }

      fileData.map((value, index) => {
        if (value.uid === info.file.uid) {
          fileData.splice(index, 1);
        }
      });

      if (type === "credit_decision") {
        this.fileArrayCredit = fileData;
      } else if (type === "survey_report") {
        this.fileArrayReport = fileData;
      } else if (type === "operation_information") {
        this.fileArrayBusiness = fileData;
      } else if (type === "final_submission") {
        this.fileArraySuggest = fileData;
      }

      this.setList(type, fileData);
    }

    // 3. filter successfully uploaded files according to response from server
    let fileList = info.fileList;
    fileList = fileList.filter(file => {
      if (file.response && file.response.code === "0000") {
        file.id = "";
        file.uid = file.uid;
        file.status = 1;
        file.name = file.name;
        file.path = file.response.body.path;
        file.create_time = file.response.body.create_time;
      }
      return true;
    });

    this.setList(type, fileList);
  };

  //点击删除文件叉号
  onRemove = (type, value) => {
    this.historyType = type;
    this.currentRemoveData = value;

    //打开提示框
    this.setState({
      visible: true
    });
    return false;
  };

  getRemoveFileList = () => {
    switch (this.historyType) {
      case "credit_decision":
        return this.state.fileArrayCredit;
      case "survey_report":
        return this.state.fileArrayReport;
      case "operation_information":
        return this.state.fileArrayBusiness;
      case "final_submission":
        return this.state.fileArraySuggest;
    }
  };

  handleOk = type => {
    let _status = 1;
    if (type === "history_save") {
      //当存为历史版本
      _status = 2;
    } else if (type === "file_remove") {
      //删除文档
      _status = 3;
    }

    const fileListData = this.getRemoveFileList();
    fileListData.map((value, index) => {
      if (value.uid === this.currentRemoveData.uid) {
        value.status = _status;
      }
    });

    setTimeout(() => {
      this.setState({ visible: false });
    }, 1000);
  };

  handleFileCancel = () => {
    this.setState({ visible: false });
  };

  render() {
    const { submitting, credit } = this.props;
    const { creditDetailData } = credit;
    const { visible, loading } = this.state;
    const upLoadProps = {
      action: "/rm/mdlapi/rm/file/upload",
      multiple: true,
      showUploadList: true, //显示上传list
      accept: ".rar ,.zip ,.doc, .docx ,.pdf, .jpg,.png",
      name: "file_data",
      data: {
        token: getToken()
      }
    };

    return (
      <Fragment>
        <div className={styles.pageHeader}>
          <h2>更新附件信息</h2>
        </div>
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
          <Card
            title="授信额度"
            className={styles.creditMoneyTitle}
            bordered={false}
          >
            {creditDetailData && (
              <Row gutter={16}>
                <Col lg={6} md={12} sm={24}>
                  <b>企业名称：</b>
                  <span>{creditDetailData.name}</span>
                </Col>
                <Col
                  xl={{ span: 6, offset: 2 }}
                  lg={{ span: 8 }}
                  md={{ span: 12 }}
                  sm={24}
                >
                  <b>敞口额度：</b>
                  <span>{money.formatMoney(creditDetailData.all_limit)}</span>
                </Col>
                <Col
                  xl={{ span: 8, offset: 2 }}
                  lg={{ span: 10 }}
                  md={{ pan: 24 }}
                  sm={24}
                >
                  <b>授信期限：</b>
                  <span>
                    {times.formatTime(creditDetailData.start_time)} ~{" "}
                    {times.formatTime(creditDetailData.end_time)}
                  </span>
                </Col>
              </Row>
            )}
          </Card>
          <Row gutter={16} className={styles.partSecond}>
            <Col lg={12} md={12} sm={24}>
              <Card
                title="授信决议表"
                className={styles.cardBox}
                bordered={false}
              >
                <Dragger
                  {...upLoadProps}
                  onChange={this.handleOnChange.bind(this, "credit_decision")}
                  onRemove={this.onRemove.bind(this, "credit_decision")}
                  fileList={this.state.fileArrayCredit}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Card>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Card
                title="尽调报告"
                className={styles.cardBox}
                bordered={false}
              >
                <Dragger
                  {...upLoadProps}
                  onChange={this.handleOnChange.bind(this, "survey_report")}
                  onRemove={this.onRemove.bind(this, "survey_report")}
                  fileList={this.state.fileArrayReport}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Card>
            </Col>
          </Row>
          <Row gutter={16} className={styles.partSecond}>
            <Col lg={12} md={12} sm={24}>
              <Card
                title="业务资料"
                className={styles.cardBox}
                bordered={false}
              >
                <span className={styles.paragraph}>
                  经营数据、财务报表、资产负债信息等...
                </span>
                <Dragger
                  {...upLoadProps}
                  onChange={this.handleOnChange.bind(
                    this,
                    "operation_information"
                  )}
                  onRemove={this.onRemove.bind(this, "operation_information")}
                  fileList={this.state.fileArrayBusiness}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Card>
            </Col>
            <Col lg={12} md={12} sm={24}>
              <Card
                title="终审意见书"
                className={styles.cardBox}
                bordered={false}
              >
                <Dragger
                  {...upLoadProps}
                  onChange={this.handleOnChange.bind(this, "final_submission")}
                  onRemove={this.onRemove.bind(this, "final_submission")}
                  fileList={this.state.fileArraySuggest}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Card>
            </Col>
          </Row>
          <FooterToolbar>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={submitting}
            >
              保存
            </Button>
            <Button size="large" onClick={this.handleCancel}>
              取消
            </Button>
          </FooterToolbar>
        </Form>

        <Modal
          visible={visible}
          title="文件操作"
          onCancel={this.handleFileCancel}
          footer={[
            <Button key="back" onClick={this.handleFileCancel}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={this.handleOk.bind(this, "history_save")}
            >
              存为历史版本
            </Button>,
            <Button
              key="remove"
              onClick={this.handleOk.bind(this, "file_remove")}
            >
              作废此文档
            </Button>
          ]}
        />
      </Fragment>
    );
  }
}

export default connect(({ credit, loading }) => ({
  credit,
  submitting: loading.effects["credit/queryCreditPage"]
}))(Form.create()(UpData));
