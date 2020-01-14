import React, { Component } from "react";
import { connect } from "dva";
import PageHeaderLayout from "../../../layouts/PageHeaderLayout";
import {
  dataManagerColumns,
  dataManagerColumnsSearch,
  dataManagerColumnsCopy,
  dataManagerColumnsCopySearch
} from "../../APPLY/DataManager/columns";
import "antd/dist/antd.css";
import styles from "../../APPLY/DataManager/styles.less";
import { Button, Input, Upload, notification, Modal, message, Tooltip, Form, Icon, Progress } from "antd";
import UploadList from "../../../components/upload-list/upload-list";
import { getOssClient } from "../../../utils/oss";
import request from "../../../utils/request";
import { createUploadTask, notify, heartbeat, progress } from "../../../utils/resource-task";
import { bytesToSize, byteCount } from "../../../utils/utils.js";
import { Base64 } from "js-base64";
import FileList from "../../../components/FileList/index";

const Search = Input.Search;
import ColFormItem from "components/ColFormItem/index";
import FileTree from "../../APPLY/DataManager/CopyFile/FileTree";
import { CHECK_RENAME } from "../../../utils/pattern";
import InputValid from "../../../components/InputValid";

let fileRef = null;
import { codeMark } from "./../../../utils/options";
import $ from "jquery";

/**
 * 数据管理
 * */
@connect(({ dataManager, oss, loading }) => ({
  dataManager,
  oss
}))
@Form.create()
export default class MyData extends Component {
  constructor(props) {
    super(props);
    // this.columns = [...dataManagerColumns];
    this.checkedData = null;
    // this.currentPath = null;
    this.myCurrentPath = null;
    this.file = React.createRef();
    fileRef = this.file;
    this.state = {
      status: false,//判断是否是显示所在目录
      modalVisible: false,//model是否可见
      inputValue: "",
      modalVisible1: false,//重命名-model是否可见
      modalVisible2: false,//重命名-提示是否保留两文件
      visible1: 1,//重命名-提示是否保留两文件
      _srcName: "",//重命名-原文件名称
      renameParams: "",//重命名-保存参数
      _reName: "",
      showHelp: false,
      searchPath: "",
      searchBack: 0
    };

    this.columns = dataManagerColumns(this.file);
    this.projectManageJump = false;
    this.columnsSearch = dataManagerColumnsSearch(this.file);//测试数据搜索时的表头
    this.copyColumns = dataManagerColumnsCopy(this);//示例数据的表头
    this.columnsCopySearch = dataManagerColumnsCopySearch(this, this.file);//示例数据搜索时的表头
    this.handleChange = this.handleChange.bind(this);
    // 心跳维持在一分钟一跳
    setInterval(() => this.heartBeat(), 1 * 60 * 1000);
    this.props.dispatch({
      type: "dataManager/findAlreadyUploadFiles",
      payload: {
        type: [1],
        source: [1],
        pageNo: 1,
        pageSize: 9999
      }
    });

    let query = this.props.location.query;
    if (query) {
      this.projectManageJump = true;
    }
  }

  componentDidMount() {
    this.spacesizeGet();
    // 我的任务跳转到我的数据
    let query = this.props.location.query;
    if (query) {
      const _url = query.params_url;
      this.projectManageJump = false;
      if (fileRef.current) {
        fileRef.current.getListData(_url, null, null, true);
        this.spacesizeGet();
      }
    }
    const that = this;
    $(window).scroll(
      function() {
        var scrollTop = $(this).scrollTop();
        that.scrollStyle(scrollTop);
      }
    );
  }

