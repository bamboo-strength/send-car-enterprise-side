import request from '../utils/request';
import { stringify } from 'qs';
import func from '@/utils/Func';
/* 向后台发送实时位置 */
export async function submitLocation (params) {
  return request(`/NetSign/gps-interface/trucksCoordinateInfo/submit`, {
    method: 'POST',
    body: func.toFormData(params),
  });
}
/* 注册设备 */
export async function trucksRegister (params) {
  return request(`/NetSign/gps-interface/trucksRegister/submit`, {
    method: 'POST',
    body: params,
  });
}
/* 查询是否开启手机定位 */
export async function getOpenGps (params) {
  return request(`/NetSign/gps-interface/gpsopenflag/details?${stringify(params)}`);
}
/* 添加是否开启定位记录 */
export async function gpsopenflag (params) {
  return request(`/NetSign/gps-interface/gpsopenflag/submit`, {
    method: 'POST',
    body: params,
  });
}
/* 添加是否开启定位记录 */
export async function openLocation (params) {
  return request(`/NetSign/gps-interface/gpsopenflag/submit`, {
    method: 'POST',
    body: params,
  });
}
/* 返回实时位置 */
export async function getNewData (params) {
  return request(`/NetSign/gps-interface/trucksCoordinateInfo/getNewData`, {
    method: 'POST',
    body: params,
  });
}

