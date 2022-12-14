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
        <div onClick={onClickAcc}>?????????????????????</div>
        <div onClick={onClickNo}>?????????????????????</div>
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
        <div onClick={onClickDisAcc}>??????????????????</div>
        <div onClick={onClickDisNo}>??????????????????</div>
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
        <div onClick={onClickShipAcc}>??????????????????</div>
        <div onClick={onClickShipNo}>??????????????????</div>
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
                    <font color='#999'>?????????</font>
                    <h1 style={{ marginBottom: '0', color: '#1890FF', lineHeight: '1.5' }}>{itempie.totalNums}</h1>???
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
                extra={<a href="#" onClick={() => router.push('/salebill/salebill')}>??????</a>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div><Icon type="schedule" theme="twoTone" twoToneColor="#FF8C00" />?????????:{ii.billno}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>???????????????{ii.consigneeno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>???????????????{ii.materialnoName}</div>
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
                extra={<Dropdown overlay={menuShipbill}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>??????</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="alert" theme="twoTone" twoToneColor="#00FF00" />????????????????????????{ii.tenantIdName}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>????????????{ii.carrierIdName}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>????????????{ii.billno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????????????????{ii.confirmEntrustStatusName}</div>
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
                extra={<Dropdown overlay={menuSomeone}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>??????</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="reconciliation" theme="twoTone" twoToneColor="#DC143C" />????????????{ii.billno}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.materialnoName}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>???????????????{ii.packtypeName}</div>
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
                extra={<Dropdown overlay={menuDispatch}><a className="ant-dropdown-link" onClick={e => e.preventDefault()}>?????? &gt;</a></Dropdown>}
              >
                {
                  item.mainInfoDetailList.slice(0, 2).map(ii => (
                    <Row gutter={24}>
                      <Card className={styles.card}>
                        <Col className="gutter-row" span={span}>
                          <div>
                            <Icon type="car" theme="twoTone" twoToneColor="#00BFFF" />??????????????????{ii.id}
                          </div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.custno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.truckno}</div>
                        </Col>
                        <Col className="gutter-row" span={span}>
                          <div className='dapaPage_span'>?????????{ii.materialnoName}</div>
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
