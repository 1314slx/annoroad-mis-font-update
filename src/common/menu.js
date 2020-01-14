import { isUrl } from "../utils/utils";
import request from '../utils/request';
import {notification} from 'antd';

/**
 * 默认菜单
 */
let dashboard = {
          "nodeCode": "f3904631510845f3a63828f1cf5bae6f",
          "parentNodeCode": "",
          "name": "Dashboard",
          "path": "Dashboard",
          "icon": "dashboard"
        };

/**
 * 后台获取菜单
 */
export const getMenuData = async () => {
  let menus = null;
  try {
    let data = await request("/annoroad-cloud-mis-server/user/nav", {})
    if (data.code != "000000") {
      // notification.error({
      //   message: "请求异常",
      //   description: "请求异常，请刷新页面"
      // });
    }else{
      menus = data.data.navTree;
    }
  }catch (e) {
  }
  if(menus && menus[0] && menus[0].name != "Dashboard"){
      menus.unshift(dashboard);
  }
  return formatter(menus || [dashboard]);
};

/**
 * 将后台菜单转换成系统需要的格式
 */
function formatter(data, parentPath = "/", parentAuthority) {
  return data.map(item => {
    let { path } = item;
    if (!isUrl(path)) {
      path = parentPath + item.path;
    }
    const result = {
      ...item,
      path,
      authority: item.authority || parentAuthority
    };
    if (item.children) {
      result.children = formatter(
        item.children,
        `${parentPath}${item.path}/`,
        item.authority
      );
    }
    return result;
  });
}
