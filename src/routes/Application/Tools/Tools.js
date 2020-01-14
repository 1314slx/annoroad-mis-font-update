import React, { Component } from "react";
import { connect } from "dva";
import {
  Row,
  Col,
  Form,
  Card,
  Input,
  Button,
  Icon,
  AutoComplete,
  Spin,
  message,
  Modal, Tooltip, Tag, notification
} from "antd";
import { routerRedux } from "dva/router";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import styles from "./tools.less";
import TagSelect from "components/TagSelect";
import StandardFormRow from "components/StandardFormRow";
import request from "../../../utils/request";

const FormItem = Form.Item;
import $ from "jquery";
import { codeMark } from "../../../utils/options";
import { getItem, removeItem } from "../../../utils/utils";

let that;
/**
 * 应用中心-分析工具
 * */
@Form.create()
@connect(({ myTools, loading }) => ({
  myTools,
  loading: loading.effects["myTools/queryToolList"]
}))
export default class Tools extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      width: "100%",
      type: false,
      expandable: false,
      status: 0,
      _pageSize: 1,
      loadTypeCode: "",  //不同模块切换时的typeCode
      searchName: "",
      selectTag: "all"

    };
    this.toolTypeTab = "all";
    this._count = 1;
    that = this;
    this.searchName = "";
  }

  /**
   * 如果结题报告跳转小工具未找到数据，则跳转回列表页面，显示弹窗
   * */
  concluding() {
    Modal.info({
      title: "找不到指定的小工具",
      content: (
        <div>
          尊敬的用户，系统找不到指定的小工具，请您联系安诺云工作人员，及时排查解决。
        </div>
      ),
      onOk() {
        removeItem("CONCLUDING");
      }
    });
  }

  componentWillMount() {
    const _isConCluding = getItem("CONCLUDING");
    if (_isConCluding && _isConCluding == 1) {
      this.concluding();
    }
  }

  componentDidMount() {
    this.getTaskTailListData();
    const { dispatch } = this.props;
    const params = {
      pageNo: 1,
      pageSize: 15,
    };
    dispatch({
      type: "myTools/queryToolsMenuList",
      payload: params
    }).then(() => {
      this._expandable();
    });
    dispatch({
      type: "myTools/queryToolsNameList",
      payload: params
    });

    this._expandable();
    const _this = this;
    window.onresize = function() {
      _this._expandable();

    };
// 加载事件
    $(window).scroll(
      function() {
        var scrollTop = $(this).scrollTop();
        var scrollHeight = $(document).height();
        var windowHeight = $(this).height();

        if (scrollHeight - windowHeight - scrollTop < 1) {
// 此处是滚动条到底部时候触发的事件，在这里写要加载的数据，或者是拉动滚动条的操作
          //const params = { pageNo: 1,pageSize:24 };
          //this.getTaskTailListData(params);

          that._count = that._count + 1;
          request("/annoroad-cloud-mis-server/analysis/tool/find", {
            body: {
              pageNo: that._count,
              pageSize: 12,
              toolTypeCode: that.state.loadTypeCode,
              toolName: that.searchName
            }
          }).then((data) => {
            if (data) {
              if (data.code === "000000") {

                if (data.data.datas.length > 0) {
                  dispatch({
                    type: "myTools/addToolsData",
                    payload: data.data.datas
                  });
                }
              } else {
                message.error(codeMark[data.code]);
              }
            } else {
              message.error("系统错误");
            }
          });
        }
      });
  }

  _expandable() {
    const _tagContent = document.getElementById("tagContent");
    if (_tagContent) {
      const _height = _tagContent.offsetHeight;
      let _expandable = false;
      if (_height > 33) {
        _expandable = true;
      }
      this.setState({ expandable: _expandable });
    }
    /* const layout_content = document.getElementsByClassName("ant-layout-content");

     if (layout_content&&layout_content[0]) {
       layout_content[0].style.backgroundColor = "pink";
     }*/

  }

  componentWillUnmount() {
    const layout_content = document.getElementsByClassName("ant-layout-content");
    if (layout_content) {
      //layout_content.style.backgroundColor="#ff0000";
      // layout_content[0].style.backgroundColor = "#ffffff";
    }
    $(window).unbind("scroll");
  }

  getTaskTailListData(params) {
    const value = {
      ...params,
      pageNo: params && params.pageNo ? params.pageNo : 1,
      pageSize: 12,
      toolName: this.searchName
    };
    this.props.dispatch({
      type: "myTools/queryToolList",
      payload: value
    });
  }

  //查看操作
  handleLook = value => {
    const _this = this;  //myTools/queryToolDetailList
    request("/annoroad-cloud-mis-server/tool/version/detail", {
      body: {
        code: value.code
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          if(data.data.status==9){
            message.error("小工具已下架")
            setTimeout(function() {
              _this.getTaskTailListData();
            }, 3000);
          }else{
            _this.props.dispatch(
              routerRedux.push({
                pathname: "/application/tool/analysis",
                query: {
                  code: value.code,
                  interactive: true,//区别是我的工具预览还是审核测试
                  analysisMark:true//区别是否是分析工具
                }
              })
            );
          }
        }else{
          notification.error({
            message: `请求错误`,
            description: data.msg
          });
        }
      }
    })


  };
  //切换工具类型获取对应类型的工具list
  handleFormSubmit = value => {
    this.setState({
      status: 1
    });
    if (this.toolTypeTab != value || value == "all") {
      this.toolTypeTab = value;
      const params = { toolTypeCode: value === "all" ? "" : value };
      this.getTaskTailListData(params);

      this.setState({ type: false, loadTypeCode: params.toolTypeCode, selectTag: this.toolTypeTab });
    }
    this._count = 1;
  };
  /**
   * 重置
   */
  cancelHandle = () => {
    // this.handleFormSubmit("all");
    this.props.form.resetFields();
    this.setState({
      loadTypeCode: "",
      searchName: "",
      status: 0,
      type: false,
      //expandable: false,
    });
    this._count = 1;
    this.searchName = "";

    const _target = $("#tagContent").find("div").eq(1);
    if (_target) {
      _target.click();
    }
  };

  //工具名称搜索

  handleSearch = e => {
    e.preventDefault();
    const { form } = this.props;
    const fromData = form.getFieldsValue();
    const _name = fromData["name"];
  };

  // 查询搜索
  onSubmit = e => {
    e.preventDefault();
    this._count = 1;
    const { form } = this.props;
    form.validateFields((err, fieldsValue) => {
      this.setState({
        searchName: fieldsValue.name
      });
      this.searchName = fieldsValue.name;
      const value = {
        pageNo: 1,
        pageSize: 12,
        toolName: this.searchName,
        toolTypeCode: this.state.loadTypeCode
      };
      this.props.dispatch({
        type: "myTools/queryToolList",
        payload: value
      });

    });
  };


  //const content


  render() {
    const {
      myTools,
      form,
      loading
    } = this.props;

    const { groupData, groupMenuData, groupToolNameData } = myTools;
    const { menuDataSource } = groupMenuData;
    //_list为工具名称
    let _list = [];
    if (groupToolNameData&&groupToolNameData.length>0) {
      groupToolNameData.map(value => {
        _list.push(value.toolName);
      });
    }
    let bodyStyle = { padding: "24px 32px" };
    const { getFieldDecorator } = form;
    return (
      <PageHeaderLayout
        title="分析工具"
        breadcrumbList={[{ title: "应用中心" }, { title: "分析工具" }]}
        changeHeight="1"
        props={this.props}
      >
        <div className={styles.coverCardList}>
          <Card bordered={false} bodyStyle={bodyStyle}>
            <Form layout="inline">
              <StandardFormRow title="" block style={{ paddingBottom: 0, marginBottom: 0, paddingLeft: 0 }}>
                <FormItem>
                  {getFieldDecorator("category")(
                    <TagSelect _value={this.state.status}
                               value={this.state.selectTag}
                               onChange={this.handleFormSubmit}
                               style={{ marginBottom: "24px", marginLeft: "0px" }}
                               expandable={this.state.expandable}>
                      {
                        menuDataSource && menuDataSource.map((value, index) => (
                          <TagSelect.Option key={index} value={value.code}>
                            {
                              value.name
                            }
                          </TagSelect.Option>
                        ))
                      }
                    </TagSelect>
                  )}
                </FormItem>
              </StandardFormRow>
            </Form>
            {/*   <Form layout="inline" onSubmit={this.onSubmit}  className={styles.searchBtn}>*/}
            <Form layout="inline" onSubmit={this.onSubmit} className={styles.searchBtn}>
              <Row>
                <Col span={24}>
                  <FormItem label="工具名称" className={styles.toolNamesItem}>
                    {getFieldDecorator("name")(
                      <AutoComplete
                        dataSource={_list}
                        className={styles.autoDiv}
                        placeholder="请输入关键词"
                        /*onChange={this.onChangeSlx}*/
                        filterOption={(inputValue, option) =>
                          option.props.children
                            .toUpperCase()
                            .indexOf(inputValue.toUpperCase()) !== -1
                        }
                      >
                        {/* <Input placeholder="请输入关键词" />*/}
                      </AutoComplete>
                    )}
                  </FormItem>
                  <FormItem>
                  <span className={styles.submitButtons}>
                    <Button
                      type="primary"
                      className={styles.search_btn}
                      icon="search"
                      htmlType="submit"
                      style={{ marginRight: 0 }}
                    >
                      搜索
                    </Button>
                  </span>
                  </FormItem>
                  <FormItem>
                  <span className={styles.submitButtons}>
                    <Button
                      className={styles.search_btn}
                      /*type="primary"
                      icon="search"
                      htmlType="submit"*/
                      style={{ marginRight: 0 }}
                      onClick={this.cancelHandle}
                    >
                      重置
                    </Button>
                  </span>
                  </FormItem>
                </Col>
              </Row>
            </Form>
          </Card>
          {/*<div className={styles.cardList}>{cardList}</div>*/}
          <div className="gutter-example coverflow">
            <Spin spinning={loading}>
              <Row gutter={24}>
                {groupData && groupData.datas && groupData.datas.length > 0 ? (
                  groupData.datas.map((value, index) => (
                    <Col key={index} className="gutter-row" span={8}>
                      <div className="gutter-box" style={{ background: "#fff", borderRadius: "2px" }}>
                        <div
                          className={styles.cardMeta}
                          onClick={this.handleLook.bind(this, value)}
                        >
                          <div className={styles.metaAvatar}>
                            <a>
                              {/*<img src="https://gw.alipayobjects.com/zos/rmsportal/dURIMkkrRFpPgTuzkwnB.png" />*/}
                              <img src={value.logo}/>
                            </a>
                          </div>
                          <div className={styles.metaDetail}>
                            {/*onClick = {this.handLook.blind(this,value)}*/}
                            <div className={styles.meta_title}>
                              {value.overtStatus==2?<Tag color="blue"  className={styles.privateWord} >非公开</Tag>:""}
                              <Tooltip title={value.toolName}><a>{value.toolName}</a></Tooltip>{/*overtStatus 是否公开 1：是，2：否*/}
                            </div>
                            <div className={styles.meta_content}>
                              {value.summary}
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  ))) : (
                  <div className={styles.expect}>
                    <Icon type="copy"/>
                    <p>研发中敬请期待</p>
                  </div>
                )
                }
              </Row>
            </Spin>
          </div>
        </div>
      </PageHeaderLayout>
    );
  }
}
