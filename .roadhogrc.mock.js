import mockjs from 'mockjs';

import {delay} from 'roadhog-api-doc';
/*  mis端 仪表盘dashboard-工具使用次数*/
//import { getFakeChartData } from 'mock/chart';
// 是否禁用代理
const noProxy = process.env.NO_PROXY === 'true';

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    $desc: "获取当前用户接口",
    $params: {
      pageSize: {
        desc: '分页',
        exp: 2,
      },
    },
    $body: {
      name: 'Serati Ma',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      userid: '00000001',
      notifyCount: 12,
    },
  },
  'POST /api/login/account': (req, res) => {
    const {password, user_name, type} = req.body;
    if (password === '888888' && user_name === 'admin') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'admin'
      });
      return;
    }
    if (password === '123456' && user_name === 'user') {
      res.send({
        status: 'ok',
        type,
        currentAuthority: 'user'
      });
      return;
    }
    res.send({
      status: 'error',
      type,
      currentAuthority: 'guest'
    });
  },
  'POST /api/register': (req, res) => {
    res.send({status: 'ok', currentAuthority: 'user'});
  },
  'POST /boss/mdlapi/boss/user/query': (req, res) => {
    res.send({
      "body": {
        "datas": [
          {
            "department_list": [
              "产品研发中心",
              "test"
            ],
            "email": "pengl@mondora.cn",
            "id": 1111,
            "mobile": "13464912123",
            "name": "李鹏",
            "position": "产品经理",
            "role_list": [
              {
                "code": "ADMIN",
                "descr": "这个是角色1",
                "name": "管理员",
                "platform": 1
              },
              {
                "code": "MERCHANT_ADMIN",
                "descr": "这个是角色1",
                "name": "商户管理员",
                "platform": 2
              }
            ],
            "status": 1
          },
          {
            "department_list": [
              "产品研发中心",
              "test"
            ],
            "email": "pengl@mondora.cn",
            "id": 1111,
            "mobile": "13464912123",
            "name": "李鹏",
            "position": "产品经理",
            "role_list": [
              {
                "code": "ADMIN",
                "descr": "这个是角色1",
                "name": "管理员",
                "platform": 1
              },
            ],
            "status": 2
          }
        ],
        "page_no": 1,
        "page_size": 5,
        "page_total": 4,
        "total": 17
      },
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/account/open': (req, res) => {
    
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  'POST /boss/mdlapi/boss/account/close': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  'POST /boss/mdlapi/boss/online/query': (req, res) => {
    res.send({
      "body": {
        "datas": [
          {
            "department_list": [
              "产品研发中心",
              "test"
            ],
            "email": "pengl@mondora.cn",
            "id": 1111,
            "mobile": "13464912123",
            "name": "李鹏",
            "position": "产品经理",
            "role_list": [
              {
                "code": "MERCHANT_INFO_ADMIN",
                "descr": "这个是角色1",
                "name": "角色1"
              },
              {
                "code": "MERCHANT_INFO_ADMIN",
                "descr": "这个是角色1",
                "name": "角色1"
              }
            ],
            "status": 1
          },
          {
            "department_list": [
              "产品研发中心",
              "test"
            ],
            "email": "pengl@mondora.cn",
            "id": 1111,
            "mobile": "13464912123",
            "name": "李鹏",
            "position": "产品经理",
            "role_list": [
              {
                "code": "MERCHANT_INFO_ADMIN",
                "descr": "这个是角色1",
                "name": "角色1"
              },
              {
                "code": "MERCHANT_INFO_ADMIN",
                "descr": "这个是角色1",
                "name": "角色1"
              }
            ],
            "status": 1
          }
        ],
        "page_no": 1,
        "page_size": 5,
        "page_total": 4,
        "total": 17
      },
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/query/logout': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  'POST /boss/mdlapi/boss/platform/login/close': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  'POST /boss/mdlapi/boss/platform/login/open': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  'POST /boss/mdlapi/boss/role/query': (req, res) => {
    res.send({
      "code": "0000",
      "body": {
        "total": 11,
        "page_total": 2,
        "page_no": 1,
        "datas": [
          {
            "descr": "管理员",
            "code": "ADMIN",
            "user_count": "1",
            "name": "管理员"
          },
          {
            "descr": "商户管理员",
            "code": "MERCHANT_ADMIN",
            "user_count": "9",
            "name": "商户管理员"
          },
          {
            "descr": "商户操作员",
            "code": "MERCHANT_OPERATOR",
            "user_count": "0",
            "name": "商户操作员"
          },
          {
            "descr": "打酱油的",
            "code": "MERCHANT_OPERATOR_D",
            "user_count": "0",
            "name": "打酱油的"
          }
        ],
        "page_size": 10
      },
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/role/delete': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/user/pwd/save': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/user/role/save': (req, res) => {
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/department/list': (req, res) => {
    const {parent_id} = req.body;
    if (parent_id === 0) {
      res.send({
        "body": {
          "datas": [
            {
              "description": "北京梦哆啦网络科技有限公司",
              "id": 11112,
              "name": "北京梦哆啦网络科技有限公司",
              "parent_id": 4,
              "leaf": 1,//叶子节点
            },
          ]
        },
        "code": "0000",
        "desc": "成功"
      })
    } else if (parent_id === 4) {
      res.send({
        "body": {
          "datas": [
            {
              "description": "产品研发中心",
              "id": 111121,
              "name": "产品研发中心",
              "parent_id": 5,
              "leaf": 1,//叶子节点
            },
            {
              "description": "产品研发中心",
              "id": 111122,
              "name": "产品研发中心",
              "parent_id": 6,
              "leaf": 2,//非叶子节点
            }
          ]
        },
        "code": "0000",
        "desc": "成功"
      })
    } else if (parent_id === 5) {
      res.send({
        "body": {
          "datas": [
            {
              "description": "嘻嘻哈哈",
              "id": 1111211,
              "name": "哈哈嘻嘻",
              "parent_id": 5,
              "leaf": 2,//叶子节点
            },
            {
              "description": "哈哈嘻嘻",
              "id": 1111222,
              "name": "哈哈嘻嘻",
              "parent_id": 6,
              "leaf": 2,//非叶子节点
            }
          ]
        },
        "code": "0000",
        "desc": "成功"
      })
    }
  },
  
  'POST /boss/mdlapi/boss/platform/module/list': (req, res) => {
    const {platform} = req.body;
    if (platform === 1) {
      res.send({
        "code": "0000",
        "body": {
          "datas": [
            {
              "code": "BOSS_ROLE",
              "name": "用户权限管理",
              "platform": 3,
            },
            {
              "code": "BOSS_ROLE_USER",
              "name": "用户管理",
              "platform": 3,
            },
            {
              "code": "BOSS_ROLE_USER_U",
              "name": "用户管理2",
              "platform": 3,
            },
            {
              "code": "BOSS_ROLE_ROLE",
              "name": "用户管理1",
              "platform": 3,
            },
            {
              "code": "BOSS_ROLE_ROLE_SDD",
              "name": "用户管理2",
              "platform": 3,
            },
            {
              "code": "BOSS_ROLE_ROLE_SDD_D",
              "name": "用户管理3",
              "platform": 3,
            },
            {
              "code": "BOSS_MESSAGE",
              "name": "消息管理",
              "platform": 3,
            },
            {
              "code": "BOSS_MESSAGE_SMS",
              "name": "短信管理",
              "platform": 3,
            },
            {
              "code": "PRM_MESSAGE",
              "name": "消息管理",
              "platform": 4,
            },
          ]
        },
        "desc": "成功"
      })
      
    }
    
  },
  
  'POST /boss/mdlapi/boss/role/save': (req, res) => {
    
    res.send({
      "body": {},
      "code": "0000",
      "desc": "成功"
    })
  },
  
  'POST /boss/mdlapi/boss/role/module/query': (req, res) => {
    res.send({
      "code": "0000",
      "body": {
        "datas": [
          {
            "code": "BOSS_ROLE",
            "name": "角色管理",
            "platform": 3,
            "resource_uri ": "/boss/role"
          },
          {
            "code": "BOSS_ROLE_USER",
            "name": "用户管理",
            "platform": 3,
            "resource_uri ": "/boss/role"
          }
        ]
      },
      "desc": "成功"
    })
  }
  //'GET /api/fake_chart_data': getFakeChartData
  //test
  
};

export default noProxy ? {} : delay(proxy, 1000);
