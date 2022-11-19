import { sec_to_time } from '../Util/SecDate';
import _ from 'lodash';


// 停车点信息窗
export function stopcarwindows(value,adress) {
  let info = [];
  // let s = sec_to_time(value.eventtotaltime);
  info.push(`<div>`);
  info.push(`<div>设备号：${value.deviceno}</div>`);
  info.push(`<div>开始时间：${value.eventstarttime}</div>`);
  info.push(`<div>结束时间：${value.eventendtime}</div>`);
  info.push(`<div>停车时长：${value.eventtotaltime}分钟</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`<div>经纬度 ：${_.round(value.longitude)}/${_.round(value.latitude)}</div></div>`);
  return info;
}

// 轨迹点信息窗
export function infowindows(value,adress) {
  let info = [];
  info.push(`<div>`);
  info.push(`<div>速度：${value.speed}km/h</div>`);
  // info.push(`<div>重量：${_.round(value.weight)}</div>`);
  info.push(`<div>时间：${value.gpstime}</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`<div>经纬度 ：${_.round(value.longitude)}/${_.round(value.latitude)}</div></div>`);
  return info;
}
// 轨迹点信息窗s
export function infowindowsmove(time,adress) {
  let info = [];
  info.push(`<div>`);
  info.push(`<div>时间：${time}</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`</div>`);
  return info;
}
// 合同轨迹点信息窗s
export function infowindowsmoves(time,adress,pathData) {
  let info = [];
  info.push(`<div>`);
  info.push(`<div>车号：${pathData.name}</div>`);
  info.push(`<div>时间：${time}</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`</div>`);
  return info;
}

// 起止点信息窗
export function startendwindows(value,adress,type) {
  let info = [];
  info.push(`<div>`);
  info.push(`<div><b>${type}</b></div>`);
  info.push(`<div>时间：${value.gpstime}</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`<div>经纬度 ：${_.round(value.longitude)}/${_.round(value.latitude)}</div></div>`);
  return info;
}

// 拍照点信息窗
export function picwindows(value,adress,type) {
  let info = [];
  info.push(`<div>`);
  info.push(`<div><b>${type}</b></div>`);
  info.push(`<div>时间：${value.createTime}</div>`);
  info.push(`<div>位置：${adress}</div>`);
  info.push(`<div>经纬度 ：${_.round(value.x)}/${_.round(value.y)}</div></div>`);
  return info;
}

// 转换经纬度属性名
export function xytolnglat(value){
  let value1 = {
    ...value,
    longitude: value.x,
    latitude: value.y
  }
  return value1;
}