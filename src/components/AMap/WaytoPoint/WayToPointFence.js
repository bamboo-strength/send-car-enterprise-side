import React, { PureComponent } from 'react';
import { Popconfirm, message,Spin, Icon,Switch, Drawer, Cascader,notification } from 'antd';
import { Map,MouseTool } from 'react-amap';
import { maps } from '@/components/Util/MyMap';
import Func from '@/utils/Func';

const key = "c6491852af21b06d5c821ca2b5213e6b";

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  left: '10px'
};

const circleType = "circleway";

let waypointList = [];
export default class WayToPointFence extends PureComponent {
  constructor(){
    super();
    const self =this;
    this.state = {
      what: '点击下方按钮开始绘制',
      index: 0,
      isview: false
    };
    this.amapEvents = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance;
        this.init2()
      },
    };
    this.toolEvents = {
      created: (tool) => {
        self.tool = tool;
      },
      draw({obj}) {
        self.drawWhat(obj);
      }
    }
    this.mapPlugins = ['ToolBar'];
    this.mapCenter = {longitude: 120, latitude: 35};
  }

  componentWillMount() {
    waypointList = [];
  }

  init2 = ()=>{
    const {waypoint} = this.props;
    if (!Func.isEmpty(waypoint)){
      if (waypoint.length>0){
        waypoint.map((a) =>{
          let circle1 = new window.AMap.Circle({
            center: new window.AMap.LngLat(a.longitude, a.latitude), // 圆心位置
            radius: a.radius,  // 半径
            strokeColor: "#F33",  // 线颜色
            strokeOpacity: 1,  // 线透明度
            strokeWeight: 3,  // 线粗细度
            fillColor: "#ee2200",  // 填充颜色
            fillOpacity: 0.35 // 填充透明度
          });
          this.mapInstance.add(circle1);
          const maker = new window.AMap.Marker({
            position: new window.AMap.LngLat(a.longitude, a.latitude),
          });
          this.mapInstance.add(maker);
          // this.mapInstance.setFitView();
          return a;
        })
      }
      this.setState({
        isview: true
      })
    }
  }

  componentWillReceiveProps(nextProps) {
  }

  componentWillUnmount() {
    if (!Func.isEmpty(this.circleEditor)){
      this.circleEditor.close();
    }
  }

  drawWhat(obj) {
    let {index} = this.state;

    let text = '';
    switch(obj.CLASS_NAME) {
      case 'AMap.Marker':
        // text = `你绘制了一个标记，坐标位置是 {${obj.getPosition()}}`;
      // 构造矢量圆形
        let circle = new window.AMap.Circle({
          center: obj.getPosition(), // 圆心位置
          radius: 1000,  // 半径
          strokeColor: "#F33",  // 线颜色
          strokeOpacity: 1,  // 线透明度
          strokeWeight: 3,  // 线粗细度
          fillColor: "#ee2200",  // 填充颜色
          fillOpacity: 0.35 // 填充透明度
        });
        obj.setMap(null);   // 删除点标记

        if (index >= 3){
          message.info("最多能绘制3个标注点")
        }else{
          if (!Func.isEmpty(this.circleEditor)){
            this.circleEditor.close();
          }
          index = index+1;
          this.setState({
            index: index,
          })

          this.mapInstance.add(circle);
          this.circlex=circle;

          this.mapInstance.plugin(["AMap.CircleEditor"],this.constructorCircleEditor);
          this.mapInstance.setFitView();
        }

        // console.log(obj.getPosition())
        // TODO 中心点获取方法需要重新写


        // obj.setDraggable(true);   // 可拖动
        // obj.setMap(null);   // 删除点标记
        break;
      case 'AMap.Polygon':
        text = `你绘制了一个多边形，有${obj.getPath().length}个端点`;
        break;
      case 'AMap.Circle':
        text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}}`;
        break;
      default:
        text = '';
    }
    this.setState({
      what: text
    });
  }

  // 圆形编辑器
  constructorCircleEditor = () =>{
    this.circleEditor = new window.AMap.CircleEditor(this.mapInstance,this.circlex);
    this.circleEditor.open();
    this.circleEditor.on('end',(e) => this.getcircleEditorData(e));
    // this.circleEditor.on('move', this.getcircleMoveData);
  }

  // 圆形电子围栏编辑器
  getcircleEditorData = (e) => {
    let {getPoint} = this.props;
    let c = {
      longitude: e.target.getCenter().getLng(),
      latitude: e.target.getCenter().getLat(),
      radius: e.target.getRadius()
    }
    waypointList.push(c)
    if(!Func.isEmpty(getPoint)){
      getPoint(waypointList);
    }
    // TODO 中心点获取方法需要重新写
  }

  drawCircle(){
    if(this.tool){
      this.tool.circle();
      this.setState({
        what: '准备绘制圆形'
      });
    }
  }

  drawRectangle(){
    if(this.tool){
      this.tool.rectangle();
      this.setState({
        what: '准备绘制多边形（矩形）'
      });
    }
  }

  drawMarker(){
    if (this.tool){
      this.tool.marker();
      this.setState({
        what: '准备绘制坐标点'
      });
    }
  }

  drawPolygon() {
    if (this.tool) {
      this.tool.polygon();
      this.setState({
        what: '准备绘制多边形'
      });
    }
  }

  close(){
    if (this.tool){
      this.tool.close();
    }
    this.setState({
      what: '关闭了鼠标工具'
    });
  }

  render() {
    const {isview} = this.state;

    let isviewdisplay = "block";
    if (isview){
      isviewdisplay = "none";
    }
    return (
      <div>
        <div style={{width: '100%', height: 570}}>
          <Map
            plugins={this.mapPlugins}
            center={this.mapCenter}
            events={this.amapEvents}
          >
            <MouseTool events={this.toolEvents} />
            {/*<div style={layerStyle}>{this.state.what}</div>*/}
          </Map>
        </div>
        <button onClick={()=>{this.drawMarker()}} style={{display:isviewdisplay}}>绘制途径点</button>
        {/*/!*<button onClick={()=>{this.drawRectangle()}}>Draw Rectangle</button>*!/*/}
        {/*<button onClick={()=>{this.drawCircle()}}>Draw Circle</button>*/}
        {/*<button onClick={()=>{this.drawPolygon()}}>Draw Polygon</button>*/}
        {/*<button onClick={()=>{this.close()}}>关闭</button>*/}
      </div>
    )
  }
}
