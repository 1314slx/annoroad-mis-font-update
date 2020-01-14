import React, { Component } from "react";
import { connect } from "dva";
import { Switch, message } from "antd";

import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import Debounce from "lodash-decorators/debounce";
import { accountIncColumns } from "../columns";
import { CELL_NUMBER } from "../../../../utils/pattern";
import ListQuery from "components/ListQuery/index";

const searchs = [
  {
    type: "Input",
    label: "登录手机号",
    required: false,
    placeholder: "请输入",
    parameter: "login_mobile",
    pattern: CELL_NUMBER
  },
  {
    type: "Input",
    label: "集团名称",
    required: false,
    placeholder: "请输入",
    parameter: "group_name"
  },
  {
    type: "Input",
    label: "企业名称",
    required: false,
    placeholder: "请输入",
    parameter: "enterprise_name"
  }
];

@connect(({ account, loading }) => ({
  account,
  loading: loading.effects["account/queryAccount"]
}))
export default class EnterpriseAccount extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%"
    };

    this.columns = [
      ...accountIncColumns,
      {
        title: "是否启用",
        dataIndex: "action",
        render: (text, record) => (
          <Switch
            checkedChildren={"是"}
            unCheckedChildren={"否"}
            defaultChecked={record.status}
            onChange={this.onChange.bind(this, record)}
          />
        )
      }
    ];
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillUnmount() {}

  //是否启用操作，

  onChange = (record, checked) => {
    this.isEnabled(record, checked);
  };

  //debounce 强制函数在某段时间内只执行一次，throttle 强制函数以固定的速率执行
  @Debounce(600)
  isEnabled(record, checked) {
    if (record && record.hasOwnProperty("accountId")) {
      const params = {
        no: record["accountId"]
      };
      let _type = "account/openAccount";
      if (checked) {
        //开启
        //console.log('开启')
      } else {
        //关闭
        _type = "account/closeAccount";
        //console.log('关闭')
      }

      this.props
        .dispatch({
          type: _type,
          payload: params
        })
        .then(() => {
          const { account } = this.props;
          if (account.accountStatus) {
            message.success("操作成功");
          } else {
            message.error("操作失败");
            //操作失败重置 按钮状态，只能刷新列表

            this.getListData();
          }
        });
    }
  }

  //提交查询方法
  onSubmit = (err, value) => {
    if (err) {
      return;
    }

    //三选一
    if (value.login_mobile || value.group_name || value.enterprise_name) {
      const values = {
        ...value,
        page_no: 1,
        page_size: 10
      };
      this.getListData(values);
    }
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      page_no: pageNumber
    };
    this.getListData(params);
  };

  //获取列表数据
  getListData(params) {
    console.log("66666")
    const value = {
      ...params,
      page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10
    };
    //console.log('请求参数', value);

    this.props.dispatch({
      type: "account/queryAccount",
      payload: value
    });
  }

  render() {
    const { account, loading } = this.props;

    const { saveEntAccountList } = account;

    const { page_no, total, dataSource } = saveEntAccountList;

    return (
      <PageHeaderLayout>
        <ListQuery
          items={searchs}
          columns={this.columns}
          dataSource={dataSource}
          current={page_no}
          total={total}
          loading={loading}
          link="/account/newInc-account"
          onSubmit={this.onSubmit}
          pagination={this.pagination}
        />
      </PageHeaderLayout>
    );
  }
}
