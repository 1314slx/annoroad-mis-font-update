import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";

import { getApplyListColumns } from "./Columns";
import Search from "../../../components/Search/index";
import { setItem, trim } from "../../../utils/utils";
import styles from "./Financing.less";

@connect(({ financing, loading }) => ({
  financing,
  loading: loading.effects["financing/queryApplyPage"]
}))
export default class Apply extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%"
    };

    this.columns = [
      ...getApplyListColumns(),
      {
        title: "操作",
        dataIndex: "operation",
        render: (text, record) => this.renderOperation(record)
      }
    ];
  }

  //status : 1:待签署协议 2:待审核,3:审核通过,4:审核驳回
  renderOperation(value) {
    return (
      <div>
        <Button
          type="primary"
          ghost
          size="small"
          className={styles.dashedBtn}
          onClick={this.handleLook.bind(this, value, "upload")}
        >
          查看
        </Button>
        <Button
          type="primary"
          ghost
          size="small"
          className={styles.dashedBtn}
          onClick={this.handleSend.bind(this, value, "auditing")}
        >
          发起融资
        </Button>
      </div>
    );
  }

  //封装单条公司信息存储到localstorage里面
  packageLocalStorage = value => {
    setItem("singleData", JSON.stringify(value));
  };

  //查看操作
  handleLook = value => {
    this.packageLocalStorage(value);
    this.props.history.push("/financing/enterpriseInfo");
  };

  //发起融资操作
  handleSend = value => {
    this.packageLocalStorage(value);
    this.props.history.push("/financing/create");
  };

  //封装列表请求接口
  packageList(param) {
    const params = {
      pageNo: param && param.pageNo ? param.pageNo : 1,
      pageSize: 10,
      status: [4, 5, 6],
      ...param
    };

    this.props.dispatch({
      type: "financing/queryApplyPage",
      payload: params
    });
  }

  componentDidMount() {
    this.packageList();
  }

  componentWillUnmount() {
    this.props.dispatch({
      type: "financing/clear"
    });
  }

  //翻页快速跳转到哪
  onChange = pageNumber => {
    this.packageList({
      pageNo: pageNumber
    });
  };

  //查询
  handleSubmit = (err, value) => {
    if (err) {
      return;
    }
    this.packageList({
      name: trim(value && value.name ? value.name : "")
    });
  };

  render() {
    const { financing, loading } = this.props;
    const { applyListData } = financing;
    const { datas, pageNo, total } = applyListData;
    const itemSearch = [
      {
        type: "Input",
        label: "企业名称",
        required: false,
        placeholder: "请输入",
        parameter: "name"
      }
    ];

    return (
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
            defaultCurrent={pageNo}
            total={total}
          />
        </Row>
      </Card>
    );
  }
}
