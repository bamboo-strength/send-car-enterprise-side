import { delay } from 'roadhog-api-doc';

function getFakeList(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  const list = [];
  list.push(
    {
      id: '1',
      tenantId: '000000',
      account: 'admin',
      name: '超级管理员',
      realName: '管理员',
      phone: '13888888888',
      email: 'admin@springshipper.org',
      roleName: '超级管理员',
      deptName: '刀锋科技',
      statusName: '启用',
    },
    {
      id: '2',
      tenantId: '000001',
      account: 'user',
      name: '系统用户',
      realName: '用户',
      phone: '13666666666',
      email: 'user@springshipper.org',
      roleName: '用户',
      deptName: '刀锋科技',
      statusName: '启用',
    }
  );
  json.data = {
    total: 10,
    size: 10,
    current: 1,
    searchCount: true,
    pages: 1,
    records: list,
  };
  return res.json(json);
}

function getFakeDetail(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  json.data = {
    id: '1',
    tenantId: '000000',
    account: 'admin',
    name: '超级管理员',
    realName: '管理员',
    phone: '13888888888',
    email: 'admin@springshipper.org',
    roleId: 1,
    roleName: '超级管理员',
    deptId: 1,
    deptName: '刀锋科技',
    sex: 1,
    sexName: '男',
    birthday: '2018-12-31 23:33:33',
    statusName: '启用',
  };
  return res.json(json);
}

function fakeSuccess(req, res) {
  const json = { code: 200, success: true, msg: '操作成功' };
  return res.json(json);
}

// 代码中会兼容本地 service mock 以及部署站点的静态数据
const proxy = {
  'GET /api/shipper-user/list': getFakeList,
  'GET /api/shipper-user/detail': getFakeDetail,
  'POST /api/shipper-user/grant': fakeSuccess,
  'POST /api/shipper-user/reset-password': fakeSuccess,
  'POST /api/shipper-user/submit': fakeSuccess,
  'POST /api/shipper-user/update': fakeSuccess,
  'POST /api/shipper-user/remove': fakeSuccess,

  // 支持值为 Object 和 Array
  'GET /api/currentUser': {
    name: 'Serati Ma',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    signature: '海纳百川，有容乃大',
    title: '交互专家',
    group: '蚂蚁金服－某某某事业群－某某平台部－某某技术部－UED',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 11,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  },
  // GET POST 可省略
  'GET /api/users': [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ],
  'POST /api/shipper-auth/oauth/token': (req, res) => {
    res.send({
      access_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiLnrqHnkIblkZgiLCJhdmF0YXIiOiJodHRwczovL2d3LmFsaXBheW9iamVjdHMuY29tL3pvcy9ybXNwb3J0YWwvQmlhemZhbnhtYW1OUm94eFZ4a2EucG5nIiwiYXV0aG9yaXRpZXMiOlsiYWRtaW5pc3RyYXRvciJdLCJjbGllbnRfaWQiOiJibGFkZSIsInJvbGVfbmFtZSI6ImFkbWluaXN0cmF0b3IiLCJsaWNlbnNlIjoicG93ZXJlZCBieSBibGFkZXgiLCJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoiMSIsInNjb3BlIjpbImFsbCJdLCJleHAiOjE1NTMyNDQ4MDMsImp0aSI6Ijg3NTBkZTg1LTBiNmItNGUwYS1hZDg3LWMwZTcwZDg1N2RkYyIsImFjY291bnQiOiJhZG1pbiIsInRlbmFudF9jb2RlIjoiMDAwMDAwIn0.9zjvzJuQItdycmxCQ2XNCebfkkHC3zze2t4uwG4Kys8',
      token_type: 'bearer',
      refresh_token:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyX25hbWUiOiLnrqHnkIblkZgiLCJhdmF0YXIiOiJodHRwczovL2d3LmFsaXBheW9iamVjdHMuY29tL3pvcy9ybXNwb3J0YWwvQmlhemZhbnhtYW1OUm94eFZ4a2EucG5nIiwiYXV0aG9yaXRpZXMiOlsiYWRtaW5pc3RyYXRvciJdLCJjbGllbnRfaWQiOiJibGFkZSIsInJvbGVfbmFtZSI6ImFkbWluaXN0cmF0b3IiLCJsaWNlbnNlIjoicG93ZXJlZCBieSBibGFkZXgiLCJ1c2VyX2lkIjoxLCJyb2xlX2lkIjoiMSIsInNjb3BlIjpbImFsbCJdLCJhdGkiOiI4NzUwZGU4NS0wYjZiLTRlMGEtYWQ4Ny1jMGU3MGQ4NTdkZGMiLCJleHAiOjE1NTQ1MzM2MDMsImp0aSI6IjBkYjBmMTRkLTlhMTgtNGFlOC1hZTE4LTJkNzAyYzY5NWRmZiIsImFjY291bnQiOiJhZG1pbiIsInRlbmFudF9jb2RlIjoiMDAwMDAwIn0.DaocFShM9iGjU05GUrtNKE6JKAeAJTKpdGPrC1bIi4w',
      expires_in: 7199,
      scope: 'all',
      role_name: 'administrator',
      license: 'powered by shipperx',
      user_id: 1,
      role_id: '1',
      user_name: '管理员',
      avatar: 'https://gw.alipayobjects.com/zos/rmsportal/BiazfanxmamNRoxxVxka.png',
      account: 'admin',
      tenant_id: '000000',
      jti: '8750de85-0b6b-4e0a-ad87-c0e70d857ddc',
    });
  },
  'POST /api/register': (req, res) => {
    res.send({ status: 'ok', currentAuthority: 'user' });
  },
  'GET /api/500': (req, res) => {
    res.status(500).send({
      timestamp: 1513932555104,
      status: 500,
      error: 'error',
      message: 'error',
      path: '/base/category/list',
    });
  },
  'GET /api/404': (req, res) => {
    res.status(404).send({
      timestamp: 1513932643431,
      status: 404,
      error: 'Not Found',
      message: 'No message available',
      path: '/base/category/list/2121212',
    });
  },
  'GET /api/403': (req, res) => {
    res.status(403).send({
      timestamp: 1513932555104,
      status: 403,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
  'GET /api/401': (req, res) => {
    res.status(401).send({
      timestamp: 1513932555104,
      status: 401,
      error: 'Unauthorized',
      message: 'Unauthorized',
      path: '/base/category/list',
    });
  },
};
export default delay(proxy, 500);
