import React, { Fragment, PureComponent } from 'react';
import {Form } from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { getDispatchPlan } from '@/services/commonBusiness';
import { getTenantId,GeneralQuery } from '@/pages/Merchants/commontable';
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';

@connect(({ dispatchplan,loading }) =>({
  dispatchplan,
  loading:loading.models.dispatchplan,
}))

@Form.create()
class NmDispatchplanList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      selectRow:'',
      tableTitle:'',
      queryData:[],
    }

    this.conditions = []
  }

  handleSearch = (params,tableCondition) => {
    GeneralQuery(func.notEmpty(tableCondition)?tableCondition:this.conditions,params)
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    const tc=this.conditions[0].tableAlias
    this.setState({
      params,
      tableTitle:tc
    });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    getDispatchPlan(func.parseQuery(rparams)).then((resp) => {
      const retutnData =resp.data
      const aa = retutnData
      aa.list = retutnData.records
       this.setState({
         queryData:aa
       })
    })
  };




  render() {
    const { form} = this.props;
    const {tableTitle,queryData} = this.state
    return (
      <div>
        <MatrixListViewForTable
          data={queryData}
          navName={tableTitle}
          titleName={tableTitle}
          tableName='nm_dispatchplan'
          modulename='dispatchplan'
          form={form}
          code='nmDispatchplan'
          getDataFromPa={this.handleSearch}
          notAdd
        />
      </div>
    );
  }
}

export default NmDispatchplanList;
