import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function submit(params) {
  return request('/freight/fre-yeepay-wallet/openaccountapplication/driverOpenAccount', {
    method: 'POST',
    body: params,
  });
}
export async function detailForDriver() {
  return request(`/freight/fre-yeepay-wallet/openaccountapplication/detailForDriver`);
}

export async function getWalletStatus() {
  return request(`/freight/fre-yeepay-wallet/openaccountapplication/queryOpenStatus`)
}
