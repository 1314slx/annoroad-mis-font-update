import React from "react";
import { Layout } from "antd";
import PropTypes from "prop-types";
import DocumentTitle from "react-document-title";
import { connect } from "dva";
import { Route, Switch, Redirect } from "dva/router";
import { ContainerQuery } from "react-container-query";
import classNames from "classnames";
import GlobalHeader from "../components/GlobalHeader";
import SiderMenu from "../components/SiderMenu";
import NotFound from "../routes/Exception/404";
import { getRoutes } from "../utils/utils";
import Authorized from "../utils/Authorized";
import { getMenuData } from "../common/menu";
import logo from "../assets/logo.svg";


const { Content, Header, Footer } = Layout;
const { AuthorizedRoute } = Authorized;

const query = {
  "screen-xs": {
    maxWidth: 575
  },
  "screen-sm": {
    minWidth: 576,
    maxWidth: 767
  },
  "screen-md": {
    minWidth: 768,
    maxWidth: 991
  },
  "screen-lg": {
    minWidth: 992,
    maxWidth: 1199
  },
  "screen-xl": {
    minWidth: 1200
  }
};

class BasicLayout extends React.PureComponent {

  static childContextTypes = {
    location: PropTypes.object,
    breadcrumbNameMap: PropTypes.object
  };

  constructor(props){
    super(props);
    this.state = {
      menuData: [],     // 菜单数据
      menus: null,     // 平面结构菜单数据
    };
    getMenuData().then((menus) => {
      // 将菜单转换成平面结构
      let obj = {};
      this.convertMenus(obj, menus, "")
      this.setState({
        menuData: menus,
        menus: obj,
      });
    })
  }

  // getChildContext() {
  //   const { location, routerData } = this.props;
  //   return {
  //     location,
  //     breadcrumbNameMap: routerData,
  //   };
  // }

  /**
   *  将菜单转换成平面结构，方便获取浏览器标题头
   */
  convertMenus(obj,menus,parent){
    if(menus){
      menus.forEach((menu) => {
        obj[menu.path] = {name:menu.name, parent: parent};
        if(menu.children && menu.children.length > 0){
          this.convertMenus(obj, menu.children, menu.name);
        }
      })
    }
  }

  /**
   * 获取浏览器标题头
   */
  getTitle() {
    const { routerData, location } = this.props;
    const { pathname } = location;
    let title = "";
    if (routerData[pathname] && this.state.menus && this.state.menus[pathname]) {
      title = this.state.menus[pathname].name;
    }
    return title;
  }


  /**
   * 控制导航展开收回
   */
  handleMenuCollapse = collapsed => {
    this.props.dispatch({
      type: "global/changeLayoutCollapsed",
      payload: collapsed
    });
  };

  /**
   * 导航用户头像下拉菜单操作
   */
  handleMenuClick = ({ key }) => {
    if (key === "logout") {
      this.props.dispatch({
        type: "login/logout"
      });
    }
  };

  render() {
    const {  collapsed, routerData, match, location } = this.props;
    //console.log('this.state.menuData',this.state.menuData)
    const layout = (
      <Layout>
        <SiderMenu
          logo={logo}
          // 不带Authorized参数的情况下如果没有权限,会强制跳到403界面
          // Authorized={Authorized}
          menuData={this.state.menuData}
          collapsed={collapsed}
          location={location}
          onCollapse={this.handleMenuCollapse}
        />
        <Layout>
          <Header style={{ padding: 0 }}>
            <GlobalHeader
              logo={logo}
              collapsed={collapsed}
              onCollapse={this.handleMenuCollapse}
              onMenuClick={this.handleMenuClick}
            />
          </Header>
          <Content style={{ margin: "24px 24px 0",}}>
            <Switch>
              {/*{this.state.redirectData.map(item => (*/}
                {/*<Redirect key={item.from} exact from={item.from} to={item.to} />*/}
              {/*))}*/}
              {getRoutes(match.path, routerData).map(item => (
                <AuthorizedRoute
                  key={item.key}
                  path={item.path}
                  component={item.component}
                  exact={item.exact}
                  // authority={item.authority}
                  // redirectPath="/exception/403"
                />
              ))}
              <Redirect to={"/user/login"} from={"/"}/>
              <Route render={NotFound} />
            </Switch>
          </Content>

          <Footer />
        </Layout>
      </Layout>
    );

    return (
      <DocumentTitle title={this.getTitle()}>
        <ContainerQuery query={query}>
          {params => <div className={classNames(params)}>{layout}</div>}
        </ContainerQuery>
      </DocumentTitle>
    );
  }
}

export default connect(({ global, loading }) => ({
  collapsed: global.collapsed
}))(BasicLayout);
