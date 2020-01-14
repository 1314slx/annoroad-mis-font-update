import React, { Component } from "react";
import { connect } from "dva";
import {
  Button,
  Card,
  Col,
  Form,
  Row,
  Radio,
  Select,
  Input,
  Icon,
  Modal,
  Upload,
  Tooltip,
  message
} from "antd";
const RadioGroup = Radio.Group;
import styles from "./style.less";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import JumpLink from "components/Button/JumpLink";
const FormItem = Form.Item;
import { codeMark } from "../../utils/options";
import TableForm from "./WhiteList";
import XLSX from 'xlsx';
import ConfirmModal from "components/ConfirmModal";
import { CELL_NUMBER } from "../../utils/pattern";
import request from "../../utils/request";
import {equals} from "../../utils/utils";

let that;

/**
 * 视频列表-授权-白名单
 * */
@connect(({ video }) => ({
  video,
}))
@Form.create()
export default class ThemeCheck extends Component {
  constructor(props) {
    super(props);
    let query = this.props.location.query;
    this.state = {
      status: this.props.location && this.props.location.query ? this.props.location.query.privacy : 1,
      name:"",
      mobile:"",
      visible:false,
      visible1:false,
      currentRecord: null,
      _pageSize:20,
      theme_code:'',
      myStyle:{},
      theme_name:this.props.location && this.props.location.query ? this.props.location.query.name : 1,//视频主题名称
    };
    this._mark = 0;
    this.con_column =0;//导入表格是否含有电话、单位、姓名
    this.uploadScript = React.createRef();
    if (query) {
      sessionStorage.setItem("annoroad-edit-videoTheme-code",query.code);
      sessionStorage.setItem("annoroad-edit-videoTheme-themeCode",query.themeCode);
      sessionStorage.setItem("annoroad-edit-videoTheme-themeName",query.name);
    }
    that = this;
  }
  componentDidMount() {
    if(this.state.status==2){
      this.getListData();
      this.getListDataSearch();
    }
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.scrollHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }

  /**
   * 删除白名单
   * @param 每条信息
   * @private
   */
  _deleteConfirm = (record)=>{
    this.setState({
      visible1: true,
      currentRecord: record
    });
  }

