import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Icon } from 'antd';
import { Checkbox, Modal, NavBar } from 'antd-mobile';
import { router } from 'umi';
import MatrixDate from '@/components/Matrix/MatrixDate';
import Func from '@/utils/Func';
import 'antd/dist/antd.less';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import { getCurrentUser } from '@/utils/authority';
import { list } from '@/services/DongPing/FeedBack';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

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
        queryDate_equal:`${Func.format(startTime)},${Func.format(endTime)}`,
      },
    };
  }

  skip=(rowData)=>{
    console.log(rowData)
    this.setState({
      showExportModal:true,
      initialValue:rowData.contractno
    })
  }

  handleSearch=()=>{
    // console.log(this.props.form.getFieldsValue())
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
    console.log(Func.format(formValues.startTime))
    if(type === 'reset'){
      form.resetFields();
    }
    const params = {
      ...formValues,
      startTime:Func.format(formValues.startTime),
      endTime:Func.format(formValues.endTime),
    }
    this.setState({
      params
    })
    if (this.child) { this.child.onAgain(params,'refresh') }
    this.setState({
      visible:false
    })
  }

  render() {
    const { form } = this.props;
    const {visible,params}=this.state
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
      // console.log(rowData)
      return (
        <Card
          key={rowID}
          size="small"
        >
          {/* <CheckboxItem key={rowID} onChange={()=>this.skip(rowData)} style={{marginLeft:'-20px',}}> */}
          <div onClick={() => this.skip(rowData)} style={{ paddingRight: '10px' }}>
            <MatrixListItem label="账号" title={rowData.account} style={{ minHeight: '25px' }} />
            <MatrixListItem label="意见反馈" title={rowData.conment} style={{ minHeight: '25px' }} />
            <MatrixListItem label="用户类型" title={rowData.userType===1?'司机':'客户'} style={{ minHeight: '25px' }} />
            <MatrixListItem label="创建时间" title={rowData.createTime} style={{ minHeight: '25px' }} />
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
          >意见反馈
          </NavBar>
        </div>
        <div className='am-list'>
          <MatrixListView
            row={rows}
            form={form}
            // param={params}
            interfaceUrl={list}
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
              <MatrixSelect showAllDefault label="用户类型" placeholder="请选择用户类型" id="userType" dictCode="userType" form={form} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询开始时间' initialValue={Func.MonthstartTime()} format='YYYY-MM-DD HH:mm:ss' id='startTime' form={form} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询结束时间' initialValue={Func.DayendTime()} format='YYYY-MM-DD HH:mm:ss' id='endTime' form={form} />
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
      </div>

    );
  }
}

export default CheckTheWeight;
