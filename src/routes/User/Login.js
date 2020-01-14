import React, { Component } from "react";
import { connect } from "dva";
import { Checkbox, Alert, message, Modal } from "antd";
import Login from "components/Login";
import styles from "./Login.less";
import request from "../../utils/request"
const { Tab, UserName, Password, Submit } = Login;
import { setToken } from "../../utils/authority";

@connect(({ login, loading }) => ({
  login,
  submitting: loading.effects["login/login"]
}))
export default class LoginPage extends Component {

  constructor(props){
    super(props);
    let token = localStorage.getItem("annoroad-token");
    if(token){
      this.props.history.push("/Dashboard");
    }
  }

  state = {
    type: "account",
    autoLogin: true,
    visible:false,
  };
  codeMark = {
    "000001":"系统异常",
    "000002":"参数错误",
    "900102":"用户无权限",
    "900201":"账户不存在，请先注册",
    "900202":"密码不正确，请重新输入",
    "900301":"请输入验证码",
    "900302":"验证码不正确，请重新输入",
    "900303":"验证码已失效，请获取验证码",
    "160107":"用户不存在",
    "900000":"该版本已停用，工程师正在更新，请稍后使用",
  }

  onTabChange = type => {
    this.setState({ type });
  };

  handleSubmit = (err, values) => {
    if (!err) {
      request('/annoroad-sso/user/login/byname',{body:{
          loginName: values["loginName"],
          password: values["password"],
          platformCode: 1,
          //policy: 1,
          policy: this.state.autoLogin ? 2:1,
        }}).then((data)=>{
          if(data){
            if(data.code==="000000"){
              window.localStorage.setItem("annoroad-token", data.data.token);
              window.localStorage.setItem("login_mis_Name", data.data.loginName);
              setToken("annoroad-token",data.data.token);
              //刷新页面
              this.props.history.push("/Dashboard");
              message.success("登录成功！");
            }else{
              message.error(this.codeMark[data.code]);
            }
          }else{
            message.error("系统错误");
          }
      })
    }
  };

  changeAutoLogin = e => {
    this.setState({
      autoLogin: e.target.checked
    });
  };

  renderMessage = content => {
    return (
      <Alert
        style={{ marginBottom: 24 }}
        message={content}
        type="error"
        showIcon
      />
    );
  };
  info(){
    Modal.info({
      title: "请联系【管理员】重置密码",
      content: (
        <div>
          <p>技术负责人联系方式：taoliu@genome.cn</p>
        </div>
      ),
      onOk() {}
    });
  }

  render() {
    const { login, submitting } = this.props;
    const { type } = this.state;
    return (
      <div className={styles.main}>
        <div className={styles.desc}>管理信息系统</div>
        <Login
          defaultActiveKey={type}
          onTabChange={this.onTabChange}
          onSubmit={this.handleSubmit}
          className={styles.loginContent}

        >
          <Tab key="account">
            <UserName name="loginName" placeholder="用户名" />
            <Password name="password" placeholder="密码" />
          </Tab>
          <div className={styles.autoLogin}>
            <Checkbox
              checked={this.state.autoLogin}
              onChange={this.changeAutoLogin}
            >
              自动登录
            </Checkbox>
            <a style={{ float: "right" }} onClick={this.info}> 忘记密码 </a>
          </div>
          <Submit style={{ marginTop: "4px" }} loading={submitting}>
            登录
          </Submit>
        </Login>
      </div>
    );
  }
}
