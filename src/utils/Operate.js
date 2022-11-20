import { wgs84togcj02 } from 'coordtransform';
import conDirection from './conversionDirection';
import Func from '@/utils/Func';
import {  getOrderGpsLous, setOrderGpsLous ,getCurrentUser} from './authority';
import { gpsArr } from '../services/guiji'
let map='';
let geo='';
let wInfo='';
let text='';

export function Isopendeviceno() {
  console.log('text',text)
  return text;
}

const returnDeviceIcon=(data)=>{
  let icon=''
  switch (data) {
    case 0:
      icon = '/image/carrun.png';
      break;
    case 1:
      icon = '/image/carstop.png';
      break;
    case 2:
      icon = '/image/caroff.png';
      break;
    case 8:
      icon = '/image/caroff.png';
      break;
    case 9:
      icon = '/image/carrun.png';
      break;
    default:
      icon = '/image/caroff.png';
  }
  return icon
}

const returnDeviceZt=(data)=>{
  let name=''
  switch (data) {
    case 0:
      name = '行驶';
      break;
    case 1:
      name = '停车';
      break;
    case 2:
      name = '离线';
      break;
    case 3:
      name = '报警';
      break;
    case 4:
      name = '求助';
      break;
    case 5:
      name = '其他';
      break;
    case 6:
      name = '装货';
      break;
    case 7:
      name = '卸货';
      break;
    case 8:
      name = '空闲';
      break;
    case 9:
      name = '运输';
      break;
    default:
      name = '其他';
  }
  return name
}
const returnzxlx=(data)=>{
  let name=''
  switch (data) {
    case 0:
      name = '离线';
      break;
    case 1:
      name = '在线';
      break;
    default:
      name = '离线';
  }
  return name
}
const returnComponyName=(data)=>{
  let name=''
  switch (data) {
    case 1:
      name = '途强';
      break;
    case 2:
      name = '基准';
      break;
    case 3:
      name = '矩阵';
      break;
    case 4:
      name = '矩阵';
      break;
    case 5:
      name = 'G7';
      break;
    case 6:
      name = '恒通';
      break;
    case 7:
      name = '博翔';
      break;
    case 8:
      name = '凌亚';
      break;
    case 9:
      name = '盾石';
      break;
    case 10:
      name = '中交兴路';
      break;
    case 11:
      name = '重庆';
      break;
    case 12:
      name = '博翔超越';
      break;
    case 13:
      name = '德明';
      break;
    case 14:
      name = '交通部';
      break;
    default:
      name = '未知';
  }
  return name
}

const createInfo= (addr,lng,lat,extData)=>{
  const content=[];
  const {contractId, deviceStatus,deviceno,orderId, deptName,customerName,goodsName,unloadingName,outtime,zt, speed, direction, accStatus, locateStatus, stay, deviceType, remark, truckNo, weight, status, createDeptName,fhdh,gpstime,intime,arrivaltime} = extData;
  // const statusName = returnDeviceZt(zt);
  let statusName = '';
  let componyName = '';
  let timegps = new Date().getTime();
  const data3 = {
    "orderid":`${orderId}`, "deviceno":`${deviceno}`,"truckno":`${truckNo}`,"intime": `${intime}`,"arrivaltime": `${arrivaltime}`,"fhdh":`${fhdh}`
  }
  let gpsparam = getOrderGpsLous();

  let parakey = `gpsparam_${timegps}`;
  gpsparam = {
    ...gpsparam,
    [parakey]: data3
  }
  //setOrderGpsLous(JSON.stringify(gpsparam));
  setOrderGpsLous(gpsparam);
  const directionName = conDirection(direction);
  statusName = returnDeviceZt(status);
  if(getCurrentUser().tenantId==="113602") {
    statusName = returnzxlx(deviceStatus);
  }
  componyName = returnComponyName(deviceType);
  content.push(`<div>车牌号码：${truckNo}</div>`)
  {
    fhdh == '' || fhdh ==null ? "" :
      content.push(`<div><a target="_blank" href="/gps/locus/locus/0#/gps/locus/locus/${timegps}">发货单号：${fhdh == null ? "无" : fhdh}</a></div>`)
  }
  {
    orderId == '' || orderId ==null ? "":
      content.push(`<div>订单号：${orderId==null?"":orderId}</div>`)
  }
  {
    customerName==''|| customerName ==null?"":
      content.push(`<div>客户：${customerName==null?"":customerName}</div>`)
  }
  {
    goodsName =='' || goodsName ==null? "" :
      content.push(`<div>品种：${goodsName==null?"":goodsName}</div>`)
  }
  // content.push(`<div>吨数：${weight}</div>`)
  {
    deptName==''|| deptName ==null?"":
      content.push(`<div>发货厂家：${deptName==null?"":deptName}</div>`)
  }
  {
    unloadingName==''|| unloadingName ==null?"":
      content.push(`<div>卸货点：${unloadingName==null?"":unloadingName}</div>`)
  }
  {
    outtime==''|| outtime ==null?"":
      content.push(`<div>出厂时间：${outtime==null?"":outtime}</div>`)
  }
  // content.push(`<div>GPS厂家：${componyName==null?"":componyName}</div>`)
  content.push(`<div>合同编号：${contractId===null? '':contractId}</div>`)
  content.push(`<div>GPS地址：${addr}</div>`)
  // content.push(`<div>设备状态：${statusName}</div>`)
  content.push(`<div>GPS时间：${gpstime}</div>`)
  content.push(`<div>时速：${speed} km/h</div>`)
  return content;
}


