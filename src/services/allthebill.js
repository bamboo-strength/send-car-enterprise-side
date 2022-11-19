import {stringify} from 'qs'
import request from "@/utils/request";
import func from '@/utils/Func';

export async function list(params) {
  return request(`/api/mer-wallet/walletbill/pageList?${stringify(params)}`)
}
export async function walletaccount() {
  return request(`/api/fre-yeepay-wallet/walletaccount/driverGet`)
}
export async function page(params) {
  return request(`/api/fre-yeepay-wallet/walletbill/driverList?${stringify(params)}`);
}
export async function detail(params) {
  return request(`/api/fre-yeepay-wallet/walletbill/detail?${stringify(params)}`)
}
