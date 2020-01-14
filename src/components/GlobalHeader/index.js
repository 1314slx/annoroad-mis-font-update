import React, { PureComponent } from "react";
import { Menu, Icon, Spin, Dropdown, Avatar, Divider } from "antd";
import Debounce from "lodash-decorators/debounce";
import styles from "./index.less";
import { platformOptions } from "../../utils/options";
import { getItem } from "../../utils/utils";
import store from "../../index";
import { Link,routerRedux } from "dva/router";
export default class GlobalHeader extends PureComponent {
  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  //debounce 强制函数在某段时间内只执行一次，throttle 强制函数以固定的速率执行
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent("HTMLEvents");
    event.initEvent("resize", true, false);
    window.dispatchEvent(event);
  }

  //获取平台模块
  getModule(data, whichModule) {
    if (data) {
      const _current = whichModule;
      return data.map((value, index) => {
        return platformOptions.map(item => {
          if (value.platform === item.key) {
            let _target = false;
            if (_current === item.value) {
              _target = true;
            }
            return (
              <span key={index}>
                <span
                  className={_target ? styles.currentNav : styles.spanNav}
                  type={item.value}
                >
                  {item.name}
                </span>
                <Divider type="vertical" key={`line${item.value}`} />
              </span>
            );
          }
        });
      });
    }
  }
//退出登录
  loginOut(){
    //清除token
    sessionStorage.clear();
    localStorage.clear();
    store.dispatch(routerRedux.push("/user/login"));
    //this.props.history.push("/user/login");

  }
  render() {
    const {
      currentUser,
      collapsed,
      isMobile,
      logo,
      onMenuClick,
      onModuleMenuClick,
      browserTitle,
      roleList,
      whichModule
    } = this.props;

    const menu = (
      <Menu className={styles.menu} selectedKeys={[]} onClick={onMenuClick}>
        {/*<Menu.Item disabled><Icon type="user"/>个人中心</Menu.Item>
        <Menu.Item disabled><Icon type="setting"/>设置</Menu.Item>*/}
        {/*<Menu.Item disabled><Icon type="reset"/>修改密码</Menu.Item>*/}

        <Menu.Item disabled>
          <Icon type="plus-square-o" />建设中...{" "}
        </Menu.Item>
        <Menu.Divider />
        <Menu.Item key="logout" onClick={this.loginOut}>
          <Icon type="logout" />退出登录
        </Menu.Item>
      </Menu>
    );
    return (
      <div
        className={
          collapsed !== undefined ? styles.header : styles.headerManage
        }
      >
        {isMobile && [
          <Link to="/" className={styles.logo} key="logo">
            {"ds" + browserTitle}
          </Link>,
          <Divider type="vertical" key="line" />
        ]}
        {collapsed !== undefined ? (
          <Icon
            className={styles.trigger}
            type={collapsed ? "menu-unfold" : "menu-fold"}
            onClick={this.toggle}
          />
        ) : (
          ""
        )}
        {collapsed !== undefined ? (
          <div className={styles.moduleMenuBox} onClick={onModuleMenuClick}>
            {this.getModule(roleList, whichModule)}
          </div>
        ) : (
          ""
        )}

        <div className={styles.right}>
          <Dropdown overlay={menu}>
            <span className={`${styles.action} ${styles.account}`}>
              {/*<Avatar size="small" className={styles.avatar} src={currentUser.avatar}/>*/}
              <span className={styles.name}>{localStorage.getItem("login_mis_Name")}</span>
            </span>
          </Dropdown>
        </div>
      </div>
    );
  }
}
