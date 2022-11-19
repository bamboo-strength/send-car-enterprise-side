import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form,Popover, Switch, Card, Avatar } from 'antd/lib/index';
import { Icon, NavBar,Button } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { COMMONBUSINESS_DETAIL } from '../../../actions/commonBusiness';
import { getListConf } from '@/components/Matrix/MatrixListColumConfig';
import {getViewConf} from '@/components/Matrix/MatrixViewConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import func from '@/utils/Func';

const { Meta } = Card;

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
    // console.log(location)

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

  // 下单
  placeOrder =(mainDetail,subDetail)=>{
    const detail = mainDetail
    const aa = []
    aa.push(subDetail)
    detail.sublist = aa
    router.push({
      pathname: `/shashi/selectMinecodeOrder/shashi_select_minecode/selectMinecode`,
      state: {
        detail,
      },
    });
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

    const columns=getListConf(showSubColums)
    const items=getViewConf(showColums,getFieldDecorator,detailData);
    const backUrl = location.state?location.state.backUrl :`/dashboard/menu`

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{vo.functionName}
        </NavBar>
        <Card title="基本信息" bordered={false}>
          {items}
        </Card>
        <h2 style={{fontWeight: 'bold',fontSize: '14px',margin: '5px 0px 0px 5px'}}>物资信息</h2>
        {showSubColums.length < 1 ? undefined :
          <div>
            {
              func.notEmpty(detailData.sublist) ? detailData.sublist.map(col => (
                <Card style={{marginTop: 5,padding:'10px 0px' }} className='cardAvatar'>
                  <Meta
                    avatar={
                      <Avatar src="https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=2967667342,2167345846&fm=26&gp=0.jpg" className='avatar' />
                    }
                    title={col.materialnoName}
                    description={
                      <div>
                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}><span>今日产量：{col.amount}t</span> <span>库存量:{col.shipmentAmount}t</span></div>
                        <div>单价：{col.price}元/吨</div>
                        <div style={{display: 'flex',justifyContent: 'space-between',alignItems: 'center'}}>
                          <p style={{marginBottom:0,display:'flex'}}>
                            <Popover
                              content={
                                <div>
                                  <p>1、基准量1000吨，每增加1吨，优惠10元</p>
                                  <p>2、有效发运时间每缩减1天，优惠10元</p>
                                  <p>3、最大优惠幅度10000元</p>
                                </div>
                              }
                            >
                              <Button className='youhui'>量大优惠</Button>
                            </Popover>
                            <Popover
                              content={
                                <div>
                                  <p>最新7折优惠</p>
                                </div>
                              }
                            >
                              <Button className='youhui' style={{marginLeft:10,color:'#ff7200'}}>打折优惠</Button>
                            </Popover>
                          </p>
                          <Button
                            style={{width: '80px', height: '30px', fontSize: '14px', background: '#1890FF', color: 'white', lineHeight: '30px', borderRadius: '50px',}}
                            onClick={() => this.placeOrder(detailData,col)}
                          >立即下单
                          </Button>
                        </div>
                      </div>

                    }
                  />
                </Card>
              )) : undefined
            }
          </div>
        }
      </div>
    );
  }
}
export default CommonPageView;

