import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Row, Col, Card, Icon, Menu, Dropdown } from 'antd';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import 'echarts/lib/chart/pie';
import 'echarts/lib/component/tooltip';
import 'echarts/lib/component/title';
import 'echarts/lib/component/legend';
import 'echarts/lib/component/markPoint';
import ReactEcharts from 'echarts-for-react';


@connect(({ user, project, activities, loading, kanban }) => ({
  currentUser: user.currentUser,
  project,
  activities,
  kanban,
  currentUserLoading: loading.effects['user/fetchCurrent'],
  projectLoading: loading.effects['project/fetchNotice'],
  activitiesLoading: loading.effects['activities/fetchList'],
  kanbanLoading: loading.effects['kanban/fetchList'],
}))
class DataPage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      pieChartList: [],
      mainInfoList: [],
    };
  }

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'kanban/fetchList',
    }).then(() => {
      const {
        kanban: { list },
      } = this.props;
      if (list.mainInfoList.length > 0 && list.pieChartList.length > 0) {
        this.setState({
          mainInfoList: list.mainInfoList,
          pieChartList: list.pieChartList,
        });
      }
    });
  }

  componentDidMount() {
    const { dispatch } = this.props;

    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'project/fetchNotice',
    });
    dispatch({
      type: 'activities/fetchList',
    });
  }


  getOption = (itempie) => {

    if (itempie.displayOrder === 1) {
      const option = {
        title: {
          text: itempie.chartTitle,
          textStyle: {
            fontSize: 15,
          },
          top: 10,
          left: 'center',
          subtext: `订单总数：${itempie.totalNums}单`,
          subtextStyle: {
            fontSize: 8,
          },
        },

        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '45%',
            center: ['50%', '70%'],
            label: {            // 饼图图形上的文本标签
              show: false,
            },
            data: [
              { value: itempie.todayNums, itemStyle: { normal: { color: '#FF8C00' } } },
              { value: itempie.unAuditNums, itemStyle: { normal: { color: '#B0C4DE' } } },
              { value: itempie.auditedNums, itemStyle: { normal: { color: '#00CED1' } } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return option;
    }
    if (itempie.displayOrder === 2) {
      const option = {
        title: {
          text: itempie.chartTitle,
          textStyle: {
            fontSize: 15,
          },
          top: 10,
          left: 'center',
          subtext: `委托单总数：${itempie.totalNums}单`,
          subtextStyle: {
            fontSize: 8,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 1,
          top: 90,
          bottom: 10,
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '45%',
            center: ['50%', '70%'],
            label: {            // 饼图图形上的文本标签
              show: false,
            },
            data: [
              { value: itempie.todayNums, itemStyle: { normal: { color: '#FF8C00' } } },
              { value: itempie.unconfirmedNums, itemStyle: { normal: { color: '#B0C4DE' } } },
              { value: itempie.confirmedNums, itemStyle: { normal: { color: '#00CED1' } } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return option;
    }
    if (itempie.displayOrder === 3) {
      const option = {
        title: {
          text: itempie.chartTitle,
          textStyle: {
            fontSize: 15,
          },
          top: 10,
          left: 'center',
          subtext: `派车计划总数：${itempie.totalNums}`,
          subtextStyle: {
            fontSize: 8,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 1,
          top: 90,
          bottom: 10,
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '45%',
            center: ['50%', '70%'],
            label: {            // 饼图图形上的文本标签
              show: false,
            },
            data: [
              { value: itempie.todayNums, itemStyle: { normal: { color: '#FF8C00' } } },
              { value: itempie.unAuditNums, itemStyle: { normal: { color: '#B0C4DE' } } },
              { value: itempie.auditedNums, itemStyle: { normal: { color: '#00CED1' } } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return option;
    }
    if (itempie.displayOrder === 4) {
      const option = {
        title: {
          text: itempie.chartTitle,
          textStyle: {
            fontSize: 15,
          },
          top: 10,
          left: 'center',
          subtext: `派车单总数：${itempie.totalNums}单`,
          subtextStyle: {
            fontSize: 8,
          },
        },
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)',
        },
        legend: {
          orient: 'vertical',
          right: 1,
          top: 90,
          bottom: 10,
        },
        series: [
          {
            name: '数量',
            type: 'pie',
            radius: '45%',
            center: ['50%', '70%'],
            label: {            // 饼图图形上的文本标签
              show: false,
            },
            data: [
              { value: itempie.todayNums, itemStyle: { normal: { color: '#FF8C00' } } },
              { value: itempie.unAuditNums, itemStyle: { normal: { color: '#B0C4DE' } } },
              { value: itempie.auditedNums, itemStyle: { normal: { color: '#00CED1' } } },
            ],
            emphasis: {
              itemStyle: {
                shadowBlur: 10,
                shadowOffsetX: 0,
                shadowColor: 'rgba(0, 0, 0, 0.5)',
              },
            },
          },
        ],
      };
      return option;
    }
    return itempie;
  };


  render() {

    const onClick = ({ key }) => {
      if (key === '1') {
        router.push('/dispatch/dispatchplan');
      } else {
        router.push('/dispatch/dispatchByorder');
      }
    };

    const onClickDispatch = ({ key }) => {
      if (key === '1') {
        router.push('/dispatch/dispatchbillByorder');
      } else {
        router.push('/dispatch/dispatchbillByplan');
      }
    };

    const onClickShipbill = ({ key }) => {
      if (key === '1') {
        router.push('/shipbill/shipbillorder');
      } else {
        router.push('/shipbill/shipbillplan');
      }
    };


    const menu = (
      <Menu onClick={onClick}>
        <Menu.Item key="1">派车计划无订单</Menu.Item>
        <Menu.Item key="2">派车计划按订单</Menu.Item>
      </Menu>
    );

    const menuDispatch = (
      <Menu onClick={onClickDispatch}>
        <Menu.Item key="1">派车单按订单</Menu.Item>
        <Menu.Item key="2">派车单按计划</Menu.Item>
      </Menu>
    );

    const menuShipbill = (
      <Menu onClick={onClickShipbill}>
        <Menu.Item key="1">委托单按订单</Menu.Item>
        <Menu.Item key="2">委托单按计划</Menu.Item>
      </Menu>
    );


    const { mainInfoList, pieChartList } = this.state;
    const styles = {
      card: {
        backgroundColor: 'red',
      },
      rowSty: {
        marginTop: '20px',
      },
    };
    const span = 24;

    return (
      <Panel>
        <Card className='dataPage_card'>
          <Row gutter={16} className='dataPage_echarts'>
            {
              pieChartList.map(itempie => (
                <Col className="gutter-row" span={6} style={{paddingLeft:4,paddingRight:4}}>
                  <ReactEcharts option={this.getOption(itempie)} style={{ height: '100px', backgroundColor: '#f6f6f6' }} />
                </Col>
              ))
            }
          </Row>
        </Card>
        {
          mainInfoList.map(item => (
            <div className='dataPage_list'>
              <Row gutter={24} style={{margin:0}}>
                {item.displayOrder === 1 ?
                  <Card className={styles.card} title={item.mainInfoTitle} extra={<a href="#" onClick={() => router.push('/salebill/salebill')}>更多 &gt;</a>}>
                    {
                      item.mainInfoDetailList.slice(0, 2).map(ii => (
                        <Row gutter={24}>
                          <Card className={styles.card}>
                            <Col className="gutter-row" span={span}>
                              <div><Icon type="schedule" theme="twoTone" twoToneColor="#FF8C00" />订单号:{ii.billno}</div>
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
                  </Card>
                  : ''
                }
              </Row>
              <Row gutter={24} style={{margin:0}}>
                {item.displayOrder === 2 ?
                  <Card
                    className={styles.card}
                    bordered={false}
                    title={item.mainInfoTitle}
                    extra={
                      <Dropdown overlay={menuShipbill}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>更多 &gt;</a>
                      </Dropdown>}
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
                  </Card>
                  : ''
                }
              </Row>
              <Row gutter={24} style={{margin:0}}>
                {item.displayOrder === 3 ?
                  <Card
                    title={item.mainInfoTitle}
                    className={styles.card}
                    bordered={false}
                    extra={
                      <Dropdown overlay={menu}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>更多 &gt;</a>
                      </Dropdown>}
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
                  </Card>
                  : ''
                }
              </Row>
              <Row gutter={24} style={{margin:0}}>
                {item.displayOrder === 4 ?
                  <Card
                    title={item.mainInfoTitle}
                    className={styles.card}
                    bordered={false}
                    extra={
                      <Dropdown overlay={menuDispatch}>
                        <a className="ant-dropdown-link" onClick={e => e.preventDefault()}>
                        更多 &gt;
                        </a>
                      </Dropdown>}
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
                  </Card>
                  : ''
                }
              </Row>
            </div>
          ))
        }
      </Panel>
    );
  }
}


export default DataPage;
