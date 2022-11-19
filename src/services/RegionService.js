import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

// =====================机构===========================

export async function list(params) {
  return request(`/api/shippers-region/region/list?${stringify(params)}`);
}

export async function rTree(params) {
  return request(`/api/shippers-region/region/tree?${stringify(params)}`);
}

export async function rTreeAsyn(params) {
  return request(`/api/shippers-region/region/treeAsyn?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/shippers-region/region/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function submit(params) {
  console.log('----region--submit')
  console.log(params)
  return request('/api/shippers-region/region/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  console.log('---RegionServices---')
  console.log(params)
  return request(`/api/shippers-region/region/detail?${stringify(params)}`);
}
