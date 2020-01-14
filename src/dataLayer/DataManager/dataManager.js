import {
  bytesToSize,
  dataCheck,
  nullData,
  timestampToTime,
  guid
} from "../../utils/utils";
import { checkData } from "../../mock/utils";
import { Icon } from "antd";

//我的数据查询文件后列表
export const fileListData = data => {
  const _data = checkData(data);
  const folderList = dataCheck(_data, "folders");
  const fileList = dataCheck(_data, "files");
  if(fileList.length != 0){
    fileList.map((value) => {
      folderList.push(value);
    })
  }
  let _folderList = [];
  if (_data) {
    folderList.map((value, index) => {
      const _defaultValue = dataCheck(value, 'fileName')
      const prefix = _defaultValue.substring(_defaultValue.lastIndexOf("."), _defaultValue.length).toLocaleLowerCase()
      _folderList.push({
        key: index+new Date().getTime(),
        file_name: dataCheck(value, "fileName"), //文件名称
        size:
          dataCheck(value, "size") == 0
            ? (value.isDirectory==2 ? "0B":"-")
            : bytesToSize(dataCheck(value, "size")), //文件大小
        time: dataCheck(value, "updateTime") == 0 ? "-" : timestampToTime(value, "updateTime"), //修改时间
        isDirectory: dataCheck(value, "isDirectory"), //是否为目录 1:是 2:否
        path: dataCheck(value, "path"),
        guid:guid(),
        originSize: dataCheck(value, "size"),
        canDownload: ['.jpg', '.png', '.txt', '.pdf'].includes(prefix) && dataCheck(value, "isDirectory") === 2,
      });
    });
    data.data.dataSource = _folderList;
  }
  return _data ? data.data : nullData();
};

//用户已使用的空间大小
export const exampleUsedSize = data => {
  const _data = dataCheck(data, "data");
  return dataCheck(_data, "misExampleUsedSize");
};
//用户总空间大小
export const testUsedSize = data => {
  const _data = dataCheck(data, "data");
  return dataCheck(_data, "misTestUsedSize");
};
//用户总空间大小
export const myUsedSize = data => {
  const _data = dataCheck(data, "data");
  return dataCheck(_data, "misMineUsedSize");
};

export const handlerUploadFile = (data, state) => {
  let result = new Map();
  if(data.code == "000000"){
    let files = data.data.datas;
    for(let i = 0,len=files.length; i < len; i++) {
      let path = files[i].destPath;
      let name = files[i].destName;
      result.set(files[i].code ,{
        already: true,
        name: path + name,
        percent: 100,
        fileSize: files[i].size,
        taskCode: files[i].code,
        pause: true,
        continue: true,
        clear: false
      });
      state.checkpoints.delete(files[i].code)
      state.allUploadNames.delete(files[i].code)
    }
  }
  return result;
}