  componentWillUnmount(){
    message.destroy();
  }
  scrollStyle = (scrollTop) => {
    const myDataPageItem = document.getElementById("myDataPage");
    const fixedTopItem = document.getElementById("fixedTop");
    const topBtnMenu = document.getElementById("top_btnMenu");
    const searchNavItem = document.getElementById("searchNav");
    const NavBarItem = document.getElementById("NavBar");
    if (NavBarItem && topBtnMenu && searchNavItem && myDataPageItem && fixedTopItem) {
      let distanceTop = myDataPageItem.offsetTop;
      // if (scrollTop > 215) {
      if (Math.ceil(distanceTop-scrollTop) < 0) {
        fixedTopItem.style.width = myDataPageItem.offsetWidth - 64 + "px";
        topBtnMenu.style.position = "fixed";
        topBtnMenu.style.zIndex = "10";
        topBtnMenu.style.backgroundColor = "#ffffff";
        topBtnMenu.style.top = "12px";
        searchNavItem.style.right = "0px";
        fixedTopItem.style.height = "120px";
        fixedTopItem.style.overflow = "hidden";
        fixedTopItem.style.backgroundColor = "#ffffff";
        fixedTopItem.style.zIndex = "7";
        fixedTopItem.style.top = "0";
        fixedTopItem.style.position = "fixed";
        NavBarItem.style.position = "fixed";
        NavBarItem.style.backgroundColor = "#ffffff";
        NavBarItem.style.top = "110px";
        NavBarItem.style.zIndex = "8";
      } else {
        topBtnMenu.style.position = "inherit";
        topBtnMenu.style.top = "0";
        fixedTopItem.style.removeProperty("position");
        fixedTopItem.style.removeProperty("height");
        NavBarItem.style.removeProperty("top");
        NavBarItem.style.position = "absolute";
        searchNavItem.style.position = "absolute";
        searchNavItem.style.top = "12px";
        searchNavItem.style.right = "32px";
      }
    }
  };

  /**
   * 心跳连接
   */
  heartBeat = () => {
    if (this.props.dataManager.uploadingNames.size > 0) {
      heartbeat();
    }
  };

  /**
   *  上传文件
   */
  upload = async (file, fileList) => {
    if (file.name.indexOf(" ") >= 0 || file.name.indexOf("　") >= 0) {
      message.error("文件上传失败，请删除空格后重新上传");
      return true;
    }
    if (!CHECK_RENAME.test(file.name)) {
      message.error("文件上传失败，不能包含：引号、括号、空格、回车符以及`*\\$+&%#!~");
      return true;
    }
    // let path = this.props.dataManager.currentPath;
    let path = this.props.dataManager.myCurrentPath;
    createUploadTask(file.name, path, file.size, 1).then((data) => {
      if (data) {
        try {
          let name = "user/MIS/" + path + "/" + data.destName;
          let client = getOssClient();
          if (client) {
            client.multipartUpload(name, file, {
              // parallel: 2,
              headers: {
                "x-oss-callback-var": Base64.encode("{\"x:subtaskCode\": \"" + data.subtaskCode + "\"}")
              },
              progress: (percent, cpt) => {
                this.props.dataManager.allUploadNames.add(data.code);
                if (cpt) {
                  cpt.subtaskCode = data.subtaskCode;
                  cpt.taskCode = data.code;
                  cpt.percent = parseInt(percent * 100);
                  cpt.client = client;
                  cpt.name = name;
                  if (cpt.percent === 100) {
                    cpt.pause = true;
                    cpt.continue = true;
                    cpt.clear = false;
                    this.refreshList(file, data.code, this);
                    this.props.dataManager.uploadingNames.delete(data.code);
                  } else {
                    cpt.pause = false;
                    cpt.continue = true;
                    cpt.clear = true;
                    this.props.dataManager.uploadingNames.add(data.code);
                  }
                  this.props.dataManager.checkpoints.set(data.code, cpt);
                } else {
                  let checkpoint = {
                    fileSize: file.size,
                    percent: 100,
                    name: name,
                    subtaskCode: data.subtaskCode,
                    taskCode: data.code,
                    pause: true,
                    continue: true,
                    clear: false
                  };
                  this.props.dataManager.checkpoints.set(data.code, checkpoint);
                  this.refreshList(file, data.code, this);
                }
                this.props.dispatch({
                  type: "dataManager/nullFunction"
                });
              }
            });
            this.props.dispatch({
              type: "dataManager/setVisible",
              visible: true
            });
          }
        } catch (e) {
          notify(data.subtaskCode, 2, e.message);
          message.error("网络异常，请重新上传");
        }

      }
    });
    return false;
  };

