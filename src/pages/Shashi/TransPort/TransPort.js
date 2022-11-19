import React, { PureComponent } from 'react';
import { Button, Divider, Form, Icon } from 'antd';
import router from 'umi/router';
import { NavBar, SearchBar, Toast } from 'antd-mobile';
import Title from 'antd/lib/typography/Title';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import '../Shashi.less'
import { antiShake, EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import {list,detail,submit} from '@/services/commonBusiness'
import func from '@/utils/Func'

@Form.create()
class TransPort extends PureComponent {

  state = {
    isData:true,
    details:[],
    isloading:false,
    resultData:{},
    logisticslist:[],
    isSendAsingle:true,
    showMag:'请输入车牌号查询',
    deliverytime:{},
    queryVehicle:''
  }

  /* 调用接口 */
  Interface = antiShake((e)=>{
    const {deliverytime} = this.state
    const queryParam = {
      current: 1,
      size: 33,
      ...e
    }
    const params = {
      tableName: 'transportation_qualification_inspection',
      modulename: 'query',
      queryParam,
    }
    list(params).then(item=>{
      if (item.success){
        params.tableName = 'mer_dispatchbill_customer_materialnos'
        params.modulename = 'byDirect'
        const realData = item.data.resultData.records
        this.setState({
          details:realData
        })
        if (realData.length === 0){
          this.setState({
            isloading:false,
          })
          return
        }
        params.queryParam = {
          ...queryParam,
          ...deliverytime
        }
        params.vehicleno_like = realData[0].vehicleno
        list(params).then(resp=>{
          if (resp.success){
            const logisticslist = resp.data.resultData.records
            this.setState({
              isloading:false,
              isData:false,
              logisticslist
            })
          }
        })
      }else {
        this.setState({
          isloading:false,
        })
      }
    })
  },1000)

  componentDidMount() {
    const date = new Date()
    const cycletime = func.formatFromStr(date,'YYYY-MM-DD HH:mm:ss')
    const date2 = new Date(date.setMonth(date.getMonth() - 3))
    const queryDate = func.formatFromStr(date2,'YYYY-MM-DD HH:mm:ss')
    this.setState({
      deliverytime:{
        queryDate_equal:`${queryDate},${cycletime}`,
        cycletime
      }
    })
  }

  /* 输入框查询 */
  onChange = e =>{
    this.setState({
      resultData:{},
      isSendAsingle:true,
      queryVehicle:e.length >= 4?e.trim():''
    })
    if (e.length >= 4){
      this.setState({
        isloading:true,
        isData:false,
      })
      this.Interface({'vehicleno_like':e.trim()})
    }
  }


  /* 扫描二维码 */
  scanTheCode = ()=>{
    try {
      ERCode.scanErcode()
      window.content = (resp) => {
        const {deliverytime} = this.state
        const param = {
          modulename: "byDirect",
          realId: resp,
          tableName: "mer_dispatchbill_customer_materialnos",
          ...deliverytime
        }
        this.setState({
          isSendAsingle:false
        })
        Toast.loading('加载中')
        detail(param).then(item=>{
          Toast.hide()
          if (item.success){
            this.setState({
              resultData:item.data.resultData,
              isloading:false,
              isData:false
            })
            if (item.data.resultData.vehicleno){
              this.Interface({'vehicleno_like':item.data.resultData.vehicleno})
            }
          }
        })
      };
    }catch (e) {
      Toast.fail('浏览器不支持扫码!');
    }
  }

  /* 取消 */
  onCancel = ()=>{
    /* 通过 ref 设置输入框为空 */
    this.seatchBar.state.value = ''
    this.setState({
      isData:true
    })
  }

  setTpThe = ()=>{
    try {
      DeviceInfo.setBluetooth()
    }catch (e) {
      Toast.fail('浏览器不支持手机端设置!');
    }
  }

  /* RFID */
  toAndriod=()=>{
    const that = this
    // that.Interface({'rfidno_equal':'E2806894000050094E9219AF'}) // 测试
     try {
      this.setState({
        showMag:'正在读取RFID...'
      })
      DeviceInfo.getDeviceId()
      window.deviceContent = (resp) => {
        // Toast.info(resp.toString())
        if(resp){
          this.setState({
            showMag:'RFID读取成功,正在查询...'
          },()=>{
            Toast.info('RFID读取成功，正在查询...')
            that.Interface({'rfidno_equal':resp})
          })
        }else {
          Toast.info('RFID读取失败,请靠近标签，重新读取')
          this.setState({
            showMag:'RFID读取失败,请靠近标签，重新读取',
          },()=>{
            that.Interface({'rfidno_equal':'111111'})
          })
        }

      };
    }catch (e) {
      Toast.fail('浏览器不支持RFID识别!');
    }

  }

  // 合法
  legal = (param,item) =>{
    let params = {vehicleNo:param.vehicleNo,isLegal:1}
    if(item){
      params = {
        ...params,
        dispatchNo:item.id,
        materialCode:item.materialnos,
        custNo:item.custno,
        contractNo:item.contractno,
        contractSubNo:item.sublist[0].contractSubno,
        bourn:item.bourn,
        bournDetail:item.bournDetail,
        deptId:item.deptId
      }
    }
    submit({tableName:'transportation',modulename:'verification',submitParams:params,btnCode:'add'}).then(resp => {
      if (resp.success) {
        Toast.info("操作成功！");
        // this.Interface({'vehicleno_like':queryVehicle})
      }
    });
  }

  // 非法
  Illegal = (param,item) => {
    let params = {vehicleNo:param.vehicleNo,isLegal:0}
    if(item){
      params = {
        ...params,
        dispatchNo:item.id,
        materialCode:item.materialnos,
        custNo:item.custno,
        contractNo:item.contractno,
        contractSubNo:item.sublist[0].contractSubno,
        bourn:item.bourn,
        bournDetail:item.bournDetail,
        deptId:item.deptId
      }
    }
    submit({tableName:'transportation',modulename:'verification',submitParams:params,btnCode:'add'}).then(resp => {
      if (resp.success) {
        Toast.info("操作成功！");
        // this.Interface({'vehicleno_like':queryVehicle})
      }
    });
  }

  render() {
    const {isData,details,isloading,resultData,logisticslist,isSendAsingle,showMag} = this.state
    let logistics = []; let vehicle = []; let driverlist = [];
    if (details.length !== 0){
      logistics = [
        {label:'发货地',text:JSON.stringify(resultData) !== '{}' && resultData.deptName},
        {label:'收货地',text:JSON.stringify(resultData) !== '{}' && `${resultData.bourn}${resultData.bournDetail}`},
        {label:'循环结束时间',text:JSON.stringify(resultData) !== '{}' && resultData.cycletime},
      ]
      vehicle = [
        {label:'车辆类型',text:details[0].vehicletypeName},
        {label:'车轴数',text:details[0].axlesName},
        {label:'挂车号',text:details[0].trailercarno},
        {label:'皮重',text:details[0].tareweight},
        {label:'车厢长度',text:details[0].vehlength},
        {label:'车厢宽度',text:details[0].vehwidth},
        {label:'运输公司',text:details[0].transitcomName},
      ]
      driverlist = [
        {label:'姓名',text:details[0].drivername},
        {label:'身份证号',text: details[0].driveridno},
      ]
    }
    const marginRight = 10
    const originalDispData = logisticslist.length>0?logisticslist.filter(ii=>ii.originalDisp==0):[]
    const item = originalDispData.length>0?originalDispData[0]:{} // 非原始派单第一条
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push( '/dashboard/function')}
        >运输资质查验
        </NavBar>
        <div className='am-list'>
          <div style={{padding:10,background:'white'}}>
            <Button ghost type="primary" style={{marginRight}} onClick={() => this.scanTheCode()}>二维码扫描</Button>
            <Button ghost type="primary" style={{marginRight}} onClick={() => this.toAndriod()}>RFID识别</Button>
            <Button ghost type="primary" style={{marginRight}} onClick={() => this.setTpThe()}>设置</Button>
          </div>
          <SearchBar placeholder="请输入车牌号查询" ref={el=>{this.seatchBar = el}} onChange={this.onChange} onCancel={this.onCancel} maxLength={8} />
          {
            isData ? <EmptyData text={showMag} />:
              ( isloading? <InTheLoad />:
                (details.length !== 0 || JSON.stringify(resultData) !== '{}'?
                    (
                <div style={{padding:15,background:'white'}}>
                  <Title level={4}>{details.length !== 0 && details[0].vehicleno}</Title>
                  <div className='transport'>物流信息</div>
                  <div>
                    {
                      isSendAsingle ? (
                        item.deptName?
                          <div className='tran-logistics'>
                            <MatrixListItem style={{minHeight:38}} label="发货地" title={item.deptName} />
                            <MatrixListItem style={{minHeight:38}} label="客户" title={item.custName} />
                            <MatrixListItem style={{minHeight:38}} label="收货地" title={`${item.bourn}${item.bournDetail}`} />
                            <MatrixListItem style={{minHeight:38}} label="货物种类" title={item.sublist[0].materialName} />
                            <MatrixListItem style={{minHeight:38}} label="进厂时间" title={item.intime} />
                            <MatrixListItem style={{minHeight:38}} label="出厂时间" title={item.outgatetime} />
                            <MatrixListItem style={{minHeight:38}} label="循环结束时间" title={item.cycletime} />
                            <Button type="primary" onClick={()=>this.legal({vehicleNo:details[0].vehicleno},item)} style={{marginBottom:10,marginRight:10}}>合法</Button>
                            <Button type="danger" onClick={()=>this.Illegal({vehicleNo:details[0].vehicleno},item)} style={{marginBottom:10}}>非法</Button>
                          </div>:
                          <div style={{textAlign:'center',padding:10}}>暂无物流信息</div>
                      ):(
                        logistics.map(ii=><MatrixListItem style={{minHeight:38}} label={ii.label} title={ii.text} />) /* 扫描二维码显示信息 */
                      )
                    }
                  </div>
                  <Divider style={{margin:'5px 0 15px'}} />
                  <div className='transport'>车辆信息</div>
                  {
                    vehicle.map(ii=><MatrixListItem style={{minHeight:38}} label={ii.label} title={ii.text} />)
                  }
                  {
                    logisticslist.length === 0?
                      <div>
                        <Button type="primary" onClick={()=>this.legal({vehicleNo:details[0].vehicleno})} style={{marginBottom:10,marginRight:10}}>合法</Button>
                        <Button type="danger" onClick={()=>this.Illegal({vehicleNo:details[0].vehicleno})} style={{marginBottom:10}}>非法</Button>
                      </div>:undefined
                  }

                  <Divider style={{margin:'5px 0 15px'}} />
                  <div className='transport'>司机信息</div>
                  {
                    driverlist.map(ii=><MatrixListItem style={{minHeight:38}} label={ii.label} title={ii.text} />)
                  }
                  {/*  原始派车单 */}
                  <Divider style={{margin:'5px 0 15px'}} />
                  <div className='transport'>原始派车单</div>
                  {
                    logisticslist.length > 0 ? logisticslist.filter(ii=>ii.originalDisp==1).map(ii=>{
                        return (
                          <div className='tran-logistics'>
                            <MatrixListItem style={{minHeight:38}} label="发货地" title={ii.deptName} />
                            <MatrixListItem style={{minHeight:38}} label="客户" title={ii.custName} />
                            <MatrixListItem style={{minHeight:38}} label="收货地" title={`${ii.bourn}${ii.bournDetail}`} />
                            <MatrixListItem style={{minHeight:38}} label="货物种类" title={ii.sublist[0].materialName} />
                            <MatrixListItem style={{minHeight:38}} label="进厂时间" title={ii.intime} />
                            <MatrixListItem style={{minHeight:38}} label="出厂时间" title={ii.outgatetime} />
                            <MatrixListItem style={{minHeight:38}} label="循环结束时间" title={ii.cycletime} />
                            <Button type="primary" onClick={()=>this.legal({vehicleNo:details[0].vehicleno},ii)} style={{marginBottom:10,marginRight:10}}>合法</Button>
                            <Button type="danger" onClick={()=>this.Illegal({vehicleNo:details[0].vehicleno},ii)} style={{marginBottom:10}}>非法</Button>
                          </div>
                        )
                      }
                    ):<div style={{textAlign:'center',padding:10}}>暂无原始派车单</div>
                  }
                </div>

              ):(<EmptyData text='没有查询到你要查询的车牌号' />)
            ))
          }
        </div>
      </div>
    );
  }
}


export default TransPort;
