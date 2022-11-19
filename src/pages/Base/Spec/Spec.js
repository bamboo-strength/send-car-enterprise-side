import React, { PureComponent } from 'react';
import { Form, Col, Input, Button, Row } from 'antd/lib/index';
import { connect } from 'dva/index';
import Panel from '../../../components/Panel';
import Grid from '../../../components/Sword/Grid';
import { SPEC_LIST } from '../../../actions/spec';
import func from '../../../utils/Func';
import { getTenantId } from '../../Merchants/commontable';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { InputItem, List } from 'antd-mobile';

const FormItem = Form.Item;

@connect(({ spec, loading }) => ({
  spec,
  loading: loading.models.spec,
}))
@Form.create()
class Spec extends PureComponent {

  getData = params => {
    const { dispatch } = this.props;
    func.addQuery(params, 'spec', '_like');
    params['Blade-DesignatedTenant'] = getTenantId();
    dispatch(SPEC_LIST(func.parseQuery(params)));
  };

// ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{ fontSize: '15px' }} className='static-list'>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('spec')}
            clear
            placeholder="请输入规格"
            style={{ fontSize: '15px' }}
          >规格：
          </InputItem>
        </Col>
      </List>
    );
  };


  render() {
    const code = 'spec';
    const { form, spec: { data } } = this.props;
    const rows = [
      {
        key: '规格',
        value: 'spec',
      },
      /* {
         key: 'ERP编码',
         value: 'erpno',
       },*/
      {
        key: '备注',
        value: 'remark',
      },
      {
        key: '创建人',
        value: 'createUserName',
      },
      {
        key: '创建时间',
        value: 'createTime',
      },
    ];

    return (
      <MatrixListView
        data={data}
        navName='规格管理'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/base/spec/add"
      />
    );
  }
}

export default Spec;
