import React, { PureComponent } from 'react';
import { Form, Input } from 'antd';
import { connect } from 'dva';
import { CARRIER_LIST } from '@/actions/carrier';
import { InputItem, List } from 'antd-mobile';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import MatrixInput from '@/components/Matrix/MatrixInput';

const FormItem = Form.Item;

@connect(({ carrier, loading }) => ({
  carrier,
  loading: loading.models.carrier,
}))
@Form.create()
class Carrier extends PureComponent {

  getData = params => {
    const { dispatch } = this.props;

    dispatch(CARRIER_LIST(params));
  };

  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <InputItem
          {...getFieldProps('name')}
          clear
          placeholder="请输入承运商名称"
          style={{fontSize:'15px'}}
        >承运商：
        </InputItem>
        <InputItem
          {...getFieldProps('contacts')}
          clear
          placeholder="请输入联系人名称"
          style={{fontSize:'15px'}}
        >联系人：
        </InputItem>

      </List>
    );
  };

  render() {
    const code = 'carrier';
    const { form , carrier:{ data }} = this.props;
    const rows = [
      {
        key: '承运商名称',
        value: 'name',

      },
      {
        key: '简称',
        value: 'shortname',
      },
      {
        key: '编码',
        value: 'code',
      }, {
        key: '拼音码',
        value: 'spellcode',
      }, {
        key: '地址',
        value: 'addr',
      }, {
        key: '联系人',
        value: 'contacts',
        width:100,
      }, {
        key: '联系人手机',
        value: 'phone',
      },
    ];
    return (
      <MatrixListView
        data={data}
        navName='承运商管理'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/base/carrier/add"
      />
    );
  }
}

export default Carrier;
