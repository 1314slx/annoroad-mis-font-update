import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Form, Row, Button, Col, message, Spin } from "antd";

const FormItem = Form.Item;
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem";
import FooterToolbar from "components/FooterToolbar";
import JumpLink from "components/Button/JumpLink";
import TreeList from "components/TreeList";
import { getItem, removeItem } from "../../../utils/utils";
import { platformOptions } from "../../../utils/options";
import { isArray } from "../../../utils/utils";

class NewRole extends Component {
  constructor(props) {
    super(props);
    this.checkData = null;
    this.platform = null;
    this.state = {
      /*此处注释*/
      bossState: false,
      prmState: false,
      rmsState: false,
      ctsState: false,

      applyState: false,
      systemState: false,
      /*此处注释*/
      bossData: null,
      ctsData: null,
      prmData: null,
      rmsData: null,
      applyData: null,
      systemData: null
    };
  }

  componentWillUnmount() {
    removeItem("editRole");
  }

  /**
   * 11 PRM 伙伴关系
   * 12 RM 风险控制
   * 13 BOSS
   * 14 CTS 信贷
   * 15 APPLY  应用管理
   * 16 system  系统管理
   * */
  componentDidMount() {
    this.props
      .dispatch({
        type: "authority/platformModuleList",
        payload: {
          //platform: 11
        }
      })
      .then(() => {
        this.getRoleModuleData();
      });
  }

  //获取角色模块信息
  getRoleModuleData() {
    const _editData = this._getEditRole();
    //console.log('_editData', _editData)
    if (_editData) {
      const params = {
        code: _editData.code
      };
      this.props
        .dispatch({
          type: "authority/roleModuleQuery",
          payload: params
        })
        .then(() => {
          const { roleModuleData } = this.props.authority;
          this.platform = _editData.platform; //模块信息
          this.checkData = roleModuleData;
          this._setTreeData(this._getPlatform(this.platform), roleModuleData);
        });
    }
  }

  _getPlatform(platform) {
    if (!platform) {
      return;
    }
    let _type;
    const _data = platformOptions;
    _data.map(value => {
      if (value.key === platform) {
        _type = value.value;
      }
    });
    return _type;
  }

