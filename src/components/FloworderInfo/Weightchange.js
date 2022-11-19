import React, { Component } from 'react';
import G2 from '@antv/g2';
import DataSet from '@antv/data-set'
import '@antv/g2-plugin-slider';
import Func from '@/utils/Func';
import { gpslocus } from '@/services/gps';
import { message, Slider } from 'antd';
import { floworderFenceService } from '@/services/FloworderInfoService';
import { maps } from '@/components/Util/MyMap';

let chart;
let ds;
let dv;
let data1 = [];
export default class Weightchange extends Component {

  state = {
    height: 300,
  };

  componentWillMount() {
    const {deviceno,height,selparams} = this.props;
    if (Func.notEmpty(selparams)){
      this.orderid = selparams.id;
    }
    this.devicenos = deviceno;
    this.setState({
      height: height
    })
    this.selectflag =true;
  }

  componentDidMount() {
    const {deviceno,SelectDate,height,htmltype,selparams} = this.props;
    this.devicenos = deviceno;
    if (Func.notEmpty(selparams)){
      this.orderid = selparams.id;
    }
    if (htmltype=== "orderinfo"){
      chart = new G2.Chart({
        container: 'mountNode',
        forceFit: true,
        // height: parseInt(height)*0.9,
        padding: [ 20, 60, 30,40],
        height: height-30,
        animate: false
      });
    }else if (htmltype=== "gpslocus"){
      chart = new G2.Chart({
        container: 'mountNode',
        forceFit: true,
        padding: [ 20, 60, 30,40],
        height: height-30,
        animate: false
      });
    }
    this.getCharts();

    if (Func.notEmpty(deviceno) && Func.notEmpty(SelectDate.startTime) && Func.notEmpty(SelectDate.endTime)){
      this.getweight(deviceno,SelectDate);
    }
    if (Func.notEmpty(chart)){
      chart.forceFit();
    }
  }

  componentWillReceiveProps(nextProps) {
    const {height,deviceno,SelectDate,isselect,htmltype,selparams,pointinfo} =nextProps ;
    this.pointinfo = pointinfo;
    if (Func.notEmpty(this.pointinfo.gpstime) && Func.notEmpty(this.pointinfo.speed)){
      // chart.showTooltip({x: 517.890396093326, y: 179.10920000000004});
      let position1 = chart.getXY({"time":this.pointinfo.gpstime,"speed":this.pointinfo.speed});
      if (Func.notEmpty(chart) && Func.notEmpty(position1)){
        chart.showTooltip(position1);
      }
    }

    if (Func.notEmpty(selparams)){
      this.orderid = selparams.id;
    }
    if (height !== this.props.height){
      this.setState({
        height:height,
      })
      if (htmltype=== "orderinfo"){
        chart.changeHeight(height*0.9);
      }else if (htmltype=== "gpslocus"){
        chart.changeHeight(height*0.7);
      }
    }
    // if (isselect){
    //   this.selectflag = true;
    // }
    // this.devicenos = deviceno;
    // if (this.selectflag) {
      if (Func.notEmpty(deviceno) && Func.notEmpty(SelectDate.startTime) && Func.notEmpty(SelectDate.endTime)) {
        if (isselect) {
          this.reloadweight();
          this.getweight(deviceno, SelectDate);
        }
      } else {
        this.reloadweight();
      }
    // }else {
    //   if (!(Func.notEmpty(this.devicenos) && Func.notEmpty(SelectDate.startTime) && Func.notEmpty(SelectDate.endTime))){
    //     this.reloadweight();
    //   }
    //   // this.reloadweight();
    // }


  }

  componentDidUpdate(){
    if (Func.notEmpty(chart)){
      chart.forceFit();
    }
  }

  reloadweight = () =>{
    data1 = [];
    chart.changeData([]);
    chart.guide().region({
    });
  }


