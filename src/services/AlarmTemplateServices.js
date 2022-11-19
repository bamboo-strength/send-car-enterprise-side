import { stringify } from 'qs';
import request from '../utils/request';

export async function tree(params) {
  return request(`/api/base-alarm/alarmtemplate/tree?${stringify(params)}`);
}
