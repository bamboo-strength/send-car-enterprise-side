import React, {  PureComponent } from 'react';
import { Form } from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { DISPATCHBILLBYWAYBILL_LIST } from '@/actions/dispatchbillByWaybill';
import { getTenantId,GeneralQuery } from '../commontable';
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';

@connect(({ dispatchbillByWaybill,loading }) =>({
  dispatchbillByWaybill,
  loading:loading.models.dispatchbillByWaybill,
}))

@Form.create()
class DispatchbillByWaybillList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
    }
    this.conditions = []
  }
/*
  handleSearch = params => {
    const { dispatch } = this.props;
    const {tableCondition} = this.state
    GeneralQuery(tableCondition,params);
    this.setState({ params });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(DISPATCHBILLBYWAYBILL_LIST(func.parseQuery(rparams)))
  }; */


  handleSearch = (params,tableCondition) => {
    const { dispatch } = this.props;
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    this.setState({
      params,
    });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(DISPATCHBILLBYWAYBILL_LIST(func.parseQuery(rparams)));
  };



  render() {
    const code = 'dispatchbillbywaybill';
    const { form , dispatchbillByWaybill:{ data }} = this.props;

    return (

      <MatrixListViewForTable
        data={data}
        navName='派车单总查询'
        titleName='派车单'
        tableName='mer_dispatchbill'
        modulename='byOrder'
        form={form}
        code={code}
        getDataFromPa={this.handleSearch}
        notAdd
      />


    );
  }
}

export default DispatchbillByWaybillList;
