import { Modal, Toast } from 'antd-mobile';
import { getCurrentUser } from '../../../../utils/authority';
import { requestListApi } from '../../../../services/api';
import { signIn,executeOrder } from '@/services/Despatch/DispatchServices';


const { alert } = Modal;


export async function handleTenantbtnClick(btn, obj,form,that) {
  const {tenantId} = getCurrentUser()
  const {code} = btn
  if(tenantId === '042606'){ // 董家口
    if(code.includes('signIn')){ // 董家口签到功能
      // const that = this
      alert('签到', '确定签到?', [
        { text: '取消', style: 'default' },
        {
          text: '确定', onPress: () => {
            Toast.loading('请稍后...')
            requestListApi('/api/mer-queue/wechat/getSignature',{url:encodeURIComponent(window.location.href.split('#')[0])}).then(resp=>{
              const {data} = resp
              if(resp.success){
                wx.config({
                  debug: false, // 开启调试模式,调用的所有api的返回值会在客户端alert出来，若要查看传入的参数，可以在pc端打开，参数信息会通过log打出，仅在pc端时才会打印。
                  appId: 'wx1e9311f999641196', // 必填，公众号的唯一标识
                  timestamp:data.timestamp, // 必填，生成签名的时间戳
                  nonceStr:data.noncestr, // 必填，生成签名的随机串
                  signature:data.signature,// 必填，签名
                  jsApiList: ['getLocation'] // 必填，需要使用的JS接口列表
                });

                wx.ready(function(){
                  wx.getLocation({
                    type: 'wgs84', // 默认为wgs84的gps坐标，如果要返回直接给openLocation用的火星坐标，可传入'gcj02'
                    success (ads) {
                      signIn({id:obj.id,latitude:ads.latitude,longitude:ads.longitude}).then(ii=>{
                        if(ii.success){
                          Toast.info('操作成功')
                          that.reset();
                        }
                      })
                    },
                  })
                });
                wx.error(function(){
                  Toast.info('error')
                });
              }
            })

          },
        },
      ]);
    }else if(code === 'executeOrder' || code === 'againAppointment'){ // 执单 或 重新预约
      // console.log(obj,'===')
      if(obj.loadtype === '1'){ // 采购只执单 不用选择时间
        Modal.alert('', '确认执单?', [
          { text: '取消', },
          {
            text: '确定', onPress: () =>{
              Toast.loading('加载中')
              executeOrder({id:obj.id,time:'',bookingid:''}).then(res =>{
                Toast.hide()
                if(res && res.success){
                  Toast.info('执单成功')
                  that.reset();
                }
              })
            }
          },
        ]);

      }else {
        const newObj = obj
        newObj.type = code
        that.setState({
          onScrollChanges:false, // 不能滑动
          executeOrderVisible:true,
          obj:newObj,
          type:code
        })
      }

    }
  }
}





