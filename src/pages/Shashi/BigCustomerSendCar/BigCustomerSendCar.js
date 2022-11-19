import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Icon } from 'antd';
import { Checkbox, Modal, NavBar } from 'antd-mobile';
import { router } from 'umi';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import { ContractList } from '@/services/customer';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import MatrixDate from '@/components/Matrix/MatrixDate';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import Func from '@/utils/Func';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import 'antd/dist/antd.less';
import MatrixInput from '@/components/Matrix/MatrixInput';

const {CheckboxItem} = Checkbox;
@Form.create()
class BigCustomerSendCar extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      visible:false,
      params:{}
    };
  }

  onRef = ref =>{
    this.child = ref
  }

  skip=(rowData)=>{
    router.push({pathname:`/shashi/dispatchManage/add`,state:rowData})
}

 handleSearch=()=>{
    // console.log(this.props.form.getFieldsValue())
   this.child.onAgain()
   this.setState({
     visible:false,
   })
 }

  reset = () => {
    const { form } = this.props;
    this.setState({
      visible:false,
    })
    form.resetFields();
    this.child.onAgain()
  };

  render() {
    const { form } = this.props;
    // console.log(form.getFieldsValue(),78878)
    const {visible}=this.state
    // const params={
    // createTime_gt: '2022-06-01',
    // createTime_lt: '2022-06-23 23:59:59',
    // }
    const rows = (rowData, sectionID, rowID) => {
      return (
        <Card key={rowID} size="small" bordered={false} style={{paddingTop:'30px'}}>
          <CheckboxItem key={rowID} onChange={()=>this.skip(rowData)} style={{marginLeft:'-20px',}}>
            <div onClick={()=>this.skip(rowData)} style={{paddingRight:'10px'}}>
              <MatrixListItem label="所属机构" title={rowData.deptName} style={{minHeight:'25px'}} />
              <MatrixListItem label="主合同号" title={rowData.contractno} style={{minHeight:'25px'}} />
              <MatrixListItem label="物资" title={rowData.materialsName} style={{minHeight:'25px'}} />
              <MatrixListItem label="客户" title={rowData.custName} style={{minHeight:'25px'}} />
              <MatrixListItem label="合同/订单金额（元）" title={rowData.totalMoney} style={{minHeight:'25px'}} />
              <MatrixListItem label="剩余金额(元)" title={rowData.remainMoney} style={{minHeight:'25px'}} />
            </div>

          </CheckboxItem>
        </Card>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/commonBusiness/commonList/dinas_dispatch/dispatchManage`)}
          rightContent={[<Icon type="search" onClick={()=>this.setState({visible:true})} />]}
        >主合同信息
        </NavBar>
        <MatrixListView
          style={{marginTop:'30px'}}
          row={rows}
          form={form}
          // param={params}
          interfaceUrl={ContractList}
          onRef={this.onRef}
        />
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
            <Col span={24} className='add-config' style={{marginTop:'20px'}}>
              <MatrixSelect label="所属机构" placeholder="请选择所属机构" id="deptId_equal" keyParam='deptId' valueParam='deptName' dictCode="/api/mer-shop/factory/list" form={form} style={{width: '100%',}} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixAutoComplete label='物资' placeholder='拼音码检索' dataType='material' id='materialnos' labelId='materialName' form={form} style={{width: '100%'}} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询开始时间' format='YYYY-MM-DD HH:mm:ss' id='createTime_gt' form={form} />
            </Col>
            <Col span={24} className='add-config'>
              <MatrixDate label='查询结束时间' initialValue={Func.DayendTime()} format='YYYY-MM-DD HH:mm:ss' id='createTime_lt' form={form} />
            </Col>
            <Col span={24} className='add-config' style={{display:'none'}}>
              <MatrixInput label='current' style={{display:'none'}} format='YYYY-MM-DD HH:mm:ss' id='current' form={form} />
            </Col>
            <div style={{marginTop:'8px',float:'right',marginBottom:'25px'}}>
              <Button type="primary" inline onClick={() =>this.handleSearch()} style={{marginLeft:'8px'}}>查询</Button>
              <Button type="primary" inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
            </div>
          </Form>
        </Modal>
      </div>

    );
  }
}

export default BigCustomerSendCar;
