import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { Link, routerRedux } from "dva/router";
import {
  Card,
  Row,
  Col,
  Button,
  Form,
  Input,
  DatePicker,
  Upload,
  Icon,
  message,
  Modal
} from "antd";

import { getItem, removeItem } from "../../../utils/utils";

import styles from "./Credit.less";

import FooterToolbar from "components/FooterToolbar";

const FormItem = Form.Item;
const RangePicker = DatePicker.RangePicker;
const Dragger = Upload.Dragger;
const confirm = Modal.confirm;

import moment from "moment";
import times from "../../../utils/time";
import { getToken } from "../../../utils/authority";
import config from "../../../../config/index";

class Create extends Component {
  /**
   * applyDetailStatus 的值
   * 1：调取本地缓存 singleData
   * 2：调取"授信申请详情查询"接口
   *
   * backUrlStatus 的值
   * 1：返回"授信管理"列表
   * 2：返回"授信申请"列表
   * @param props
   */

  constructor(props) {
    super(props);

    this.state = {
      fileArrayCredit: [],
      fileArrayReport: [],
      fileArrayBusiness: [],
      fileArraySuggest: []
    };
    this.fileArrayCredit = []; //授信决议表 一个
    this.fileArrayReport = []; //尽调报告 一个
    this.fileArrayBusiness = []; //业务资料 n个
    this.fileArraySuggest = []; //授信决议表 一个
  }

  //封装入参
  packageParams = param => {
    const params = {
      group_no: param && param.group_no,
      change_id: param && param.change_id ? param.change_id : ""
    };
    return params;
  };

  //封装详情页面查询
  packageDetail = () => {
    const { dispatch } = this.props;
    const singleData = JSON.parse(getItem("singleData"));
    const params = {
      ...this.packageParams(singleData)
    };

    dispatch({
      type: "credit/applyDetailCreditPage",
      payload: params
    }).then(() => {
      const { applyDetailCreditData } = this.props.credit;

      const defaultArrayReport = this.getFileList(
        applyDetailCreditData,
        "survey_report"
      );
      const defaultArrayBusiness = this.getFileList(
        applyDetailCreditData,
        "operation_information"
      );
      const defaultArraySuggest = this.getFileList(
        applyDetailCreditData,
        "final_submission"
      );
      const defaultArrayCredit = this.getFileList(
        applyDetailCreditData,
        "credit_decision"
      );
      this.setState({
        fileArrayReport: defaultArrayReport,
        fileArrayCredit: defaultArrayCredit,
        fileArrayBusiness: defaultArrayBusiness,
        fileArraySuggest: defaultArraySuggest
      });
    });
  };

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
          status: 1,
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
    /**
     * 当applyDetailStatus :1 的时候  是从"授信管理"的"授信" 按钮 点击进来的 走的是localstorage数据值
     * 当applyDetailStatus :2 的时候  是从"授信申请"的"修改授信" 按钮 点击进来的 走的是"授信申请详情接口"数组值
     */
    const { applyDetailStatus } = this.props.credit;
    if (applyDetailStatus === 2) {
      this.packageDetail();
    }
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
    const singleData = JSON.parse(getItem("singleData"));
    const { applyDetailStatus } = this.props.credit;

    if (applyDetailStatus === 1) {
      //创建授信 入参处理
      const createParams = {
        group_no: singleData && singleData.group_no,
        change_id:
          singleData && singleData.change_id ? singleData.change_id : "",
        all_limit: values.all_limit * 100,
        start_time: values.dateRange[0]._d.valueOf(),
        end_time: values.dateRange[1]._d.valueOf(),
        credit_decision: this.getCreateFileList(this.state.fileArrayCredit),
        survey_report: this.getCreateFileList(this.state.fileArrayReport),
        operation_information: this.getCreateFileList(
          this.state.fileArrayBusiness
        ),
        final_submission: this.getCreateFileList(this.state.fileArraySuggest)
      };
      return createParams;
    } else if (applyDetailStatus === 2) {
      //修改授信 入参处理
      const createParams = {
        group_no: singleData && singleData.group_no,
        change_id:
          singleData && singleData.change_id ? singleData.change_id : "",
        all_limit: values.all_limit * 100,
        start_time: values.dateRange[0]._d.valueOf(),
        end_time: values.dateRange[1]._d.valueOf(),
        credit_decision: this.getCreateFileList(this.state.fileArrayCredit),
        survey_report: this.getCreateFileList(this.state.fileArrayReport),
        operation_information: this.getCreateFileList(
          this.state.fileArrayBusiness
        ),
        final_submission: this.getCreateFileList(this.state.fileArraySuggest)
      };
      return createParams;
    }
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

