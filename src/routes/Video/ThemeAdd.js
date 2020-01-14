import React, { Component ,Fragment } from "react";
import { connect } from "dva";
import {
  Button,
  Card,
  Col,
  Divider,
  Form,
  message,
  Row,
  Spin,
  Steps,
  Icon,
  Upload,
  Input,
  Modal,
  Table,
  Select
} from "antd";
import styles from "./style.less";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import { CHECK_WORD_FIFTY } from "../../utils/pattern";
import ColFormItem from "components/ColFormItem/index";
import { editMyToolsColumns } from "../APPLY/columns";
import Editor from "wangeditor";
import { getOssClient } from "../../utils/oss";
import { getItem, removeItem, uploadPath } from "../../utils/utils";
import FooterToolbar from "components/FooterToolbar";
import JumpLink from "components/Button/JumpLink";
import $ from "jquery";
import request from "../../utils/request";
const { Option } = Select;
import { codeMark, getVideoStatus } from "../../utils/options";
import UploadVideo from "../../components/Video/video-list/upload-video";
import ImageUpload from "../../components/upload/ImageUpload";
import FileItem from "../../components/custom/FileItem";
import { heartbeat, notify, progress } from "../../utils/resource-task";
import store from "../../index";
import * as routerRedux from "react-router-redux";
const FormItem = Form.Item;
/*import "../../js/aliyun-oss-sdk-5.3.1.min";
import "../../js/aliyun-upload-sdk-1.5.0.min";*/
const formItemLayout = {
  labelCol: {
    span: 5
  },
  wrapperCol: {
    span: 19
  }
};
const formItemLayoutText = {
  labelCol: {
    span: 2
  },
  wrapperCol: {
    span: 22
  }
};
/**
 * 视频类型添加
 */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects["video/videoTypeGroup"]
}))
@Form.create()
export default class ThemeAdd extends Component {
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
      visible1:false,
      previewVisible: false,
      previewImage: "",
      editDetail:{},
      dataSource:[],
      updateToolsType:"",
      _setModal:false,
      _type:0,
      _record:{},
      helpName:"",//校验视频主题
      disabled: false,
      initializeCode: this.props.location && this.props.location.query ? this.props.location.query.code : '',//新建视频时初始化视频主题编号
      sort: this.props.location && this.props.location.query ? this.props.location.query.sort : 1,
    };
    this._disabled = false;
    this.uploadScript = React.createRef();
    this.getNewInputFile = React.createRef();
    let query = this.props.location.query;
    if (query) {
      sessionStorage.setItem("annoroad-edit-videoThemeDetail-code",query.code);
      if(query.code==undefined||query.code==""){
        this.getThemeCode();
      }
    }
  }
  componentDidMount() {
    /*$(window).on('beforeunload', function (event) {
      event.returnValue = "离开页面将丢失信息";
      this.signOut();
      const submit = document.getElementById("cancleBtn");
      submit.onClick();
      return "离开页面将丢失信息！";
    })*/
    const that = this;
    setInterval(() => this.heartBeat(), 1*60*1000);
    /*let timer = setInterval(function() {
      thst.heartBeat();
      console.log("1111",that.props.video.videoGroupData);
      const videoGroupData = that.props.video.videoGroupData;

        /!*clearInterval(timer);*!/
      // });
    }, 5000);*/
    // 获取视频类型
    this.getVideoTypeList();
    //获取真实dom，创新富文本编辑器
    for (var div = 0; div < 2; div++) {
      const divId = '#div_' + div;
      const editor = new Editor(divId);
      if (editor.toolbarSelector == '#div_0') {
        var editorVideoIntroduce = editor;
      }
      else if (editor.toolbarSelector == '#div_1') {
        var editorResultExplain = editor;
      }
      editor.customConfig.onchange = (html) => {
        //将html值设为form表单的desc属性值
        if (editor.toolbarSelector == '#div_0') {
          this.props.form.setFieldsValue({
            'videoIntroduce': html
          });
        }
      }
      editor.customConfig.showLinkImg = false
      // editor.txt.html();
      editor.customConfig.customUploadImg = function(files, insert) {
        let client = getOssClient();
        if (client) {
          for (var i = 0; i < files.length; i++) {
            const path = uploadPath("/source/editor/upload", files[i]);
            client.put(path, files[i]).then(function(result) {
              client.putACL(path, 'public-read').then(()=>{
                //let url  = client.signatureUrl(path, {expires: 3600 * 24 * 365 * 10});
                insert(result.url);
              });
              }
            );
          }
        }
      }
      editor.create();
    }
    const videoThemeDetail_code =sessionStorage.getItem("annoroad-edit-videoThemeDetail-code")
    if(videoThemeDetail_code===undefined||videoThemeDetail_code==='undefined'||videoThemeDetail_code===''){
      return;
    }else{
      /**
       * 获取主题详情
       */
      request('/annoroad-cloud-mis-server/video/theme/detail',{body:{
        code:videoThemeDetail_code?videoThemeDetail_code:'',
        typeCode:this._typeCode,
      }}).then((data)=>{
      if(data) {
        if (data.code === "000000") {
          this.setState({themeDetail:data.data});
          this.setState({videoIntroduce:data.data.videoIntroduce});
          editorVideoIntroduce.txt.html(data.data.videoIntroduce);
        }
      }})
    }

    //获取视频列表
    const _themeCode =  sessionStorage.getItem("annoroad-edit-videoThemeDetail-code");
    if(_themeCode !== 'undefined'){
      this.getVideoList(_themeCode);
    }

  }

  /**
   * 获取视频主题编号（新建视频）
   */
  getThemeCode=()=>{
    request('/annoroad-cloud-mis-server/video/theme/initial/save',{body:{
      }}).then((data)=> {
      if (data) {
        if(data.code=='000000'){
          this.setState({
            initializeCode:data.data.code
          })
        }

      }
    })
  }

  /**
   * 获取视频列表
   */
  getVideoList =(_themeCode) =>{
    request('/annoroad-cloud-mis-server/video/list',{body:{
        themeCode:_themeCode,
      }}).then((data)=>{
        if(data) {
          if (data.code === "000000") {
            this.props.dispatch({
              type: "video/saveVideoGroup",
              payload: data.data
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
   * 获取视频类型
   */
  getVideoTypeList=()=>{
    const value = {
      status: 1
    };
    this.props.dispatch({
      type: "video/videoTypeGroup",   //获取视频类型
      payload: value
    });
  }

  layoutSlx(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      //xl: { span: 12 },
      xl: { span: 10, offset: !value ? 0 : 1 }
    };
  }
  layoutText(value) {
    return {
      sm: { span: 24 },
      md: { span: 12 },
      xl: { span: 24, offset: !value ? 1 : 0 }
    };
  }

  /**
   * 提交表单
   * */
  submit = (e) => {
    e.preventDefault();
    this.setState({_type: 0});
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const videoThemeDetail_code =sessionStorage.getItem("annoroad-edit-videoThemeDetail-code");
        if(videoThemeDetail_code !=='undefined'){
          values.code = videoThemeDetail_code;
          values.sort =this.state.sort;
        }else{
          values.code = this.state.initializeCode;
        }
        values.name=values.themeName?values.themeName:this.state.themeDetail.name;
        values.privacy=values.privacy?values.privacy:1;
        let videoList = this.props.video.videoGroupData;
        let arr =[];
        let _error = [];
        videoList&&videoList.length>0?videoList.map(value=>{
          arr.push(value.code);
          if(value._mark === 1){
            _error.push(value._mark);
            return false;
          }
          }):"";
        values.videoCode=arr;
        if(_error.length>0){
          message.error("视频上传中禁止保存");
        }else{
          request('/annoroad-cloud-mis-server/video/theme/save',{body:{
              ...values,
            }}).then((data)=>{
            if(data) {
              if (data.code === "000000") {
                this.setState({updateToolsType:""})
                sessionStorage.clear('annoroad-edit-videoThemeDetail-code')
                this.props.history.push("/video/theme-list");
              } else {
                message.error(codeMark[data.code]);
              }
            }else{
              message.error("系统异常");
            }
          })
        }
      }
    })
  }


  //校验用户名
  checkName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        helpName: "请输入",
        //visible: !!value
      });
      callback("error");
    } else {
      this.setState({
        helpName: ""
      });
      if (value.length < 1 || value.length > 50) {
        this.setState({
          helpName: "视频主题过长",
          //visible: !!value
        });
        callback("error");
      } else {
        callback();
      }
    }
  };
  /**
   * 心跳连接
   */
  heartBeat = () => {
    let _count = 0;
    const _videoGroupData = this.props.video.videoGroupData&&this.props.video.videoGroupData!=0?this.props.video.videoGroupData:[];
    _videoGroupData.map((item,index)=>{
      if(item._mark==1){
        _count++;
      }
    });
    if(_count>0){
      heartbeat();
    }
  };
  change_disabled=(groupData)=>{
    const _groupData = groupData&&groupData.length>0?groupData:[];
    _groupData.map((item)=>{
      if(item._mark==1){  //调用心跳借口
        // this.setState({disabled:true});
        this._disabled = true;
      }else{
        // this.setState({disabled:false});
        this._disabled = false;
      }
    });

  }
  //取消退出
  signOut = () =>{
    sessionStorage.clear('annoroad-edit-videoThemeDetail-code');
    this.uploadVideo.childFunciton();
  }
  onRef = (ref) =>{
    this.uploadVideo =ref;
  }
  componentWillUnmount() {
    sessionStorage.clear('annoroad-edit-videoThemeDetail-code');
    this.props.video.videoGroupData=[];
    this.props.video.deleteVideoCode=[];
  }

  componentWillReceiveProps(nextProps,nextStates){
    // this.change_disabled(this.props.video.videoGroupData)
    this.props.video.videoGroupData&&this.props.video.videoGroupData.length>0?this.props.video.videoGroupData.map((item, index) => {
      const  that =this;
    }):'';
  }

  render() {
    const { form, loading, submitting, dispatch, toolsType,video} = this.props ;
    const { groupData,videoGroupData  } = video;
     const { dataSource,} = groupData;
    const { getFieldDecorator } = form;
    let videoGroupDataSource = videoGroupData&&videoGroupData.length>0?videoGroupData:'';
    let _list = [];
    groupData&&groupData.dataSource?groupData.dataSource.map(value=>{
      _list.push({
          key:value.code,
          value:value.name,
        });
    }):"";

    return <PageHeaderLayout
      title="视频列表"
      breadcrumbList={[{title: "视频管理"},{title: "视频列表"}]}
    >
      <div className={styles.videoThemeAdd}>
        <Form  onSubmit={(e) => this.submit(e)}  >
          <Spin spinning={this.state.loading}>
            <Card title="基本信息">
              <Row className={styles.info}>

                <Col md={6} sm={24} xl={12} offset={0}>
                  <FormItem label="视频主题"  help={this.state.helpName} className={styles.themeNameItem}  >
                    {getFieldDecorator("themeName", {
                      rules: [
                        {
                          required: true,
                          message: "请输入"
                        },{
                          validator: this.checkName
                        }
                      ],initialValue:(this.state.themeDetail ? this.state.themeDetail.name: "")
                    })(<Input size="large" placeholder="请输入" />)}
                  </FormItem>
                </Col>
                <Col md={6} sm={24} xl={12} offset={0}>
                  <FormItem label="视频类型" className={styles.videoTypeItem }>
                    {getFieldDecorator("typeCode",{
                      rules: [
                        {
                          required: true,
                          message: "请选择"
                        }
                      ],initialValue: this.state.themeDetail&&this.state.themeDetail.typeCode ? this.state.themeDetail.typeCode : undefined} )(
                      <Select placeholder="请选择" style={{ width: "97%" }}>
                        {groupData&&groupData.dataSource ? groupData.dataSource.map((value, index) => (
                          <Option key={index} value={value.code}>{value.name}</Option>
                        )):""}
                      </Select>
                    )}
                  </FormItem>
                </Col>
              </Row>
              <Row>
                <Col
                  xl={{ span: 10, offset: 0 }}
                  className={styles.toolImg}
                >
                  <ImageUpload
                    form={this.props.form}
                    {...this.props} required={true}
                    code={sessionStorage.getItem('annoroad-edit-videoThemeDetail-code')}
                    initialValue={this.state.themeDetail?this.state.themeDetail.cover:''}
                    label="封面"
                    difference={1}
                  />
                </Col>
              </Row>
              <Row className={styles.videoText} >
                <Col
                  sm={24}
                  md={24}
                  lg={12}
                  xs={2}
                  xl={{ span: 24, offset: 0 }}
                >
                  <FormItem label="视频简介" className={styles.videoIntroduce} {...formItemLayoutText} style={{zIndex:"1"}}>
                    <div id="div_0"></div>
                  </FormItem>
                  <ColFormItem
                    layout={this.layoutText(1)}
                    formItemLayout={formItemLayoutText}
                    form={form}
                    label="视频简介"
                    initialValue={this.state.videoIntroduce}
                    placeholder="富文本信息"
                    parameter="videoIntroduce"
                    style={{display:"none",border:"2px solid red"}}
                  />
                </Col>
              </Row>
            </Card>
          </Spin>
          <FooterToolbar>
            <FormItem className={styles.btnBox}>
              <Button
                htmlType="submit"
                loading={loading}
                className={styles.saveBtn}
                /*disabled={this.state.disabled}*/
              >
                保存
              </Button>
              <Button   loading={this.state.loading} id="cancleBtn"  onClick={this.signOut} >
                取消
              </Button>
              {/*<JumpLink name="取消" link="/video/theme-list" />*/}
            </FormItem>
          </FooterToolbar>
        </Form>
        <Card title="视频上传" style={{marginTop:"24px",marginBottom:"24px"}}>
          <Row>
            <UploadVideo list = {videoGroupDataSource} video={video} themeCode={this.state.initializeCode}  onRef = {this.onRef} />
          </Row>
        </Card>


      </div>
    </PageHeaderLayout>;
  }
}
