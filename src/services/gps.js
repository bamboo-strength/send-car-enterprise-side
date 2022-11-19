import request from '@/utils/request';
import { stringify } from 'qs';

export async function gpslocus(params) {
  return request(`/api/shippers-floworder/floworder/orderlocus?${stringify(params)}`);
}

export async function gpsstopcar(params) {
  return request(`/api/shippers-floworder/floworder/orderStopcar?${stringify(params)}`);
}
