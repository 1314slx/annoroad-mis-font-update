import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination } from "antd";

import { getAuditingListColumns } from "./Columns";
import Search from "../../../components/Search/index";
import { setItem, trim } from "../../../utils/utils";
import styles from "./Financing.less";
import statusFormat from "../../../utils/status";
import times from "../../../utils/time";
import money from "../../../utils/money";

@connect(({ financing, loading }) => ({
  financing,
  loading: loading.effects["financing/auditingListPage"]
}))
export default class Auditing extends Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.columns = [
      ...getAuditingListColumns(),
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
        {(value.sourceStatus === 20 || value.sourceStatus === 90) && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleLook.bind(this, value)}
          >
            查看
          </Button>
        )}
        {value.sourceStatus === 30 && (
          <Button
            type="primary"
            ghost
            size="small"
            className={styles.dashedBtn}
            onClick={this.handleAuditing.bind(this, value)}
          >
            审核
          </Button>
        )}
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
    this.packageSetButtonStatus(1);
    this.props.history.push("/financing/Look");
  };

  //审核操作
  handleAuditing = value => {
    this.packageLocalStorage(value);
    this.packageSetButtonStatus(2);
    this.props.history.push("/financing/Look");
  };

  //封装列表请求接口
  packageList(param) {
    const params = {
      pageNo: param && param.pageNo ? param.pageNo : 1,
      pageSize: 10,
      ...param
    };

    this.props.dispatch({
      type: "financing/auditingListPage",
      payload: params
    });
  }

  //封装 更改 详情页面按钮的状态值  1:显示取消 2:显示 通过 驳回 取消
  packageSetButtonStatus = buttonNumberStatus => {
    this.props.dispatch({
      type: "financing/setButtonStatus",
      payload: {
        buttonNumberStatus: buttonNumberStatus
      }
    });
  };

  componentDidMount() {
    this.packageList();
    //获取融资渠道列表
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 1000
    };
    dispatch({
      type: "financing/ChannelListPage",
      payload: params
    });
  }

  componentWillUnmount() {
    this.props.financing.auditingListData = [];
  }

  //翻页快速跳转到哪
  onChange = pageNumber => {
    this.packageList({
      pageNo: pageNumber
    });
  };

  //查询
  handleSubmit = (err, values) => {
    console.log(values);
    if (err) {
      return;
    }
    this.packageList({
      channelNo: trim(values && values.channelNo ? values.channelNo : ""),
      status: values && values.status ? [values.status] : [],
      enterpriseName:
        values && values.enterpriseName ? values.enterpriseName : ""
    });
  };

  render() {
    const { financing, loading } = this.props;
    const { auditingListData, channelListData } = financing;
    const { datas, pageNo, total } = auditingListData;
    let channelParams = [];
    channelListData &&
      channelListData.datas &&
      channelListData.datas.map((value, index) => {
        channelParams.push({
          key: value.no,
          value: value.name
        });
      });
    console.log(channelParams);
    const itemSearch = [
      {
        type: "Select",
        label: "审核状态",
        required: false,
        placeholder: "请选择",
        parameter: "status",
        options: [
          {
            key: 90,
            value: "审核通过"
          },
          {
            key: 20,
            value: "审核驳回"
          },
          {
            key: 30,
            value: "待审核"
          }
        ]
      },
      {
        type: "Input",
        label: "企业名称",
        required: false,
        placeholder: "请输入",
        parameter: "enterpriseName"
      },
      {
        type: "Select",
        label: "资金渠道",
        required: false,
        placeholder: "请选择",
        parameter: "channelNo",
        options: channelParams
      }
    ];

    return (
      <Card title="" loading={loading}>
        <Search items={itemSearch} onSubmit={this.handleSubmit} />
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
