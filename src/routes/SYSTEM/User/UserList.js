import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";
import Search from "../../../components/Search/index";
import styles from "../style.less";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
/*import ListQuery from 'components/ListQuery/index'; 接口调用*/
import ListQuery from "components/ListQuery";
import { userListColumns } from "../columns";

const searchs = [
  {
    type: "input",
    label: "用户ID",
    required: false,
    placeholder: "请输入",
    parameter: "userId"
  },
  {
    type: "input",
    label: "用户名",
    required: false,
    placeholder: "请输入",
    parameter: "loginName"
  },
  {
    type: "input",
    label: "手机号",
    required: false,
    placeholder: "请输入",
    parameter: "mobile"
  }
];

/**
 * 邮件模板管理
 * */
@connect(({ userList, loading }) => ({
  userList,
  loading: loading.effects["userList/queryGroup"]
  //loading: loading.effects['customer/queryEnterprise']
}))
export default class UserList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      myStyle: {},
      width: "100%"
    };
    this.columns = [...userListColumns];
  }

  componentDidMount() {
    this.getListData();
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  //设置内容最大高度
  setItemHeight = () => {
    let clientHeight = document.body.clientHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      marginBottom: "24px",
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }
  componentWillUnmount() {}
  onReset=()=>{
    this.getListData();
  }
  onSubmit = (err, value) => {
    if (err) {
      return;
    };
      const values = {
        ...value,
        pageNo: 1,
        pageSize: 15
      };
      this.getListData(values);
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      pageNo: pageNumber
    };
    this.getListData(params);
  };
  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "userList/queryGroup",
      payload: value
    });
  }

  render() {
    const { userList, loading } = this.props;
    const { groupData } = userList; // groupData 展示列表数据
    const { pageNo, pageTotal, pageSize, total, dataSource } = groupData;

    return (
      <PageHeaderLayout
        title="用户列表"
        breadcrumbList={[{title: "用户管理"},{title: "用户列表"}]}
      >
        <div style={this.state.myStyle}>
          <ListQuery
            bordered={false}
            linkName=""
            columns={this.columns}
            items={searchs}
            dataSource={dataSource}
            current={pageNo}
            total={total}
            loading={loading}
            pagination={this.pagination}
            onSubmit={this.onSubmit}
            onReset={this.onReset}
          />
          <div className={styles.userCount}>总用户数{total}人</div>
        </div>
      </PageHeaderLayout>
    );
  }
}
