import React, { Component } from "react";
import { connect } from "dva";
import {
  Modal, Button, Form, message, AutoComplete, Input, TreeSelect, Tree, Select, Row, Col, Card, Divider
} from "antd";
import ColFormItem from "components/ColFormItem";
import * as routerRedux from "react-router-redux";
import styles from "../../style.less";
const FormItem = Form.Item;
import { hashHistory } from "react-router";
import { getMyToolStatus } from "../../../../utils/options";
const { Option } = Select;
/*class NewSignature extends Component {*/
let myStyle = {};
let myStyleInput = {};
@Form.create()
export default class NewSelectFile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      defaultValue:[],
      idLength:0,
      value1 : "",
      value2 : "",
      isUpdate: false,
      _value:false,
      _getOptions:[],
      isADD:false,
      newRandomKey:'',
      selectValue: []
      //testData:this.props.toolsType.modalInputData||[],
    };
    this.tmpArray1=[]

  }
  componentWillReceiveProps(nextProps,nextStates){
    this.setState({
      _getOptions: nextProps.updateRecord.options,
      //testData:nextProps.toolsType.modalInputData,
    });
    //toolsType: { testList, modalInputData: inputList }} = this.props;
    if(nextProps.updateType === 4 && !this.state.isUpdate ){
      this.setState({
        isUpdate: true,
        _value : true
      })

      let record = nextProps.updateRecord;
      var newobj = {};
      for (let attr in record) {
        newobj[attr] = record[attr];
      }
      if(newobj.defaultValue){
        newobj["defaultValue"] = newobj.defaultValue.split(",");
      }
      if(!this.state.isADD){
        this.props.form.setFieldsValue(nextProps.updateRecord);
      }
      this.setState({visible:true});
      this.props.dispatch({
        type: "toolsType/changeModalInputData",
        payload: nextProps.updateRecord.options
      });
    }
  }

  //取消
  _onCancel = () => {
    this.setState({visible:false});
    this.props.form.resetFields();
    this.setState({
      isUpdate : false,
      _value : false,
      isADD : false,
      value1:"",
      value2 : ""

    });
    this.tmpArray1=[];
    this.props.setUpdateType();
    this.props.toolsType.modalInputData=[
      {
        id: 0,
        //field: "example",
        text: "example11",
        value: "value1"
      },
      {
        id: 1,
        //field: "example",
        text: "example2",
        value: "value2"
      },
      {
        id: 2,
        //field: "example",
        text: "example3",
        value: "value3"
      }
    ];
    // this.props.toolsType.tmpArray1=[];
  };
  // 保存
  _onSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {

      for(let i =0; i<10;i++){
        let _value = values['operations'+i+'_field'];
        if(_value&&_value.length>10){
          message.error("可选项的值限制在1-10个字符")
          return;
        }
        if(i<3){
          if(!values['operations'+i+'_field']&&values['operations'+i+'_field'] ==undefined || !values['operations'+i+'_VALUE']&&values['operations'+i+'_VALUE'] ==undefined){
            message.error("至少包含3组可选项");
            return;
          }
        }/*else{
          if(values['operations'+i+'_field'] ==undefined || values['operations'+i+'_VALUE'] ==undefined){
            message.error("可选项必填11");
            return;
          }
        }*/
      }
      const _optionsList = [];
      if (!err) {
        const { toolsType: { modalInputData }} = this.props;
       // const _len =this.state.testData.length;
        let _optionsList = [];
        for(let i =0; i<10;i++){
          if(values['operations'+i+'_field']){
            _optionsList.push(
              {text:values['operations'+i+'_field'],value:values['operations'+i+'_VALUE']}
            );
          }
        }
        if(_optionsList.length<3){
          message.error("至少包含3组可选项");
          return;
        }
        const { dispatch } = this.props;
        const params = {
          key:this.state.isADD?this.props.toolsType.dataSourceModal.length:this.props.updateRecord.key,
          fieldName:values.fieldName,//字段名称
          paramName:values.paramName, //参数名称
          type:4, //参数类型
          options:_optionsList,//可选项
          defaultValue:values.defaultValue,//示例参数
        };
        dispatch({
          type: "toolsType/inputFileSubmit",
          payload: params
        });
        this.props.form.resetFields();
        this.setState({visible:false,isUpdate:false,isADD:false});
        this.props.setUpdateType();
        this.tmpArray1=[];
      }
    });
  };

  //保存
  _onOkHandler = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

  // select 切换2
  handleBlur = () => {
  };
  // select 切换3
  handleFocus = () => {
  };
  // select 切换3
  /*  handleChange = () => {
    };*/
  // 单选选的添加
  _showModal = () => {
    this.setState({
      visible:true,
      isUpdate:false,
      isADD:true,
      newRandomKey:Math.random()
    });
    if(this.state._value === false){
      this.props.form.resetFields();
    }
    this.props.toolsType.modalInputData=[
      {
        id: 0,
        //field: "example",
        text: "选项名",
        value: "value"
      },
      {
        id: 1,
        //field: "example",
        text: "选项名",
        value: "value"
      },
      {
        id: 2,
        //field: "example",
        text: "选项名",
        value: "value"
      }
    ];
  };

  //添加按钮
  handleAdd = () => {
    const { toolsType: { modalInputData }, dispatch } = this.props;
    const maxId = modalInputData[modalInputData.length - 1].id;
    this.setState({idLength:modalInputData.length})
    this.setState({idCount:maxId});
    dispatch({
      type: 'toolsType/changeModalInputData',
      payload: {
        type: "add",
        data: {
          id: maxId + 1,
          //field: "",
          text: "",
          value: ""
        }
      }
    });
  }
  //鼠标离开事件
  handleInputChange = (event, item, flag)  => {
    if(flag=="text"){
      if(event.target.value.length>10){
        message.info("请输入1-10个字符的可选项值")
      }
    }
      this.props.dispatch({
        type: 'toolsType/changeModalInputData',
        payload: {
          type: "change",
          flag,
          data: {
            id: item.id,
            value: event.target.value
          }
        }
      });
    this.changeSelectValue();


  }
