import React,{ PureComponent } from 'react';
import { Map,MouseTool } from 'react-amap';
import {Button} from 'antd';

const ButtonGroup = Button.Group;

export default class SelectPoint extends PureComponent {



  state = {
    x:'',
    y:'',
    radius:''
  }

  toolEvents = {
    created: (tool) => {
      this.tool = tool;
    },
    draw:({obj})=>{
      this.drawDone(obj);
    }
  };

  amapEvents = {
    created: (mapInstance) => {
      this.mapInstance = mapInstance;

      const {centerPoint} = this.props;
      if (centerPoint) {

        const cp = new window.AMap.LngLat(centerPoint.x, centerPoint.y);
        this.mapInstance.setCenter(cp); // 设置地图中心点

        const circle =new window.AMap.Circle({
          center: cp, // 圆心位置
          radius: centerPoint.radius,  // 半径
          strokeColor: centerPoint.colour,  // 线颜色
          fillColor: centerPoint.colour,  // 填充颜色
          fillOpacity: 0.35 // 填充透明度
        });
        this.mapInstance.add(circle);
      }
    }
  }

  componentWillMount() {
    const {onSelect} = this.props;
    this.onSelect = onSelect;
  }


  drawDone = (obj) => {

    let text = '';

    switch(obj.CLASS_NAME) {
      case 'AMap.Marker':
        text = `你绘制了一个标记，坐标位置是 {${obj.getPosition()}}`;
        break;
      case 'AMap.Polygon':
        text = `你绘制了一个多边形，有${obj.getPath().length}个端点`;
        break;
      case 'AMap.Circle':
        text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}},半径为{${obj.getRadius()}`;
        this.setState({x:obj.getCenter().getLng(),y:obj.getCenter().getLat(),radius:obj.getRadius()})
        this.onSelect(this.state);
        break;
      default:
        text = '';
    }
    this.tool.close();
  }

  drawRectangle = ()=> {
    if(this.tool){
      this.clean();
      this.tool.rectangle();
    }
  }

  drawCircle = ()=> {
    if(this.tool){
      this.clean();
      this.tool.circle();
    }
  }

  drawPolygon = ()=> {
    if(this.tool){
      this.clean();
      this.tool.polygon();
    }
  }

  clean = () => {
    this.mapInstance.remove(this.mapInstance.getAllOverlays());
    this.setState({x:'',y:'',radius:0})
    this.onSelect(this.state);
  };

  render() {
    const plugins = [
      {
        name: 'ToolBar',
        options: {
          liteStyle: false,
          position: 'LT'
        }
      }
    ];

    return (
      <div style={{width: '800px',height:'400px'}}>
        <Map amapkey='4369198bd9cc0c7c743839e4ea9ddd04' plugins={plugins} events={this.amapEvents}>
          <MouseTool events={this.toolEvents} />
        </Map>
        <ButtonGroup>
          <Button type="primary" onClick={this.drawCircle}>画圆形</Button>
          <Button type="primary" onClick={this.clean}>清空</Button>
          {/* <Button type="primary" onClick={this.drawRectangle}>画方形</Button>
              <Button type="primary" onClick={this.drawPolygon}>多边形</Button> */}
        </ButtonGroup>
      </div>
    );
  }
}

