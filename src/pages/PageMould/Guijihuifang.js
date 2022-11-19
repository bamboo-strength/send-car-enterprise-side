import React, { PureComponent } from 'react';
import { NavBar, WhiteSpace, Grid, Carousel, Modal, DatePicker, List, LocaleProvider } from 'antd-mobile';
import { Icon, Input, Button, message, Form, Slider, Radio, Progress, Tooltip, Spin, Select } from 'antd';
import router from 'umi/router';
// import { Map, Marker, Polyline } from 'react-amap';
import { getCurrentUser } from '@/utils/authority';
import enUs from 'antd-mobile/lib/date-picker/locale/en_US';
import { createForm } from 'rc-form';
import { gpslocus, getTrucksByConid } from '../../services/guiji';
import moment from 'moment';
import { maps } from '@/utils/MyMap';
import func from '@/utils/Func';
import Func from '@/utils/Func';
import { infowindows, picwindows, stopcarwindows, xytolnglat, infowindowsmove } from '../../components/AMap/common';



const alert = Modal.alert;
const { Search } = Input;
const { Option } = Select;
let nowpointinfo = {
    pointdate: '0000/00/00 00:00:00',// 当前点的时间
    speed: 0,   // 当前车的速度
    weight: 0,   // 重量
}

const pointinfoBydatamap = maps();

const locustype = "locus";
const stopcartype = "stopcar";
const warningtype = "warning";
const picinfowindows = "pic";

