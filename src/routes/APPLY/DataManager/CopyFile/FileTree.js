import React, { Component } from "react";
import {
  Modal, Button, Form, message, Tree, notification
} from "antd";
import request from '../../../../utils/request';
import { progress } from "../../../../utils/resource-task";
const DirectoryTree = Tree.DirectoryTree;
const { TreeNode } = Tree;
let _treeNode;
@Form.create()
export default  class FileTree extends Component {
  constructor(props) {
    super(props);
    this.state = {
      confirmLoading: false,
      visible: false,
      treeData: [
        { title: '全部文件', key: '0' },
      ],
      _selectedKeys:'',  // 目标路径
      _list:[],
      mark:0, //0 代表复制 1代表移动
    };

  }

  // 移动到
  moveFile=()=>{
    this.setState({
      mark:1
    });
    this.copyFile();
  }

  // 复制到
  copyFile=()=>{
    // const _currentPath = this.props.dataManager.currentPath;
    const _currentPath = this.props.isMyData==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath;
    const checkedData = this.props.dataManager.checkedData;
    let list = [];
    if(checkedData.length == 0){
      message.warning("请先选择要复制到的文件或文件夹");
      return;
    }else{
      checkedData.map(value=>{
        if(value.isDirectory==2){
          list.push({
            srcName:value.file_name,
            size:value.originSize,
            //size:123456789,
          });
        }
      })
    }
    this.setState({
      visible: true,
      _list:list
    });
  }
// 异步数据展示
  onLoadData = treeNode => new Promise((resolve) => {
    const _params =treeNode.props.eventKey;
    let ipos;
    let params2;
    if(_params.indexOf("/") != -1){
      ipos = _params.indexOf("/");
      params2=_params.substring(ipos+1,_params.length);//取后部分;
    }else if(_params=='0') {
      params2='';
    }else{
      params2=treeNode.props.eventKey;
    }
    _treeNode = treeNode.props;
    let requestUrl = this.props.isMyData==1?"annoroad-cloud-mis-server/data/mine/find":"annoroad-cloud-mis-server/data/find"
    // request("/annoroad-cloud-mis-server/data/find",
    request(requestUrl,
      {body:{
          prefix: params2,
        }})
      .then((data) => {
        if(data){
          if (data.code != '000000') {
            notification.error({
              message: "数据异常",
              description: "数据获取异常"
            })
          } else {
            if (treeNode.props.children) {
              resolve();
            }
            let arr = [];
            data.data.folders.map(value=>{
              arr.push({
                title:value.fileName,
                key:treeNode.props.eventKey?treeNode.props.eventKey+'/'+value.fileName:value.fileName,
              });
            });
            treeNode.props.dataRef.children = arr;
            this.setState({
              treeData: [...this.state.treeData],
            });
            resolve();
          }
        }
        });
  })

  renderTreeNodes = data => data.map((item) => {
    if (item.children) {
      return (
        <TreeNode title={item.title} key={item.key} dataRef={item}>
          {this.renderTreeNodes(item.children)}
        </TreeNode>
      );
    }
    return <TreeNode {...item} dataRef={item} selectable={item.key != "0"}/>;
  })

