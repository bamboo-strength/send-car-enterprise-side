import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { NavBar, List, Toast } from 'antd-mobile';
import router from 'umi/router';
import { Icon, Form, Card, Avatar } from 'antd';
import { WAYBILL_DETAIL } from '@/actions/waybill';
import { collection, cancelcollection } from '../../../services/merDriver';
import func from '@/utils/Func';

const Item = List.Item;
const { Meta } = Card;

@connect(({ waybill, loading }) => ({
  waybill,
  loading: loading.models.waybill,
}))
@Form.create()
class WayBillDetail extends PureComponent {

  componentWillMount() {
    this.query();
  }

  query = () => {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(WAYBILL_DETAIL(id));
  };

  // 收藏/取消收藏
  collection = (consignorTenantId, status) => {
    if (status === 1) {
      // 已收藏-> 取消收藏
      cancelcollection({ consignorTenantId }).then(resp => {
        if (resp.success) {
          Toast.info('取消收藏');
        }
        this.query();
      });
    } else {
      collection({ consignorTenantId }).then(resp => {
        if (resp.success) {
          Toast.info('收藏成功');
        }
        this.query();
      });
    }

  };

  render() {
    const {
      waybill: { detail },
      location,
    } = this.props;
    // console.log(location.state.backUrl,'---------')

    const basic = (
      <div>
        <div>联&nbsp;&nbsp;系&nbsp;&nbsp;人：{detail.createUserName}</div>
        <div>计划车数：{detail.planNumber}</div>
      </div>
    );
    const title = (
      <span>发货方：{detail.shipperName} &nbsp;&nbsp;
        <Icon type="star" theme="filled" onClick={() => this.collection(detail.tenantId, detail.isConsignorCollection)}
              style={{ fontSize: '22px', color: detail.isConsignorCollection === 1 ? '#fadb14' : '#ddd' }}/>
      </span>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push(location.state.backUrl)}
        >运单详情
        </NavBar>

        <Form hideRequiredMark className='am-list'>
          <Card>
            <Meta
              /* avatar={
                 <Avatar src="https://zos.alipayobjects.com/rmsportal/ODTLcjxAfvqbxHnVXCYX.png" />
               } */
              title={title}
              description={basic}
            />
          </Card>
          <Card title="基本信息">
            <List className='static-list'>
              <Item>发货开始日期：{detail.begintime}</Item>
              <Item>发货结束日期：{detail.endtime}</Item>
              <Item>已抢车数：{detail.robbedNumber}</Item>
              <Item>剩余车数：{detail.remainNumber}</Item>
              <Item>车&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;型：{detail.trucktypeName}</Item>
              <Item>备&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;注：{detail.remark}</Item>
            </List>
          </Card>
          <Card title="收发货信息">
            <List className='static-list'>
              <Item><Icon type="environment" theme="twoTone" twoToneColor="#eb2f96"
                          style={{ fontSize: '18px' }}/> 发货地址：{detail.shippingAddressName}</Item>
              {/* <Item><Icon type="environment" style={{fontSize:'18px'}} /> 途径地点：</Item> */}
              <Item><Icon type="environment" theme="twoTone"
                          style={{ fontSize: '18px' }}/> 收货地址：{detail.receiveAddressName}</Item>
            </List>
          </Card>
          <Card title="物资信息">
            <List className='static-list'>
              <Item>物资名称：{func.notEmpty(detail.materialnoName) ? detail.materialnoName : detail.materialnosName}</Item>
              <Item>包装代号：{detail.packName}</Item>
              <Item>计量单位：{detail.unitName}</Item>
              {/* <Item>货物单价：</Item> */}
            </List>
          </Card>
          <Card title="费用信息">
            <List className='static-list'>
              <Item>运费：{detail.freight}元/吨</Item>
              <Item>结算依据：{detail.freightSettleTypeName}</Item>
            </List>
          </Card>
        </Form>
      </div>
    );
  }
}

export default WayBillDetail;
