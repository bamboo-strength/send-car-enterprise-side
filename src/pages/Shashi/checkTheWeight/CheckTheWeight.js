import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Icon, Input } from 'antd';
import { Checkbox, Modal, NavBar, NoticeBar, Toast, WhiteSpace } from 'antd-mobile';
import { Modal as PcModal } from 'antd/lib/index';
import { router } from 'umi';
import { weightList } from '@/services/customer';
import MatrixDate from '@/components/Matrix/MatrixDate';
import Func from '@/utils/Func';
import func from '@/utils/Func';
import 'antd/dist/antd.less';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import u484 from '@/components/ListCompontents/image/u484.png';
import { getCurrentUser } from '@/utils/authority';
import { handleDate } from '@/components/Matrix/commonJs';
import { requestPostHeader } from '@/services/api';

const {CheckboxItem} = Checkbox;

@connect(({ commonBusiness,tableExtend,loading }) =>({
  commonBusiness,
  tableExtend,
  loading:loading.models.commonBusiness,
}))
@Form.create()
class CheckTheWeight extends PureComponent {
  constructor(props) {
    super(props);
    const startTime=Func.moment(Func.MonthstartTime())
    const endTime = Func.moment(Func.DayendTime1())
    this.state = {
      visible:false,
      showExportModal:false,
      exportLoading:false,
      initialValue:'',
      params:{
        tenant_id: getCurrentUser().tenantId,
        createTime_gt:Func.format(startTime),
        createTime_lt:Func.format(endTime),
        queryDate_equal:`${Func.format(startTime)},${Func.format(endTime)}`,
      },
    };
  }

  skip=(rowData)=>{
    this.setState({
      showExportModal:true,
      initialValue:rowData.contractno
    })
  }

  handleSearch=()=>{
    this.child.onAgain()
    this.setState({
      visible:false,
    })
  }

  onRef = ref =>{
    this.child = ref
  }

  getData=(type)=>{
    const {form} = this.props
    const formValues = form.getFieldsValue()
    const p = type === 'reset' ? {} : formValues
    if(type === 'reset'){
      form.resetFields()
    }
    const param = {
      // ...formValues,
      ...p,
      tenant_id: getCurrentUser().tenantId,
      queryDate_equal:`${Func.format(formValues.createTime_gt,'YYYY-MM-DD HH:mm:ss')},${Func.format(formValues.createTime_lt,'YYYY-MM-DD HH:mm:ss')}`,
    }
    // this.setState({
    //   param
    // })
    if (this.child) { this.child.onAgain(param,'refresh') }
    this.setState({
      visible:false
    })
  }

  downExcel=()=>{
    const {form} = this.props
    form.validateFieldsAndScroll((err, values) => {
      const {initialValue} = this.state
      const start = form.getFieldValue('grosstime_gt')
      const end = form.getFieldValue('grosstime_lt')
      const contractno = form.getFieldValue('contractno')
      const standTime =  90*24*60*60*1000 // 90天
      if(new Date().getTime()-new Date(start).getTime()>standTime){
        Toast.info('导出数据开始日期距今不能超过3个月(90天)')
        this.clearExportSettiong(true)
        return
      }
      if (err) { return; }
      this.setState({
        exportLoading:true
      })

      const params = {
        queryDate_equal:`${func.format(start)},${func.format(end)}`,
        contractno_like:initialValue,
        tenant_id: getCurrentUser().tenantId,
      }
      requestPostHeader('/api/mer-shop/despatchvehicle/print', params).then(resp=>{
        if (resp.success) {
          const {records} = resp.data
          const list = []
          if(records.length>0){
            records.forEach((item) => {
              list.push({
                data01:item.deptName,
                data02:item.custName,
                data03:item.contractSubno,
                data04:item.vehicleno,
                data05:item.axle,
                data06:item.materialName,
                data07:item.tareweight,
                data08:item.grossweight,
                data09:item.netweight,
                data10:item.balanceMoney,
                data11:item.price,
                data12:item.taretime,
                data13:item.grosstime,
              })
            });
            const content = {
              fileName:`销售检斤明细表${initialValue}`,
              titles:['所属机构', '客户','子合同号', '车号', '轴数','物资','皮重','毛重','净重','交易金额(元)','单价(元)','空车时间','重车时间'],
              list
            }
            // Toast.info(JSON.stringify(content))
            ExportExcel.toExcel(JSON.stringify(content)) // 调用安卓外壳
            this.clearExportSettiong()
          }else {
            Toast.info('没有可导出的数据')
            this.clearExportSettiong()
          }
        }else {
          this.clearExportSettiong()
        }
      })
    })

  }

  onClose=(type)=>{
    if(type === 'export'){
      this.clearExportSettiong()
    }else {
      this.setState({
        showExportModal:false,
      })
    }
  }

  clearExportSettiong=(showExportModal = false)=>{
    const {form} = this.props
    if(!showExportModal){
      form.setFieldsValue({
        contractno:''
      })
    }
    this.setState({
      exportLoading:false,
      showExportModal
    })
  }

