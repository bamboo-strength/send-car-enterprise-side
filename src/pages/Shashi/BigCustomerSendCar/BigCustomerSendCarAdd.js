import React, { PureComponent } from 'react';
import { Card, Col, Form, Icon, Row, Switch } from 'antd';
import { connect } from 'dva';
import { Button, Modal, NavBar, Toast } from 'antd-mobile';
import router from 'umi/router';
import Func from '@/utils/Func';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixDate from '@/components/Matrix/MatrixDate';
import { saveOrder } from '@/services/customer';
import 'antd/dist/antd.less';

const {alert} = Modal
const FormItem = Form.Item;

let id = 1

@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class BigCustomerSendCarAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
     checked:false,
      loading:false,
      visible:false,
      markedVisible:false,
      message:''
    };
  }

  handleSubmit = e => {
    e.preventDefault();
    const {location:{state},} = this.props;
    const message = (
      <div>
        <span style={{fontSize:'18px',color:'red'}}>{state.contractno}</span>合同,对应物资为 <br />
        <span style={{fontSize:'18px',color:'red'}}>{state.materialsName}</span><br />
        请确认
      </div>)
    alert('信息确认', message, [
      { text: '取消', onPress: () => console.log('取消') },
      {
        text: '确定',
        onPress: () =>
          new Promise((resolve) => {

            const { form,} = this.props;
            form.validateFieldsAndScroll((err, values) => {
              const { keys, vehicleno,axles } = values;
              const {checked} =this.state
              const opt=[]
              const vehiclenoarr =keys.map(key =>vehicleno[key])
              const axlesarr=keys.map(key =>axles[key])
              const size=vehiclenoarr.length;
              for(let i=0;i<size;i++){
                const a={};
                a.vehicleno=vehiclenoarr[i];
                a.axles=axlesarr[i];
                opt.push(a);
              }
              if(err===null){
                Toast.loading('正在派车，请稍等...',1)
                const params = {
                  // tenantId:'',
                  ztext2:values.materialsName,
                  loadtype:'0',
                  contractno:values.contractno,
                  custno:values.custno,
                  deptId:values.deptId,
                  sublist:opt,
                  cycletime:Func.format(values.cycletime,'YYYY-MM-DD HH:mm:ss'),
                  count:checked?'-1':values.count,
                  contractSubno:'',
                  ifCertainMaterial:'0',
                  source:'1'
                }
                if(vehicleno !== undefined){
                  saveOrder(params).then(resp=>{
                    if (resp.success) {
                      this.setState({
                        message:resp.data,
                        loading:false,
                        markedVisible:true
                      })
                      // Toast.success(resp.data,3);
                      // window.history.go(-2)
                    }
                  })
                }else {
                  Toast.fail('请添加车号')
                  this.setState({
                    loading:false
                  })
                }
              }
              this.setState({
                loading:false
              })
            })
            setTimeout(resolve, );
          }),
      },
    ])
    }

    // 增加车号选择框
  add = () => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    const nextKeys = keys.concat(id++);
    form.setFieldsValue({
      keys: nextKeys,
    });
  };

  // 删除车号选择框
  remove = k => {
    const { form } = this.props;
    const keys = form.getFieldValue('keys');
    if (keys.length === 1) {
      return;
    }
    form.setFieldsValue({
      keys: keys.filter(key => key !== k),
    });
  };

  handleChange=()=>{
    const {checked} =this.state
    this.setState({
      checked:!checked,
    })
  }

  goList=()=>{
    router.push('/commonBusiness/commonList/dinas_dispatch/dispatchManage')
  }

  goMyMessage=()=>{
    router.push('/driverSide/personal/myMessage')
  }

  render() {
    const {form,location:{state},} = this.props;
    const {checked,loading,visible,markedVisible,message}=this.state
    // console.log(form.getFieldsValue())
    // 根据返回的结果字符串有无“失败”，判定按钮
    const viewButton =message.indexOf("失败") > 0?[{ text: '确认', onPress: this.goList},{text:'查看',onPress: this.goMyMessage}]:[{ text: '确认', onPress: this.goList}]
    const requiredInput =!checked
    const { getFieldDecorator ,getFieldValue} = form;
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };
    getFieldDecorator('keys', { initialValue: [0] });
    const keys = getFieldValue('keys');
    const formItems = keys.map((k,idx) => (
      <Row>
        <Col span={keys.length===1?24:22}>
          <MatrixAutoComplete className="ant-form-item-control-vehicleno" axles="axles" bringData={`soltl|axles[${k}]|axlesName[${k}]`} formPra={form} placeholder='拼音码检索' key={k} label="车号" required dataType='vehicleno' id={`vehicleno[${k}]`} labelId={`vehicleName[${k}]`} form={form} style={{width: '90%',display:'inline-block',marginBottom:'0',}} />
          <MatrixSelect form={form} id={`axles[${k}]`} disabled dictCode='axlesNameFordongping' placeholder="请输入车轴数" style={{width:'90%',display:'none'}} required />
        </Col>
        <Col key={k} span={keys.length===1?0:2}>
          {keys.length > 1 ? (
            <Icon
              className="dynamic-delete-button"
              style={{fontSize:'16px',float:'right',marginTop:'5px'}}
              type="minus-circle-o"
              onClick={() => this.remove(k)}
            />
          ) : null}
        </Col>
      </Row>
     ))
    const action = (
      <Button type="primary" onClick={this.handleSubmit} loading={loading} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/shashi/dispatchManage/dinas_dispatch/dispatchManage/add')}
        >新增
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={22} className='add-config'>
                <MatrixSelect {...formItemLayout} required label="所属机构" placeholder="请选择所属机构" disabled id="deptId" initialValue={state.deptId} keyParam='deptId' valueParam='deptName' dictCode="/api/mer-shop/factory/list" form={form} style={{width: '100%',}} />
              </Col>
              <Col span={22} className='add-config'>
                <MatrixInput form={form} label="合同号" id='contractno' disabled initialValue={state.contractno} placeholder="请输入合同号" required />
              </Col>
              <Col span={22} className='add-config'>
                <MatrixInput form={form} label="物资" id='materialsName' disabled initialValue={state.materialsName} placeholder="请输入物资名称" required />
              </Col>
              <Col span={22} className='add-config'>
                <MatrixAutoComplete placeholder='拼音码检索' label="客户" disabled required dataType='customer' id='custno' labelValue={state.custName} labelId='code' value={state.custno} form={form} style={{width: '100%'}} />
              </Col>
              <Col span={20}>
                <FormItem {...formItemLayout} label="是否执行到合同结束">
                  <Switch checked={checked} checkedChildren='是' unCheckedChildren='否' onChange={this.handleChange} style={{marginBottom:'28px'}} />
                </FormItem>
              </Col>
              <Col span={22} className='add-config' style={{display:checked?'none':'block'}}>
                <MatrixInput form={form} id='count' label="发运次数" style={{display:checked?'none':'block'}} required={requiredInput} labelId='count' labelNumber={1} placeholder="请输入发运次数" numberType="isFloatGtZero" />
              </Col>
              <Col span={22} className='add-config'>
                <MatrixDate label='循环结束时间' required initialValue={Func.postpone()} format='YYYY-MM-DD HH:mm:ss' id='cycletime' form={form} style={{width:'100%'}} />
              </Col>
              <Col span={keys.length===1?23:24} className='add-config'>
                {formItems}
              </Col>
              <Col span={22} className='add-config'>
                <div style={{paddingLeft:'-30px'}}>
                  <Button type="dashed" size='small' onClick={this.add} style={{marginBottom:'28px', width: '96%',border:'1px solid #D9D9D9',}}>
                    <Icon type="plus" /> 新增车号
                  </Button>
                </div>
              </Col>
              <Modal   // 确认信息
                visible={visible}
                transparent
                closable
                title='信息确认'
                footer={[{ text: '下一步', onPress:this.payearnestSubmit }]}
                onClose={this.onClose}
              >
                <div style={{marginTop:'25px',paddingTop:'10px',borderTop:'1px solid #F2F2F2'}}>
                  <div style={{textAlign:'left',float:'left',paddingLeft:'40px'}}>支付方式</div>
                  <strong style={{float:'right',paddingRight:'40px',}}>钱包余额</strong>
                </div>
              </Modal>
              <Modal   // 提交返回信息
                visible={markedVisible}
                transparent
                closable
                title='派车结果'
                footer={viewButton}
                onClose={this.onClose}
              >
                <div style={{marginTop:'25px',paddingTop:'10px',borderTop:'1px solid #F2F2F2'}}>
                  {message}
                </div>
              </Modal>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default BigCustomerSendCarAdd;
