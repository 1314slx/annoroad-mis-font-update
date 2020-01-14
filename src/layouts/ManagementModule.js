import React, { Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Icon, Row, Col } from "antd";
import styles from "./UserLayout.less";
import GlobalHeader from "../components/GlobalHeader";
import DocumentTitle from "react-document-title";
import dva from "dva";
import createHistory from "history/createHashHistory";
import { getRouterData } from "../common/router";
import { setItem } from "../utils/utils";
import { getQueryString } from "../utils/utils";

const app = dva({
  history: createHistory()
});
const copyright = (
  <Fragment>
    Copyright <Icon type="copyright" />{" "}
  </Fragment>
);
const data = [

  {
    key: 15,
    name: "应用管理",
    value: "APPLY",
    url: "/apply"
  },
  {
    key: 16,
    name: "系统管理",
    value: "SYSTEM",
    url: "/system"
  }
];

/**
 * 系统模块管理，展示现在系统
 * */
class ManagementModule extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      itemModule: []
    };
  }

  componentDidMount() {
    const _code = getQueryString("code");
    if (_code) {
      this.setState({ type: "QRcode" });
      this.props.dispatch({
        type: "login/loginDingDing",
        payload: {
          code: _code
        }
      });
    }
    if (!_code) {
      this.props
        .dispatch({
          type: "user/userDetail"
        })
        .then(() => {
          const { userDetailData } = this.props.user;
          //console.log('userDetailData:', userDetailData)
          if (userDetailData && userDetailData.hasOwnProperty("module_list")) {
            const _userDetailData = userDetailData["module_list"];
            let _itemModule = [];
            _userDetailData.map(value => {
              data.map(item => {
                if (value.platform === item.key) {
                  _itemModule.push(item);
                }
              });
            });
            this.setState({ itemModule: _itemModule });
            setItem("userDetailData", JSON.stringify(userDetailData));
            //getRouterData(app);
          }
        });
    }
  }

  _getItemModule(data) {
    if (data) {
      return data.map((value, index) => {
        return <ItemModule key={index} data={value} onClick={this.onClick} />;
      });
    }
  }

  onClick = (url, type) => {
    setItem("currentType", type);
    this.props.dispatch(routerRedux.push(url));
  };
  //导航用户头像下拉菜单操作
  handleMenuClick = ({ key }) => {
    /*if (key === 'triggerError') {
      this.props.dispatch(routerRedux.push('/exception/trigger'));
      return;
    }*/
    if (key === "logout") {
      this.props.dispatch({
        type: "login/logout"
      });
    }
  };

  render() {
    const { currentUser } = this.props;

    return (
      <DocumentTitle title="安诺云Mis端">
        <div className={styles.container}>
          <div className={styles.contentModule}>
            <GlobalHeader
              currentUser={currentUser}
              onMenuClick={this.handleMenuClick}
            />
            <div
              style={{
                height: "100%",
                width: "100%",
                display: "flex",
                flexDirection: "column"
              }}
            >
              <Row className={styles.contentBox}>
                {this._getItemModule(this.state.itemModule)}
              </Row>
            </div>
          </div>
        </div>
      </DocumentTitle>
    );
  }
}

class ItemModule extends React.Component {
  _getValue(value) {
    const _data = this.props.data;
    if (_data && _data.hasOwnProperty(value)) {
      return _data[value];
    }
  }

  render() {
    const layout = {
      xs: { span: "24" },
      sm: { span: "12" }
      //md: {span: '8'},
    };
    return (
      <Col {...layout} className={styles.colBox}>
        <div
          className={styles.itemContent}
          onClick={this.props.onClick.bind(
            this,
            this._getValue("url"),
            this._getValue("value")
          )}
        >
          {this._getValue("name")}
        </div>
      </Col>
    );
  }
}

export default connect(({ user }) => ({
  user,
  currentUser: user.currentUser
}))(ManagementModule);