  /**
   * 刷新页面并重新获取空间大小
   */
  refreshList = (file, taskCode, that) => {
    // 刷新页面和空间大小
    let time = 0;
    let timer = setInterval(function() {
      if (time > 20) {
        fileRef.current.getListData();
        that.spacesizeGet();
        clearInterval(timer);
        return;
      }
      time++;
      if (fileRef.current) {
        progress(taskCode, (data) => {
          if (data) {
            if (data.execution == 0) {
              fileRef.current.getListData();
              that.spacesizeGet();
              clearInterval(timer);
            }
            return;
          }
          clearInterval(timer);
        });
      } else {
        clearInterval(timer);
      }
    }, 1000);
  };
  /**
   * 文件(夹)校验参数
   * @returns {Array}
   */
  getSrcPath = () => {
    let params = [];
    const checkData = this.props.dataManager.checkedData;
    // const currentPath = this.props.dataManager.currentPath;
    const currentPath = this.props.dataManager.myCurrentPath;
    checkData.map((value, index) => {
      if (value.isDirectory == 2) {
        params.push({
          srcPath: currentPath + "/" + value.file_name
        });
      } else {
        params.push({
          srcPath: currentPath + "/" + value.file_name + "/"
        });
      }
    });
    return params;
  };

  download = (record, upright) => {
    // 获取选中文件的总大小
    let sizes = record && [record.originSize] || this.props.dataManager.checkedData.map(data => data.originSize);
    let total = 0;
    for (let i = 0; i < sizes.length; i++) {
      total += sizes[i];
    }
    // 大于500M提示用迅雷下载
    if (total > 524288000) {
      Modal.info({
        title: "文件过大，请使用安诺云盘下载",
        cancelText: "取消",
        okText: "继续下载",
        okCancel: true,
        onOk: () => {
          this.doDownload(record, upright);
          return;
        }
      });
      return;
    }
    return new Promise(resolve => {
      this.doDownload(record, upright).then(data => resolve(data));
    });
  };
  /**
   * 下载文件
   */
  toDownload = (record, upright) => {
    const value = this.getSrcPath();
    const params = { filePaths: value };
    this.props.dispatch({
      type: "dataManager/objectCheck",
      payload: params
    }).then(() => {
      const { objectCheckData } = this.props.dataManager;
      const code = objectCheckData && objectCheckData.code ? objectCheckData.code : "";
      if (code == "000000") {
        this.download(record, upright);
      } else {
        message.error(codeMark[code]);
        this.reFreshData(2);
      }
    });

  };
  /**
   * 几秒时候刷新列表
   * @param count  count代表秒数
   */
  reFreshData = (count) => {
    const _this = this;
    let num = 1;
    let timer = setInterval(function() {
      if (num > count) {
        _this.refresh(_this);
        clearInterval(timer);
      }
      num++;
    }, 1000);
  };

  /**
   * 实际下载
   * upright 标记直接下载
   */
  doDownload = (record, upright) =>
    // 获取所有要下载的文件
    new Promise((resolve) => {
      const detial = (data) => {
        let name = data.file_name;
        //this.props.dataManager.myCurrentPath + "/" + name)
        request("/annoroad-cloud-mis-server/data/signature-url",   //获取指定文件临时oss访问权限接口
          { body: { "fileUrl": record && record.path ? (record.path + "/" + record.file_name) : (this.props.dataManager.myCurrentPath + "/" + name) } })
          .then((data) => {
            if (data.code != "000000") {
              notification.error({
                message: "下载失败",
                description: name + "下载失败，获取下载连接失败。"
              });
            } else if (upright) {
              resolve(data.data.url);
            } else {
              var a = window.document.createElement("a");
              a.href = data.data.url;
              a.download = name;
              a.click();
              this.sleep(500);
            }
          });
      };

      if (record) {
        detial(record);
      } else {
        this.props.dataManager.checkedData.forEach(data => {
          if (data.isDirectory === 2) {
            detial(data);
          } else {
            notification.error({
              message: "暂不支持",
              description: data.file_name + "下载失败，暂不支持文件夹下载。"
            });
          }
        });
      }
    });


  /**
   * 休息一下
   */
  sleep = (millis) => {
    let now = new Date();
    let exitTime = now.getTime() + millis;
    while (true) {
      now = new Date();
      if (now.getTime() > exitTime)
        return;
    }
  };

  /**
   * 复制到剪贴板
   */
  copy = (params) => {
    let client = getOssClient();
    if (client) {
      // 获取所有要下载的文件
      let signatureUrl = client.signatureUrl("user/MIS/" + params, {
        expires: 60480000,
        response: { "content-disposition": "attachment" }
      });
      if (signatureUrl) {
        let textarea = window.document.createElement("textarea");
        window.document.body.appendChild(textarea);
        textarea.innerText = signatureUrl;
        textarea.select();
        let copy = window.document.execCommand("copy");
        window.document.body.removeChild(textarea);
        if (copy) {
          message.success("复制到剪贴板成功");
        }
      }
    }
  };

