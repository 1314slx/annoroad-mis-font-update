import React, { createElement, Component } from "react";
import styles from "./styles.less";

export default class FilerPageHeader extends Component {

  constructor(props) {
    super(props);
  }

  getList = params => {
    let _path = this.props.isMyData==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath
    if(_path == "" && this.props.status == false){
      return;
    }
    this.props.getListData(params == undefined ? "" : params);
  };
  splitPath = () => {
    let path = this.props.isMyData==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath;
    if(path == undefined || path == ""){
      return ;
    }
    // let path = this.props.dataManager.currentPath;
    if(path.indexOf("/") == -1 && path.length > 0) {
      return(
        <li>
          {createElement('span', {className: styles.separator}, '>')}
          {createElement('span', null, path)}
        </li>
      );

    }else if(path.indexOf("/") != -1 && path.length > 0){
      let sp = path.split("/");
      const datas = sp.map((sdata, index) => {

        //判断截取后的路径的长度是否是大于等于4
        if(sp.length > 4){
          let num = sp.length - 4;
          //判断当前的index是否需要用省略号来代替
          if(index < num){
            return;
          }
        }

        //表示是最后一层目录
        if(index == sp.length-1){
          return (
            <li>
              {createElement('span', {className: styles.separator}, '>')}
              {createElement('span', null, sdata.length>10?sdata.substring(0,10)+"...":sdata)}
            </li>
          );

        }else{
          return (
            <li>
              {createElement('span', {className: styles.separator}, '>')}
              {createElement('a', { onClick: () => {this.filePath(index)} }, sdata.length>10?sdata.substring(0,10)+"...":sdata)}
            </li>
          );
        }

      });//map 循环结束
      return datas;

    }else{
      return;
    }

  };

  filePath = (params) => {
    this.props.changeStateStatus(false);
    let path = this.props.isMyData==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath;
    path = path.split("/");
    let filePath = "";
    for(let i=0; i<=params; i++){
      filePath = filePath + "/" + path[i];
    }
    this.getList(filePath.substring(1,filePath.length));

  };

  render() {
    const bread = this.splitPath();
    // const styleDisplay = this.props.dataManager.currentPath == "" ? { display: 'none' }:{ display: '' };
    const styleDisplay = this.props.isMyData ==1?(this.props.dataManager.myCurrentPath == "" ? { display: 'none' }:{ display: '' }):(this.props.dataManager.currentPath == "" ? { display: 'none' }:{ display: '' });
    let _currentPath = this.props.isMyData && this.props.isMyData ==1?this.props.dataManager.myCurrentPath:this.props.dataManager.currentPath;
    return (
      <ul className={styles.MBUL} id="NavBar">
        <li style={ styleDisplay }>
          <a className={styles.fhsyj} date-deep = "-1" onClick={() => this.getList(_currentPath.substring(0,_currentPath.lastIndexOf("/")))}>返回上一级</a>
          <span className={styles.span}>|</span></li>
        <li>
          {_currentPath=="" && this.props.status == false?<span>全部文件</span>:_currentPath.split("/").length>3?<span>...</span>:<a onClick={() => this.getList()} date-deep = "0">全部文件</a>}
        </li>
        {bread}
      </ul>
    );
  }
}
