import React, { PureComponent } from 'react';
import MatrixListViewForTable from '@/components/Matrix/MatrixListViewForTable';
import { GeneralQuery, getTenantId } from '@/pages/Merchants/commontable';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import { connect } from 'dva/index';
import { Form } from 'antd';

@connect(({ onlinePayment_onlinePayment, loading }) => ({
  onlinePayment_onlinePayment,
  loading: loading.models.onlinePayment_onlinePayment,
}))
@Form.create()
class OnlinePaymentLIst extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      params: {},
    };
  }

  handleSearch = (params, tableCondition) => {
    const { dispatch } = this.props;
    GeneralQuery(tableCondition, params);
    this.setState({ params });
    const rparams = params;
    rparams['Blade-DesignatedTenant'] = getTenantId();
    delete rparams.headers;
    dispatch(COMMONBUSINESS_LIST({
      tableName: 'onlinePayment',
      modulename: 'onlinePayment',
      queryParam: rparams,
    }));
  };

  render() {
    const code = 'onlinePayment_onlinePayment';
    const {form} = this.props;
    const data = [{
      begintime: '2020-05-01 10:51:31',
      billno: '100201',
      custno: '1300644031872634881',
      materialnos: '1',
      deptId: 1,
      endtime: '2020-11-28 10:51:35',
      vehicleno: '鲁s555',
      weightno: '222',
      money: '23',
    }];
    return (<div>
      <MatrixListViewForTable
        data={data}
        navName='在线支付'
        titleName='在线支付'
        tableName='onlinePayment'
        modulename='onlinePayment'
        form={form}
        code={code}
        getDataFromPa={this.handleSearch}
        // btnCallBack={this.handleBtnCallBack}
        notAdd
      />
    </div>);
  }
}

export default OnlinePaymentLIst;
