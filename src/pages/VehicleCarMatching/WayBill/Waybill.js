import React, { PureComponent } from 'react';
import { ListView, NavBar, PullToRefresh, Tabs, Toast, WhiteSpace } from 'antd-mobile';
import { Button, Form, Icon, Modal, Radio } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import Text from 'antd/es/typography/Text';
import {
  arrive,
  cancel,
  evaluation,
  list,
  orderTake,
  orderTakeVerify,
} from '@/services/VehicleCarMatching/WayBillServices';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import NetWorkCard from '@/components/NetWorks/NetWorkCard';
import NetWorkRate from '@/components/NetWorks/NetWorkRate';
import { sign } from '@/services/NetContract';
import { getCurrentUser } from '@/utils/authority';
import { MERDRIVER_DETAIL } from '@/actions/merDriver';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class Waybill extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource: dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      waybillStatus: '1',
      rateShow: false,
      visibleCancel: false,
      cancelValue: 1,
      cancelData: {},
      merDriverdetail: {},
      // signerId1: '',
      // signerId2: '',
      rowData: {},
      rowDataOne: {},
      load: localStorage.getItem('load'),
      tabs: [{ title: '全部', key: '1' }, { title: '执行中', key: '2' }, { title: '已完结', key: '3' }],
      checked: false,
      order: false,
      confirmLoading:false,
      onSiteLoading:false,
      rateallstate:false
    };
  }

  componentWillMount() {
    const { location } = this.props;
    if (location.state !== undefined) {
      const sourcegoodsid = location.state.sourceGoodsId;
      this.getData(false, {}, sourcegoodsid);

    } else {
      this.getData(false, {});
    }
    const {
      dispatch,
      merDriver: {
        detail,
      },
    } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId));
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      merDriverdetail: detail,
    });
  }

  componentWillUnmount() {
    localStorage.removeItem('load');
  }

  getData(ref, param, sourcegoodsid) {
    const { pageNo, pageSize, dataSource, realdata, waybillStatus, load } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    param.flag = load != null && load !== undefined ? load : waybillStatus;
    param.sourceGoodsId = sourcegoodsid;
    delete param.settlementEfficiency;
    delete param.matchDegreeScore;
    if(param.flag==1){
      delete param.flag
    }
    list(param).then(resp => {
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data.records) ? resp.data.records : []);
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
      }
      if (ref) { // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        });
      } else { // 上拉加载
        const dataArr = realdata.concat(tempdata);
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
        });
      }
    });
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.query(false, {});
    });
  };

  query = (flag, param) => {
    const { form, location } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param,
      };
      if (location.state !== undefined) {
        const sourcegoodsid = location.state.sourceGoodsId;
        this.getData(flag, values, sourcegoodsid);

      } else {
        this.getData(flag, values);
      }
      // this.getData(flag, values);
    });
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  changeTab = (tab) => {
    this.setState({
      pageNo: 1,
      waybillStatus: tab.key,
      dataSource: dataSource1,
      isLoading: true,
      load: localStorage.removeItem('load'),
    }, () => {
      this.query(true, {});
    });
  };

  agreeItem = a => {
    this.setState({
      checked: a.target.checked,
    });
  };

  // 接单
  orderTake = (e, rowData) => {
    e.stopPropagation();
    this.setState({
      order: true,
      rowDataOne: rowData,
    });
  };

  // 到场装货
  onSiteLoading = (e, rowData) => {
    e.stopPropagation();
    this.setState({
      onSiteLoading: true,
      rowDataOne: rowData,
    });
  };// onSiteLoading

  distanceVerification=()=> {
    const {rowDataOne}=this.state
    this.setState({confirmLoading:true})
    // const state = LocationStatus.getLocationStatus();
    // if (JSON.stringify(JSON.parse(state)) === 'false') {
    //   Toast.offline('请检查定位开启状态！！');
    //   return
    // }
    // const location = Location.getLocation();
    // const params = {
    //   longitude: JSON.stringify(JSON.parse(location).longitude),
    //   latitude: JSON.stringify(JSON.parse(location).latitude),
    // };
    const param={
      id:rowDataOne.id,
      arriveAddressCoordinate:'173,36'
    }
    arrive(param).then((res)=>{
      if(res.success){
        Toast.success(res.msg)
        this.setState({
          onSiteLoading: false,
          confirmLoading:false
        })
        this.query(true, {});
      }else{
        this.setState({
          onSiteLoading: false,
          confirmLoading:false
        })
      }
    })
  }

  signMethod = () => {
    const refresh = this.reset;
    const { checked, rowDataOne } = this.state;
    if (checked === false) {
      Toast.offline('请先同意网络货运承运协议！');
      return;
    }
    this.setState({
      confirmLoading:true
    })
    orderTakeVerify({ type: 1, id: rowDataOne.id }).then((resp0) => {
      if (resp0.success) {
        sign({ id: rowDataOne.id, agreement: checked ? 1 : 0 }).then(res => {
          if (res.success) {
            this.setState({
              order: false,
              checked: false,
            });
            orderTake({ waybillId: rowDataOne.id }).then(res1 => {
              if (res1.success) {
                Toast.success(res1.msg);
                refresh();
                localStorage.setItem('load', 2);
              }else{
                this.setState({
                  confirmLoading:false
                })
              }
            });
          } else {
            this.setState({
              order: false,
              checked: false,
              confirmLoading:false
            });
          }
        });
      }else{
        this.setState({
          confirmLoading:false
        })
      }
    });
  };

  // 取消
  cancel = (e, rowData) => {
    e.stopPropagation();
    this.setState({
      visibleCancel: true,
      cancelData: rowData,
    });
  };

  // 装货确认
  submitLoad = (e, rowData) => {
    e.stopPropagation();
    const { waybillStatus } = this.state;
    router.push(
      {
        pathname: `/network/waybill/loadConfirm/${rowData.id}`,
        state: {
          type: 'submitLoad',
          rowData,
          initialPage: waybillStatus,
        },
      },
    );
  };

  // 重新上传装货确认
  submitAgainLoad = (e, rowData) => {
    e.stopPropagation();
    const { waybillStatus } = this.state;
    router.push(
      {
        pathname: `/vehicleCarMatching/waybillmanagement/loadConfirm/${rowData.id}`,
        state: {
          type: 'submitAgainLoad',
          rowData,
          initialPage: waybillStatus,
        },
      },
    );
  };

  // 卸货确认
  submitSign = (e, rowData) => {
    e.stopPropagation();
    const { waybillStatus } = this.state;
    router.push(
      {
        pathname: `/vehicleCarMatching/waybillmanagement/loadConfirm/${rowData.id}`,
        state: {
          type: 'submitSign',
          rowData,
          initialPage: waybillStatus,
        },
      },
    );
  };

  // 重新上传卸货信息
  submitAgainSign = (e, rowData) => {
    e.stopPropagation();
    const { waybillStatus } = this.state;
    router.push(
      {
        pathname: `/vehicleCarMatching/waybillmanagement/loadConfirm/${rowData.id}`,
        state: {
          type: 'submitAgainSign',
          rowData,
          initialPage: waybillStatus,
        },
      },
    );
  };

  // ***********评价***************
  evaluate = (e, rowData) => {  // 评价
    e.stopPropagation();
    if(rowData.evaluationDriverStatus === 1){
      Toast.fail('该运单已经评价不能重复评价！')
    }else {
      this.setState({
        rateShow: true,
        rowData,
      });
    }
  };

  rateChange = () => {
  };

  /* 评价 */
  confirmRate = () => {
    const { form } = this.props;
    const { rowData,rateallstate } = this.state;
    const refresh = this.reset;
    form.validateFields((error, values) => {
      const { settlementEfficiency, matchDegreeScore } = values;
      // const evaluationScore = loadingEfficiencyScore + matchDegreeScore;
      if (settlementEfficiency === null || Number.isNaN(settlementEfficiency)) {
        Toast.offline('请选择运单结算效率分数！');
        return;
      }
      if (matchDegreeScore === null || Number.isNaN(matchDegreeScore)) {
        Toast.offline('请选择配合度分数！');
        return;
      }
      const scoreType = {
        7: settlementEfficiency*2,
        6: matchDegreeScore*2,
      };
      const param={
        evaluationType: 2,
        waybillid: rowData.id,
        scoreType,
        batch:1
      }
      if(!rateallstate){
        delete param.batch
      }
      evaluation(param).then(resp => {
        if (resp.success) {
          Toast.success(resp.msg);
          this.setState({
            rateShow: false,
          });
          refresh();
        }
      });
    });
  };

  onChange = e => {
    this.setState({
      cancelValue: e.target.value,
    });
  };

  /* 取消原因确定 */
  handleOk = () => {
    const { cancelData, cancelValue } = this.state;
    const refresh = this.reset;
    cancel({ id: cancelData.id, invalidRemark: cancelValue }).then(resp => {
      if (resp.success) {
        Toast.success(resp.msg);
        this.setState({
          visibleCancel: false,
        });
        refresh();
      }
    });
  };

  checkboxValue=(e)=>{
    this.setState({
      rateallstate:e.target.checked
    })
  }

  /* 关闭弹窗 */
  hideModal = () => {
    this.setState({
      visibleCancel: false,
      rateShow: false,
      order: false,
      onSiteLoading:false
    });
  };

  /* 跳转详情 */
  onNetWorkCard = rowData => {
    const { waybillStatus, load } = this.state;
    router.push(
      {
        pathname: `/vehicleCarMatching/waybillmanagement/view/${rowData.id}`,
        state: {
          initialPage: load != null && true ? load : waybillStatus,
        },
      },
    );
  };

  render() {
    const { rowDataOne, dataSource, isLoading, refreshing, waybillStatus, rateShow, visibleCancel, load, cancelValue, tabs, order,onSiteLoading, checked,confirmLoading } = this.state;

    const { form } = this.props;
    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />);

    const row = (rowData, sectionID, rowID) => {
      let actions = ([]);
      const aa = rowData.waybillStatus;
   if (aa === 1) { /* 已接单 */
        actions = ([
          <Button style={{width:'92%'}} type="primary" onClick={(e) => this.onSiteLoading(e, rowData)}>到场装货确认</Button>,
        ]);
      } else if (aa === 3) { /* 已装运 */
        actions = ([
          <Button style={{width:'92%'}} type="primary" onClick={(e) => this.submitSign(e, rowData)}>卸货确认</Button>,
        ]);
      } else if (aa === 4||aa === 5) { /* 已送达、已签收 */
        actions = ([
          rowData.evaluationDriverStatus===1  ?
            <div style={{ color: '#1890FF' }} onClick={(e) => rowData.evaluationDriverStatus===0?this.evaluate(e, rowData):''}> {rowData.evaluationDriverStatus===1?'已评价':<Button>评价</Button>}</div>
            :
            <div>
              <div style={{float:'left',paddingLeft:'20px'}}>
                <Button type="primary" style={{paddingRight:'20px'}} onClick={(e) => this.submitAgainSign(e, rowData)}>重新上传卸货信息</Button>
              </div>
              <div style={{ color: '#1890FF',float:'right',paddingRight:'20px'}}> {rowData.evaluationDriverStatus===1?'已评价':<Button type='primary' onClick={(e) => rowData.evaluationDriverStatus===0?this.evaluate(e, rowData):''}>评价</Button>}</div>
            </div>,
        ]);
      } else{
          actions = ([
            // <div style={{ color: '#1890FF' }}>已评价</div>,
          ]);
        }

      return (
        <div key={rowID}>
          <NetWorkCard rowData={rowData} actions={actions} onclick={() => this.onNetWorkCard(rowData)} />
        </div>
      );
    };

    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
    const radioValue = [{ value: 1, content: '取消计划变更' }, { value: 2, content: '运费价格因素' }, {
      value: 3,
      content: '运输计划有变',
    }, { value: 4, content: '装车时间超时' }, { value: 5, content: '其他原因' }];

    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite');
    return (
      <div id={NetWorkLess.netWork}>
        {
          ifFromOtherSite === 'ok' ? undefined :
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/SupplyHall')}
          >全部运单
          </NavBar>
        }

        <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
          <Tabs
            tabs={tabs}
            page={load != null && true ? Number(load) - 1 : waybillStatus - 1}
            initialPage={0}
            onChange={(tab, index) => this.changeTab(tab, index)}
          >
            <div key='1'>{listView}</div>
            <div key='2'>{listView}</div>
            <div key='3'>{listView}</div>
          </Tabs>
        </div>
        <Modal
          className={NetWorkLess.netWorkRate}
          visible={rateShow}
          title='评价'
          width={350}
          transparent
          maskClosable
          onCancel={this.hideModal}
          wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          onOk={this.confirmRate}
          destroyOnClose
        >
          <NetWorkRate
            label='运单结算效率'
            id='settlementEfficiency'
            form={form}
            onChange={(e) => {
              this.rateChange(e);
            }}
          />
          <div>
            <NetWorkRate
              label='配合度'
              id='matchDegreeScore'
              form={form}
              onChange={(e) => {
              this.rateChange(e);
            }}
            />
            <WhiteSpace size="xl" />
            {/* <Checkbox id='rateAll' onChange={(e)=>{this.checkboxValue(e)}} style={{borderRadius:4}}>是否同步本运单货源下的其他运单</Checkbox> */}
          </div>
        </Modal>
        <Modal
          className="imgCon"
          visible={visibleCancel}
          width={260}
          closable={false}
          onOk={this.handleOk}
          onCancel={this.hideModal}
          okText="确认"
          cancelText="暂不取消"
        >
          <Radio.Group onChange={this.onChange} value={cancelValue}>
            {radioValue.map(item => (
              <Radio value={item.value} style={{ height: '34px', lineHeight: '34px' }}>{item.content}</Radio>))}
          </Radio.Group>
        </Modal>
        <Modal
          visible={onSiteLoading}
          closable={false}
          className={NetWorkLess.netWorkModal}
          onCancel={this.hideModal}
          onOk={this.distanceVerification}
          confirmLoading={confirmLoading}
        >
          <Icon type="question-circle" style={{ color: '#faad14', marginRight: 16, fontSize: 22 }} />
          <div>
            <Text strong style={{ fontSize: 18 }}>到场确认</Text>
            <div style={{ marginTop: 10 }}>
              是否已到达{rowDataOne.mineName}?
            </div>
          </div>
        </Modal>
      </div>
    );
  }
}

export default Waybill;
