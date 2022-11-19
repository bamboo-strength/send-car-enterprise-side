import React, { PureComponent } from 'react';
import { Map ,} from 'react-amap';
import { Icon,Button, Spin} from 'antd';
import { NavBar,Toast,Modal } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import router from 'umi/router';
import {reservationqueueQueueInfo,joinQueue,cancelQueue,getPayConfig} from '../../../services/epidemic'
import func from '../../../utils/Func';
import { getCurrentUser } from '../../../utils/authority';
import { requestApi } from '../../../services/api';
import { getToken } from '@/utils/authority';


class FormalQueue extends PureComponent {

  constructor(props) {
    super(props);
    const that = this
    this.amapEvents = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance;
        mapInstance.plugin(['AMap.Geocoder'],() => {
          this.geocoder = new window.AMap.Geocoder()
        })
        mapInstance.plugin('AMap.Geolocation', function() {
          const geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            timeout: 2000, // 超过10秒后停止定位，默认：无穷大
            useNative:true,
            zoomToAccuracy: true,
            // GeoLocationFirst:true
          });
          mapInstance.addControl(geolocation);
          geolocation.getCurrentPosition((status,result)=>{
            if(status === 'complete'){
              console.log(status,result)
              const currentlng = result.position.getLng()
              const currentlat = result.position.getLat()
              that.initData(currentlat,currentlng)
            }
          },(status,result)=>{
            // console.log(status,result)
            Toast.info('---')
          })
          that.interval = setInterval(() => {
            geolocation.getCurrentPosition((status,result)=>{
              if(status === 'complete'){
                const {deptRadius,deptlng,deptlat} = that.state
                // console.log(status,result,deptRadius)
                const currentlng = result.position.getLng()
                const currentlat = result.position.getLat()
                that.getPosition(currentlng,currentlat,deptlng,deptlat,deptRadius)
              }
            },(status,result)=>{
              // console.log(status,result)
              Toast.info('---')
            })
          }, 20000 );
        })

      }
    };
    this.state = {
      queueInfos:{
        reservationQueue:{}
      }
    }
  }

  componentWillUnmount() {
    clearTimeout(this.interval);
  }

  click=()=>{
    const {currentlng,currentlat} = this.state
    const p1 = new window.AMap.LngLat(currentlng,currentlat)
    console.log(currentlng,currentlat,p1,'=====')
    this.mapInstance.setZoomAndCenter('6',p1)
  }

  initData=(currentlat,currentlng)=>{ // 根据排队申请中的信息获取厂区 再根据厂区获取厂区经纬度跟半径
    reservationqueueQueueInfo().then(resp=>{
      // console.log(resp.data,'----')
      if(resp.success && resp.data.reservationQueue){
        const {data} =resp
        const {queueStatus,} = data.reservationQueue
        const {queueEndStatus} = data
        let ifFinish =false
        if((queueEndStatus === 4 && (queueStatus === 2 || queueStatus === 3)) || (queueEndStatus === 5 && (queueStatus === 2 || queueStatus === 3 || queueStatus === 4))) {
          ifFinish = true
        }
              this.setState({
                queueInfos:data,
                deptlng:data.longitude,
                deptlat:data.latitude,
                deptRadius:data.deptRadius,
                ifFinish, // 排队成功
              },()=>{
                if(!data.longitude || !data.latitude){
                  Toast.info('厂区坐标获取失败，请刷新再试')
                }else {
                  this.init()
                  this.getPosition(currentlng,currentlat,data.longitude,data.latitude,data.deptRadius)
                }
              })
      }else {
        Modal.alert('当前没有排队信息','如需再次排队，请先进行排队申请',[
          {text:'取消',onPress:()=>router.push('/dashboard/function')},
          {text:'去申请',onPress:()=>router.push('/epidemic/EpidemicLineUp')},
        ])
      }
    })
  }

  init=()=>{ // 初始化当前位置 围栏
    const {deptlng,deptlat,deptRadius,} = this.state
    const deptmarker = new window.AMap.Marker({
      icon: '/image/pic.png',
      position: [deptlng, deptlat]
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
    this.mapInstance.add([deptmarker,circle]);
  }

  getPosition=(currentlng,currentlat,deptlng,deptlat,deptRadius)=>{
    console.log(currentlng,currentlat,deptlng, deptlat,'===坐标')
    if(!currentlng || !currentlat){
      Toast.info('当前坐标获取失败，请返回重新进入')
      return
    }
    const p1 = new window.AMap.LngLat(currentlng,currentlat)
    const p2 = new window.AMap.LngLat(deptlng, deptlat)
    const dis =  (Math.round(p1.distance(p2)) / 1000).toFixed(2)
    // console.log(dis,deptRadius,'===距离')

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
    const {ifInRange,currentlat,currentlng,queueInfos} = this.state
    if(!ifInRange){
      Toast.info('还未进入厂区范围无法排队')
      return
    }
    // console.log(queueInfos,'----')
    // 判断是否进入支付页面
    // const param = {'paramKey':'queue_pay_config'}
    // param.tenantId = getTenantId()
    getPayConfig({deptId:queueInfos.reservationQueue.plantAreaId}).then(rr => {
      const pp = rr.data
      const position = `${currentlng};${currentlat}`
      if(rr.success){
          if(pp.isPay == 1){// 配置为1即为支付 否则完成排队
            const msg = `排队需收取手续费${pp.serviceFeeAmount}元,是否继续`
            Modal.alert('排队收费通知',msg,[
              {text:'取消',onPress:()=>console.log('00')},
              {text:'继续',onPress:()=>
                {
                  if (window.__wxjs_environment === 'miniprogram') {
                    const item = {
                      queueId:queueInfos.reservationQueue.id,
                      position,
                      auth: getToken(),
                      userOpenId:getCurrentUser().openId
                    };
                    const items = JSON.stringify(item);
                    // console.log(item,'---------')
                    wx.miniProgram.navigateTo({ url: `/pages/wxPay/wxPay?items=${items}` });
                  } else {
                    Toast.info(('不是微信支付环境'));
                  }
                }
              },
            ])
          }else if(pp.isPay == 2){ // 没有收费相关配置
            Modal.alert('确定排队','确定加入排队？',[
              {text:'取消',onPress:()=>console.log('cancel queue')},
              {text:'确定',onPress:()=>
                  joinQueue({id:queueInfos.reservationQueue.id,formalQueuePosition:position}).then(resp=>{
                    if(resp.success){
                      Toast.info('排队成功')
                      this.initData(currentlat,currentlng)
                    }
                  })
              },
            ])
          }
          else { // 0 试用阶段
            const msg = `排队服务费${pp.serviceFeeAmount}元，目前为试用阶段，暂不收费`
            Modal.alert('排队收费通知',msg,[
              {text:'取消',onPress:()=>console.log('00')},
              {text:'我知道了',onPress:()=>
                  joinQueue({id:queueInfos.reservationQueue.id,formalQueuePosition:position}).then(resp=>{
                    if(resp.success){
                      Toast.info('排队成功')
                      this.initData(currentlat,currentlng)
                    }
                  })
              },
            ])
          }
      }
    });

  }

  cancelQueue=()=>{ // 取消排队
    const {queueInfos} = this.state
    const msg = `您正在 ${queueInfos.deptName} 厂区 ${queueInfos.coalName} 煤种下排队，是否确定取消排队，若取消排队需要重新进行排队申请`
    Modal.alert('确定取消排队？',msg,[
      {text:'不取消',onPress:()=>console.log('00')},
      {text:'确定取消',onPress:()=>
        cancelQueue({id:queueInfos.reservationQueue.id}).then(resp=>{
          if(resp.success){
            Toast.info('取消排队成功')
            this.initData()
          }
        })
      },
    ])
  }

  back=()=>{ // 退出页面
    router.push('/dashboard/function')
  }

  render() {
  const pStyle = {}
  const phSty = {
    width: '90%',
    height: '140px',
    backgroundImage: 'linear-gradient(to right,#6492F7,#4D7BF6,#3563F5)',
    margin: '0px auto',
    borderRadius: '10px',
    textAlign:'center',
    boxShadow: '4px 8px 4px #d9e1f8',
    color: '#f9f5f5'
  }
  const phSty2 = {
    width: '90%',
    height: '80px',
    backgroundColor: 'white',
    margin: '20px auto',
    borderRadius: '10px',
    textAlign:'center',
    boxShadow: '4px 8px 4px #d9e1f8',
    color: 'black',
    padding:'10px 0px'
  }
    const phSty3 = {
      width: '95%',
      height: '180px',
      backgroundColor: 'white',
      margin: '20px auto',
      borderRadius: '10px',
      boxShadow: '4px 8px 4px #d9e1f8',
      color: 'black',
      padding:'10px'
    }
  const btnSty= {height: '45px',margin: '5px 0px'}
  const p1Sty ={width:'100%',fontWeight:'bold'}
  const p2Sty ={fontWeight:'bold',marginLeft:'15px'}
  const div2Sty ={
    display:'flex',flexWrap:'wrap',textAlign:'center',paddingTop:'20px',color:'black',
    backgroundColor: 'white',
    width: '90%',
    margin: '0px auto',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
  }
  const {ifFinish,distance,deptRadius,ifInRange,queueInfos} = this.state

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/dashboard/function')
          }}
          rightContent={[
            <Icon key="0" type="redo" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => location.reload()} />,
          ]}
        >入厂排队
        </NavBar>
        <div style={{width:'100%',height:'340px'}}>
          <Map
            plugins={['ToolBar']}
            //  loading={Loading}
            zoom={8}
            events={this.amapEvents}
          >
            {/* <Marker events={this.markerEvents} />*/}
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
                        <div style={phSty2}>
                          <p style={p1Sty}>当前厂区正在排队车辆 <Text type='danger'>{queueInfos.queueVehicleCount == -1?0:queueInfos.queueVehicleCount}</Text> 辆</p>
                          <p style={p1Sty}>当前位置距离厂区还有 <Text type='danger'>{distance}</Text> 公里</p>
                        </div>
                        <p style={{fontWeight:'bold',color: 'black'}}> 您已进入排队区域，请点击排队按钮进入排队队列</p>
                        <Button type="primary" block style={btnSty} onClick={this.joinQueue}>点击排队</Button>
                        <Button type="dashed" block style={btnSty} onClick={this.back}>返回</Button>
                      </div>
                      :
                      <div style={{width: '90%',margin: '10px auto'}}>
                        <div style={phSty3}>
                          <p style={{fontWeight:'bold'}}> <Icon type="exclamation-circle" theme="twoTone" twoToneColor='red'/> &nbsp;提示：</p>
                          <p> 未进入厂区范围，请进入厂区范围 <Text type='danger'>{deptRadius}</Text> 公里后进行排队</p>
                          <p style={p1Sty}>当前厂区正在排队车辆 <Text type='danger'>{queueInfos.queueVehicleCount == -1?0:queueInfos.queueVehicleCount}</Text> 辆</p>
                          <p style={p1Sty}>当前位置距离厂区还有 <Text type='danger'>{distance}</Text> 公里</p>
                        </div>
                      </div>
                  }
                </div>:
                  <Spin style={{margin:'20px auto',width: '100%'}} tip='数据加载中，请稍后' />
              }
            </div>:
            <div>
              <div style={phSty}>
                <div style={{
                  paddingTop: '15px',
                  fontSize: '14px',
                }}
                >排队成功，您的排队号为
                </div>
                <div style={{fontSize:'40px',fontWeight:'bold',margin:'5px 0px'}}>
                  {queueInfos.reservationQueue.queueNumber}
                </div>
                <p>您前面有 <Text type='danger' style={{fontWeight:'bold'}}>{queueInfos.queueVehicleCount}</Text> 辆车正在排队</p>
              </div>
              <div style={div2Sty}>
                <p style={p2Sty}>距离厂区<Text type='danger'>{distance}</Text>公里</p>
                <p style={p2Sty}>预计<Text type='danger'>{queueInfos.reservationQueue.expectedArrival}</Text>小时到厂</p>
              </div>
            {/*  <Button type='primary' shape="round" style={{marginLeft:'25%',marginTop:'20px',width:'50%',height:'40px'}} onClick={this.cancelQueue}>
                取消排队
              </Button> */}
              <div style={{width:'90%',margin:'0px auto'}}>
                <p style={{fontSize: '16px',fontWeight: 'bold',margin: '20px 5px',color:'black'}}> <Icon type="exclamation-circle" theme="filled" style={{color:'#6895F7'}} /> 温馨提示</p>
                <p style={pStyle}>1、您已排队成功，请合理安排时间准时到厂；</p>
                <p style={pStyle}>2、收到叫号通知，请及时入厂以免过号</p>
              </div>

            </div>
        }
      </div>
    );
  }
}

export default FormalQueue;
