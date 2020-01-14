import { check, isArray, deletePepeatArr } from "../../utils";
import { nullData } from "../../../utils/utils";
import { platformOptions } from "../../../utils/options";

/**
 * 角色管理列表数据
 * */
export const getRoleData = data => {
  //console.log("角色列表：", data);
  const _data = check(data);

  let _list = [];
  if (_data) {
    _data.map((value, index) => {
      _list.push({
        key: index,
        code: value.code, //数据code
        roleName: value.name, //角色姓名
        userNum: value.user_count, //用户数量
        describe: value.descr, //角色描述
        platform: value.platform //平台信息
      });
    });
    data.body.dataSource = _list;
  }
  return _data ? data.body : nullData();
};
/**
 * 角色模块信息查询
 * */
export const getRoleModuleData = data => {
  //console.log("角色模块信息查询：", data);

  const _data = check(data);
  //console.log('lixin:', setModuleTreeData(_data))
  let _list = [];
  if (_data) {
    const _moduleData = setModuleTreeData(_data);
    const loop = data => {
      data.map((value, index) => {
        if (!value.children) {
          _list.push(value.key);
        } else {
          loop(value.children);
        }
      });
    };
    loop(_moduleData);
  }
  return _list;
};
/**
 * 平台模块信息
 * */
/*const data = [{
  name: '北京梦哆啦网络科技有限公司',
  key: '0-0',
  children: [{
    name: '战略合作中心',
    key: '0-0-0',
    children: [{
      name: '业务发展中心',
      key: '0-0-0-0',
    }, {
      name: '研发运营中心',
      key: '0-0-0-1',
    }]
  }, {
    name: '中台管理中心',
    key: '0-0-1',
    children: [{
      name: '后台职能中心',
      key: '0-0-1-0',
    }]
  }]
}]*/
Array.prototype.remove = function(val) {
  let index = this.indexOf(val);
  if (index > -1) {
    this.splice(index, 1);
  }
};
export const getPlatformModuleList = data => {
  //console.log("平台模块信息:", data);
  const _data = check(data);

  let _list = null;
  if (_data) {
    //1、获取当前有哪些平台，根据前缀（如：BOSS，PRM）

    let _moduleData = getModuleList(_data);

    //console.log('_moduleData:', _moduleData);

    _list = {
      /*此处注释*/
      BOSS: [
        {
          name: "BOSS系统",
          key: "BOSS",
          children: [...setModuleTreeData(_moduleData["BOSS"])]
        }
      ],

      RMS: [
        {
          name: "风险管理系统",
          key: "RMS",
          children: [...setModuleTreeData(_moduleData["RMS"])]
        }
      ],
      PRM: [
        {
          name: "伙伴关系管理系统",
          key: "PRM",
          children: [...setModuleTreeData(_moduleData["PRM"])]
        }
      ],
      CTS: [
        {
          name: "信贷交易系统",
          key: "CTS",
          children: [...setModuleTreeData(_moduleData["CTS"])]
        }
      ],
      APPLY: [
        {
          name: "应用管理",
          key: "APPLY",
          children: [...setModuleTreeData(_moduleData["APPLY"])]
        }
      ],
      SYSTEM: [
        {
          name: "应用管理",
          key: "SYSTEM",
          children: [...setModuleTreeData(_moduleData["SYSTEM"])]
        }
      ]
    };
  }
  return _list;
};

//2、平台分组，同平台的放在一个数组里边
function getModuleList(data) {
  let _moduleList = [];
  let _moduleData = {};
  platformOptions.map((item, index) => {
    _moduleList[index] = [];
    data.map(value => {
      if (value.platform === item.key) {
        _moduleList[index].push(value);
      }
    });
    _moduleData[item.value] = _moduleList[index];
  });
  return _moduleData;
}

//设置某个平台的树形数据
function setModuleTreeData(data) {
  if (!data) {
    return;
  }
  let _dataObj = [];
  //const _len = getMaxLen(data);
  let _obj = {};

  const loop = (item, i) => {
    item.map((value, index) => {
      const _code = value.code;
      if (_code && isArray(_code.split("_"))) {
        if (_code.split("_").length === i) {
          _obj = {
            name: value.name,
            key: value.code
          };
          _dataObj.push(_obj);
          item.remove(value);
        }
      }
    });

    enterFrame(item, _dataObj, i);
  };
  loop(data, 2);
  return _dataObj;
}

//item  全部数据
//obj   当前进行比对的对象
function enterFrame(item, obj, i) {
  const enter = (data, pos) => {
    //当前数据跟全部数据做比较
    data.map(current => {
      const _key = current.key;
      item.map((value, d) => {
        let _code = value.code;
        if (
          _code &&
          isArray(_code.split("_")) &&
          _code.split("_").length === pos + 1
        ) {
          if (_code.match(_key)) {
            if (!current.children) {
              current.children = [];
            }
            current.children.push({
              name: value.name,
              key: value.code
            });
            enter(current.children, pos + 1);
          }
        }
      });
    });
  };
  enter(obj, i);
}

//获取当前平台模块有几级
function getMaxLen(data) {
  if (data) {
    let _max = [];
    data.map(value => {
      const _code = value.code;
      if (_code) {
        if (isArray(_code.split("_"))) {
          _max.push(_code.split("_").length);
        }
      }
    });
    return Math.max(..._max);
  }
  return 0;
}

//获取当前有哪些平台，前缀（如：BOSS，PRM）
function getPlatformNum(data) {
  let _platform = [];
  if (data) {
    data.map(value => {
      const _code = value.code;
      if (_code) {
        if (isArray(_code.split("_"))) {
          _platform.push(_code.split("_")[0]);
        }
      }
    });
    return deletePepeatArr(_platform);
  }
}
