import { stringify } from 'qs';
import request from '../../utils/request';
import func from '../../utils/Func';

// 渤海-董家口 签到功能
export async function signIn(params) {
  return request('/api/mer-yamei/mobileInterface/MobiledispatchcardAction/MobileOtherAction', {
    method: 'POST',
    body: func.toFormData(params),
  });
}

// 董家口-执单
export async function executeOrder(params) {
  return request(`/api/mer-yamei/mobileInterface/MobiledispatchcardAction/ExecuteOrder?${stringify(params)}`);
}

// 董家口-查询日期
export async function appointmentDate(params) {
  return request(`/api/mer-yamei/mobileInterface/MobiledispatchcardAction/appointmentDate?${stringify(params)}`);
}

// 董家口-获取时间段
export async function getAppointmentTime(params) {
  return request(`/api/mer-yamei/mobileInterface/MobiledispatchcardAction/appointmentTime?${stringify(params)}`);
}

// 重新预约
export async function againAppointment(params) {
  return request(`/api/mer-yamei/mobileInterface/MobiledispatchcardAction/againAppointment?${stringify(params)}`);
}