  getweight = (deviceno,SelectDate) =>{
    const {isselectTable,htmltype,selparams} = this.props;

    gpslocus({ 'deviceNo': deviceno, 'startTime':Func.format(SelectDate.startTime), 'endTime':Func.format(SelectDate.endTime), 'fhdh': '' }).then((res) => {

      if (Func.notEmpty(res) && Func.notEmpty(res.success)){
        if (res.success) {
          if (Func.notEmpty(res.data)) {
            let locusdata = res.data.gps;
            if (locusdata.length >= 1) {

              data1 = [];
              locusdata.map((value) => {

                let we = Math.round(value.weight * 100) / 100;
                if (we < -20){
                  we = -19;
                }
                let d = {
                  time: value.gpstime,
                  weight: we,
                  speed: parseFloat(value.speed)
                }
                data1.push(d);

                return value;
              });
            }
            ds.setState({
              start: new Date(SelectDate.startTime).getTime(),
              end: new Date(SelectDate.endTime).getTime(),
            });

            dv.source(data1);
            dv.transform({
              type: 'filter',
              callback: function callback(obj) {
                let time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
                return time >= ds.state.start && time <= ds.state.end;
              }
            });
            chart.changeData(data1);
            chart.render();
            if (Func.notEmpty(this.orderid)){
              this.floworderFence(this.orderid);
            }





            // console.log(chart)
            // if (Func.notEmpty(chart)){
            //   setTimeout(() => chart.showTooltip({x: 517.890396093326, y: 179.10920000000004}), 5000);
            //   chart.showTooltip({x: 517.890396093326, y: 179.10920000000004});
            //   chart.interact('slider', {
            //     container: 'slider',
            //     onChange: function onChange(ev) {
            //       let startValue = ev.startValue,
            //         endValue = ev.endValue;
            //       ds.setState('start', startValue);
            //       ds.setState('end', endValue);
            //     }
            //   });
            // }



            // chart.interact('zoom', {
            //   type: `'X' | 'Y' | 'XY'`, // 设置缩放的类型，'X' x 轴方向缩放, 'Y' y 轴方向缩放, 'XY' x 和 y 轴同时缩放
            //   // stepRatio: number, // 控制缩放速度，默认值 0.05
            //   minScale: 0.5, // 最小缩放比例，默认值 1
            //   maxScale: 1, // 最大缩放比例，默认值 4
            //   // catStep: number // 分类数据的缩放速度，默认值 2
            // });
            // !!! 创建 slider 对象
            this.selectflag = false;
          }
        }else {
          message.error('服务器异常,查询轨迹信息失败！');
        }
      }else {
        message.error('服务器异常,查询轨迹信息失败！');
      }
      if (Func.notEmpty(isselectTable)){
        this.devicenos = "";
        isselectTable(['isweightchange', false]);
      }
    })

  }

  // 围栏
  floworderFence = (orderId)=>{
    if (Func.notEmpty(data1)){
      if (Func.notEmpty(orderId)){
        floworderFenceService({id: orderId}).then((res)=> {
          if (Func.notEmpty(res)){
            if (Func.notEmpty(res.data)){
              let t = res.data.inFenceTime;
              let t1 = res.data.outfenceTime;
              if (Func.notEmpty(t)){
                if (Func.notEmpty(data1[data1.length-1])){
                  let color = "l(100) 0:#a50f15 1:#fee5d9";
                  if (Func.notEmpty(res.data.fence[0])){
                    color = res.data.fence[0].colour;
                  }

                  let t_arry = Func.split(t);
                  let t1_arry =  Func.split(t1);
                  t_arry.map((value,index,arr)=>{
                    chart.guide().region({
                      top: false,
                      start: [value, 'max'],
                      end: [t1_arry[index], 'min'],
                      style: {
                        fill: color,
                        fillOpacity: 1.8, // 辅助框的背景透明度
                      } // 辅助框的图形样式属性
                    });
                    return value;
                  })

                  // chart.guide().region({
                  //   top: false,
                  //   start: [t, 'max'],
                  //   end: [t1, 'min'],
                  //   style: {
                  //     fill: color,
                  //     fillOpacity: 1.8, // 辅助框的背景透明度
                  //   } // 辅助框的图形样式属性
                  // });
                  chart.changeData(data1);
                }
              }
            }
          }
        })
      }
    }

  }

