import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function submit(params) {
  return request('/freight/fre-yeepay-wallet/chiefdriver/submit', {
    method: 'POST',
    body: params,
  });
}
export async function detail() {
  return request(`/freight/fre-yeepay-wallet/chiefdriver/query`);
}

export async function remove(params) {
  return request('/freight/fre-yeepay-wallet/chiefdriver/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function getAuditStatus() {
  return request(`/freight/fre-yeepay-wallet/chiefdriver/getAuditStatus`)
}
export async function getCarleader(params) {
  return request(`/api/mer-driver-vehicle/driverClient/get-by-driverPhone?${stringify(params)}`)
}
