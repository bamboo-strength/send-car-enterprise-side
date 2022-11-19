import React,{ PureComponent } from 'react';
import { Col, Form } from 'antd';
import { connect } from 'dva';
import {  List } from 'antd-mobile';
import { SHIPBILLORDER_LIST} from '../../../actions/shipbillorder'
import MatrixListView from '../../../components/Matrix/MatrixListView';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { getTenantId } from '../../Merchants/commontable';
import func from '@/utils/Func';

@connect(({ shipbillorder,loading }) =>({
  shipbillorder,
  loading:loading.models.shipbillorder,
}))
@Form.create()
class Shipbillorder extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      params: {},
    }
  }

  getData = (params)=> {
    const { dispatch } = this.props;
    params.carrType='10'
    this.setState({ params });
    const rparams = params
    delete rparams.carrierIdName
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(SHIPBILLORDER_LIST(func.parseQuery(rparams)))
  }

// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <Col span={24} className='add-config'>
          <MatrixAutoComplete label='承运商' placeholder='拼音码' dataType='carrier' id='carrierId' labelId='carrierIdName' form={form} style={{width: '100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixInput label="订单号" placeholder="请输入订单号" id="billno" form={form} style={{width: '100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <MatrixSelect label="委托来源" placeholder='委托来源' id="isfactory" form={form} dictCode='isfactoryType' style={{width: '100%'}}  />
        </Col>
      </List>
    );
  };

  render(){
    const code='shipbillorder';
    const{form,shipbillorder:{ data }} = this.props;
    const  rows = [
      // {
      //   key:'发货方所属租户',
      //   value:'tenantIdName'
      // },
      {
        key:'承运商',
        value:'carrierIdName'
      },
      {
        key:'订单号',
        value:'billno'
      },
      {
        key:'确认委托状态',
        value:'confirmEntrustStatusName'
      },
      {
        key:'委托类型',
        value:'carrTypeName'
      },
      {
        key:'委托来源',
        value:'isfactoryName'
      },
      {
        key:'创建人',
        value:'createUserName'
      },
      {
        key:'创建时间',
        value:'createTime'
      },
    ]
    return (
      <MatrixListView
        data={data}
        navName='委托单按订单'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        notAdd
      />
    );
  }
}
export  default Shipbillorder;
