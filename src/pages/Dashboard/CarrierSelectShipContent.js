import React, { PureComponent } from 'react';
import { getCurrentUser } from '@/utils/authority';
import { connect } from 'dva';
import { Form, message, Select } from 'antd';
import {TENANTRELATION_TENANTLIST} from '../../actions/tenantRelation'
import func from '@/utils/Func';
import { getCommonParam } from "../Merchants/commontable";

@connect(({ tenantRelation,loading }) =>({
  tenantRelation,
  loading:loading.models.tenantRelation,
}))

@Form.create()
class  CarrierSelectShipContent extends PureComponent {

  constructor(props){
    super(props)
    this.state = {
      firstCysVlaue:''
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TENANTRELATION_TENANTLIST({tenantId:getCurrentUser().tenantId})).then(() => {
      const {tenantRelation:{ data }} = this.props;
          if(func.notEmpty(data) && func.notEmpty(data.tenantList) && data.tenantList.length>0){
            const real =localStorage.getItem("merchantsFhfTenantId")?localStorage.getItem("merchantsFhfTenantId"):data.tenantList[0].relation_tenant
            localStorage.setItem("merchantsFhfTenantId",real);
            getCommonParam(real)  // 系统参数
            this.setState({
              firstCysVlaue:real
            })
          }
      if(data.tenantList.length === 0){
      //  message.config({ top: 100, duration: 100, maxCount: 1,});
        message.info("未收到委托订单或计划！");
        return false;
      }
    })
  }

  handleChangeCarrierTenant = (value) => {
    if (value !== null) {
      localStorage.setItem("merchantsFhfTenantId",value);
      getCommonParam(value)  // 系统参数
      location.reload();
    }else {
      localStorage.setItem("merchantsFhfTenantId",'');
    }
  }

  render() {
    const {firstCysVlaue}=this.state;
    const {
      form: { getFieldDecorator },
      tenantRelation:{ data }
    } = this.props;
    return (
      <span>
        发货方 :
         {getFieldDecorator('shipperTenantId',{
           initialValue:firstCysVlaue,
         })(
           <Select
             onChange={this.handleChangeCarrierTenant}
             placeholder="请输入发货方"
             style={{ width: '80%' }}
           >
             {data.tenantList.map(d => (
               <Select.Option key={d.relation_tenant} value={d.relation_tenant}>
                 {d.tenant_name}
               </Select.Option>
             ))}
           </Select>
     )}
      </span>
    );

  }
}
export default CarrierSelectShipContent;
