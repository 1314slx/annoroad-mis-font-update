import React, { Component } from "react";
import img from '../../assets/file0.png';
import { Button, Upload } from "antd";

/**
 * 空文件展示
 */
export default class NullFile extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div style={{textAlign: "center", marginTop: "50px"}}>
        <img style={{width: "134px", height: "160px"}} src={img}/>
        <div style={{marginTop: "20px"}}>
          {this.props.currentPath == "" ? <span style={{fontSize: "10"}}>没有找到相应内容</span>:<span style={{fontSize: "10"}}>您还没上传过文件哦，快来上传吧～</span>}
        </div>
        {this.props.currentPath != "" ? <div style={{marginTop: "20px"}}>
          <Upload
            beforeUpload={(file, fileList) => this.props.upload(file, fileList)}
            showUploadList={false}
            multiple={true}
          >
            <Button type="primary">上传</Button>
          </Upload>
        </div> : ""}
      </div>
    );
  }
}