const createInfoWindow=(addr,e,value)=>{
  const htmlStr=createInfo(addr,e.target.getPosition().lng,e.target.getPosition().lat,value);
  wInfo.setContent(htmlStr.join(''));
  wInfo.open(map,e.target.getPosition());
}

const showInfoMake=(e)=>{
  const { truckNo } = JSON.parse(e.target.getExtData());
  gpsArr({truckNo: truckNo,}).then(res=>{
    if(Func.notEmpty(res) && res.success && Func.notEmpty(res.data)){
      let data =res.data;
      data = {
        ...data,
        ...JSON.parse(e.target.getExtData())
      }
      let address='根据经纬度查询地址失败';
      if(Func.isEmpty(geo) || geo == undefined ){
        geo = new window.AMap.Geocoder()
      }
      if(Func.notEmpty(geo)){
        geo.getAddress(e.target.getPosition(), (status, result) => {
          // console.log('status',status)
          if (status === 'complete' && result.info === 'OK') {
            address=`${result.regeocode.formattedAddress}附近`;
          }else {
            address='坐标数据异常，未知区域';
          }

          createInfoWindow(address,e,data);
        });
      }
    }else{
      message.warn('网络连接异常，请重新查询!');
    }
  })
}

export function createMakers(array,geocoder,mapInstence,windowInfo) {
  geo=geocoder;
  map=mapInstence;
  wInfo=windowInfo;
  const makers = [];
  const arr = array.map((values) => {
    let gpsObj = {};
    const { longitude, latitude, status } = values;
    const convertGPS = wgs84togcj02(longitude,latitude);
    gpsObj = {
      ...values,
      latitude: +latitude,
      longitude: +longitude,
      lng: convertGPS[0],
      lat: convertGPS[1],
      zt: +status
    }
    return gpsObj;
  })
  arr.forEach( values => {
    const {lng, lat, zt, direction, truckNo, deviceno,deviceStatus} = values;
    var src = returnDeviceIcon(zt);
    var statusvalue = 0;
    const cp = new window.AMap.LngLat(lng, lat);
    const maker = new window.AMap.Marker({
      position: cp,
      icon: src,
      angle: direction,
      extData: `${JSON.stringify(values)}`,
      label: {
        offset: new window.AMap.Pixel(20, 10),
        content: `${truckNo} `
      }
    });
    makers.push(maker);
    if(wInfo&&wInfo.getIsOpen()){
      if(deviceno === text){
        let address='根据经纬度查询地址失败';
        if(Func.notEmpty(geo)){
          geo.getAddress(new window.AMap.LngLat(lng, lat), (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
              address=`${result.regeocode.formattedAddress}附近`
              const htmlStr=createInfo(address,lng,lat,JSON.stringify(values));
              if(values.gpstime){
                wInfo.setContent(htmlStr.join(''));
                wInfo.open(map,new window.AMap.LngLat(lng, lat));
              }
            }
          });
        }
      }else{
        wInfo.close();
      }
    }
    maker.on('click',showInfoMake)
  })
  return makers;
}
