import React,{PureComponent} from 'react';
import { Icon , Table, Divider, Tag } from 'antd';
import router from 'umi/router';
import { NavBar,Tabs,} from 'antd-mobile';
import TheReportEcharts from '@/pages/DriverSide/Personal/TheReportEcharts';


class TheReport extends PureComponent{

  render() {
    const years = [
      { title: '2020', month:[{title:'1月'},{title:'2月'},{title:'3月'},{title:'4月'},{title:'5月'},{title:'6月'},{title:'7月'},{title:'8月'},{title:'9月'},{title:'10月'},{title:'11月'},{title:'12月'}]},
      { title: '2021', month:[{title:'1月'},{title:'2月'},{title:'3月'},{title:'4月'},{title:'5月'},{title:'6月'},{title:'7月'},{title:'8月'},{title:'9月'},{title:'10月'},{title:'11月'},{title:'12月'}]},
      { title: '2022', month:[{title:'1月'},{title:'2月'},{title:'3月'},{title:'4月'},{title:'5月'},{title:'6月'},{title:'7月'},{title:'8月'},{title:'9月'},{title:'10月'},{title:'11月'},{title:'12月'}]},
    ]
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >报表
        </NavBar>
        <div className='am-list'>
          <Tabs
            tabs={years}
            initialPage={0}
            onChange={(tab, index) => { console.log('onChange', index, tab); }}
            onTabClick={(tab, index) => { console.log('onTabClick', index, tab); }}
            swipeable={false}
          >
            {
              years.map(item=>{
                return (
                  <Tabs tabs={item.month} initialPage={0}>
                    {
                      item.month.map((index)=>{
                        const columns = [
                          { title: '物料', dataIndex: 'material', key: 'material', align:'center' },
                          { title: '车次', dataIndex: 'trains', key: 'trains', align:'center' },
                          { title: '吨数', dataIndex: 'tonnage', key: 'tonnage', align:'center' },
                          { title: '金额', dataIndex: 'amount', key: 'amount', align:'center' },
                        ];

                        const data = [
                          { key: '1', material: item.title==='2020'?'砂砾石':item.title==='2021'?'鹅卵石':'水泥', trains: '489', tonnage: '15406.50', amount: '693292.50', },
                          { key: '2', material: item.title==='2020'?'砂砾石':item.title==='2021'?'鹅卵石':'水泥', trains: '489', tonnage: '15406.50', amount: '693292.50', },
                          { key: '3', material: item.title==='2020'?'砂砾石':item.title==='2021'?'鹅卵石':'水泥', trains: '489', tonnage: '15406.50', amount: '693292.50', },
                          { key: '4', material: item.title==='2020'?'砂砾石':item.title==='2021'?'鹅卵石':'水泥', trains: '489', tonnage: '15406.50', amount: '693292.50', },
                        ];
                        return (
                          <div style={{background: 'white',padding: '10px',}} key={index.title}>
                            <Table
                              columns={columns}
                              dataSource={data}
                              pagination={false}
                              bordered
                              size="small"
                              className='theReport'
                            />
                            <div style={{height: '24px',lineHeight: '24px',borderLeft: '4px solid #1890ff',paddingLeft: '10px',marginTop: '20px'}}>销售柱状图</div>
                            <TheReportEcharts title={index.title} />
                          </div>
                        )
                      })
                    }
                  </Tabs>
                )
              })
            }
          </Tabs>
        </div>
      </div>
    );
  }
}
export default TheReport
