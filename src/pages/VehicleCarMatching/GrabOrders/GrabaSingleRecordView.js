import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Form, Icon, Tag } from 'antd';
import router from 'umi/router';
import { NavBar, WhiteSpace } from 'antd-mobile';
import NetWorkCardView from '@/components/NetWorks/NetWorkCardView';
import Text from 'antd/es/typography/Text';
import iconContact from '../../../../public/Network/icon_contact.png';
import iconPhone from '../../../../public/Network/icon_phone.png';
import { recorddetail } from '@/services/VehicleCarMatching/GrabOrderServices';

@Form.create()
class GrabaSingleRecordView extends PureComponent {
  state = {
    data:{}
  };

  componentWillMount() {
    const { location: { state: { id } } } = this.props;
    recorddetail({id}).then(resp=>{
      this.setState({
        data:resp.data
      })
    })
  }

  waybillview=(sourceGoodsId)=>{
    router.push({ pathname : '/network/waybill', state : { sourceGoodsId}});
  }

  render() {
    const {data}=this.state
    const { location: { state: { splitBill } } } = this.props;
    const content = (
      <div className='flexColumn'>
        <div className='baseline'>
          <Text className='suppliesName'>{data.materialName}</Text>
        </div>
        <WhiteSpace size='xs' />
        <Text>货源单号：{data.sourceGoodsId}</Text>
        <WhiteSpace size='xs' />
        <Text>预计装车时间：{data.predictLoadingTime}</Text>
        <WhiteSpace size='xs' />
        <Text style={{wordWrap: 'break-word'}}>装运说明：{data.transportNote}</Text>
      </div>
    );
    const actions = ([
      <div className='flex'>
        <div><img src={iconContact} className='width' alt='' />&nbsp;&nbsp;{data.shipper}</div>
        <img src={iconPhone} className='width' alt='' />
      </div>]);
    const route = (
      <div className='flexColumn'>
        <Text>发货地址：{data.shipAddressRegionName}</Text>
        <WhiteSpace size='xs' />
        <Text>收货地址：{data.receiveAddressRegionName}</Text>
      </div>);
    // const actionsRoute = ([<div className='flex'><img src={iconPositioning} className='width' alt='' /></div>]);
    const Abike = (
      <div className='flexColumn'>
        <Text>司机姓名：{data.driverName}</Text>
        <WhiteSpace size='xs' />
        <Text>司机电话：{data.driverPhone}</Text>
        <WhiteSpace size='xs' />
        <Text>车牌号：{data.vehicleno}</Text>
        <WhiteSpace size='xs' />
        {/* <Text>装运次数：{data.count}</Text> */}
        {/* <WhiteSpace size='xs' /> */}
        {/* <Text>总量：{data.grabAmount}</Text> */}
        {/* <WhiteSpace size='xs' /> */}
        {/* <Text>总运费：{data.grabFreight}</Text> */}
      </div>);
    const extra = <Tag color="red">拆单</Tag>

    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/vehicleCarMatching/ordergrabbingmanage/ordergrabbingrecord')}
        >抢单记录详情
        </NavBar>
        <div className='am-list'>
          <NetWorkCardView title='货物信息' content={content} actions={actions} extra={splitBill === 1?extra:undefined} />
          <NetWorkCardView title='路线信息' content={route} /* actions={actionsRoute} */ />
          <NetWorkCardView title='抢单信息' content={Abike} />
        </div>
      </div>);
  }
}

export default GrabaSingleRecordView;