//  input触发
  handleModalInputDataChange = (event, item, flag) => {
    let _array = this.props.toolsType.modalInputData;
    if(flag=="text"){
      this.checkValue(item.id,event.target.value);
    }
    this.props.dispatch({
      type: 'toolsType/changeModalInputData',
      payload: {
        type: "change",
        flag,
        data: {
          id: item.id,
          value: event.target.value
        }
      }
    });
    /*if(flag=="text"){
      let _value = _array[item.id].text;
      this.checkValue(item.id,_value);
    }*/
   this.changeSelectValue()
  }
  changeSelectValue = () =>{
    //实时更新select选中的值
    const newList = [];
    const lists = this.props.toolsType.modalInputData;
    lists.forEach((data) => {
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id === data.id) {
          newList[i][data.text] = data.text;
          newList[i][data.value] = data.value;
          return;
        }
      }
      if( data.text!=="选项名" && data.text!=="" && data.value!=="value"&& data.value!==""){
        newList.push({
          id:data.id,
          text: data.text,
          value: data.value,
        });
      }
    });
    this.tmpArray1 = newList;
    if (!this.selectObj) {
      return;
    }
    for (let i = 0, j = this.tmpArray1.length; i < j; i++) {
      const _tmpObj = this.tmpArray1[i];
      if (this.selectObj.value == _tmpObj.value) {
        this.setState({
          selectValue: _tmpObj.value
        }, () => {
          this.props.form.setFieldsValue({
            defaultValue: this.state.selectValue
          });
          this.selectObj = {
            text: _tmpObj.text,
            value: _tmpObj.value
          };
        });

      }
      if (this.selectObj.text == _tmpObj.text) {
        this.setState({
          selectValue: _tmpObj.value
        }, () => {
          this.props.form.setFieldsValue({
            defaultValue: this.state.selectValue
          });
          this.selectObj = {
            text: _tmpObj.text,
            value: _tmpObj.value
          };
        });
      }
    }
  }
  checkValue=(id,value)=>{
    let _id= document.getElementById("divItem"+id)
    let _idSpan= document.getElementById("span"+id)
    if(value.length>10||value.length<1){
      if(_id&&_idSpan){
        _id.style.position="relative";
        _idSpan.style.position="absolute";
        _idSpan.style.display="block";
        return;
      }
    }else{
      if(_id&&_idSpan){
        _id.style.position="initial";
        _idSpan.style.position="initial";
        _idSpan.style.display="none";
      }
    }
  }
  // 删除
  handleDelete = item => {
    const {  dispatch, form: { getFieldValue, setFieldsValue }} = this.props;
    const defaultValue = getFieldValue("defaultValue");  //字符串
    //const newExeParams = defaultValue && defaultValue.filter( id => id !== item.id);
    dispatch({
      type: 'toolsType/changeModalInputData',
      payload: {
        type: "delete",
        data: {
          id: item.id
        }
      }
    })
    const _this = this;
    setTimeout(() => {
      if(item.value==defaultValue){
          setFieldsValue({
            defaultValue: ""
          });
      }
      // _this.tmpArray1 = this.props.toolsType.modalInputData
      _this.changeSelectValue()
      //this._setCurrentDefault();
    }, 0);
  }

  _setCurrentDefault(){
    const {defaultValue} = this.state;
    const _modalInputData = this.props.toolsType.modalInputData;
    let _defaultValue = [];
    if(defaultValue !=0 ){
      _modalInputData.map((item)=>{
        defaultValue.map((value)=>{
          if(item.value === value.split('_')[0]){
            _defaultValue.push(value);
          }
        })
      });
      this.props.form.setFieldsValue({
        defaultValue: _defaultValue,
      });
    }
  }
