import React, { Component } from "react";
import { connect } from "dva";
import { Card, Table, Row, Button, Pagination, Modal, message } from "antd";
import Search from "../../../components/Search/index";
import styles from "../style.less";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
/*import ListQuery from 'components/ListQuery/index'; 接口调用*/
import ListQuery from "components/ListQuery";
import { issueBackColumns } from "../columns";
import { setItem, timestamp } from "../../../utils/utils";
import * as routerRedux from "react-router-redux";

const searchs = [
  {
    type: "input",
    label: "手机号",
    required: false,
    placeholder: "请输入",
    parameter: "mobile"
  },
  {
    type: "Select",
    label: "状态",
    required: false,
    placeholder: "请选择",
    className: "slx",
    parameter: "status",
    options: [{ key: 1, value: "未读" }, { key: 2, value: "已读" }]
  }
];

/**
 * 帮助中心-问题反馈
 * */
@connect(({ issueBack, loading }) => ({
  issueBack,
  loading: loading.effects["issueBack/issueBackGroup"]
}))
export default class IssueBack extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      visible: false,
      id: 0,
      mobile:"",
      status:null,
      myStyle:{}

    };
    this.columns = [
      ...issueBackColumns,
      {
        title: "操作",
        dataIndex: "action",
        render: this._handler
      }
    ];
  }

  //编辑模板
  _editTemplate = (value, e) => {
    this.setState({
      visible: true,
      valueslx: value.content,
      status: value.status,
      id: value.id
    });
  };
  //操作
  _handler = (text, record) => {
    return <a onClick={this._editTemplate.bind(this, record)}>查看</a>;
  };

  componentDidMount() {
    this.getListData();
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  componentWillUnmount() {}
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
  //重置
  onReset=()=>{
    this.getListData();
  }
  //提交
  onSubmit = (err, value) => {
    if (err) {
      return;
    }
    this.setState({
      mobile:value.mobile,
      status:value.status,
    });
    if (value["mobile"] || value["status"]) {
      const values = {
        ...value,
        pageNo: 1,
        pageSize: 15
      };
      this.getListData(values);
    }
  };

  //翻页
  pagination = pageNumber => {
    const params = {
      mobile:this.state.mobile,
      status:this.state.status,
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
      type: "issueBack/issueBackGroup",
      payload: value
    });
  }

  handleOk = () => {
    const valueOk = {
      id: this.state.id
    };
    this.setState({ loading: true });
    this.props
      .dispatch({
        type: "issueBack/savaIssueBackGroup",
        payload: valueOk
      })
      .then(() => {
        const { issueBack } = this.props;
        if (issueBack.submitLookStatus) {
          message.success("提交成功");

          setTimeout(() => {
            this.setState({ loading: false, visible: false });
            const _params = {
              mobile:this.state.mobile,
              status:this.state.status,
            }
            this.getListData(_params);
          }, 200);
        }
      });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };
  render() {
    const { issueBack, loading } = this.props;
    const { groupData } = issueBack; // groupData 展示列表数据
    const { pageNo, total, dataSource } = groupData;

    return (
      <PageHeaderLayout
        title="问题反馈"
        breadcrumbList={[{title: "帮助中心"},{title: "问题反馈"}]}
      >
        <div className={styles.issueBackWar} style={this.state.myStyle}>
          {/*<ContentTitle title="日志管理" />*/}
          <ListQuery
            bordered={false}
            /*linkName="新增签名"*/
            linkName=""
            columns={this.columns}
            items={searchs}
            dataSource={dataSource}
            current={1}
            total={total}
            loading={loading}
            pagination={this.pagination}
            onSubmit={this.onSubmit}
            onReset={this.onReset}
          />
        </div>
        <Modal
          visible={this.state.visible}
          title="问题反馈"
          onCancel={this.handleCancel}
          style={{top:190}}
          footer={[
            <Button key="back" onClick={this.handleCancel}>
              取消
            </Button>,
            <Button
              key="submit"
              type="primary"
              loading={loading}
              onClick={this.handleOk}
              disabled={this.state.status === 1 ? false : true}
            >
              已读
            </Button>
          ]}
        >
          <p>{this.state.valueslx}</p>
        </Modal>
      </PageHeaderLayout>
    );
  }
}
