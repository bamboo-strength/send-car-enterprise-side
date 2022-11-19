import React, { Component } from 'react';
import { Descriptions, Drawer } from 'antd';
import Zmage from 'react-zmage'

export default class FlowPhoto extends Component {

  render() {
    const {drawerpic} = this.props;


    let pic = '';
    if (drawerpic.length !== 0){
      pic = drawerpic[0].picurl
    }else {
      const def = {
        id: "",
        createTime: "",
        orderId: '',
        truckno: "",
        picurl: "",
        picorder: '',
        x: "",
        y: "",
        addr: "",
        phoneinfo: '',
        remark: "",
        source: '',
        carrierTenant: '',
        fhdh: "",
        sourceName: "",
      }
      drawerpic.push(def)
    }

    return(
      <div style={{
        width: '100%',
        height: '500px',
      }}
      >
        <Zmage src={pic} style={{width: '100%',height: '100%'}} />
        <Descriptions title="基本信息" bordered='true' column={2} size='small' style={{width: '100%'}}>
          <Descriptions.Item label="车号">{drawerpic.truckno}</Descriptions.Item>
          <Descriptions.Item label="拍照地点">{drawerpic[0].addr}</Descriptions.Item>
          <Descriptions.Item label="经度">{drawerpic[0].x}</Descriptions.Item>
          <Descriptions.Item label="纬度">{drawerpic[0].y}</Descriptions.Item>
          <Descriptions.Item label="来源">{drawerpic[0].sourceName}</Descriptions.Item>
          <Descriptions.Item label="创建时间">{drawerpic[0].createTime}</Descriptions.Item>
          <Descriptions.Item label="图片地址">{drawerpic[0].picurl}</Descriptions.Item>
        </Descriptions>
      </div>
    )
  }


}
