import React, { Component, Fragment } from "react";
import { Input, Modal, message, Progress, Button, Upload, Tooltip } from "antd";
import FileItem from "./FileItem";
import Breadcrumb from "./Breadcrumb";
import request from "../../utils/request";
import File0 from "./File0";
import { Base64 } from "js-base64";
import { getOssClient } from "../../utils/oss";
import { createUploadTask, notify, progress, heartbeat } from "../../utils/resource-task";
import { byteCount, bytesToSize } from "../../utils/utils";

const Search = Input.Search;
import styles from "./style.less";
import InputValid from "../InputValid";
import { CHECK_RENAME } from "../../utils/pattern";

/**
 * 文件选择组件modal
 */

class FileSelect extends Component {
  constructor(props) {
    super(props);
    this.state = {
      first: true,
      title: this.props.title || "annoroad",
      visible: false,
      onOk: this.props.onOk,
      onCancel: this.props.onCancel,
      dataSource: [],
      selectedName: "",
      selectedIsFile: false,
      isSearch: false,
      selectDir: false,
      searchPath: "",
      rootDir: this.props.rootDir || "",
      requestUri: this.props.requestUri,
      showProgress: false,
      percent: 0,
      resourceTask: null,
      canUpload: false,
      client: null,
      newPath: "",//新建文件夹路径
      newFolderVisible: false,//新建文件夹弹层
      inputValue: "",//新建文件夹弹层
      showHelp: false
    };
    this.ing = false;
    this.isDouble = 0;
    this.breadcrumb = React.createRef();
    if (this.props.title == "输入文件") {
      setInterval(this.heartbeatUpload, 1 * 60 * 1000);
    }
    this.uploading = 0;
  }

  /**
   * 上传文件时发送心跳连接
   */
  heartbeatUpload = () => {
    if (this.uploading > 0) {
      heartbeat();
    }
  };

  /**
   * 点击面包屑
   */
  onClickBreadcrumb = () => {
    this.setState({
      selectedIsFile: false,
      selectedName: ""
    });
  };
  // 双击行
  doubleClickRow = (data, _type, flag) => {
    let isCancel = false;
    if (!flag) {
      isCancel = this.state.selectedName == data.fileName;
    }
    this.setState({
      selectedName: isCancel ? "" : data.fileName,
      selectedIsFile: isCancel ? false : data.isDirectory == 2,
      // selectedIsFile: true,
      searchPath: data.path
    });
    if (_type == 1) {
      this.isDouble = 1;
      this.selectedName = data.fileName;
      this.onOk();

    }
  };

  /**
   * 点击选中行
   * flag: 是否是新创建，解决新建文件同名问题
   */
  onClickRow = (path, name, isDirectory, flag) => {
    // 判断当前选中和再次点击的是不是同一个
    let isCancel = false;
    if (!flag) {
      isCancel = this.state.selectedName == name;
    }
    this.setState({
      selectedName: isCancel ? "" : name,
      selectedIsFile: isCancel ? false : isDirectory == 2,
      searchPath: path
    });
  };

  /**
   *  点击目录进入下一层
   */
  onClickNext = (path, name, isDirectory, isConcat) => {
    if (this.ing) {
      // this.ing = false;
      return;
    }
    this.ing = true;
    // path不为空说明是搜索后点击
    let fileName = ""; // 选择文件名
    if (path) {
      // 如果是文件夹并且可拼接，将选中的目录进行拼接到路径 1文件夹 2文件
      path = path + (isConcat && isDirectory == 1 ? "/" + name : "");
    } else {
      path = this.breadcrumb.current.getCurrentPath() + "/" + name;
    }
    request(this.props.requestUri, { body: { prefix: path } }).then(data => {
      if (path) {
        // 搜索后跳转目录需要重置导航屑
        if (this.breadcrumb.current) {
          this.breadcrumb.current.resetItems(path, true, false);
          if (!(isConcat && isDirectory == 1)) {
            fileName = name;
          }
        }
      } else {
        this.breadcrumb.current.pushItem(name);
      }
      if (data && data.data) {
        let dataSource = data.data.folders;
        if (!this.state.selectDir) {
          dataSource = dataSource.concat(data.data.files);
        }
        this.setState({
          dataSource: dataSource,
          selectedName: fileName,
          selectedIsFile: isDirectory == 2,
          isSearch: false
        });
      }
      this.ing = false;
    });
  };

