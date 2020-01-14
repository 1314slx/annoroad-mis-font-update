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
import { getToken } from "../../../utils/authority";
import { getItem, removeItem } from "../../../utils/utils";

import styles from "./Contract.less";
import config from "../../../../config";

const Dragger = Upload.Dragger;
const confirm = Modal.confirm;

class UpData extends Component {
  /**
   * detailStatus值：
   * 1.调取"协议详情查询"接口
   * 2.不调取"协议详情查询"接口
   * @param props
   */

  constructor(props) {
    super(props);
    this.state = {
      fileArrayProtocol: []
    };
    this.fileArrayProtocol = [];
  }

  //封装入参
  packageParams = param => {
    const params = {
      group_id: param && param.group_id,
      change_id: param && param.change_id ? param.change_id : ""
    };
    return params;
  };

  //封装协议详情查询
  packageDetail = () => {
    const singleData = JSON.parse(getItem("singleData"));
    const { dispatch } = this.props;
    const params = {
      ...this.packageParams(singleData)
    };
    dispatch({
      type: "contract/detailContractPage",
      payload: params
    }).then(() => {
      const { detailData } = this.props.contract;
      const defaultArrayProtocol = this.getFileList(
        detailData,
        "protocol_list"
      );
      this.setState({
        fileArrayProtocol: defaultArrayProtocol
      });
    });
  };

  //上传文件返回值格式处理
  getFileList(data, value) {
    let list = [];
    if (data && data.hasOwnProperty(value)) {
      //判断是否是数组
      data[value].map((value, index) => {
        // console.log(value);
        list.push({
          ...value,
          uid: value.name + index,
          name: value.name,
          status: "done",
          path: value.url,
          create_time: value.create_time,
          url: config.urlHost + value.url
        });
      });
    }
    return list;
  }

  //页面加载完或者刷新完出发
  componentDidMount() {
    const { detailStatus } = this.props.contract;
    if (detailStatus === 2) {
      this.packageDetail();
    }
  }

  //当离开当前页面的时候执行
  componentWillUnmount() {
    //当离开当前页面的是 从上一个页面活的单条公司信息
    removeItem("singleData");
  }

  //上传文件返回值格式处理
  getContractFileList(data) {
    if (data) {
      let list = [];
      data.map((value, index) => {
        list.push({
          uid: value.uid,
          name: value.name,
          status: 1,
          path: value.path,
          create_time: value.create_time,
          url: value.path
        });
      });
      return list;
    }
    return [];
  }

  //处理入参
  handleParams = value => {
    const singleData = JSON.parse(getItem("singleData"));
    // const {detailStatus} = this.props.contract;
    const params = {
      user_id: 1111,
      user_name: "admin",
      group_id: singleData && singleData.group_id,
      change_id: singleData && singleData.change_id ? singleData.change_id : "",
      protocol_list: this.getContractFileList(this.state.fileArrayProtocol)
    };
    return params;
  };

  //提交
  handleSubmit = e => {
    e.preventDefault();

    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.fileArrayProtocol.length === 0) {
          message.info("请上传协议");
          return false;
        }

        // console.log('---submit--params:', this.handleParams(values));
        this.props
          .dispatch({
            type: "contract/submitContractPage",
            payload: this.handleParams(values)
          })
          .then(() => {
            const { contract } = this.props;
            if (contract.createStatus) {
              message.success("操作完成");
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
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.fileArrayProtocol.length === 0) {
          message.info("请上传协议");
          return false;
        }
        // console.log('---save--params:', this.handleParams(values));
        this.props
          .dispatch({
            type: "contract/saveContractPage",
            payload: this.handleParams(values)
          })
          .then(() => {
            const { contract } = this.props;
            if (contract.createStatus) {
              message.success("操作完成");
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
    this.props.history.push("/contractManage/contract");
  };

  setList(type, data) {
    if (type === "protocol_list") {
      this.setState({ fileArrayProtocol: data });
    }
  }

  //当上传文件发生改变的时候出发
  handleChange = (type, info) => {
    console.log("-=-=-=-:type", type);
    console.log("-=-=-=-:onchange", info);
    console.log("-=-=-=-:status", info.file.status);

    /**
     * protocol_list
     * fileArrayProtocol
     */

    const upload_status = info.file.status;
    const upload_name = info.file.name;
    if (upload_status === "done") {
      message.success(`${upload_name} 上传成功！`);
    } else if (upload_status === "error") {
      message.error(`${upload_name} 上传失败！`);
    }

    let fileData;
    if (type === "protocol_list") {
      fileData = this.fileArrayProtocol;
    }
    if (upload_status === "removed") {
      if (type === "protocol_list") {
        fileData = this.state.fileArrayProtocol;
      }
      fileData.map((value, index) => {
        if (value.uid === info.file.uid) {
          fileData.splice(index, 1);
        }
      });
      if (type === "protocol_list") {
        this.fileArrayProtocol = fileData;
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

  //删除文件的时候出发
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

  render() {
    const { submitting } = this.props;
    const { fileArrayProtocol } = this.state;
    const singleData = JSON.parse(getItem("singleData"));

    const upLoadProps = {
      action: "/rm/mdlapi/rm/file/upload",
      multiple: false,
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
          {singleData && singleData.source_status === 1 && <h2>上传协议111</h2>}
          {singleData &&
            (singleData.source_status === 4 ||
              singleData.source_status === 5) && <h2>修改协议222</h2>}
          <p>{singleData && singleData.group_name}</p>
        </div>
        <Form layout="vertical" onSubmit={this.handleSubmit}>
          <Card title="框架协议" bordered={false} className={styles.partSecond}>
            <Row gutter={16}>
              <Col lg={12} md={12} sm={24}>
                <Dragger
                  {...upLoadProps}
                  onRemove={this.onRemove.bind(this, "protocol_list")}
                  onChange={this.handleChange.bind(this, "protocol_list")}
                  fileList={fileArrayProtocol}
                >
                  <p className="ant-upload-drag-icon">
                    <Icon type="inbox" />
                  </p>
                  <p className="ant-upload-text">点击或将文件拖拽到这里上传</p>
                  <p className="ant-upload-hint">
                    支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                  </p>
                </Dragger>
              </Col>
              <Col lg={12} md={12} sm={24} />
            </Row>
          </Card>
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

export default connect(({ contract, loading }) => ({
  contract,
  submitting:
    loading.effects[
      ("contract/submitContractPage", "contract/queryContractPage")
    ]
}))(Form.create()(UpData));
