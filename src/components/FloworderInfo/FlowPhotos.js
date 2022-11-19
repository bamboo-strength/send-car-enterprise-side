import React, { Component } from 'react';
import { Empty,Drawer, Radio } from 'antd';
import { connect } from 'dva';
import FlowPhoto from '@/components/FloworderInfo/FlowPhoto';
import Func from '@/utils/Func';
import {
  flowGrosspicDetailService,
  flowMonipicDetailService,
  flowTarepicDetailService,
} from '@/services/FloworderInfoService';

let orderids = '';
export default class FlowPhotos extends Component {

  state = {
    dotPosition: 'flowgross',
    photovisible: false,
    drawerpic :[],
    flowgrosspic: [],
    flowmonipic: [],
    flowtarepic: [],
  }

  componentWillMount() {

  }

  componentDidMount() {

    const {dispatch,orderId} = this.props;
    // this.clean();
    orderids = orderId;
    this.getflowGrosspicDetail(orderId);
    this.getflowMonipicDetail(orderId);
    this.getflowTarepicDetail(orderId);
  }

  getflowGrosspicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowGrosspicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              this.setState({
                flowgrosspic: res.data
              })
            }
          }
        }
      })
    }
  }

  getflowMonipicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowMonipicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              this.setState({
                flowmonipic: res.data
              })
            }
          }
        }
      })
    }
  }

  getflowTarepicDetail= (orderId)=>{
    if (Func.notEmpty(orderId)){
      flowTarepicDetailService({orderId}).then((res)=>{
        if (Func.notEmpty(res)){
          if (res.success){
            if (Func.notEmpty(res.data)){
              this.setState({
                flowtarepic: res.data
              })
            }
          }
        }
      })
    }
  }


  handlePositionChange = ({ target: { value: dotPosition } }) => {
    this.setState({ dotPosition });
  }


  showDrawer = (param1) => {
    const info = [];
    info.push(param1);
    this.setState({
      photovisible: true,
      drawerpic: info
    });
  };

  onClose = () => {
    this.setState({
      photovisible: false,
      drawerpic: [],
    });
  };

  clean = ()=>{
    this.setState({
      photovisible: false,
      drawerpic: [],
      dotPosition: 'flowgross',
    });
  }

  picload = (data1) =>{
    // 图片加载
    let di = [];

    // 图片排序
    let data2 = data1;
    for(let i=0;i<data2.length-1;i+=1) {
      for (let j = 0; j < data2.length - 1 - i; j += 1) {
        if (data2[j].picorder > data2[j + 1].picorder) {
          let tmp = data2[j + 1];
          data2[j + 1] = data2[j];
          data2[j] = tmp;
        }
      }
    }

    data2.map( (value,index) => {
      const picurl1 = value.picurl;
      const fahuophoto ={
        width: '32%',
        height: '50%',
        float: 'left',
        marginLeft: '1%',
        // background: `url(${picurl1})` ,
        // backgroundRepeat: 'no-repeat',
        // backgroundSize: 'cover',
        // backgroundPosition: 'center, center',
      }
      di.push(<div style={fahuophoto} onClick={() =>{return this.showDrawer(value)}}><img src={picurl1} style={{width: '100%',height: '100%'}}/></div>);
      return di;
    })

    if (di.length === 0){
      di.push(
        <Empty
          // image="/photo/photo.jpg"
          // imageStyle={{
          //   height: '50%',
          // }}
          description={
            <b>
              暂无图片
            </b>}
        >
        </Empty>
      )
    }
    return di;
  }


  render() {

    const {flowgrosspic,
        flowmonipic,
        flowtarepic
    } = this.state;
    const {photovisible,drawerpic} =this.state;

    let flowgrossDisplay = 'block';
    let flowmoniDisplay = 'none';
    let flowtareDisplay = 'none';

    const { dotPosition } = this.state;
    if (dotPosition === 'flowgross'){
      flowgrossDisplay = 'block';
      flowmoniDisplay = 'none';
      flowtareDisplay = 'none';
    }else if (dotPosition === 'flowmoni'){
      flowgrossDisplay = 'none';
      flowmoniDisplay = 'block';
      flowtareDisplay = 'none';
    }else if (dotPosition === 'flowtare'){
      flowgrossDisplay = 'none';
      flowmoniDisplay = 'none';
      flowtareDisplay = 'block';
    }
    const flowgrosspic1 = this.picload(flowgrosspic);
    const flowMonipic1 = this.picload(flowmonipic);
    const flowTarepic1 = this.picload(flowtarepic);


    return (
      <div style={{width: '100%',height: '100%'}}>
        <Radio.Group
          onChange={this.handlePositionChange}
          value={dotPosition}
          // size='small'
          style={{ width: '100%' }}
        >
          <Radio.Button style={{width: '33%'}} value="flowgross"><b>重车照片</b></Radio.Button>
          <Radio.Button style={{width: '34%'}} value="flowmoni"><b>监控照片</b></Radio.Button>
          <Radio.Button style={{width: '33%'}} value="flowtare"><b>空车照片</b></Radio.Button>
        </Radio.Group>
        <div style={{width: '100%',height: '100%',display: flowgrossDisplay}}>
          <div style={{overflowY:'auto',width: '100%', height: '100%',marginTop: '1%',display: flowgrossDisplay}}>
            {
              flowgrosspic1.map((value,index) => {
                return value;
              })
            }
          </div>
        </div>
        <div style={{width: '100%',height: '100%',display: flowmoniDisplay}}>
          <div style={{overflowY:'auto',width: '100%', height: '100%',marginTop: '1%',display: flowmoniDisplay}}>
            {
              flowMonipic1.map((value,index) => {
                return value;
              })
            }
          </div>
        </div>
        <div style={{width: '100%',height: '100%',display: flowtareDisplay}}>
          <div style={{overflowY:'auto',width: '100%', height: '100%',marginTop: '1%',display: flowtareDisplay}}>
            {
              flowTarepic1.map((value,index) => {
                return value;
              })
            }
          </div>
        </div>

        <Drawer
          title="照片详情"
          placement="left"
          onClose={this.onClose}
          visible={photovisible}
          width='800px'
          maskStyle={{background: 'rgba(0, 0, 0, 0.05)'}}
        >
          <FlowPhoto drawerpic={drawerpic} />
        </Drawer>
      </div>
    )
  }

}
