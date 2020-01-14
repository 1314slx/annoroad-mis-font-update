import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import FooterToolbar from "components/FooterToolbar";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem/index";
import JumpLink from "components/Button/JumpLink";
import { getItem, removeItem } from "../../../../utils/utils";
import { getToken } from "../../../../utils/authority";
import styles from "../style.less";
import config from "../../../../../config/index";

import {
  Card,
  Button,
  Row,
  Col,
  Form,
  Upload,
  Modal,
  Icon,
  Spin,
  message
} from "antd";

const FormItem = Form.Item;
const Dragger = Upload.Dragger;
const confirm = Modal.confirm;

import {
  getIndustry,
  getCustomerSource,
  getProjectType,
  getClientProperty,
  getIntegration,
  getCorporationIdCardType
} from "../../../../utils/options";

class NewEnterprise extends Component {
  constructor(props) {
    super(props);

    this._bascFileData = [];
    this._industryFileData = [];

    this.state = {
      loading: false,
      width: "100%",
      isShowBankDeposit: false, //是否显示开户银行许可证号
      required: true, //true 是提交  false 保存
      baseFilesList: [],
      industryFilesList: []
    };
  }

  componentDidMount() {
    this._getBusinessDetail();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "customer/clear"
    });
    removeItem("examineOrLook");
  }

  //如果是修改企业 先获取企业信息
  _getBusinessDetail() {
    const _id = this._getBusinessId();

    if (_id) {
      this.setState({ loading: true });
      const params = {
        no: _id,
        flag: true
      };
      this.props
        .dispatch({
          type: "customer/enterpriseDetail",
          payload: params
        })
        .then(() => {
          const baseFiles = this._getFileList(this._getParams("base_files"));
          const industryFiles = this._getFileList(
            this._getParams("industry_files")
          );
          this.setState({
            baseFilesList: baseFiles,
            industryFilesList: industryFiles,
            loading: false
          });
        });
    }
  }

  //修改时候对请求回来的 资料列表数据进行处理
  _getFileList(data) {
    if (data) {
      let _list = [];
      data.map((value, index) => {
        _list.push({
          uid: value.name + index,
          name: value.name,
          status: "done",
          path: value.path,
          url: config.urlHost + value.path
        });
      });
      return _list;
    }
    return [];
  }

  _setFileListStatus(data) {
    if (data) {
      data.map((value, index) => {
        if (value.status === "done") {
          value.status = 1;
        }
      });
    }
    return data;
  }

  //参数处理
  _getEnterpriseParams(value) {
    const _id = this._getBusinessId();
    return {
      ...value,
      no: _id ? _id : "",
      base_files: this._setFileListStatus(this.state.baseFilesList),
      industry_files: this._setFileListStatus(this.state.industryFilesList)
    };
  }

  ///提交 参数处理
  newEnterpriseHandler = e => {
    e.preventDefault();

    const { form } = this.props;

    //保存校验
    if (!this.state.required) {
      //TODO 保存只校验企业名字 获得所有参数
      //console.log(this.props.form.getFieldsValue())
      const fromData = form.getFieldsValue();
      const _name = fromData["name"];
      if (!_name) {
        message.error("请填写企业名称");
        return;
      }
      const values = this._getEnterpriseParams(fromData);
      this.submitHandler(values);
      return;
    }

    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      //如果需要对参数做处理单独写方法
      const values = this._getEnterpriseParams(fieldsValue);
      //console.log('新建企业提交信息:', values);

      this.submitHandler(values);
    });
  };

  //正经的提交方法
  submitHandler(values) {
    const { dispatch } = this.props;
    const _setSubmit = this.setSubmit();
    if (_setSubmit) {
      this.setState({ loading: true });
      const { url, desc } = _setSubmit;
      dispatch({
        type: url,
        payload: values
      }).then(() => {
        const { customer, dispatch } = this.props;
        this.setState({ loading: false });
        if (customer.submitStatus) {
          message.success(desc);

          setTimeout(() => {
            dispatch(routerRedux.push("/customer/business"));
          }, 1000);
        }
      });
    }
  }

  //提交  保存前设置  区分二者
  setSubmit() {
    const _basicData = this.state.baseFilesList;
    const _industryData = this.state.industryFilesList;
    let _url;
    let _desc;
    if (this.state.required) {
      console.log("提交");
      if (_basicData.length !== 0 || _industryData.length !== 0) {
        _url = "customer/submitEnterprise";
        _desc = "提交成功";
      } else {
        message.error("请上传文件");
        return false;
      }
    } else {
      console.log("保存");
      _url = "customer/saveEnterprise";
      _desc = "保存成功";
    }

    return { url: _url, desc: _desc };
  }

  whichClick = value => {
    //alert(value);
    let _required = true;
    if (value === "save") {
      _required = false;
    }
    this.setState({ required: _required });
  };

  //若企业属性为“机构”，显示开户银行许可证号	；若企业属性为“个人”、“自然人”，则不显示
  onChange = value => {
    let _flag = false;
    if (value === "1") {
      _flag = true;
    }
    this.setState({ isShowBankDeposit: _flag });
  };

  //设置layout
  //主要是区别第一个不需要偏移量
  getLayout(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      lg: { span: 8 },
      xl: { span: 7, offset: !value ? 1 : 0 }
    };
  }

  getTextAreaLayout() {
    return {
      xl: { span: 15 },
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 }
    };
  }

  //获取当前企业的列表信息
  //获取当前操作是  查看  还是  审核
  //传入参数判断返回  obj 还是 Boolean
  _getBusinessData(isObj) {
    const _examineOrLook = JSON.parse(getItem("examineOrLook"));
    const _flag = _examineOrLook ? _examineOrLook.examineOrLook : false;
    if (isObj) {
      return _examineOrLook;
    } else {
      return _flag;
    }
  }

  _getBusinessId() {
    const _data = this._getBusinessData(true);
    if (_data && _data.hasOwnProperty("businessId")) {
      return _data["businessId"];
    }
    return false;
  }

  onUploadChange = (type, info) => {
    const status = info.file.status;

    if (status === "done") {
      message.success(`${info.file.name} 上传成功.`);
    } else if (status === "error") {
      message.error(`${info.file.name} 上传失败.`);
    }

    let _fileData;
    if (type === "base_file") {
      _fileData = this._bascFileData;
    } else {
      _fileData = this._industryFileData;
    }

    //删除
    if (status === "removed") {
      if (type === "base_file") {
        _fileData = this.state.baseFilesList;
      } else {
        _fileData = this.state.industryFilesList;
      }

      _fileData.map((value, index) => {
        if (value.uid === info.file.uid) {
          _fileData.splice(index, 1);
        }
      });
      if (type === "base_file") {
        this._bascFileData = _fileData;
      } else {
        this._industryFileData = _fileData;
      }
      this._setList(type, _fileData);
    }

    let fileList = info.fileList;

    // 3. filter successfully uploaded files according to response from server
    fileList = fileList.filter(file => {
      if (file.response && file.response.code === "0000") {
        ///console.log('file:', file);
        file.path = file.response.body.path;
        file.status = 1;
        file.id = "";
      }
      return true;
    });

    this._setList(type, fileList);
  };
  onRemove = info => {
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

  _setList(type, data) {
    if (type === "industry_file") {
      this.setState({ industryFilesList: data });
    } else if (type === "base_file") {
      this.setState({ baseFilesList: data });
    }
  }

  _getParams(value) {
    const { customer } = this.props;
    const { enterpriseDetail } = customer;

    if (enterpriseDetail && enterpriseDetail.hasOwnProperty(value)) {
      return enterpriseDetail[value];
    }
    return undefined;
  }

  render() {
    const { form, loading, submitting } = this.props;

    const examineOrLook = this._getBusinessData();
    const _title = examineOrLook === "modify" ? "修改企业" : "新建企业";

    const props = {
      action: "/prm/mdlapi/prm/file/upload",
      name: "file_data",
      multiple: true,
      accept: ".rar ,.zip ,.doc, .docx ,.pdf, .jpg,.png",
      data: {
        token: getToken()
      },
      onRemove: this.onRemove
    };

    const basicData = (
      <Fragment>
        基础资料
        <span className={styles.basicSpan}>
          企业五证、公司章程、融资主体征信、场地租赁、品牌加盟、实际控制人身份证、
          户口本、结婚证、简历、征信，财务负责人简历等
        </span>
      </Fragment>
    );

    const industryData = (
      <Fragment>
        行业资料
        <span className={styles.industrySpan}>
          消防、卫生、食品、特种行业许可证等行业资质
        </span>
      </Fragment>
    );

    return (
      <PageHeaderLayout title={_title}>
        <Form onSubmit={this.newEnterpriseHandler}>
          <Spin spinning={this.state.loading}>
            <Card title="基本信息">
              {/*第1行*/}
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="企业名称"
                  initialValue={this._getParams("name")}
                  parameter="name"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="行业"
                  type="Select"
                  options={getIndustry}
                  initialValue={this._getParams("industry_type")}
                  parameter="industry_type"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="客户来源"
                  type="Select"
                  options={getCustomerSource}
                  initialValue={this._getParams("source_type")}
                  parameter="source_type"
                />
              </Row>
              {/*第2行*/}
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="项目类型"
                  type="Select"
                  options={getProjectType}
                  initialValue={this._getParams("project_type")}
                  parameter="project_type"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="客户属性"
                  type="Select"
                  options={getClientProperty}
                  onChange={this.onChange}
                  initialValue={this._getParams("property_type")}
                  parameter="property_type"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="是否三证合一"
                  type="Select"
                  options={getIntegration}
                  initialValue={this._getParams("idcard_type")}
                  parameter="idcard_type"
                />
              </Row>

              <Row>
                <ColFormItem
                  layout={this.getTextAreaLayout()}
                  form={form}
                  label="项目简介"
                  type="TextArea"
                  parameter="project_introduction"
                  initialValue={this._getParams("project_introduction")}
                  placeholder="请输入项目简介"
                />
              </Row>

              {/*第4行*/}
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="组织机构代码"
                  initialValue={this._getParams("organization_license_no")}
                  parameter="organization_license_no"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="营业执照号"
                  initialValue={this._getParams("business_license_no")}
                  parameter="business_license_no"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="税务登记证"
                  initialValue={this._getParams("tax_license")}
                  parameter="tax_license"
                />
              </Row>

              {/*第5行*/}
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="统一社会信用代码"
                  initialValue={this._getParams("social_credit_code")}
                  parameter="social_credit_code"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="机构信用代码"
                  required={false}
                  initialValue={this._getParams("credit_code")}
                  parameter="credit_code"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="开户银行许可证号"
                  required={false}
                  initialValue={this._getParams("bank_account_license_code")}
                  visible={this.state.isShowBankDeposit}
                  parameter="bank_account_license_code"
                />
              </Row>

              <Row>
                <ColFormItem
                  layout={this.getTextAreaLayout()}
                  form={form}
                  label="营业地址"
                  type="TextArea"
                  parameter="address"
                  initialValue={this._getParams("address")}
                  placeholder="请输入营业地址"
                />
              </Row>
            </Card>

            <Card title="法人代表信息" className={styles.cardMargin}>
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="姓名"
                  initialValue={this._getParams("corporation_name")}
                  parameter="corporation_name"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="证件类型"
                  type="Select"
                  initialValue={this._getParams("corporation_idcard_type")}
                  options={getCorporationIdCardType}
                  parameter="corporation_idcard_type"
                />

                <ColFormItem
                  layout={this.getLayout()}
                  form={form}
                  label="证件号"
                  initialValue={this._getParams("corporation_idcard_no")}
                  parameter="corporation_idcard_no"
                />
              </Row>
              <Row>
                <ColFormItem
                  layout={this.getLayout(1)}
                  form={form}
                  label="联系电话"
                  initialValue={this._getParams("corporation_mobile")}
                  parameter="corporation_mobile"
                />
              </Row>
            </Card>

            <Row className={styles.cardMargin}>
              <Col xl={{ span: 11 }} sm={24}>
                <Card title={basicData}>
                  <Dragger
                    {...props}
                    fileList={this.state.baseFilesList}
                    onChange={this.onUploadChange.bind(this, "base_file")}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      点击或将文件拖拽到这里上传
                    </p>
                    <p className="ant-upload-hint">
                      支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                    </p>
                  </Dragger>
                </Card>
              </Col>

              <Col xl={{ span: 11, offset: 2 }} sm={24}>
                <Card title={industryData}>
                  <Dragger
                    {...props}
                    fileList={this.state.industryFilesList}
                    onChange={this.onUploadChange.bind(this, "industry_file")}
                  >
                    <p className="ant-upload-drag-icon">
                      <Icon type="inbox" />
                    </p>
                    <p className="ant-upload-text">
                      点击或将文件拖拽到这里上传
                    </p>
                    <p className="ant-upload-hint">
                      支持扩展名：.rar .zip .doc .docx .pdf .jpg...
                    </p>
                  </Dragger>
                </Card>
              </Col>
            </Row>
          </Spin>
          <div style={{ height: "40px" }} />

          <FooterToolbar>
            <FormItem className={styles.btnBox}>
              <Button
                type="primary"
                htmlType="submit"
                onClick={this.whichClick.bind(this, "submit")}
                loading={submitting}
              >
                提交
              </Button>

              <Button
                htmlType="submit"
                onClick={this.whichClick.bind(this, "save")}
                loading={loading}
              >
                保存
              </Button>

              <JumpLink name="取消" link="/customer/business" />
            </FormItem>
          </FooterToolbar>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects["customer/saveEnterprise"],
  submitting: loading.effects["customer/submitEnterprise"]
}))(Form.create()(NewEnterprise));
