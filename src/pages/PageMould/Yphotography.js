import React, { PureComponent } from 'react';
import { NavBar, WhiteSpace, Grid, Carousel, Picker, List,Modal } from 'antd-mobile';
import { Icon } from 'antd';
import router from 'umi/router';
import { checkpic } from '../../services/photograph';
import { getCurrentUser } from '@/utils/authority';

const alert = Modal.alert;
class Yphotograph extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            visible: false,
            value: ''
        };
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
                currentlat: latitude,
            }, () => {
                this.initData(latitude, longitude,)
            })
        }
    }
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
        const {value} = this.state;
        let truckno = car;
        let fhdh = id;
        if (value === '') {
            const alertInstance = alert('拍照提示','请选择异常拍照原因！',[
                { text: '确定', onPress: () => console.log('ok') },
              ]);
              setTimeout(() => {
                // 可以调用close方法以在外部close
                console.log('auto close');
                alertInstance.close();
              }, 500000); 
        }else{
            checkpic({ 'truckno': truckno, 'fhdh': fhdh, 'tenantId': tenantId, 'picType': '1' }).then(res => {
                if (res.msg === '可以上传') {
                    res.data.truckno = truckno;
                    res.data.remark = value;
                    res.data.fhdh = fhdh
                    router.push({pathname:'/dashboard/zhongchepaizhao',query:{data:res.data}})
                }
            })
        }
      

    }
    kongchepaizhao = () => {
         const {location:{query:{car,id}}} = this.props
         const tenantId = getCurrentUser().tenantId;
         const {value} = this.state;
         let truckno = car;
         let fhdh = id;
         if (value === '') {
             const alertInstance = alert('拍照提示','请选择异常拍照原因！',[
                 { text: '确定', onPress: () => console.log('ok') },
               ]);
               setTimeout(() => {
                 // 可以调用close方法以在外部close
                 console.log('auto close');
                 alertInstance.close();
               }, 500000); 
         }else{
             checkpic({ 'truckno': truckno, 'fhdh': fhdh, 'tenantId': tenantId, 'picType': '2' }).then(res => {
                 if (res.msg === '可以上传') {
                     res.data.truckno = truckno;
                     res.data.remark = value;
                     res.data.fhdh = fhdh;
                     router.push({pathname:'/dashboard/kongchepaizhao',query:{data:res.data}})
                 }
             })
         }
    }
    onChanges = (value) => {
        this.setState({
            value: value,
        });
    }
    render() {
        const data = [
            {
                label: '未找到派车单',
                value: '未找到派车单',
            }, {
                label: '不在围栏内',
                value: '不在围栏内',
            },
            //  {
            //     label: '其他请填写',
            //     value: '其他请填写',
            // }
        ]
        const {location:{query:{car,id}}} = this.props
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
                    异常拍照
                </NavBar>
                <div style={{ width: '100%', height: '80px', background: 'white', display: 'flex', marginTop: '20px', justifyContent: 'center', }}>
                    <div style={{ width: '28%', fontWeight: 600 }}>
                        <p style={{ marginTop: '15px' }}>车号</p>
                        <p>原因</p>
                    </div>
                    <div style={{ width: '60%', fontWeight: 600 }}>
                        <p style={{ marginTop: '15px' }}>{car ===undefined ?  <spam>&nbsp;</spam>:car === '' ? <spam>&nbsp;</spam>:car}</p>
                        <Picker
                            data={data}
                            value={this.state.value}
                            cols={1}
                            onChange={this.onChanges}
                        >
                            <p style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}><span>{this.state.value}</span><Icon type="right"></Icon></p>
                        </Picker>
                    </div>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '30px' }}>
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
export default Yphotograph