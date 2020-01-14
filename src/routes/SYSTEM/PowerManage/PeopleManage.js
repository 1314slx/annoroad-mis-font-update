import React, { Component, Fragment } from "react";
import { connect } from "dva";
import {
  Card,
  Row,
  Button,
  Select,
  Divider,
  message,
  Form,
  Col, TreeSelect, Input
} from "antd";
import styles from "../style.less";
import request from "../../../utils/request";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery";
import { peopleManageColumns } from "../columns";
import TooltipItem from "components/TooltipItem";
const { Option } = Select;
const FormItem = Form.Item;

/**
 * 成员管理
 * */
@connect(({ roleManage, loading }) => ({
  roleManage,
  // loading: loading.effects["roleManage/queryPeopleGroup"]
}))
@Form.create()
export default class PeopleManage extends Component {
  constructor(props) {
    super(props);
    this.submitParams = null; //记录当前查询条件
    this.state = {
      loading: false,
      width: "100%",
      data: [],
      roleOptionData: [], //分配角色列表数据，
      editTable: false,
      editKey: undefined,
      visible: true,
      roleCodes:[],
      submitName: undefined,
      treeNames: [],
      editMark:0,
      _name:null,//成员管理搜索栏姓名的初始值
      myStyle:{}
    };
    this.previousTime = 0;

    this.getPrincipalStructure();

    this.columns = [
      ...peopleManageColumns,
      {
        title: "角色",
        dataIndex: "roles",
        width: "20%",
        render: this.roleAction
      },
      {
        title: "操作",
        render: this.action
      }
    ];
  }
  componentDidMount() {
    this.getRoleData();
    this.getListData();
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
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
  getPrincipalStructure = name => {
    this.setState({
      submitName: name
    })
    let now = new Date().getTime();
    // 这里为了防止过度频繁的访问后台，限制2秒钟之内只会请求一次后台
    if(now - this.previousTime > 2000) {
      this.previousTime = now;
      request("annoroad-cloud-mis-server/tool/principal/structure", {}).then((data) => {
        if (data && data.data) {
          if (data.code != "000000") {
            return;
          }
          this.setState({
            treeNames: this.getData(data.data.structure),
          })
        }
      });
    }
  }

  //修改负责人结构树格式
  getData = _data => {
    if (_data) {
      return _data.map(value => {
        if (value.leaf === 1) {
          return {
            title: value.name,
            value: value.name,
            key: value.userId
          };
        } else {
          return {
            title: value.name,
            selectable: false,
            children: this.getData(value.childNodes)
          };
        }
      });
    }
  };

  //获取角色列表信息
  getRoleData() {
    const value = {
      pageNo: 1,
      pageSize: 15
      // user_relation: true //是否是用户管理分配角色用用数据
    };
    this.props
      .dispatch({
        type: "roleManage/roleList",
        payload: value
      })
      .then(() => {
        const { saveRoleData } = this.props.roleManage;
        this.setState({ roleOptionData: saveRoleData.roleListDataSource });
      });
  }
  // 重置
  /* onClick={() => this.setState({submitName : undefined})}*/
  handleFormReset = () => {
  /*  const { form } = this.props;
    form.resetFields(); */
    this.setState({submitName : undefined,_name:undefined});
    this.getListData();

  };

  // 查询提交
  submitName = (e) => {
    e.preventDefault();
    const values = {
      pageNo:  1,
      pageSize: 15,
      name:this.state._name
      // name:this.state.namePairs[this.state.submitName]
    };
    this.getListData(values);
  };

  nameSubmit = name => {
    this.setState({
      submitName: name
    })
  };

  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15,
      name:params && params.name?params.name:""
    };
    this.props
      .dispatch({
        type: "roleManage/queryPeopleGroup",
        payload: value
      })
      .then(() => {
        this.submitParams = value; //保存当前请求参数
        //请求数据完成后更新列表数据   groupPeopleData
        const { groupPeopleData } = this.props.roleManage;
        this.setState({
          data: groupPeopleData.dataSource
        });
      });
  }
  //编辑模板
  _editTemplate = (value, record) => {
      this.setState({
        editTable: value,
        editKey: record.key
      });
  };
  //表格操作
  action = (text, record) => {
    if (this.state.editTable && record.key == this.state.editKey) {
      return (
        <Fragment>
          <a onClick={this._saveRole.bind(this, record)}>保存角色</a>
          <Divider type="vertical" />
          <a onClick={() => this._editTemplate(false, record)}>取消</a>
        </Fragment>
      );
    }else{
      return (
        <a onClick={() => this._editTemplate(true, record)}>分配角色</a>
      );
    }

  };

  //角色编辑
  roleAction = (text, record) => {
    if (this.state.editTable && record.key == this.state.editKey) {
      return (
        <Select
          mode="multiple"
          style={{ width: "100%" }}
          defaultValue={record.roles}
          onChange={this._roleChange.bind(this, record)}
        >
          {this._getOption(this.state.roleOptionData)}
        </Select>
      );
    }
    return <TooltipItem value={this._getShowText(text)} />;
  };
  _getOption(data) {
    if (!data) {
      return;
    }
    return data.map((value, index) => (
        <Option key={value.code} value={value.code}>
          {value.name}
        </Option>
      ));
  }

  /**
   * 成员管理-角色栏-展示
   * @param data
   * @returns {string}
   * @private
   */
  _getShowText(data) {
    const _data = this.state.roleOptionData;
    if (!data || !_data) {
      return;
    }
    const _show = [];
    data.map(v => {
      _data.map(value => {
        if (v === value.name) {
          _show.push(value.name);
        } else if (v === value.code) {
          _show.push(value.name);
        }
      });
    });
    return _show.join("、 ");
  }

  //编辑角色数据
  _roleChange(record, value) {
    this.setState({
      roleCodes:value,
      editMark:1});
  }

  //保存分配角色
  _saveRole(record, e) {
    const event = e || window.event;
    event.preventDefault();
    this.props.dispatch({
      type:"roleManage/saveUserRole",
      payload:{
        userId: record.loginName,
        roleCodes:this.state.editMark===1?this.state.roleCodes.join(","):record.roles.join(",")
      }
    }).then(() => {
      message.success("保存成功");
      const values = {
        name:this.state._name
      };
      this.getListData(values);
      this.setState({
        editTable: false
      });
    });
  }

  //翻页
  pagination = pageNumber => {
    const params = {
      name:this.state._name,
      pageNo: pageNumber
    };
    this.getListData(params);
  };
  /**
   * 自动搜索
   */
  _onChangeData = (e) =>{
    e.preventDefault();
    this.setState({
       _name:e.target.value
    })
    const value = {
      name: e.target.value,
      pageNo: 1,
      pageSize: 15,
    };
    this.props.dispatch({
        type: "roleManage/queryPeopleGroup",
        payload: value
      })
  }
  render() {
    const { loading, roleManage } = this.props;
    const { groupPeopleData } = roleManage; // groupData 展示列表数据
    const { pageNo, total, dataSource } = groupPeopleData;
    return (
      <PageHeaderLayout
        title="成员管理"
        breadcrumbList={[{title: "权限管理"},{title: "成员管理"}]}
      >
        <div className={styles.userManager} style={this.state.myStyle}>
        <Card title=""  className={styles.noInlineMarginR}>
            <Form onSubmit={(e) => this.submitName(e)} layout="inline" className={styles.formItem}>
            <Row>
              <Col md={8} sm={24}>
                <FormItem
                  label="姓名"
                >
                  <Input value={this.state._name} placeholder="请输入" className={styles.nameInput} onChange={(e)=>this._onChangeData(e)}  />
                   {/*<Input placeholder="" onChange={(e)=>this._onChangeData(e, 1)} />)}*/}
                </FormItem>
                  {/*<FormItem label="姓名：">
                    <TreeSelect
                      style={{ width: 300, paddingLeft:10 }}
                      value={this.state.submitName}
                      dropdownStyle={{ maxHeight: 400, overflow: 'auto'}}
                      treeData={this.state.treeNames}
                      placeholder="请选择"
                      showSearch={true}
                      treeDefaultExpandAll
                      onSearch={this.getPrincipalStructure}
                      searchValue={this.state.submitName}
                      onChange={this.nameSubmit}
                    />
                  </FormItem>*/}
              </Col>
              <Col md={16} sm={24}>
                <div className={styles.searchBar}>
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
                         /* onClick={() => this.setState({submitName : undefined})}*/
                        >
                          重置
                        </Button>
                      </span>
                </div>
              </Col>

            </Row>
            </Form>

          </Card>
          <ListQuery
            bordered={false}
            linkName=""
            columns={this.columns}
            // items={searchs}
            dataSource={dataSource}
            current={pageNo}
            total={total}
            loading={loading}
            pagination={this.pagination}
            // onSubmit={this.onSubmit}
          />
          
        </div>
      </PageHeaderLayout>
    );
  }
}
