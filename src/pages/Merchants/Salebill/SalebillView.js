import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form,  } from 'antd/lib/index';
import { Icon, NavBar ,Card} from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { SALEBILL_DETAIL } from '@/actions/salebill';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { getListConf } from '@/components/Matrix/MatrixListColumConfig';
import func from '@/utils/Func';
import { clientId } from '../../../defaultSettings';

@connect(({ salebill, loading }) => ({
  salebill,
  loading: loading.models.salebill,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class SalebillView extends PureComponent {

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
    dispatch(SALEBILL_DETAIL(realid))
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_salebill','modulename':`salebill_${clientId}`,queryType:3})).then(() => {
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
    salebill: { detail },
    } = this.props;

    const { getFieldDecorator } = form;
    const {showColums,showSubColums} = this.state;
    const columns=getListConf(showSubColums)
    const items=getViewConf(showColums,getFieldDecorator,detail);
    console.log(detail,"=====detail")

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/salebill/salebill')}
        >查看订单
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
export default SalebillView;

