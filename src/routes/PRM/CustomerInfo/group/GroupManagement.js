import React, { Component } from "react";
import { connect } from "dva";
import { routerRedux } from "dva/router";
import PageHeaderLayout from "../../../../layouts/PageHeaderLayout";
import ListQuery from "components/ListQuery/index";
import { setItem } from "../../../../utils/utils";
import { CELL_NUMBER } from "../../../../utils/pattern";
import { groupColumns } from "../columns";

const searchs = [
  {
    type: "Input",
    label: "负责人手机",
    required: false,
    placeholder: "请输入",
    parameter: "phone",
    pattern: CELL_NUMBER
    //options:[]
  },
  {
    type: "Input",
    label: "集团名称",
    required: false,
    placeholder: "请输入",
    parameter: "name"
  }
];

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.effects["customer/queryGroup"]
}))
export default class GroupManagement extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%"
    };

    this.columns = [
      ...groupColumns,
      {
        title: "操作",
        dataIndex: "action",
        render: (text, record) => (
          <a onClick={this.affiliated.bind(this, record)}>关联企业</a>
        )
      }
    ];
  }

  componentDidMount() {
    this.getListData();
  }

  componentWillUnmount() {}

  //关联企业
  affiliated = (record, e) => {
    e.preventDefault();
    console.log(record);

    setItem("affiliated", JSON.stringify(record));

    this.props.dispatch(routerRedux.push("/customer/new-group"));
  };

  //提交查询方法
  onSubmit = (err, value) => {
    if (err) {
      return;
    }

    //二者必选其一
    if (value.phone || value.name) {
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
    const value = {
      ...params,
      page_no: params && params.page_no ? params.page_no : 1,
      page_size: 10
    };

    this.props.dispatch({
      type: "customer/queryGroup",
      payload: value
    });
  }

  render() {
    const { customer, loading } = this.props;

    const { groupData } = customer;
    const { page_no, total, dataSource } = groupData;

    return (
      <PageHeaderLayout>
        <ListQuery
          items={searchs}
          columns={this.columns}
          dataSource={dataSource}
          current={page_no}
          total={total}
          loading={loading}
          link="/customer/new-group"
          onSubmit={this.onSubmit}
          pagination={this.pagination}
        />
      </PageHeaderLayout>
    );
  }
}
