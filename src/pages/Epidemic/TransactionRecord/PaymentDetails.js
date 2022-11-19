import React, { PureComponent } from 'react';
import { Icon, Tag } from 'antd';
import { NavBar } from 'antd-mobile';
import { router } from 'umi';
import { paymentdetail } from '@/services/epidemic';
import { DetailStyle } from '@/pages/Epidemic/TransactionRecord/TransactionRecordStyle';
import func from '@/utils/Func';

class PaymentDetails extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      detail: {
        paymentOrder:{}
      },
    };
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    paymentdetail({ id }).then(resp => {
      if (resp.success) {
        this.setState({
          detail: resp.data,
        });
      }
    });
  }

  render() {
    const { detail } = this.state;
    const payStatus = [
      <Tag color="rgb(104 169 208)">未支付</Tag>,
      <Tag color="#87d068">支付完成</Tag>,
      <Tag color="#f50">支付失败</Tag>,
    ];
    const comeFrom = [
      '微信支付','支付宝支付'
    ];
    const list = [
      { title: '订单名称',extra: detail.orderName, },
      { title: '厂区',extra: detail.paymentOrder.plantAreaName, },
      { title: '煤种',extra: detail.paymentOrder.coalName, },
      { title: '排队号',extra: detail.paymentOrder.queueNo == '-1'?'尚未进入排队':detail.paymentOrder.queueNo, },
      { title: '微信支付订单号',extra: detail.transactionId, },
      { title: '商户订单ID',extra: detail.outTradeNo, },
      { title: '支付金额',extra: `${detail.totalFee}元`},
      { title: '支付来源', extra: comeFrom[detail.comeFrom] },
      { title: '支付时间', extra: func.handleStrDate(detail.timeEnd) },
      { title: '支付状态', extra: payStatus[detail.payStatus] },
    ];

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/epidemic/transactionrecord');
          }}
        >支付记录详情
        </NavBar>
        <div className='am-list'>
          <DetailStyle list={list} />
        </div>
      </div>
    );
  }
}

export default PaymentDetails;

