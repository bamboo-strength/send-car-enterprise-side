import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';


export async function list(params) {
  return request(`/api/mer-dispatch/dispatchbill/page?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-dispatch/dispatchbill/save', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function update(params) {
  return request('/api/mer-dispatch/dispatchbill/update', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function remove(params) {
  return request('/api/mer-dispatch/dispatchbill/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`/api/mer-dispatch/dispatchbill/detail?${stringify(params)}`);
}
export async function toaudit(params) {
  return request('/api/mer-dispatch/dispatchbill/submitAudit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

export async function freeze(params) {
  return request('/api/mer-dispatch/dispatchbill/freeze', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
