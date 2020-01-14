import React, { Component, Fragment } from "react";
import { Button, Card, Form, notification, Row, Col, Icon, Tooltip, message } from "antd";
import { routerRedux } from "dva/router";
import AnrdInput from "./AnrdInput";
import AnrdRadioGroup from "./AnrdRadioGroup";
import AnrdSelectGroup from "./AnrdSelectGroup";
import styles from "./style.less";
import request from "../../utils/request";

const FormItem = Form.Item;

/**
 * 任务form表单
 */
@Form.create()
export default class TaskForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: this.props.dataSource || [],    // 数据源
      interactive: this.props.interactive,        // 是否可交互 "true"是，"false"否
      rootDir: this.props.rootDir,                // 根目录名称
      requestUri: this.props.requestUri,          // 请求uri
      example: false,
      isSubmit: true
    };
    this.tmpData = [];
    this.submitTimes = 0;
  }

  UNSAFE_componentWillReceiveProps(nextProps, nextStates){
    this.setState({
      dataSource: nextProps.dataSource || [],
      interactive: nextProps.interactive,
      rootDir: nextProps.rootDir,
      requestUri: nextProps.requestUri
    })
  }

  /**
   * 赋默认值
   */
  setDefaultValue = () => {
    let defaultValues = {};
    this.state.dataSource.map(data => {
      if (data.type === 3 || data.type === 4) {
        let defaultValue = data.defaultValue;
        // if(/^\d+$/.test(defaultValue)){
        //   defaultValue = parseInt(defaultValue);
        // }
        defaultValues[data.paramName] = defaultValue;
      } else if (data.type === 5) {
        // defaultValues[data.paramName] = data.defaultValue
        //   .split(",")
        //   .map(val => {
        //     if (/^\d+$/.test(val)) {
        //       return parseInt(val);
        //     }
        //     return val;
        //   });
        defaultValues[data.paramName] = data.defaultValue.split(",");
      } else {
        defaultValues[data.paramName] = data.defaultValue;
      }
    });
    this.props.form.setFieldsValue(defaultValues);
    this.setState({
      example: true,
    })
  };

  /**
   * 循环参数组件
   forEachDataSource = () => this.state.dataSource.map(data => {
      if (data.type == 1 || data.type == 6) {
        return (
          <AnrdInput
            data={data}
            form={this.props.form}
            interactive={this.state.interactive}
            rootDir={this.state.rootDir}
            requestUri={this.state.requestUri}
            onOk={(type, paramName) => this.onOk(type, paramName)}
            readOnly
            {...this.props}
            example = {this.state.example}
          />
        );
      } else if (data.type == 3) {
        return <AnrdRadioGroup data={data} form={this.props.form} example = {this.state.example} />;
      } else if (data.type == 4 || data.type == 5) {
        return (
          <AnrdSelectGroup
            data={data}
            form={this.props.form}
            mode={data.type == 4 ? "default" : "multiple"}
            example = {this.state.example}
          />
        );
      } else if (data.type == 2) {
        return <AnrdInput data={data} form={this.props.form}  example = {this.state.example}/>;
      }
    });*/
  /**
   * 平铺数据，返回所有数据
   * @param data
   * @returns {Array}
   */
  getAllData = (data) => {
    let tmpObj = [];
    const tmpArr2=["W","A_","B_","C_","D_","E_","F_","G_"];
    data.map((value) => {
      const  _value = value;
        if(value.paramName.indexOf(tmpArr2[value.type]) == -1){
          _value.paramName = tmpArr2[value.type]+value.paramName;
        }

      tmpObj.push(_value);
      if (value.tmpArr && value.tmpArr.length > 0) {
        let _tmpArr = value.tmpArr;
        _tmpArr.map((item, index) => {
          const _no = index + 2;
          item.paramName = `${_no}${_value.paramName.substring(_value.paramName.indexOf("A_")+1,_value.paramName.length)}${_no}`;
          tmpObj.push(item);
        });
      }
    });
    this.tmpData = tmpObj
    return tmpObj;
  };
  /**
   * 循环参数组件
   */
  forEachDataSource = () => {
    let myarr = this.state.dataSource;
    if (myarr) {
      let tmpObj = [];
      tmpObj = this.getAllData(myarr);
      /*myarr.map((value) => {
        tmpObj.push(value);
        if (value.tmpArr && value.tmpArr.length > 0) {
          let _tmpArr = value.tmpArr;
          _tmpArr.map((item, index) => {
            const _no = index + 2;
            item.paramName = `${value.paramName}${_no}`;
            tmpObj.push(item);
          });
        }
      });*/
      return tmpObj.map((data, index) => {
        const _default = {
          key: index,
          data: data,
          form: this.props.form,
          example: this.state.example
        };
        switch (data.type) {
          case 1:
          case 6:
          case 7:
            return <AnrdInput {..._default}
                              {...this.props}
                              readOnly
                              _display={this.state.visible}
                              interactive={this.state.interactive}
                              onOk={(type, paramName) => this.onOk(type, paramName)}
            />;
          case 3:
            return <AnrdRadioGroup {..._default} _data={data} />;
          case 2:
            return <AnrdInput {..._default} />;
          case 4:
          case 5:
            return <AnrdSelectGroup  _data={data}  {..._default} mode={data.type === 4 ? "default" : "multiple"}/>;
        }
      });

    }

  }


  /**
   * 用户选择输入文件，将使用示例置为false
   */
  onOk = (type, paramName) => {
    if(type === 1){
      this.setState({
        example: false
      })
      this.props.form.validateFields([paramName], { force: true });

    }
  }

  /**
   * 提交任务
   */
  handleSubmit = (e) => {
    e.preventDefault();
    ++this.submitTimes;
    if(this.submitTimes > 1){
      return;
    }
    this.setState({
      isSubmit: false
    })
    let that = this;
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let paramValues = [];
        let imageName = '';
        for (let key in values) {
          if (key !== 'imageName') {
            let value = values[key];
            if(value.indexOf('数据管理')!== -1){
              value = value.substring(value.indexOf('/')+1,value.length)
            }
            // 将多选转换为逗号分隔
            if(Array.isArray(value)){
              value = value.join(",")
            }
            paramValues.push({"paramName": key, "value" : value})
          } else {
            imageName = values[key]
          }
        }
        let params = {};
        params["code"] = localStorage.getItem("annoroad-task-mis-code");
        params["example"] = this.state.example ? 1 : 2;
        // 拼装values参数
        params["params"] = paramValues;
        params = this.setParamsCode(params);
        request("/annoroad-cloud-mis-server/tool/version/detail", {
          body: {
            code: localStorage.getItem("annoroad-task-mis-code")
          }
        }).then((data) => {
          if (data) {
            if (data.code === "000000") {
              if(data.data.status==9){
                message.error("小工具已下架")
                setTimeout(function() {
                  that.props.dispatch(
                    routerRedux.push({
                      pathname: "/application/tools",
                    })
                  );
                }, 3000);
                return;
              }else{
                that.props.dispatch({
                  type: "myTools/submitTask",
                  payload: {
                    ...params,
                    imageName
                  },
                  callback: data => {
                    // 判断错误码
                    if (data.code != "000000") {
                      notification.error({
                        message: `请求错误`,
                        description: data.msg
                      });
                      this.setState({
                        isSubmit: true
                      })
                      setTimeout(() => {this.submitTimes = 0},500);
                    } else {
                      const analysisMark =localStorage.getItem("annoroad-task-analysisMark");
                      // that.props.dispatch(routerRedux.push("/apply/tool/rate"));
                      that.props.dispatch(routerRedux.push(analysisMark=="true"? "/application/tool/rate":"/apply/tool/rate"));
                    }
                  }
                })
              }
            }}});
      }else{
        this.setState({
          isSubmit: true
        })
        this.submitTimes = 0;
      }
    });
  };
  /**
   * 提交数据添加paramsCode
   * @param data
   * @returns {*}
   */
  setParamsCode = (data) => {
    if (!data || !data.params) {
      return false;
    }
    let params = data.params;
    let tmpArr = this.tmpData; //tmpArr为所有数据
    let submitData = [];
    tmpArr.map((value, key) => {
      params.map((item, key) => {
        if (item.paramName == value.paramName) {
          submitData.push({
            paramName: item.paramName.substring(item.paramName.indexOf("_")+1,item.paramName.length),
            value: item.value,
            paramCode: value.paramCode
          });
        }
      });
    });
    data.params = submitData;
    return data;
  };

  render () {
    const { imageName, form } = this.props;
    const analysisMark =localStorage.getItem("annoroad-task-analysisMark")
    const { example } = this.state
    const data = {
      conclusion: 0,
      defaultValue: imageName,
      fieldName: "镜像名称",
      options: [],
      paramName: "imageName",
      prompt: imageName,
      rules: ["thirty"],
      rule: '^.{1,30}$',
      type: 2,
      initialValue: imageName,
      last:true
    }

    return (
      <Fragment>
        <Card bordered={false}>
          <div className={styles.salesBar}>
            <div className={styles.paraTitle}>
              <span>参数设置</span>
              <Tooltip title='使用示例'>
                <a onClick={() => this.setDefaultValue()}>
                  <Icon type="file-text" style={{fontSize:'20px'}} />
                </a>
              </Tooltip>

            </div>
            <Form style={{marginTop: "30px"}} className={styles.submit_task_nav} id = "submit_task_nav" onSubmit={(e) => this.handleSubmit(e)}>
              {this.forEachDataSource()}
              {
                imageName ? <AnrdInput data={data} form={form}  example = {example}  _display={analysisMark=="true"?0:1} /> : ''
              }
              <Row>
                <Col span={20}>
                  <FormItem>
                    <Button type="primary" htmlType="submit" hidden={!(this.state.interactive === "true")}
                            disabled={!this.state.isSubmit}>
                      提交任务
                    </Button>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </div>
        </Card>
      </Fragment>
    );
  }
}
