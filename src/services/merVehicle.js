import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from "../pages/Merchants/commontable";


export async function list(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/page?${stringify(params)}`);
}


export async function listWithoutPage(params) {
  return request(`/api/mer-driver-vehicle/vehicleInformationMaintenance/list?${stringify(params)}`);
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
// 车辆认证
export async function submit(params) {
  return request('/api/mer-driver-vehicle/vehicleCertification/submit', {
    method: 'POST',
    body: params,
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
  return request('/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/settledShipper', {
    method: 'POST',
      headers: {
     'Blade-DesignatedTenant': getTenantId(),
   },
    body: func.toFormData(params),
  });
}

// 根据发货方租户号获取企业名称
export async function detailM(params) {
  return request(`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/queryshipper?${stringify(params)}`);
}

// 查询车辆关系表所有入驻车辆
export async function vehicleRelationList(params) {
  return request(`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/queryshippers?${stringify(params)}`);
}
