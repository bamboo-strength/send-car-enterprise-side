import { stringify } from 'qs';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/base-goods/goods/list?${stringify(params)}`)
}

export async function detail(params) {
  return request(`/api/base-goods/goods/detail?${stringify(params)}`)
}

export async function add(params) {
  return request(`/api/base-goods/goods/submit`,{
    method: 'POST',
    body: params,
  });
}
