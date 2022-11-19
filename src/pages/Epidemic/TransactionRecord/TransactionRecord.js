import React, { PureComponent } from 'react';
import { List, NavBar } from 'antd-mobile';
import { Card, Col, Form, Icon, Tag } from 'antd';
import { router } from 'umi';
import { IconCertification } from '@/components/Matrix/image';
import '../Epidemic.less';
import { refundRecord, paymentList } from '@/services/epidemic';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import func from '@/utils/Func';

const tabs = [
  { title: `支付记录`, key: '1' },
  { title: `退款记录`, key: '2' },
];

@Form.create()
class TransactionRecord extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tabKey: '1',
    };
  }

  changeTab = (tab) => {
    this.setState({
      tabKey: tab,
    });
  };


  render() {
    const { tabKey } = this.state;
    const colSty = {padding:'5px 0'}
    const row = (rowData) => {
      const comeFrom = [ '微信支付','支付宝支付' ];
      const payStatusTag = [<Tag color="rgb(104 169 208)">未支付</Tag> ,<Tag color="#87d068">支付完成</Tag>,<Tag color="#f50">支付失败</Tag> ,];
      const {payStatus,totalFee,paymentOrder} = rowData
      const {plantAreaName,coalName,queueNo,serviceTypeName} = paymentOrder

      return (
        <Card
          title={<div><img src={IconCertification} alt='' style={{ height: 20 }} />{plantAreaName}</div>}
          onClick={() => router.push(`/epidemic/transactionrecord/PaymentDetails/${rowData.id}`)}
          size="small"
          className='card-list'
          bordered={false}
        >
          <Col span={24} style={colSty}><Col span={7}>煤种：</Col> <Col span={17}>{coalName}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>排队号：</Col> <Col span={17}>{queueNo == -1?'尚未进入排队':queueNo}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>支付金额：</Col> <Col span={17}>{totalFee}元</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>支付状态：</Col> <Col span={17}>{payStatusTag[payStatus]}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>费用类型：</Col> <Col span={17}>{serviceTypeName}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>支付时间：</Col> <Col span={17}>{func.handleStrDate(rowData.timeEnd)}</Col></Col>
        </Card>
      );
    };

    const row1 = (rowData) => {
      const operateType = [
        <Tag color="#87d068">自动退回</Tag>,
        <Tag color="#2db7f5">人工退回</Tag>,
      ];
      const refundStatusTag = [
        { status: 'SUCCESS', tag: <Tag color="#87d068">退款成功</Tag> },
        { status: 'CHANGE', tag: <Tag color="#f50">退款异常</Tag> },
      ];
      const {id,refundFee,refundRecvAccout,successTime,paymentOrder,refundStatus} = rowData
      const {plantAreaName,coalName,queueNo,} = paymentOrder
      return (
        <Card
          title={<div><img src={IconCertification} alt='' style={{ height: 20 }} />&nbsp;&nbsp;{plantAreaName}</div>}
          onClick={() => router.push(`/epidemic/transactionrecord/refundDetails/${id}`)}
          size="small"
          className='card-list'
          bordered={false}
        >
          <Col span={24} style={colSty}><Col span={7}>煤种：</Col> <Col span={17}>{coalName}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>排队号：</Col> <Col span={17}>{queueNo == -1?'尚未进入排队':queueNo}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>退款金额：</Col> <Col span={17}>{refundFee}元</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>退款状态：</Col> <Col span={17}>{refundStatusTag.map(item=>{if (refundStatus === item.status) return item.tag})}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>退款账户：</Col> <Col span={17}>{refundRecvAccout}</Col></Col>
          <Col span={24} style={colSty}><Col span={7}>退款时间：</Col> <Col span={17}>{func.handleStrDate(successTime)}</Col></Col>
        </Card>
      );
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/dashboard/function`);
          }}
        >支付记录
        </NavBar>
        <div className='am-list' style={{background:'white'}}>
          <MatrixTabsListView
            tabs={tabs}
            noTabKey
            round
            interfaceUrl={tabKey === '1' ? paymentList : refundRecord}
            row={tabKey === '1' ? row : row1}
            changeTab={this.changeTab}
          />
        </div>
      </div>
    );
  }
}

export default TransactionRecord;
