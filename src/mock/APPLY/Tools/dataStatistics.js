import {
  dataCheck,
  dataCheckStatus,
  nullData,
  timestampToTime
} from "../../../utils/utils";
import { check, checkDashboard, checkParams, checkToolType, check_data } from "../../utils";
//数据统计/工具统计-列表数据展示
export const toolsStatisticsData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        toolCode: dataCheck(value, "toolCode"), //'用户名称',
        toolName: dataCheck(value, "toolName"), //'用户名称',
        typeCode: dataCheck(value, "typeCode"), //'工具类型',
        typeName: dataCheck(value, "typeName"), //'工具类型',
        startTime: dataCheck(value, "startTime"), //'首次上架时间',
        userCount: dataCheck(value, "userCount") //'使用次数',
      });
    });

    data.data.dataSource = _groupData;
  }

  return _data ? data.data : nullData();
};

//数据统计/失败任务-列表数据展示
export const failTaskData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        id: dataCheck(value, "id"), //'任务名称',
        name: dataCheck(value, "name"), //'任务名称',
        startTime: dataCheck(value, "createTime",1), //'提交时间',
        endTime: dataCheck(value, "endTime",1), //'结束时间',
        status: dataCheck(value, "status") //'状态',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//失败任务详情数据展示
export const failTaskDetailData = data => {
  const _data = checkParams(data);
  let _groupData = [];
  return _data ? data.data : nullData();
};

//mis端获取所有工具名称->自动完成
export const myToolsNameListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'工具名称编号',
        name: dataCheck(value, value.name?"name":"toolName") //'工具名称',
      });
    });
    data.data.dataSourceTool = _groupData;
  }
  return _data ? data.data : nullData();
};

//mis端获取所有审核测试
export const examineListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'工具版本编号',
        toolName: dataCheck(value, "toolName"), //'工具名称',
        toolTypeName: dataCheck(value, "toolTypeName"), //'工具类型名称',
        version: dataCheck(value, "version"), //'版本号',
        status: dataCheck(value, "status"), //'审核状态',
        statusWord: dataCheckStatus(value, "status"), //'审核状态',
        // imageName: dataCheck(value, 'imageName'),//'镜像名称，暂时不需要',
        auditSubmitUser: dataCheck(value, "auditSubmitUser"), //'提交审核人',
        auditSubmitTime: dataCheck(value, "auditSubmitTime") //'提交审核时间',
      });
    });
    data.data.dataSourceExamine = _groupData;
  }
  return _data ? data.data : nullData();
};
//mis端应用中心-工具权限-数据整理
export const authorityListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'工具版本编号',
        toolName: dataCheck(value, "toolName"), //'工具名称',
        toolTypeName: dataCheck(value, "toolTypeName"), //'工具类型名称',
        version: dataCheck(value, "version"), //'版本号',
        status: dataCheck(value, "status"), //'审核状态',
        statusWord: dataCheckStatus(value, "status"), //'审核状态',
        // imageName: dataCheck(value, 'imageName'),//'镜像名称，暂时不需要',
        operatorByName: dataCheck(value, "operatorByName"), //'提交审核人',
        operatorTime: dataCheck(value, "operatorTime"), //'提交审核时间',
        overtStatus: dataCheck(value, "overtStatus") //'提交审核时间',
      });
    });
    data.data.dataSourceExamine = _groupData;
  }
  return _data ? data.data : nullData();
};

//帮助中心-问题反馈-列表数据展示
export const issueBackListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        id: dataCheck(value, "id"), //'用户ID',
        userId: dataCheck(value, "userId"), //'用户ID',
        mobile: dataCheck(value, "mobile"), //'手机号',
        submitTime: dataCheck(value, "submitTime"), //'提交时间',
        status: dataCheck(value, "status"), //'状态',
        operatorName: dataCheck(value, "operatorName"), //'状态',
        operateTime: dataCheck(value, "operateTime"), //'操作时间',
        content: dataCheck(value, "content") //'反馈内容',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//仪表盘数据
export const dashboardListData = data => {
  const _data = checkDashboard(data);
  return _data ? data.data : nullData();
};

//应用管理-工具类型-列表数据展示
export const toolsTypeListData = data => {
  const _data = checkToolType(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'类型编号',
        name: dataCheck(value, "name"), //'工具名称',
        updateBy: dataCheck(value, "updateBy"), //'操作人',
        count: dataCheck(value, "count"), //'工具数量',
        updateTime: dataCheck(value, "updateTime"), //'操作时间',
        sort: dataCheck(value, "sort") //'工具类型-排序',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//应用管理-工具类型-列表数据展示
export const myToolsListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'工具版本编号',
        toolCode: dataCheck(value, "toolCode"), //'工具编号',
        toolName: dataCheck(value, "toolName"), //'工具名称',
        toolTypeName: dataCheck(value, "toolTypeName"), //'工具类型名称',
        version: dataCheck(value, "version"), //'版本号',
        status: dataCheck(value, "status"), //'工具状态',
        statusWord: dataCheckStatus(value, "status"), //'审核状态',
        operateUser: dataCheck(value, "operateUser"), //'操作人',
        // operateTime: timestampToTime(value, "operateTime"), //'操作时间',
        operateTime: dataCheck(value, "operateTime"), //'操作时间',
        deployRejectReason: dataCheck(value, "deployRejectReason"), //'部署驳回原因',
        auditRejectReason: dataCheck(value, "auditRejectReason"), //'审核驳回原因',
        upgrade: dataCheck(value, "upgrade") //'是否可升级，1：可升级，2：不可升级',
      });
    });
    data.data.toolDataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

// 视频管理-视频类型-列表数据展示
export const videoTypeListData = data => {
  const _data = check_data(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'视频编号',
        name: dataCheck(value, "name"), //'视频类型名称',
        updateByName: dataCheck(value, "updateByName"), //'操作人',
        count: dataCheck(value, "count"), //'视频数',
        updateTime: dataCheck(value, "updateTime"), //'操作时间',
        sort: dataCheck(value, "sort") //'视频类型排序号',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

// 视频主题列表-白名单授权-白名单列表
export const getWhiteListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'白名单主键ID',
        name: dataCheck(value, "name"), //'白名单-姓名',
        mobile: dataCheck(value, "mobile"), //'白名单-手机号',
        units: dataCheck(value, "units"), //'白名单-单位',
      });
    });
    data.data.dataSource = _groupData;
  }
  return _data ? data.data : nullData();
};

//视频管理-视频主题-列表数据展示
export const videoThemeListData = data => {
  const _data = check(data);
  let _groupData = [];
  if (_data) {
    _data.map((value, index) => {
      _groupData.push({
        key: index,
        code: dataCheck(value, "code"), //'视频主题code',
        count: dataCheck(value, "count"), //'自视频数',
        name: dataCheck(value, "name"), //'视频主题名称',
        privacy: dataCheck(value, "privacy"), //'隐私状态',
        sort: dataCheck(value, "sort"), //'排序',
        status: dataCheck(value, "status"), //'视频主题状态',
        typeName: dataCheckStatus(value, "typeName"), //'视频类型 ',
        updateByName: dataCheck(value, "updateByName"), //'操作人',
        upTime: dataCheck(value, "upTime"), //'上架时间',
      });
    });
    data.data.themeList = _groupData;
  }
  return _data ? data.data : nullData();
};
