import React, { Fragment } from "react";
import { Link, Redirect, Switch, Route } from "dva/router";
import DocumentTitle from "react-document-title";
import { Button, Icon, Divider } from "antd";
import GlobalFooter from "../components/GlobalFooter";
import styles from "./UserLayout.less";
import logo from "../assets/logo.svg";
import { getRoutes, BROWSER_TITLE_BOSS } from "../utils/utils";

const links = [
  {
    key: "help",
    title: "帮助",
    href: ""
  },
  {
    key: "privacy",
    title: "隐私",
    href: ""
  },
  {
    key: "terms",
    title: "条款",
    href: ""
  }
];

const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" />{" "}
  </Fragment>
);

class UserLayout extends React.PureComponent {
  getPageTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = BROWSER_TITLE_BOSS;
    if (routerData[pathname] && routerData[pathname].name) {
      title = `${routerData[pathname].name} - ${BROWSER_TITLE_BOSS}`;
    }
    return title;
  }

  render() {
    const { routerData, match } = this.props;
    return (
      <DocumentTitle title={this.getPageTitle()}>
        <div className={styles.container}>
          {" "}
          {/*style={{border:'1px solid blue'}}*/}
          <div className={styles.content}>
            {" "}
            {/*style={{border:'1px solid red'}}*/}
            <div className={styles.top}>
              <div className={styles.header} style={{height:"auto",overflow:"hidden"}}>
                <Link to="/">
                  {/*{ <img alt="logo" className={styles.logo} src={logo}/>}*/}
                  <img
                    alt="logo"
                    className={styles.logo}
                    src={require("../img/logo_3.png")}
                  />
                 {/* <span
                    className={styles.title}
                  >{`${BROWSER_TITLE_BOSS}`}</span>*/}
                </Link>
              </div>
            </div>
            <Switch>
              {getRoutes(match.path, routerData).map(item => (
                <Route
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                />
              ))}
              <Redirect exact from="/user" to="/user/login" />
            </Switch>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

export default UserLayout;