  getCharts =()=>{
    const {tooltiprender} =  this.props;

    ds = new DataSet({
      state: {
        start: new Date().getTime(),
        end: new Date().getTime()
      }
    });

    dv = ds.createView('origin').source([]);
    dv.transform({
      type: 'filter',
      callback: function callback(obj) {
        let time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
        return time >= ds.state.start && time <= ds.state.end;
      }
    });

    chart.source(dv, {
      time: {
        type: 'time',
        tickCount: 5,
        mask: 'DD日 HH:mm:ss'
      },
      weight: {
        alias: '重量(吨)',
        // tickInterval: 10,
        tickCount: 4,
        min: -20,
        // max: 70,
        nice: false,
      },
      speed: {
        alias: '速度(km/h)',
        tickInterval: 100,
        min: 0,
        max: 200,
        nice: false,
      }
    });
    chart.axis('weight', {
      line: {
        lineWidth: 2, // 设置线的宽度
        stroke: 'red', // 设置线的颜色
        lineDash: [ 3, 3 ] // 设置虚线样式
      },
      label: {
        formatter: val => {
          return `${Func.toInt(val)}吨`; // 格式化坐标轴显示文本
        },
      },
    });
    chart.axis('speed', {
      grid: null,
      line: {
        lineWidth: 2, // 设置线的宽度
        stroke: 'green', // 设置线的颜色
        lineDash: [ 3, 3 ] // 设置虚线样式
      },
      label: {
        formatter: val => {
          return `${Func.toInt(val)}km/h`; // 格式化坐标轴显示文本
        },
      },
    });
    chart.legend({
      custom: true,
      position: 'top',
      items: [{
        value: '重量',
        marker: {
          symbol: 'circle',
          fill: 'red',
          radius: 5
        }
      }, {
        value: '速度',
        marker: {
          symbol: 'circle',
          fill: 'green',
          radius: 5
        },
      }],
      onClick: function onClick(ev) {
        let item = ev.item;
        let value1 = item.value;
        let value='';
        if(value1 === "速度"){
          value='speed';
        }else if (value1 === "重量"){
          value = "weight";
        }
        let checked = ev.checked;
        let geoms = chart.getAllGeoms();
        for (let i = 0; i < geoms.length; i+=1) {
          let geom = geoms[i];
          if (geom.getYScale().field === value) {
            if (checked) {
              geom.show();
            } else {
              geom.hide();
            }
          }
        }
      }
    });
    chart.line().position('time*weight').color('red').opacity(0.85);
    chart.line().position('time*speed').color('green').opacity(0.85);
    // chart.area().position('time*weight').color("l(100) 0:#a50f15 1:#fee5d9").opacity(0.85);
    chart.render();

    chart.on('tooltip:change', function(ev) {
      const items = ev.items; // tooltip显示的项
      const origin = items[0]; // 将一条数据改成多条数据
      const range = origin.point._origin;
      if (Func.notEmpty(tooltiprender)){
        tooltiprender(range);
      }
    })


  }

  render() {
    const {height} = this.state;
    const {htmltype} = this.props;
    let height1 = "90%";
    let height2 = "8%"
    if (htmltype=== "orderinfo"){
      height1 = "90%";
      height2 = "8%"
    }else if (htmltype=== "gpslocus"){
      height1 = "70%";
      height2 = "8%"
    }
    // let height1 = "99%";
    // let height2 = "1"
    return (
      <div id="c1" style={{height: height}}>
        <div id="mountNode" style={{height: height1,width:'100%'}}>

        </div>
        <div id="slider" style={{height: '30px',width:'100%'}}>

        </div>
      </div>
    );
  }
}

