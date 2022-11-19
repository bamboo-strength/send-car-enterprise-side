import React,{PureComponent} from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon, Form, Button, Modal, Table, message } from 'antd';
import router from 'umi/router';
import { NavBar,WhiteSpace } from 'antd-mobile';
import NetWorkCardView from '@/components/NetWorks/NetWorkCardView';
import Text from 'antd/es/typography/Text';
import Title from 'antd/es/typography/Title';
import { detail, waybillsave } from '@/services/qrCode';
import { list } from '@/services/merVehicle';
import { verifyDriver } from '@/services/grabasingle';

@Form.create()
class QrCode extends PureComponent{
  state = {
    vehicle: false,
    vehicleNum: '',
    theBid: false,
    data:{},
    mervehicle:{},
  };

  componentWillMount() {
    list({current:1,size:5}).then(resp=>{
      this.setState({
        mervehicle:resp.data.records,
      })
    })
    const { location } = this.props
    const locationdata = location.state.data;
    this.setState({
      data:locationdata
    })
    // this.setState({
    //   data:{
    //     id:'',
    //     price:'',
    //     materialName:'',
    //     unitamount:'',
    //     shipper:'',
    //     shipperPhone:'',
    //     receiver:'',
    //     receiverPhone:'',
    //     shipAddressRegionName:'',
    //     shipFullAddress:'',
    //     receiveAddressRegionName:'',
    //     receiveFullAddress:'',
    //     materialTotalamount:'',
    //   },
    // })
  }

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
    const { vehicleNum,data } = this.state;
    if (!vehicleNum) {
      message.warning('请选择车辆');
      return;
    }
    verifyDriver({vehicleno:vehicleNum}).then(resp=>{
      if(resp.success===true) {
        this.setState({
          vehicleNum,
          vehicle: false,
        });
      }
    })

    const mess = (
      <div className='flexColumn'>
        <Text>发货地址：{data.shipAddressRegionName}/{data.shipFullAddress}</Text>
        <Text>收货地址：{data.receiveAddressRegionName}/{data.receiveFullAddress}</Text>
        <Text>货源总重量：{data.materialTotalamount}吨</Text>
        <Text>预计装车时间：2021-4-09</Text>
        <Text style={{color:'#008dff'}}>{vehicleNum}</Text>
      </div>
    )
    const that = this;
    Modal.confirm({
      title: '是否确认生成运单？',
      content: mess,
      okText: '确认',
      cancelText: '取消',
      onOk() {

        waybillsave({id:data.id,vehicleno:vehicleNum}).then(resp=>{
          if(resp.success) {
            that.setState({
              theBid: true,
            });
            router.push("/dashboard/freight")
          }
        })
        setTimeout(() => {
          that.setState({
            theBid: false,
          });
        }, 3000);
      },
      onCancel() {
      },
    });
  };

  render() {
    const { vehicle, theBid,data,mervehicle} = this.state;

    const route = (
      <div className='flexColumn'>
        <Text>发货地址：{data.shipAddressRegionName}/{data.shipFullAddress}</Text>
        <WhiteSpace size='xs' />
        <Text>收货地址：{data.receiveAddressRegionName}/{data.receiveFullAddress}</Text>
      </div>);
    const content = (
      <div className='flexColumn'>
        <div className='baseline'>
          <Text className='suppliesName'>物资名称：{data.materialName}</Text>
        </div>
        <WhiteSpace size='xs' /><Text>单价：{data.price}元</Text>
        <WhiteSpace size='xs' /><Text>单车重量：{data.unitamount}吨</Text>
        <WhiteSpace size='xs' /><Text>发货人：{data.shipper}</Text>
        <WhiteSpace size='xs' /><Text>发货人联系方式：{data.shipperPhone}</Text>
        <WhiteSpace size='xs' /><Text>收货人：{data.receiver}</Text>
        <WhiteSpace size='xs' /><Text>收货人联系方式：{data.receiverPhone}</Text>
      </div>
    );
    const rowSelection = {
      type: 'radio',
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          vehicleNum: selectedRows[0].truckno,
        });
      },
    };
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
        title: '核定载质量',
        dataIndex: 'approvedLoadWeight',
        align: 'center',
      },
    ];

    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/freight')}
        >扫码接单
        </NavBar>
        <div className='am-list'>
          <NetWorkCardView title='货物信息' content={content} extra={<a>货源单号:{data.id}</a>} />
          <NetWorkCardView title='路线信息' content={route} />
          <div style={{ padding: '12px 12px 0px' }}>
            <Button type="primary" block size='large' onClick={this.showModal}>生成运单</Button>
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
            <Title level={4}>生成运单成功</Title>
            <Text>可到运单管理查看具体信息</Text>
          </div>
        </Modal>
      </div>
    );
  }
}
export default QrCode;
