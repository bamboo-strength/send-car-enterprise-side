import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/base-info/group/list?${stringify(params)}`)
}

export async function page(params) {
  return request(`/api/base-info/group/page?${stringify(params)}`)
}

export async function detail(params) {
  return request(`/api/base-info/group/detail?${stringify(params)}`)
}

export async function add(params) {
  return request(`/api/base-info/group/submit`,{
    method: 'POST',
    body: params,
  });
}

