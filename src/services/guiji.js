import request from '@/utils/request';
import { stringify } from 'qs';

export async function gpslocus(params) {
    return request(`/api/flowaudit-config/floworder/getTruckLocus?${stringify(params)}`);
  }

  export async function gpsArr(params) {
    return request(`/api/basics-info/truckdevice/gpsList`,{
      method: 'POST',
      body: params,
    });
  }

  export async function getTrucksByConid(params) {
    return request(`/api/flowaudit-config/floworder/getTrucksByConid?${stringify(params)}`);
  }

export async function getOrderByFhdh(params) {
  return request(`/api/flowaudit-config/floworder/getOrderByFhdh?${stringify(params)}`);
}
