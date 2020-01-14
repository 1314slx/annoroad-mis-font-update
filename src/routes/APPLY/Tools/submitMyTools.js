import React, { Component, Fragment } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {
  Button,
  Card,
  Col,
  Form,
  Icon,
  message,
  Row,
  Spin,
  Upload,
  Input,
  Modal,
  Table, Divider
} from "antd";
import styles from "../myTools.less";
import { getItem, removeItem, uploadPath } from "../../../utils/utils";
import { codeMark } from "../../../utils/options";
import { getOssClient } from "../../../utils/oss";
import FooterToolbar from "components/FooterToolbar";
import JumpLink from "components/Button/JumpLink";

const FormItem = Form.Item;
const InputGroup = Input.Group;
import ColFormItem from "components/ColFormItem/index";
import ScriptUpload from "../../../components/upload/ScriptUpload";
import ImageUpload from "../../../components/upload/ImageUpload";
import Editor from "wangeditor";
import NewInputFile from "./ParamsFile/NewInputFile";
import NewInputFolder from "./ParamsFile/NewInputFolder";
import NewTextFile from "./ParamsFile/NewTextFile";
import NewRadioFile from "./ParamsFile/NewRadioFile";
import NewOutputFile from "./ParamsFile/NewOutputFile";
import NewSelectFile from "./ParamsFile/NewSelectFile";
import NewMulSelectFile from "./ParamsFile/NewMulSelectFile";
import request from "../../../utils/request";
import { editMyToolsColumns } from "../columns";
import { CHECK_TWO_NUM } from "../../../utils/pattern";
import { setToken } from "../../../utils/authority";
import { CHECK_WORD_FORTY, CHECK_WORD_FORTYHUND, CHECK_WORD_ThIRTY } from "../../../utils/pattern";
import { routerRedux } from "dva/router";

const formItemLayout = {
  labelCol: {
    span: 4
  },
  wrapperCol: {
    span: 20
  }
};
const formItemLayoutText = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 20
  }
};

/**
 * 编辑工具
 */
@connect(({ toolsType, oss }) => ({
  toolsType, oss
  //loading: loading.effects['customer/queryEnterprise']
}))
@Form.create()
export default class SubmitMyTools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      script: null,     // 脚本文件
      fileList: [],     // 上传文件列表
      loading: false,
      width: "100%",
      baseFilesList: [],
      industryFilesList: [],
      modalVisible: false,
      selectedRows: [],
      visible1: false,
      previewVisible: false,
      previewImage: "",
      editDetail: {},
      updateToolsType: "",
      _setModal: false,
      _type: 0,
      _record: {},
      help: "",//版本号提示
      validateStatus: ""//版本号校验状态
    };
    this.preview = 0;
    this.uploadScript = React.createRef();

    this.columns = [
      ...editMyToolsColumns,
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => {
          // console.log("打印record:", record);
          // console.log("打印modal:", this.props.toolsType.dataSourceModal);
          const _tmpData = this.props.toolsType.dataSourceModal;
          if (_tmpData.length == 1) {
            return (<div>
              <a onClick={this._editConfirmInput.bind(this, record)}>编辑</a>
              <Divider type="vertical"/>
              <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
            </div>);
          } else {
            return (<div>
              <a onClick={this._editConfirmInput.bind(this, record)}>编辑</a>
              <Divider type="vertical"/>
              <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
              <Divider type="vertical"/>
              {record.key == _tmpData.length - 1 ? "" : (record.key == 0 ?
                <a onClick={this._moveDown.bind(this, record)}>下移</a> :
                <a onClick={this._moveUp.bind(this, record)}>上移</a>)}
              {record.key == 0 ? "" : (record.key == _tmpData.length - 1 ?
                <a onClick={this._moveUp.bind(this, record)}>上移</a> :
                <Fragment><Divider type="vertical"/><a onClick={this._moveDown.bind(this, record)}>下移</a></Fragment>)}
            </div>);
          }
        }
      }];
    let query = this.props.location.query;
    if (query) {
      const _updateToolsType = query.updateToolsType;
      sessionStorage.setItem("annoroad-edit-myTool-code", query.code);
      sessionStorage.setItem("annoroad-edit-myTool-submitToolsType", _updateToolsType);
      sessionStorage.setItem("annoroad-edit-myTool-toolCode", query.toolCode);

    }
  }

  // 删除数据
  _deleteConfirm = (record) => {

    this.setState({ _type: 0 });
    this.props.dispatch({
      type: "toolsType/deleteiFileSubmit",
      payload: record.key
    });
  };
  // 上移数据
  _moveUp = (record) => {
    const value = {
      key: record.key,
      actionType: 1
    };
    this.props.dispatch({
      type: "toolsType/inputFileSubmit",
      payload: value
    });
  };
  // 下移数据
  _moveDown = (record) => {
    const value = {
      key: record.key,
      actionType: 2
    };
    this.props.dispatch({
      type: "toolsType/inputFileSubmit",
      // payload: record.key
      payload: value
    });
  };
