import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';
import { stringify } from 'qs';


export async function list(params) {
  return request(`/api/mer-message/merFeedback/page?${stringify(params)}`);
}

export async function submit(params) {
  return request('/api/mer-message/merFeedback/submit', {
    method: 'POST',
    body: params,
  });
}



export async function remove(params) {
  return request('/api/mer-driver-vehicle/driver/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
