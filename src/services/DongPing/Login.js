import { stringify } from 'qs';
import request from '@/utils/request';

// 校验司机是否认证车辆行驶证
export async function checkDrivingPermit(params) {
  return request(`/api/mer-driver-vehicle/driver/DriverCertificationInformation?${stringify(params)}`)
}

//  查看登录用户是客户还是个人
export async function checkUserType(params) {
  return request(`api/mer-user/customerUser/currentUserDetail?${stringify(params)}`)
}
