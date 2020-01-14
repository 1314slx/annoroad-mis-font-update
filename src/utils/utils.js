import moment from "moment";

//浏览器title
/*此处注释*/
export const BROWSER_TITLE_BOSS = "ANNOROAD";
export const BROWSER_TITLE_APPLY = "应用管理";
export const BROWSER_TITLE_SYSTEM = "系统管理";

export function setItem(key, value) {
  sessionStorage.setItem(key, value);
}

export function getItem(key) {
  const data = sessionStorage.getItem(key);
  if (data) {
    return data;
  } else {
    return false;
  }
}

export function removeItem(key) {
  sessionStorage.removeItem(key);
}


//深度克隆
export function deepClone(obj) {
  let proto = Object.getPrototypeOf(obj);
  return Object.assign({}, Object.create(proto), obj);

}
//比较两个对象是否相等
export function cmp(x, y) {
  if (x === y) {
    return true;
  }

  if (!(x instanceof Object) || !(y instanceof Object)) {
    return false;
  }

  if (x.constructor !== y.constructor) {
    return false;
  }

  for (let p in x) {
    if (x.hasOwnProperty(p)) {
      if (!y.hasOwnProperty(p)) {
        return false;
      }

      if (x[p] === y[p]) {
        continue;
      }

      if (typeof x[p] !== "object") {
        return false;
      }

      if (!Object.equals(x[p], y[p])) {
        return false;
      }
    }
  }

  for (let p in y) {
    if (y.hasOwnProperty(p) && !x.hasOwnProperty(p)) {
      return false;
    }
  }
  return true;
}

export function equals() {
  Array.prototype.equals = function(array) {
    // if the other array is a falsy value, return
    if (!array)
      return false;

    // compare lengths - can save a lot of time
    if (this.length != array.length)
      return false;

    for (var i = 0, l = this.length; i < l; i++) {
      // Check if we have nested arrays
      if (this[i] instanceof Array && array[i] instanceof Array) {
        // recurse into the nested arrays
        if (!this[i].equals(array[i]))
          return false;
      } /*else if (this[i] != array[i]) {
        // Warning - two different object instances will never be equal: {x:20} != {x:20}
        return false;
      }*/
    }
    return true;
  };
}

//去除入参空格
export function trim(str) {
  return str.replace(/(^\s+)|(\s+$)/g, "");
}

export function trimNum(num) {
  if (!isNaN(num)) {
    return num;
  }
  return false;
}

//对象异常校验，并返回
/*export function dataCheck(data, value) {
  if (data && data.hasOwnProperty(value)) {
    return data[value];
  } else {
    return false;
  }
}*/

//对象异常校验，并返回
export function dataCheck(data, value) {
  // console.log("data,value", data, value);
  if (data && data.hasOwnProperty(value)) {
    return data[value];
  } else {
    return false;
  }
}

//对象异常校验，并返回
export function dataCheckStatus(data, value) {
  if (data && data.hasOwnProperty(value)) {
    if (data[value] === 1) {
      return "初始化";
    } else if (data[value] === 2) {
      return "草稿";
    } else if (data[value] === 3) {
      return "待部署";
    } else if (data[value] === 4) {
      return "部署驳回";
    } else if (data[value] === 5) {
      return "待审核";
    } else if (data[value] === 6) {
      return "审核驳回";
    } else if (data[value] === 7) {
      return "审核通过";
    } else if (data[value] === 8) {
      return "已上架";
    } else if (data[value] === 9) {
      return "已下架";
    } else if (data[value] === 10) {
      return "已失效";
    } else {
      return data[value];
    }
  } else {
    return false;
  }
}

//是否是数组
export function isArray(value) {
  if (typeof Array.isArray === "function") {
    return Array.isArray(value);
  } else {
    return Object.prototype.toString.call(value) === "[object Array]";
  }
}

//返回列表默认结构，所有异常处理都在mock做，列表只做显示 ，不关心数据
export function nullData() {
  return {
    page_no: 0,
    page_size: 10,
    page_total: 10,
    total: 10,
    dataSource: []
  };
}

//时间格式转时间戳
export function timestamp(date) {
  if (date) {
    return new Date(date).getTime();
  }
  return undefined;
}

/*
export function changeTimestamp(data) {

}
*/

//时间戳转日期格式-mock/data
export function timestampToTime(data, value, timeMark) {


  if (data && data.hasOwnProperty(value) && data[value] === 0) {
    return "";
  }
  if (data && data.hasOwnProperty(value) && (timeMark === 1)) {
    //var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(data[value]); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = date.getDate() < 10?("0" +date.getDate()+ "    " ):(date.getDate()+ "    " );
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    //var m = date.getMinutes() ;
    /*var m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();*/
    var m =
      (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
      ":";
    var s =
      date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();

    return Y + M + D + h + m + s;
  } else if (data && data.hasOwnProperty(value)) {
    //var date = new Date(timestamp * 1000);//时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var date = new Date(data[value]); //时间戳为10位需*1000，时间戳为13位的话不需乘1000
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = (date.getDate() < 10 ? "0" + date.getDate() : date.getDate()) + "    ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    //var m = date.getMinutes() ;
    var m =
      date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
    //var s = date.getSeconds();
    //return Y+M+D+h+m+s;
    return Y + M + D + h + m;
  } else if (data && data.hasOwnProperty(value) == false) {
    var date = new Date(data);
    var Y = date.getFullYear() + "-";
    var M =
      (date.getMonth() + 1 < 10
        ? "0" + (date.getMonth() + 1)
        : date.getMonth() + 1) + "-";
    var D = date.getDate() + "    ";
    var h =
      (date.getHours() < 10 ? "0" + date.getHours() : date.getHours()) + ":";
    if(timeMark==2){
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes());
      return Y + M + D + h + m ;
    }else{
      var m =
        (date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes()) +
        ":";
      var s =
        date.getSeconds() < 10 ? "0" + date.getSeconds() : date.getSeconds();
      return Y + M + D + h + m + s;
    }

  }else{
    return false;
  }
}


