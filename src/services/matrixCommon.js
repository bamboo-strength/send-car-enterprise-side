import { stringify } from 'qs';
import request from '../utils/request';
import { getCurrentUser } from '../utils/authority';
import { clientId } from '../defaultSettings';


export async function autocomplete(params) {
  return  request(`/api/mer-tableextend/sortl/getSortl?${stringify(params)}`);
}




export async function getMaterialsByParam(params) {
  return  request(`/api/mer-tableextend/sortl/getSortl?${stringify(params)}`);
}


export function getTenantId (){
  let  shipperTenantId = getCurrentUser().tenantId
  if(clientId ==='kspt_shf' || clientId==='kspt_cyf'){
    shipperTenantId = localStorage.getItem('merchantsFhfTenantId')
  }
  return  shipperTenantId
}