  handleCancel=()=>{
    this.setState({
      visible:false,
      mark:0

    })
  }
  // 复制/移动
  handleOk = () =>{
    const  _this = this;
    // const _currentPath = this.props.dataManager.currentPath;
    const _currentPath = this.props.isMyData==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath;
    if(!this.state._selectedKeys || !this.state._selectedKeys[0] || this.state._selectedKeys[0] == 0){
      message.error("请选择文件夹");
      return;
    }
    const ipos = this.state._selectedKeys[0].indexOf("/");
    const _params2=this.state._selectedKeys[0].substring(ipos+1,this.state._selectedKeys[0].length);//取后部分;
    if(_currentPath == _params2){
      message.error("目标文件夹为当前文件夹");
      return;
    }
    this.setState({
      _selectedKeys: undefined
    })
    if(this.state.mark==0){
      request("/annoroad-cloud-mis-server/data/file/copy",
        {body:{
            files: this.state._list,
            destPath: _params2,
            srcPath:_currentPath,
            source:1  // 1. 任务来源，1：数据管理/我的数据，2：文件选择，3：视频管理 ，4：ossbrowser
          }})
        .then((data) => {
          if(data){
            if (data.code == '000000') {
              message.info('正在复制文件，请稍后…', 0);
              let time = 0;
              let timer = setInterval(function(){
                if(time > 20){
                  message.warning("复制文件过慢，请稍后查看复制结果");
                  setTimeout(function(){
                    message.destroy();
                    _this.props.refresh(_this.props.that);
                  }, 3000);
                  clearInterval(timer);
                  return;
                }
                time++;
                progress(data.data.taskCode, (data)=>{
                  if(data){
                    if(data.execution == 0){
                      if(data.succeeded == data.total){
                        message.success("文件复制成功");
                      }else{
                        message.error("文件复制失败");
                      }
                      setTimeout(function(){
                        message.destroy();
                        _this.props.refresh(_this.props.that);
                      }, 1000)
                      clearInterval(timer);
                    }
                    return;
                  }
                  clearInterval(timer);
                })

              }, 1000);
              this.setState({
                visible:false,
              })
            }else if(data.code != '000000'){
              if(data.code == '161404'){
                message.error(" 存储路径过长")
              }else{
                message.error(data.msg);
              }
              this.props.reFreshData(2)
              this.handleCancel();
            }
          }else{
            message.error('系统错误');
          }
        });
    }else{
      request("/annoroad-cloud-mis-server/data/file/move",
        {body:{
            files: this.state._list,
            destPath: _params2,
            srcPath:_currentPath,
            source:1  // 1. 任务来源，1：数据管理/我的数据，2：文件选择，3：视频管理 ，4：ossbrowser
          }})
        .then((data) => {
          if(data){
            if (data.code == '000000') {
              message.info('正在移动文件，请稍后…', 0);
              this.setState({
                visible:false,
                mark:0
              })
              let time = 0;
              let timer = setInterval(function(){
                if(time > 20){
                  message.warning("移动文件过慢，请稍后查看移动结果");
                  setTimeout(function(){
                    message.destroy();
                    _this.props.refresh(_this.props.that);
                  }, 3000);
                  clearInterval(timer);
                  return;
                }
                time++;
                progress(data.data.taskCode, (data)=>{
                  if(data){
                    if(data.execution == 0){
                      if(data.succeeded == data.total){
                        message.success("文件移动成功");
                      }else{
                        message.error("文件移动失败");
                      }
                      setTimeout(function(){
                        message.destroy();
                        _this.props.refresh(_this.props.that);
                      }, 1000)
                      clearInterval(timer);
                    }
                    return;
                  }
                  clearInterval(timer);
                })
              }, 1000);
            }else if(data.code != '000000'){
              if(data.code == '161404'){
                message.error(" 存储路径过长")
              }else{
                message.error(data.msg);
              }
              this.props.reFreshData(2)
              this.handleCancel();
            }
          }else{
            message.error('系统错误');
          }
        });
    }



  }
//点击树节点触发
  onSelect = (selectedKeys, info) => {
    this.setState({
      _selectedKeys:selectedKeys
    })
  }

  render() {
    return (
      <div  >
        <Button style={{ marginLeft: "12px" }} onClick={this.copyFile}  disabled={this.props.buttonCopySelected()==false?'disabled':''}>
          复制到
        </Button>
        <Button style={{ marginLeft: "12px" }} onClick={this.moveFile}  disabled={this.props.buttonCopySelected()==false?'disabled':''}>
          移动到
        </Button>

        <Modal
          visible={this.state.visible}
          title={this.state.mark==0?"复制到":"移动到"}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={'400px'}
          top={'35%'}
          destroyOnClose={'true'}
          footer={[
            <Button key="back" onClick={this.handleCancel}>取消</Button>,
            <Button key="back" type="primary" onClick={this.handleOk}>
              确定
            </Button>
          ]}
        >
          <div style={{overflow:"auto",minHeight:'30vh',maxHeight:'60vh',}}>
            <DirectoryTree loadData={this.onLoadData} onSelect={this.onSelect}>
              {this.renderTreeNodes(this.state.treeData)}
            </DirectoryTree>
          </div>
        </Modal>

      </div>
    );
  }
}
