import request from '@/utils/request';
import { stringify } from 'qs';
import func from '@/utils/Func';


export function detail(params) {
  return request(`/api/shippers-floworder/floworder/detail?${stringify(params)}`)
}

export function flowOripicdetail(params) {
  return request(`/api/shippers-flowpic/flowOripic/detail?${stringify(params)}`)
}

export function flowGrosspicDetailService(params) {
  return request(`/api/shippers-flowpic/flowgrosspic/detail?${stringify(params)}`)
}

export function flowMonipicDetailService(params) {
  return request(`/api/shippers-flowpic/flowMonipic/detail?${stringify(params)}`)
}

export function flowTarepicDetailService(params) {
  return request(`/api/shippers-flowpic/flowTarepic/detail?${stringify(params)}`)
}

export function floworderFenceService(params) {
  return request(`/api/shippers-floworder/floworder/orderfence?${stringify(params)}`)
}

export function floworderControlService(params) {
  return request(`/api/shippers-floworder/floworder/orderControl?${stringify(params)}`)
}

export function floworderFinishService(params) {
  return request(`/api/shippers-floworder/floworder/orderFinish?${stringify(params)}`)
}

export function YctbOrQsService(params) {
  return request(`/api/shippers-flowpic/YctbOrQsPic/detailbyOrderId?${stringify(params)}`)
}

export function BeforeAuditService(params) {
  return request(`/api/shippers-flowtoaudit/beforeaudit/manualBeforeAudit`,{
    method: 'POST',
    body: func.toFormData(params),
  })
}
