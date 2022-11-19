import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, Table } from 'antd/lib/index';
import {  Icon, NavBar,Card } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { detailDriver } from '@/services/merDriver';

@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class DriverCertificationView extends PureComponent {

  state = {
    showColums: [],
    detail:[]
  };

  componentWillMount() {
    const {
      dispatch,
      location
    } = this.props;
    detailDriver({ id:location.state.data }).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'driver','modulename':'certification',queryType:3})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
          })
        }
      }
    })
  }


  render() {
    const {
      form,
    } = this.props;

    const { getFieldDecorator } = form;
    const {showColums,detail} = this.state;
    const items=getViewConf(showColums,getFieldDecorator,detail);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >查看
        </NavBar>
        <Card title="" className={`${styles.card} am-list`} bordered={false}>
          <Card.Header
            title='基本信息'
            style={{fontWeight:'bold'}}
          />
          {items}
        </Card>
      </div>
    );
  }
}
export default DriverCertificationView;