  /**
   * 打开文件或文件夹选择框
   */
  open = (title, selectDir) => {
    /*if (!this.state.first) {
      this.setState({
        first: true
      });
      this.requestList(this.props.rootDir, false);
    }*/
    if (!this.state.first) {
      this.breadcrumb.current.clearItems();
    }
    this.setState({
      first: false,
      selectedName: ""
    });
    this.requestList(this.props.rootDir, false);
    this.setState({
      visible: true,
      title: title,
      canUpload: title == "输入文件",
      isSearch: this.state.isSearch,
      selectDir: selectDir
    });
  };

  /**
   * 确认选择按钮
   */
  onOk = () => {
    if (
      !this.state.selectDir &&
      (!this.state.selectedIsFile || this.state.selectedName == "" || this.state.selectedName === undefined) && (this.props.selectBtn !== 2)
    ) {
      if (this.isDouble == 0) {
        message.error("请选择文件");
        return;
      }
    } else if (this.props.selectBtn == 2 && this.state.selectedIsFile) {
      message.error("请选择文件夹");
      return;
    } else if (this.props.selectBtn == 2 && !this.state.selectedName) {
      message.error("请选择文件夹");
      return;
    }
    this.setState({
      visible: false
    });
    if (this.state.onOk) {
      let path = "";
      // 如果选中文件时，是在搜索状态，需要获取文件全路径拼接，因为此时导航屑还没有相应的路径导航
      if (this.state.isSearch) {
        path = this.state.searchPath + (this.state.selectedName == "" ? "" : "/" + this.state.selectedName);
      } else {
        path = this.breadcrumb.current.getCurrentPath() + (this.state.selectedName == "" ? this.isDouble == 1 ? "/" + this.selectedName : "" : "/" + this.state.selectedName);
      }
      this.props.onOk(path);
      this.isDouble = 0;
    }
  };

  /**
   * 取消
   */
  onCancel = () => {
    this.setState({
      visible: false
    });
    if (this.state.onCancel) {
      this.props.onCancel();
    }
  };

  /**
   * 搜索
   */
  search = value => {
    if (!value) {
      return;
    }
    this.breadcrumb.current.resetItems(null, true, true);
    this.requestList(value, true);
  };

  /**
   * 列表请求
   * 路径
   * 是否搜索
   * 是否新添加，上传或者新建文件夹
   */
  requestList = (path, isSearch, newAdd) => {
    let searchName = "";
    if (isSearch) {
      searchName = path;
      path = this.props.rootDir;
    }
    request(this.props.requestUri, {
      body: { prefix: path, searchName: searchName }
    }).then(data => {
      if (data && data.data) {
        let dataSource = data.data.folders;
        if (!this.state.selectDir) {
          if (this.props.selectBtn !== 2) {
            dataSource = dataSource.concat(data.data.files);
          }
        }
        this.setState({
          dataSource: dataSource,
          isSearch: isSearch
        }, () => {
          // 如果是新添加
          this._resetSortList(newAdd);
        });
      }
    });
  };

  /**
   * 新上传或者新建文件夹时候排序 最新在最上
   * */
  _resetSortList(newAdd) {
    if (newAdd) {
      const _data = this.state.dataSource;
      // 取出新添加对象
      const _current = newAdd.folderName || newAdd.destName;
      let _target = null;
      _data.map((value, index) => {
        if (value.fileName === _current) {
          //console.log("取出时间最大的对象：", value);
          _target = value;
          _data.splice(index, 1);
        }
      });
      if (_target) {
        _data.unshift(_target);
        //console.log("处理后的对象", _data);
        this.setState({
          dataSource: _data
        }, () => {
          // 排序后默认选中
          this.onClickRow(_target.path, _target.fileName, _target.isDirectory, true);
        });
      }

    }
  }

  /**
   * 循环文件或文件夹列表进行渲染
   */
  forEachFile = () => {
    const _data = this.state.dataSource;
    if (_data) {
      return _data.map((value, index) => {
        return <FileItem key={index}
                         data={value}
                         selectedName={this.state.selectedName}
                         searchPath={this.state.searchPath}
                         onClickRow={(path, name, isDirectory) =>
                           this.onClickRow(path, name, isDirectory)
                         }
                         doubleClickRow={(data, _type) => this.doubleClickRow(data, _type)}
                         onClickNext={(path, name, isDirectory, isConcat) =>
                           this.onClickNext(path, name, isDirectory, isConcat)
                         }
                         isSearch={this.state.isSearch}
                         selectDir={this.state.selectDir}
        />;
      });
    }
  };
  /**
   * 新建文件夹
   */
  setModalVisible = (params) => {
    // this.isForbidCode();
    let path = this.breadcrumb.current.getCurrentPath();
    this.setState({
      newPath: path,
      newFolderVisible: true
    });
    if (!params) {
      this.setState({
        showHelp: false
      });
    }
  };

