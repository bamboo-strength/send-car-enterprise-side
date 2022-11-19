import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form,  } from 'antd/lib/index';
import router from 'umi/router';
import { Icon, NavBar,Card } from 'antd-mobile';
import styles from '../../../layouts/Sword.less';
import { DISPATCHBILLBYWAYBILL_DETAIL } from '@/actions/dispatchbillByWaybill';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';

@connect(({ dispatchbillByWaybill, loading }) => ({
  dispatchbillByWaybill,
  loading: loading.models.dispatchbillByWaybill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class DispatchbillByWaybillView extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
  };

  componentWillMount() {
    const {
      dispatch,
      match,
      businessId
    } = this.props;
    let  realid=''
    if(func.notEmpty(match)){
      const {
        params: { id },
      } = match
      realid = id
    }else{
      realid = businessId
    }
    dispatch(DISPATCHBILLBYWAYBILL_DETAIL(realid))
     dispatch(TABLEEXTEND_COLUMNLIST({'tableName': 'mer_dispatchbill','modulename':'byOrder',queryType:3})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub
          })
        }
      }
    })

  }


  render() {
    const {
      form,
      dispatchbillByWaybill: { detail },
    } = this.props;

    const { getFieldDecorator } = form;
    const {showColums,showSubColums} = this.state;
    const items=getViewConf(showColums,getFieldDecorator,detail);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dispatch/dispatchbillbywaybill')}
        >查看派车单总查询
        </NavBar>
        <div className='am-list'>
          <Card bordered={false}>
            <Card.Header
              title='基本信息'
              style={{ fontWeight: 'bold' }}
            />
            <Card.Body>
              {items}
            </Card.Body>
            {showSubColums.length < 1 ? undefined :
              <Card title="" className={`${styles.card}`} bordered={false}>
                <Card.Header
                  title='项次'
                  style={{ fontWeight: 'bold' }}
                />
                {
                  func.notEmpty(detail.sublist) ? detail.sublist.map(col => (
                    <Card.Body>
                      {getViewConf(showSubColums,getFieldDecorator,col)}
                    </Card.Body>
                  )) : undefined
                }
              </Card>
            }
          </Card>
        </div>
      </div>
    );
  }
}
export default DispatchbillByWaybillView;

