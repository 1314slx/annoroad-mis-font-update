import React, { PureComponent } from "react";
import {
  Card,
  Form,
  Spin
} from "antd";
import { connect } from "dva";
import PageHeaderLayout from "../../layouts/PageHeaderLayout";
import TableForm from "./TableForm";
import styles from "./style.less";

/**
 * 视频类型
 */
@connect(({ video, loading }) => ({
  video,
  loading: loading.effects["video/videoTypeGroup"]
}))
@Form.create()
export default class VideoTypeList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      myStyle: {},
      width: "100%"
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
  //设置内容最大高度
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
      status: 1
    };
    this.props.dispatch({
      type: "video/videoTypeGroup",
      payload: value
    });
  }
  render() {
    const { video, form ,loading} = this.props;
    const { groupData } = video; // groupData 展示列表数据
    const {
      dataSource
    } = groupData;
    const { getFieldDecorator} = form;

    return (
      <PageHeaderLayout
        title="视频类型"
        breadcrumbList={[{title: "视频管理"},{title: "视频类型"}]}
        wrapperClassName={styles.advancedForm}
      >
        <div style={this.state.myStyle} className={styles.videoTypeWapper}>
          <Spin spinning={loading}>
           <Card title="" bordered={false}>
              {getFieldDecorator("members", {
                initialValue: dataSource
              })(<TableForm refresh={(params) => this.getListData(params)}/>)}
            </Card>
          </Spin>
        </div>
      </PageHeaderLayout>
    );
  }
}
