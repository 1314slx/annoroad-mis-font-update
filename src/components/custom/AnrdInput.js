import React, { Component, Fragment } from "react";
import { Input, Form, Row, Col, Modal, Icon, Tooltip, notification } from "antd";
import FileSelect from "./FileSelect";
import { getOssClient } from "../../utils/oss";
import request from "../../utils/request";
import { CHECK_SUBMIT_TASK, CHECK_SUBMIT_TASKOUT } from "../../utils/pattern";
import { guid } from "../../utils/utils";
import styles from "./style.less";

const FormItem = Form.Item;

const formItemLayout = {
  labelCol: {
    span: 7
  },
  wrapperCol: {
    span: 17
  }
};

export default class AnrdInput extends Component {
  constructor(props) {
    super(props);
    const { ...otherProps } = this.props;
    this.other = otherProps;
    this.state = {
      interactive: this.props.interactive,        // 是否可交互 "true"是，"false"否
      rootDir: this.props.rootDir,                // 根目录名称
      // requestUri: this.props.requestUri          // 请求uri
    };
    this.textTips = {
      "num":"\"数字\"",
      "lowercase":"\"小写字母\"",
      "uppercase":"\"大写字母\"",
      "chinese":"\"中文\"",
      "decimal":"\"6位以内的小数\"",
      "special": "\"特殊字符(逗号、冒号、顿号、点、/、\\、|、_、-)\"",
      "thirty": "\"1-30个字符\""
    };
    this._mark = 0;
    this.suffixPath = "";
    this.fileName = "";
    this.fileSelect = React.createRef();
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextStates) {
    this.other = nextProps;
    this.setState({
      interactive: nextProps.interactive,
      rootDir: nextProps.rootDir,
      // requestUri: nextProps.requestUri
    });
  }

  /**
   * 选择文件
   */
  onClick = () => {
    let type = this.props.data.type;
    if (this.state.interactive === "true" && (type === 1 || type === 6 || type === 7)) {
      this.fileSelect.current.open(
        type == 1 ? "输入文件" : (type == 7?"输入文件夹":"输出文件夹"),
        // this.props.form.getFieldValue(this.props.data.paramName),
        type == 7||type == 6,
      );
    }
    if (this.props.onClick) {
      this.props.onClick(this.props.data);
    }
    this._mark = 1;
  };

  /**
   * 选择文件或文件夹后给文本框赋值
   */
  onOk = (path) => {
    let obj = {};
    if (this.props.data.type == 6) {
      const analysisMark =localStorage.getItem("annoroad-task-analysisMark");
      obj[this.props.data.paramName] = analysisMark=="true"?path:("数据管理/" + path);
    } else {
      obj[this.props.data.paramName] = path;
    }
    // obj[this.props.data.paramName] = path;
    this.props.form.setFieldsValue(obj);
    if (this.props.onOk) {
      this.props.onOk(this.props.data.type, this.props.data.paramName);
    }
  };

  /**
   * 文本框校验提示
   */
  textTip = () => {
    let tip = "请输入";
    this.props.data.rules.forEach((key) => {
      tip += this.textTips[key] + "、";
    });
    return tip.substring(0, tip.length - 1);
  };
  /**
   * 示例预览
   */
  setModalVisible = (params) => {
    let client = getOssClient();
    let _defaultValue = this.props.data.defaultValue;
    this.fileName = _defaultValue.substring(_defaultValue.lastIndexOf("/") + 1, _defaultValue.length);
    let path = "user/MIS/" + this.props.data.defaultValue;
    this.suffixPath = _defaultValue.substring(_defaultValue.lastIndexOf("."), _defaultValue.length);
    this.url = client.signatureUrl(path, { expires: 3600 });
    if (this.suffixPath == ".txt") {
      request(this.url, { method: "GET" }).then((data) => {
        if (data) {
          data = data.replace(/\r\n/g, "<br />");
          /*data = data.replace(/\n/g, "<br />");*/
          /* data = data.split('<br />').map(list => (<p>{list}</p>));*/
          this.setState({ conclusionText: data });

        } else {
          this.setState({ conclusionText: "" });
        }
      });
      this.setState({
        visible: params
      });
    } else if (this.suffixPath == ".jpg" || this.suffixPath == ".png" || this.suffixPath == ".jpeg") {
      this.setState({
        visible: params
      });
    } else {
      let _data = this.props.data;
      request("/annoroad-cloud-mis-server/data/signature-url",
        { body: { "fileUrl": _data ?  _data.defaultValue:"" }})
        .then((data) => {
          if (data.code != "000000") {
            notification.error({
              message: "下载失败",
              description: name + "下载失败，获取下载连接失败。"
            });
          }else{
            var a = window.document.createElement("a");
            a.href =  data.data.url;
            a.download = this.fileName;
            a.click();
          }
        })
    }
  };
  // 自主增减输入文件
  dynamic = (remove) => {
    const _rightTab = document.getElementById("rightTab");
    const _resultTab = document.getElementById("resultTab");
    const _submit_task_nav = document.getElementById("submit_task_nav");
    if((_rightTab ||_resultTab ) && _submit_task_nav){
      let h_submit_task_nav = _submit_task_nav.offsetHeight;
      _rightTab?_rightTab.style.minHeight=h_submit_task_nav+95+"px":"";
      _resultTab?_resultTab.style.minHeight=h_submit_task_nav+95+"px":"";
    }
    const _data = this.props.data;
    if (_data.type === 1) {
      let _params;
      if (remove) {
        _params = {
          ..._data,
          dislodge: true
        };
      } else {
        _params = {
          ..._data,
          clone_id: guid(),// 有clone_id 表示克隆对象
          fieldName: "输入文件",
          defaultValue: ""
        };
      }
      this.props.dispatch({
        type: "myTools/addToolDetailData",
        payload: _params
      });

    }

  };

