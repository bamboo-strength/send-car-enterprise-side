import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';

/* 默认发货方  */
export async function getRelationTenant(params) {
  return request(`/api/mer-driver-vehicle/driverUserRelationTenant/getRelationTenant?${stringify(params)}`);
}


/*  查询所有发货方  */
export async function list(params) {
  return request(`/api/mer-driver-vehicle/driverUserRelationTenant/getTenantList?${stringify(params)}`);
}

/*  确认新的发货方  */
export async function ConfirmShipper(params) {
  return request('/api/mer-driver-vehicle/driverUserRelationTenant/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

