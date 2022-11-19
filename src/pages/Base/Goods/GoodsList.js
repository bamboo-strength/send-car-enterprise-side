import { List, InputItem } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import { GOODS_LIST } from '../../../actions/GoodsActions';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import { Col } from 'antd';


@connect(({ GoodsModels, loading }) => ({
  GoodsModels,
  loading: loading.models.GoodsModels,
}))
@createForm()
class GoodList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getData = (param) => {
    const { dispatch } = this.props;
    dispatch(GOODS_LIST(param));
  };

  renderSearchForm = () => {
    const { form } = this.props;
    const { getFieldProps } = form;
    return (
      <List style={{ fontSize: '15px' }} className='static-list'>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('name')}
            clear
            placeholder="请输入物资名称"
            style={{ fontSize: '15px' }}
          >物资名称：
          </InputItem>
        </Col>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('code')}
            clear
            placeholder="请输入物资编码"
            style={{ fontSize: '15px' }}
          >物资编码：
          </InputItem>
        </Col>
        <Col span={24} className='add-config'>
          <InputItem
            {...getFieldProps('spellcode')}
            clear
            placeholder="请输入物资检索码"
            style={{ fontSize: '15px' }}
          >检索码：
          </InputItem>
        </Col>
      </List>
    );
  };

  render() {
    const { GoodsModels: { data }, form } = this.props;
    // console.info(data,'============data')
    const rows = [
      {
        key: '物资名称',
        value: 'name',
      },
      {
        key: '物资编码',
        value: 'code',
      },
      {
        key: '物资简称',
        value: 'shortname',
      },
      {
        key: '检索码',
        value: 'spellcode',
      },
      {
        key: '包装方式',
        value: 'packagingName',
      },
    ];

    return (
      <MatrixListView
        data={data}
        navName='物资管理'
        rows={rows}
        form={form}
        code='goods'
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/base/goods/add"
      />
    );
  }
}

export default GoodList;
