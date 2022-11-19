import React, { PureComponent } from 'react';
import { Map ,} from 'react-amap';
import { Icon,Button, Spin,Switch} from 'antd';
import { NavBar,Toast,Modal,List, } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import router from 'umi/router';
import { reservationqueueQueueInfo, joinQueue, getPayConfig } from '../../../services/epidemic';
import { requestListApi } from '@/services/api';
import { getCurrentUser } from '../../../utils/authority';
import { getToken } from '@/utils/authority';
import '../Epidemic.less'
import CountDown from '@/components/CountDown';

// 正式排队功能 取微信定位/安卓外壳定位
class FormalQueue extends PureComponent {

  constructor(props) {
    super(props);
    this.amapEvents = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance;
        mapInstance.plugin(['AMap.Geocoder'],() => {
          this.geocoder = new window.AMap.Geocoder()
        })
        // this.initData('36.652235','117.126134',) // 测试
        if (window.__wxjs_environment === 'miniprogram') { // 微信排队
          this.getLocationFromWX()
        }else {
          this.getLocationFromAndroid()
        }
      }
    };
    this.state = {
      queueInfos:{
        reservationQueue:{},
      },
      checked:true,
      paySetting:{},
      showPayModal:false, // 支付弹框
    }
  }

  getLocationFromWX=()=>{
    const that = this
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
              that.setState({
                currentlng:ads.longitude,
                currentlat:ads.latitude
              },()=>{
                that.initData(ads.latitude,ads.longitude,)
              })
            },
          })
        });
        wx.error(function(res){
          Toast.info('error')
        });
      }
    })
  }

  getLocationFromAndroid=()=>{ // 从安卓外壳获取数据
    try {
      const state = LocationStatus.getLocationStatus();
      if (JSON.stringify(JSON.parse(state)) === 'false') {
        Toast.offline('请检查定位开启状态！！');
      } else {
        const location = Location.getLocation();
        const longitude = JSON.stringify(JSON.parse(location).longitude)
        const latitude = JSON.stringify(JSON.parse(location).latitude)
        // Toast.info(location)
        this.setState({
          currentlng:longitude,
          currentlat:latitude
        },()=>{
          this.initData(latitude,longitude,)
        })
      }
    }catch (e) {
      Toast.fail('浏览器不支持获取定位!');
      router.push('/dashboard/function')
    }
  }

  initData=(currentlat,currentlng)=>{ // 根据排队申请中的信息获取厂区 再根据厂区获取厂区经纬度跟半径
    reservationqueueQueueInfo().then(resp=>{
      // console.log(resp.data,'----')
      if(resp.success && resp.data.reservationQueue){
        const {data} =resp
        const {queueStatus} = data.reservationQueue
        const {longitude,latitude,deptRadius,queueEndStatus,isOpenDelayService,isTimeOut} = data
        let ifFinish =false  // 判断是否完成排队
        if((queueEndStatus === 4 && (queueStatus === 2 || queueStatus === 3)) ||
          (queueEndStatus === 5 && (queueStatus === 2 || queueStatus === 3 || queueStatus === 4)) ||
          (queueStatus === 9 && !isOpenDelayService && !isTimeOut) // 过号15分钟内 未订购延时
        ) {
          ifFinish = true
        }
              this.setState({
                queueInfos:data,
                deptlng:longitude,
                deptlat:latitude,
                deptRadius,
                ifFinish
              },()=>{
                if(!data.longitude || !data.latitude){
                  Toast.info('厂区坐标获取失败，请刷新再试')
                }else {
                  this.init(currentlat,currentlng)
                  this.getPosition(currentlng,currentlat,data.longitude,data.latitude,data.deptRadius)
                }
              })
        // 获取收费相关配置
        getPayConfig({deptId:data.reservationQueue.plantAreaId}).then(rr => {
          const paySetting = rr.data
          this.setState({
            paySetting,
            checked:paySetting.isVoiceSend != 0 // 厂区配置需要显示语音呼叫服务
          })
        })
      }else {
        Modal.alert('当前没有排队信息','如需再次排队，请先进行排队申请',[
          {text:'取消',onPress:()=>router.push('/dashboard/function')},
          {text:'去申请',onPress:()=>router.push('/epidemic/EpidemicLineUp')},
        ])
      }
    })
  }

  init=(currentlat,currentlng)=>{ // 初始化当前位置 围栏
    const {deptlng,deptlat,deptRadius} = this.state

    const deptmarker = new window.AMap.Marker({
      icon: '/image/pic.png',
      position: [deptlng, deptlat]
    });

    const currentMarker = new window.AMap.Marker({
      icon: '/image/mark.png',
      position: [currentlng,currentlat]
    });

    const circle = new window.AMap.Circle({
      center: new window.AMap.LngLat(deptlng, deptlat), // 厂区位置
      radius: deptRadius * 1000,  // 半径 后台获取
      strokeColor: "#1890FF",  // 线颜色
      strokeOpacity: 1,  // 线透明度
      strokeWeight: 1,  // 线粗细度
      fillColor: "#E3EDEE",  // 填充颜色
      fillOpacity: 0.5 // 填充透明度
    });
    this.mapInstance.add([currentMarker,deptmarker,circle]);
    this.mapInstance.setCenter([currentlng,currentlat]);
  }

  getPosition=(currentlng,currentlat,deptlng,deptlat,deptRadius)=>{
    // console.log(currentlng,currentlat,deptlng, deptlat,'===坐标')
    if(!currentlng || !currentlat){
      Toast.info('当前坐标获取失败，请返回重新进入')
      return
    }
    const p1 = new window.AMap.LngLat(currentlng,currentlat)
    const p2 = new window.AMap.LngLat(deptlng, deptlat)
    const dis =  (Math.round(p1.distance(p2)) / 1000).toFixed(2)
    // console.log(p1.distance(p2),'===距离')
    // console.log(dis,deptRadius,'----+++')
    // 计算点距离
    if(dis > deptRadius){
    //  Toast.info(`未到达厂区${deptRadius}公里内，暂无法排队，请进入范围内进行排队`)
      this.setState({
        distance:dis,
        ifInRange:false, currentlat,currentlng,
      })
    }else {
      this.setState({
        distance:dis,
        ifInRange:true,currentlat,currentlng,
      })
    }
}

  joinQueue=()=>{ // 点击排队
    const {ifInRange,paySetting,checked} = this.state
    if(!ifInRange){
      Toast.info('还未进入厂区范围无法排队')
      return
    }
    if(paySetting.isPay == 1){// 配置为1即为支付服务费
      this.setState({
        showPayModal:true,
        paySetting
      })
    }else if(paySetting.isPay == 2){
      if(checked){        // 不收费服务费 收通知费
        this.setState({
          showPayModal:true,
          paySetting
        })
      }else {           // 不收费服务费 不收通知费
        this.toqueue('确定排队？')
      }

    }
    else { // 0 试用阶段
      if(checked){        // 不收费服务费 收通知费
        this.setState({
          showPayModal:true,
          paySetting
        })
      }else {           // 不收费服务费 不收通知费
        const msg = `排队服务费${paySetting.serviceFeeAmount}元，目前为试用阶段，暂不收费`
        this.toqueue(msg)
      }
    }
  }

  toPayQueueService=()=>{ // 支付排队费
    const {currentlat,currentlng,queueInfos,checked} = this.state
    const position = `${currentlng};${currentlat}`
    if (window.__wxjs_environment === 'miniprogram') {
      const item = {
        queueId:queueInfos.reservationQueue.id,
        position,
        auth: getToken(),
        userOpenId:getCurrentUser().openId,
        isVoiceSend:checked ?1:0
      };
      const items = JSON.stringify(item);
      wx.miniProgram.navigateTo({ url: `/pages/wxPay/wxPay?items=${items}` });
    } else {
      Toast.info(('不是微信支付环境'));
    }
  }

  toqueue=(msg)=>{
    const {currentlat,currentlng,queueInfos,} = this.state
    const position = `${currentlng};${currentlat}`
    Modal.alert('排队提示',msg,[
      {text:'取消'},
      {text:'确定',onPress:()=>
        {
          joinQueue({id:queueInfos.reservationQueue.id,formalQueuePosition:position,isVoiceSend:0}).then(resp=>{
            if(resp.success){
              Toast.info('排队成功')
              this.initData(currentlat,currentlng)
            }
          })
        }
      },
    ])
  }

  back=()=>{ // 退出页面
    router.push('/dashboard/function')
  }

  toPayDelayService=()=>{ // 开通延时服务
    const {queueInfos,paySetting} = this.state
     if (window.__wxjs_environment === 'miniprogram') {
      const item = {
        queueId:queueInfos.reservationQueue.id,
        auth: getToken(),
        userOpenId:getCurrentUser().openId,
        paySetting,
        h5Page:'epidemic/queue/formalQueue'
      };
      const items = JSON.stringify(item);
      wx.miniProgram.navigateTo({ url: `/pages/delayPay/delayPay?items=${items}` });
    } else {
      Toast.info(('不是微信支付环境'));
    }
  }

  toReQueue=()=>{
    router.push(
      {
        pathname: '/epidemic/numeral', // 去排队
        state: {
          notCheckQueueStatus:true,

        },
      },
    );
  }

  endTimeFunc=()=>{ // 倒计时结束重新
    const {currentlat,currentlng} = this.state
    this.initData(currentlat,currentlng)
  }

  openAgainAntiepidemic=()=>{ // 二次申报功能
    const {queueInfos,} = this.state
    router.push({
      pathname:'/epidemic/epidemicAdd',
      state:{
        ifSecond:true,
        reservationQueueId:queueInfos.reservationQueue.id,
      }
    })
  }

  showDelayService =()=>{ // 展示延时付费按钮
    const {queueInfos,paySetting} = this.state
    if(!paySetting.delayServiceAmount && !paySetting.delayServiceTime){ // 空为不使用延时服务
      return null
    }
    const {reservationQueue:{queueStatus,callTimeDeadline}} =queueInfos
    const {isOpenDelayService,isTimeOut ,} = queueInfos
      // console.log(queueStatus,isOpenDelayService,isCarryOutDelayService,callTime,'----')
      if(!isOpenDelayService && isTimeOut ){ // 没有延时过并且叫号超时15分钟不能订购 / 延时 并且 过号 不能再订购(暂时不在排队界面) (isOpenDelayService && queueStatus === 9)
        return null
      }
      if(queueStatus === 9 && !isOpenDelayService && !isTimeOut){  // 过号15分钟内 未订购延时
        return (
          <div className='delayService'>
            <div className='delayServiceMsg'>您已过号，请选择开通延时服务或重新排队</div>
            <Button type="primary" block style={{height: '45px',marginBottom: '15px'}} onClick={this.toPayDelayService}>开通延时服务</Button>
            <Button type="primary" block style={{height: '45px',marginBottom: '15px'}} onClick={this.toReQueue}>重新排队</Button>
          </div>
        )
      }
      if(queueStatus === 3){ // 3:已叫号
        return (
          <div className='delayService'>
            {
              isOpenDelayService? // 已开通过
                <div className='delayServiceMsg'>您已开通延时服务，入厂倒计时：<CountDown target={callTimeDeadline} showText onEnd={this.endTimeFunc} /></div>:
                <div className='delayServiceMsg'>您已被叫号，入厂倒计时：<CountDown target={callTimeDeadline} showText onEnd={this.endTimeFunc} /></div>
            }
            <Button type="primary" block disabled={isOpenDelayService} style={{height: '45px',marginBottom: '15px'}} onClick={this.toPayDelayService}>{isOpenDelayService?'已开通':'开通'}延时服务</Button>
          </div>
        )
      }
      return null

  }

  // 二次申报按钮
  showDelayAgainAntiepidemic=()=>{
    const btnSty = {border: 'none',backgroundColor: 'tomato',height: '45px',marginBottom: '15px'}
    const {queueInfos,} = this.state
    const {isOpenAgainAntiepidemicAudit,isAgainAntiepidemicAuditPass,reservationQueue:{queueStatus,}} = queueInfos
    if(queueStatus === 3 && isOpenAgainAntiepidemicAudit && !isAgainAntiepidemicAuditPass){
      return (
        <div className='delayService'>
          <Button type="primary" block style={btnSty} onClick={this.openAgainAntiepidemic}>再次申报</Button>
        </div>
      )
    }
    return null
  }

  voiceSendToast=()=>{
    const {paySetting} = this.state
    if(paySetting.isVoiceSend == 2){
      Toast.info('语音服务为必须开通项目，无法取消')
    }
  }

  render() {
    const btnSty= {height: '45px',marginBottom: '15px'}
    const p1Sty ={width:'100%',fontWeight:'bold'}
    const p2Sty ={fontWeight:'bold',marginLeft:'15px'}

    const {ifFinish,distance,deptRadius,ifInRange,queueInfos,showPayModal,checked,paySetting} = this.state
    const {reservationQueue,isDiscrete} = queueInfos
    const showQueueNumber = ( // 排队号相关信息
      <div className='queueCardStyle'>
        <div style={{paddingTop: '15px',fontSize: '14px', }}>排队成功，您的排队号为</div>
        <div style={{fontSize:'40px',fontWeight:'bold',margin:'5px 0px'}}>{reservationQueue.queueNumber}</div>
        <p>您前面有 <Text type='danger' style={{fontWeight:'bold'}}>{queueInfos.queueVehicleCount}</Text> 辆车正在排队</p>
        {
          isDiscrete !== 'N' && <p>{reservationQueue.applyStatus == 1?'防疫信息正在审核，请耐心等待': '防疫信息已审核'} </p>
        }
      </div>
    )

    return (
      <div className='epidemic'>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push('/dashboard/function')}}
          rightContent={[<Icon key="0" type="redo" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => location.reload()} />,]}
        >入厂排队
        </NavBar>
        <div style={{width:'100%',height:'320px'}}>
          <Map
            plugins={['ToolBar']}
            zoom={13}
            events={this.amapEvents}
          >
            {/* <Marker events={this.markerEvents} /> */}
          </Map>
        </div>
        {
          !ifFinish? // 未完成排队
            <div>
              {
                distance?
                <div style={{paddingBottom:'30px'}}>
                  {
                    ifInRange?
                      <div style={{width: '90%',margin: '10px auto'}}>
                        <div className='joinQueueCard'>
                          <p style={p1Sty}>当前厂区正在排队车辆 <Text type='danger'>{queueInfos.queueVehicleCount == -1?0:queueInfos.queueVehicleCount}</Text> 辆</p>
                          <p style={p1Sty}>当前位置距离厂区还有 <Text type='danger'>{distance}</Text> 公里</p>
                        </div>
                        { /* 语音排队服务 */
                          paySetting.isVoiceSend != 0?
                            <List.Item
                              extra={<Switch
                                checked={checked}
                                checkedChildren="已订购"
                                unCheckedChildren="未订购"
                                disabled={paySetting.isVoiceSend == 2} // 配置为2时厂区默认开通 不能取消
                                onClick={this.voiceSendToast}
                                // size="small"
                                onChange={() => {
                                  this.setState({
                                    checked: !checked,
                                  });
                                }}
                                style={{fontWeight: 'bold'}}
                              />}
                            >语音通知服务<div style={{fontSize:'12px'}}>(需收取通讯服务费)</div>
                            </List.Item>:undefined
                        }
                        <p style={{fontWeight:'bold',color: 'black',fontSize: '16px'}}> 您已进入排队区域，请点击确认按钮进入排队队列</p>
                        <Button type="primary" block style={btnSty} onClick={this.joinQueue}>点击确认</Button>
                        <Button type="dashed" block style={btnSty} onClick={this.back}>返回</Button>
                      </div>
                      :
                      <div style={{width: '90%',margin: '10px auto'}}>
                        <div className='outRangeCard'>
                          <p style={{fontWeight:'bold'}}> <Icon type="exclamation-circle" theme="twoTone" twoToneColor='red'/> &nbsp;提示：</p>
                          <p> 未进入<Text type='danger'>{queueInfos.deptName}</Text>厂区范围，请进入厂区范围 <Text type='danger'>{deptRadius}</Text> 公里后进行排队</p>
                          <p style={p1Sty}>当前厂区正在排队车辆 <Text type='danger'>{queueInfos.queueVehicleCount == -1?0:queueInfos.queueVehicleCount}</Text> 辆</p>
                          <p style={p1Sty}>当前位置距离厂区还有 <Text type='danger'>{distance}</Text> 公里</p>
                        </div>
                      </div>
                  }
                </div>:
                  <Spin style={{margin:'20px auto',width: '100%'}} tip='数据加载中，请稍后' />
              }
            </div>:
            <div> {/* 已进入排队 */}
              {showQueueNumber}
              <div className='msgCard'>
                <p style={p2Sty}>距离厂区<Text type='danger'>{distance}</Text>公里</p>
                <p style={p2Sty}>预计<Text type='danger'>{queueInfos.reservationQueue.expectedArrival}</Text>小时到厂</p>
              </div>
              {/*  延时服务 */} {this.showDelayService() }
              {/*  二次申报功能 */} {this.showDelayAgainAntiepidemic() }
              <div style={{width:'90%',margin:'0px auto'}}>
                <p style={{fontSize: '16px',fontWeight: 'bold',margin: '20px 5px',color:'black'}}> <Icon type="exclamation-circle" theme="filled" style={{color:'#6895F7'}} /> 温馨提示</p>
                <p>1、您已排队成功，请合理安排时间准时到厂；</p>
                <p>2、收到叫号通知，请及时入厂以免过号</p>
              </div>

            </div>
        }
        <Modal
          visible={showPayModal}
          transparent
          closable
          maskClosable={false}
          onClose={()=>this.setState({showPayModal:false})}
          title="服务费提示"
          footer={[{ text: '取消', onPress: () => {this.setState({showPayModal:false})} },{ text: '同意支付', onPress: () => {this.toPayQueueService()} }]}
          bodyStyle={{width: '320px',height: '200px'}}
          className='payModal'
        >
          <div>
            <p className='totalMoneySty'>支付服务费：<span style={{color:'red',fontWeight:'bold',fontSize:'18px'}}>￥ {Number(paySetting.isPay == 1?paySetting.serviceFeeAmount:0)+ Number(checked?paySetting.voiceSendAmount:0)}</span></p>
            <List>
              <List.Item>费用明细：</List.Item>
              {
                paySetting.isPay ==1 && <List.Item extra={`￥${ paySetting.serviceFeeAmount}`}>平台服务费：</List.Item>
              }
              {checked && <List.Item extra={`￥${ paySetting.voiceSendAmount}`}>语音通知服务费：</List.Item>}
            </List>
          </div>
        </Modal>
      </div>
    );
  }
}

export default FormalQueue;
