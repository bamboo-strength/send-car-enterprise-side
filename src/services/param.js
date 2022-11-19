import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================参数===========================

export async function list(params) {
  return request(`/api/shipper-system/param/list?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/shipper-system/param/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  return request('/api/shipper-system/param/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/shipper-system/param/detail?${stringify(params)}`);
}

export  function getSystemParamByParamKey(params) {
  return request(`/api/shipper-system/param/getSystemParamByParamKey?${stringify(params)}`);
}
export  function getParamSkipToken(params) {
  return request(`/api/shipper-system/client/param?${stringify(params)}`);
}