  /**
   * 获取列表数据
   * @param params
   */
  getListData(params) {
    this.setState({
      name:"",
      mobile:"",
    });
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: params && params.pageSize ? params.pageSize : 20,
      themeCode:sessionStorage.getItem("annoroad-edit-videoTheme-code")
    };
    this.props.dispatch({
      type: "video/whitelistList",
      payload: value
    }).then(() => {
      const { _saveDataCodeMark } = this.props.video;
      if (_saveDataCodeMark) {
        /*if(_saveDataCodeMark=='000000'){

        }*/
      }
    })
  }
  /**
   * 获取列表数据-> 检索
   * @param params
   */
  getListDataSearch(params) {
    this.setState({
      name:"",
      mobile:"",
    })
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 20
    };

    this.props.dispatch({
      type: "video/searchWhiteList",
      payload: value
    }).then(() => {
      const { _saveDataCodeMark } = this.props.video;
      if (_saveDataCodeMark) {
        if(_saveDataCodeMark=='000000'){
          //this.getListData();
        }
      }
    })
  }

  /**
   * 切换单选按钮
   * @param e
   */
  onChange = (e) => {
    this.setState({
      status: e.target.value,
    });
    if(e.target.value==2){
      this.getListData();
      // this.getListDataSearch();
    }
  }

  /**
   * 动态搜索
   * @param e
   * @private
   */
  _onChangeData = (e, status) => {
    e.preventDefault();
    if(status === 1) {
      this._name = e.target.value
    } else if( status === 2) {
      this._mobile = e.target.value
    }
    const value = {
      name : this._name,
      mobile : this._mobile,
      themeCode:sessionStorage.getItem('annoroad-edit-videoTheme-code'),
    };
    this.props.dispatch({
      type: "video/whitelistList",
      payload: value
    });
  }

  // 表单搜索
  onSubmit = (err, value) => {
    if (err) {
      return;
    }
    const values = {
      ...value,
      pageNo: 1,
      pageSize: 20
    };
    // 获取整个列表数据
    this.getListData(values);
  };

  //翻页
  pagination = pageNumber => {
    console.info("themeCheck",pageNumber)
    const params = {
      name:this.state.name,
      mobile:this.state.mobile,
      pageNo: pageNumber,
    };
    this.getListData(params);
  };
  // 重置
  onReset=()=>{
    //this.getListData();
  }

  // 查看列是否含有手机号、姓名、单位
  checkClumn = (data) =>{
    return new Promise((resolve,reject)=>{
      if(data){
        const _ary = ["手机号", "姓名", "单位"];
        let _list = [];
        for(let item in data){
          if(item.substr(1) === '1'){
            const _value = data[item]?data[item].v:false;
            _list.push(_value);
          }
        }
        let _tmpArr = [];
        for(let i = 0,j=_list.length;i<j;i++){
          const _tmpObj = _list[i];
          if(_ary.indexOf(_tmpObj)===-1){
            switch (_tmpObj) {
              case '手机号':
              case '姓名':
              case '单位':
                reject('列名称需包含：姓名、手机号、单位');
                break;
            }
          }else{
            _tmpArr.push(_tmpObj);
          }
        }
        equals();
        if(_ary.equals(_tmpArr)){
          resolve();
        }else{
          reject('列名称需包含：姓名、手机号、单位')
        }
      }
    })




    /*var _value = value[0];
    var arr = []
    var i = 0
    for(var key in _value){
      arr[i]=key;
      i++;
    }
    var _ary = ["手机号", "姓名", "单位"];
    for(var i = 0;i<arr.length;i++){
      for(var j = 0;j<_ary.length;j++){
        if(arr.indexOf(_ary[j])<0){
          this.con_column =1;
          message.error("列名称需包含：姓名、手机号、单位")
          return false;
        }
      }
    }*/
  }

  canNotEmpty(data){
    return new Promise((resolve,reject)=>{
      if(data) {
        let _flag = false;
        for (let i = 0, j = data.length; i < j; i++) {
          const _tmp = data[i];
          var numberCheck = /^1\d{10}$/;
          if(!numberCheck.test(_tmp)){
            message.error("手机号格式错误！");
            reject();
            break;
          }
          if (!_tmp) {
            _flag= true;
            message.error("手机号不能为空！");
            reject();
            break;
          }
        }
        if(!_flag){
          resolve();
        }
      }else{
        /// ？？？？
        reject();
      }
    })
  }

  // 手机号去重校验
  checkMobile=async(_data, value, _groupData)=> {
    //this.checkClumn(_data);
    if(this.con_column>0){
      return;
    }
    let arr = value;
    this.canNotEmpty(arr).then(()=>{
      repeat:for(let i=0;i<arr.length;i++){
        for (let j=i+1;j<arr.length;j++){
          if(arr[i]==arr[j]){
            this._mark =1;
            message.error("重复手机号");
            break repeat;
          }
        }
      }
      if(this._mark == 0){
        this._importData(_groupData);
      }

    })



  }

  // 导入数据
  _importData=(value)=>{
    const { dispatch } = this.props;
    const params={
      params:value,
      themeCode:sessionStorage.getItem('annoroad-edit-videoTheme-code'),
    }
    dispatch({
      type: "video/importData",
      payload: params
    }).then(()=>{
      const { actionStatus } = this.props.video;

      if(actionStatus){
        message.success('导入成功！');
        this.getListData();
      }

    });
  }

  /**
   * 显示弹窗
   */
  info=()=>{
    this.setState({
      visible:true,
    })
  }


  /**
   * 保存隐私状态
   */
  btn_submit = () =>{
    if(this.state.status ==2){
      if(this.props.video.whiteListData.datas&&this.props.video.whiteListData.datas.length<1){
        message.error("白名单不为空")
        return;
      }
    }
    request('/annoroad-cloud-mis-server/video/theme/update/privacy',{body:{
        code: sessionStorage.getItem('annoroad-edit-videoTheme-code'),
        privacy:this.state.status
      }}).then((data)=>{
        if(data) {
          if (data.code === "000000") {
            this.props.history.push("/video/theme-list");
            this.setState({
              currentRecord: null,
              visible1: false,
            });
          }else {
            message.error(codeMark[data.code]);
          }
        }else{
          message.error("系统异常");
        }
      })
  }

  /**
   * 关闭弹窗
   */
  handleCancel=()=>{
    this.setState({
      visible:false,
      visible1:false,
    })
  }


  componentWillUnmount() {
    this.setState({
      status:''
    });
    this.con_column=0;
    this._mark=0;
  }

  render() {
    const { form, video, loading } = this.props;
    const { whiteListData} = video;
    const { total, dataSource } = whiteListData;
    const { getFieldDecorator } = form;
    const theme_name = sessionStorage.getItem("annoroad-edit-videoTheme-themeName");

    const uploadprops = {
      // 这里我们只接受excel2007以后版本的文件，accept就是指定文件选择框的文件类型
      name: 'file',
      headers: {
        authorization: 'authorization-text',
      },
      showUploadList: false,
      // 把excel的处理放在beforeUpload事件，否则要把文件上传到通过action指定的地址去后台处理
      // 这里我们没有指定action地址，因为没有传到后台
      beforeUpload: (file, fileList) => {
        var ext = file.name.slice(file.name.lastIndexOf(".") + 1).toLowerCase();
        if (ext === 'xls' || ext === 'xlsx') {
          var rABS = true;
          const f = fileList[0];
          var reader = new FileReader();
          reader.onload = function(e) {
            var data = e.target.result;
            if (!rABS) data = new Uint8Array(data);
            var workbook = XLSX.read(data, {
              type: rABS ? 'binary' : 'array'
            });
            // 假设我们的数据在第一个标签
            var first_worksheet = workbook.Sheets[workbook.SheetNames[0]];
            // XLSX自带了一个工具把导入的数据转成json
            //var jsonArr = XLSX.utils.sheet_to_json(first_worksheet, {header:1});
            var jsonArr = XLSX.utils.sheet_to_json(first_worksheet);
            that.checkClumn(first_worksheet).then(()=>{
              let _data = jsonArr.slice(0);
              let _groupData = [];
              this.con_column = 0;
              this._mark = 0;
              let _groupMobile = [];
              if (_data) {
                _data.map((value, index) => {
                  _groupData.push({
                    name: value['姓名']?value['姓名']:'',
                    mobile: value['手机号'] + "",
                    units: value['单位']?value['单位']:'',
                  });
                  _groupMobile[index]=value['手机号'];
                });
                that.checkMobile(_data,_groupMobile,_groupData);
              }
            }).catch((value)=>{
              message.error(value);
            })
          }
          // 通过自定义的方法处理Json，比如加入state来展示
          //handleImpotedJson(jsonArr.slice(1));
          if (rABS) reader.readAsBinaryString(f); else reader.readAsArrayBuffer(f);
          return false;
        }else{
          message.error('请上传xls、xlsx格式的文件');
        }
      }
    };
    return <PageHeaderLayout
      title="视频列表"
      breadcrumbList={[{title: "视频管理"},{title: "视频列表"}]}
    >
      <div className={styles.themeCheck_wapper} style={this.state.myStyle}>
        <Card title={theme_name} loading={loading} style={{padding:0}}>
          <Form>
            <div className={styles.btnBox}>
              <Form.Item
                label="隐私设置"
              >
                <RadioGroup onChange={this.onChange} value={this.state.status}>
                  <Radio value={1}>公开</Radio>
                  <Radio value={2}>非公开</Radio>
                </RadioGroup>
                <span style={{color:"rgba(0, 0, 0, 0.447)"}}>(客户默认被分享)</span>
              </Form.Item>
            </div>
          </Form>
          {this.state.status==2?
            <div>
              <Form onSubmit={this.onSubmit} layout="inline" style = {{marginBottom:"24px"}}>
                <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
                  <Col md={10} sm={24}>
                    <FormItem
                      label="姓名"
                      help={this.state.value1}
                    >
                      {getFieldDecorator("name", {
                        initialValue: this.state.name ? this.state.name : "",
                        rules: [
                          {
                            required: false,
                            message:"请输入"
                          }
                        ]
                      })(<Input placeholder="请输入" onChange={(e)=>this._onChangeData(e, 1)} />)}
                    </FormItem>
                  </Col>
                  <Col md={10} sm={24}>
                    <FormItem
                      label="手机号"
                      help={this.state.value1}
                    >
                      {getFieldDecorator("mobile", {
                        initialValue: this.state.mobile ? this.state.mobile : "",
                        rules: [
                          {
                            required: false,
                            message:"请输入"
                          }
                        ]
                      })(<Input placeholder="请输入"  onChange={(e)=>this._onChangeData(e, 2)} />)}
                    </FormItem>
                  </Col>
                  <Col md={4} sm={24} style={{textAlign:"right"}}>
                    <Upload accept='.xls, .xlsx' {...uploadprops}>
                      <Tooltip title='导入excel文件'>
                        <Button  type="primary" >
                          {/*<Icon type="upload" />*/} 导入数据
                        </Button>
                      </Tooltip>
                    </Upload>
                    <a style={{marginLeft:"5px"}} onClick={this.info}><Icon type="question-circle" /></a>
                  </Col>
                </Row>
              </Form>
              <Row title="" bordered={false} >
                {getFieldDecorator("whitestList", {
                  initialValue: dataSource
                })(<TableForm refresh={(params) => this.getListData(params)} {...this.props}  total = {total} themeCode={sessionStorage.getItem('annoroad-edit-videoTheme-code')} />)}
              </Row>
            </div>:""}
          <Row style={{textAlign:'center'}}>
            <Button
              onClick={this.btn_submit}
              loading={loading}
              className={styles.saveBtn}
              style={{marginRight:'12px'}}
              type="primary"
            >
              保存
            </Button>
            <JumpLink name="取消" link="/video/theme-list"  />
          </Row>
        </Card>
      </div>
      <Modal
        visible={this.state.visible}
        title="导入要求"
        /* onOk={this.handleOk}*/
        onCancel={this.handleCancel}
        style={{top:"190px"}}
        footer={[
          <Button type="primary" key="back" onClick={this.handleCancel}>知道了</Button>
        ]}
      >
        <p>1. 文件格式：.xls、xlsx</p>
        <p>2. 必须包含手机号、姓名、单位列</p>
      </Modal>
      <ConfirmModal
        visible={this.state.visible1}
        // onOk={this.handle_delete}
        confirmLoading={this.state.confirmLoading}
        onCancel={this.handleCancel}
      >
        <span style={{ fontWeight: "800" }}>删除确认</span><br/>
        <span style={{ color: "#999",margin:"12px 0 0 30px",display:"block", }}>确定删除吗？</span>
      </ConfirmModal>
    </PageHeaderLayout>;
  }
}