// 编辑参数
  _editConfirmInput = (record) => {
    // this.getNewInputFile.current._showModal(record);
    this.setState({
      _type: record.type,
      _record: record
    });

  };

  componentDidMount() {
    //获取真实dom，创新富文本编辑器
    for (var div = 0; div < 2; div++) {
      const divId = "#div_" + div;
      const editor = new Editor(divId);
      if (editor.toolbarSelector == "#div_0") {
        var editorParamExplain = editor;
      } else if (editor.toolbarSelector == "#div_1") {
        var editorResultExplain = editor;
      }
      // 使用 onchange 函数监听内容的变化，并实时更新到 state 中
      editor.customConfig.onchange = (html) => {
        //将html值设为form表单的desc属性值
        if (editor.toolbarSelector == "#div_0") {
          this.props.form.setFieldsValue({
            "paramExplain": html
          });
        } else if (editor.toolbarSelector == "#div_1") {
          this.props.form.setFieldsValue({
            "resultExplain": html
          });
        }
      };

      // editor.txt.html();
      editor.customConfig.customUploadImg = function(files, insert) {
        let client = getOssClient();
        if (client) {
          for (var i = 0; i < files.length; i++) {
            const path = uploadPath("source/editor/upload", files[i]);
            client.put(path, files[i]).then(function(result) {
                client.putACL(path, "public-read").then(() => {
                  insert(result.url);
                });
              }
            );
          }
        }
      };
      editor.customConfig.zIndex = 8;
      editor.customConfig.showLinkImg = false;
      editor.create();
    }

    //请求获取非富文本信息
    request("/annoroad-cloud-mis-server/tool/version/detail", {
      body: {
        code: sessionStorage.getItem("annoroad-edit-myTool-code")

      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          this.setState({ editDetail: data.data });
          const _version = this.state.editDetail.version.split(".");
          this.setState({
            _version1: sessionStorage.getItem("annoroad-edit-myTool-submitToolsType") == 3 ? "" : (data.data ? _version[0] : 0),
            _version2: sessionStorage.getItem("annoroad-edit-myTool-submitToolsType") == 3 ? "" : (data.data ? _version[1] : 0),
            _version3: sessionStorage.getItem("annoroad-edit-myTool-submitToolsType") == 3 ? "" : (data.data ? _version[2] : 0)
          });
          this.setState({ version1_value: _version[0], version2_value: _version[1], version3_value: _version[2] });
          // this.setState({version1_value:_version[0],version2_value:_version[1],version3_value:_version[2],}) ;
          this.props.dispatch({
            type: "toolsType/inputFileSubmit",
            payload: data.data.params
          });

          //请求获取参数说明信息
          request("/annoroad-cloud-mis-server/tool/version/richtext/detail", {
            body: {
              code: sessionStorage.getItem("annoroad-edit-myTool-code"),
              type: 1
            }
          }).then((data) => {
            if (data.code === "000000") {
              this.setState({ paramExplain: data.data.text });
              editorParamExplain.txt.html(data.data.text);
            }
          });
          //请求获取结果说明信息
          request("/annoroad-cloud-mis-server/tool/version/richtext/detail", {
            body: {
              code: sessionStorage.getItem("annoroad-edit-myTool-code"),
              type: 2
            }
          }).then((data) => {
            if (data.code === "000000") {
              this.setState({ resultExplain: data.data.text });
              editorResultExplain.txt.html(data.data.text);
            }
          });
        } else {
          /*message.success("保存失败！");*/
        }
      }
    });
  }


  componentWillUnmount() {
    this.props.dispatch({
      type: "customer/clear"
    });
    removeItem("examineOrLook");
  }


  whichClick = value => {
    let _required = true;
    if (value === "save") {
      _required = false;
    }
    this.setState({ required: _required });
  };

  handleCancel = () => this.setState({ previewVisible: false });

  /* handlePreview = file => {
     this.setState({
       previewImage: file.url || file.thumbUrl,
       previewVisible: true
     });
   };*/
  handlePreview = (_type) => {
    this.preview = _type;
    const submit = document.getElementById("saveBtn");
    submit.click();
  };

  handleChange = ({ fileList }) => this.setState({ fileList });

  /**
   * 提交表单
   * */

  submit = async (e) => {
    e.preventDefault();
    if (!e) {
      return;
    }
    if (this.state.validateStatus == "error") {
      return;
    }
    this.setState({ _type: 0 });
    let result = await this.uploadScript.current.uploadScript();
    if (!result) {
      message.error("脚本上传失败，请重新上传");
      return;
    }
    this.props.form.validateFields((err, values) => {
      let _paramExplain = values.paramExplain;
      let _resultExplain = values.resultExplain;
      if (_paramExplain == undefined) {
        message.error("参数说明不能为空");
        return;
      }
      if (_resultExplain == undefined) {
        message.error("结果说明不能为空");
        return;
      }
      if (err) {
        return;
      }
      const value_1 = this.state._version1;
      const value_2 = this.state._version2;
      const value_3 = this.state._version3;
      if (!CHECK_TWO_NUM.test(value_1) || !CHECK_TWO_NUM.test(value_2) || !CHECK_TWO_NUM.test(value_3)) {
        this.setState({
          help: "请输入1-2位正整数的版本号",
          validateStatus: "error"
        });
        return;
      }
      values.version = value_1 + "." + value_2 + "." + value_3;
      const tableData = this.props.toolsType.dataSourceModal;
      values.code = sessionStorage.getItem("annoroad-edit-myTool-code");
      values.params = tableData;
      if (values.params.length < 1) {
        message.error("请添加参数配置");
        return;
      }
      if (values.paramExplain == "" || values.paramExplain == "<p><br></p>") {
        message.error("请输入参数说明");
        return;
      }
      if (values.resultExplain == "" || values.resultExplain == "<p><br></p>") {
        message.error("请输入结果说明");
        return;
      }
      let _url = this.preview == 1 ? "/annoroad-cloud-mis-server/tool/version/save" : "/annoroad-cloud-mis-server/tool/version/deploy/submit";
      request(_url, {
        body: {
          ...values
        }
      }).then((data) => {
        if (data) {
          if (data.code === "000000") {
            if (this.preview == 1) {
              // message.success("保存成功！");
              // this.props.history.push("/apply/myTools");
              this.props.dispatch(routerRedux.push({
                pathname: "/apply/tool/preview",
                query: {
                  code: sessionStorage.getItem("annoroad-edit-myTool-code"),
                  interactive: false
                }
              }));
            } else {
              this.props.history.push("/apply/myTools");
            }

          } else {
            message.error(codeMark[data.code]);
            /*message.success("保存失败！");*/

          }
        }
      });
    });
  };

  getTextAreaLayout() {
    return {
      xl: { span: 24 },
      lg: { span: 24 },
      md: { span: 24 },
      sm: { span: 24 }
    };
  }


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

  layoutSlx(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      //xl: { span: 12 },
      xl: { span: 10, offset: !value ? 1 : 0 }
    };
  }

  layoutText(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      //xl: { span: 12 },
      xl: { span: 24, offset: !value ? 1 : 0 }
    };
  }

  // 清除_type
  setUpdateType = () => {
    this.setState({ _type: 0 });
  };
  checkVersion = (data) => {
    if (!CHECK_TWO_NUM.test(data)) {
      this.setState({
        help: "请输入数字",//版本号提示
        validateStatus: "error" //版本号校验状态
      });
    } else {
      this.setState({
        help: "",
        validateStatus: "success"
      });
    }
  };
  onChange = (e) => {
    this.checkVersion(e.target.value);
    this.setState({ _version1: e.target.value });
  };
  onChange1 = (e) => {
    this.checkVersion(e.target.value);
    this.setState({ _version2: e.target.value });
  };
  onChange2 = (e) => {
    this.checkVersion(e.target.value);
    this.setState({ _version3: e.target.value });
  };

  render() {
    const { form, loading, submitting, dispatch, toolsType } = this.props;
    const { getFieldDecorator } = this.props.form;
    const { dataSourceModal } = toolsType;
    const _updateToolsType = sessionStorage.getItem("annoroad-edit-myTool-updateToolsType");
    const basicData = (
      <Fragment>
        {this.state.editDetail ? this.state.editDetail.toolName : ""}
        {/*<span className={styles.basicSpan}>{this.state.editDetail?this.state.editDetail.toolTypeName:""}</span>*/}
        <a style={{
          fontSize: "14px",
          color: "#999",
          marginLeft: "12px"
        }}>{this.state.editDetail ? this.state.editDetail.toolTypeName : ""}</a>
      </Fragment>
    );

    const { previewVisible, previewImage, fileList } = this.state;
    const uploadButton = (
      <div>
        <Icon type="plus"/>
        <div className="ant-upload-text">Upload</div>
      </div>
    );

    return (
      <PageHeaderLayout
        title="我的工具"
        breadcrumbList={[{ title: "应用管理" }, { title: "我的工具" }]}
      >
        <Form onSubmit={(e) => this.submit(e)} hideRequiredMark className={styles.editMytools_main}>
          <Spin spinning={this.state.loading}>
            <Card title={basicData}>
              <Row>
                <ColFormItem
                  layout={this.layoutSlx(1)}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="概要"
                  type="TextArea"
                  initialValue={this.state.editDetail ? this.state.editDetail.summary : ""}
                  pattern={CHECK_WORD_FORTY}
                  placeholder="展示在【列表页】中，请输入1-40个字符"
                  parameter="summary" //为字段名称，名字与数据库一致
                  style={{ minRows: "4", maxRows: "6" }}
                />

                <Col
                  sm={24}
                  md={12}
                  xl={{ span: 10, offset: 1 }}
                  className={styles.toolImg}
                >
                  <ImageUpload form={this.props.form} {...this.props} required={true}
                               code={sessionStorage.getItem("annoroad-edit-myTool-toolCode")}
                               initialValue={this.state.editDetail ? this.state.editDetail.logo : "https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"}/>
                </Col>
              </Row>

              <Row>
                <ColFormItem
                  layout={this.layoutSlx(1)}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="工具简介"
                  type="TextArea"
                  initialValue={this.state.editDetail ? this.state.editDetail.introduction : ""}
                  pattern={CHECK_WORD_FORTYHUND}
                  placeholder="展示在【详情页】中，请输入1-400个字符"
                  parameter="introduction"
                  autosize={{ minRows: 4, maxRows: 6 }}
                />
                <ColFormItem
                  layout={this.layoutSlx()}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="注意事项"
                  type="TextArea"
                  initialValue={this.state.editDetail ? this.state.editDetail.attention : ""}
                  pattern={CHECK_WORD_FORTYHUND}
                  placeholder="展示在【详情页】中，请输入1-400个字符"
                  parameter="attention"
                  autosize={{ minRows: 4, maxRows: 6 }}
                />
              </Row>
              <Row className={styles.paramsWord}>
                <Col
                  sm={24}
                  md={24}
                  lg={12}
                  xs={2}
                  xl={{ span: 24, offset: 0 }}
                >
                  <FormItem label="结果说明" {...formItemLayout}>
                    <div id="div_1" style={{ zIndex: 3 }}>
                    </div>
                  </FormItem>
                  <ColFormItem
                    layout={this.layoutText(1)}
                    formItemLayout={formItemLayoutText}
                    form={form}
                    label="结果说明"
                    display="none"
                    placeholder="展示在【详情页】中，请输入1-400个字符"
                    parameter="resultExplain"
                    initialValue={this.state.resultExplain}/>
                </Col>
              </Row>
            </Card>

            <Row className={styles.cardMargin}
            >
              <p className={styles.fileTitle}>参数配置</p>
              <Col>
                <Card>
                  <Table
                    loading={loading}
                    size="middle"
                    dataSource={dataSourceModal}
                    /*dataSource={this.state.tabledataSource}*/
                    pagination={false}
                    columns={this.columns}
                    style={{ marginBottom: "24px" }}
                  />
                  <NewInputFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                                dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                updateRecord={this.state._record}/>
                  <NewInputFolder setUpdateType={this.setUpdateType} updateType={this.state._type}
                                  dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                  updateRecord={this.state._record}/>
                  <NewTextFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                               dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                               updateRecord={this.state._record}/>
                  <NewRadioFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                                dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                updateRecord={this.state._record}/>
                  <NewSelectFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                                 dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                 updateRecord={this.state._record}/>
                  <NewMulSelectFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                                    dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                    updateRecord={this.state._record}/>
                  <NewOutputFile setUpdateType={this.setUpdateType} updateType={this.state._type}
                                 dispatch={this.props.dispatch} toolsType={this.props.toolsType}
                                 updateRecord={this.state._record}/>

                </Card>
              </Col>
            </Row>
            <Card style={{ marginTop: 20 }}>
              <Row className={styles.paramsWord}>
                <Col
                  sm={24}
                  md={22}
                  xs={2}
                  xl={{ span: 24, offset: 0 }}
                >

                  <FormItem label="参数说明" {...formItemLayout}>
                    <div id="div_0"></div>
                  </FormItem>
                  {/*隐藏该选项*/}
                  <ColFormItem
                    layout={this.layoutText(1)}
                    formItemLayout={formItemLayoutText}
                    form={form}
                    label="参数说明"
                    initialValue={this.state.paramExplain}
                    placeholder="展示在【详情页】中，请输入1-400个字符"
                    parameter="paramExplain"
                    required={_updateToolsType == 1 ? false : true}
                  />
                </Col>
              </Row>
            </Card>

            <Row className={styles.cardMargin}
            >
              <p className={styles.fileTitle}>脚本上传 </p>
              <Col xl={{ span: 12 }} sm={24}>

                <Card className={styles.scriptUpload}>
                  <FormItem required={false} label={"脚本："} {...formItemLayout}>
                    <ScriptUpload code={sessionStorage.getItem("annoroad-edit-myTool-toolCode")} required={true}
                                  initialValue={this.state.editDetail ? this.state.editDetail.script : undefined} {...this.props}
                                  ref={this.uploadScript}/>
                  </FormItem>
                </Card>
              </Col>
              <Col
                className={styles.myToolVersion}
                xl={{ span: 12, offset: 0 }}
                sm={24}
              >
                <Card title="">
                  <Row gutter={24} className={styles.rowLineHeight}>
                    <Col lg={{ span: 24 }} md={24} sm={24} className={styles.versions_nav}>
                      {/* <InputGroup size="large"> */}
                      <Col span={24}>
                        <FormItem required={true} label={"版本号："} {...formItemLayout}
                                  validateStatus={this.state.validateStatus} help={this.state.help}>
                          <Input.Group compact={true} className={styles.inputs}>
                            <Col span={4}>
                              <Input value={this.state._version1} onChange={this.onChange}/>
                              {/*<Input defaultValue={this.state.editDetail?this.state.version1_value:0} id="version_1"  />*/}
                            </Col>
                            <Col span={4} offset={1}>
                              <Input value={this.state._version2} onChange={this.onChange1}/>
                              {/*<Input defaultValue={this.state.editDetail?this.state.version1_value:0}  id="version_2"/>*/}
                            </Col>
                            <Col span={4} offset={1}>
                              <Input value={this.state._version3} onChange={this.onChange2}/>
                              {/*<Input defaultValue={this.state.editDetail?this.state.version3_value:1} id="version_3" />*/}
                            </Col>
                            <Col span={7} style={{
                              lineHeight: "37px",
                              marginLeft: "10px",
                              color: "rgba(0, 0, 0, 0.247058823529412)"
                            }}>
                              例：版本号 3.0.1
                            </Col>
                          </Input.Group>
                        </FormItem>
                      </Col>

                    </Col>
                  </Row>
                  <Row type="flex" justify="start">
                    <Col span={15} className={styles.mirrorItem}>
                      <ColFormItem
                        // layout={this.layoutSlx(1)}
                        formItemLayout={formItemLayout}
                        form={form}
                        label="镜像名称"
                        type="Input"
                        initialValue={this.state.editDetail ? this.state.editDetail.imageName : ""}
                        pattern={CHECK_WORD_ThIRTY}
                        placeholder="最多输入30个字符"
                        parameter="imageName"
                        required={sessionStorage.getItem("annoroad-edit-myTool-submitToolsType") == 1 ? false : true}
                      />
                    </Col>
                    <Col span={8}
                         style={{ color: "rgba(0, 0, 0, 0.247)", lineHeight: "37px" }}>例：smalltool/pie:1.2.0</Col>
                  </Row>
                  <Row gutter={24} className={styles.myToolRemarks}>
                    <ColFormItem
                      /*layout={this.getTextAreaLayout()}*/
                      // layout={this.layoutSlx(1)}
                      formItemLayout={formItemLayout}
                      form={form}
                      label="备注(选填)"
                      type="TextArea"
                      parameter="remarks"
                      initialValue={this.state.editDetail ? this.state.editDetail.remarks : ""}
                      placeholder="备注信息用来告知相关人员在部署脚本时的注意事项"
                      required={false}
                    />
                  </Row>
                </Card>
              </Col>
            </Row>
            {/* }*/}
          </Spin>
          <div style={{ height: "40px" }}/>

          <FooterToolbar>
            <FormItem className={styles.btnBox}>
              <Button type="primary" htmlType="submit" id="saveBtn" loading={loading}
                      style={{ display: "none" }}>提交</Button>
              <Button type="primary" loading={loading} onClick={(_type) => this.handlePreview(0)}>提交</Button>
              <Button onClick={(_type) => this.handlePreview(1)} loading={loading}> 工具预览 </Button>
              <JumpLink name="返回列表" link="/apply/myTools"/>
            </FormItem>
          </FooterToolbar>
        </Form>
      </PageHeaderLayout>
    );
  }
}
