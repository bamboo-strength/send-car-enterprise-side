import SockJS from 'sockjs-client'
import Stomp from 'stompjs';
import { notification } from 'antd';
import { getCurrentUser } from '@/utils/authority';
import Func from '@/utils/Func';
import { createMakers } from '@/utils/Operate';


let url='';
const user = getCurrentUser();
if (user.tenantId === '764537') {
  url = "http://101.201.235.128:4030/websocket"
} else {
  url='http://shf.wzlxgk.com:4030/websocket';
}

let ins='';
let map='';
let geo='';
let wInfo='';
let stompClient='';
let subscription='';

let obj={
  deviceNoStr:'',
  tenantId: getCurrentUser().tenantId,
  zt:-1,
  strRdm: ''
}

const subscribeCallback=(str)=> {
  if(str.body){
      // console.log(`success${window.location.origin}`)
      // console.log('订阅成功后回调，发送数据:',obj)
      const {success, data, msg} = JSON.parse(str.body);
      if(success && data.length>0){
        let makers=[];
        makers= createMakers(data,geo,map,wInfo);
        // console.log('ins',ins)
        if(!Func.isEmpty(makers)){
          // ins.clearMarkers();
          // ins.addMarkers(makers);
          if(Func.notEmpty(ins)){
            ins.setMarkers(makers);
            notification.success({
              message: '更新数据成功',
              description: '聚合数据更新成功！',
            });
          }
        }
      }else {
        notification.info({
          message: '更新数据成功',
          description: `未获取到更新数据${msg}`,
        });
      }
      // console.log('obj',obj)
      setTimeout(()=>{
        stompClient.send("/app/event",{},JSON.stringify(obj))
      },30000)
      // fetch(window.location.origin).then(()=>{
      //
      // }).catch(()=>{
      //   notification.error({
      //     message: '更新数据失败',
      //     description: `连接${window.location.origin}失败，请检查网络连接`,
      //   });
      // })
  }else {
    // message.error('got empty message',5)
    notification.error({
      message: '更新数据失败',
      description: 'got empty message',
    });
  }
}

const getSocket=()=>{
  return new SockJS(url);
}


const errorCallback=(error) => {
  notification.error({
    message: '更新数据失败',
    description: `丢失网络连接,原因${error},正在重连.....`,
  });
  setTimeout(()=>{
    stompClient = Stomp.over(getSocket());
    stompClient.debug = null
    stompClient.connect({}, function (frame) {
      console.log('frame',frame);
      const { rdm } = obj;
      subscription = stompClient.subscribe(`/group/gpsBreak_${getCurrentUser().tenantId}${rdm}`, subscribeCallback);
      // console.log('订阅成功，发送数据:',obj)
      stompClient.send("/app/event",{},JSON.stringify(obj))
    },errorCallback);
  },60000)
}

export function discon() {
  if(Func.notEmpty(subscription)){
    subscription.unsubscribe();
  }
  if(Func.notEmpty(stompClient)){
    stompClient.disconnect();
  }
}

export function setMes(data){
  obj = data;
}

export function createRefreshsub(cluster,geocoder,mapInstence,windowInfo){
  map=mapInstence;
  geo=geocoder;
  ins=cluster;
  wInfo=windowInfo;
  stompClient = Stomp.over(getSocket());
  stompClient.debug = null
  stompClient.connect({}, function (frame) {
    console.log('frame',frame);
    const { rdm } = obj;
    subscription = stompClient.subscribe(`/group/gpsBreak_${getCurrentUser().tenantId}${rdm}`, subscribeCallback);
    setTimeout(()=>{
      // console.log('订阅成功，发送数据:',obj)
      // console.log('obj', JSON.stringify(obj))
      stompClient.send("/app/event",{},JSON.stringify(obj))
    },10000)
  },errorCallback);
}








