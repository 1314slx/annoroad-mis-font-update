import React, { PureComponent, Fragment } from "react";
import { Table, Button, Input, message, Popconfirm, Divider, Pagination, Row, Tooltip } from "antd";
import styles from "./style.less";
import ConfirmModal from "components/ConfirmModal";
import { connect } from "dva";
import request from "../../utils/request";
import { codeMark } from "../../utils/options";
import {CELL_NUMBER} from "../../utils/pattern";
@connect(({ video, loading }) => ({
  video,
}))
export default class TableForm extends PureComponent {
  index = 0;
  cacheOriginData = {};
  constructor(props) {
    super(props);
    this.state = {
      data: props.value,
      loading: false,
      visible: false,
      currentRecord: null,
      trimNum: false,
      _pageSize:20,
      _pageNum: 1
    };
  }
  UNSAFE_componentWillReceiveProps(nextProps) {
    if ("value" in nextProps) {
      this.setState({
        data: nextProps.value
      });
    }
  }

  getRowByKey(key, newData) {
    const { data } = this.state;
    return (newData || data).filter(item => item.key === key)[0];
  }

  toggleEditable = (e, key) => {
    e.preventDefault();
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      // 进入编辑状态时保存原始数据
      if (!target.editable) {
        this.cacheOriginData[key] = { ...target };
      }
      target.editable = !target.editable;
      this.setState({ data: newData });
    }
  };

