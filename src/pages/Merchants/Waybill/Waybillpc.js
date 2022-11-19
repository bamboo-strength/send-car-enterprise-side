import React, { PureComponent } from 'react';
import { Form } from 'antd/lib/index';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { WAYBILL_LIST  } from '@/actions/waybill';
import { getColums, getTenantId ,GeneralQuery} from "../commontable";
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';

@connect(({ waybill,loading }) =>({
  waybill,
  loading:loading.models.waybill,
}))

@Form.create()
class Waybillpc extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      selectRow:'',
    }
  }

  handleSearch = (params,tableCondition) => {
    const { dispatch } = this.props;
    GeneralQuery(tableCondition,params)
    this.setState({ params });
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(WAYBILL_LIST(func.parseQuery(rparams)));
  };

  render() {
    const code = 'waybill';
    const { form , waybill:{ data }} = this.props;
    return (
      <div>
        <MatrixListViewForTable
          data={data}
          navName='发布货源'
          titleName='货源'
          tableName='mer_waybill'
          modulename='waybill'
          form={form}
          code={code}
          renderSearchForm={this.renderSearchForm}
          getDataFromPa={this.handleSearch}
          notAdd
        />
      </div>
    );
  }
}

export default Waybillpc;
