import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function submit(params) {
  return request('/api/fre-yeepay-wallet/paymentPasswordController/setPaymentPassword', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function reset(params) {
  return request('/api/fre-yeepay-wallet/paymentPasswordController/resetPaymentPassword', {
    method: 'POST',
    body: params,
  });
}
export async function login(params) {
  return request('/api/fre-yeepay-wallet/paymentPasswordController/login', {
    method: 'POST',
    body: params,
  });
}
export async function getPasswordSetstatus() {
  return request(`/api/fre-yeepay-wallet/paymentPasswordController/queryStatus`)
}
