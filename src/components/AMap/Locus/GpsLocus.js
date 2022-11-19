import React, { Component } from 'react';
import { Map, Marker, Polyline } from 'react-amap';
import { Button, Icon, message, Slider, Radio, Progress, Tooltip, Spin } from 'antd';
import Func from '@/utils/Func';
import { gpslocus, gpsstopcar } from '@/services/gps';
import { maps } from '@/components/Util/MyMap';
import { infowindows, picwindows, stopcarwindows, xytolnglat } from '@/components/AMap/common';
import {
  flowGrosspicDetailService,
  flowMonipicDetailService,
  floworderFenceService, flowTarepicDetailService,
} from '@/services/FloworderInfoService';

const loadingStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}


const Loading = <div style={loadingStyle}>Loading Map...</div>

let nowpointinfo ={
  pointdate :'0000/00/00 00:00:00',// 当前点的时间
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


class GpsLocus extends Component {
  constructor(){
    super();
    const self =this;
    this.state = {
      huifangdisable: false,
      maploading: false,
      pointindex : 0,
      huifangspeed: 650,
    };
    this.eventMap = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance;
        this.infoWindow = new window.AMap.InfoWindow({offset: new window.AMap.Pixel(0, -10)});
        mapInstance.plugin(['AMap.Geocoder'],() => {
          this.geocoder = new window.AMap.Geocoder();
        })
        mapInstance.plugin('AMap.GraspRoad',() =>{
          this.graspRoad =new window.AMap.GraspRoad();
        })
        this.init1(this.props);
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { selectParams, isselectTable, isselect, stopcarpoint, locuspoint, warningpoint,pointDate } = nextProps;
    if (Func.notEmpty(selectParams)){
      this.orderid = selectParams.orderid;
    }
    if (selectParams.deviceno !== this.props.selectParams.deviceno ||
      selectParams.startTime !== this.props.selectParams.startTime || selectParams.endTime !== this.props.selectParams.endTime) {
      if (Func.isEmpty(selectParams.deviceno)) {
        isselectTable(['isselectlocus', false]);
        this.reloadlocus();
      } else {
        if (isselect) {
          this.init1(nextProps);
        }else {
          this.reloadlocus();
        }
      }
    }
    if (locuspoint !== -1 && locuspoint !== this.props.locuspoint){
        this.setpointindex(locuspoint);
    }
    if (stopcarpoint !== -1 && stopcarpoint !== this.props.stopcarpoint) {
      this.clickstopcar(stopcarpoint);
    }
    if (warningpoint !== -1 && warningpoint !== this.props.warningpoint) {

    }
    if (Func.notEmpty(pointDate)){
      const x = pointinfoBydatamap.get(`${locustype}_${pointDate}`);
      this.setpointindex(x);
    }
  }


  init1 = (props)=>{
    const {selectParams,isselectTable,isselect} = props;
    let deviceno = selectParams.deviceno;
    if (Func.notEmpty(deviceno)) {
      if (isselect) {
        if (Func.notEmpty(selectParams.startTime) && (Func.notEmpty(selectParams.endTime))){
          // 轨迹
          this.reloadlocus();
          this.showlocus(deviceno,selectParams.startTime.format('YYYY-MM-DD HH:mm:ss'),selectParams.endTime.format('YYYY-MM-DD HH:mm:ss'));
        }else {
          message.error("请选择查询时间");
          isselectTable(["isselectlocus",false]);
        }
      }
    }
  }

  isloadingmap = (d)=>{
    if(d){
      this.setState({
        maploading:true
      })
    }else {
      this.setState({
        maploading:false
      })
    }
  }

  // 重新查询的clear
  reloadlocus = () => {
    this.mapInstance.remove(this.mapInstance.getAllOverlays()); // 清除原覆盖物
    clearTimeout(this.timer1);
    arrypoint = [];
    pointinfomap = maps();     // 点信息map
    pointadressmap = maps();   // 点的位置信息
    stopcarpoint = [];
    mark = {};
    this.infoWindow.close();
    nowpointinfo ={
      pointdate :'0000/00/00 00:00:00',// 当前点的时间
      speed: 0,   // 当前车的速度
      weight: 0,   // 重量
    }
    this.setState({
      huifangdisable: false,
      pointindex: 0,
    })
  }

  // 轨迹加载
  showlocus = (deviceno, startTime, endTime) => {
    const {selectParams,isselectTable,isselect} = this.props;

    gpslocus({ 'deviceNo': deviceno, 'startTime': startTime, 'endTime': endTime, 'fhdh': '' }).then((res) => {
      if (Func.notEmpty(res) && Func.notEmpty(res.success)){
        if (res.success) {
          let locusdata = res.data.gps;
          if (locusdata.length >= 2) {
            this.stopcardata(deviceno, startTime, endTime);
            if (Func.notEmpty(this.orderid)){
              this.floworderFence(this.orderid);   // 订单获取围栏
              this.getflowMonipicDetail(this.orderid);
              this.getflowGrosspicDetail(this.orderid);
              this.getflowTarepicDetail(this.orderid);
            }
            let path2 = [];
            locusdata.map((value, index, array) => {
              path2.push([value.longitude, value.latitude]);

              // 保存时间对应的值
              pointinfoBydatamap.set(`${locustype}_${value.gpstime}`,index);

              this.setPoint(index,value,locustype);
              return value;
            });
            let newLine = new window.AMap.Polyline({
              path: path2,
              strokeWeight: 5,
              strokeOpacity: 0.8,
              strokeColor: 'green',
              showDir: true,
            });
            this.mapInstance.add(newLine);
            // 起点
            const maker1 = new window.AMap.Marker({
              position: new window.AMap.LngLat(locusdata[0].longitude, locusdata[0].latitude),
              title: this.truckno,
              icon: '/image/qidian.png',
            });
            this.mapInstance.add(maker1)
            // 终点
            const maker2 = new window.AMap.Marker({
              position: new window.AMap.LngLat(locusdata[locusdata.length-1].longitude, locusdata[locusdata.length-1].latitude),
              title: this.truckno,
              icon: '/image/zhongdian.png',
            });
            this.mapInstance.add(maker2)
            this.mapInstance.setFitView();
            this.runs();

            if (isselectTable) {   // 关闭查询
              message.info("轨迹加载完毕");
              isselectTable(["isselectlocus",false])
            }
          } else {
            if (isselectTable) {   // 关闭查询
              isselectTable(["isselectlocus",false])
            }
            message.error('没有轨迹信息！');
          }
        } else {
          if (isselectTable) {   // 关闭查询
            isselectTable(["isselectlocus",false])
          }
          // message.error('没有此设备号，查询轨迹信息失败！');
        }
      }else {
        message.error('服务器异常，查询轨迹信息失败！');
      }

    });
  }

  // 监控照
  getflowMonipicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowMonipicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              res.data.map((value1,index) =>{
                let value = xytolnglat(value1)
                const maker = new window.AMap.Marker({
                  position: new window.AMap.LngLat(value.longitude, value.latitude),
                  title: this.truckno,
                  icon: '/image/pic.png',
                  extData: {value: value,type: picinfowindows,index: index,titleType:"监控拍照点"},
                });
                value = {
                  ...value,
                  titleType: "监控拍照点",
                }
                this.mapInstance.add(maker);
                this.setPointInfo(index,value,picinfowindows);
                maker.on('click', this.markerclick);
                return value;
              })
            }
          }
        }
      })
    }
  }

  // 重车照
  getflowGrosspicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowGrosspicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              res.data.map((value1,index) =>{
                let value = xytolnglat(value1)
                const maker = new window.AMap.Marker({
                  position: new window.AMap.LngLat(value.longitude, value.latitude),
                  title: this.truckno,
                  icon: '/image/pic.png',
                  extData: {value: value,type: picinfowindows,titleType:"重车拍照点",index:index}
                });
                value = {
                  ...value,
                  titleType: "重车拍照点"
                }
                this.mapInstance.add(maker);
                this.setPointInfo(index,value,picinfowindows);
                maker.on('click', this.markerclick);
                return value;
              })
            }
          }
        }
      })
    }
  }

  // 空车照
  getflowTarepicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowTarepicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              (res.data).map((value1,index) => {
                let value = xytolnglat(value1)
                const maker = new window.AMap.Marker({
                  position: new window.AMap.LngLat(value.longitude, value.latitude),
                  title: this.truckno,
                  icon: '/image/pic.png',
                  extData: {value: value,type: picinfowindows,titleType:"空车拍照点",index:index}
                });
                value = {
                  ...value,
                  titleType: "空车拍照点"
                }
                this.mapInstance.add(maker);
                this.setPointInfo(index,value,picinfowindows);
                maker.on('click', this.markerclick);
                return value;
              })
            }
          }
        }
      })
    }
  }


  // 围栏
  floworderFence = (orderId)=>{
    if (Func.notEmpty(orderId)){
      floworderFenceService({id: orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (Func.notEmpty(res.data)){
            if(res.success){
              const fenceList = res.data.fence;
              fenceList.map((value1)=>{
                const value = xytolnglat(value1)
                const gps = value.gps;
                let color = value.colour;
                if (Func.isEmpty(value.colour)) {
                  color = 'red';
                }
                if (Func.notEmpty(gps)) {
                  const gpsarr = gps.split('|');
                  gpsarr.map(a => {
                    if (a.indexOf('-') !== -1) {
                      const gps1 = a.split("-");
                      if (gps1.length === 3){
                        if (Func.notEmpty(gps1[0]) && Func.notEmpty(gps1[1]) && Func.notEmpty(gps1[2])) {
                          const circle = new window.AMap.Circle({
                            center: new window.AMap.LngLat(gps1[0], gps1[1]), // 圆心位置
                            radius: gps1[2],  // 半径
                            strokeColor: color,  // 线颜色
                            fillColor: color,  // 填充颜色
                            fillOpacity: 0.35, // 填充透明度
                          });
                          this.mapInstance.add(circle);
                        }
                      }
                    } else {
                      const arr = a.split(';').map(function(values) {
                        try {
                          return new window.AMap.LngLat(values.split(',')[0], values.split(',')[1]);
                        } catch (e1) {
                          console.log(e1);
                          return null;
                        }
                      }).filter(function(s) {
                        return s && s != null; // 注：IE9(不包含IE9)以下的版本没有trim()方法
                      });

                      const polygon = new window.AMap.Polygon({
                        path: arr,
                        strokeColor: color,
                        strokeWeight: 6,
                        strokeOpacity: 0.5,
                        fillOpacity: 0.4,
                        fillColor: color,
                      });
                      this.mapInstance.add(polygon);

                    }
                    return a;
                  });
                }
                if (Func.notEmpty(value.fenceType) && value.fenceType === 0) {
                  if (Func.notEmpty(value.longitude) && Func.notEmpty(value.latitude) && Func.notEmpty(value.radius)) {
                    if (Func.isEmpty(value.colour)) {
                      value.colour = 'red';
                    }
                    const circle = new window.AMap.Circle({
                      center: new window.AMap.LngLat(value.longitude, value.latitude), // 圆心位置
                      radius: value.radius,  // 半径
                      strokeColor: value.colour,  // 线颜色
                      fillColor: value.colour,  // 填充颜色
                      fillOpacity: 0.35, // 填充透明度
                    });
                    this.mapInstance.add(circle);
                  }
                }
                return value;
              })
            }
          }
        }
      })
    }
  }

  stopcardata = (deviceno, startTime, endTime)=>{
    gpsstopcar({ 'deviceNo': deviceno, 'startTime': startTime,
      'endTime': endTime, 'fhdh': '' }).then((res) => {
      if (Func.notEmpty(res) && Func.notEmpty(res.success)) {
        if (res.success) {
          if(Func.notEmpty(res.data)){
            let stopcardata = res.data.gps;
            if (stopcardata.length >= 1) {
              let path2 = [];
              stopcardata.map((value, index, array) => {
                path2.push([value.longitude, value.latitude]);
                this.setPoint(index,value,stopcartype);
                return value;
              });
            }
          }
        }else {
          message.error('服务器异常，查询停车点信息失败！');
        }
      }else {
        message.error('服务器异常，查询停车点信息失败！');
      }
    })
  }

  // 设置点数组
  setPoint=(index,value,pointtype)=>{
    let point = new window.AMap.LngLat(value.longitude, value.latitude);
    if (pointtype === locustype){
      arrypoint.push(point);
      if (index === 0){
        nowpointinfo ={
          pointdate :value.gpstime,// 当前点的时间
          speed: value.speed,   // 当前车的速度
          weight: value.weight,   // 重量
        }
        mark = new window.AMap.Marker({
          position: point,
          title: this.truckno,
          icon: '/image/carrun.png',
          angle: value.direction,
          extData: {value: value,type: locustype,index: index},
        });
        this.mapInstance.add(mark);
        this.geocoder.getAddress(point, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            let address=`${result.regeocode.formattedAddress}`;
            pointadressmap.set(`${pointtype}_${index}`,address);
            let indowin = infowindows(value,address);
            this.infoWindow.setContent(indowin.join(""));
            this.infoWindow.open(this.mapInstance, point);
          }
        });
        mark.on('click', this.markerclick);
      }
    }else if (pointtype === stopcartype){
      stopcarpoint.push(point);
      let mark1 = new window.AMap.Marker({
        position: point,
        title: this.truckno,
        icon: '/image/tingche.png',
        extData: {value: value,type: stopcartype,index: index},
      });
      this.mapInstance.add(mark1);
      mark1.on('click', this.markerclick);
    }
    this.setPointInfo(index,value,pointtype);
  }

  // 设置点信息
  setPointInfo = (index,value,pointtype) =>{
    let infomap = {};
    let p = new window.AMap.LngLat(value.longitude, value.latitude);
    infomap = {
      pointvalue: value,    // 点的信息
      point: p,
    };
    pointinfomap.set(`${pointtype}_${index}`, infomap);
  }

  // 滑动条点击
  onAfterChange = (value) => {
    if (arrypoint.length>=2){
      this.setpointindex(value);
    }else {
      message.warn("没有轨迹信息")
    }
  }

  // 设置当前pointindex,并暂停
  setpointindex = (ind) =>{
    if (arrypoint.length>=2){
      this.setState({
        pointindex: ind,
        huifangdisable: false,
      })
      clearTimeout(this.timer1);
      this.setpointXY(ind,true);
    }else {
      // message.warn("轨迹信息未加载");
    }
  }

  // 停车table点击
  clickstopcar = (ind) => {
    if (stopcarpoint.length>=2){
      this.setState({
        huifangdisable: false,
      })
      clearTimeout(this.timer1);
      this.getpointinfowindow(ind,stopcartype,true);
    }else {
      message.warn("停车点信息未加载")
    }
  }

  // 设置轨迹显示点
  setpointXY = (index,isopenwindow) =>{
    const {runcallback} = this.props;

    if (arrypoint.length>=2){
      let ind = 0;
      if (Func.isEmpty(index)){
        let {pointindex} = this.state;
        ind = pointindex;
      }else {
        ind = index;
      }
      const point_locus1 = arrypoint[ind];
      const pointinfo = pointinfomap.get(`${locustype}_${ind}`);
      nowpointinfo = {
        pointdate :pointinfo.pointvalue.gpstime,// 当前点的时间
        speed: pointinfo.pointvalue.speed,   // 当前车的速度
        weight: pointinfo.pointvalue.weight,
      }
      runcallback(pointinfo.pointvalue);

      this.slideronchang(index);
      if (Func.notEmpty(mark)){
        mark.setPosition(point_locus1);
        mark.setAngle(Func.toInt(pointinfo.pointvalue.direction));
      }
      this.setMarkerInfoWindow(index,pointinfo.pointvalue,locustype,isopenwindow);
    }else {
      // message.warn("轨迹信息未加载")
    }
  }

  // 设置mark点击弹出的窗口
  setMarkerInfoWindow = (index, value, pointtype,isopenwindow) => {
    let adress = pointadressmap.get(`${pointtype}_${index}`);
    let pointinfo = pointinfomap.get(`${pointtype}_${index}`);
    let indowin = infowindows(value, adress);
    if (Func.isEmpty(adress)) {
      this.getpointinfowindow(index,pointtype,isopenwindow);
    }else {
      if (pointtype === stopcartype){
        indowin = stopcarwindows(value,adress);
      }else if (pointtype === locustype){
        indowin = infowindows(value,adress);
      }
      this.infoWindow.setContent(indowin.join(""));
      this.infoWindow.open(this.mapInstance, pointinfo.point);
    }

  };

  // 点点击
  markerclick = (e) =>{

    if (Func.isEmpty(e.target.getExtData())){
      this.infoWindow.setContent(e.target.content);
    }else {
      let index = e.target.getExtData().index;
      let value = e.target.getExtData().value;
      let type = e.target.getExtData().type;
      let pointinfo = pointinfomap.get(`${locustype}_${index}`);
      let adress = pointadressmap.get(`${type}_${index}`);
      let indowin = "";
      if(Func.isEmpty(adress)){
        this.getpointinfowindow(index,type,true);
      }else {
        if (type === stopcartype){
          indowin = stopcarwindows(value,adress);
        }else if (type === locustype){
          indowin = infowindows(value,adress);
        }else if(type === picinfowindows){
          const titleType = value.titleType;
          indowin = picwindows(value, adress,titleType);
        }
        this.infoWindow.setContent(indowin.join(""));
        this.infoWindow.open(this.mapInstance, e.target.getPosition());
      }
    }
  }

  getpointinfowindow = (index,type,isopen) =>{
    let indowin = "";
    let pointinfo = pointinfomap.get(`${type}_${index}`);
    this.geocoder.getAddress(pointinfo.point, (status, result) => {
      let adress = "获取位置中...";
      if (status === 'complete' && result.info === 'OK') {
        adress=`${result.regeocode.formattedAddress}`;
        pointadressmap.set(`${type}_${index}`,adress);
      }
      if (type === stopcartype){
        indowin = stopcarwindows(pointinfo.pointvalue,adress);
      }else if (type === locustype){
        indowin = infowindows(pointinfo.pointvalue,adress);
      }else if (type === picinfowindows){
        const titleType = pointinfo.pointvalue.titleType;
        indowin = picwindows(pointinfo.pointvalue, adress,titleType);
      }
      this.infoWindow.setContent(indowin.join(""));
      if (isopen){
        this.infoWindow.open(this.mapInstance, pointinfo.point);
      }

    });
  }

  // 获取点位置
  getpointAddress = (index,pointadress,pointtype) =>{
    this.geocoder.getAddress(pointadress, (status, result) => {
      if (status === 'complete' && result.info === 'OK') {
        let address=`${result.regeocode.formattedAddress}`;
        pointadressmap.set(`${pointtype}_${index}`,address);
      }
    });
  }

  // 滑动条值改变
  slideronchang=(value)=>{
    if (arrypoint.length>=2){
      this.setState({
        pointindex: value,
      })
    }else {
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

  stops = ()=>{
    this.setState({
      huifangdisable: !this.state.huifangdisable,
    })
    clearTimeout(this.timer1);
  }

  // 上一个点
  lastpoint = () => {
    let { pointindex } = this.state;
    if (pointindex > 0){
      pointindex--;
      this.setpointindex(pointindex);
    }else {
      message.info("已经是第一个点")
    }
  };

  // 下一个点
  nextpoint = () =>{
    let { pointindex } = this.state;
    if (pointindex < arrypoint.length-1){
      pointindex++;
      this.setpointindex(pointindex);
    }else {
      message.info("已经是最后一个点")
    }
  }

  // 开始
  getgpsstart = () =>{


    let {pointindex,huifangspeed} = this.state;
    pointindex++;
    if (pointindex < arrypoint.length-1) {
      this.timer1 = setTimeout(() => this.getgpsstart(), Func.toInt(1000 - huifangspeed));
    } else if (pointindex === arrypoint.length-1) {
      this.setpointindex(pointindex);
      message.info('轨迹回放结束');
    }else if (pointindex > arrypoint.length-1) {
      pointindex = 0;
      this.timer1 = setTimeout(() => this.getgpsstart(), Func.toInt(1000 - huifangspeed));
    }

    if (this.infoWindow.getIsOpen()){
      this.setpointXY(pointindex,true);
    }else {
      this.setpointXY(pointindex,false);
    }
  }

  // 回放速度
  bofangspeed = (value ) =>{
    this.setState({
      huifangspeed: value
    })
  }



  render() {
    const {huifangdisable,maploading,pointindex,huifangspeed} = this.state;

    const huifangcontrol = {
      width: '100%',
      height: '47px',
      position: 'absolute',
      zIndex: '1',
    }

    const marks = {
      400:  {
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

      <div ref={(ref) => this.divref = ref} style={{ width: '100%', height: '100%' }}>
        <div style={huifangcontrol}>
          <div style={{ height: '5px', width: '50%', marginLeft: '25%', background: 'blue' }}>
            <Slider
              // defaultValue={pointindex}
              onAfterChange={this.onAfterChange}
              onChange={this.slideronchang}
              tooltipVisible={false}
              style={{ padding: '0', margin: '0' }}
              min={0}
              max={arrypoint.length}
              value={typeof pointindex === 'number' ? pointindex : 0}
            />
          </div>
          <div style={{
            height: '96%',
            width: '50%',
            background: '#142C07',
            padding: '3px',
            marginLeft: '25%',
            borderRadius: '0 0 20px 20px',
            overflow: 'hidden',
          }}
          >
              <Slider
                style={{width: "150px",position:"absolute",left:"27%",marginTop: '8px'}}
                onChange={this.bofangspeed}
                tooltipVisible={false}
                defaultValue={650}
                min={400}
                max={950}
                marks={marks}
              />
            <div style={{width:"50%",marginLeft:"25%"}}>
              <Tooltip title="上个轨迹点">
                <Button
                  onClick={this.lastpoint}
                  shape='circle'
                  icon='backward'
                  style={{ backgroundColor: '#2B907B', marginLeft: '30%', border: '0' }}
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
                      style={{ backgroundColor: '#A22917', marginLeft: '20px', border: '0' }}
                    />
                  </Tooltip>
                  :
                  <Tooltip title="播放">
                    <Button
                      onClick={this.runs}
                      shape='circle'
                      icon='caret-right'
                      size='large'
                      style={{ backgroundColor: '#A22917', marginLeft: '20px', border: '0' }}
                    />
                  </Tooltip>
              }
              <Tooltip title="下个轨迹点">
                <Button
                  onClick={this.nextpoint}
                  shape='circle'
                  icon='forward'
                  style={{ backgroundColor: '#2B907B', marginLeft: '20px', border: '0' }}
                />
              </Tooltip>
            </div>

            <span style={{ color: 'green', marginTop: '-29px',position:"absolute",right:"27%"}}>{nowpointinfo.pointdate}</span>
          </div>
        </div>
          <div style={{ width: '100%', height: '100%' }}>
            <Map
              amapkey='4369198bd9cc0c7c743839e4ea9ddd04'
              plugins={['ToolBar']}
              loading={Loading}
              events={this.eventMap}
            >
            </Map>
          </div>
      </div>


    );
  }
}

export default GpsLocus;