//添加无保存时对应删除
  remove(key) {
    const { data } = this.state;
    const { onChange } = this.props;
    const newData = data.filter(item => item.key !== key);
    this.setState({ data: newData });
    onChange(newData);
  }

  //删除数据确认
  _deleteConfirm(record) {
    this.setState({
      visible: true,
      currentRecord: record
    });
  }

  // 删除取消
  handleCancel = () => {
    this.setState({
      visible: false
    });
  };

  // 删除确定
  handleOk = () => {
    this.setState({
      confirmLoading: false
    });
    const _data = this.state.currentRecord;
    const _code = _data ? _data.code : false;
    request('/annoroad-cloud-mis-server/whitelist/item/delete',{body:{
        code:_code,
        themeCode:this.props.themeCode,
      }}).then((data)=>{
      if(data) {
        if (data.code === "000000") {
          /*message.success("保存成功");*/
          this.setState({ currentRecord: null });
          const value = {
            themeCode:this.props.themeCode,
            pageSize: 20,
            pageNo:1
          };
          this.setState({
            visible:false
          })
          this.props.dispatch({
            type: "video/whitelistList",
            payload: value
          })
        }else{
          message.error(codeMark[data.code]);
        }
      }})
  };

  handleKeyPress(e, key) {
    const target = this.getRowByKey(key);
    if (e.key === "Enter") {
      this.saveRow(e, key);
    }
  }
  //每一行的改变
  handleFieldChange(e, fieldName, key) {
    const { data } = this.state;
    const newData = data.map(item => ({ ...item }));
    const target = this.getRowByKey(key, newData);
    if (target) {
      target[fieldName] = e.target.value;
      this.setState({ data: newData });
    }
  }

  // 编辑保存
  saveRow(e, key) {
    e.persist();
    this.setState({
      loading: true
    });

      if (this.clickedCancel) {
        this.clickedCancel = false;
        return;
      }
      const target = this.getRowByKey(key) || {};
      if (!target.mobile ) {
        message.error("手机号不为空");
        e.target.focus();
        this.setState({
          loading: false
        });
        return;
      }
      if(target.mobile){
        var numberCheck = /^1\d{10}$/;
        if(!numberCheck.test(target.mobile)){
          message.error("手机号格式错误");
          e.target.focus();
          this.setState({
            loading: false
          });
          return;
        }

      }
      request('/annoroad-cloud-mis-server/whitelist/item/update',{body:{
          code:target.code == undefined ? null : target.code,
          mobile:target.mobile,
          name: target.name,
          units: target.units,
        }}).then((data)=> {
        if(data) {
          if(data.code ==='000000'){
            const value = {
              themeCode:this.props.themeCode
            };

            this.props.dispatch({
              type: "video/whitelistList",
              payload: value
            })
            this.setState({
              visible:false,
              loading:false
            })
          }else{
            this.setState({
              loading:false
            });
            message.error(codeMark[data.code]);
          }
        }else{
          message.error("系统异常");
      }
      })

  }

  // 设置分页条数
  onShowSizeChange = (current, pageSize) => {
    this.setState({
      _pageSize:pageSize,
      _pageNum: 1
    })
    const params = {
      themeCode:this.props.themeCode,
      name:this.state.name,
      mobile:this.state.mobile,
      pageSize:pageSize
    };
   this.props.dispatch({
      type: "video/whitelistList",
      payload: params
    })
  }

  //翻页
  pagination = pageNum => {
    this.setState({
      _pageNum: pageNum
    })
    const params = {
      themeCode:this.props.themeCode,
      name:this.state.name,
      mobile:this.state.mobile,
      pageNo: pageNum,
      pageSize: this.state._pageSize
    };
    this.props.dispatch({
      type: "video/whitelistList",
      payload: params
    })
  };

  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width:"25%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "name", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
                /* maxLength={20}*/
              />
            );
          }
          return record.name;
        }
      },
      {
        title: "手机号",
        dataIndex: "mobile",
        key: "mobile",
        width:"30%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "mobile", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
                /* maxLength={20}*/
              />
            );
          }
          return record.mobile;
        }
      },
      {
        title: "单位",
        dataIndex: "units",
        key: "units",
        width:"35%",
        render: (text, record) => {
          if (record.editable) {
            return (
              <Input
                value={text}
                autoFocus
                onChange={e => this.handleFieldChange(e, "units", record.key)}
                onKeyPress={e => this.handleKeyPress(e, record.key)}
                placeholder="请输入"
                /* maxLength={20}*/
              />
            );
          }
          // return record.units;
          return <Tooltip title={record.units}>
            <span>{record.units}</span>
          </Tooltip>;//
        }
      },
      {
        title: "操作",
        key: "action",
        render: (text, record) => {
          const { loading } = this.state;
          if (!!record.editable && loading) {
            return null;
          }
          if (record.editable) {
            if (record.isNew) {
              return (
                <span>
                  <a onClick={e => this.saveRow(e, record.key)}>添加</a>
                  <Divider type="vertical" />
                   <Popconfirm title="是否要删除此行？" onConfirm={() => this.remove(record.key)}>
                   <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
                  </Popconfirm>
                </span>
              );
            }
            return (
              <span>
                <a onClick={e => this.saveRow(e, record.key)}>保存</a>
                <Divider type="vertical" />
                {/*<a onClick={e => this.cancel(e, record.key)}>取消</a>*/}
                <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
              </span>
            );
          }
          return (
            <span>
              <a onClick={e => this.toggleEditable(e, record.key)}>编辑</a>
              <Divider type="vertical" />
               <a onClick={this._deleteConfirm.bind(this, record)}>删除</a>
            </span>
          );
        }
      }
    ];
    const { loading, data } = this.state;
    return (
      <Fragment style={{padding:"0px"}}>
        <Table
          className={styles.textLeft}
          loading={loading}
          columns={columns}
          dataSource={data}
          pagination={false}
          rowClassName={record => record.editable ? styles.editable : ""}
        />
        <Row type="flex" justify="end" className={styles.paginationBox}>
          <Pagination
            showQuickJumper
            showSizeChanger
            pageSize={this.state._pageSize}
            onChange={this.pagination}
            current={this.state._pageNum}
            total={this.props.total}
            onShowSizeChange={this.onShowSizeChange}
            showTotal={total => `共 ${total} 条`}
            /*defaultCurrent={pageNo}
            total={total}*/
          />
        </Row>
        <ConfirmModal
          visible={this.state.visible}
          onOk={this.handleOk}
          confirmLoading={this.state.confirmLoading}
          onCancel={this.handleCancel}
          destroyOnClose={true}
        >
          <span style={{ fontWeight: "800" }}>删除确认</span><br/>
          <span style={{ color: "#999",margin:"12px 0 0 30px",display:"block", }}>确定要删除吗？</span>

        </ConfirmModal>
      </Fragment>
    );
  }
}
