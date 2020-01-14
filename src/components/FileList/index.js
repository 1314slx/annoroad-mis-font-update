import React, {Component} from "react"

import {Table, message, Modal, Spin} from "antd"
import styles from "./index.less"
import FilerPageHeader from '../../components/FilerPageHeader'
import NullFile from "./NullFile"
import request from "../../utils/request"
import {getOssClient} from "../../utils/oss"
import parse from 'url-parse';
import { codeMark } from "../../utils/options";

export default class FileList extends Component {
  constructor(props) {
    super(props)

    this.state = {
      selectedData: [],
      preLoading: false,
    }
    this.bread = React.createRef()
  }

  componentDidMount() {
    this.getListData()
  }

  /**
   * 示例预览
   */
  setModalVisible = (record) => {
    this.setState({preLoading: true})
    let _defaultValue = record.file_name
    this.suffixPath = _defaultValue.substring(_defaultValue.lastIndexOf("."), _defaultValue.length).toLocaleLowerCase()
    this.fileName = _defaultValue.substring(_defaultValue.lastIndexOf("/") + 1, _defaultValue.length)
    if(this.suffixPath==".jpg"||this.suffixPath=='.png'){
      let clientHieght = document.body.clientHeight;
      const _maxheight = clientHieght-55-48+"px";
      const _lineheight = clientHieght-55-30-100+"px";
      const _style = {
        overflow: "auto",height:_maxheight,lineHeight:_lineheight
      }
      this.setState({modalStyle:_style  })
    }
    //判断后缀是否为图片或文本
    if (['.jpg', '.png', '.txt', '.pdf'].includes(this.suffixPath)) {
      if (record.originSize > 5242880) {
        this.setState({
          preLoading:false
        })
        Modal.info({
          title: '5M以上的文件不支持在线预览',
          content: (
            <div>
              <p>请下载到本地后打开。</p>
            </div>
          ),
          cancelText: '取消',
          okText: '下载文件',
          okCancel: true,
          onOk: () => {
            this.setState({ preLoading:false })
            this.props.download(record)
            return
          },
          onCancel: () => {
            this.setState({ preLoading:false })
          }
        })
        return
      }
      let clientHieght = document.body.clientHeight;
      const _maxheight = clientHieght-85-41+"px";
      const _lineheight = this.suffixPath==".txt"?"1.5":(clientHieght-55-30-100+"px");
      let _style = '';
      if(this.suffixPath ==".pdf"){
        _style = {
          overflow: "hidden",maxHeight:_maxheight
        }
      }else{
        _style = {
          overflow: "auto",height:_maxheight,lineHeight:_lineheight
        }
      }
      this.setState({modalStyle:_style  });
      if(this.suffixPath!==".pdf"){
        let client = getOssClient();
        let _defaultValue = record.path+"/"+record.file_name;
        let path = "user/MIS/" + _defaultValue;
        this.url = client.signatureUrl(path, { expires: 3600 });
        if (this.suffixPath == ".txt") {
          request(this.url, { method: "GET" }).then((data) => {
            if (data) {
              data = data.replace(/\r\n/g, "<br />");
              this.setState({ conclusionText: data || "", preLoading: false });
            } else {
              this.setState({ conclusionText: "",preLoading: false });
            }
          });
          this.setState({
            visible: true
          });
        }else{
          this.setState({ preLoading: false,visible:true });
        }
      }

      this.props.download(record, true).then((url) => {
        if (this.suffixPath === '.txt') {
         /* request(url, {method: 'GET'}).then((data) => {
            this.setState({conclusionText: data || '', preLoading: false, visible: true})
          })*/
        } else {
          this.setState({ preLoading:false })
          const client = getOssClient()
          const path = parse(url).pathname
          const conclusionImage = client.signatureUrl(decodeURI(path), {expires: 3600})
          this.setState({conclusionImage, preLoading: false, visible: true})
        }
      })
    }
  }
  preview=(e, record)=>{
    this.setState({
      isPreview:1
    })
    const _this = this;
    const _name = record.file_name;
    this.suffixPath = _name.substring(_name.lastIndexOf("."), _name.length).toLocaleLowerCase();
    //判断后缀是否为图片或文本
    if (['.jpg', '.png', '.txt', '.pdf'].includes(this.suffixPath)) {
      let value = [];
      value.push({srcPath:record.path+"/"+record.file_name})
      const params={filePaths:value}
      this.props.dispatch({
        type: "dataManager/objectCheck",
        payload: params
      }).then(()=>{
        const { objectCheckData } = this.props.dataManager;
        const code = objectCheckData && objectCheckData.code ? objectCheckData.code : "";
        if (code == "000000") {
          this.setModalVisible(record);
          return;
        }else{
          message.error(codeMark[code]);
          _this.props.reFreshData(2);
          return;
        }
      })
      return;
    }
  }
  /**
   * 点击文件夹进入下层目录
   */
  clickRow = (e, record,_type) => {
    if(!record){
      return;
    }
    if(record.isDirectory == 2 && this.props.status==true&&_type!==1){
      return;
    }
   /* if(this.props._isSearch == 1){
      return;
    }*/
    const _this = this;
    if (e && e.stopPropagation)
      e.stopPropagation()
    else {
      window.event.cancelBubble = true
    }
    if (record.isDirectory == 2 && this.props.status == false&&_type!==1) {
      // this.setModalVisible(record)
      // return
      return;
    }
    if (record.path != "" && this.props.status == true) {
      this.getListData(record.path)
      return
    }
    this.getListData(this.props.currentPath == ""
      ? record.file_name
      : this.props.currentPath + "/" + record.file_name)
  }

