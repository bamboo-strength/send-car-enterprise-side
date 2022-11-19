import React, { PureComponent } from 'react';
import { Icon, Tag } from 'antd';
import { NavBar } from 'antd-mobile';
import { router } from 'umi';
import { refunddetail } from '@/services/epidemic';
import { DetailStyle } from '@/pages/Epidemic/TransactionRecord/TransactionRecordStyle';
import func from '@/utils/Func';

class RefundDetails extends PureComponent {
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
    refunddetail({ id }).then(resp => {
      if (resp.success) {
        this.setState({
          detail: resp.data,
        });
      }
    });
  }

  render() {
    const { detail } = this.state;
    const operateType = [
      <Tag color="#87d068">自动退回</Tag>,
      <Tag color="#2db7f5">人工退回</Tag>,
    ];
    const refundStatus = [
      { status: 'SUCCESS', tag: <Tag color="#87d068">退款成功</Tag> },
      { status: 'CHANGE', tag: <Tag color="#f50">退款异常</Tag> },
    ];
    const list = [
      { title: '微信订单号', extra: detail.transactionId },
      { title: '厂区',extra: detail.paymentOrder.plantAreaName, },
      { title: '煤种',extra: detail.paymentOrder.coalName, },
      { title: '排队号',extra: detail.paymentOrder.queueNo == '-1'?'尚未进入排队':detail.paymentOrder.queueNo, },
      { title: '支付订单ID', extra: detail.outTradeNo },
      { title: '订单名称', extra: detail.orderName },
      { title: '微信退款单号', extra: detail.refundId },
      { title: '商户退款单号', extra: detail.outRefundNo },
      { title: '订单金额', extra: `${detail.totalFee}元` },
      { title: '退款金额', extra: `${detail.refundFee}元` },
      { title: '退款状态', extra: refundStatus.map(item => {if (detail.refundStatus === item.status) return item.tag;})[0]},
      { title: '退款入账账户', extra: detail.refundRecvAccout },
      { title: '退款资金来源', extra: detail.refundAccount === 'REFUND_SOURCE_RECHARGE_FUNDS'?'可用余额退款/基本账户':'未结算资金退款'},
      { title: '退款方式', extra: operateType[detail.operateType] },
      { title: '退款时间', extra: func.handleStrDate(detail.successTime) },
    ];

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => {
            router.push('/epidemic/transactionrecord');
          }}
        >退款记录详情
        </NavBar>
        <div className='am-list'>
          <DetailStyle list={list}/>
        </div>
      </div>
    );
  }
}

export default RefundDetails;

