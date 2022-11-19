import React, { Component } from 'react';
import { List, NavBar, Toast, } from 'antd-mobile';
import { Card, Col, Form, Icon, Modal as PcModal } from 'antd';
import { router } from 'umi';
import { driverDrawBillList,changeVehicle} from '../../../../services/Epidemic/billOfLoadingServices';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import { getCurrentDriver,getToken } from '@/utils/authority';
import MatrixMobileSelect from '@/components/MatrixMobile/MatrixMobileSelect';
import { IconMeikuang, } from '@/components/Matrix/image';
import BillOfLoadingView from '../BillOfLoading/BillOfLoadingView';

@Form.create()
class DriverDrawList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showChangeVehicleModal: false,
      changeVehicleLoading:false,
      checkedId:'',
      subBillVisible:false,
      bill:{}
    };
  }

  onRef = ref => {
    this.child = ref;
  };

  getData=(type)=>{
    if (this.child) { this.child.onChoose({},type) }
  }

  changeVehicle=()=>{
    const {form} = this.props
    const {checkedId} = this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          changeVehicleLoading:true
        })
        const {vehiclenoName} = values
        changeVehicle({vehicleNo:vehiclenoName,id:checkedId}).then(resp=>{
          if(resp.success){
            Toast.info('修改成功')
            this.setState({
              changeVehicleLoading:false,
              showChangeVehicleModal:false
            })
            this.getData('refresh')
          }
        })
      }
    })

  }

  scanQrCode=()=>{
    const { name, phone, jszh,userId} = getCurrentDriver()
    const item ={
      auth: getToken(),
      userInfo: { name, phone, jszh,userId },
    }
    wx.miniProgram.navigateTo({url: `/pages/scanDeliveryOrder/index?items=${JSON.stringify(item)}`})
  }

  onClose=()=>{
    this.setState({
      showChangeVehicleModal:false,
      subBillVisible:false
    })
  }

  showDetail=(rowData)=>{
    this.setState({subBillVisible:true,bill:rowData})
  }

  changePraState=(state)=>{
    this.setState({subBillVisible:state})
  }

  render() {
    const {showChangeVehicleModal,changeVehicleLoading,subBillVisible,bill} = this.state
    const tabs = [{ title: '待接单', key: 'otherTab' }, { title: '已接单', key: '2' }, { title: '已完成', key: '4' }];
    const {form} = this.props
    const row = (rowData, sectionID, rowID) => {
      const {id,deptName,custName,materialName,beginTime,endTime,driverName,status,driverIdcard,driverPhone,vehicleNo,statusName} = rowData
      let actions = []
      if(status === 2){ // 已接单
        actions = [<a style={{color:'#1890FF'}} onClick={()=>this.setState({ showChangeVehicleModal:true,checkedId:rowData.id })}>修改车号</a>,]
      }
      actions.push([<a style={{color:'#1890FF'}} onClick={()=>this.showDetail(rowData)}>查看</a>])
      const listData = [{'label':'收货单位',value:custName,},{'label':'物资',value:materialName,},{'label':'有效开始时间',value:beginTime,},{'label':'有效结束时间',value:endTime,},
        {'label':'车牌号',value:vehicleNo,},{'label':'司机姓名',value:driverName,},{'label':'手机号',value:driverPhone,},{'label':'身份证号',value:driverIdcard,}]
      return (
        <div key={rowID}>
          <Card
            title={<div><img src={IconMeikuang} key={rowID} alt='' style={{height:20}} />&nbsp;&nbsp;{deptName}</div>}
            actions={actions}
            size="small"
            extra={statusName}
            className='card-list'
            bordered={false}
          >
            <List style={{position: 'static'}}>
              {
                listData.map(item=>{
                  return <List.Item style={{minHeight:38}} extra={item.value}>{item.label}：</List.Item>
                })
              }
            </List>
          </Card>
        </div>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/dashboard/function');
          }}
        >电子提货单(司机端)
        </NavBar>
        <div className='am-list'>
          <MatrixTabsListView
            tabs={tabs}
            onRef={this.onRef}
            interfaceUrl={driverDrawBillList}
            row={row}
            tabKeyName="status"
            changeTab={this.changeTab}
            otherTab={
              <div title='待接单' key='1'  onClick={this.scanQrCode}  style={{width: '100%',height: '50%',textAlign:'center'}}>
                <Icon type="scan" style={{fontSize:'100px',margin:'100px 0px 50px 0px'}} />
                <p style={{color:'blue'}}>扫一扫，开始接单</p>
                <p>扫描客户发给你的二维码，即可开始接单</p>
              </div>}
            dontShow
          />
        </div>
        <PcModal
          visible={showChangeVehicleModal}
          transparent
          maskClosable
          animationType='fade'
          platform='android'
          onCancel={()=>this.onClose()}
          confirmLoading={changeVehicleLoading}
          // className='QrCodeModal'
          closable={false}
          onOk={this.changeVehicle}
          bodyStyle={{height:'200px'}}
          destroyOnClose
        >
          <MatrixMobileSelect id='vehicleNo' labelId='vehiclenoName' required label='车牌号' custom={{ current: 1, size: -1,auditStatus:1 }} name="truckno" dictCode='/api/mer-driver-vehicle/vehicleInformationMaintenance/page' labelNumber={7} placeholder='请选择车牌号' form={form} />

        </PcModal>
        <BillOfLoadingView id={bill.id} bill={bill} subBillVisible={subBillVisible} changePraState={this.changePraState} />
      </div>
    );
  }
}

export default DriverDrawList;
