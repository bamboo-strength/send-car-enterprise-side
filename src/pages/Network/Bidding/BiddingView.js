import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon, Table, Modal, Button, Form, message } from 'antd';
import router from 'umi/router';
import { NavBar, Toast, WhiteSpace } from 'antd-mobile';
import NetWorkCardView from '@/components/NetWorks/NetWorkCardView';
import Text from 'antd/es/typography/Text';
import MatrixInput from '@/components/Matrix/MatrixInput';
import Title from 'antd/es/typography/Title';
import { bidding, cancelbidding, detail, remove } from '@/services/bidding';
import { list } from '@/services/merVehicle';
import { verifyDriver } from '@/services/grabasingle';

@Form.create()
class BiddingView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      vehicle: false,
      offer: false,
      vehicleNum: '',
      price: '',
      theBid: false,
      data: {},
      mervehicle: {},
      isBidding: false,
    };
  }

  componentWillMount() {
    const { match: { params: { id } }, location } = this.props;
    const localid = localStorage.getItem('localid');
    if (localid !== '1') {
      localStorage.setItem('localid', '1');
      location.state.state = 1;
      detail({ id: localid }).then(resp => {
        this.setState({
          data: resp.data,
          // state: 1,
        });
      });
    } else {
      detail({ id }).then(resp => {
        this.setState({
          data: resp.data,
        });
      });
    }
    list({ current: 1, size: 5 }).then(resp => {
      console.log('vehicle', resp);
      this.setState({
        mervehicle: resp.data.records,
      });
    });
  }

  /* 点击立即报价时，显示弹窗 */
  showModal = () => {
    this.setState({
      visible: true,
    });
  };

  /* 填写报价信息弹窗 */
  handleOk = () => {
    const { form } = this.props;
    const { vehicleNum } = this.state;
    const price = form.getFieldValue('price');
    if (price === undefined) {
      message.warning('请输入报价');
      return;
    }
    if (!vehicleNum) {
      message.warning('请选择车辆');
      return;
    }
    form.validateFieldsAndScroll((err,) => {
      if (!err) {
        this.setState({
          offer: true,
          visible: false,
          price,
        });
      }
    });
  };

  /* 显示选择车辆弹窗 */
  selectVehicle = () => {
    this.setState({
      vehicle: true,
    });
  };

  /* 报价信息取消 */
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  /* 选择车辆取消 */
  handleCancelVehicle = () => {
    this.setState({
      vehicle: false,
    });
  };

  /* 报价价格取消弹窗 */
  handleCancelPrice = () => {
    this.setState({
      offer: false,
      visible: true,
    });
  };

  /* 报价信息 */
  handleOkPrice = () => {
    const { vehicleNum, price } = this.state;
    const { match: { params: { id } } } = this.props;
    this.setState({
      // theBid: true,
      offer: false,
      isBidding: true,
    });
    bidding({ id, vehicleno: vehicleNum, price }).then(resp => {
      if (resp.success) {
        this.setState({
          theBid: true,
        });
      }
      this.setState({
        isBidding: false,
      });
    });
    setTimeout(() => {
      this.setState({
        theBid: false,
      });
    }, 3000);
  };

  /* 选择车辆确定 */
  handleOkVehicle = () => {
    const { vehicleNum } = this.state;
    verifyDriver({ vehicleno: vehicleNum }).then(resp => {
      if (resp.success === true) {
        this.setState({
          vehicleNum,
          vehicle: false,
        });
      }
    });
  };

  waybillview = (priceRecordWaybillId) => {
    router.push(
      {
        pathname: `/network/waybill/waybillview/${priceRecordWaybillId}`,
        state: { truckId: '', id: '1' },
      },
    );
  };

  /* 取消报价弹窗 */
  onBidding = () => {
    const { location: { state: { priceRecordId } } } = this.props;
    Modal.confirm({
      title: '是否取消报价?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        return new Promise((resolve, reject) => {
          cancelbidding({ id: priceRecordId, cancelRemark: '取消原因' }).then(resp => {
            reject();
            if (resp.success) {
              Toast.success(resp.msg);
              router.push('/network/waybill/bidding');
            }
          });
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  /* 删除弹窗 */
  onDelete = () => {
    const { match: { params: { id } } } = this.props;
    Modal.confirm({
      title: '是否确认删除?',
      okText: '确定',
      cancelText: '取消',
      onOk() {
        console.log('OK');
        remove({ ids: id }).then(resp => {
          console.log(resp);
        });
      },
      onCancel() {
        console.log('Cancel');
      },
    });
  };

  goReturn = () => {
    const { location } = this.props;
    router.push(`/network/waybill/bidding`);
    localStorage.setItem('load', location.state.initialPage);
  };

  render() {
    const { visible, vehicle, vehicleNum, offer, price, theBid, data, mervehicle, isBidding } = this.state;
    const { form, location: { state: { state } } } = this.props;
    const content = (
      <div className='flexColumn'>
        <div className='baseline'>
          <Text className='suppliesName'>物资名称:{data.materialName}</Text>
          {
            state === 1 ? <Text className='pricePeople'>已报价<Text>{data.biddingTimes}</Text>人</Text> : undefined
          }
        </div>
        <WhiteSpace size='xs' />
        <Text>货源单号：{data.id}</Text>
        <WhiteSpace size='xs' />
        <Text>预计装车时间：{data.predictLoadingTime}</Text>
        <WhiteSpace size='xs' />
        <Text>装运说明：{data.transportNote}</Text>
      </div>
    );
    const route = (
      <div className='flexColumn'>
        <Text>发货地址：{data.shipAddressRegionName}</Text>
        <WhiteSpace size='xs' />
        <Text>收货地址：{data.receiveAddressRegionName}</Text>
      </div>);
    const columns = [
      {
        title: '单价(元/吨)',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: text => <Text type='danger'>{text}</Text>,
      },
      {
        title: '重量(吨)',
        dataIndex: 'materialTotalamount',
        key: 'materialTotalamount',
        align: 'center',
        render: text => <Text type='danger'>{text}</Text>,
      },
      {
        title: '总价(元)',
        dataIndex: 'totalFreight',
        key: 'totalFreight',
        align: 'center',
        render: text => <Text type='danger'>{text}</Text>,
      },
    ];
    const data11 = [{
      price: data.price,
      materialTotalamount: data.materialTotalamount,
      totalFreight: data.totalFreight,
    }];
    const Abike = (<Table columns={columns} dataSource={data11} size="small" bordered pagination={false} />);
    const columns1 = [
      {
        title: '车牌号',
        dataIndex: 'truckno',
        align: 'center',
        render: text => <Text style={{ color: '#008dff' }}>{text}</Text>,
      },
      {
        title: '车辆类型',
        dataIndex: 'trucktypeName',
        align: 'center',
      },
      {
        title: '核定载质量',
        dataIndex: 'approvedLoadWeight',
        align: 'center',
      },
    ];
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          vehicleNum: selectedRows[0].truckno,
        });
      },
    };
    let btn = <div />;
    switch (state) {
      case 1:
        btn = <Button type="primary" block size='large' onClick={this.showModal}>立即报价</Button>;
        break;
      case 2:
        btn = <Button type="danger" block size='large' onClick={this.onBidding}>取消报价</Button>;
        break;
      case 4:
        btn = <Button type="danger" block size='large' onClick={this.onDelete}>删除</Button>;
        break;
      case 5:
        btn = <Button type="danger" block size='large' onClick={this.onDelete}>删除</Button>;
        break;
      default:
        console.log('没找到值！');
    }
    const circle = <div
      className='dot'
      style={{ background: state === 1 ? '#008dff' : state === 2 ? '#F59A23' : state === 3 ? '#0DDD47' : state === 4 ? '#7F7F7F' : '#D9001B' }}
    />;
    const textColor = { color: state === 1 ? '#008dff' : state === 2 ? '#F59A23' : state === 3 ? '#0DDD47' : state === 4 ? '#7F7F7F' : '#D9001B' };
    const stateName = state === 1 ? '未报价' : state === 2 ? '已报价' : state === 3 ? '已中标' : state === 4 ? '未中标' : '已取消';
    const extra = <div style={textColor}>{circle}&nbsp; {stateName}</div>;
    const Quote = <Text>我的报价：{data.offerPrice}元/吨</Text>;
    const countdown = <div />;
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >报价信息详情
        </NavBar>
        <div className='am-list'>
          <WhiteSpace />
          {countdown}
          <NetWorkCardView title='货物信息' content={content} extra={extra} />
          {state === 3 ? <NetWorkCardView title='单车信息' content={Abike} /> : undefined}
          {state === 2 ? <NetWorkCardView title='报价信息' content={Quote} /> : undefined}
          <div style={{ padding: '12px 12px 0px' }}>
            {btn}
          </div>
        </div>
        <Modal
          visible={visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          closable={false}
        >
          <p>
            <div className='alignTitle'>我的竞价：</div>
            <div className='alignCenter'>
              <MatrixInput id="price" numberType="isFloatGtZero" form={form} xs='1' placeholder='价格' />元/吨
            </div>
          </p>
          <div className='colorBlue' onClick={this.selectVehicle}>选择车辆 &nbsp;<Icon type="right-circle" theme="filled" />
            <Text strong>{vehicleNum}</Text>
          </div>
        </Modal>
        <Modal
          onOk={this.handleOkVehicle}
          onCancel={this.handleCancelVehicle}
          closable={false}
          title='选择车辆'
          visible={vehicle}
          className='tableModal'
        >
          <Table
            rowSelection={rowSelection}
            columns={columns1}
            dataSource={mervehicle}
            bordered
            pagination={false}
            size="small"
          />
        </Modal>
        <Modal
          closable={false}
          onOk={this.handleOkPrice}
          onCancel={this.handleCancelPrice}
          cancelText='修改报价'
          visible={offer}
          confirmLoading={isBidding}
        >
          <Title level={4}>您当前的报价为 <Text className='colorBlue'>{price}</Text> 元</Title>
        </Modal>
        <Modal
          visible={theBid}
          footer={null}
          closable={false}
          width='70%'
        >
          <div style={{ textAlign: 'center' }}>
            <Icon type="check-circle" theme="filled" style={{ color: '#008dff', fontSize: 40, marginBottom: 20 }} />
            <Title level={4}>恭喜您报价成功</Title>
            <Text>请等待货主确认</Text>
          </div>
        </Modal>
      </div>
    );
  }
}

export default BiddingView;
