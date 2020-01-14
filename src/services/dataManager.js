import request from "../utils/request";
import mock from "../utils/mock";

export async function findFile(params) {
  return request("/annoroad-cloud-mis-server/data/find", {
    method: "POST",
    body: params
  });
}
// 应用中心-我的数据
export async function findMyDataFile(params) {
  return request("/annoroad-cloud-mis-server/data/mine/find", {
    method: "POST",
    body: params
  });
}

//获取用户的空间大小以及所使用的空间大小
export async function spaceSize(params) {
  return request("/annoroad-cloud-mis-server/data/spacesize/get", {
    method: "POST",
    body: params
  });
}

export async function deleteFile(params) {
  return request("/annoroad-cloud-mis-server/data/file/delete", {
    method: "POST",
    body: params
  });
}

/**
 * 新建文件夹
 */
export async function newFolder(params) {
  return request("/annoroad-cloud-mis-server/data/create/folder", {
    method: "POST",
    body: params
  });
}

/**
 * 查询已经上传的文件列表
 * @param params
 * @returns {Promise<*>}
 */
export async function findAlreadyUploadFiles(params){
  return request("/annoroad-cloud-mis-server/resource/task/find", {
    method: "POST",
    body: params
  });
}

/**
 * 文件（夹）校验
 * @param params
 * @returns {Promise<*>}
 */
export async function objectCheck(params){
  // return mock.queryObjectCheck();
  return request("/annoroad-cloud-mis-server/data/object/check", {
    method: "POST",
    body: params
  });
}

