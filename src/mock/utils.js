import { dataCheck } from "../utils/utils";

/*//判断接口数据是否正常
export function check(data) {
  const _body = dataCheck(data, 'body');
  const _data = _body ? dataCheck(_body, 'datas') : false;
  if (_data) {
    return _data;
  }
  return false;
  
}*/
//判断接口数据是否正常
export function check(data) {
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "datas") : false;
  if (_data) {
    return _data;
  }
  return false;
}
//判断接口数据是否正常
export function checkRole(data) {
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "roles") : false;
  if (_data) {
    return _data;
  }
  return false;
}
//判断接口数据是否正常
export function checkNavTree(data) {
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "navTree") : false;
  if (_data) {
    return _data;
  }
  return false;
}

//
//判断接口数据是否正常
export function checkOption(value) {
  const _body = dataCheck(value, "data");
  const _data = _body ? dataCheck(_body, "structure") : false;
  if (_data) {
    return _data;
  }
  return false;
}

//判断接口数据是否正常
export function checkDashboard(data) {
  const _body = dataCheck(data, "data");
  const _data = _body;
  if (_data) {
    return _data;
  }
  return false;
}

//
//判断接口数据是否正常-应用管理-工具类型展示result
export function checkToolType(data) {
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "result") : false;
  if (_data) {
    return _data;
  }
  return false;
}
//判断接口数据是否正常-应用管理-工具类型展示result
export function check_data(data) {
  const _data = dataCheck(data, "data");
  /*const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "result") : false;*/
  if (_data) {
    return _data;
  }
  return false;
}

//数据
export function checkParams(data) {
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "params") : false;
  if (_data) {
    return _data;
  }
  return false;
}

//是否是数组
export function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === "[object Array]";
  }
}

//数组去重
export function deletePepeatArr(arr) {
  let _arr = [];
  if (arr) {
    arr.map(value => {
      if (_arr.indexOf(value) === -1) {
        _arr.push(value);
      }
    });
  }
  return _arr;
}

export function checkResult(data) {
  /*修改*/
  const _body = dataCheck(data, "data");
  const _data = _body ? dataCheck(_body, "result") : false;
  if (_data) {
    return _data;
  }
  return false;
}

export function checkData(data) {
  const _body = dataCheck(data, "data");
  if (_body) {
    return _body;
  }
  return false;
}
