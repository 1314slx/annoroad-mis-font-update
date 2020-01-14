import React, { Component } from "react";
import img from '../../assets/file0.png';

/**
 * 空文件展示
 */
export default class File0 extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{textAlign: "center", marginTop: "50px"}}>
        <img style={{width: "90px", height: "110px"}} src={img}/>
        <div style={{marginTop: "20px"}}>
          <span style={{fontSize: "10"}}>当前目录没有文件哦~</span>
        </div>
      </div>
    );
  }
}
