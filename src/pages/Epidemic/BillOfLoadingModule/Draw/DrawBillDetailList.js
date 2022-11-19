import React, { Component } from 'react';
import { List, NavBar, Toast, Modal, Button } from 'antd-mobile';
import { Card, Form, Icon, Row, } from 'antd';
import { router } from 'umi';
import { byDeliveryId, recovery, billFinish, } from '../../../../services/Epidemic/billOfLoadingServices';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import { IconMeikuang, } from '@/components/Matrix/image';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import BillOfLoadingView from '../BillOfLoading/BillOfLoadingView'

@Form.create()
class DrawBillDetailList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      bill:{},
      showSearchModal: false,
      subBillVisible:false
    };
  }

  onRef = ref => {
    this.child = ref;
  };

  getData=(type)=>{
    const {form} = this.props
    if(type === 'reset'){
      form.resetFields()
    }
    const formValues = form.getFieldsValue()
    const param = {
      ...formValues,
    }
    if (this.child) { this.child.onChoose(param,type) }
    this.setState({
      showSearchModal:false
    })
  }

  handleData=(id,type)=>{
    const msg = type==='recover'?'回收':'完成'
    Modal.alert(msg,`确定${msg}该数据？`
      , [
        { text: '取消', onPress: () => console.log('cancel') },
        { text: '确定', onPress: () =>
            new Promise((resolve, reject) => {
              if(type === 'recover'){ // 回收
                recovery({id}).then(resp=>{
                  if(resp.success){
                    Toast.info('操作成功')
                    resolve()
                    this.getData('refresh')
                  }
                })
              }else { // 完成
                billFinish({ id }).then(resp => {
                  if (resp.success) {
                    Toast.info('操作成功')
                    resolve()
                    this.getData('refresh')
                  }
                })
              }
            }),
        },
      ])
  }

  handleCancel=()=>{
    this.setState({
      subBillVisible:false,
      showSearchModal:false
    })
  }

  showDetail=(rowData)=>{
    this.setState({subBillVisible:true,bill:rowData})
  }

  changePraState=(state)=>{
    this.setState({subBillVisible:state})
  }

  render() {
    const { match: { params: { billId } },form} = this.props;
    const {showSearchModal,subBillVisible,bill} = this.state
    const tabs = [{ title: '已绑定', key: '2' }, { title: '已作废', key: '3' }, { title: '已完成', key: '4' }];
    const row = (rowData, sectionID, rowID) => {
      const {deptName,id,deliveryNo,custName,vehicleNo,driverName,driverPhone,bindTime,status,statusName,materialName} = rowData
      let actions = []
      if(status === 2){ // 已绑定（已领取）
        actions = [<a style={{color:'#1890FF'}} onClick={()=>this.handleData(id,'recover')}>回收</a>,
          <a style={{color:'#1890FF'}} onClick={()=>this.handleData(id,'finish')}>完成</a>]
      }
      actions.push([<a style={{color:'#1890FF'}} onClick={()=>this.showDetail(rowData)}>查看</a>])
      const listData = [{'label':'收货单位',value:custName,},{'label':'提货单号',value:deliveryNo,},{'label':'物资',value:materialName,},{'label':'车牌号',value:vehicleNo,},{'label':'司机姓名',value:driverName,}
      ,{'label':'手机号',value:driverPhone,},{'label':'绑定时间',value:bindTime,}]
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
          rightContent={[<Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.setState({ showSearchModal: true, })} />]}
          onLeftClick={() => {
            router.push('/billOfLoading/drawBill/customerDraw');
          }}
        >电子提货单详情
        </NavBar>
        <div className='am-list'>
          <MatrixTabsListView
            tabs={tabs}
            onRef={this.onRef}
            interfaceUrl={byDeliveryId}
            row={row}
            tabKeyName="status"
            changeTab={this.changeTab}
            param={{deliveryId:billId}}
            dontShow
          />
        </div>
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={this.handleCancel}
          popup
          animationType='slide-down'
          platform='android'
        >
          <Row>
            <MatrixMobileInput id='vehicleNo' label='车号' labelNumber={8} placeholder='请输入车号' className='list-class' form={form} />
            <MatrixMobileInput id='driverName' label='司机姓名' labelNumber={8} placeholder='请输入司机姓名' className='list-class' form={form} />
            <MatrixMobileInput id='driverPhone' label='手机号' labelNumber={8} placeholder='请输入手机号' className='list-class' form={form} />
          </Row>

          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.getData()} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.getData('reset')} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>

        <BillOfLoadingView id={bill.id} bill={bill} subBillVisible={subBillVisible} changePraState={this.changePraState} />
      </div>
    );
  }
}

export default DrawBillDetailList;
