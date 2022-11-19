import React, { PureComponent } from 'react';
import { Form, message, Icon, Divider } from 'antd/lib/index';
import router from 'umi/router';
import { NavBar, WhiteSpace,Button } from 'antd-mobile';
import MatrixMobileInput from '../../../../components/Matrix/MatrixMobileInput';
import MatrixMobileAutoComplete from '@/components/MatrixMobile/MatrixMobileAutoComplete';
import MatrixMobileDate from '@/components/Matrix/MatrixMobileDate';
import { view ,save} from '../../../../services/Epidemic/billOfLoadingServices';
import { handleDate } from '../../../../components/Matrix/commonJs';
import UseDept from '../../Components/UseDept'
import func from '@/utils/Func'

@Form.create()
class BillOfLoadingAddOrEdit extends PureComponent {
  state={
    loading:false,
    detail:{},
  }

  componentDidMount() {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    if(id){ // 存在id的话是修改功能
      view({ id }).then(resp => {
        if (resp.success) {
          this.setState({
            detail:resp.data
          })
        }
      });
    }
  }

  handleSubmit = () => {
    const { form,
      match: {
        params: { id },
      },} = this.props;
    this.setState({
      loading:true
    })
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        const params = {
          ...values,
          beginTime: func.format(values.beginTime),
          endTime: func.format(values.endTime),
          custId: "11111",
          id
        }
        save(params).then(resp => {
          this.setState({
            loading:false
          })
          if (resp.success) {
            message.success('操作成功');
            router.push('/billOfLoading/billOfLoading')
          }
        });
      }else {
        this.setState({
          loading:false
        })
      }
    })
  };

  render(){
    const { form,
      match: {
      params: { id },
    },} = this.props;
    const {loading,detail} =this.state
    const labelNumber = 8
    const dividerStyle = { margin: 0, background: 'none' };
    const action = (
      <span style={{marginRight:'5px'}}>
        <Button type="primary" onClick={this.handleSubmit} loading={loading}>
        保存
        </Button>
      </span>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/billOfLoading/billOfLoading`);}}
        >{id?'修改提货单':'新增提货单'}
        </NavBar>
        <div className='am-list'>
          <UseDept form={form} coalId='materialNo' detail={detail} />
          <Divider style={dividerStyle} />
          <MatrixMobileAutoComplete label="客户名称" placeholder="拼音检索" id="custId" labelId="custName" labelNumber={labelNumber} required dataType="customer" maxLength={30} form={form}  />
          <Divider style={dividerStyle} />
          <MatrixMobileInput label="提货单数量(张)" placeholder="请输入提货单数量" id="deliveryCount" labelNumber={labelNumber} maxLength={4} required initialValue={detail.coalName} numberType='isIntGtZero' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput label="计划重量(吨)" placeholder="请输入计划重量" id="plannedTonnage" maxLength={12} labelNumber={labelNumber} required initialValue={detail.coalName} numberType='amountOfMoney' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileDate placeholder="生效开始时间" label='请输入生效开始时间' id='beginTime' format="YYYY-MM-DD HH:mm:ss" initialValue={handleDate('nextDay,00:00:00,1')} required form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileDate placeholder="生效结束时间" label='请输入生效结束时间' id='endTime' format="YYYY-MM-DD HH:mm:ss" initialValue={handleDate('nextDay,23:59:59,1')} required form={form} />
          <WhiteSpace />
          {action}
        </div>
      </div>
    );
  }
}
export default BillOfLoadingAddOrEdit;

