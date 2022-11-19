import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, Table } from 'antd/lib/index';
import {  Icon, NavBar,Card } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { DISPATCHPLAN_DETAIL } from '@/actions/dispatchplan';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { getListConf } from '@/components/Matrix/MatrixListColumConfig';
import func from '@/utils/Func';
import { getDispatchDetail } from '@/services/commonBusiness';

@connect(({ dispatchplan, loading }) => ({
  dispatchplan,
  loading: loading.models.dispatchplan,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class NmDispatchplanView extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    tableTitle:'',
    detail:[]
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const dispatchId=id
    getDispatchDetail({ id:dispatchId }).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'nm_dispatchplan','modulename':'dispatchplan',queryType:3})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          const tc=aa.table_main[0].tableAlias
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
            tableTitle:tc
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
    const {showColums,showSubColums,tableTitle,detail} = this.state;
    const columns=getListConf(showSubColums)
    const items=getViewConf(showColums,getFieldDecorator,detail);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/ningMei/nmDispatchPlan')}
        >{`查看${tableTitle}`}
        </NavBar>
        <Card title="基本信息" className={`${styles.card} am-list`} bordered={false}>
          <Card.Header
            title='主信息'
            style={{fontWeight:'bold'}}
          />
          {items}
          {
            showSubColums.length < 1 ? '' :
            <div>
              {
                func.notEmpty(detail.sublist) ? detail.sublist.map(col => (
                  <Card.Body>
                    {
                      columns.map(rrow => (
                        <div key={rrow.dataIndex}>{rrow.title}：{col[rrow.dataIndex]}</div>
                      ))
                    }
                  </Card.Body>
                )) : ""
              }
            </div>
          }
        </Card>
      </div>
    );
  }
}
export default NmDispatchplanView;

