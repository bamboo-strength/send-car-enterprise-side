import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '../pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-dispatch/dispatchPlan/page?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-dispatch/dispatchPlan/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function submitByOrder(params) {
  return request('/api/mer-dispatch/dispatchPlan/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/mer-dispatch/dispatchPlan/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-dispatch/dispatchPlan/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('派车计划'),
      functionCode:encodeURI('派车计划删除')
    },
    body: func.toFormData(params),
  });
}
export async function freeze(params) {
  return request('/api/mer-dispatch/dispatchPlan/freeze', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function changeMount(params) {
  return request('/api/mer-dispatch/dispatchPlan/addNum', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function toaudit(params) {
  return request('/api/mer-dispatch/dispatchPlan/submitAudit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function entrust(params) {
  return request('/api/mer-dispatch/shipbill/entrust', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

export async function submitAuditAddMun(params) {
  return request('/api/mer-dispatch/dispatchPlan/submitAuditAddMun', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}


export async function updateAuditflag(params) {
  return request('/api/mer-dispatch/dispatchPlan/updateAuditflag', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
