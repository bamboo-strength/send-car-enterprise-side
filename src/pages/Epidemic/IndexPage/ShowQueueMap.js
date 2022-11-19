import React, { PureComponent } from 'react';
import { Map } from 'react-amap';
import { Icon, Button, Spin } from 'antd';
import { NavBar,Toast,Modal } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import router from 'umi/router';
import {getByDeptId} from '../../../services/epidemic'


class EpidemicAdd extends PureComponent {

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
            buttonPosition: 'RB'
          });
           // mapInstance.addControl(geolocation);
          geolocation.getCurrentPosition()
          new window.AMap.event.addListener(geolocation, 'complete', (result) => {
           // console.log(result.position.getLat(),result.position.getLng(),'----')
            const currentlng = result.position.getLng()
            const currentlat = result.position.getLat()
            that.initData(currentlat,currentlng)
          })
        });
      }
    };
    this.state = {
      queueInfos:{

      }
    }
  }

  initData=(currentlat,currentlng)=>{ // 根据排队申请中的信息获取厂区 再根据厂区获取厂区经纬度跟半径
    // reservationqueueQueueInfo().then(resp=>{
    //   if(resp.success && resp.data.reservationQueue){
        const {location} = this.props
        const {deptId,queueInfos} = location.state
        getByDeptId({deptId}).then(rep=>{
          // console.log(rep,'----')
          if(rep.success){
            const {data} = rep
              this.setState({
                queueInfos,
                deptlng:data.longitude,
                deptlat:data.latitude,
                deptRadius:data.deptRadius,
                currentlat,currentlng,
              },()=>{
                if(!data.longitude || !data.latitude){
                  Toast.info('厂区坐标获取失败，请稍后再试')
                }else {
                  this.init()
                  this.getPosition()
                }
              })

          }
        })
    //   }else {
    //     Modal.alert('当前没有排队信息','如需再次排队，请先进行排队申请',[
    //       {text:'取消',onPress:()=>router.push('/dashboard/function')},
    //       {text:'去申请',onPress:()=>router.push('/epidemic/EpidemicLineUp')},
    //     ])
    //   }
    // })
  }

  init=()=>{ // 初始化当前位置 围栏
    const {deptlng,deptlat,deptRadius,currentlng, currentlat} = this.state
    const currentmarker = new window.AMap.Marker({
      icon: '/image/mark.png',
      position: [currentlng, currentlat]
    });
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
    this.mapInstance.add([currentmarker,deptmarker,circle]);
  }

  getPosition=()=>{
    const {currentlat,currentlng,deptlng,deptlat,deptRadius,} = this.state
    console.log(currentlng,currentlat,deptlng, deptlat,'===坐标')
    if(!currentlng || !currentlat){
      Toast.info('当前坐标获取失败，请刷新再试')
      return
    }
    const p1 = new window.AMap.LngLat(currentlng,currentlat)
    const p2 = new window.AMap.LngLat(deptlng, deptlat)
    const dis =  (Math.round(p1.distance(p2)) / 1000).toFixed(2)
    console.log(p1.distance(p2),'===距离')

    // console.log(dis,deptRadius,'----+++')
    // 计算点距离

    if(dis > deptRadius){
    //  Toast.info(`未到达厂区${deptRadius}公里内，暂无法排队，请进入范围内进行排队`)
      this.setState({
        distance:dis,
        ifInRange:false,
      })
    }else {
      this.setState({
        distance:dis,
        ifInRange:true,
      })
    }
}

  back=()=>{
    const {location} = this.props
    const detail = {
      plantAreaId:location.state.plantAreaId
    }
    router.push({
      pathname:'/epidemic/indexpage/goodsByDept/undefined',
      state:{
        detail
      }
    })
  }

  render() {
  const spanSty = {
     padding: '0px 5px',fontWeight:'bold',color:'red'
  }
  const pStyle = {

  }
  const phSty = {
    width: '90%',
    height: '120px',
    backgroundImage: 'linear-gradient(to right,#6492F7,#4D7BF6,#3563F5)',
    margin: '0px auto',
    borderRadius: '10px',
    textAlign:'center',
    boxShadow: '4px 8px 4px #d9e1f8',
    color: 'white'
  }
  const p2Sty ={
    width:'100%',
    fontWeight:'bold'
  }
  const div2Sty ={
    display:'flex',flexWrap:'wrap',textAlign:'center',paddingTop:'20px',color:'black',
    backgroundColor: 'white',
    width: '90%',
    margin: '0px auto',
    borderBottomRightRadius: '10px',
    borderBottomLeftRadius: '10px',
  }
  const {distance,ifInRange,queueInfos} = this.state
    // console.log(queueInfos,'===')
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('')}
          rightContent={[
            <Icon key="0" type="redo" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => location.reload()} />,
          ]}
        >货场排队情况
        </NavBar>
        <div style={{width:'100%',height:'320px'}}>
          <Map
            plugins={['ToolBar']}
            //  loading={Loading}
            zoom={5}
            events={this.amapEvents}
          >
          </Map>
        </div>
        <div style={{backgroundColor:'white',paddingBottom:'30px'}}>
          {
            distance ?
              ifInRange?
                <div style={div2Sty}>
                  {/* <p style={p2Sty}>排队还有<Text type='danger'>{queueInfos.queueVehicleCount}</Text>辆</p> */}
                  {/* <p style={p2Sty}>预计等待<Text type='danger'>×</Text>小时</p> */}
                  <p style={p2Sty}>已到达厂区排队范围内</p>
                  <p style={p2Sty}>距离厂区<Text type='danger'>{distance}</Text>公里</p>
                </div>
                :
                <div style={div2Sty}>
                  <p><Icon type="exclamation-circle" theme="twoTone" twoToneColor='red'/> &nbsp;提示：</p>
                  <p style={p2Sty}> 未进入厂区范围，请进入厂区<span style={spanSty}>{distance}</span>范围后进行排队</p>
                  <p style={p2Sty}> 当前已有排队车<span style={spanSty}>{queueInfos.queueVehicleCount}</span>辆</p>
                  <p style={p2Sty}> 距离厂区还有<span style={spanSty}>{distance}</span>公里</p>
                </div>:
                <Spin style={{margin:'20px 50%'}} />
          }

        </div>
      </div>
    );
  }
}

export default EpidemicAdd;