// 切换实例参数
  handleChange = (value)=>{
    this._setDefault(value);
  }

  //修改select的值
  _onChange = (value) => {
    this.setState({
      selectValue: value
    }, () => {
      const _data = this.tmpArray1;
      for (let i = 0, j = _data.length; i < j; i++) {
        const _tmpObj = _data[i];
        if (value == _tmpObj.value) {
          this.selectObj = {
            text: _tmpObj.text,
            value: _tmpObj.value
          };
        }
      }

    });
  };

  _setDefault(value){
    this.setState({
      defaultValue:value
    })
  }

  // 校验字段名称长度
  checkFieldName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value1: "字段名称",
      });
      callback("error");
    } else {
      this.setState({
        value1: ""
      });
      if (value.length < 1||value.length > 8) {
        this.setState({
          value1: "请输入1-8个字符",
        });
        callback("error");
      }else {
        callback();
      }
    }
  }
// 校验参数名称长度
  checkParamName = (rule, value, callback) => {
    if (!value) {
      this.setState({
        value2: "参数名称",
      });
      callback("error");
    } else {
      this.setState({
        value2: ""
      });
      if (value.length < 1||value.length > 20) {
        this.setState({
          value2: "请输入1-20个字符",
        });
        callback("error");
      }else {
        callback();
      }
    }
  }

  render() {
    const { form, newRandomKey,submitting, visible, data, toolsType: {  modalInputData: inputList }} = this.props;
    const Option = Select.Option;
    const newList = [];
    inputList.forEach((data) => {
      for (let i = 0; i < newList.length; i++) {
        if (newList[i].id === data.id) {
          newList[i][data.text] = data.text;
          newList[i][data.value] = data.value;
          return;
        }
      }
      if( data.text!=="选项名" && data.text!=="" && data.value!=="value"&& data.value!==""){
        newList.push({
          id:data.id,
          text: data.text,
          value: data.value,
        });
      }
    });
    this.tmpArray1 = newList;
    const { getFieldDecorator } = this.props.form;
    const formItemLayout = {
      labelCol: {
        span: 6
      },
      wrapperCol: {
        span: 15
      }
    };

    return (
      <div>
        <Button key="back" onClick={this._showModal}  icon="plus" style={{marginRight:"12px",width:"auto",float:"left"}} >
          单选Select
        </Button>
        <Modal
          title="单选 select"
          width={600}
          visible={this.state.visible}
          onOk={this._onSubmit}
          // key={newRandomKey}
          key = {this.state.newRandomKey}
          confirmLoading={this.state.confirmLoading}
          onCancel={this._onCancel}
        >
          <Form
            onSubmit={this._onSubmit}
            layout="horizontal"
            hideRequiredMark
            style={{ height: "auto", overflow: "hidden" }}
          >
            <FormItem {...formItemLayout}  label="字段名称"   help={this.state.value1}  >
              {getFieldDecorator("fieldName", {
                rules: [
                  {
                    required: true,
                    message:"请输入"
                  },{
                    validator: this.checkFieldName
                  }
                ]
              })(<Input placeholder="请输入" />)}
            </FormItem>

            <FormItem {...formItemLayout} label="参数名称"  help={this.state.value2} >
              {getFieldDecorator("paramName", {
                rules: [
                  {
                    required: true,
                    message: "请输入"
                  },{
                    validator: this.checkParamName
                  }
                ] })(<Input  placeholder="key" />)}
            </FormItem>

            <FormItem label="可选项" {...formItemLayout}>
              {
               // (this.state.testData).map((item, index) => (
                (inputList).map((item, index) => (
                  <div key={index} style={{marginBottom:"19px"}} id={"divItem"+index}>
                    {
                      getFieldDecorator(`operations${item.id}_field`, {
                        initialValue: this.state._value?item.text:"",
                        rules: [{ required: true, message: "请输入！" }]
                      })(
                        <Input
                          placeholder = { "选项名"}
                          style={{width:"40%"}}
                          //onChange={event => {this.handleModalInputDataChange(event, item, "field")}}
                          onChange={event => {this.handleModalInputDataChange(event, item, "text")}}
                          onBlur={event => { this.handleInputChange(event,item, "text"); }}
                        />,
                      )
                    }
                    <span id={"span"+index} style={myStyle} className={styles.spanItem}>请输入1-10个字符</span>
                    {
                      getFieldDecorator(`operations${item.id}_VALUE`, {
                        initialValue: this.state._value?item.value:"",
                        rules: [{ required: true, message: "请输入！" }]
                      })(
                        <Input
                          placeholder={"value"}
                          style={{width:"40%"}}
                          onChange={event => {this.handleModalInputDataChange(event, item, "value")}}
                          onBlur={event => { this.handleInputChange(event,item, "value"); }}
                        />
                      )
                    }
                    {
                      index === 0
                        ? <Button onClick={this.handleAdd}>添加</Button>
                        : (item.id>2 ? <Button onClick={() => {this.handleDelete(item)}}>删除</Button>:'')
                    }
                  </div>
                ))
              }
            </FormItem>

            <FormItem label="示例参数" {...formItemLayout}>
              {
                getFieldDecorator(`defaultValue`, {
                  rules: [{ required: true, message: "请输入！" }],
                  onChange: this._onChange
                })(
                  <Select
                    /* mode="multiple"*/
                    style={{ width: '100%' }}
                    placeholder="请选择"
                    onChange={this.handleChange}
                  >
                    {
                      (this.tmpArray1.length>0?this.tmpArray1:(this.tmpArray1 || [])).map(item => (
                        //  <Option key={item.id} value={`${item.value}_${item.id}`}>{item.field}</Option>
                        <Option key={item.id} value={`${item.value}`}>{item.text+"-"+item.value}</Option>
                      ))
                    }
                  </Select>,
                )
              }
            </FormItem>
          </Form>
        </Modal>
      </div>
    );
  }
}

/*export default connect(({ toolsType, loading }) => ({
  toolsType
  //loading: loading.effects['customer/saveEnterprise'],
  //submitting: loading.effects['customer/submitEnterprise']
}))(Form.create()(NewSelectFile));*/
