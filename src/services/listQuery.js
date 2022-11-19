import { stringify } from 'qs';
import request from '../utils/request';


export async function list(params) {
  return request(`/api/mer-driver-vehicle/driver/page?${stringify(params)}`);
}

export async function listWithoutPage(params) {
  return request(`/api/mer-driver-vehicle/driver/list?${stringify(params)}`);
}
