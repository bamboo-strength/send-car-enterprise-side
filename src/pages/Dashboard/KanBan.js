import React, { PureComponent } from 'react';
import { Carousel, Card, Col, Icon, Row, Dropdown } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '../../layouts/Sword.less';
import CustSelectShipContent from './CustSelectShipContent';
import CarrierSelectShipContent from './CarrierSelectShipContent';
import menu from './Menu.less';
import { getColums, getCommonParam, getTenantId } from '../Merchants/commontable';
import { getRelationTenant } from '../../services/defaultShippers';
import { gethomePageImg, getNotice, getMobileQuery,getGeneral } from '../../services/menu';
import func from '@/utils/Func';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { requestListApi,requestApiByJson } from '@/services/api';


@connect(({ kanban, tableExtend }) => ({
  kanban,
  tableExtend,
}))
class Kanban extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      userTypeFlag: false,
      userCarrierType: false,
      mainInfoList: [],
      pieChartList: [],
      homePageImg: [],
      noticeList: [],
      showColums: [],
      businessSetting: {},
      getBusinessList: [],
    };

  }





  getInitialData=()=>{
    const { dispatch } = this.props;
    const params = {};
    params.current = 1;
    params.size = 5;
    params['Blade-DesignatedTenant'] = getTenantId();
    dispatch({ type: 'kanban/fetchList' }).then(() => {
      const { kanban: { list } } = this.props;
      if (func.notEmpty(list.mainInfoList) && func.notEmpty(list.pieChartList)) {
        this.setState({
          mainInfoList: list.mainInfoList,
          pieChartList: list.pieChartList,
        });
      }
    });

  }

  notice = ()=>{
    router.push(
      {
        pathname: '/desk/notice/list',
        state: {
          'notice':"menu"
        },
      },
    );
  }

  render() {
    const { userTypeFlag, userCarrierType, pieChartList, mainInfoList, homePageImg, noticeList, showColums, businessSetting, getBusinessList } = this.state;
    const span = 24;

    const onClickAcc = () => {
      router.push('/dispatch/dispatchplan');
    };
    const onClickNo = () => {
      router.push('/dispatch/dispatchplanByorder');
    };
    const menuSomeone = (
      <div className='menuMore'>
        <div onClick={onClickAcc}>派车计划无订单</div>
        <div onClick={onClickNo}>派车计划按订单</div>
      </div>
    );
    const onClickDisAcc = () => {
      router.push('/dispatch/dispatchbillByorder');
    };
    const onClickDisNo = () => {
      router.push('/dispatch/dispatchbillByplan');
    };
    const menuDispatch = (
      <div className='menuMore'>
        <div onClick={onClickDisAcc}>派车单按订单</div>
        <div onClick={onClickDisNo}>派车单按计划</div>
      </div>
    );
    const onClickShipAcc = () => {
      router.push('/shipbill/shipbillorder');
    };
    const onClickShipNo = () => {
      router.push('/shipbill/shipbillplan');
    };
    const menuShipbill = (
      <div className='menuMore'>
        <div onClick={onClickShipAcc}>委托单按订单</div>
        <div onClick={onClickShipNo}>委托单按计划</div>
      </div>
    );
    const rows = getColums(showColums, '');
    return (
      <div>
        <Card>
          <Row gutter={16} className='dataPage_echarts'>
            {pieChartList.map(itempie => {
              let menuImg = '';
              return (
                <Col className='gutter-row menu-row' span={12} style={{ padding: 8 }}>
                  <p className='menu-p'>{menuImg}{itempie.chartTitle}</p>
                  <div style={{ display: 'flex', alignItems: 'baseline', marginLeft: '24px' }}>
                    <font color='#999'>总数：</font>
                    <h1 style={{ marginBottom: '0', color: '#1890FF', lineHeight: '1.5' }}>{itempie.totalNums}</h1>单
                  </div>
                </Col>
              );
            })
            }
          </Row>
        </Card>
        {
        mainInfoList.map(item => (
        <div className='dataPage_list'>
          <Row gutter={24} style={{ margin: 0 }}>
            {item.displayOrder === 1 ?
              <Card
                className={styles.card}
                title={item.mainInfoTitle}
                extra={<a href="#" onClick={() => router.push('/salebill/salebill')}>更多</a>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div><Icon type="schedule" theme="twoTone" twoToneColor="#FF8C00" />订单号:{ii.billno}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>客户：{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>收货单位：{ii.consigneeno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>物资名称：{ii.materialnoName}</div>
                        </Col>
                      </Card>
                    </Row>
                  ))
                }
              </Card> : ''}
          </Row>
          <Row gutter={24} style={{ margin: 0 }}>
            {item.displayOrder === 2 ?
              <Card
                className={styles.card}
                bordered={false}
                title={item.mainInfoTitle}
                extra={<Dropdown overlay={menuShipbill}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>更多</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="alert" theme="twoTone" twoToneColor="#00FF00" />发货方所属租户：{ii.tenantIdName}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>承运商：{ii.carrierIdName}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>订单号：{ii.billno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>确认委托状态：{ii.confirmEntrustStatusName}</div>
                        </Col>
                      </Card>
                    </Row>
                  ))
                }
              </Card> : ''
            }
          </Row>
          <Row gutter={24} style={{ margin: 0 }}>
            {item.displayOrder === 3 ?
              <Card
                title={item.mainInfoTitle}
                className={styles.card}
                bordered={false}
                extra={<Dropdown overlay={menuSomeone}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>更多</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="reconciliation" theme="twoTone" twoToneColor="#DC143C" />计划号：{ii.billno}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>客户：{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>物资：{ii.materialnoName}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>包装类型：{ii.packtypeName}</div>
                        </Col>
                      </Card>
                    </Row>
                  ))
                }
              </Card> : ''
            }
          </Row>
          <Row gutter={24} style={{ margin: 0 }}>
            {item.displayOrder === 4 ?
              <Card
                title={item.mainInfoTitle}
                className={styles.card}
                bordered={false}
                extra={<Dropdown overlay={menuDispatch}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>更多 &gt;</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="car" theme="twoTone" twoToneColor="#00BFFF" />派车单编号：{ii.id}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>客户：{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>车号：{ii.truckno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>物资：{ii.materialnoName}</div>
                        </Col>
                      </Card>
                    </Row>
                  ))
                }
              </Card> : ''
            }
          </Row>
        </div>
        ))
        }
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
}))(props => (
  <Kanban {...props} />
));
