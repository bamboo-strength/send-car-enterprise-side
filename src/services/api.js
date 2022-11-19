import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';

export async function queryActivities() {
  return request('/api/shipper-desk/dashboard/activities');
}

export async function queryRule(params) {
  return request(`/api/rule?${stringify(params)}`);
}

export async function removeRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'delete',
    },
  });
}

export async function addRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'post',
    },
  });
}

export async function updateRule(params) {
  return request('/api/rule', {
    method: 'POST',
    body: {
      ...params,
      method: 'update',
    },
  });
}

export async function fakeSubmitForm(params) {
  return request('/api/forms', {
    method: 'POST',
    body: params,
  });
}

export async function fakeChartData() {
  return request('/api/fake_chart_data');
}

export async function queryTags() {
  return request('/api/tags');
}

export async function queryBasicProfile() {
  return request('/api/profile/basic');
}

export async function queryAdvancedProfile() {
  return request('/api/profile/advanced');
}

export async function queryFakeList(params) {
  return request(`/api/fake_list?${stringify(params)}`);
}

export async function removeFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'delete',
    },
  });
}

export async function addFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'post',
    },
  });
}

export async function updateFakeList(params) {
  const { count = 5, ...restParams } = params;
  return request(`/api/fake_list?count=${count}`, {
    method: 'POST',
    body: {
      ...restParams,
      method: 'update',
    },
  });
}

export async function fakeRegister(params) {
  return request('/api/register', {
    method: 'POST',
    body: params,
  });
}

export async function queryNotices() {
  return request('/api/base-alarm/alarmmsg/msglist');
}

export async function getFakeCaptcha(mobile) {
  return request(`/api/captcha?mobile=${mobile}`);
}

export async function queryProvince() {
  return request('/api/geographic/province');
}

export async function queryCity(province) {
  return request(`/api/geographic/city/${province}`);
}

export default async function queryError(code) {
  return request(`/api/${code}`);
}

export async function requestApi(path, params) {
  return request(path, {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function requestApiByJson(path, params) {
  return request(path, {
    method: 'POST',
    body: params,
  });
}

export async function requestPostHeader(path, params) {
  return request(path, {
    method: 'POST',
    body: params,
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
  });
}

export async function requestListApi(path, params) {
  return request(`${path}?${stringify(params)}`);
}

export async function dealNotices(id,type) {
  if (type === "notification") {
    return request(`/api/base-alarm/alarmmsg/dealMsgById?id=${id}`, {
      method: 'POST',
      body: {},
    });
  }
  return request(`/api/base-alarm/alarmprocess/dealProcessById?id=${id}`, {
    method: 'POST',
    body: {},
  });
}

export async function clearNotices(type) {
  if (type === "notification") {
    return  request(`/api/base-alarm/alarmmsg/clearAllMsg`);
  }
  return request(`/api/base-alarm/alarmprocess/clearAllProcess`);
}

/* export async function joinus(params) {
  return request('/api/shipper-user/client/register-user', {
    method: 'POST',
    body: params,
  });
} */

export async function joinus(params) {
 /* return request('/api/shipper-user/client/merDriver/register-user', {
    method: 'POST',
    body: params,
  }); */
  return request('/api/mer-user/client/merDriver/register-user', {
    method: 'POST',
    body: params,
  });
}

export async function jiGuang(params) {
   return request('/api/mer-message/jgrelation/save', {
     method: 'POST',
     body: func.toFormData(params),
   });
}
// 查询该用户入驻的租户
export async function getUserTypeAndTenantIdByAccount(params) {
  return request(`/api/mer-user/client/getUserTypeAndTenantIdByAccount?${stringify(params)}`);
}
// 获取租户详情
export async function tenantDetailByTenantId(params) {
  return request(`/api/shipper-system/client/tenantDetailByTenantId?${stringify(params)}`);
}
// 租户列表
export async function getTenantList(params) {
  return request(`/api/mer-user/client/get_tenant_list?${stringify(params)}`);
}
// 用户注销
export async function logoffUser(params) {
  return request(`/api/mer-user/client/logoffUser?${stringify(params)}`);
}
