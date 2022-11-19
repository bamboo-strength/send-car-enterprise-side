import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/page?${stringify(params)}`);
}
export async function detail(params) {
  return request(`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/detail?${stringify(params)}`);
}
// 根据发货方租户号获取企业名称
export async function relationTelentList(params) {
  return request(`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/relationTelentList?${stringify(params)}`);
}

export async function disagree(params) {
  return request('/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/audit-vehicle', {
    method: 'POST',
    body: params,
  });
}

export async function add(params) {
  return request('/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/add-vehicle-relation', {
    method: 'POST',
    body: params,
  });
}

export async function remove(params) {
  return request('/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('审核车辆'),
      functionCode:encodeURI('审核车辆删除')
    },
    body: func.toFormData(params),
  });
}
