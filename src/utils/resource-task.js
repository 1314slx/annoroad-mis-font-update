import { notification, message } from 'antd';
import request from "./request";


/**
 * 创建上传任务
 * @param srcName 文件名
 * @param destPath 目标路径
 * @param size 文件文件大小
 * @param source 任务来源，1：数据管理/我的数据，2：文件选择，3：视频管理
 * @returns {Promise<*>}
 */
export async function createUploadTask(srcName, destPath, size, source){
  let data = await request("/annoroad-cloud-mis-server/resource/task/upload/create", {
    body: {
      srcName: srcName,
      destPath: destPath,
      size: size,
      type: 1,
      source: source
    }
  });
  if(data){
    let title = "上传失败";
    if(data.code == "000000"){
      return data.data;
    }else if(data.code == "161403" || data.code == "161404"){
      title = "文件名过长";
    }else if(data.code == "161405"){
      title = "用户空间不足";
    }else if(data.code == "161010"){
      message.error("文件上传失败，不能包含：引号、括号、空格、回车符以及`*\\$+&%#!~");
      return;
    }
    const tips = "存储路径过长，上传失败";
    notification["error"]({
      message: title,
      // description: srcName + "上传失败," + data.msg
      description: srcName + (data.code == "161404"?"":"上传失败,") + (data.code == "161404" ? tips :data.msg)
    })
  }
  return null;
}

/**
 * 消息通知
 * @param subtaskCode 子任务编号
 * @param type 通知类型，1：取消上传(OSS)，2：上传失败(OSS)，3：上传成功(视频)，4：上传失败(视频)
 * @param reason 失败原因
 * @returns {Promise<*>}
 */
export async function notify(subtaskCode, type, reason) {
  let data = await request("/annoroad-cloud-mis-server/resource/task/result/notify", {
    body: {
      subtaskCode: subtaskCode,
      type: type,
      reason: reason
    }
  });
  if(data && data.code == "000000"){
    return data.data;
  }
  return null;
}

/**
 * 资源任务进度查询
 * @param taskCodes 任务编号
 * @param callBack 回调方法
 */
export function progress(taskCodes, callBack){
  request("/annoroad-cloud-mis-server/resource/task/progress",{
    body: {
      codes: Array.isArray(taskCodes) ? taskCodes : [taskCodes]
    }
  }).then((data)=>{
    if(data && data.code == "000000"){
      callBack(data.data)
    }
  }).catch(()=>{
    callBack()
  })
}

/**
 * 心跳连接
 * @returns {Promise<void>}
 */
export async function heartbeat(){
  request("/annoroad-cloud-mis-server/heartbeat",{})
}