  render() {
    const { form } = this.props;
    const {getFieldDecorator } = form
    const {visible,params,showExportModal,exportLoading,initialValue}=this.state
    // const params={
    // createTime_gt: '2022-06-01',
    // createTime_lt: '2022-06-23 23:59:59',
    // }
    const formItemLayout = {
      labelCol: {
        xs: { span: 8},
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16},
        sm: { span: 11 },
        md: { span: 9 },
      },
    };
    const rows = (rowData, sectionID, rowID) => {
      return (
        <Card
          key={rowID}
          title={<div><img src={u484} alt='' style={{height:22,marginRight: 10}} />{rowData.deptName}</div>}
          size="small"
        >
          {/* <CheckboxItem key={rowID} onChange={()=>this.skip(rowData)} style={{marginLeft:'-20px',}}> */}
          <div onClick={() => this.skip(rowData)} style={{ paddingRight: '10px' }}>
            <MatrixListItem label="所属机构" title={rowData.deptName} style={{minHeight:'25px'}} />
            <MatrixListItem label="主合同号" title={rowData.contractno} style={{minHeight:'25px'}} />
            <MatrixListItem label="物资" title={rowData.materialsName} style={{minHeight:'25px'}} />
            <MatrixListItem label="客户" title={rowData.custName} style={{minHeight:'25px'}} />
            <MatrixListItem label="合同/订单金额（元）" title={rowData.totalMoney} style={{minHeight:'25px'}} />
            <MatrixListItem label="剩余金额(元)" title={rowData.remainMoney} style={{minHeight:'25px'}} />
          </div>
          {/* </CheckboxItem> */}
        </Card>
      );
    };
    return (
      <div>
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={()=>router.goBack()}
            rightContent={[<Icon type="search" onClick={()=>this.setState({visible:true})} />]}
          >合同号查询
          </NavBar>
        </div>
        <div className='am-list'>
          <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
            请点击选择合同进行导出
          </NoticeBar>
          <MatrixListView
            row={rows}
            form={form}
            param={params}
            interfaceUrl={weightList}
            onRef={this.onRef}
          />
        </div>
        <Modal
          visible={visible}
          transparent
          maskClosable
          onClose={()=>this.setState({visible:false})}
          popup
          animationType='slide-down'
          platform='android'
          form={form}
        >
          <Form>
            <Col span={24} className='add-config' style={{marginTop:'30px'}}>
              <MatrixInput label="合同号" placeholder="请输入合同号" id="contractno" form={form} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询开始时间' initialValue={Func.MonthstartTime()} format='YYYY-MM-DD HH:mm:ss' id='createTime_gt' form={form} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询结束时间' initialValue={Func.DayendTime()} format='YYYY-MM-DD HH:mm:ss' id='createTime_lt' form={form} />
            </Col>
            <Col span={24} className='add-config' style={{display:'none'}}>
              <MatrixInput label='current' style={{display:'none'}} format='YYYY-MM-DD HH:mm:ss' id='current' form={form} />
            </Col>
            <div style={{marginTop:'20px',float:'right',marginBottom:'50px'}}>
              <Button type="primary" inline onClick={() =>this.getData()} style={{marginLeft:'8px'}}>查询</Button>
              <Button type="primary" inline onClick={() =>this.getData('reset')} style={{marginLeft:'15px'}}>重置</Button>
            </div>
          </Form>
        </Modal>
        <PcModal  // 导出查询弹窗
          visible={showExportModal}
          transparent
          maskClosable
          animationType='fade'
          platform='android'
          onCancel={()=>this.onClose('export')}
          confirmLoading={exportLoading}
          className='QrCodeModal'
          closable={false}
          onOk={this.downExcel}
          bodyStyle={{height:'300px',}}
        >
          <Form {...formItemLayout}>
            <Form.Item label="合同号">
              <Input id='contractno' disabled value={initialValue} />
            </Form.Item>
          </Form>
          {/* <MatrixInput id='contractno' maxLength='15' initialValue={initialValue} required label='合同号' placeholder='请输入合同号' style={{width:'100%'}} form={form} /> */}
          <WhiteSpace size="xl" />
          <MatrixDate label='开始时间' format='YYYY-MM-DD HH:mm:ss' id='grosstime_gt' initialValue={handleDate('beforeDay,00:00:00,89')} form={form} />
          <WhiteSpace size="xl" />
          <MatrixDate label='结束时间' format='YYYY-MM-DD HH:mm:ss' id='grosstime_lt' initialValue={handleDate('currentDate,23:59:59')} form={form} />
          <WhiteSpace size="xl" />
          <p style={{color:'red',}}>温馨提示：十分钟内只允许导出一次，文件导出位置默认为手机存储根路径</p>
        </PcModal>
      </div>

    );
  }
}

export default CheckTheWeight;
