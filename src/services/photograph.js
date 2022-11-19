import { stringify } from 'qs';
import request from '../utils/request';
import func from '@/utils/Func';

export async function checkpic(params) {
    return request(`/api/other-weixin/weixin/saaspzyz/appCheckPic?${stringify(params)}`)
  }
  
  export async function getPhotoList(params) {
    return request(`/api/other-weixin/weixin/saaspzyz/getAppPhotoList?${stringify(params)}`)
  }
  export async function returnPic(params) {
    return request(`/api/other-weixin/weixin/uppic/returnPic?${stringify(params)}`)
  }
  export async function picupload(params) {
    return request(`/api/other-weixin/weixin/uppic/picupload`,{
      method: 'POST',
      body: params,
    })
  }
  export async function getAppPic(params) {
    return request(`/api/other-weixin/weixin/uppic/getAppPic?${stringify(params)}`)
  }
  
  export async function isregion(params) {
    return request(`/api/other-weixin/weixin/saaspzyz/isAppvailregion?${stringify(params)}`)
  }
  
  export async function checkCap(params) {
    return request(`/api/other-weixin/weixin/saasTruckinfo/checkCap?${stringify(params)}`)
  }
  
  export async function device_check(params) {
    return request(`/api/other-weixin/weixin/saaspzyz/device_checkApp?${stringify(params)}`)
  }
  