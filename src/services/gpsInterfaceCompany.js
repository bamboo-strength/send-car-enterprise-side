import { stringify } from 'qs';
import request from '../utils/request';

// =====================机构===========================
// eslint-disable-next-line import/prefer-default-export
export async function list(params) {
  return request(`/api/saas-report/gpsInterfaceCompany/list?${stringify(params)}`);
}



