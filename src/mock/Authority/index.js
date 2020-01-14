import { platformOptions } from "../../utils/options";
import { cmp } from "../../utils/utils";

/**
 * 用户信息数据处理
 * */
export const getUserDetailData = data => {
  //console.log('用户信息数据处理:', data);
  if (data && data.hasOwnProperty("body")) {
    const _data = data["body"];
    let _role_list = _data["role_list"];
    let _temList = {};
    if (_role_list) {
      platformOptions.map(item => {
        _role_list.map(value => {
          if (item.key === value.platform) {
            if (!_temList[item.key]) {
              _temList[item.key] = {};
              _temList[item.key].module_list = [];
            }
            _temList[item.key] = {
              module_list: removal(
                _temList[item.key].module_list.concat(value.module_list)
              ),
              platform: item.key
            };
          }
        });
      });
    }
    let _moduleList = [];
    Object.keys(_temList).forEach(path => {
      _moduleList.push(_temList[path]);
    });
    //console.log('_moduleList:', _moduleList)
    data["body"].module_list = _moduleList;
    return _data;
  }
  return null;
};

export const getCurrentUser = data => {
  let _user = null;
  if (data && data.hasOwnProperty("body")) {
    const _data = data["body"];

    _user = {
      name: _data["name"],
      avatar:
        "https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png"
    };
  }
  return _user;
};

function removal(data) {
  let _list = [];
  let _item = [];
  if (data) {
    data.map(value => {
      if (_list.indexOf(value.code) === -1) {
        _list.push(value.code);
        _item.push(value);
      }
    });
  }
  return _item;
}
