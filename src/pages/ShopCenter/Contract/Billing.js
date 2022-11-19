import React,{PureComponent} from 'react';
import { Form, Icon, Table,Button  } from 'antd';
import {Card,Descriptions} from 'antd/lib/index';
import { NavBar, Toast } from 'antd-mobile';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { InvoiceRecord, lookInvoice ,applyInvoice} from '@/services/contract';
import styles from '../../../layouts/Sword.less';

@Form.create()
class Billing extends PureComponent{
  constructor(props) {
    super( props);
    this.state = {
      loading:false,
     list:'',
      invoiceMoney:'', // 待开票
      invoiceWeight:'',
      sinvoiceWeight:'', // 已开票
      sinvoiceMoney:'',
    }
  }

  componentDidMount() {
    const { location:{state:{contractno,contract} }} = this.props;
    lookInvoice({contractsList:contractno,contractNo:contract}).then(item=>{  // 待开票
      this.setState({
       list:item.data,
        invoiceWeight:item.invoiceWeight,
        invoiceMoney:item.invoiceMoney,
        status:item.auditFlag,
        reason:item.ztext1,
      })
    })
    InvoiceRecord({contractsList:contractno}).then(resp=>{  // 已开票
     this.setState({
       sinvoiceWeight:resp.invoiceWeight,
       sinvoiceMoney:resp.invoiceMoney
     })
    })
  }

  onSubmit = () => {
    const {list}= this.state
    const param ={
      contractSaveList:list
    }
    applyInvoice(param).then(resp=>{
      if (resp.success){
        Toast.success('提交成功')
        window.history.back();
      }
    })
  }


  render(){
    const { loading,list,invoiceWeight,invoiceMoney,sinvoiceMoney,sinvoiceWeight, } = this.state
    const { location:{state }} = this.props;
    const  columns =[
      { title:'物资名称', dataIndex:'materialName'},
      { title: '单价（元/吨）',dataIndex:'invoicePrice'},
      { title: '发货量（吨）',dataIndex:'invoiceWeight'},
      { title: '总金额（元）',dataIndex: 'invoiceMoney'},
    ]
    return(
      <div>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() =>{
            window.history.back()
          }}
        >申请开票
        </NavBar>
        <div className='am-list'>
          {
            loading?<InTheLoad />:
            <div style={{padding:12}}>
              <Card title={<div>合同号：{state.contract}</div>}>
                <Card title='已开票' bordered={false} className={`${styles.card} commonPageView`}>
                  <Descriptions column={1} style={{marginTop:16}}>
                    <Descriptions.Item label='开票量(吨)' style={{color:'#f76a24',}}><strong style={{marginLeft:75}}>{sinvoiceWeight}</strong></Descriptions.Item>
                    <Descriptions.Item label='开票金额(元)'><strong style={{marginLeft:60}}>{sinvoiceMoney}</strong></Descriptions.Item>
                  </Descriptions>
                </Card>
              </Card>
              <Card bordered>
                <Card title='待开票' bordered={false} className={`${styles.card} commonPageView`}>
                  <Descriptions column={1} style={{marginTop:16}}>
                    <Descriptions.Item label='开票量(吨)'><strong style={{marginLeft:75}}>{invoiceWeight}</strong></Descriptions.Item>
                    <Descriptions.Item label='开票金额(元)'><strong style={{marginLeft:60}}>{invoiceMoney}</strong></Descriptions.Item>
                  </Descriptions>
                </Card>
              </Card>
              <div>
                <Card>
                  <div style={{textAlign: 'center',fontSize:15,}}>开票金额明细</div>
                  <Table
                    style={{marginTop:10,}}
                    columns={columns}
                    loading={loading}
                    dataSource={list}
                  />
                </Card>
                {
                    (invoiceMoney==="0"&&invoiceWeight==="0")?(
                      <Button type='primary' style={{marginTop:15,width:'100%'}} shape="round" onClick={this.onSubmit} disabled>提交申请</Button>
                    ):(
                      <Button type='primary' style={{marginTop:15,width:'100%'}} shape="round" onClick={this.onSubmit}>提交申请</Button>
                  )
                }
              </div>
            </div>
          }
        </div>
      </div>
    )
  }
}

export  default Billing