  /**
   * 示例下载预览
   */
  downloadPreview = () => {
    let client = getOssClient();
    let path = "user/MIS/" + this.props.data.defaultValue;
    this.url = client.signatureUrl(path, { expires: 3600 });
    window.location.href = this.url;
  };

  render() {
    const { getFieldDecorator } = this.props.form;
    const _data = this.props.data;
    // 必填输入提示
    let requiredMessage = "请选择文件";
    let ruleMessage = "文件类型不支持";
    if (_data.type === 6) {
      requiredMessage = "请选择输出文件夹";
    } else if (_data.type === 2) {
      requiredMessage = this.textTip();
      ruleMessage = requiredMessage;
    }else if (_data.type === 7) {
      requiredMessage = "请选择输入文件夹";
    }
    let customRules = [{ required: true, message: requiredMessage }];
    if (_data.type != 6) {
      if (_data.type == 1) {
        let _rule = _data.rule;
        if (_rule) {
          // let ruleReplace = _rule.replace(_rule.substring(0,1),CHECK_SUBMIT_TASK);
          let ruleReplace = new RegExp(_rule.replace(_rule.substring(0, 1), CHECK_SUBMIT_TASK));
          customRules.push({
            pattern: ruleReplace,
            message: "文件类型不支持或文件名不能包含：引号、括号、空格、回车符以及'*\\$+&%#!~"
            // message: ruleMessage
          });
        }
      } else if (_data.type == 7) {
        customRules.push({
          pattern: CHECK_SUBMIT_TASKOUT,
          message: "不能包含：引号、括号、空格、回车符以及'*\\$+&%#!~"
        });
      }else {
        customRules.push({
          pattern: _data.rule,
          message: ruleMessage
        });
      }
    } else if (_data.type == 6) {
      customRules.push({
        pattern: CHECK_SUBMIT_TASKOUT,
        message: "不能包含：引号、括号、空格、回车符以及'*\\$+&%#!~"
      });
    }
    let myStyleInput = _data.type == 6 && this._mark == 1 ? {
      textIndent: "4em",
      zIndex: "2",
      background: "none"
    } : {};

    let myStyleSpan = _data.type == 6 && this._mark == 1 ? {
      display: "block",
      marginTop: "-2.8em",
      marginLeft: "3px",
      width: "5em",
      zIndex: "1",
      paddingLeft: "3px"
    } : { display: "none" };
    let _defaultValue = _data.defaultValue;
    _defaultValue = _defaultValue.substring(_defaultValue.lastIndexOf(".") + 1, _defaultValue.length);
    return (
      <div style={this.props._display==0?{display:"none"}:{}}>
        <Row>
          <Col span={20}>
            <FormItem {...formItemLayout} label={_data.fieldName} required={false}>
              {getFieldDecorator(_data.paramName, {
                rules: customRules,
                initialValue: _data.initialValue
              })(<Input {...this.other} onClick={() => this.onClick()} placeholder={_data.prompt}/>)}
              {/*{_data.type == 1 ?null:<span style={myStyleSpan}>数据管理/</span>}*/}
            </FormItem>
          </Col>
          {/*<Col span={4} style={{paddingLeft:10,lineHeight:'40px',wordBreak: 'keep-all'}}>
            {_data.type == 1?(<a onClick={() => this.setModalVisible(true)}><Icon type="eye" style={{fontSize:"20px"}}/></a>):<span></span>}
          </Col>*/}
          <Col span={4} style={{ paddingLeft: 10, lineHeight: "40px", wordBreak: "keep-all" }}>
            {
              _data && _data.type === 1 ?
                <div className={styles.btn_icon}>
                  {
                    _data.dynamic === 1||_data.dynamic === 2 || _data.maxNum==0&&_data.dynamic==0 ?
                      <Tooltip title='示例预览'>
                        <a onClick={() => this.setModalVisible(true)}>
                          <Icon type="eye" style={{ fontSize: "20px" }}/>
                        </a>
                      </Tooltip>
                      :
                      <Fragment/>
                  }

                  {
                    _data.remove ?
                      <Tooltip title='删除输入文件'>
                        <a onClick={() => this.dynamic(true)}>
                          <Icon type="minus-circle" style={{ fontSize: "18px" }}/>
                        </a>
                      </Tooltip>
                      :
                      <Fragment/>
                  }
                  {
                    _data.increase ?
                      <Tooltip title='新增输入文件'>
                        <a onClick={() => this.dynamic()}>
                          <Icon type="plus-circle" style={{ fontSize: "18px" }}/>
                        </a>
                      </Tooltip>
                      :
                      <Fragment/>
                  }

                </div>
                :
                <Fragment/>
            }

          </Col>
        </Row>
        <FileSelect
          {...this.props}
          ref={this.fileSelect}
          onOk={path => this.onOk(path)}
          title={_data.type == 1 ? "输入文件" : "输出文件夹"}
          selectBtn={_data.type === 7 ? 2 : ""}
        />
        <Modal
          title={this.fileName}
          visible={this.state.visible}
          onOk={() => this.setModalVisible(false)}
          onCancel={() => this.setModalVisible(false)}
          footer={null}
          style={{ top: 90 }}
          width={"64%"}
        >
          <div style={{ maxHeight: "65vh", minHeight: "45vh", overflow: "auto" }}>
            {this.suffixPath == ".txt" ? <span dangerouslySetInnerHTML={{ __html: this.state.conclusionText }}></span> :
              <img src={this.url} style={{ width: "80%", marginLeft: "10%" }}/>}
          </div>
        </Modal>
      </div>
    );
  }
}
