//应用管理-常用工具
import statusFormat from "../../utils/status";
import money from "../../utils/money";
import times from "../../utils/time";

export const ToolsListData = value => {
  const _value =
    value && value.payload && value.payload && value.payload !== ""
      ? value.payload
      : false;
  const data =
    value && value.payload && value.payload.data && value.payload.data !== ""
      ? value.payload.data
      : false;
  const _data = data && data.datas && data.datas !== "" ? data.datas : false;
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        datas: []
      }
    };
  }
  //列表数据
  const applyList = [];

  _data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      summary: value.summary,
      code: value.code,
      name: value.name,
      logo: value.logo
    });
  });

  _value.data.dataSource = applyList;
  return _value.data;
};
//ToolsMenuListData  ==>  ToolsTypeListData
export const ToolsTypeListData = value => {
  const _value =
    value && value.payload && value.payload && value.payload !== ""
      ? value.payload
      : false;
  const data =
    value && value.payload && value.payload.data && value.payload.data !== ""
      ? value.payload.data
      : false;
  // const _data = data && data.datas && data.datas !== "" ? data.datas : false;
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        datas: []
      }
    };
  }
  //列表数据
  const applyList = [];
  applyList.push({ key: -1, code: "all", name: "全部" });
  data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      code: value.code,
      name: value.name
    });
  });

  _value.data.menuDataSource = applyList;
  return _value.data;
};

//工具管理-检索-工具名称-自动完成
export const ToolsNameListData = value => {
  const _value =
    value && value.payload && value.payload && value.payload !== ""
      ? value.payload
      : value;
  const data =
    _value && _value.data && _value.data !== ""
      ? _value.data
      : false;
  const _data = data;
  /*const _data =
    data && data.results && data.results !== "" ? data.results : false;*/
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        results: []
      }
    };
  }
  //列表数据
  const applyList = [];

  _data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      code: value.code,
      name: value.toolName
    });
  });

  _value.toolsNameSource = applyList;
  return _value.data;
};
//应用中心-工具权限-已上架的工具类型
export const upperToolsTypeGroup = value => {
  const _value =value;
  const data =
    value && value.data && value.data !== ""
      ? value.data
      : false;

  const _data = data;
  /*const _data =
    data && data.results && data.results !== "" ? data.results : false;*/
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        results: []
      }
    };
  }
  //列表数据
  const applyList = [];
  _data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      code: value.code,
      name: value.name
    });
  });

  _value.toolsNameSource = applyList;

  return _value;
};

//工具管理-检索-工具名称-工具详情
export const ToolsDetailListData = value => {
  const _value =
    value && value.payload && value.payload && value.payload !== ""
      ? value.payload
      : false;
  const data =
    value && value.payload && value.payload.data && value.payload.data !== ""
      ? value.payload.data
      : false;
  const _data = data && data.params && data.params !== "" ? data.params : false;
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        params: []
      }
    };
  }else{
    if(_data&&_data.length>0){
      _data.map((item,key)=>{
        //类型为1输入文件且允许自主增减
        if(item.type==1&&item.dynamic==1){
          item.increase="true";
        }
      })
    }
  }
  return _value.data;
};

//工具管理-检索-工具名称-工具详情
export const ParamsExplainListData = value => {
  const _value =
    value && value.payload && value.payload && value.payload !== ""
      ? value.payload
      : false;

  const data =
    value && value.payload && value.payload.data && value.payload.data !== ""
      ? value.payload.data
      : false;
  /*  const _data = data && data.params && data.params !== "" ? data.params : false;*/
  //_data 用到下面进行map组装
  if (!data) {
    return {
      data: {
        params: []
      }
    };
  }
  /*//列表数据
  const applyList = [];

  _data.map((value, index) => {
    applyList.push({
      key: index,
      ...value,
      code: value.code,
      name: value.name,
    });
  });

  _value.data.toolsNameSource = applyList;*/

  return _value.data;
};


/**
 * 小工具自主增减
 * */
export const addToolDetailData = (data, target) => {
  if (!data || !target) {
    return false;
  }
  data.map((value) => {
    // 通过唯一标识判断克隆对象，并且准备在克隆对象上进行添加删除tmpArr
    if (value.paramCode === target.paramCode) {
      // 初次添加造数据
      if (!value.tmpArr) {
        value.tmpArr = [];
      }
      // 删除
      if(target.dislodge){
        value.tmpArr.map((item, index) => {
          // 遍历之后根据id 确定被删除对象位置进行删除
          if (item.clone_id === target.clone_id) {
            value.tmpArr.splice(index, 1);
            // 表示添加的对象全部删除，被克隆对象重新永远添加能力
            if (value.tmpArr == 0) {
              value.increase = true;
            }
          }
        });
        // 更新、判定加号位置
        update(value.tmpArr,true);
      }else{
        // 添加
        // 首先判断当前对象是否还能继续添加，设置属性为能否添加
        target.increase = increase(value);
        // 新添加的对象都能删除
        target.remove = true;// 是否可以删除
        delete target.dynamic;
        // 更新数据属性
        update(value.tmpArr);
        value.tmpArr.push(target);
        // 被克隆对象将不能继续添加，即不能继续显示加号
        value.increase = false;
      }

    }
  });
  return data;
};

/**
 * 数据，
 * 是否删除调用
 * */
function update(data, remove) {
  if (data) {
    data.map((item, index) => {
      if (remove) {
        // 删除调用，判定删除之后谁是最后一位，添加属性为true
        if (index === data.length - 1) {
          // 设置添加属性为true
          item.increase = true;
        }
      }else{
        // 添加调用，添加当前到页面的时候，被克隆对象的添加属性为false
        item.increase = false;
      }

    });
  }
}


// 判定是否能添加
function increase(parent) {
  if (parent.tmpArr) {
    // 如果被克隆对象包含tmpArr对象，并且长度没有超过最大限度，则表示可以添加
    if (parent.tmpArr.length < parent.maxNum - 1) {
      return true;
    }
  }
  return false;
}
