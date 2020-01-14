import React, { Component } from "react";
import { connect } from "dva";
import { getItem, removeItem} from "../../../utils/utils";
import { Card, Form, Row, Button, Col, message, Tree, Modal } from "antd";
import request from "../../../utils/request";
const FormItem = Form.Item;
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import ColFormItem from "components/ColFormItem";
import FooterToolbar from "components/FooterToolbar";
import JumpLink from "components/Button/JumpLink";
const TreeNode = Tree.TreeNode;
import { codeMark} from "../../../utils/options";
import styles from "./index.less"

/**
 * 成员管理
 * */
@connect(({ roleManage, loading }) => ({
  roleManage,
  loading: loading.effects["roleManage/roleNavList"]
}))
@Form.create()
export default class RoleManageEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // expandedKeys: ['0-0-0', '0-0-1'],
      autoExpandParent: false,
      checkedKeys: [],
      haltcheckedKeys: [],
      checkedKeysTest: [],
      myStyle: {},
      selectedKeys: [],
      isEdit:false,  //是否编辑权限
      testData:[
        "f3904631510845f3a63828f1cf5bae6f",
        "0e54e4c68b894323b375c11d00615504",
        "217f3d88ece44a9dbb3c634b72279ac5",
        "90869ac67f0b4d27818fa1d1147d4157",
        "3dea24fd598f4b3ba29a8d8eae34545e",
        "9a34cee88a3c46608cb11aa878e6c94d",
        "5a4f146b63774fa4bc8522b3156cdc5d"
      ],
      visible:false
    };
  }
  componentDidMount() {
    this.find().then(() => {
      if(JSON.parse(getItem("editRole")) == ""){
        return;
      }

      this._getDataRole(this.props.roleManage.groupRoleNavData);

      var checked = [];
      var halfChecked = [];
      for(var check of this._list) {
        if (check.checkedType == 1) {
          checked.push(check.nodeCode);
        }else{
          halfChecked.push(check.nodeCode);
        }
      }

      this.setState({
        checkedKeys: checked
      });
    });
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
      background:"#ffffff",
      marginBottom:"24px"
    }
    this.setState({
      myStyle:mystyle
    })
  }

  find = async () => {
    const { dispatch } = this.props;

    const paramsAllRole = {
      pageSize: ""
    };
    await dispatch({
      type: "roleManage/menuNavList", //获取整个菜单
      payload: paramsAllRole
    });

    const editRoleData = JSON.parse(getItem("editRole"));
    if(editRoleData == ""){
      return;
    }

    const params = {
      code: editRoleData.code
    };
    await dispatch({
      type: "roleManage/roleNavList", //获取所有角色
      payload: params
    });

  };

  //编辑、新建角色保存
  editRole = e => {
    const _this = this;
    e.preventDefault();
    const { form, dispatch } = this.props;
    //提交校验
    form.validateFieldsAndScroll((err, fieldsValue) => {
      // 编辑角色时判断是否分配权限
      if(this.state.isEdit==true && this.state.checkedKeysTest.length < 1){
        message.error("请分配权限");
        return;
      }
      // 新建角色时判断是否分配权限
      const editRoleData = JSON.parse(getItem("editRole"));
      if((editRoleData.name==""|| editRoleData.name==undefined)&&this.state.isEdit==false){
        message.error("请分配权限");
        return;
      }
      const nodeCodesCheck = this.state.checkedKeysTest.join; //b="0-1-2-3-4-5"
      const nodeCodesObject = { nodeCodes: this.state.checkedKeysTest&&this.state.checkedKeysTest.length>0?this.state.checkedKeysTest:this.props.roleManage.groupRoleNavData};
      const json = eval(
        "(" +
        (
          JSON.stringify(fieldsValue) + JSON.stringify(nodeCodesObject)
        ).replace(/}{/, ",") +
        ")"
      );
      if (nodeCodesCheck) {
        const params = {
          code: json.code ? json.code : "",
          name: json.name ? json.name : "",
          remarks: json.remarks ? json.remarks : "",
          nodeCodes: json.nodeCodes ? json.nodeCodes : ""
        };
        if(json.nodeCodes.length<1&&this.props.roleManage.groupRoleNavData.length<0){
          this.setState({
            visible:true
          })
          return;
        }
        request('/annoroad-cloud-mis-server/role/save',{body:{
            code: json.code ? json.code : "",
            name: json.name ? json.name : "",
            remarks: json.remarks ? json.remarks : "",
            nodeCodes: json.nodeCodes ? json.nodeCodes : ""
          }}).then((data)=>{
          if(data){
            if(data.code==="000000"){
              message.success("保存成功！");
              setTimeout(() => {
                _this.props.history.push("/powerManage/roleManage");
                removeItem("editRole");
              }, 1000);
              _this.setState({isEdit:false,checkedKeysTest:[]})
            }else{
              message.error(codeMark[data.code]);
            }
          }else{
            message.error("系统错误");
          }
        })
      } else {
        message.error("请分配权限！");
      }
    });
  };
  /**
   * modal取消
   * @param expandedKeys
   */
  handleCancel = ()=>{
    this.setState({
      visible:false
    })
  }
  onExpand = expandedKeys => {
    this.setState({
      expandedKeys,
      autoExpandParent: false
    });
  };
  /* //选择角色
   onCheck = checkedKeys => {
     this.setState({ checkedKeys });
   };*/

  onCheck = (checkedKeys,info) => {
    this.setState({ isEdit:true })
    const halfCheckedKey = [...info.halfCheckedKeys];
    var checked = [];
    for (var tmpa of halfCheckedKey ){
      var half= {nodeCode:tmpa,checkedtype:2}
      checked.push(half);
    }
    var halfChecked = [];
    for (var tmpb of checkedKeys){
      var half2= {nodeCode:tmpb,checkedtype:1}
      halfChecked.push(half2);
    }
    checked.push.apply(checked,halfChecked);
    this.setState({ checkedKeysTest:checked });
    this.setState({ checkedKeys });
  };

  onSelect = (selectedKeys, info) => {
    this.setState({ selectedKeys });
  };

  renderTreeNodes = data => (
    data &&
    data.map(item => {
      if (item.children) {
        return (
          <TreeNode title={item.title} key={item.key} dataRef={item}>
            {this.renderTreeNodes(item.children)}
          </TreeNode>
        );
      }
      return <TreeNode {...item} />;
    })
  );
  //修改结构树格式
  getData = _data => {
    if (_data) {
      return _data.map(value => {
        if (value.children && value.children.length > 0) {
          return {
            title: value.name,
            key: value.nodeCode,
            children: this.getData(value.children)
          };
        } else {
          return {
            title: value.name,
            key: value.nodeCode
          };
        }
      });
    }
  };
  //修改结构树格式
  _list = [];
  _getDataRole = (_data, list) => {
    /*if (_data) {
      _data.map((value, index) => {

        this._list.push(value.nodeCode);
        if (value.children && value.children.length > 0) {
          this._getDataRole(value.children);
        }
      });
    }*/
    this._list = _data;
    return this._list;
  };
  /*  getDataRole = _data => {
    const _list =[];
    if (_data) {
      //debugger;
      return _data.map((value) => {
        if(value.children&&value.children.length>0){
       return  _list.push({
         key: value.nodeCode,
        })}else{
          return children:this.getData(value.children)
        }
      })
    }
  };*/
  render() {

    this._list = [];
    const { form, submitting, roleManage } = this.props;
    const { groupMenuNavData } = roleManage;
    const editRoleData = JSON.parse(getItem("editRole"));
    const menuRoleData = this.getData(
      groupMenuNavData.navTree ? groupMenuNavData.navTree : ""
    );
    if(menuRoleData && menuRoleData[0]){
      if(menuRoleData[0].title === "Dashboard"){
        menuRoleData.shift();
      }
    }
    const formItemLayout = {
      labelCol: {
        span: 5
      },
      wrapperCol: {
        span: 15
      }
    };
    const layout = {
      span: 14
    };
    const layoutSave = {
      span: 8
    };
    return (
      <PageHeaderLayout
        title={editRoleData.name ? "编辑角色" : "新建角色"}
        breadcrumbList={[{title: "权限管理"},{title: "角色管理"}]}
      >
        <div style={this.state.myStyle}>
          <Form onSubmit={this.editRole} hideRequiredMark >
            <Card className={styles.rowMarginB}>
              <Row style={{ display: "none" }}>
                {/*<Row>*/}
                <ColFormItem
                  layout={layout}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="角色id"
                  initialValue={editRoleData ? editRoleData.code : ""}
                  parameter="code"
                />
              </Row>
              <Row type={'flex'} justify={'center'}>
                <ColFormItem
                  layout={layout}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="角色名称"
                  initialValue={editRoleData ? editRoleData.name : ""}
                  placeholder="给角色起个名字"
                  parameter="name"
                />
              </Row>

              <Row type={'flex'} justify={'center'}>
                <ColFormItem
                  layout={layout}
                  formItemLayout={formItemLayout}
                  form={form}
                  label="描述"
                  type="TextArea"
                  initialValue={editRoleData ? editRoleData.remarks : ""}
                  placeholder="简单描述角色的职能范围..."
                  parameter="remarks"
                  required={false}
                />
              </Row>
              <Row style={{ minHeight: "40px" }} type={'flex'} justify={'center'}>
                <Col {...layout}>
                  {/*<Spin spinning={loading}>*/}
                  <FormItem label="分配权限" {...formItemLayout}>
                    <Tree
                      checkable
                      onExpand={this.onExpand}
                      expandedKeys={this.state.expandedKeys}
                      autoExpandParent={this.state.autoExpandParent}
                      initialValue={editRoleData ? editRoleData.nodeCodes : ""}
                      onCheck={this.onCheck}
                      checkedKeys={this.state.checkedKeys}
                      // checkedKeys={'f3904631510845f3a63828f1cf5bae6f'}
                      // checkedKeys={this._getDataRole(this.props.roleManage.groupRoleNavData?this.props.roleManage.groupRoleNavData.navTree:"")}
                      onSelect={this.onSelect}
                      selectedKeys={this.state.selectedKeys}
                    >
                      {this.renderTreeNodes(menuRoleData)}
                    </Tree>
                  </FormItem>
                  {/*</Spin>*/}
                </Col>
              </Row>

              <Row style={{ minHeight: "40px" }} type={'flex'} justify={'center'}>
                <Col {...layoutSave}>
                {/*<div style={{ height: "40px" }} />*/}
                {/*<FooterToolbar>*/}
                <FormItem style={{ marginTop: "10px" }}>
                  <Button type="primary" htmlType="submit" loading={submitting} style={{marginRight:"12px"}}>
                    保存
                  </Button>
                  <JumpLink name="取消" link="/powerManage/roleManage" />
                </FormItem>
                {/*</FooterToolbar>*/}
                </Col>
              </Row>
            </Card>
          </Form>
          <Modal
            visible={this.state.visible}
            title="保存"
            /* onOk={this.handleOk}*/
            onCancel={this.handleCancel}
            footer={[
              <Button type="primary" key="back" onClick={this.handleCancel}>知道了</Button>
            ]}
          >
            <p>必须分配至少一个角色权限</p>
          </Modal>
          </div>
      </PageHeaderLayout>
    );
  }
}
