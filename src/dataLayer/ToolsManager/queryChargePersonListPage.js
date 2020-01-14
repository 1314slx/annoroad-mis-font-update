//负责人下拉列表
import { checkOption, checkDashboard } from "../../mock/utils";
export const setChargePersonList = value => {
  const _data = checkOption(value);

  /* const data =
    value && value.data && value.data !== "" ? value.data.structure : false;*/
  const data = _data ? _data : false;

  if (!data) {
    return {
      data: {
        structure: []
      }
    };
  }
  //列表数据
  const channelList = [];
  data.map((value, index) => {
    channelList.push({
      key: index,
      ...value
    });
  });
  value.data.structure = channelList;
  return value.data;
};

//仪表盘
export const dashboardListData = value => {

  const _data = checkDashboard(value); //  console.log("&&&&",_data);     //返回structure里面的树结构

  const data = _data ? _data : false;


  if (!data) {
    return {
      data: {
        structure: []
      }
    };
  }

  return value.data;
};
