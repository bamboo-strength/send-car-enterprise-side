import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Col, Form, Row } from 'antd/lib/index';
import { Icon, NavBar,Card } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { COMMONBUSINESS_DETAIL } from '../../../actions/commonBusiness';
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

     dispatch(TABLEEXTEND_COLUMNLIST({'tableName': tableName,'modulename':modulename,queryType:3})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub
          },()=>{
            if(func.notEmpty(location) && func.notEmpty(location.state) && func.notEmpty(location.state.data) ){
              this.setState({
                detailData: location.state.data
              })
            }else {
              dispatch(COMMONBUSINESS_DETAIL({realId:id, tableName,modulename})) .then(()=>{
                  const {
                    commonBusiness: { detail,init },
                  } = this.props;
                  this.setState({
                    detailData: detail,
                    vo:init
                  })
                });
            }
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
      location,
    } = this.props;
    const { getFieldDecorator } = form;
    const {showColums,showSubColums,detailData,vo} = this.state;
    const items=getViewConf(showColums,getFieldDecorator,detailData);
    const backUrl = location.state && location.state.backUrl?location.state.backUrl :`/ningMei/nmDispatch/${tableName}/${modulename}`

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{vo.functionName?vo.functionName:'详情'}
        </NavBar>
        <div className='am-list'>
          <Card title="" bordered={false}>
            <Card.Header
              title='基本信息'
              style={{ fontWeight: 'bold' }}
            />
            <Card.Body>
              {items}
            </Card.Body>
          </Card>
          {showSubColums.length < 1 ? undefined :
          <Card title="" className={`${styles.card}`} bordered={false}>
            <Card.Header
              title={vo.subTitleName?vo.subTitleName:'子项'}
              style={{ fontWeight: 'bold' }}
            />
            {
              func.notEmpty(detailData.sublist) ? detailData.sublist.map(col => (
                <Card.Body>
                  {getViewConf(showSubColums,getFieldDecorator,col)}
                </Card.Body>
              )) : undefined
            }
           {/* {
              func.notEmpty(detailData.sublist) ? detailData.sublist.map(col => (
                <Card.Body>
                  <Row gutter={24}>
                    {
                    columns.map(rrow => (
                      <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.title}><span>{col[rrow.dataIndex]}</span></FormItem></Col>
                    //  <div key={rrow.dataIndex}>{rrow.title}：{col[rrow.dataIndex]}</div>
                    ))
                  }
                  </Row>
                </Card.Body>
              )) : undefined
            }
*/}
          </Card>
        }
        </div>
      </div>
    );
  }
}
export default CommonPageView;

