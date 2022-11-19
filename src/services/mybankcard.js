import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function list(params) {
  // return request(`/freight/mer-wallet/walletbankcard/page?${stringify(params)}`);
  return request(`/api/fre-yeepay-wallet/bankcard/query?${stringify(params)}`);
}

export async function submit(params) {
  // return request('/freight/mer-wallet/walletbankcard/save', {
  return request('/api/fre-yeepay-wallet/bankcard/add', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function update(params) {
  return request('/freight/mer-wallet/walletbankcard/update', {
    method: 'POST',
    body: params,
  });
}
export async function detail(params) {
  return request(`/freight/mer-wallet/walletbankcard/detail?${stringify(params)}`);
}

export async function remove(params) {
  // return request('/freight/mer-wallet/walletbankcard/remove', {
  return request('/api/fre-yeepay-wallet/bankcard/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function changeisDefaut(params) {
  // return request('/freight/mer-wallet/walletbankcard/setDefaultCard', {
    return request('/api/fre-yeepay-wallet/bankcard/setDefaultCard', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function getCardBin(params) {
  return request('/api/fre-yeepay-wallet/bankcard/getCardBin', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function withdrawal(params) {
  return request('/api/fre-yeepay-wallet/withdrawal/driver', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
