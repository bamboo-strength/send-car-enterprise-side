import React, { Component } from 'react';
import { NavBar } from 'antd-mobile';
import { Form, Icon } from 'antd';
import { router } from 'umi';
import { IconChongzhi, IconTixian, IconZhifu } from '@/components/Matrix/image';
import Text from 'antd/lib/typography/Text';
import { DETAILMANAGEMENT_DETAIL } from '@/actions/BillingManagement';
import { connect } from 'dva';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import { InTheLoad } from '@/components/Stateless/Stateless';


@connect(({ billingmanagement,loading }) => ({
  billingmanagement,
  loading: loading.models.billingmanagement,
}))
@Form.create()
class BillingDetails extends Component {

  componentDidMount() {

    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(DETAILMANAGEMENT_DETAIL(id));
  }

  render() {
    const { billingmanagement: { billdetail },loading } = this.props;
    const bussType = 1
    const list = [
      {extra:billdetail.oppAcctName,title:'对方户名'},
      {extra:billdetail.paymentMethod,title:'付款方式'},
      {extra:billdetail.updateTime,title:'付款时间'},
      {extra:billdetail.orderNo,title:'订单编号'},
    ]
    const amountStatus = billdetail.transactionType === 2 || billdetail.transactionType === 3 ? '+':'-'
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/kswallet/wallhomepage/walletpage');
          }}
        >账单详情
        </NavBar>
        <div className='am-list'>
          {
            loading ? <InTheLoad /> : (
              <div className='billing-details'>
                <div className='icon-title'>
                  <img src={bussType === 1?IconChongzhi:bussType === 2?IconZhifu:IconTixian} alt="" />
                  <Text>{billdetail.tradeDirection}</Text>
                  <Text strong style={{fontSize:24}}> {amountStatus}{Number(billdetail.amount).toFixed(2)}</Text>
                  <Text style={{ color: billdetail.transStatus === 5 ? '#10E956' : billdetail.transStatus === 2 ? '#1890FF' : '#ff0000' }}>
                    {billdetail.transStatusName}
                  </Text>
                </div>
                <div>
                  {
                    list.map(item=><MatrixListItem label={item.title} title={item.extra} />)
                  }
                </div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default BillingDetails;

