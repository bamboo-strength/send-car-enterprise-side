import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form } from 'antd/lib/index';
import { Icon, NavBar,Card,Button } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { COMMONBUSINESS_DETAIL } from '../../../actions/commonBusiness';
import { getListConf } from '@/components/Matrix/MatrixListColumConfig';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';

@connect(({ commonBusiness, tableExtend,loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))
@Form.create()
class CommonPageView extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    detailData:{},
    vo:{}
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { tableName,modulename,id, },
      },
      location
    } = this.props;

    if(func.notEmpty(location) && func.notEmpty(location.state) && func.notEmpty(location.state.data) ){
      this.setState({
        detailData: location.state.data
      })
    }else {
      dispatch(COMMONBUSINESS_DETAIL({realId:id, tableName,modulename}))
        .then(()=>{
          const {
            commonBusiness: { detail,init },
          } = this.props;
          this.setState({
            detailData: detail,
            vo:init
          })
        });
    }

     dispatch(TABLEEXTEND_COLUMNLIST({'tableName': tableName,'modulename':modulename,queryType:3})).then(() => {
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
      match: {
        params: { tableName,modulename, },
      },
    } = this.props;
    const { getFieldDecorator } = form;
    const {showColums,showSubColums,detailData,vo} = this.state;
     const columns=getListConf(showSubColums)
    const items=getViewConf(showColums,getFieldDecorator,detailData);
    const backUrl = `/commonBusiness/commonList/${tableName}/${modulename}`



    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{vo.functionName}
        </NavBar>
        <Card title="" bordered={false}>
          <Card.Header
            title='基本信息'
            style={{ fontWeight: 'bold' }}
            className={styles.card}
          />
          {items}
        </Card>
        {showSubColums.length < 1 ? '' :
        <Card title="" className={styles.card} bordered={false}>
          <Card.Header
            title='项次'
            style={{ fontWeight: 'bold' }}
          />
          <div>
            {
              func.notEmpty(detailData.sublist) ? detailData.sublist.map(col => (
                <Card.Body>
                  {
                    columns.map(rrow => (
                      <div key={rrow.dataIndex}>{rrow.title}：{col[rrow.dataIndex]}</div>
                    ))
                  }
                </Card.Body>
              )) : ''
            }
          </div>
        </Card>
        }
        <Button
          icon='/image/plus.png'
          block
          type="primary"
          style={{marginRight: '-13px',width: '360px'}}
          onClick={()=> {
          router.push({
            pathname:`/ningMei/bookingOrder/bookingOrder`,
            state:{detailData}})}}
        >
          预订
        </Button>
      </div>
    );
  }
}
export default CommonPageView;

