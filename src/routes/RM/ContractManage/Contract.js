import React, { Component, Fragment } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import { Card, Table, Row, Button, Pagination } from "antd";

import Search from "../../../components/Search/index";
import { getContractColumns } from "./Columns";
import { setItem, trim } from "../../../utils/utils";

import styles from "./Contract.less";

@connect(({ contract, loading }) => ({
  contract,
  loading: loading.effects["contract/queryContractPage"]
}))
export default class Contract extends Component {
  constructor(props) {
    super(props);

    this.state = {};

    this.columns = [
      ...getContractColumns(),
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => this.renderOperation(record)
      }
    ];
  }

  //封装列表请求接口
  packageList(param) {
    const params = {
      page_no: param && param.page_no ? param.page_no : 1,
      page_size: 10,
      ...param
    };
    this.props.dispatch({
      type: "contract/queryContractPage",
      payload: params
    });
  }

  //
  componentDidMount() {
    this.packageList();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "credit/clear"
    });
  }

  //翻页快速跳转到哪
  onChange = pageNumber => {
    this.packageList(pageNumber);
  };

  //查询
  handleSubmit = (err, value) => {
    if (err) {
      return;
    }
    this.packageList({
      group_mobile: trim(value && value.group_mobile ? value.group_mobile : ""),
      group_name: trim(value && value.group_name ? value.group_name : ""),
      agreement_status:
        value && value.agreement_status ? [value.agreement_status] : []
    });
  };

  //status : 1:待签署协议 2:待审核,3:审核通过,4:审核驳回
  renderOperation(value) {
    return (
      <div>
        {value.source_status === 1 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleUpLoad.bind(this, value, "upload")}
          >
            上传协议
          </Button>
        )}
        {value.source_status === 2 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleAuditing.bind(this, value, "auditing")}
          >
            审核
          </Button>
        )}
        {value.source_status === 3 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleLook.bind(this, value, "look")}
          >
            查看
          </Button>
        )}
        {value.source_status === 4 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleUpLoad.bind(this, value, "modify")}
          >
            修改协议
          </Button>
        )}
        {value.source_status === 5 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleUpLoad.bind(this, value, "modify")}
          >
            修改协议
          </Button>
        )}
      </div>
    );
  }

  //封装单条公司信息存储到localstorage里面
  packageLocalStorage = value => {
    setItem("singleData", JSON.stringify(value));
  };

  //封装 更改 调取详情页面的状态值  1不调取 2调取
  packageSetDetailStatus = (value, detailStatus) => {
    this.props.dispatch({
      type: "contract/setDetailStatus",
      payload: {
        detailStatus: detailStatus
      }
    });
  };

  //封装 更改 详情页面按钮的状态值  1:显示取消 2:显示 通过 驳回 取消
  packageSetButtonStatus = (value, buttonNumberStatus) => {
    this.props.dispatch({
      type: "contract/setButtonStatus",
      payload: {
        buttonNumberStatus: buttonNumberStatus
      }
    });
  };

  //上传协议 和 修改协议
  //设置为1： 进入 上传协议页面 不调取详情页面  设置为2： 进入 进入 上传协议页面 调取详情页面
  handleUpLoad = (value, type) => {
    this.packageLocalStorage(value);
    if (type === "upload") {
      this.packageSetDetailStatus(value, 1);
    } else {
      this.packageSetDetailStatus(value, 2);
    }
    //跳转页面
    this.props.history.push("/contractManage/upData");
  };

  //审核
  handleAuditing = value => {
    this.packageLocalStorage(value);
    this.packageSetButtonStatus(value, 2);
    this.props.history.push("/contractManage/look");
  };

  //查看操作
  handleLook = value => {
    this.packageLocalStorage(value);
    this.packageSetButtonStatus(value, 1);
    this.props.history.push("/contractManage/look");
  };

  render() {
    const { loading, contract } = this.props;
    const { contractData } = contract;
    const { datas, page_no, total } = contractData;
    // 1:待签署协议,2:提交审核,3:审核通过,4:审核驳回,5:审核中
    const itemSearch = [
      {
        type: "Input",
        label: "负责人手机号",
        required: false,
        placeholder: "请输入",
        parameter: "group_mobile"
      },
      {
        type: "Input",
        label: "集团名称",
        required: false,
        placeholder: "请输入",
        parameter: "group_name"
      },
      {
        type: "Select",
        label: "状态",
        required: false,
        placeholder: "请选择",
        parameter: "agreement_status",
        options: [
          {
            key: 1,
            value: "待签署协议"
          },
          {
            key: 2,
            value: "提交审核"
          },
          {
            key: 3,
            value: "审核通过"
          },
          {
            key: 4,
            value: "审核驳回"
          },
          {
            key: 5,
            value: "审核中"
          }
        ]
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
