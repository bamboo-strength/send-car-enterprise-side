import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import { Icon, NavBar, Card } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { WAYBILL_DETAIL } from '@/actions/waybill';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { getViewConf } from '@/components/Matrix/MatrixViewConfig';
import func from '@/utils/Func';

@connect(({ waybill, loading }) => ({
  waybill,
  loading: loading.models.waybill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class WaybillpcView extends PureComponent {

  state = {
    showColums: [],
  };

  componentWillMount() {
    const {
      dispatch,
      match,
      businessId,
    } = this.props;
    let realid = '';

    if (func.notEmpty(match)) {
      const {
        params: { id },
      } = match;
      realid = id;
    } else {
      realid = businessId;
    }
    dispatch(WAYBILL_DETAIL(realid));
    dispatch(TABLEEXTEND_COLUMNLIST({ tableName: 'mer_waybill', 'modulename': `waybill`, queryType: 3 })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined) {
        if (data.columList !== null && data.columList !== undefined) {
          const aa = data.columList;
          this.setState({
            showColums: aa.table_main,
          });
        }
      }
    });
  }


  render() {
    const {
      form,
      waybill: { detail },
    } = this.props;

    const { getFieldDecorator } = form;
    const { showColums } = this.state;
    const items = getViewConf(showColums, getFieldDecorator, detail);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/waybill/waybill')}
        >发布货源
        </NavBar>
        <Card title="基本信息" className={`${styles.card} am-list`} bordered={false}>
          <Card.Header
            style={{ fontWeight: 'bold' }}
          />
          {items}
        </Card>
      </div>
    );
  }
}

export default WaybillpcView;

