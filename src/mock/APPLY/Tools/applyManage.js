import { dataCheck, nullData, timestampToTime } from "../../../utils/utils";
import { check } from "../../utils";
//数据统计/失败任务-列表数据展示
export const deployTestData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: dataCheck(value, "code"),
        code: dataCheck(value, "code"), //'工具版本编号',
        toolCode: dataCheck(value, "toolCode"), //'工具编号',
        toolName: dataCheck(value, "toolName"), //'任工具名称',
        toolTypeName: dataCheck(value, "toolTypeName"), //'工具类型',
        imageName: dataCheck(value, "imageName"), //'镜像名称',
        version: dataCheck(value, "version"), //'版本号',
        status: dataCheck(value, "status"), //'状态',
        remarks: dataCheck(value, "remarks"), //'备注',
        script: dataCheck(value, "script"), //'脚本名',
        deploySubmitUser: dataCheck(value, "deploySubmitUser"), //'提交人',
        deploySubmitTime: dataCheck(value, "deploySubmitTime"), //'提交时间',
        auditRejectReason: dataCheck(value, "auditRejectReason") //'提交人',
      });
    });

    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//应用管理-工具管理-列表数据展示
export const toolsManagerListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        sort: dataCheck(value, "sort"), //'工具排序',
        code: dataCheck(value, "code"), //'工具编号',
        name: dataCheck(value, "name"), //'工具名称',
        updateBy: dataCheck(value, "updateBy"), //'操作人',
        updateTime: dataCheck(value, "updateTime"), //'操作时间',
        operator: dataCheck(value, "operator"), //'操作人',
        typeName: dataCheck(value, "typeName"), //'类型名称',
        typeCode: dataCheck(value, "typeCode"), //'类型编号',
        status: dataCheck(value, "status"), //'状态',
        alias: dataCheck(value, "alias"), //'标识名',
        upTime: dataCheck(value, "upTime") //'首次上架时间,0代表未上架',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};
