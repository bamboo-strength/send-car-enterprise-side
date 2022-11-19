/**
 * 供应商请求数据
 */
import { stringify } from 'qs';
import request from '../utils/request';
import { clientId } from '../defaultSettings';
import func from '../utils/Func';

/**
 * 查询列表
 * @param params
 * @returns {Promise<void>}
 */
export async function list(params) {

  return request(`/api/mer-basicdata/userCarrierRelation/page?${stringify(params)}`);

/*  if(clientId === 'kspt_shf'){
    return request(`/api/mer-basicdata/userCarrierRelation/page?${stringify(params)}`);
  }else{
    return request(`/api/base-carrier/carrier/list?${stringify(params)}`);
  } */
}

/**
 * 删除
 * @param params
 * @returns {Promise<void>}
 */
export async function remove(params) {
  return request('/api/mer-basicdata/userCarrierRelation/remove', {
    method: 'POST',
    body: func.toFormData(params),
  });

 /* if(clientId === 'kspt_shf'){
    return request('/api/mer-basicdata/carrierCustomerRelation/remove', {
      method: 'POST',
      body: func.toFormData(params),
    });
  }
  return request(`/api/base-carrier/carrier/remove?${stringify(params)}`); */
}

/**
 * psot 形式提交数据
 * @param params
 * @returns {Promise<void>}
 */
export async function submit(params) {
  const option = {
    method: 'POST',
    body:params
  };
  return request(`/api/mer-basicdata/userCarrierRelation/submit`,option);
 // return request(`/api/base-carrier/carrier/submit`,option);
}




/**
 * 查看详细
 * @param params
 * @returns {Promise<void>}
 */
export async function detail(params) {

  return request(`/api/mer-basicdata/userCarrierRelation/detail?${stringify(params)}`);

 /* if(clientId === 'kspt_shf'){
    return request(`/api/mer-basicdata/carrierCustomerRelation/detail?${stringify(params)}`);
  }
  return request(`/api/base-carrier/carrier/detail?${stringify(params)}`); */
}

