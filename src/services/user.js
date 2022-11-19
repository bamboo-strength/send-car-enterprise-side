import { stringify } from 'qs';
import { message } from 'antd';
import request from '../utils/request';
import func from '../utils/Func';
// =====================用户===========================

export async function accountLogin(params) {
  const data = func.toFormData(params);
  data.append('grant_type', 'password');
  data.append('scope', 'all');
  if(params.tenantId === 'login'){
    return request('/api/shipper-auth/oauth/token', {
      method: 'POST',
      body: data,
    });
  }
    return request('/api/shipper-auth/oauth/token', {
      headers: {
        'Tenant-Id': data.get('tenantId'),
      },
      method: 'POST',
      body: data,
    });
}

export async function tokenLogin(params) {
  const data = func.toFormData(params);
  const token = data.get('token');
  data.append('grant_type', 'password');
  data.append('scope', 'all');
  data.append("username","token");
  data.append("password","token");
  data.delete("token");
  return request('/api/shipper-auth/oauth/token', {
    headers: {
      'Tenant-Id': data.get('tenantId'),
      'Blade-Auth':token
    },
    method: 'POST',
    body: data,
  });
}

export async function query() {
  return request('/api/users');
}

export async function queryCurrent() {
  return request('/api/currentUser');
}

export async function list(params) {
  return request(`/api/shipper-user/list?${stringify(params)}`);
}

export async function grant(params) {
  return request('/api/shipper-user/grant', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function resetPassword(params) {
  return request('/api/shipper-user/reset-password', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function remove(params) {
  return request('/api/shipper-user/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/shipper-user/submit', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/api/shipper-user/update', {
    method: 'POST',
    body: params,
  });
}

export async function updatepassword(params) {
  return request('/api/shipper-user/update-password', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function detail(params) {
  return request(`/api/shipper-user/detail?${stringify(params)}`);
}

export async function tree(params) {
  return request(`/api/shipper-user/tree?${stringify(params)}`);
}

