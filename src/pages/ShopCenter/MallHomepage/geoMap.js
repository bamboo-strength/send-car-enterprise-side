import React, { PureComponent } from 'react';
import { Button, Icon } from 'antd';
import { NavBar, Toast } from 'antd-mobile';
import {Map, Marker} from 'react-amap'
import Text from 'antd/lib/typography/Text';
import router from 'umi/router';

class GeoMap extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      lnglat:{},
      geocodes:{}
    }
    const {location:{state}} = props
    if (state !== undefined){
      const {details} = state
      this.toolEvents ={
        created:(tool)=>{
          this.tool = tool
          tool.plugin(['AMap.Geocoder'], () => {
            this.geocoder = new window.AMap.Geocoder({
              city: details.cityCode, // 城市默认设置选择的发货地址，收货地址
              radius: 500, // 范围，默认：500
              extensions:true,
            })
          })
          this.geocoder.getLocation(details.city+details.district+details.factoryAddress,(status,result)=>{
            if (status === 'complete' && result.geocodes.length) {
              this.setState({
                lnglat: result.geocodes[0].location,
                geocodes:result.geocodes[0]
              })
            } else {
              Toast.fail('根据地址查询位置失败')
            }
          })
        }
      }
      this.mapPlugins = ['ToolBar'];
    }else {
      router.push('/shopcenter/mallhomepage')
    }
  }

  navigation = () => {
    const {geocodes} = this.state
    try {
      NavigaTion.toDestination(JSON.stringify(geocodes))
    }catch (e) {
      Toast.fail('调用导航失败！')
    }
  }

  render() {
    const {location:{state}} = this.props
    let detail = {}
    if (state === undefined){
      router.push('/shopcenter/mallhomepage')
    }else {
      detail = state.details
    }
    const {lnglat} = this.state
    this.mapCenter = lnglat;
    this.markerPosition = lnglat;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >导航
        </NavBar>
        <div className='am-list'>
          <div style={{width:'100%',height:'calc( 100vh - 125px)'}}>
            <Map
              plugins={this.mapPlugins}
              center={JSON.stringify(lnglat) !== '{}'?this.mapCenter:''}
              events={this.toolEvents}
              zoom={15}
            >
              {JSON.stringify(lnglat) !== '{}'?<Marker position={this.markerPosition} />:''}
            </Map>
          </div>
          <div style={{ background: 'white', padding: 15, position: 'fixed', bottom: 0, width: '100%', zIndex: 999,display:'flex',justifyContent: 'space-between',alignItems: 'center' }}>
            <div>
              <Text strong style={{fontSize:18}}>{detail.factoryAddress}</Text> <br />
              <Text>{detail.province}{detail.district}{detail.city}</Text>
            </div>
            <Button type="primary" onClick={this.navigation}>导航</Button>
          </div>
        </div>
      </div>
    );
  }
}


export default GeoMap;