  //获取空间大小
  spacesizeGet = () => {
    this.props.dispatch({
      type: "dataManager/spacesizeGet",
      payload: {}
    });
  };

  onSearch = (value, err) => {
    if (err || value == undefined || value == "" || value == null) {
      return;
    }
    /* if(this.props.dataManager.currentPath.length>0){
       this.setState({ searchPath:this.props.dataManager.currentPath })
     }*/
    if (this.props.dataManager.myCurrentPath.length > 0) {
      this.setState({ searchPath: this.props.dataManager.myCurrentPath });
    }
    // let _path = this.props.dataManager.currentPath;
    let _path = this.props.dataManager.myCurrentPath;
    if (_path) {
      _path = _path.indexOf("/") > 0 ? _path.substring(0, _path.indexOf("/")) : _path;
    } else if (this.state.status) {
      _path = this.state.searchPath;
    }
    this.file.current.getListData(_path, value, true);
    // this.chengeState(true);
  };

  //修改本页面中的state
  chengeState = (s) => {
    this.setState({
      status: s
    });
  };

  //删除文件
  deleteFile = () => {
    const checkedData = this.props.dataManager.checkedData;
    if (checkedData.length == 0) {
      message.warning("请先选择要删除的文件或文件夹");
      return;
    }
    const confirm = Modal.confirm;
    // let currentPath = this.props.dataManager.currentPath;
    let currentPath = this.props.dataManager.myCurrentPath;
    let that = this;
    let path = "";
    confirm({
      title: "删除后不可恢复，确定要删除吗?",
      okText: "删除",
      cancelText: "取消",
      onOk: () => {
        for (let i = 0; i < checkedData.length; i++) {
          path = currentPath + "/" + checkedData[i].file_name;
          if (checkedData[i].isDirectory == 2) {
            that.deletePath(path);
          } else {
            that.deletePath(path + "/");
          }
        }//循环结束
      },
      onCancel() {
      }
    });

  };
  deletePath = (path) => {
    this.props.dispatch({
      type: "dataManager/deleteFile",
      payload: {
        filerUrl: path,
        source: 1  // 1. 任务来源，1：数据管理/我的数据，2：文件选择，3：视频管理 ，4：ossbrowser
      },
      callback: (data) => {
        if (data.code == "000000") {
          message.success("删除成功");
          this.spacesizeGet();
          this.file.current.changeCheckedData();
          this.file.current.getListData();
        } else if (data.code == "161410" || data.code == "161009" || data.code == "161012") {
          message.error(data.msg);
          this.reFreshData(2);
        } else {
          message.error("删除失败");
        }
      }

    });
  };


  //创建新的文件夹
  newFolder = () => {
    if (!CHECK_RENAME.test(this.state.inputValue)) {
      this.setState({
        showHelp: true
      });
      return;
    }
    if (this.state.inputValue == "") {
      this.setState({
        showHelp: true
      });
      // message.warning("文件夹名称不能为空，请输入文件夹名称");
      return;
    }
    let byteLength = byteCount((this.state.inputValue));
    if (byteLength > 150) {
    // if (this.state.inputValue.length > 100) {
      message.error("文件(夹)名称不能超过150字节");
      return;
    }
    this.props.dispatch({
      type: "dataManager/newFolders",
      payload: {
        // path: this.props.dataManager.currentPath + "/",
        path: this.props.dataManager.myCurrentPath + "/",
        folderName: this.state.inputValue
      },
      callback: (data) => {
        if (data.code == "000000") {
          message.success("创建文件夹成功");
          this.setState({
            inputValue: ""
          });
          this.file.current.getListData();
        } else if (data.code == "161005") {
          message.error("目录过多，创建失败");
        } else if (data.code == "161004" || data.code == "161006") {
          message.error("文件(夹)名称不能超过100字符");
        } else {
          message.error("文件夹创建失败");
        }
        this.setModalVisible(false);
      }
    });
  };
  /**
   * 判断输入的文件夹名称是否包含不可用字符
   */
  includeFolderName = (folderName) => {
    if (folderName.indexOf("/") != -1 || folderName.indexOf("\\") != -1 || folderName.indexOf(":") != -1
      || folderName.indexOf("*") != -1 || folderName.indexOf("?") != -1 || folderName.indexOf("\"") != -1
      || folderName.indexOf("<") != -1 || folderName.indexOf(">") != -1 || folderName.indexOf("|") != -1) {
      return true;
    }
    return false;
  };

