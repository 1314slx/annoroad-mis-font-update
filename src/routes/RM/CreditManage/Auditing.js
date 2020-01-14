import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Table, Row, Button, Pagination } from "antd";

import Search from "../../../components/Search/index";
import { getCreditAuditingColumns } from "./Columns";
import { setItem, trim } from "../../../utils/utils";

import styles from "./Credit.less";

@connect(({ credit, loading }) => ({
  credit,
  loading: loading.effects["credit/auditingListPage"]
}))
export default class Auditing extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.columns = [
      ...getCreditAuditingColumns(),
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => this.renderOperation(record)
      }
    ];
  }

  renderOperation(value) {
    return (
      <div>
        {(value.source_status === 1 || value.source_status === 2) && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleAuditing.bind(this, value, 1)}
          >
            审核
          </Button>
        )}
        {(value.source_status === 3 || value.source_status === 4) && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleLook.bind(this, value, 2)}
          >
            查看
          </Button>
        )}
      </div>
    );
  }

  //封装单条公司信息存储到localstorage里面
  packageLocalStorage = value => {
    setItem("singleData", JSON.stringify(value));
  };

  //封装列表请求接口
  packageList(param) {
    const params = {
      ...param,
      page_no: param && param.page_no ? param.page_no : 1,
      page_size: 10
    };
    this.props.dispatch({
      type: "credit/auditingListPage",
      payload: params
    });
  }

  //当页面加载完成的时候出发的事件
  componentDidMount() {
    this.packageList();
  }

  //当页面离开的时候出发的事件
  componentWillUnmount() {
    this.props.credit.auditingListData = [];
  }

  //翻页快速跳转到哪
  onChange = pageNumber => {
    this.packageList({
      page_no: pageNumber
    });
  };

  setLookPageStatus = (
    value,
    apiStatus,
    showHistoryStatus,
    returnBackUrlStatus,
    buttonNumberStatus
  ) => {
    this.props.dispatch({
      type: "credit/setShowLookButton",
      payload: {
        apiStatus: apiStatus,
        showHistoryStatus: showHistoryStatus,
        returnBackUrlStatus: returnBackUrlStatus,
        buttonNumberStatus: buttonNumberStatus
      }
    });
  };

  //查看操作
  handleLook = value => {
    //把当条数据存储到本地的数据 将作为查看页面接口入参 group_no 或者 change_id
    this.packageLocalStorage(value);

    //点击"查看"按钮  设置各种状态
    this.setLookPageStatus(value, 2, 2, 3, 1);

    //跳转查看页面
    this.props.history.push("/creditManage/Look");
  };

  //审核操作
  handleAuditing = value => {
    //把当条数据存储到本地的数据 将作为查看页面接口入参 group_no 或者 change_id
    this.packageLocalStorage(value);

    //点击"查看"按钮  设置各种状态
    this.setLookPageStatus(value, 2, 2, 3, 2);

    //跳转查看页面
    this.props.history.push("/creditManage/Look");
  };

  //查询
  handleSubmit = (err, value) => {
    if (err) {
      return;
    }
    // console.log(value);
    this.packageList({
      principal_mobile: trim(
        value && value.principal_mobile ? value.principal_mobile : ""
      ),
      name: trim(value && value.name ? value.name : "")
    });
  };

  render() {
    const { loading, credit } = this.props;
    const { auditingListData } = credit;
    const { datas, page_no, total } = auditingListData;
    const itemSearch = [
      {
        type: "Input",
        label: "负责人手机号",
        required: false,
        placeholder: "请输入",
        parameter: "principal_mobile"
      },
      {
        type: "Input",
        label: "集团名称",
        required: false,
        placeholder: "请输入",
        parameter: "name"
      }
    ];
    return (
      <Fragment>
        <Card title="" loading={loading}>
          <Search
            items={itemSearch}
            onSubmit={this.handleSubmit}
            buttonStyle={styles.searchButton}
          />
          <Table
            loading={loading}
            columns={this.columns}
            dataSource={datas}
            size="middle"
            scroll={{ x: 1500 }}
            pagination={false}
          />
          <Row type="flex" justify="end" className={styles.paginationBox}>
            <Pagination
              showQuickJumper
              onChange={this.onChange}
              defaultCurrent={page_no}
              total={total}
            />
          </Row>
        </Card>
      </Fragment>
    );
  }
}
