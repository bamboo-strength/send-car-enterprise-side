import { stringify } from 'qs';
import request from '../utils/request';
import func from '../utils/Func';

export async function sign(params) {
  return request('/freight/fre-freight/contract/sign', {
    method: 'POST',
    body: func.toFormData(params),
  });
}
export async function center(params, timeout) {
  return request(`/NetSign/econtract-yunhetong/manager/registered`, {
    method: 'POST',
    body:  params,
  }, timeout);
}
export async function contract(params) {
  return request(`/NetSign/econtract-yunhetong/generate/createContract`, {
    method: 'POST',
    body:  params,
  });
}
export async function addSigner (params) {
  return request(`/NetSign/econtract-yunhetong/generate/addSigner`, {
    method: 'POST',
    body:  params,
  });
}
export async function signedContract (params) {
  return request(`/NetSign/econtract-yunhetong/generate/signedContract`, {
    method: 'POST',
    body:  params,
  });
}
export async function page(params) {
  return request(`/freight/fre-freight/contract/page?${stringify(params)}`)
}

export async function detail(params) {
  return request(`/api/mer-online-contract/onlinecontract/queryOnlineContractByBusinessId?${stringify(params)}`);
}

