import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import { getTenantId } from '@/pages/Merchants/commontable';

export async function list(params) {
  return request(`api/mer-basicdata/customer/list?${stringify(params)}`);
}

export async function ContractList(params) {
  return request('api/mer-shop/despatchvehicle/contractlist', {
    method: 'POST',
    body: params,
  });
}

export async function weightList(params) {
  return request('/api/mer-shop/despatchvehicle/contractlistAll', {
    method: 'POST',
    body: params,
  });
}

export async function saveOrder(params) {
  return request('/api/mer-shop/despatchvehicle/save', {
    method: 'POST',
    body: params,
  });
}


export async function submit(params) {
  return request('/api/mer-basicdata/customer/submit', {
    method: 'POST',
    body: params,
  });
}

export async function detail(params) {
  return request(`/api/mer-basicdata/customer/detail?${stringify(params)}`);
}
export async function remove(params) {
  return request('/api/mer-basicdata/customer/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('客户管理'),
      functionCode:encodeURI('客户管理删除')
    },
    body: func.toFormData(params),
  });
}

export async function RegistedInfo() {
  return request(`/api/mer-basicdata/customer/getCustomerRegistedInfo`);
}
