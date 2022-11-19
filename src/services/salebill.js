import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';
import {getTenantId} from '../pages/Merchants/commontable'

export async function list(params) {
  return request(`/api/mer-salebill/salebill/page?${stringify(params)}`);
}
export async function appointcarrier(params) {
  return request('/api/mer-dispatch/shipbill/entrust', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}

export async function detail(params) {
  return request(`/api/mer-salebill/salebill/detail?${stringify(params)}`);
}
export async function getOne(params) {
  return request(`/api/fre-freight/DeptAddressClient/getOne?${stringify(params)}`)
}

export async function remove(params) {
  return request('/api/mer-salebill/salebill/remove', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
      menuCode:encodeURI('订单'),
      functionCode:encodeURI('订单删除')
    },
    body: func.toFormData(params),
  });
}

export async function releaseSource(params) {
  return request('/api/mer-waybill/waybillManage/publish', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}

export async function submit(params) {
  return request('/api/mer-salebill/salebill/submit', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: params,
  });
}
export async function publishedSources(params) {
  return request('/api/mer-salebill/salebill/publishedSources', {
    method: 'POST',
    headers: {
      'Blade-DesignatedTenant': getTenantId(),
    },
    body: func.toFormData(params),
  });
}
export async function page(params) {
  return request(`api/mer-salebill/salebill/getSourceGoods?${stringify(params)}`);
}
