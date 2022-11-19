import React, { PureComponent } from 'react';
import { Form, Modal as PcModal } from 'antd';
import '../../Epidemic.less'
import { queueDeliverySubDetail } from '@/services/Epidemic/billOfLoadingServices';
import QRCode from 'qrcode.react';


@Form.create()

class BillOfLoadingView extends PureComponent {
  state = {
    subBillVisible:false,
    detailData:{}
  };


  componentWillReceiveProps(nextProps, nextContext) {
    const {id,bill,} = this.props
    const {subBillVisible} = this.state
    // console.log(bill,nextProps.bill,'---')
    if(subBillVisible !== nextProps.subBillVisible){
      this.setState({
        subBillVisible:nextProps.subBillVisible
      })
    }
    if(nextProps.id && (id !== nextProps.id || bill.vehicleNo !== nextProps.bill.vehicleNo)){
        this.getData(nextProps.id,)
    }
  }

  getData=(id,subBillVisible)=>{
    queueDeliverySubDetail({id}).then(resp => {
      if (resp.success) {
        this.setState({
          detailData:resp.data,
        })
      }
    });
  }

  handleCancel=()=>{
    const {changePraState} = this.props
    changePraState(false)
    this.setState({
      subBillVisible:false,
    })
  }

  render() {
    const { subBillVisible,detailData } = this.state
    const flexSty = {display: 'flex',justifyContent: 'space-between', color: 'black',fontWeight:'bold'}
    const tableContent =(
      <div id='table' className='tableSty'>
        <div className='topText'>电子提货单</div>
        <div className='noStyle'>{detailData.deliveryNo}</div>
        <table id='billOfLoadTable' border="2" style={{width:'100%'}}>
          <caption style={{captionSide: 'top'}}>
            <div style={flexSty}>
              <span>收货单位：{detailData.custName}</span>
              <span>{detailData.beginTime}</span>
              <span>单位：吨</span>
            </div>
          </caption>
          <tr>
            <td>货品</td>
            <td>皮重</td>
            <td>毛重</td>
            <td>净重</td>
            <td>运输目的地</td>
            <td>提货码</td>
          </tr>
          <tr>
            <td>{detailData.materialName}</td>
            <td>{detailData.tareWeight}</td>
            <td>{detailData.grossWeight}</td>
            <td>{detailData.netWeight}</td>
            <td>{detailData.destination}</td>
            <td rowSpan={3}>
              {detailData.id?
                <QRCode
                  value={detailData.id}// 生成二维码的内容
                  size={120} // 二维码的大小
                  fgColor="#000000"
                  bgColor='#e8dede'
                  style={{margin: '0px auto'}}
                />:undefined
              }
            </td>
          </tr>
          <tr>
            <td colSpan="2">车牌号</td>
            <td colSpan="2">司机姓名</td>
            <td>司机手机号</td>
          </tr>
          <tr>
            <td colSpan="2">{detailData.vehicleNo}</td>
            <td colSpan="2">{detailData.driverName}</td>
            <td>{detailData.driverPhone}</td>
          </tr>
        </table>
        <div style={flexSty}>
          <span>发货单位：{detailData.deptName}</span>
          {/*  <span>承运商：{detailData.aa}</span> */}
          <span />
        </div>
      </div>
    )
    return (
      <PcModal
        // title='电子提货单查看'
        visible={subBillVisible}
        onCancel={this.handleCancel}
        className="qrModal"
        footer={null}
        bodyStyle={{padding:0,transform: 'rotate(90deg)'}}
        style={{ top: 10 }}
      >
        {tableContent}
      </PcModal>

    );
  }
}
export default BillOfLoadingView;
