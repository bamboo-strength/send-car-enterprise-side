import { stringify } from 'qs';
import request from '../utils/request';


export async function list(params) {
  return request(`/api/mer-waybill/waybillManage/page?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-waybill/waybillManage/update', {
    method: 'POST',
    body: params,
  });
}

export async function update(params) {
  return request('/api/mer-waybill/waybillManage/update', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/api/mer-waybill/waybillManage/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-waybill/waybillManage/remove', {
    method: 'POST',
    body: params,
  });
}
// 常跑货源
export async function runOftenGoodsPage(params) {
  return request(`/api//mer-waybill/waybillManage/runOftenGoodsPage?${stringify(params)}`);
}