  handleChange(value) {
    this.setState({ inputValue: value });
  }

  // 弹窗设置
  setModalVisible = (params) => {
    this.setState({
      modalVisible: params,
      modalVisible1: false,
      modalVisible2: false,
      inputValue: ""
    });
    if (!params) {
      this.setState({
        showHelp: false
      });
    }
    this.props.form.resetFields();
  };
  // 重命名
  renameFile = () => {
    const checkedData = this.props.dataManager.checkedData;
    if (checkedData.length == 0) {
      message.warning("请先选择要重命名的文件或文件夹");
      return;
    }
    this.setState({
      renameParams: checkedData[0],
      _srcName: checkedData[0].file_name,
      modalVisible1: true
    });
    this.props.form.setFieldsValue({ "file_srcName": checkedData[0].file_name });
  };

  // 重命名确定
  checkRename = () => {
    this.setState({
      modalVisible2: false,
      visible1: 0
    });
    this.saveRename();
  };
  // 重命名-保存
  handleOk = () => {
    const _submit = document.getElementById("submit");
    _submit.click();
  };

  // 文件重名校验
  file_check = (values) => {
    request("/annoroad-cloud-mis-server/data/file/check", {
      body: {
        srcPath: this.state.renameParams.path,
        destName: values.file_srcName
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          if (data.data.exists == true) {  //文件存在，重命名确认弹层
            message.error("文件名不能重复");
          } else {
            this.saveRename();
          }
        } else {
          message.error(data.msg);
        }
      } else {
        message.error("系统错误");
      }
    });
  };
  // 重命名保存
  handleSubmit = e => {
    e.preventDefault();
    this.props.form.validateFieldsAndScroll((err, values) => {
      if (err) {
        return;
      }
      //检验输入文件或原文件名长度
      let byteLength = byteCount((values.file_srcName));
      if (byteLength > 150) {
      // if (values.file_srcName.length > 100) {
        message.error("文件（夹）名称不能超过150字节");
        return;
      }
      //检验是否输入文件名和源文件名称一致
      if (values.file_srcName === this.props.dataManager.checkedData[0].file_name) {
        let checkValue = this.checkBlank(values.file_srcName);
        if (checkValue) {
          return;
        }
        this.handleCancel();
        return;
      }
      let checkValue = this.checkBlank(values.file_srcName);
      if (checkValue) {
        return;
      }
      this.file_check(values);
      this.setState({ _reName: values.file_srcName });
    });
  };
  //检查文件名是否含有空格
  checkBlank = (value1) => {
    let name1 = value1;
    if (name1.indexOf(" ") >= 0 || name1.indexOf("　") >= 0) {
      message.error("文件(夹)名称有空格");
      return true;
    } else {
      return false;
    }
  };
