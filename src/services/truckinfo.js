import { stringify } from 'qs';
import func from '../utils/Func';
import request from '../utils/request';
import {getTenantId} from '@/pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/vehiclePage?${stringify(params)}`);
}

export async function truckList(params) {
  return request(`/api/shippers-trucks/truckinfo/truckList?${stringify(params)}`);
}


export async function submit(params) {
  return request('/api/shippers-trucks/truckinfo/submit', {
    method: 'POST',
    body: params,
  });
}



export async function detail(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/detail?${stringify(params)}`);
}
export async function detailM(params) {
  return request(`/api/shippers-trucks/truckinfo/detailM?${stringify(params)}`);
}

export async function remove(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/vehicleRemove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('车辆管理'),
      functionCode:encodeURI('车辆管理删除')
    },
    body: func.toFormData(params),
  });
}

export async function gettruckbytentaldeviceno(params) {
  return request('/api/shippers-trucks/client/gettruckbytentaldeviceno', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

export async function getAudit(params) {
  return request('/api/shippers-trucks/truckinfo/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
