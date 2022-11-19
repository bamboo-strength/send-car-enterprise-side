import React, { PureComponent } from 'react';
import { Map, Marker } from 'react-amap';
import { Icon, Button, Spin } from 'antd';
import { NavBar, Toast, Modal } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import router from 'umi/router';
import { reservationqueueQueueInfo, cancelQueue } from '../../../services/epidemic';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import { requestListApi } from '@/services/api';

class CancelQueue extends PureComponent {

  constructor(props) {
    super(props);
    const that = this;
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
      distance:'init',
      queueInfos: {
        reservationQueue: {},
      },
    };
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
      Toast.info('浏览器不支持获取定位!');
      router.push('/dashboard/function')
    }
  }

  initData=(currentlat,currentlng)=>{ // 根据排队申请中的信息获取厂区 再根据厂区获取厂区经纬度跟半径
    reservationqueueQueueInfo().then(resp=>{
      // console.log(resp.data,'----')
      if(resp.success && resp.data.reservationQueue){
        const {data} =resp
        const {queueStatus} = data.reservationQueue
        this.setState({
          queueInfos:data,
          deptlng:data.longitude,
          deptlat:data.latitude,
          deptRadius:data.deptRadius,
          ifFinish:queueStatus ===2 || queueStatus ===3 , // 排队成功
        },()=>{
          if(!data.longitude || !data.latitude){
            Toast.info('厂区坐标获取失败，请刷新再试')
          }else {
            this.init(currentlat,currentlng)
            this.getPosition(currentlng,currentlat,data.longitude,data.latitude,data.deptRadius)
          }
        })
      }else {
        this.setState({
          ifFinish:false,
          distance:''
        })
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

  getPosition = (currentlng,currentlat,deptlng,deptlat,deptRadius) => {
    if (currentlng && deptlng) {
      const p1 = new window.AMap.LngLat(currentlng, currentlat);
      const p2 = new window.AMap.LngLat(deptlng, deptlat);
      const dis = (Math.round(p1.distance(p2)) / 1000).toFixed(2);
      // 计算点距离
      this.setState({
        distance: dis,
      });
    }
  };

  cancelQueue = () => {
    const { queueInfos } = this.state;
    const {queueStatus} = queueInfos.reservationQueue
    if(queueStatus === 2){// 取消排队
      const msg = (<div>
        您正在<span style={{color:'red',fontWeight:'bold'}}>{queueInfos.deptName}</span>厂区
        <span style={{color:'red',fontWeight:'bold'}}>{queueInfos.coalName}</span>煤种下排队，是否确定取消排队，若取消排队需要重新进行排队申请
      </div>)
      Modal.alert('确定取消排队？', msg, [
        { text: '不取消'},
        {
          text: '确定取消', onPress: () =>
            cancelQueue({ id: queueInfos.reservationQueue.id }).then(resp => {
              if (resp.success) {
                Toast.info('取消排队成功');
                router.push('/dashboard/function');
              }
            }),
        },
      ]);
    }else { // 结束
      Modal.alert('确定结束排队？', '您已被叫号，叫号后结束排队不进行退款，是否结束?', [
        { text: '取消'},
        {
          text: '确定', onPress: () =>
            cancelQueue({ id: queueInfos.reservationQueue.id }).then(resp => {
              if (resp.success) {
                Toast.info('结束排队成功');
                router.push('/dashboard/function');
              }
            }),
        },
      ]);
    }

  };

  back = () => { // 退出页面
    router.push('/dashboard/function');
  };

  render() {

    const phSty = {
      width: '90%',
      height: '140px',
      backgroundImage: 'linear-gradient(to right,#6492F7,#4D7BF6,#3563F5)',
      margin: '0px auto',
      borderRadius: '10px',
      textAlign: 'center',
      boxShadow: '4px 8px 4px #d9e1f8',
      color: '#f9f5f5',
    };
    const pStyle = {};
    const p2Sty = {
      width: '50%',
      fontWeight: 'bold',
    };
    const div2Sty = {
      display: 'flex', flexWrap: 'wrap', textAlign: 'center', paddingTop: '20px', color: 'black',
      backgroundColor: 'white',
      width: '90%',
      margin: '0px auto',
      borderBottomRightRadius: '10px',
      borderBottomLeftRadius: '10px',
    };
    const { ifFinish, distance, queueInfos } = this.state;
    const {queueStatus} = queueInfos.reservationQueue
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/dashboard/function');
          }}
          rightContent={[
            <Icon key="0" type="redo" style={{ fontSize: '24px', marginRight: '20px' }} onClick={() => location.reload()} />,
          ]}
        >取消排队
        </NavBar>
        <div style={{ width: '100%', height: '360px' }}>
          <Map
            plugins={['ToolBar']}
            //  loading={Loading}
            zoom={13}
            events={this.amapEvents}
          >
            {/*    <Marker events={this.markerEvents} /> */}
          </Map>
        </div>
        {
          !ifFinish ? // 未完成排队
            <div style={{ backgroundColor: 'white', padding: '30px 10px', textAlign: 'center' }}>
              {distance !== 'init' ? <EmptyData text='暂无排队记录' height='calc( 100vh - 400px)' /> :
              <InTheLoad tip='数据加载中，请稍后' height='calc( 100vh - 400px)' />}
              {/* 数据加载中，请稍后 */}
            </div> :
            <div>
              <div style={phSty}>
                <div style={{
                  paddingTop: '15px',
                  fontSize: '14px',
                }}
                >{queueStatus===2?'排队成功':'已被叫号'}，您的排队号为
                </div>
                <div style={{ fontSize: '40px', fontWeight: 'bold', margin: '5px 0px' }}>
                  {queueInfos.reservationQueue.queueNumber}
                </div>
                <p>您前面有 <Text type='danger' style={{ fontWeight: 'bold' }}>{queueInfos.queueVehicleCount}</Text> 辆车正在排队
                </p>
              </div>
              <div style={div2Sty}>
                <p style={p2Sty}>距离厂区 <Text type='danger'>{distance}</Text> 公里</p>
                <p style={p2Sty}>预计<Text type='danger'>{queueInfos.reservationQueue.expectedArrival}</Text>小时到厂</p>
              </div>
              <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '90%',
                margin: '20px auto',
                padding: '0px 5px',
              }}
              >
                <Button type='primary' style={{ height: '40px', width: '45%' }} onClick={this.cancelQueue}>
                  {queueStatus===2?'取消排队':'结束'}
                </Button>
                <Button type='dashed' style={{ height: '40px', width: '45%' }} onClick={this.back}>
                  返回
                </Button>
              </div>
              <div style={{ width: '90%', margin: '0px auto' }}>
                <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '20px 5px', color: 'black' }}><Icon type="exclamation-circle" theme="filled" style={{ color: '#6895F7' }} /> 温馨提示</p>
                <p style={pStyle}>1、取消排队，需要重新进行排队申请；</p>
                {/* <p style={pStyle}>2、若系统开放收取排队服务费，取消排队后服务费将会在1~2天内线上退款给您，请留意微信退款通知，如有疑问，可拨打400-773-5868进行咨询。</p>
                */}
              </div>

            </div>
        }
      </div>
    );
  }
}

export default CancelQueue;