// 重命名保存
  saveRename = () => {
    let _this = this;
    request("/annoroad-cloud-mis-server/data/file/rename", {
      body: {
        size: this.state.renameParams.originSize,
        srcName: this.state.renameParams.file_name,
        srcPath: this.state.renameParams.path,
        destName: this.state._reName,
        source: 1  // 1. 任务来源，1：数据管理/我的数据，2：文件选择，3：视频管理 ，4：ossbrowser
      }
    }).then((data) => {
      if (data) {
        if (data.code === "000000") {
          message.info("正在重命名，请稍后...", 0);
          this.setState({
            _srcName: "",
            modalVisible1: false,
            renameParams: "",
            visible: false,
            visible1: 0
          });
          let time = 0;
          let timer = setInterval(function() {
            if (fileRef.current) {
              if (time > 20) {
                message.warning("重命名过慢，请稍后查看重命名结果");
                setTimeout(function() {
                  message.destroy();
                  _this.refresh(_this);
                }, 3000);
                clearInterval(timer);
                return;
              }
              time++;
              progress(data.data.taskCode, (data) => {
                if (data) {
                  if (data.execution == 0) {
                    if (data.succeeded == data.total) {
                      message.success("重命名成功");
                    } else {
                      if (data.failed > 0) {
                        message.error(data.failed + "个文件重命名失败");
                      } else {
                        message.success("文件重命名成功");
                      }
                      setTimeout(function() {
                        message.destroy();
                      }, 1000);
                    }
                    setTimeout(function() {
                      message.destroy();
                    }, 1000);
                    _this.refresh(_this);
                    clearInterval(timer);
                  }
                  return;
                }
                clearInterval(timer);
              });
            } else {
              clearInterval(timer);
            }
          }, 1000);
          this.props.form.resetFields();
        } else {
          if (data.code === "161404") {
            message.error(data.msg);
          } else {
            message.error(data.msg);
          }
          // message.error(codeMark[data.code]);
          // message.error(data.msg);
          this.handleCancel();
          this.reFreshData(2);
        }
      } else {
        message.error("系统错误");
      }
    });
  };

  // 取消
  handleCancel = () => {
    this.setState({
      progressVisible: false,
      modalVisible1: false,
      modalVisible2: false,
      _srcName: "",
      renameParams: ""

    });
    this.props.form.resetFields();
  };

  //下载按钮点击判断
  buttonUploadSelected = () => {
    //需要判断 当前用户是进入到哪个目录下方
    // if (this.props.dataManager.currentPath == "") {
    if (this.props.dataManager.myCurrentPath == "") {
      return false;
    } else if (this.props.dataManager.checkedData.length == 0) {
      return false;

    } else if (this.props.dataManager.checkedData.length > 0) {
      for (let i = 0; i < this.props.dataManager.checkedData.length; i++) {
        if (this.props.dataManager.checkedData[i].isDirectory == 1) {
          return false;
        } else {
          return true;
        }
      }

    } else {
      return false;
    }
  };
  //重命名按钮点击判断
  buttonUploadRename = () => {
    //需要判断 当前用户是进入到哪个目录下方
    // if (this.props.dataManager.currentPath == "") {
    if (this.props.dataManager.myCurrentPath == "") {
      return false;
    } else if (this.props.dataManager.checkedData.length == 0) {
      return false;
    } else if (this.props.dataManager.checkedData.length == 1) {
      for (let i = 0; i < this.props.dataManager.checkedData.length; i++) {
        if (this.props.dataManager.checkedData[i].isDirectory == 1) {
          return false;
        } else {
          return true;
        }
      }
    } else {
      return false;
    }
  };