  /**
   * 编辑文件夹名称
   * @param e
   */
  handleChange = (value) => {
    this.setState({ inputValue: value });
  };
  /**
   * 关闭新建文件夹弹框
   */
  setModalHidden = () => {
    this.setState({
      newFolderVisible: false,
      inputValue: "",
      showHelp: false

    });
  };
  /**
   * 确定新建文件夹
   */
  newFolder = () => {
    /*const str = this.state.inputValue;
    if (str.indexOf(" ") >= 0 || str.indexOf("　") >= 0) {
      message.error("文件(夹)名称有空格");
      return;
    }*/
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
      // message.error("文件夹名称不能为空，请输入文件夹名称");
      return;
    }
    const path_prefix = this.state.newPath ? this.state.newPath.substring(0, 4) : "";
    /*if (path_prefix != "测试数据") {
      message.error("请在测试数据下创建新的文件夹");
      return;
    }*/
    if (this.state.inputValue == "") {
      message.warning("文件夹名称不能为空，请输入文件夹名称");
      return;
    }
    let byteLength = byteCount((this.state.inputValue));
    if (byteLength > 150) {
    // if (this.state.inputValue.length > 100) {
      message.error("文件(夹)名称不能超过150字节");
      return;
    }
    // const _path = this.props.myData+'/newFolders';
    this.props.dispatch({
      type: "dataManager/newFolders",
      payload: {
        path: this.state.newPath + "/",
        folderName: this.state.inputValue
      },
      callback: (data) => {
        console.log("data,", data);
        if (data.code == "000000") {
          message.success("创建文件夹成功");
          /*this.file.current.getListData();//查询文件*/
          // this.refreshList(true, data.code, this.state.newPath, this);//查询文件
          this.requestList(this.state.newPath, false, data.data);
          //this.state.dataSource

        } else if (data.code == "161005") {
          message.error("目录过多，创建失败");
        } else if (data.code == "161004" || data.code == "161006") {
          message.error("文件(夹)名称不能超过100字符");
        } else if (data.code == "161803") {
          message.error("用户空间已禁用");
        } else {
          message.error("文件夹创建失败");
        }
        this.setModalHidden();
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

  /**
   *  上传文件
   */
  upload = async (file, fileList) => {
    if (file.name.indexOf(" ") >= 0 || file.name.indexOf("　") >= 0) {
      message.error("文件上传失败，请删除空格后重新上传");
      return true;
    }
    let path = this.breadcrumb.current.getCurrentPath();
    createUploadTask(file.name, path, file.size, 2).then((data) => {
      if (data) {
        this.setState({
          resourceTask: data
        });
        try {
          let name = "user/MIS/" + path + "/" + data.destName;
          let client = getOssClient();
          if (client) {
            this.uploading += 1;
            client.multipartUpload(name, file, {
              headers: {
                "x-oss-callback-var": Base64.encode("{\"x:subtaskCode\": \"" + data.subtaskCode + "\"}")
              },
              progress: (percent, cpt) => {
                this.setState({
                  percent: parseInt(percent * 100)
                });
                if (percent === 1) {
                  this.refreshList(file, data.code, path, this);
                }
              }
            });
            this.setState({
              client: client,
              showProgress: true
            });
          }
        } catch (e) {
          this.uploading -= 1;
          notify(data.subtaskCode, 2, e.message);
        }
      }
    });
    return false;
  };

  /**
   * 刷新页面
   */
  refreshList = (file, taskCode, path, that) => {
    that.uploading -= 1;
    let time = 0;
    let timer = setInterval(function() {
      if (time > 20) {
        that.requestList(path, false);
        that.uploading -= 1;
        clearInterval(timer);
        return;
      }
      time++;
      progress(taskCode, (data) => {
        if (data) {
          if (data.execution == 0) {
            if (data.succeeded == data.total) {
              message.success("文件上传成功");
              that.requestList(path, false, that.state.resourceTask);
            } else {
              message.error("文件上传失败");
            }
            that.setState({
              showProgress: false
            });
            clearInterval(timer);
          }
          return;
        }
        clearInterval(timer);
      });

    }, 1000);
  };

  /**
   * 关闭modal
   */
  handleCancel = () => {
    this.setState({
      showProgress: false
    });
  };
  /**
   * 取消上传
   * @returns {*}
   */
  cancelUpload = () => {
    if (this.state.client) {
      this.state.client.cancel();
    }
    notify(this.state.resourceTask.subtaskCode, 1, "");
    this.setState({
      showProgress: false
    });
    this.uploading -= 1;
  };

  render() {
    const text =
      <span>文件名不能包含空格及下列任何字符<br/>&nbsp;/&nbsp;\&nbsp;:&nbsp;*&nbsp;?&nbsp;"&lt;&nbsp;&gt;&nbsp;|&nbsp;</span>;
    let myStyle = this.props.isVisible == false ? { display: "none" } : { display: "block" };

    return (
      <div>
        <Modal title={this.state.title}
               visible={this.state.visible}
               width={"55%"}
               onOk={() => this.onOk()}
               onCancel={() => this.onCancel()}
               className={styles.fileSelect}
        >
          <div className={styles.uploadWapper}>
            {
              /*!this.state.isSearch && this.state.canUpload ?
                <div className={styles.uploadFile}>
                  <Upload beforeUpload={(file, fileList) => this.upload(file, fileList)}
                          showUploadList={false}
                          multiple={false}
                  >
                    <Button type="primary">上传</Button>
                  </Upload>
                </div> : <div className={styles.uploadFile}>
                  <Button type="primary" style={myStyle} onClick={() => this.setModalVisible(true)}>新建文件夹</Button>
                </div>*/
            }
            {
              !this.state.isSearch && this.props.selectBtn !== 2 ?
                <span style={{ display: "inline-block" }}>
                  <div className={styles.uploadFile}>
                    <Upload beforeUpload={(file, fileList) => this.upload(file, fileList)}
                            showUploadList={false}
                            multiple={false}
                    >
                      <Button type="primary">上传</Button>
                    </Upload>
                  </div>
                  <div className={styles.uploadFile}>
                    <Button onClick={() => this.setModalVisible(true)}>新建文件夹</Button>
                  </div>
                </span>
                : <Fragment/>
            }
            <Search placeholder={"搜索您的文件"}
                    size={"default"}
                    onSearch={value => this.search(value)}
            />
          </div>

          <div>
            <div style={{ marginTop: 20 }}>
              <Breadcrumb request={(path, isSearch) => this.requestList(path, isSearch)}
                          onClick={() => this.onClickBreadcrumb()}
                          rootDir={this.props.rootDir}
                          ref={this.breadcrumb}
              />
              {
                this.state.dataSource.length > 0 ?
                  <table style={{ width: "100%", marginTop: "1%" }} className={styles.fileSelectTable}>
                    <tbody>
                    <tr style={{
                      borderTop: "1px solid #d9d9d9",
                      borderBottom: "1px solid #d9d9d9",
                      backgroundColor: "#fafafa",
                      height: "50px"
                    }}>
                      <th width="370">文件名</th>
                      <th width="110">大小</th>
                      <th width="140">修改日期</th>
                      <th width="110" hidden={!this.state.isSearch}>
                        所在目录
                      </th>
                    </tr>
                    {
                      this.forEachFile()
                    }
                    </tbody>
                  </table> : <File0/>
              }
            </div>
          </div>
        </Modal>

        <Modal title="上传文件列表"
               width={"50%"}
               visible={this.state.showProgress}
               onCancel={this.handleCancel}
               footer={[
                 <Button key="back" onClick={this.cancelUpload}>取消上传</Button>
               ]}
        >
          <div style={{ position: "relative", height: "auto", overflow: "hidden" }}>
            <div style={{ float: "left", width: "70%" }}><Progress percent={this.state.percent}/></div>
            <span style={{ width: "30%", marginLeft: "30px" }}>
                {
                  this.state.resourceTask ?
                    bytesToSize(this.state.resourceTask.size * this.state.percent / 100) + "/" + bytesToSize(this.state.resourceTask.size)
                    : null
                }
            </span>
            <div style={{ marginTop: "24px" }}>正在上传文件</div>
          </div>
        </Modal>

        <Modal title="新建文件夹"
               centered
               visible={this.state.newFolderVisible}
               okText="保存"
               onOk={() => this.newFolder()}
               onCancel={() => this.setModalHidden()}
        >
          <InputValid
            placeholder="新建文件夹"
            inputValue={this.state.inputValue}
            onChange={this.handleChange}
            pattern={CHECK_RENAME}
            style={{ width: "100%" }}
            showHelp={this.state.showHelp}
          />
        </Modal>
      </div>
    );
  }
}

export default FileSelect;