        this.props
          .dispatch({
            type: "credit/submitCreditPage",
            payload: this.handleParams(values)
          })
          .then(() => {
            const { credit } = this.props;
            const {} = credit;
            if (credit.createStatus) {
              message.success("提交成功");
              setTimeout(() => {
                this.handleCancel();
              }, 1000);
            }
          });
      }
    });
  };

  //保存
  handleSave = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, values) => {
      if (!err) {
        dispatch({
          type: "credit/saveCreditPage",
          payload: this.handleParams(values)
        }).then(() => {
          const { credit } = this.props;
          if (credit.createStatus) {
            message.success("保存成功");
            setTimeout(() => {
              this.handleCancel();
            }, 1000);
          }
        });
      }
    });
  };

  //取消
  handleCancel = () => {
    const { backUrlStatus } = this.props.credit;
    if (backUrlStatus === 1) {
      this.props.history.push("/creditManage/credit");
    } else if (backUrlStatus === 2) {
      this.props.history.push("/creditManage/apply");
    }
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

  //删除文件 授信决议表
  onRemove = value => {
    return new Promise(function(resolve, reject) {
      confirm({
        title: "确定要删除文件?",
        onOk() {
          resolve(true);
        },
        onCancel() {
          reject(false);
        }
      });
    });
  };

  dataWitchNull = value => {
    const { applyDetailCreditData } = this.props.credit;
    if (applyDetailCreditData && applyDetailCreditData.hasOwnProperty(value)) {
      return applyDetailCreditData[value];
    }
    return null;
  };

  setDate = value => {
    const newValue = times.formatTimeEnglish(value);
    return newValue;
  };

  render() {
    const { form, submitting, credit } = this.props;
    const { applyDetailStatus } = credit;
    const { getFieldDecorator } = form;

    const singleData = JSON.parse(getItem("singleData"));

    const upLoadProps = {
      action: "/rm/mdlapi/rm/file/upload",
      multiple: true,
      showUploadList: true, //显示上传list
      accept: ".rar ,.zip ,.doc, .docx ,.pdf, .jpg,.png",
      name: "file_data",
      data: {
        token: getToken()
      },
      onRemove: this.onRemove
    };

    const dateFormat = "YYYY/MM/DD";

    return (
      <Fragment>
        <div className={styles.pageHeader}>
          <h2>授信</h2>
          <p>{singleData && singleData.name}</p>
        </div>
        <Form layout="vertical" hideRequiredMark onSubmit={this.handleSubmit}>
          <Card
            title="授信额度"
            className={styles.creditMoneyTitle}
            bordered={false}
          >
            <Row gutter={16}>
              <Col lg={6} md={12} sm={24}>
                {applyDetailStatus === 1 && (
                  <FormItem label="敞口额度">
                    {getFieldDecorator("all_limit", {
                      rules: [
                        {
                          required: true,
                          message: "请输入敞口额度"
                        }
                      ],
                      initialValue: this.dataWitchNull("all_limit")
                    })(
                      <Input
                        type="number"
                        className={styles.numberStyle}
                        placeholder="请输入敞口额度"
                      />
                    )}
                  </FormItem>
                )}
                {applyDetailStatus === 2 && (
                  <FormItem label="敞口额度">
                    {getFieldDecorator("all_limit", {
                      rules: [{ required: true, message: "请输入敞口额度" }],
                      initialValue: this.dataWitchNull("all_limit") / 100
                    })(
                      <Input
                        type="number"
                        className={styles.numberStyle}
                        placeholder="请输入敞口额度"
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col
                xl={{ span: 6, offset: 2 }}
                lg={{ span: 8 }}
                md={{ span: 12 }}
                sm={24}
              >
                {applyDetailStatus === 1 && (
                  <FormItem label="授信期限">
                    {getFieldDecorator("dateRange", {
                      rules: [{ required: true, message: "请选择生效日期" }]
                    })(
                      <RangePicker
                        placeholder={["开始日期", "结束日期"]}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormItem>
                )}
                {applyDetailStatus === 2 && (
                  <FormItem label="授信期限">
                    {getFieldDecorator("dateRange", {
                      rules: [{ required: true, message: "请选择生效日期" }],
                      initialValue: [
                        moment(
                          this.setDate(this.dataWitchNull("start_time")),
                          dateFormat
                        ),
                        moment(
                          this.setDate(this.dataWitchNull("end_time")),
                          dateFormat
                        )
                      ]
                    })(
                      <RangePicker
                        placeholder={["开始日期", "结束日期"]}
                        style={{ width: "100%" }}
                      />
                    )}
                  </FormItem>
                )}
              </Col>
              <Col
                xl={{ span: 8, offset: 2 }}
                lg={{ span: 10 }}
                md={{ pan: 24 }}
                sm={24}
              />
            </Row>
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
              提交
            </Button>
            <Button size="large" onClick={this.handleSave}>
              保存
            </Button>
            <Button size="large" onClick={this.handleCancel}>
              取消
            </Button>
          </FooterToolbar>
        </Form>
      </Fragment>
    );
  }
}

export default connect(({ credit, loading }) => ({
  credit,
  submitting: loading.effects["credit/submitCreditPage"]
}))(Form.create()(Create));
