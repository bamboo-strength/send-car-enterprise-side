import React, { Component } from 'react';
import G2 from '@antv/g2';
import DataSet from '@antv/data-set'
import '@antv/g2-plugin-slider';
import Func from '@/utils/Func';
import { gpslocus } from '@/services/gps';
import { message, Slider } from 'antd';
import { floworderFenceService } from '@/services/FloworderInfoService';
import { isTimeValue } from '@/components/Util/MyMap';
import moment from 'moment';

let chart;
let ds;
let dv;
let data1 = [];
let stopdatas = [];
export default class Weightchange extends Component {

  state = {
    height: 300,
  };

  componentWillMount() {
    this.eventstop = true;
  }

  componentDidMount() {
    const {value,selparams,height,SelectDate} = this.props;
    this.orderid = selparams.id;
    this.SelectDate = SelectDate;
    data1 = value;
    this.setState({
      height: height
    })
    chart = new G2.Chart({
      container: 'mountNode',
      forceFit: true,
      padding: [30, 60, 40, 40],
      height: height,
      animate: false,
    });
    this.getCharts();
  }

  componentWillReceiveProps(nextProps) {
    const {value,selparams,height,stopdata,fencedata} =nextProps ;
    if (height !== this.props.height){
      this.setState({
        height:height,
      })
      chart.changeHeight(height);
    }
    if (value !== this.props.value) {
      this.reloadweight();
      data1 =value;
      this.getweight();
    }
    if ((data1.length > 0) && Func.notEmpty(stopdata)){
      if (stopdata.length>0) {
        stopdatas = stopdata;
        if (this.eventstop){
          this.setStopcar(stopdata);
          this.eventstop = false;
        }
      }
    }
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


  getweight = () => {
    let locusdata = data1;
    if (isTimeValue( this.SelectDate)){
      this.SelectDate = {
        startTime: moment().format('YYYY-MM-DD HH:mm:ss'),
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
    }
    if (data1.length >= 1) {
      data1 = [];
      locusdata.map((value) => {
        let we = Math.round(value.weight * 100) / 100;
        if (we < -20){
          we = -19;
        }
        let d = {
          time: value.gpstime,
          weight:  we,
          speed: parseFloat(value.speed),
        };
        data1.push(d);
        return value;
      });
    }
    ds.setState({
      start: new Date(this.SelectDate.startTime).getTime(),
      end: new Date(this.SelectDate.endTime).getTime(),
    });

    dv.source(data1);
    dv.transform({
      type: 'filter',
      callback: function callback(obj) {
        let time = new Date(obj.time).getTime(); // !注意：时间格式，建议转换为时间戳进行比较
        return time >= ds.state.start && time <= ds.state.end;
      },
    });
    chart.changeData(data1);
    chart.render();
    if (Func.notEmpty(this.orderid)) {
      this.floworderFence(this.orderid);
    }
  };

  setStopcar = (stopcardata)=>{

    for (let i=0;i<stopcardata.length;i+=1){
      const value = stopcardata[i];
      const stopweight =  this.findweight(value.eventstarttime);
      const point = [ value.eventstarttime, stopweight ];
      // html字符串
      let a = [];
      const tooltipHtml = `<div><span style="position: absolute;top: -10px;left: 4px">${i+1}</span><a><img src='/image/tingche.png'></a></div>`;
      chart.guide().html({
        top: true,
        position: point,
        html: tooltipHtml,
        alignX: 'left',
        alignY: 'bottom',
        offsetY: 25,
        offsetX: -10,
        zIndex: 0
      });
    }
    stopcardata.map((value, index, array)=>{
      // 坐标点

      // chart.guide().image({
      //   start: point,
      //   src: '/image/tingche.png',
      //   width: 20,
      //   height: 40,
      //   offsetY: -20,
      //   offsetX: -10
      // });
      return value;
    })

  }

  addevent = (index) =>{
    console.log(index);
  }

  // 查找时间对应的载重
  findweight = (time) => {
    for (let i=0;i<data1.length;i+=1){
      const t1 = new Date(data1[i].time).getTime();
      const t2 = new Date(time).getTime();
      if (t1 >= t2) {
        return data1[i].weight;
      }
    }
    return 0;
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
                  let color = res.data.colour;
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
    chart.render();
    // eslint-disable-next-line func-names
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
    let height1 = "100%";
    return (
      <div id="c1" style={{height: height}}>
        <div id="mountNode" style={{height: height,width:'100%'}}>

        </div>
      </div>
    );
  }
}

