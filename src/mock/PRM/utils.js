import { dataCheck } from "../../utils/utils";

//显示风控负责人
export function showRisk(data) {
  let risk = [];

  if (data) {
    data.map(value => {
      risk.push(value.name);
    });
  }

  return risk.join(",");
}

//企业/集团列表查询
export const getList = (data, flag) => {
  const _data = check(data);

  let _list = [];
  if (_data) {
    _data.map(value => {
      if (flag && flag === "multiple") {
        _list.push({
          key: value.name,
          value: value.name,
          index: value.no
        });
      } else {
        _list.push({
          key: value.no,
          value: value.name
        });
      }
    });
  }

  return _list;
};

//判断接口数据是否正常
export function check(data) {
  const _body = dataCheck(data, "body");
  const _data = _body ? dataCheck(_body, "datas") : false;
  if (_data) {
    return _data;
  }
  return false;
}
