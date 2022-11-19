import React, { PureComponent } from 'react';
import { Col, Form } from 'antd';
import { connect } from 'dva';
import { InputItem, List } from 'antd-mobile';
import { CUSTOMER_LIST } from '../../../actions/customer';
import func from '../../../utils/Func';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { getTenantId } from '../../Merchants/commontable';

@connect(({ customer, loading }) => ({
  customer,
  loading: loading.models.customer,
}))
@Form.create()
class Customer extends PureComponent {

  getData = (params) => {
    const { dispatch } = this.props;
    func.addQuery(params, 'id', '_like');
    func.addQuery(params, 'custname', '_like');
    func.addQuery(params, 'sortl', '_like');
    func.addQuery(params, 'creditCode', '_like');
    params['Blade-DesignatedTenant'] = getTenantId();
    dispatch(CUSTOMER_LIST(func.parseQuery(params)));
  };

// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{ fontSize: '15px' }} className='static-list'>

        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('id')}
            clear
            placeholder="请输入客户编号"
            style={{ fontSize: '15px' }}
          >客户编号：
          </InputItem>
        </Col>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('custname')}
            clear
            placeholder="请输入客户名称"
            style={{ fontSize: '15px' }}
          >客户名称：
          </InputItem>
        </Col>
      </List>
    );
  };

  render() {
    const code = 'customer';
    const { form, customer: { data } } = this.props;
    const rows = [
      {
        key: '客户编号',
        value: 'id',
      },
      {
        key: '客户名称',
        value: 'custname',
      },
      {
        key: '客户简称',
        value: 'forshort',
      },
      {
        key: '检索码',
        value: 'sortl',
      },
      {
        key: '联系电话',
        value: 'prinphone',
      },
      {
        key: '行业',
        value: 'industryname',
      },
    ];
    return (
      <MatrixListView
        data={data}
        navName='客户管理'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/base/customer/add"
      />
    );
  }
}

export default Customer;