  //编辑或者新建角色提交
  editRole = e => {
    e.preventDefault();

    const { form, dispatch } = this.props;

    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      if (err) {
        return;
      }
      //console.log('this.platform:', this.platform)
      // console.log('this.checkData:', this.checkData)

      if (this.platform && this.checkData) {
        const _code = this._getEditRole();
        const params = {
          ...fieldsValue,
          code: _code ? _code.code : "",
          platform: this.platform,
          module_list: this._setCheckData(this.checkData)
        };
        //console.log('编辑角色', params);
        dispatch({
          type: "authority/roleSave",
          payload: params
        }).then(() => {
          const { actionStatus } = this.props.authority;
          if (actionStatus) {
            message.success("保存成功！");
            setTimeout(() => {
              this.props.dispatch(
                routerRedux.push("/userauthority/role-manage")
              );
            }, 200);
          }
        });
      } else {
        message.error("请分配权限！");
      }
    });
  };

  _setCheckData(data) {
    let _list = [];
    if (data) {
      data.map(value => {
        _list.push({
          code: value
        });
      });
    }
    return _list;
  }

  //获取存在sessionStorage的值
  //编辑的时候用这个id请求数据
  _getEditRole() {
    return getItem("editRole") ? JSON.parse(getItem("editRole")) : false;
  }

  onCheck = (type, checkedKeys, info) => {
    //console.log('type:', type);
    //console.log('info:', info.halfCheckedKeys)
    //不选任何一个的时候
    if (checkedKeys == 0) {
      this._setTreeListState();
    } else {
      let _checkData = [...checkedKeys, ...info.halfCheckedKeys];
      this._setTreeListState(type);
      this.platform = this._getPlatformKey(type);
      this.checkData = _checkData;
    }
    this._setTreeData(type, checkedKeys);
    //console.log(checkedKeys);
  };

  _setTreeData(type, checkedKeys) {
    /*此处注释2*/
    let _bossData = [];
    let _ctsData = [];
    let _prmData = [];
    let _rmsData = [];

    let _applyData = [];
    let _systemData = [];

    switch (type) {
      /*此处注释-1*/
      case "BOSS":
        _bossData = checkedKeys;
        break;
      case "PRM":
        _prmData = checkedKeys;
        break;
      case "RMS":
        _rmsData = checkedKeys;
        break;
      case "CTS":
        _ctsData = checkedKeys;
        break;

      case "APPLY":
        _applyData = checkedKeys;
        break;
      case "SYSTEM":
        _systemData = checkedKeys;
        break;
    }
    console.log("checkedKeys", checkedKeys);
    this.setState({
      /*此处注释3*/
      bossData: _bossData,
      rmsData: _rmsData,
      ctsData: _ctsData,
      prmData: _prmData,
      applyData: _applyData,
      systemData: _systemData
    });
  }

  _getPlatformKey(type) {
    if (!type) {
      return;
    }
    let _key;
    const _data = platformOptions;
    _data.map(value => {
      if (value.value === type) {
        _key = value.key;
      }
    });
    return _key;
  }

  _setTreeListState(type) {
    /*此处注释5*/
    let _bossState = true;
    let _prmState = true;
    let _rmsState = true;
    let _ctsState = true;
    let _applyState = true;
    let _systemState = true;

    switch (type) {
      /* 此处注释6*/
      case "BOSS":
        _bossState = false;
        break;
      case "PRM":
        _prmState = false;
        break;
      case "RMS":
        _rmsState = false;
        break;
      case "CTS":
        _ctsState = false;
        break;

      case "APPLY":
        _applyState = false;
        break;
      case "SYSTEM":
        _systemState = false;
        break;
      default:
    }
    this.setState({
      /* 此处注释7*/
      bossState: type ? _bossState : false,
      prmState: type ? _prmState : false,
      rmsState: type ? _rmsState : false,
      ctsState: type ? _ctsState : false,

      applyState: type ? _applyState : false,
      systemState: type ? _systemState : false,

      /*此处注释8*/
      bossData: [],
      ctsData: [],
      rmsData: [],
      prmData: [],

      applyData: [],
      systemData: []
    });
  }

  //获取平台模块数据
  getData(value) {
    const { authority } = this.props;
    const { platformModuleList } = authority;
    if (platformModuleList && platformModuleList.hasOwnProperty(value)) {
      return platformModuleList[value];
    }
  }

  render() {
    const { form, submitting, loading, authority } = this.props;
    //const {getFieldDecorator} = form;
    const _data = this._getEditRole();
    const _title = this._getEditRole() ? "编辑角色" : "新建角色";

    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };
    const layout = {
      sm: { span: 24 },
      xl: { span: 16 }
    };
    return (
      <PageHeaderLayout title={_title}>
        <Form onSubmit={this.editRole}>
          <Card>
            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                label="角色名称"
                initialValue={_data ? _data.roleName : ""}
              />
            </Row>

            <Row>
              <ColFormItem
                layout={layout}
                formItemLayout={formItemLayout}
                form={form}
                label="描述"
                type="TextArea"
                initialValue={_data ? _data.describe : ""}
                placeholder="为角色进行描述..."
                parameter="descr"
              />
            </Row>

            <Row style={{ minHeight: "140px" }}>
              <Col {...layout}>
                <Spin spinning={loading}>
                  <FormItem label="分配权限" {...formItemLayout}>
                    <TreeList
                      checkable={true}
                      disabled={this.state.bossState}
                      defaultCheckedKeys={this.state.bossData}
                      onCheck={this.onCheck.bind(this, "BOSS")}
                      data={this.getData("BOSS")}
                    />

                    <TreeList
                      checkable={true}
                      disabled={this.state.prmState}
                      defaultCheckedKeys={this.state.prmData}
                      onCheck={this.onCheck.bind(this, "PRM")}
                      data={this.getData("PRM")}
                    />

                    <TreeList
                      checkable={true}
                      disabled={this.state.rmsState}
                      defaultCheckedKeys={this.state.rmsData}
                      onCheck={this.onCheck.bind(this, "RMS")}
                      data={this.getData("RMS")}
                    />

                    <TreeList
                      checkable={true}
                      disabled={this.state.ctsState}
                      defaultCheckedKeys={this.state.ctsData}
                      onCheck={this.onCheck.bind(this, "CTS")}
                      data={this.getData("CTS")}
                    />

                    <TreeList
                      checkable={true}
                      disabled={this.state.applyState}
                      defaultCheckedKeys={this.state.applyData}
                      onCheck={this.onCheck.bind(this, "APPLY")}
                      data={this.getData("APPLY")}
                    />
                    <TreeList
                      checkable={true}
                      disabled={this.state.systemState}
                      defaultCheckedKeys={this.state.systemData}
                      onCheck={this.onCheck.bind(this, "SYSTEM")}
                      data={this.getData("SYSTEM")}
                    />
                  </FormItem>
                </Spin>
              </Col>
            </Row>
          </Card>
          <div style={{ height: "40px" }} />
          <FooterToolbar>
            <FormItem style={{ marginTop: "10px" }}>
              <Button type="primary" htmlType="submit" loading={submitting}>
                保存
              </Button>

              <JumpLink name="取消" link="/userauthority/role-manage" />
            </FormItem>
          </FooterToolbar>
        </Form>
      </PageHeaderLayout>
    );
  }
}

export default connect(({ authority, loading }) => ({
  authority,
  loading: loading.effects["authority/platformModuleList"],
  submitting: loading.effects["authority/roleSave"]
}))(Form.create()(NewRole));