  /**
   * 更新state中的currentPath(当前路径)
   */
  changeState = (params) => {
    if(this.props.isMyData && this.props.isMyData == 1){
      this.props.dispatch({
        type: "dataManager/changeMyDataCurrentPath",
        payload: params
      })
    }else{
      this.props.dispatch({
        type: "dataManager/changeCurrentPath",
        payload: params
      })
    }
  }
  /**
   * 获取列表信息
   */
  getListData = (params, searchName, isSearch, isExec) => {
    if (!this.props.projectManageJump || isExec) {
      const {checkedData, currentPath} = this.props.dataManager
      const _this = this
      if (checkedData.length != 0) {
        this.changeCheckedData()
      }
      this.props.dispatch({
        type: "dataManager/queryGroup",
        payload: {
          prefix:
            params == undefined
              ? this.props.currentPath
              : params,
          searchName: searchName == undefined ? null : searchName,
          isMyData:this.props.isMyData?this.props.isMyData:""
        }
      }).then(() => {
        if (_this.props.dataManager.status) {
          message.error("系统出现问题了，请稍后重试")
          return
        } else {
          this.changeStateStatus(isSearch)
          // this.changeState(params == undefined ? currentPath : this.props.status ? "" : params)
          this.changeState(params == undefined ? this.props.currentPath :  params)
        }
      })
    }
  }

  changeStateStatus = (flag) => {
    this.props.chengeState(flag == undefined ? false : flag)
  }

  /**
   * 多选框选中的对应那一行信息
   */
  rowSelection = {
    //复选框选定
    onChange: (selectedRowKeys, selectedRows) => {
      /*console.log(
        "selectedRowKeys:", selectedRowKeys,  "selectedRows: ", selectedRows);*/
      this.changeCheckedData(selectedRows)
    }
  }
  setRowClassName = (record) => (record && record.isDirectory == 1 ? styles.hand : '')

  //给state中的checkedData重新赋值
  changeCheckedData = (selectedRows) => {
    this.props.dispatch({
      type: "dataManager/changeCheckedData",
      payload: selectedRows == undefined ? [] : selectedRows
    })
  }

  render() {
    const {
      loading,
      columns,
      scroll,
      dataManager,
    } = this.props;
    const {preLoading} = this.state;
    const {groupData} = dataManager;
    const {dataSource} = groupData;
    return (
      <div style={{marginTop: "63px"}}>
        <FilerPageHeader ref={this.bread}
                         {...this.props}
                         getListData={this.getListData}
                         changeState={this.changeState}
                         isMyData={this.props.isMyData&&this.props.isMyData==1 ? 1:""}
                         changeStateStatus={this.changeStateStatus.bind(this)}/>

        {dataSource == undefined ? dataSource : dataSource.length > 0 ?
          <Spin spinning={loading || preLoading} tip={preLoading == true ? "数据加载中，请耐心等待" : ""}>
            <Table columns={columns}
                 bordered={false}
                 dataSource={dataSource}
                 size="middle"
                 className={styles.businessTable}
            // scroll={{x: scroll ? scroll : 800}}
                 pagination={false}
                 onRow={(record) => //表格行点击事件
                   ({
                     onClick: (e) => this.clickRow(e, record)
                   })
                 }
                 rowClassName={(record, index) => this.setRowClassName(record)}
                 // rowSelection={this.props.dataManager.currentPath == '' ? null : this.rowSelection}
                 rowSelection={this.props.currentPath == '' || this.props._isSearch == 1 ? null : this.rowSelection  }
                 rowKey={record => record.guid}
            /></Spin> : <NullFile {...this.props}/>}
        <Modal
          title={this.fileName}
          visible={this.state.visible}
          onOk={() => this.setState({visible: false})}
          onCancel={() => this.setState({visible: false, conclusionImage: '', conclusionText: ''})}
          footer={null}
          style={{top: 0}}
          className={styles.resultModal}
          width={"100%"}
          maskClosable={false}
        >
          <div style={this.state.modalStyle} className={this.suffixPath === ".txt"?styles.modalStyleItem:styles.modalStyleImg}>
            {(this.suffixPath == '.jpg'||this.suffixPath == '.png') && <img src={this.state.conclusionImage} />}
            {(this.suffixPath == '.txt') && <span dangerouslySetInnerHTML={{ __html: this.state.conclusionText }}></span>}
            {this.suffixPath === ".pdf" && <iframe
              type='application/pdf'
              src={this.state.conclusionImage}
              width="100%"
              height='98%'
              style={{minHeight:"90vh"}}
            />}
            {[".pdf"].includes(this.suffixPath) || ""}
          </div>

        </Modal>
      </div>
    )
  }
}
