import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';

export async function list(params) {
  return request(`/api/shippers-truckdevice/truckdevice/page?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/shippers-truckdevice/truckdevice/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/shippers-truckdevice/truckdevice/detail?${stringify(params)}`);
}

export function relationdetail(params) {
  return request(`/api/shippers-truckdevice/truckdevice/relationdetail?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/shippers-truckdevice/truckdevice/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
