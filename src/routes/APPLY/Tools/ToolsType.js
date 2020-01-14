import React, { PureComponent } from "react";
import {
  Card,
  Form,
} from "antd";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import TableForm from "./TableForm";
import styles from "./style.less";


/**
 * 工具类型
 */
@connect(({ toolsType, loading }) => ({
  toolsType,
  loading: loading.effects["toolsType/toolsTypeGroup"] /*提交后的代码*/
}))
@Form.create()
export default class ToolsType extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      myStyle:{}
    };
  }
  componentDidMount() {
    this.getListData();
    this.setItemHeight();
    const _this = this;
    window.onresize = function () {
      _this.setItemHeight();
    }
  }
  setItemHeight = () => {
    let clientHeight = document.body.scrollHeight;
    let setHeight = clientHeight-64-103-48+"px";
    let mystyle={
      minHeight: setHeight,
      background:"#ffffff"
    }
    this.setState({
      myStyle:mystyle
    })
  }
  //获取列表数据
  getListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 15
    };
    this.props.dispatch({
      type: "toolsType/toolsTypeGroup",
      payload: value
    });
  }

  render() {
    const { toolsType, form } = this.props;
    const { groupData } = toolsType; // groupData 展示列表数据
    // console.log("toolsType119",toolsType);
    const {
      /* pageNo,
      total,*/
      dataSource
    } = groupData;
    const { getFieldDecorator} = form;

    return (
      <PageHeaderLayout
        title="工具类型"
        breadcrumbList={[{title: "应用管理"},{title: "工具类型"}]}
        wrapperClassName={styles.advancedForm}
      >
        <div style={this.state.myStyle}>
          <Card title="" bordered={false} style={{marginBottom:"24px"}}>
            {getFieldDecorator("members", {
              initialValue: dataSource
            })(<TableForm refresh={(params) => this.getListData(params)}/>)}
          </Card>
        </div>
      </PageHeaderLayout>
    );
  }
}
