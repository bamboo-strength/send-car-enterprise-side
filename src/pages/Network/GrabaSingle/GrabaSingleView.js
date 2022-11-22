import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon, Table, Modal, Button, Form, message, Tag, Progress } from 'antd';
import router from 'umi/router';
import { NavBar, Toast, WhiteSpace } from 'antd-mobile';
import NetWorkCardView from '@/components/NetWorks/NetWorkCardView';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { detail, grabasingle, verifyDriver } from '@/services/grabasingle';
import { list } from '@/services/merVehicle';

@Form.create()
class BiddingView extends PureComponent {
  state = {
    vehicle: false,
    vehicleNum: '',
    theBid: false,
    mervehicle:{},
    dataS: {},
  }

  componentWillMount() {
    const {match: {params: {id}}} = this.props
    detail({id}).then(resp=>{
      this.setState({
        dataS:resp.data,
      })
    })
    list({current:1,size:5}).then(resp=>{
      this.setState({
        mervehicle:resp.data.records,
      })
    })
  }

  /* 点击立即抢单时，显示弹窗 */
  showModal = () => {
    this.setState({
      vehicle: true,
    });
  };

  /* 选择车辆取消 */
  handleCancelVehicle = () => {
    this.setState({
      vehicle: false,
    });
  };

  /* 选择车辆确定 */
  handleOkVehicle = () => {
    const {match: {params: {id}}} = this.props
    const { vehicleNum,dataS } = this.state;
    if (!vehicleNum) {
      message.warning('请选择车辆');
      return;
    }
    verifyDriver({vehicleno:vehicleNum}).then(resp=>{
      if(resp.success===true)
      {
        this.setState({
          vehicleNum,
          vehicle: false,
        });
      }
    })
    this.setState({
      vehicleNum,
      vehicle: false,
    });
    const mess = (
      <div className='flexColumn'>
        <Text>发货地址：{dataS.shipAddressRegionName}</Text>
        <Text>收货地址：{dataS.receiveAddressRegionName}</Text>
        <Text>货源总重量：{dataS.materialTotalamount}吨</Text>
        <Text>预计装车时间：{dataS.predictLoadingTime}</Text>
        <Text style={{ color: '#008dff' }}>{vehicleNum}</Text>
      </div>
    );
    const that = this;
    Modal.confirm({
      title: '是否确认抢单？',
      content: mess,
      okText: '确认',
      cancelText: '取消',
      onOk() {
        /* 加防重复提交 new Promise */
        return new Promise((resolve, reject) => {
          grabasingle({id,vehicleno:vehicleNum}).then(resp=>{
            reject()
            if (resp.success) {
              that.setState({
                theBid: true,
              });
              Toast.success('抢单成功！')
              router.push('/network/waybill/grabasingle')
            }
          })
          setTimeout(() => {
            that.setState({
              theBid: false,
            });
          }, 3000);
        }).catch(() => console.log('Oops errors!'));
      },
      onCancel() {
      },
    });
  };

  render() {
    const { vehicle, theBid,dataS,mervehicle } = this.state;
    const { location: { state: { splitBill } } } = this.props;
    const content = (
      <div className='flexColumn'>
        <div className='baseline'>
          <Text className='suppliesName'>{dataS.materialName}</Text>
        </div>
        <WhiteSpace size='xs' />
        <Text>货源单号：{dataS.id}</Text>
        <WhiteSpace size='xs' />
        <Text>预计装车时间：{dataS.predictLoadingTime}</Text>
        <WhiteSpace size='xs' />
        <Text>装运说明：{dataS.transportNote}</Text>
        {
          splitBill === 1 ? <div className='divProgress' style={{ borderTop: 0 }}>
            <Progress
              percent={[(dataS.grabShipmentamount)/(dataS.grabShipmentamount+dataS.grabRemainamount)]*100}
              format={percent => `已抢${dataS.grabShipmentamount} 吨，还剩${dataS.grabRemainamount}吨`}
            />
          </div> : undefined
        }
      </div>
    );
    const actions = (
      [
        <div className='flex'>
        </div>
      ]);
    const route = (
      <div className='flexColumn'>
        <Text>发货地址：{dataS.shipAddressRegionName}</Text>
        <WhiteSpace size='xs' />
        <Text>收货地址：{dataS.receiveAddressRegionName}</Text>
      </div>);
    const actionsRoute = ([
      <div />]);
    const columns = [
      {
        title: '单价(元/吨)',
        dataIndex: 'price',
        key: 'price',
        align: 'center',
        render: text => <font color='red'>{text}</font>,
      },
      {
        title: '重量(吨)',
        dataIndex: 'materialTotalamount',
        key: 'materialTotalamount',
        align: 'center',
        render: text => <font color='red'>{text}</font>,
      },
      {
        title: '总价(元)',
        dataIndex: 'totalFreight',
        key: 'totalFreight',
        align: 'center',
        render: text => <font color='red'>{text}</font>,
      },
    ];
    const data = [{
      price: dataS.price,
      materialTotalamount: dataS.materialTotalamount,
      totalFreight: dataS.totalFreight,
    }];
    const Abike = (<Table columns={columns} dataSource={data} size="small" bordered pagination={false} />);
    const columns1 = [
      {
        title: '车牌号',
        dataIndex: 'truckno',
        align: 'center',
        render: text => <font color='#008dff'>{text}</font>,
      },
      {
        title: '车辆类型',
        dataIndex: 'trucktypeName',
        align: 'center',
      },
      {
        title: '核定载重量',
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
    const extra = <Tag color="red">拆单</Tag>;

    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/network/waybill/grabasingle')}
        >抢单信息详情
        </NavBar>
        <div className='am-list'>
          <NetWorkCardView
            title='货物信息'
            content={content}
            actions={actions}
            extra={splitBill === 1 ? extra : undefined}
          />
          <NetWorkCardView title='路线信息' content={route} actions={actionsRoute} />
          <NetWorkCardView title='单车信息' content={Abike} />
          <div style={{ padding: '12px 12px 0px' }}>
            <Button type="primary" block size='large' onClick={this.showModal}>立即抢单</Button>
          </div>
        </div>
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
          visible={theBid}
          footer={null}
          closable={false}
          width='70%'
        >
          <div style={{ textAlign: 'center' }}>
            <Icon type="check-circle" theme="filled" style={{ color: '#008dff', fontSize: 40, marginBottom: 20 }} />
            <Title level={4}>抢单成功</Title>
            <Text>可到抢单记录查看具体信息</Text>
          </div>
        </Modal>
      </div>);
  }
}
export default BiddingView;