//时长转换成时分秒
export function durationToTime(data) {
  var hours = parseInt((data % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  hours = (hours < 10 ? "0" + hours : hours) + ":";
  var minutes = parseInt((data % (1000 * 60 * 60)) / (1000 * 60));
  minutes = (minutes < 10 ? "0" + minutes : minutes) + ":";
  var seconds = Math.ceil((data % (1000 * 60)) / 1000);
  seconds = seconds < 10 ? "0" + seconds : seconds;
  return hours + minutes + seconds;
}

//手机号隐匿
export function concealment(value) {
  if (value) {
    return value.replace(/(\d{3})\d{4}(\d{4})/, "$1****$2");
  }
  return "";
}

//获取浏览器参数
export function getQueryString(name) {
  let reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i"); // 匹配目标参数
  let result = window.location.search.substr(1).match(reg); // 对querystring匹配目标参数
  if (result !== null) {
    return decodeURIComponent(result[2]);
  } else {
    return null;
  }
}

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === "today") {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === "week") {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === "month") {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, "months");
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(
        moment(
          `${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`
        ).valueOf() - 1000
      )
    ];
  }

  if (type === "year") {
    const year = now.getFullYear();

    return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
  }
}

export function getPlainNode(nodeList, parentPath = "") {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ""}`.replace(/\/+/g, "/");
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  const fraction = ["角", "分"];
  const digit = ["零", "壹", "贰", "叁", "肆", "伍", "陆", "柒", "捌", "玖"];
  const unit = [["元", "万", "亿"], ["", "拾", "佰", "仟"]];
  let num = Math.abs(n);
  let s = "";
  fraction.forEach((item, index) => {
    s += (digit[Math.floor(num * 10 * 10 ** index) % 10] + item).replace(
      /零./,
      ""
    );
  });
  s = s || "整";
  num = Math.floor(num);
  for (let i = 0; i < unit[0].length && num > 0; i += 1) {
    let p = "";
    for (let j = 0; j < unit[1].length && num > 0; j += 1) {
      p = digit[num % 10] + unit[1][j] + p;
      num = Math.floor(num / 10);
    }
    s = p.replace(/(零.)*零$/, "").replace(/^$/, "零") + unit[0][i] + s;
  }

  return s
    .replace(/(零.)*零元/, "元")
    .replace(/(零.)+/g, "零")
    .replace(/^整$/, "零元整");
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn("Two path are equal!"); // eslint-disable-line
  }
  const arr1 = str1.split("/");
  const arr2 = str2.split("/");
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  } else if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    let isAdd = false;
    // 是否包含
    isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ""));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(
      route => route !== item && getRelation(route, item) === 1
    );
    return {
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
      exact
    };
  });
  return renderRoutes;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/g;

export function isUrl(path) {
  return reg.test(path);
}

//生成唯一-随机token
export function guid() {
  const S4 = () => (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
  return (S4() + S4() + "-" + S4() + "-" + S4() + "-" + S4() + "-" + S4() + S4() + S4());
}

export function uploadPath(path, file) {
  const uid = guid();
  return `${path}/${uid}.${file.type.split("/")[1]}`;
}

export function bytesToSize(bytes) {
  if (bytes === 0) return "0 B";
  let k = 1024;
  const sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return (bytes / Math.pow(k, i)).toFixed(2) + " " + sizes[i];
  //toPrecision(3) 后面保留一位小数，如1.0GB                                                                                                                  //return (bytes / Math.pow(k, i)).toPrecision(3) + ' ' + sizes[i];
}
//计算字节数
export function byteCount(value){
  let byteSize = 0;
  for (let i = 0; i < value.length; i++) {
    let charCode = value.charCodeAt(i);
    if (0 <= charCode && charCode <= 0x7f) {
      byteSize += 1;
    } else if (128 <= charCode && charCode <= 0x7ff) {
      byteSize += 2;
    } else if (2048 <= charCode && charCode <= 0xffff) {
      byteSize += 3;
    } else if (65536 < charCode && charCode <= 0x1FFFFF) {
      byteSize += 4;
    } else if (0x200000 < charCode && charCode <= 0x3FFFFFF) {
      byteSize += 5;
    } else if (0x4000000 < charCode && charCode <= 0x7FFFFFFF) {
      byteSize += 6;
    }
  }
  return byteSize;
}