//复制移动链接按钮点击判断
  buttonCopySelected = () => {
    const { currentPath, myCurrentPath, checkedData } = this.props.dataManager;
    // const { myCurrentPath, checkedData } = this.props.dataManager;
    //需要判断 当前用户是进入到哪个目录下方
    // if (currentPath == "") {
    if (myCurrentPath == "") {
      return false;
      // } else if (currentPath.split("/")[0] == "测试数据" || "示例数据") {
    } else if (myCurrentPath.split("/")[0] == "我的数据") {
      if (checkedData.length == 0) {
        return false;
      } else {
        for (let i = 0; i < checkedData.length; i++) {
          if (checkedData[i].isDirectory == 1) {
            return false;
          }
        }
      }
    } else {
      return true;
    }
  };

  refresh = (_this) => {
    if (fileRef) {
      _this.spacesizeGet();
      fileRef.current.changeCheckedData();
      fileRef.current.getListData();
    }
  };


  render() {
    const { dataManager } = this.props;
    const { currentPath, myCurrentPath, testUsedSize, exampleUsedSize, myUsedSize } = dataManager;
    // const disabled = this.props.dataManager.currentPath == "" ? "disabled" : this.state.status == false ? "" : "disabled";
    const disabled = this.props.dataManager.myCurrentPath == "" ? "disabled" : this.state.status == false ? "" : "disabled";
    const buttonUploadSelected = this.buttonUploadSelected();
    const buttonUploadRename = this.buttonUploadRename();
    const text = <span>文件名不能包含空格及下列任何字符<br/>&nbsp;/&nbsp;\&nbsp;:&nbsp;*&nbsp;?&nbsp;"&nbsp;&lt;&nbsp;&gt;&nbsp;|&nbsp;</span>;
    const columns = this.state.status == false ? this.columns : this.columnsSearch;

    return (
      <PageHeaderLayout
        title="我的数据"
        breadcrumbList={[{ title: "应用中心" }, { title: "我的数据" }]}
      >
        <div className={styles.myDataPage} id="myDataPage">
          <div style={{height:"32px"}}>
            <div id="fixedTop">
              <div id="top_btnMenu" className={styles.top_btnMenu}>
                <Upload
                  beforeUpload={(file, fileList) => this.upload(file, fileList)}
                  showUploadList={false}
                  multiple={true}
                >
                  <Button type="primary" disabled={disabled}>上传</Button>
                </Upload>
                <Button onClick={() => this.toDownload()} disabled={buttonUploadSelected == true ? "" : "disabled"}
                        style={{ marginLeft: "12px" }}>
                  下载
                </Button>
                <Button style={{ marginLeft: "8px" }} onClick={this.deleteFile}
                        disabled={this.props.dataManager.checkedData.length == 0 ? "disabled" : ""}>
                  删除
                </Button>
                <Button style={{ marginLeft: "8px" }} onClick={() => this.setModalVisible(true)}
                        disabled={disabled}>新建文件夹</Button>
                <Button style={{ marginLeft: "12px" }} onClick={this.renameFile}
                        disabled={buttonUploadRename == true ? "" : "disabled"}>
                  重命名
                </Button>
                <FileTree {...this.props} dataManager={this.props.dataManager}
                          buttonCopySelected={this.buttonCopySelected}

                          isMyData={1} that={this} refresh={this.refresh} reFreshData={this.reFreshData}/>
              </div>
              <div className={styles.searchNav} id="searchNav">
                <Search
                  placeholder="搜索您的文件"
                  onSearch={value => this.onSearch(value)}
                />
                <div className={styles.progressLine}>
                  <p>
                    {/* <span style={{ marginRight: "59px" }}>示例数据{bytesToSize(exampleUsedSize)}</span>*/}
                    <span style={{ float: "right" }}>我的数据{bytesToSize(myUsedSize)}</span></p>
                </div>
              </div>
            </div>
          </div>

          <FileList
            {...this.props}
            columns={columns}
            download={this.download}
            getProps={this.props}
            isMyData={1}
            // currentPath={currentPath}
            currentPath={myCurrentPath}
            rowSelection={true}
            ref={this.file}
            chengeState={this.chengeState.bind(this)}
            status={this.state.status}
            reFreshData={this.reFreshData}
            upload={this.upload.bind(this)}
            projectManageJump={this.projectManageJump}
            _isSearch={this.state.status == false ? "" : 1}
          />

          <Modal
            title="新建文件夹"
            centered
            visible={this.state.modalVisible}
            okText="保存"
            onOk={() => this.newFolder()}
            onCancel={() => this.setModalVisible(false)}
            style={{ top: -80 }}
          >
            <InputValid
              placeholder="新建文件夹"
              inputValue={this.state.inputValue}
              onChange={this.handleChange}
              pattern={CHECK_RENAME}
              showHelp={this.state.showHelp}
            />
          </Modal>
          <Modal
            title="重命名"
            centered
            visible={this.state.modalVisible1}
            okText="保存"
            /*            style={{top:190}}*/
            onOk={() => this.handleOk()}
            onCancel={() => this.setModalVisible(false)}
            className={styles.newFold}
          >
            <Form
              onSubmit={this.handleSubmit}
              hideRequiredMark
              style={{ minHeight: "100px" }}
              className={styles.renameForm}
            >
              <ColFormItem
                layout={{ span: 24 }}
                form={this.props.form}
                pattern={CHECK_RENAME}
                type="Input"
                parameter="file_srcName"
                id="content"
                required={true}
                placeholder="不能包含：引号、括号、空格、回车符以及`*\$+&%#!~"
                initialValue={this.state._srcName}
              />
              <Button
                id="submit"
                style={{ display: "none" }}
                type="primary"
                htmlType="submit"
              />
            </Form>

          </Modal>
          <Modal
            title="重命名"
            centered
            visible={this.state.modalVisible2}
            okText="是"
            /* style={{top:190}}*/
            onOk={() => this.checkRename()}
            onCancel={() => this.setModalVisible(false)}
          >
            <p style={{ fontWeight: "650" }}><Icon type="info-circle" style={{
              color: "rgba(24, 144, 255, 1)",
              fontSize: "18px",
              marginRight: "12px"
            }}/>文件名重复，是否保留两文件？</p>
          </Modal>


        </div>

        <UploadList
          {...this.props}
          dataSource={this.props.dataManager.checkpoints}
          uploadFiles={this.props.dataManager.alreadyUpload}
          that={this}
          refreshCallBack={(file, taskCode, that) => this.refreshList(file, taskCode, that)}
        />
      </PageHeaderLayout>
    );
  }
}
