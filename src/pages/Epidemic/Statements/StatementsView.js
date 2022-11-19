import React, { Component } from 'react';
import { List, NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { router } from 'umi';
import { IconAlipay, IconChongzhi, IconTixian, IconWXpay, IconZhifu } from '@/components/Matrix/image';
import Text from 'antd/lib/typography/Text';
import '../Epidemic.less'
import { pageDetail } from '@/services/epidemic';

const {Item} = List

class StatementsView extends Component {
  state = {
    detail:{}
  }

  componentDidMount() {
    const {match:{params:{id}}} = this.props
    console.log(id)
    pageDetail({ id }).then(item=>{
      console.log(item)
      if (item.success){
        this.setState({
          detail:item.data
        })
      }
    })
  }

  render() {
    const {detail} = this.state
    console.log(detail)

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/epidemic/statements');
          }}
        >账单详情
        </NavBar>
        <div className='am-list'>
          <div className='billing-details'>
            <div className='icon-title'>
              <img src={detail.comeFrom === 0?IconWXpay:IconAlipay} alt="" />
              <Text>{detail.comeFrom === 0?'微信':'支付宝'}支付</Text>
              <Text strong style={{fontSize:24}}>{detail.totalFee}元</Text>
            </div>
            <div>
              <Item extra={detail.orderName} style={{}} className='list-item'>收款方</Item>
              <Item extra={`${detail.comeFrom === 0?'微信':'支付宝'}支付`} style={{}} className='list-item'>付款方式</Item>
              <Item extra={detail.timeEnd} style={{}} className='list-item'>付款时间</Item>
              <Item extra={detail.transactionId} style={{}} className='list-item'>订单号</Item>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default StatementsView;


