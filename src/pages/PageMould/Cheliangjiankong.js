import React, { PureComponent } from 'react';
import { NavBar, WhiteSpace, Grid, Carousel, Modal } from 'antd-mobile';
import { Icon, Input, Button, Form, Select, message } from 'antd';
import router from 'umi/router';
import { gpsArr, getTrucksByConid } from '@/services/guiji';
import { createMakers } from '../../utils/Operate';
import { reservationqueueQueueInfo } from '@/services/epidemic';
import { wgs84togcj02 } from 'coordtransform';

const alert = Modal.alert;
const { Option } = Select;
class Cheliangjiankong extends PureComponent {
    constructor(props) {
        super(props);
        const self = this;
        this.state = {
            value: '',
            carArr: [],
            carArrs: [],
        };
        this.map = {}
    }
    componentWillMount() {
        const { location: { state: { object: { contractno } } } } = this.props;
        console.log(this.props);
        if (contractno !== '' || contractno !== null || contractno !== undefined) {
            this.setState({
                value: contractno,
            })
        }
    }
    componentDidMount(){
        this.map = new window.AMap.Map("jiankong", { //设置地图容器id
            // viewMode: "3D",         //是否为3D地图模式
            zoom: 10,
        });
        this.map.on('zoomend', () => {
            this.map.clearInfoWindow();
        });
        this.map.plugin(['AMap.Geocoder'], () => {
            this.geocoder = new AMap.Geocoder();
        });
        this.map.plugin(['AMap.MarkerCluster'], () => {
            this.cluster = new AMap.MarkerClusterer(this.map, [], { gridSize: 60, renderMarker: this.renderMarker, });
          });

        this.gpsArr()
        this.getTrucks()
    }
    gpsArr = () => {
        const { value } = this.state;
        gpsArr({ contractId: value }).then(res => {
            if (res.success) {
                if (res.data.length > 0) {
                    this.setState({
                        carArr: res.data
                    })
                    let cp = new window.AMap.LngLat(res.data[0].longitude, res.data[0].latitude);
                    this.map.setCenter(cp)
                    this.createPolymerization(res.data)
                } else {
                    message.info('数据为空！');
                }
            } else {
                message.info('未加载到数据！');
            }
        })
    }
    getTrucks = () => {
        const { value } = this.state;
        getTrucksByConid({ contractId: value }).then(res => {
            if (res.success) {
                if (res.data.length > 0) {
                    this.setState({
                        carArrs: res.data
                    })
                }
            }
        })
    }
    onChange = (c) => {
        const { value } = this.state;
        if (c !== undefined) {
            gpsArr({ truckNo: c, contractId: value }).then(res => {
                if (res.success) {
                    if (res.data.length === 0) {
                        message.info('该车辆没有安装设备');
                        this.map.clearMap();    // 清除原覆盖物
                        this.infoWindow.close();
                    } else {
                        let cp = new window.AMap.LngLat(res.data[0].longitude, res.data[0].latitude);
                        this.map.setCenter(cp)
                        this.createPolymerization(res.data)
                    }
                } else {
                    message.info('未加载到数据！');
                }
            })
        } else {
            this.gpsArr()
        }
    }
    onSelect = (value) => {

    }
    renderMarker = (a) => {
        let { truckNo, direction, } = a.data[0]
        a.marker.setIcon('/image/carrun.png')
        a.marker.setTitle(truckNo)
        a.marker.setAngle(direction)
        // a.marker.setOffset(new window.AMap.Pixel(-10, -20))
        a.marker.on('click', () => this.clickIn(a.data[0], a.marker))
      }
      clickIn = (data, marker) => {
        let { truckNo, lnglat, speed, direction, gpstime, contractId } = data
        this.marker = marker
        this.geocoder.getAddress(lnglat, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            let contentArr = [`<div>车牌号码：${truckNo}</div>
                              <div>合同编号：${contractId}</div>
                              <div>GPS地址：${result.regeocode.formattedAddress}</div>
                              <div>GPS时间：${gpstime}</div>
                              <div>速度：${speed} km/h</div>`]
            this.infoWindow = new AMap.InfoWindow({ content: contentArr, });
            this.infoWindow.open(this.map, lnglat)
          }
        })
      }
    constructorMakers = () => {
        // const { obj } = this.state
        // const cluster = new window.AMap.MarkerClusterer(this.mapInstance,this.makers,{gridSize: 20})
        if (this.cluster == undefined) {
            this.cluster = new window.AMap.MarkerClusterer(this.mapInstance, this.makers, { gridSize: 20 });
        } else {
            this.cluster.setMarkers(this.makers);
        }
        //this.mapInstance.setFitView();
        //this.mapInstance.setZoom(4)

    };
    createPolymerization = (carArr) => {
        message.info('数据加载完毕！');
        carArr.forEach(l => {
            let convertGPS = wgs84togcj02(l.longitude, l.latitude);
            l.lnglat = new window.AMap.LngLat(convertGPS[0], convertGPS[1]);
        });
        this.cluster.setData(carArr)
    };
    render() {
        const { value, carArr, carArrs } = this.state;
        const { location: { state: { backUrl } } } = this.props;
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
                            onClick={() => router.push(`${backUrl}`)}
                        />,
                    ]}
                >
                    车辆监控
                </NavBar>
                <div style={{ width: '100%', height: "140px", paddingTop: '50px' }}>
                    <div style={{ width: '96%', margin: '0 auto', marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '18%', margin: '0 auto', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>合同编号:</span>
                        </div>
                        <div style={{ width: '77%', margin: '0 auto', marginTop: '5px' }}>
                            <Input size="default" placeholder="合同编号" disabled value={value} />
                        </div>
                    </div>
                    <div style={{ width: '96%', margin: '0 auto', marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ width: '18%', margin: '0 auto', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                            <span style={{ fontWeight: 600 }}>车牌号码:</span>
                        </div>
                        <div style={{ width: '77%', margin: '0 auto', marginTop: '5px' }}>
                            <Select
                                showSearch
                                style={{ width: '100%' }}
                                placeholder="请选择车号"
                                optionFilterProp="children"
                                onChange={this.onChange}
                                onSelect={this.onSelect}
                                allowClear
                                filterOption={(input, option) =>
                                    option.props.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                                }
                            >
                                {
                                    carArrs.map((item, index) => (
                                        <Option value={item.truckno} key={index}>{item.truckno}</Option>
                                    ))
                                }
                            </Select>
                        </div>

                    </div>
                </div>
                <div style={{ width: '100%', height: '500px', overflow: 'hidden' }}>
                    <div id='jiankong' style={{ width: '100%', height: '520px' }}>
                       
                    </div>
                </div>
            </div>
        )
    }
}
export default Cheliangjiankong