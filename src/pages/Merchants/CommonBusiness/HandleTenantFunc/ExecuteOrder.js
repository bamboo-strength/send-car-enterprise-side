import React, { PureComponent } from 'react';
import { Col, Form, Row, Button } from 'antd';
import { Modal, Toast } from 'antd-mobile';
import './Index.less'
import Text from 'antd/lib/typography/Text';
import { appointmentDate,getAppointmentTime,executeOrder,againAppointment } from '@/services/Despatch/DispatchServices';
import { EmptyData, } from '@/components/Stateless/Stateless';
import Loading from '@/components/Loading/Loading';

@Form.create()
class ExecuteOrder extends PureComponent { // 董家口执单功能

  constructor( props ){
    super(props)
    this.state = {
      executeOrderVisible:false,
      dates:'',
      btnDatas:[],
      checkDate:'',
      checkTimeData:'',
      btnIndex:'',
      isLoading:true
    }
  }

  componentWillReceiveProps(nextProps, ) {
    this.setState({
      executeOrderVisible:nextProps.executeOrderVisible
    })

    if(nextProps.obj.id && nextProps.executeOrderVisible){
      appointmentDate({varNo:nextProps.obj.varno,vehicletype:nextProps.obj.vehicletype}).then(resp=>{
        if(resp.success){
          this.setState({
            isLoading:false,
            dates:resp.data,
            obj:nextProps.obj,
            checkDate:resp.data[0].day,
          },()=>{ // 取第一条数据
            this.clickWeek(resp.data[0])
          })
        }
      })
    }
  }


  clickWeek=(data,)=>{
    const {obj} = this.state
    const {day} = data
    this.setState({
      checkDate:day,
      btnIndex:-1
    })
    getAppointmentTime({varNo:obj.varno,day}).then(resp=>{
      this.setState({
        btnDatas:resp.data,
      })
    })
  }

  confirmTime=(item,index)=>{
    this.setState({
      checkTimeData:item,
      btnIndex: index
    })
  }

   confirm =async ()=>{
    const {obj,checkDate,checkTimeData,} = this.state

    if(!checkTimeData){
      Toast.info('请选择时间')
      return
    }
    this.setState({
      loading:true
    })
     let resp = {}
    if(obj.type === 'executeOrder'){ // 执单
       resp =  await executeOrder({id:obj.id,time:`${checkDate}`,bookingid:checkTimeData.id})
    }else { // 重新预约
      resp = await againAppointment({id:obj.id,day:`${checkDate}`,bookingid:checkTimeData.id})
    }
     this.setState({
       loading:false
     })
     if(resp.success){
       this.handleSuccess(obj.type)
     }

  }

  handleSuccess=(type)=>{
    const {refresh,} = this.props
    Toast.info(type === 'executeOrder'?'执单成功':'预约成功')
    this.close()
    refresh()
  }

  close=()=>{
    const {onClose} = this.props;
    this.setState({
      checkTimeData:''
    })
    onClose()
  }

  render(){

    const {executeOrderVisible,dates,btnDatas,checkDate,loading,btnIndex,isLoading} = this.state
    const disGrid = {display:'grid',gridTemplateColumns: `repeat(7,1fr)`,gap:15,margin:'15px 0px ',width: '100%', overflow: 'auto'}
    // const modalTitle = (
    //   <div>
    //     <div style={{padding:'10px'}}>请选择预约时间</div>
    //     <div className='modalTitle'>
    //       <span><Button type="text" onClick={this.close}>取消</Button></span>
    //       <span><Button type="text" onClick={this.confirm} loading={loading}>确定</Button></span>
    //     </div>
    //   </div>
    // )
    return (
      <div>
        <Modal
          popup
          visible={executeOrderVisible}
          // onClose={this.close}
          animationType="slide-up"
          bodyStyle={{height:'570px'}}
          title={null}
          maskClosable={false}
          // afterClose={() => { alert('afterClose'); }}
        >
          <div>
            <div style={{padding:'10px', fontSize: 18, color: '#111'}}>请选择预约时间</div>
            <div className='modalTitle' style={{ padding: '0 20px'}}>
              <span><Button type="text" onClick={this.close}>取消</Button></span>
              <span><Button type="text" onClick={this.confirm} loading={loading}>确定</Button></span>
            </div>
          </div>
          {
            dates ?
            dates.length>0?
              <div className='executeOrderDiv'>
                <div style={{...disGrid}}>
                  {
                    dates.map((item,index)=>{
                      let background = 'rgb(243 238 238)'; let color='black'; let border='none'
                      if(item.day === checkDate){
                        background = 'white';color='orange';border='solid 1px orange';
                      }
                      // const background = item.day === checkDate?'white':'rgb(243 238 238)'
                      // const color = item.day === checkDate?'orange':'black'
                      // const border = item.day === checkDate?'solid 1px orange':'none'
                      return (
                        <div
                          style={{background,border,boxShadow: '#fafafe 0px 0px 5px 0px',borderRadius:5,display: 'flex',flexDirection: 'column',alignItems: 'center',height:'90px',padding:'0px 4px'}}
                          onClick={()=>this.clickWeek(item,index)}
                        >
                          <Text style={{fontWeight: 'bold',fontSize: '20px',color,margin:'7px 0px'}}> {item.day} </Text>
                          <Text style={{color}}> {item.week} </Text>
                        </div>
                      )
                    })
                  }
                </div>
                <Row gutter={16}>
                  {
                    btnDatas.map((item,index)=>{
                      return (
                        <Col span={12}>
                          <Button className={btnIndex === index?'btnSty checkBtn':'btnSty'} onClick={()=>this.confirmTime(item,index)} disabled={item.surplusveh==='已满'}>
                            {item.date} <span style={{fontSize:'13px'}}>&nbsp;({item.surplusveh==='已满'?'已满':`余${item.surplusveh}`})</span>
                          </Button>
                        </Col>
                      )
                    })
                  }
                </Row>
              </div>:
              <EmptyData text='暂无记录' height='100%' />
              :<Loading isLoading={isLoading} />
          }


        </Modal>
      </div>

    );
  }

}
export default ExecuteOrder;

