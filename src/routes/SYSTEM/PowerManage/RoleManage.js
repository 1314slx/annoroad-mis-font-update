import React, { Component, Fragment } from "react";
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
  Select,
  message,
  Modal,
  Icon, Spin
} from "antd";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import { roleManageColumns } from "../columns";
import { setItem } from "../../../utils/utils";
import * as routerRedux from "react-router-redux";
import styles from "../../APPLY/Tools/myTools.less";
import ConfirmModal from "components/ConfirmModal";
import request from "../../../utils/request";
const FormItem = Form.Item;
const { Option } = Select;

/**
 * 成员管理
 * */
@connect(({ roleManage, loading }) => ({
  roleManage,
  loading: loading.effects["roleManage/roleManageList"]
}))
@Form.create()
export default class RoleManage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      mark: "",
      name:"",
      visible: false,
      currentRecord: null,
      myStyle:{}
    };
    this.columns = [
      ...roleManageColumns,
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
    const params = {};
    dispatch({
      type: "roleManage/roleList", //获取所有角色
      payload: params
    });
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  componentWillUnmount() {}
  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.clientHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      marginBottom: "24px",
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }

  //编辑角色
  _editRole = (record, e) => {
    if (record) {
      this.setState({ mark: 1 });
      setItem("editRole", JSON.stringify(record)); //"/powerManage/roleManageEdit"
    }else{
      setItem("editRole", JSON.stringify(""));
    }

    this.props.dispatch(
      routerRedux.push({
        pathname: "/powerManage/roleManageEdit"
        /*  query: {
        mark:record? 1:'',
        code:record?record.code:'',
        name:record?record.name:'',
        remarks:record?record.remarks:'',

      },*/
      })
    );
  };
  //删除确认
  _deleteConfirm(record) {
    this.setState({
      visible: true,
      currentRecord: record
    });
  }

  //操作
  _handler = (text, record) => (
      <Fragment>
        <a onClick={this._editRole.bind(this, record)}>编辑</a>
        <Divider type="vertical" />

        <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
      </Fragment>
    );

  //提交
  onSubmit = e => {
    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFields((err, fieldsValue) => {
      if (!err) {
      const values = {
        ...fieldsValue,
        pageSize: 15,
        pageNo: 1
      };
      this.setState({
        formValues: values
      });
      dispatch({
        type: "roleManage/roleManageList",
        payload: values
      });
    }
    });
  };

  //重置
  handleFormReset = () => {
    const { form, dispatch } = this.props;
    form.resetFields();
    this.setState({
      formValues: {},
    });
    const values = {
      pageSize: 15,
      pageNo: 1
    };
    dispatch({
      type: 'roleManage/roleManageList',
      payload: values,
    });
  };


  //翻页
  pagination = pageNumber => {
    const params = {
      pageNo: pageNumber
    };
    this.getListData(params);
  };

  //删除取消
  handleCancel = () => {
    this.setState({
      visible: false
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
          type: "roleManage/roleDelete",
          payload: _params
        })
        .then(() => {
          const { actionStatus } = this.props.roleManage;
          if (actionStatus) {
            message.success("操作成功！");
            this.setState({
              confirmLoading: false,
              visible: false,
              currentRecord: null
            });
            this.getListData(this.state.formValues );
          }
        });
    }
  };

  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "roleManage/roleManageList",
      payload: value
    });
  }

  getRoleName = () => {
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if(now - this.previousTime > 2000) {
      this.previousTime = now;
      const params = {};
      this.props.dispatch({
        type: "roleManage/roleList", //获取所有角色
        payload: params
      });
    }
  }
  render() {
    const { roleManage, loading } = this.props;
    const { groupData, saveRoleData } = roleManage; // groupData 展示列表数据
    const { pageNo, total, dataSource } = groupData;
    const { roleListDataSource } = saveRoleData;
    const { form } = this.props;
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="角色管理"
        breadcrumbList={[{title: "权限管理"},{title: "角色管理"}]}
      >
        <div className={styles.redwr} style={this.state.myStyle}>
          <Card title="" >
            <Form onSubmit={this.onSubmit} layout="inline">
              <Row>
                <Col md={8} sm={24}>
                  <FormItem label="角色名称">
                    {getFieldDecorator("name")(
                      <AutoComplete
                        placeholder="请输入"
                        onChange={this.getRoleName}
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {saveRoleData
                          ? saveRoleData &&
                            saveRoleData.roleListDataSource &&
                            saveRoleData.roleListDataSource.map(
                              (value, index) => (
                                <Option value={value.name}>{value.name}</Option>
                              )
                            )
                          : ""}
                      </AutoComplete>
                    )}
                  </FormItem>
                </Col>
                {/*<Col md={8} sm={24} />*/}
                <Col md={16} sm={24}>
                  <div className={styles.searchBar} style={{ marginTop: 0 }}>
                    <span className={styles.submitButtons}>
                      <Button
                        type="primary"
                        htmlType="submit"
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
              <Row>
                <Col md={24} sm={24}>
                  <Button
                    type="primary"
                    onClick={() => this._editRole()}
                    icon="plus"
                    /*style={{ background: "${this.state.bgColorsa}", marginBottom: "24px"  }}*/
                    style={{  marginBottom: "24px",marginTop: "5px"  }}
                  >
                    新建角色
                  </Button>
                </Col>
              </Row>
            </Form>
            <Spin spinning={loading}>
              <Table
                columns={this.columns}
                dataSource={dataSource}
                size="middle"
                className={styles.hiddenCloumn}
                /*  scroll={{ x: 1200 }}*/
                pagination={false}
              />
              <Row type="flex" justify="end" className={styles.paginationBox}>
                <Pagination
                  showQuickJumper
                  /*onChange={this.onChange}*/
                  onChange={this.pagination}
                  current={pageNo}
                  total={total}
                  pageSize={15}
                />
              </Row>
            </Spin>
          </Card>
        </div>
        <Modal
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          width={"400px"}
          style={{top:"190px"}}
          footer={[
            <Button  onClick={this.handleCancel}>取消</Button>,
            <Button type="primary" onClick={this.handleOk} style={{background:"#ff0000",fontSize:"16px",color:"#ffffff",borderColor:"#ff0000"}} >删除</Button>
          ]}
        >
          <div style={{padding:"24px 0"}}>
            <Icon type="info-circle"  theme="filled" className={styles.del_Icon} /> 删除角色将会使
            <span style={{ color: "#ff0000" }}>
              该角色下的用户失去对应的权限
            </span>，
            <span style={{ color: "#999" }}>你还要继续吗？</span>
          </div>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
