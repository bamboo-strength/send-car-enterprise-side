import React, { PureComponent } from 'react';
import { NavBar, WhiteSpace, Grid, Carousel, Modal } from 'antd-mobile';
import { Icon } from 'antd';
import router from 'umi/router';
import { Map, Marker, Polyline } from 'react-amap';
import { isregion, checkpic } from '../../services/photograph';
import { getCurrentUser } from '@/utils/authority';

const alert = Modal.alert;
class Photograph extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
        this.eventMap = {
            created: (mapInstance) => {
                this.mapInstance = mapInstance;
                this.infoWindow = new window.AMap.InfoWindow({ offset: new window.AMap.Pixel(0, -10) });
                mapInstance.plugin(['AMap.Geocoder'], () => {
                    this.geocoder = new window.AMap.Geocoder();
                })
                this.getLocationFromAndroid()
            }
        }
    }
    getLocationFromAndroid = () => { // 从安卓外壳获取数据
        const state = LocationStatus.getLocationStatus();
        if (JSON.stringify(JSON.parse(state)) === 'false') {
            Toast.offline('请检查定位开启状态！！');
        } else {
            const location = Location.getLocation();
            const longitude = JSON.stringify(JSON.parse(location).longitude)
            const latitude = JSON.stringify(JSON.parse(location).latitude)
            // Toast.info(location)
            this.setState({
                currentlng: longitude,
                currentlat: latitude
            }, () => {
                this.initData(latitude, longitude,)
                // this.jiancha(36.68867609, 117.1354862)
                // this.jiancha(latitude, longitude)
            })
        }
    }
    // jiancha = (latitude, longitude) => {
    //     const {location:{query:{car,id}}} = this.props;
    //     const tenantId = getCurrentUser().tenantId;
    //     const { value } = this.state;
    //     let truckno = car;
    //     let fhdh = id;
    //     checkpic({ 'truckno': truckno, 'fhdh': fhdh, 'tenantId': tenantId, 'picType': '2' }).then(res => {
    //         if (res.msg === '可以上传') {
    //             res.data.truckno = truckno;
    //             res.data.remark = value;
    //             res.data.fhdh = fhdh;
    //             router.push({ pathname: '/dashboard/kongchepaizhao', query: { data: res.data } })
    //         }
    //     })
       
    // }
    initData = (latitude, longitude) => {
        const currentMarker = new window.AMap.Marker({
            position: [longitude, latitude],
        });
        this.mapInstance.add(currentMarker);
        this.mapInstance.setCenter([longitude, latitude]);
    }
    zhongchepaizhao = () => {
        const {location:{query:{car,id}}} = this.props
        const tenantId = getCurrentUser().tenantId;
        const { value } = this.state;
        let truckno = car;
        let fhdh = id;
        checkpic({ 'truckno': truckno, 'fhdh': fhdh, 'tenantId': tenantId, 'picType': '1' }).then(res => {
            if (res.msg === '可以上传') {
                res.data.truckno = truckno;
                res.data.remark = value;
                res.data.fhdh = fhdh
                router.push({ pathname: '/dashboard/zhongchepaizhao', query: { data: res.data } })
            }
        })
    }
    kongchepaizhao = () => {
        const {location:{query:{car,id}}} = this.props
        const tenantId = getCurrentUser().tenantId;
        const {currentlng,currentlat} = this.state;
        const { value } = this.state;
        let truckno = car;
        let fhdh = id;
        isregion({ 'latitude': currentlat + '', 'longitude': currentlng + '', 'fhdh': fhdh, 'truckno': truckno, 'tenantId': tenantId }).then(res => {
            if (res.success) {
                const alertInstance = alert('提示', <p>{res.msg}</p>, [
                    { text: '确定', onPress: () => console.log('ok') },
                ]);
                setTimeout(() => {
                    // 可以调用close方法以在外部close
                    console.log('auto close');
                    alertInstance.close();
                }, 500000);
                checkpic({ 'truckno': truckno, 'fhdh': fhdh, 'tenantId': tenantId, 'picType': '2' }).then(res => {
                    if (res.msg === '可以上传') {
                        res.data.truckno = truckno;
                        res.data.remark = value;
                        res.data.fhdh = fhdh;
                        router.push({ pathname: '/dashboard/kongchepaizhao', query: { data: res.data } })
                    }
                })
            } else {
                const alertInstance = alert('提示', <p>{res.msg}</p>, [
                    { text: '确定', onPress: () => router.push('/dashboard/menu') },
                ]);
                setTimeout(() => {
                    // 可以调用close方法以在外部close
                    console.log('auto close');
                    alertInstance.close();
                }, 500000);
            }
        })
    }
    render() {
        const {location:{query:{car,id,custName,materialsName}}} = this.props
        return (
            <div>
                <NavBar
                    mode="light"
                    leftContent={[
                        <Icon
                            key="0"
                            type="left"
                            // theme="twoTone"
                            style={{ marginRight: '16px', fontSize: 20 }}
                            onClick={() => router.push('/dashboard/menu')}
                        />,
                    ]}
                >
                    到货拍照确认
                </NavBar>
                <div style={{ width: '100%', height: '400px' }}>
                    <Map
                        amapkey='4369198bd9cc0c7c743839e4ea9ddd04'
                        plugins={['ToolBar']}
                        // loading={Loading}
                        zoom={13}
                        events={this.eventMap}
                    >
                    </Map>
                </div>
                <div style={{ width: '100%', height: '160px', background: 'white', display: 'flex', marginTop: '10px', justifyContent: 'center', }}>
                    <div style={{ width: '28%', fontWeight: 600 }}>
                        <p style={{ marginTop: '15px' }}>车号</p>
                        <p>产品</p>
                        <p>发货单号</p>
                        <p>客户</p>
                    </div>
                    <div style={{ width: '60%', fontWeight: 600 }}>
                        <p style={{ marginTop: '15px' }}>{car===undefined? <spam>&nbsp;</spam>:car===''? <spam>&nbsp;</spam>:car}</p>
                        <p>{materialsName === undefined ? <spam>&nbsp;</spam>:materialsName === ''? <spam>&nbsp;</spam>:materialsName}</p>
                        <p>{id === undefined? <spam>&nbsp;</spam>:id === ''? <spam>&nbsp;</spam>:id}</p>
                        <p>{custName === undefined ? <spam>&nbsp;</spam>:custName === '' ? <spam>&nbsp;</spam>:custName}</p>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '20px' }}>
                    <div style={{
                        width: '100px', height: '90px', border: '4px solid #199edd', borderRadius: '10px'
                        , display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Icon type="video-camera" style={{ fontSize: '70px', color: '#199edd' }} onClick={this.zhongchepaizhao} />
                    </div>
                    <div style={{
                        width: '100px', height: '90px', border: '4px solid #545456', borderRadius: '10px'
                        , display: 'flex', justifyContent: 'center', alignItems: 'center'
                    }}>
                        <Icon type="video-camera" style={{ fontSize: '70px' }} onClick={this.kongchepaizhao} />
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', fontWeight: '600', marginTop: '10px' }}>
                    <p>重车拍照</p>
                    <p>空车拍照</p>
                </div>


            </div>
        )
    }
}
export default Photograph