import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Table, Row, Button, Pagination } from "antd";

import Search from "../../../components/Search/index";
import { getCreditApplyColumns } from "./Columns";
import { setItem, trim } from "../../../utils/utils";

import styles from "./Credit.less";

@connect(({ credit, loading }) => ({
  credit,
  loading: loading.effects["credit/applyListCreditPage"]
}))
export default class Apply extends Component {
  /**
   * showLook : 1, //1:显示当前页面  2:显示查看页面
   * apiStatus: 1,//1:调用"授信信息查询接口" 2:调用"授信申请详情查询"
   * showHistoryStatus: 1,//1:显示"查看历史文件"  2:隐藏"查看历史文件"
   * returnBackUrlStatus: 1,//1:返回"授信管理列表" 2:返回"授信申请列表" 3:返回"授信审核列表"
   * buttonNumberStatus: 1,//1:显示返回 2.显示 通过 驳回 返回
   *
   * //'授信'和'修改授信'
   * applyDetailStatus: 1,  //1:不调用"授信申请详情查询" 2：调用"授信申请详情查询"
   * backUrlStatus: 1, //1:返回"授信管理列表"页面 2:返回"授信申请列表"页面
   * @param props
   */

  constructor(props) {
    super(props);

    this.state = {};

    this.columns = [
      ...getCreditApplyColumns(),
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
        {(value.source_status === 1 || value.source_status === 4) && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleCredit.bind(this, value, 1)}
          >
            修改授信
          </Button>
        )}
        {(value.source_status === 2 || value.source_status === 3) && (
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
      page_no: param && param.page_no ? param.page_no : 1,
      page_size: 10,
      ...param
    };
    this.props.dispatch({
      type: "credit/applyListCreditPage",
      payload: params
    });
  }

  //当页面加载完成的时候出发的事件
  componentDidMount() {
    this.packageList();
  }

  //当页面离开的时候出发的事件
  componentWillUnmount() {
    this.props.credit.applyListCreditData = [];
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
    this.setLookPageStatus(value, 2, 2, 2, 1);

    //跳转查看页面
    this.props.history.push("/creditManage/Look");
  };

  setCreatePageStatus = (value, applyDetailStatus, backUrlStatus) => {
    this.props.dispatch({
      type: "credit/setApplyDetailStatus",
      payload: {
        applyDetailStatus: applyDetailStatus,
        backUrlStatus: backUrlStatus
      }
    });
  };
  //修改授信操作
  handleCredit = value => {
    //把当条数据存储到本地的数据 将作为创建页面接口入参 group_no 或者 change_id
    this.packageLocalStorage(value);

    //进入 create页面 调取 授信申请详情查询接口,切点击 返回 提交 保存 返回 授信申请列表页面
    this.setCreatePageStatus(value, 2, 2);

    this.props.history.push("/creditManage/create");
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
    const { applyListCreditData } = credit;
    const { total, datas, page_no } = applyListCreditData;

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
              showQuickJumper={true}
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
