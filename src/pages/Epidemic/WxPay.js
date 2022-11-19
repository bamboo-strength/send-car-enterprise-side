import React, { PureComponent, } from 'react';
import { Icon,Button } from 'antd';
import router from 'umi/router';
import { requestApi, requestListApi } from '../../services/api';

class EpidemicAdd extends PureComponent {


  // 去支付
  toPay = () => {
    if(window.__wxjs_environment === 'miniprogram'){
    requestListApi('/api/mer-queue/auth/wechat/checkWeChatIsBind',{}).then(resp=>{ // 检查是否绑定appid了
      if(resp.success && resp.data){ // 已绑定
        // 调起微信支付
        requestApi('/api/mer-queue/wx/pay/unifiedorder',{orderId:'1'}).then(rr=>{
          const {data} = rr
          if(rr.success){
            WeixinJSBridge.invoke(
              'getBrandWCPayRequest',
              {
                'appId': data.appId,
                'nonceStr': data.nonceStr,
                'package': data.packageValue,
                'paySign': data.paySign,
                'signType': 'MD5',
                'timeStamp': data.timeStamp,
              });
          }
        })
      }else { // 未绑定 跳转去绑定
        wx.miniProgram.navigateTo({url:'/pages/wxPay/wxPay'});
      }
    })
    }else {
      console.log('不是微信支付环境')
    }

  };


  render() {

    return (
      <div>
        <Button onClick={this.toPay}>
          支付
        </Button>
      </div>
    );
  }
}

export default EpidemicAdd;