let arrypoint = [];    // 存放轨迹点的数组
let stopcarpoint = [];   // 存放停车点数组
let pointinfomap = maps();     // 点信息map
let pointadressmap = maps();   // 点的位置信息
let mark = {};
@Form.create()
class Guijihuifang extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            value: '',
            change: false,
            huifangdisable: false,
            maploading: false,
            pointindex: 0,
            huifangspeed: 650,
            contractId: '',
            carArr: [],
            maxDate: new Date(2130, 12, 12, 23, 59, 59),
            date1: moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).toDate(),
            selectDate1: moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).toDate(),
            initialValue1: moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).toDate(),
            initialValue2: moment(new Date(new Date(new Date().toLocaleDateString()).getTime())).add(3, 'days').toDate()
        };
        this.map = {};
        this.shuang = {}
    }
    componentWillMount() {
        const { location: { state: { object: { contractno } } } } = this.props;
        let contractId = contractno;
        if (contractId !== '' || contractId !== undefined || contractId !== null) {
            this.setState({ contractId: contractId, })
            getTrucksByConid({ contractId: contractId }).then(res => {
                if (res.success) {
                    if (res.data.length > 0) {
                        this.setState({
                            carArr: res.data
                        })
                    } else {
                        message.info('数据为空！');
                    }
                } else {
                    message.info('未加载到数据！');
                }
            })
        }

    }
    componentDidMount() {
        this.map = new window.AMap.Map("guiji_1", { //设置地图容器id
            // viewMode: "3D",         //是否为3D地图模式
            zoom: 10,
        });
        this.infoWindow = new window.AMap.InfoWindow({ offset: new window.AMap.Pixel(0, -10), });
        new window.AMapUI.load(['ui/misc/PathSimplifier'], (PathSimplifier) => {
            if (!PathSimplifier.supportCanvas) {
                alert('当前环境不支持 Canvas！');
                return;
            }
            this.shuang = PathSimplifier
        });
        this.map.plugin(['AMap.Geocoder', 'AMap.Scale'], () => {
            this.geocoder = new AMap.Geocoder();
            this.map.addControl(new AMap.Scale({ offset: new window.AMap.Pixel(20, 50) }))
        })
        this.map.plugin('AMap.GraspRoad', () => {
            this.graspRoad = new AMap.GraspRoad();
        })
    }
    // 重新查询的clear
    reloadlocus = () => {
        this.map.clearMap(); // 清除原覆盖物
        this.infoWindow.close();
        clearTimeout(this.timer1);
        arrypoint = [];
        pointinfomap = maps();     // 点信息map
        pointadressmap = maps();   // 点的位置信息
        stopcarpoint = [];
        mark = {};
        nowpointinfo = {
            pointdate: '0000/00/00 00:00:00',// 当前点的时间
            speed: 0,   // 当前车的速度
            weight: 0,   // 重量
        }
        this.setState({
            huifangdisable: false,
            pointindex: 0,
        })
        if (window.pathSimplifierIns) {
            pathSimplifierIns.setData([])
        }

    }

    chaxun = () => {
        const { value, selectDate1 } = this.state;
        const { form } = this.props;
        this.setState({ change: true, })
        this.reloadlocus()
        form.validateFieldsAndScroll((err, values) => {
            console.log(values);
            if (selectDate1 === undefined) {
                message.error("请选开始时间");
                this.setState({ change: false, })
            } else if (values.dates === undefined) {
                message.error("请选结束时间");
                this.setState({ change: false, })
            } else {
                let time = func.format(func.moment(selectDate1), 'YYYY-MM-DD HH:mm:ss')
                let tiems = func.format(func.moment(values.dates), 'YYYY-MM-DD HH:mm:ss');
                let date1 = (new Date(time)).getTime() / 1000;
                let date2 = (new Date(tiems)).getTime() / 1000;
                if (date2 - date1 > 259200) {
                    message.error("选择时间差不能大于三天");
                    this.setState({ change: false, })
                } else if (Math.sign(date2 - date1) === -1) {
                    message.error("请选择正确时间");
                    this.setState({ change: false, })
                } else {
                    gpslocus({ truckno: value, startTime: time, endTime: tiems }).then(res => {
                        if (res.success) {
                            let locusdata = res.data.gps;
                            if (locusdata.length >= 2) {
                                let path2 = [];
                                let time2 = []
                                locusdata.map((value, index, array) => {
                                    path2.push([value.longitude, value.latitude, value]);
                                    time2.push([value.gpstime])
                                    // 保存时间对应的值
                                    pointinfoBydatamap.set(`${locustype}_${value.gpstime}`, index);

                                    this.setPoint(index, value, locustype);
                                    return value;
                                });
                                let pathSimplifierIns = new this.shuang({
                                    zIndex: 100,
                                    //autoSetFitView:false,
                                    map: this.map, //所属的地图实例

                                    getPath: function (pathData, pathIndex) {

                                        return pathData.path;
                                    },
                                    getHoverTitle: (pathData, pathIndex, pointIndex) => {
                                        if (pointIndex >= 0) {
                                            this.stops()
                                            this.setState({
                                                huifangdisable: false
                                            })
                                            let lon = undefined;
                                            let lag = undefined;
                                            let time = undefined
                                            pathData.path[pointIndex].forEach((element, index) => {
                                                if (index === 0) {
                                                    lon = element
                                                } else if (index === 1) {
                                                    lag = element
                                                } else {
                                                    time = element.gpstime
                                                }
                                            });
                                            let position = new AMap.LngLat(lon, lag);
                                            this.geocoder.getAddress(position, (status, result) => {
                                                let address = `${result.regeocode.formattedAddress}`;
                                                let indowin = infowindowsmove(time, address);
                                                this.infoWindow.setContent(indowin.join(""));
                                                this.infoWindow.open(this.map, position);
                                            })
                                        }
                                    },
                                    renderOptions: {
                                        //轨迹线的样式
                                        pathLineStyle: {
                                            strokeStyle: 'red',
                                            lineWidth: 6,
                                            dirArrowStyle: true
                                        },
                                        renderAllPointsIfNumberBelow: 100 //绘制路线节点，如不需要可设置为-1
                                    }
                                });
                                window.pathSimplifierIns = pathSimplifierIns;

                                //设置数据
                                pathSimplifierIns.setData([{
                                    name: '路线0',
                                    path: path2
                                }]);
                                pathSimplifierIns.on('pointMouseout', (e, info) => {
                                    this.infoWindow.close()
                                });
                                // // 起点
                                const maker1 = new window.AMap.Marker({
                                    position: new window.AMap.LngLat(locusdata[0].longitude, locusdata[0].latitude),
                                    title: this.truckno,
                                    icon: '/image/qidian.png',
                                    offset:new window.AMap.Pixel(-10, -25)
                                });
                                this.map.add(maker1)
                                // 终点
                                const maker2 = new window.AMap.Marker({
                                    position: new window.AMap.LngLat(locusdata[locusdata.length - 1].longitude, locusdata[locusdata.length - 1].latitude),
                                    title: this.truckno,
                                    icon: '/image/zhongdian.png',
                                    offset:new window.AMap.Pixel(-10, -25)
                                });
                                this.map.add(maker2)
                                this.map.setFitView(null, false, [60, 200, 100, 60],7);
                                this.runs();
                                // 关闭查询
                                message.info("轨迹加载完毕");
                                this.setState({
                                    change: false
                                })
                            } else {
                                message.error('没有轨迹信息！');
                                this.setState({
                                    change: false
                                })
                            }
                        } else {
                            this.setState({
                                change: false
                            })
                        }
                    })
                }
            }
        });

    }


    // 停车table点击
    clickstopcar = (ind) => {
        if (stopcarpoint.length >= 2) {
            this.setState({
                huifangdisable: false,
            })
            clearTimeout(this.timer1);
            this.getpointinfowindow(ind, stopcartype, true);
        } else {
            message.warn("停车点信息未加载")
        }
    }

    // 设置轨迹显示点
    setpointXY = (index, isopenwindow) => {
        if (arrypoint.length >= 2) {
            let ind = 0;
            if (Func.isEmpty(index)) {
                let { pointindex } = this.state;
                ind = pointindex;
            } else {
                ind = index;
            }
            const point_locus1 = arrypoint[ind];
            const pointinfo = pointinfomap.get(`${locustype}_${ind}`);
            nowpointinfo = {
                pointdate: pointinfo.pointvalue.gpstime,// 当前点的时间
                speed: pointinfo.pointvalue.speed,   // 当前车的速度
                weight: pointinfo.pointvalue.weight,
            }

            this.slideronchang(index);
            if (Func.notEmpty(mark)) {
                mark.setPosition(point_locus1);
                mark.setAngle(Func.toInt(pointinfo.pointvalue.direction));
            }
            this.setMarkerInfoWindow(index, pointinfo.pointvalue, locustype, isopenwindow);
        } else {
            // message.warn("轨迹信息未加载")
        }
    }

    // 设置mark点击弹出的窗口
    setMarkerInfoWindow = (index, value, pointtype, isopenwindow) => {
        let adress = pointadressmap.get(`${pointtype}_${index}`);
        let pointinfo = pointinfomap.get(`${pointtype}_${index}`);
        let indowin = infowindows(value, adress);
        if (Func.isEmpty(adress)) {
            this.getpointinfowindow(index, pointtype, isopenwindow);
        } else {
            if (pointtype === stopcartype) {
                indowin = stopcarwindows(value, adress);
            } else if (pointtype === locustype) {
                indowin = infowindows(value, adress);
            }
            this.infoWindow.setContent(indowin.join(""));
            this.infoWindow.open(this.map, pointinfo.point);
        }

    };

    // 点点击
    markerclick = (e) => {
        if (Func.isEmpty(e.target.getExtData())) {
            this.infoWindow.setContent(e.target.content);
        } else {
            let index = e.target.getExtData().index;
            let value = e.target.getExtData().value;
            let type = e.target.getExtData().type;
            let pointinfo = pointinfomap.get(`${locustype}_${index}`);
            let adress = pointadressmap.get(`${type}_${index}`);
            let indowin = "";
            if (Func.isEmpty(adress)) {
                this.getpointinfowindow(index, type, true);
            } else {
                if (type === stopcartype) {
                    indowin = stopcarwindows(value, adress);
                } else if (type === locustype) {
                    indowin = infowindows(value, adress);
                } else if (type === picinfowindows) {
                    const titleType = value.titleType;
                    indowin = picwindows(value, adress, titleType);
                }
                this.infoWindow.setContent(indowin.join(""));
                this.infoWindow.open(this.map, e.target.getPosition());
            }
        }
    }

    getpointinfowindow = (index, type, isopen) => {
        let indowin = "";
        let pointinfo = pointinfomap.get(`${type}_${index}`);
        this.geocoder.getAddress(pointinfo.point, (status, result) => {
            let adress = "获取位置中...";
            if (status === 'complete' && result.info === 'OK') {
                adress = `${result.regeocode.formattedAddress}`;
                pointadressmap.set(`${type}_${index}`, adress); infowindows
            }
            if (type === stopcartype) {
                indowin = stopcarwindows(pointinfo.pointvalue, adress);
            } else if (type === locustype) {
                indowin = infowindows(pointinfo.pointvalue, adress);
            } else if (type === picinfowindows) {
                const titleType = pointinfo.pointvalue.titleType;
                indowin = picwindows(pointinfo.pointvalue, adress, titleType);
            }
            this.infoWindow.setContent(indowin.join(""));
            if (isopen) {
                this.infoWindow.open(this.map, pointinfo.point);
            }

        });
    }
    // 设置点数组
    setPoint = (index, value, pointtype) => {
        let point = new window.AMap.LngLat(value.longitude, value.latitude);
        if (pointtype === locustype) {
            arrypoint.push(point);
            if (index === 0) {
                nowpointinfo = {
                    pointdate: value.gpstime,// 当前点的时间
                    speed: value.speed,   // 当前车的速度
                    weight: value.weight,   // 重量
                }
                mark = new window.AMap.Marker({
                    position: point,
                    title: this.truckno,
                    icon: '/image/carrun.png',
                    angle: value.direction,
                    extData: { value: value, type: locustype, index: index },
                });
                this.map.add(mark);
                this.geocoder.getAddress(point, (status, result) => {
                    if (status === 'complete' && result.info === 'OK') {
                        let address = `${result.regeocode.formattedAddress}`;
                        pointadressmap.set(`${pointtype}_${index}`, address);
                        let indowin = infowindows(value, address);
                        this.infoWindow.setContent(indowin.join(""));
                        this.infoWindow.open(this.map, point);
                    }
                });
                mark.on('click', this.markerclick);
            }
        } else if (pointtype === stopcartype) {
            stopcarpoint.push(point);
            let mark1 = new window.AMap.Marker({
                position: point,
                title: this.truckno,
                icon: '/image/tingche.png',
                extData: { value: value, type: stopcartype, index: index },
            });
            this.map.add(mark1);
            mark1.on('click', this.markerclick);
        }
        this.setPointInfo(index, value, pointtype);
    }
    // 设置点信息
    setPointInfo = (index, value, pointtype) => {
        let infomap = {};
        let p = new window.AMap.LngLat(value.longitude, value.latitude);
        infomap = {
            pointvalue: value,    // 点的信息
            point: p,
        };
        pointinfomap.set(`${pointtype}_${index}`, infomap);
    }

    // 获取点位置
    getpointAddress = (index, pointadress, pointtype) => {
        this.geocoder.getAddress(pointadress, (status, result) => {
            if (status === 'complete' && result.info === 'OK') {
                let address = `${result.regeocode.formattedAddress}`;
                pointadressmap.set(`${pointtype}_${index}`, address);
            }
        });
    }

    // 滑动条值改变
    slideronchang = (value) => {
        if (arrypoint.length >= 2) {
            this.setState({
                pointindex: value,
            })
        } else {
            // message.warn("轨迹信息未加载")
        }
    }

    // 开始停止控制
    runs = () => {
        this.setState({
            huifangdisable: !this.state.huifangdisable,
        })
        this.getgpsstart();
    }

    stops = () => {
        this.setState({
            huifangdisable: !this.state.huifangdisable,
        })
        clearTimeout(this.timer1);
    }

    // 上一个点
    lastpoint = () => {
        let { pointindex } = this.state;
        if (pointindex > 0) {
            pointindex--;
            this.setpointindex(pointindex);
        } else {
            message.info("已经是第一个点")
        }
    };

    // 下一个点
    nextpoint = () => {
        let { pointindex } = this.state;
        if (pointindex < arrypoint.length - 1) {
            pointindex++;
            this.setpointindex(pointindex);
        } else {
            message.info("已经是最后一个点")
        }
    }

    // 开始
    getgpsstart = () => {
        let { pointindex, huifangspeed } = this.state;
        pointindex++;
        if (pointindex < arrypoint.length - 1) {
            this.timer1 = setTimeout(() => this.getgpsstart(), Func.toInt(1000 - huifangspeed));
        } else if (pointindex === arrypoint.length - 1) {
            this.setpointindex(pointindex);
            message.info('轨迹回放结束');
        } else if (pointindex > arrypoint.length - 1) {
            pointindex = 0;
            this.timer1 = setTimeout(() => this.getgpsstart(), Func.toInt(1000 - huifangspeed));
        }

        if (this.infoWindow.getIsOpen()) {
            this.setpointXY(pointindex, true);
        } else {
            this.setpointXY(pointindex, false);
        }
    }
    // 设置当前pointindex,并暂停
    setpointindex = (ind) => {
        if (arrypoint.length >= 2) {
            this.setState({
                pointindex: ind,
                huifangdisable: false,
            })
            clearTimeout(this.timer1);
            this.setpointXY(ind, true);
        } else {
            // message.warn("轨迹信息未加载");
        }
    }

    // 回放速度
    bofangspeed = (value) => {
        this.setState({
            huifangspeed: value
        })
    }
    onChange = (value) => {
        if (value === '' || value === undefined || value === null) {
            this.setState({ value: value, })
            this.reloadlocus()
            console.log(this.map.getAllOverlays());
        } else {
            this.setState({ value: value, })
        }

    }
    onSelect = (value) => {
        console.log(value);
    }
    validateIdp = (rule, date, callback) => {
        const { label, required } = this.props
        // console.log(label,required,date,'=====')
        if (required && !date) {
            Toast.info(`请选择${label}`, 1);
            callback(new Error('Invalid Date'));
        }
        callback();
    }
    onValueChange = (date) => {
        this.setState({
            date1: moment(date).toDate(),
            initialValue1: moment(date).toDate(),
            initialValue2: moment(date).add(3, 'days').toDate(),
            maxDate: moment(date).add(3, 'days').toDate(),
        })
        console.log(date);
    }
    onValueChange2 = (date) => {
        this.setState({
            initialValue2: date,
        })
        console.log(date)
    }
    render() {
        const { value, date1, change, huifangdisable, maploading, pointindex, huifangspeed, maxDate, contractId, carArr, initialValue1, initialValue2 } = this.state
        const { form, location: { state: { backUrl } } } = this.props
        const { } = this.props;
        const { getFieldProps, getFieldError } = form
        const marks = {
            400: {
                style: {
                    color: 'green',
                },
                label: <strong>慢速</strong>,
            },
            650: {},
            950: {
                style: {
                    color: '#a22917',
                },
                label: <strong>极速</strong>,
            },
        };
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
                    轨迹回放
                </NavBar>
                <div style={{ width: '100%', height: '220px', paddingTop: '45px' }}>
                    <div>
                        <LocaleProvider>
                            <DatePicker
                                {...getFieldProps('date', {
                                    initialValue: initialValue1,
                                    rules: [
                                        { required: true, message: '请选择时间' },
                                        { validator: this.validateIdp },
                                    ],
                                })}
                                value={date1}
                                onOk={date => this.setState({ selectDate1: date })}
                                onChange={this.onValueChange}
                                maxDate={new Date(2130, 12, 12, 23, 59, 59)}
                                className='data-picker'
                            >
                                <List.Item arrow="horizontal">开始时间:</List.Item>
                            </DatePicker>
                        </LocaleProvider>
                        <LocaleProvider>
                            <DatePicker
                                {...getFieldProps('dates', {
                                    initialValue: initialValue2,
                                    rules: [
                                        { required: true, message: '请选择时间' },
                                        { validator: this.validateIdp },
                                    ],
                                })}
                                // value={date2}
                                // onChange={this.onValueChange2}
                                maxDate={maxDate}
                                className='data-picker'
                            >
                                <List.Item arrow="horizontal">结束时间:</List.Item>
                            </DatePicker>
                        </LocaleProvider>
                    </div>
                    <div>
                        <div style={{ width: '96%', margin: '0 auto', marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>
                            <div style={{ width: '18%', margin: '0 auto', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                <span style={{ fontWeight: 600 }}>合同编号:</span>
                            </div>
                            <div style={{ width: '77%', margin: '0 auto', marginTop: '5px' }}>
                                <Input size="default" placeholder="合同编号" disabled value={contractId} />
                            </div>
                        </div>
                        <div style={{ width: '96%', margin: '0 auto', marginTop: '3px', display: 'flex', justifyContent: 'space-between' }}>

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
                                        carArr.map((item, index) => (
                                            <Option value={item.truckno} key={index}>{item.truckno}</Option>
                                        ))
                                    }
                                </Select>
                            </div>
                            <div style={{ width: '18%', margin: '0 auto', marginTop: '5px', display: 'flex', alignItems: 'center' }}>
                                <Button type="primary" size="default" onClick={this.chaxun} style={{ backgroundColor: 'green', border: 'none' }} loading={change}>{change ? '' : '查询'}</Button>
                            </div>

                        </div>
                    </div>

                </div>
                    <div id='guiji_1' style={{ width: '100%', height: '370px' }}>

                    </div>

                <div>
                    <Slider
                        style={{ width: "80%", margin: '20px auto' }}
                        onChange={this.bofangspeed}
                        tooltipVisible={false}
                        defaultValue={650}
                        min={400}
                        max={950}
                        marks={marks}
                    />
                    <div style={{
                        width: "80%", display: 'flex',
                        justifyContent: 'space-evenly',
                        alignItems: 'center',
                        margin: '0 auto'
                    }}>
                        <Tooltip title="上个轨迹点">
                            <Button
                                onClick={this.lastpoint}
                                shape='circle'
                                icon='backward'
                                style={{ backgroundColor: '#2B907B', border: '0' }}
                            />
                        </Tooltip>
                        {
                            huifangdisable ?
                                <Tooltip title="暂停">
                                    <Button
                                        onClick={this.stops}
                                        shape='circle'
                                        icon='pause'
                                        size='large'
                                        style={{ backgroundColor: '#A22917', border: '0' }}
                                    />
                                </Tooltip>
                                :
                                <Tooltip title="播放">
                                    <Button
                                        onClick={this.runs}
                                        shape='circle'
                                        icon='caret-right'
                                        size='large'
                                        style={{ backgroundColor: '#A22917', border: '0', }}
                                    />
                                </Tooltip>
                        }
                        <Tooltip title="下个轨迹点">
                            <Button
                                onClick={this.nextpoint}
                                shape='circle'
                                icon='forward'
                                style={{ backgroundColor: '#2B907B', border: '0' }}
                            />
                        </Tooltip>
                    </div>
                </div>


            </div>
        )
    }
}
export default Guijihuifang