import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';


export async function list(params) {
  return request(`/api/mer-message/message/list?${stringify(params)}`);
}

export async function listWithoutPage(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/list?${stringify(params)}`);
}
export async function submit(params) {
  return request('/api/mer-dispatch/dispatchbill/save', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function update(params) {
  return request('/api/mer-dispatch/dispatchbill/update', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function remove(params) {
  return request('/api/mer-driver-vehicle/vehicleInformationMaintenance/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function detail(params) {
  return request(`/api/mer-dispatch/dispatchbill/detail?${stringify(params)}`);
}
export async function toaudit(params) {
  return request('/api/mer-dispatch/dispatchbill/submitAudit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

// 抢单
export async function grabVehi(params) {
  return request('/mer-dispatch/truckCargoMatch/orderGrabbing', {
    method: 'POST',
  /*  headers: {
      'Blade-DesignatedTenant': getTenantId(),
    }, */
    body: func.toFormData(params),
  });
}

export async function vehicleParking(params) {
  return request('/api/mer-driver-vehicle/vehicle/vehicleParking', {
    method: 'POST',
    body: params,
  });
}
