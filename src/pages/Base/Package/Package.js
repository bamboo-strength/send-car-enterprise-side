import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Col, Form, Input } from 'antd/lib/index';
import { InputItem, List } from 'antd-mobile';
import { PACKAGE_LIST } from '../../../actions/package';
import func from '../../../utils/Func';
import { getTenantId } from '../../Merchants/commontable';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import MatrixAutoComplete from '../../../components/Matrix/MatrixAutoComplete';


@connect(({ packages, loading }) => ({
  packages,
  loading: loading.models.packages,
}))
@Form.create()
class Package extends PureComponent {

  // ============ 查询 ===============
  getData = params => {
    const { dispatch } = this.props;
    func.addQuery(params, 'pkid', '_like');
    func.addQuery(params, 'pkname', '_like');
    delete params.materialnoName;
    params['Blade-DesignatedTenant'] = getTenantId();
    dispatch(PACKAGE_LIST(func.parseQuery(params)));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const {
      form,
    } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{ fontSize: '15px' }} className='static-list'>
        {/*   <Col span={24} className='add-config'>
          <MatrixAutoComplete label='物资' placeholder='拼音码检索' dataType='goods' id='materialno' labelId='materialnoName'
                              form={form} style={{ width: '100%' }}/>
        </Col> */}
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('pkid')}
            clear
            placeholder="请输入包装代号"
            style={{ fontSize: '15px' }}
          >包装代号：
          </InputItem>
        </Col>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('pkname')}
            clear
            placeholder="请输入包装名称"
            style={{ fontSize: '15px' }}
          >包装名称：
          </InputItem>
        </Col>
      </List>
    );
  };

  render() {
    const code = 'package';
    const {
      form,
      packages: { data },
    } = this.props;
    const rows = [
      {
        key: '包装代号',
        value: 'pkid',
      },
      {
        key: '物资',

        value: 'materialnoName',
      },
      {
        key: '包装名称',
        value: 'pkname',
      },
      {
        key: '检索码',
        value: 'sortl',
      },
      {
        key: '包装单位',
        value: 'unit',
      },
      {
        key: '包装数量(个)',
        value: 'pkqty',
      },
      {
        key: '包装重量(kg)',
        value: 'pkwgt',
      },
    ];


    return (
      <MatrixListView
        data={data}
        navName='包装物管理'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/base/package/add"
      />
    );
  }
}

export default Package;
