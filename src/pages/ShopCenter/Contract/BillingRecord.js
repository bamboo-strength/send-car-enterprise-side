import React,{PureComponent} from 'react';
import { Card, Form, Icon, Table } from 'antd';
import { NavBar,Tabs,Badge, List ,Accordion } from 'antd-mobile';
import { InTheLoad } from '@/components/Stateless/Stateless';
import { Invoicelist,RejectInvoiceRecord } from '@/services/contract';
import '../ShopCenter.less'

@Form.create()
class BillingRecord extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
      loading:false,
      list:'',
      invoiceMoney:'',
      invoiceWeight:'',
      rejectlist:'',
    }
  }

  componentDidMount() {
    const { location:{state:{contractno,contract} }} = this.props;
    Invoicelist({contractsList:contractno}).then(resp=>{
      this.setState({
        list:resp.data,
        invoiceWeight:resp.invoiceWeight,
        invoiceMoney:resp.invoiceMoney
      })
    })
    RejectInvoiceRecord({contractsList:contractno,contractNo:contract}).then(item=>{
     this.setState({
       rejectlist:item.data
     })
    })
  }


  render(){
    const { loading,list,invoiceWeight,invoiceMoney,rejectlist} = this.state
    const  columns =[
      { title:'物资名称', dataIndex:'materialName'},
      { title: '单价（元/吨）',dataIndex:'invoicePrice'},
      {title: '优惠单价（元/吨）',dataIndex: 'rebatePrice'},
      { title: '发货量（吨）',dataIndex:'invoiceWeight'},
      { title: '总金额（元）',dataIndex: 'invoiceMoney'},
    ]

    columns.forEach(a=>{
      const items = a;
      items.align = 'center'
    })

    const columns1 =[
      { title:'物资名称', dataIndex:'materialName'},
      { title: '单价（元/吨）',dataIndex:'invoicePrice'},
      {title: '优惠单价（元/吨）',dataIndex: 'rebatePrice'},
      { title: '发货量（吨）',dataIndex:'invoiceWeight'},
      { title: '总金额（元）',dataIndex: 'invoiceMoney'},
      {title: '驳回原因',dataIndex: 'ztext1'},
    ]
    columns1.forEach(a=>{
      const items = a;
      items.align = 'center'
    })

    const tabs =[
    { title: <Badge>已审核</Badge> },
    { title: <Badge>已驳回</Badge> },
    ]
    return(
      <div>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={()=>{
            window.history.back()
          }}
        >
          开票记录
        </NavBar>
        <div className='am-list'>
          <div>
            <Tabs
              tabs={tabs}
              initialPage={0}
              renderTabBar={props => <Tabs.DefaultTabBar {...props} page={2} />}
            >
              <div>
                {
                  loading?<InTheLoad />:(
                    <div style={{padding:10}}>{
                      <div>
                        <Card style={{marginTop:10}}>
                          <List.Item extra={invoiceWeight}>开票量（吨）</List.Item>
                          <List.Item extra={invoiceMoney}>开票金额（元）</List.Item>
                          <Accordion>
                            <Accordion.Panel>
                              <div style={{marginTop:10,}}>
                                <div style={{textAlign: 'center',fontSize:15,}}>开票金额明细</div>
                                <Table
                                  style={{marginTop:10,}}
                                  columns={columns}
                                  loading={loading}
                                  dataSource={list}
                                />
                              </div>
                            </Accordion.Panel>
                          </Accordion>
                        </Card>
                      </div>
                    }
                    </div>
                  )
                }
              </div>
              <div>
                {
                  loading?<InTheLoad />:(
                    <div style={{padding:10}}>{
                      <div>
                        <Card style={{marginTop:10}}>
                          <div style={{marginTop:10,}}>
                            <div style={{textAlign: 'center',fontSize:15,}}>开票金额明细</div>
                            <Table
                              style={{marginTop:10,}}
                              columns={columns1}
                              loading={loading}
                              dataSource={rejectlist}
                            />
                          </div>
                        </Card>
                      </div>
                    }
                    </div>
                  )
                }
              </div>
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

export default BillingRecord
