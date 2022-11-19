import React, { PureComponent } from 'react';
import { List, ListView, Modal, NavBar, PullToRefresh, Toast } from 'antd-mobile';
import { Card, Col, Form, Icon } from 'antd';
import { router } from 'umi';
import { Tabs } from 'antd-mobile/es';
import Func from '@/utils/Func';
import { connect } from 'dva';
import { IconMeikuang, } from '@/components/Matrix/image';
import MatrixMobileDate from '@/components/Matrix/MatrixMobileDate';
import './Epidemic.less'
import { getCurrentDriver, getCurrentUser, getToken } from '@/utils/authority';
import { cancelQueue, reservationqueueList,Delayedservice } from '@/services/epidemic';
import { EmptyData,InTheLoad } from '@/components/Stateless/Stateless';
import { clientId } from '@/defaultSettings';
import { getPayConfig } from '../../services/epidemic';

let tabs = [
  { title: `已申请`, key: '7' },
  { title: `已排队`, key: '2' },
  { title: `已叫号`, key: '3' },
  { title: `已入厂`, key: '4' },
  { title: `已过号`, key: '9' },
  { title: `已取消`, key: '6' },
]
if (clientId === 'kspt'){
  tabs = tabs.filter(item=>item.key !== '7' && item.key !== '6')
}

@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class LineUpRecord extends PureComponent {

  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      dataSource,
      isLoading: true,
      hasMore: true,
      refreshing: true,
      pageNo: 1,
      pageSize: 5,
      realdata: [],
      tabKey: tabs[0].key,
      loading: true,
      isPageFault:false,
      viewMore:false,
      visible:false
    }
  }

  componentDidMount() {
    this.getData(false, {});
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata, tabKey, } = this.state;
    const detail = getCurrentDriver()
    const params = {
      ...param,
      current: pageNo, size: pageSize, queueStatus:tabKey,plantAreaId:getCurrentUser().deptId
    };
    if (clientId === 'kspt'){
      delete params.driverId
    }else {
      params.driverId = detail.id
      delete params.plantAreaId
    }
    reservationqueueList(params).then(item=>{
      this.setState({
        loading:false
      })
      if (item.success){
        const tempdata = typeof item === 'string' ? (Func.notEmpty(item) ? JSON.parse(item) : []) : (Func.notEmpty(item.data.records) ? item.data.records : []);
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
      }
    })
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

  /* 加载下一页 */
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

  /* 重新加载 */
  query = (flag, param) => {
    this.getData(flag, param);
  };

  changeTab = (tab) => {
    const { dataSource } = this.state;
    this.setState({
      pageNo: 1,
      tabKey: tab.key,
      dataSource,
      isLoading: true,
      loading:true
    }, () => {
      this.query(true, {});
    });
  };

  /* 重置 */
  reset = ()=>{
    const {form} = this.props
    form.resetFields()
    this.setState({
      visible:false
    })
  }


  cancel = (id,text) =>{
    Modal.alert(`${text}？`,`确定${text}？`,[
      {text:'不取消',onPress:()=>console.log('00')},
      {text:'确定取消',onPress:()=>
          cancelQueue({id}).then(resp=>{
            if(resp.success){
              Toast.info(resp.msg)
              this.query(true, {});
            }
          })
      },
    ])
  }

  toPayDelayService=(rowData)=>{ // 微信支付
    if (window.__wxjs_environment === 'miniprogram') {
      const {id,plantAreaId} = rowData
      Toast.info('加载中...')
      getPayConfig({deptId:plantAreaId}).then(rr => {
        const paySetting = rr.data
        Toast.hide()
        const item = {
          queueId:id,
          auth: getToken(),
          userOpenId:getCurrentUser().openId,
          paySetting,
          h5Page:'epidemic/lineuprecord'
        };
        const items = JSON.stringify(item);
        wx.miniProgram.navigateTo({ url: `/pages/delayPay/delayPay?items=${items}` });
      })
    } else {
      Toast.info(('不是微信支付环境'));
    }
  }


  render() {
    const { refreshing, dataSource, isLoading,visible,loading} = this.state;
    const {_cachedRowCount} = dataSource
    const { form } = this.props
    const span = 24
    const labelSpan = 7
    const wraplSpan = 17
    const width = 14
    const colSty = {padding:'5px 0'}

    const row = (rowData, sectionID, rowID) => {
      const {deptName,id,queueStatusName,queueStatus,coalName,vehicleno,reservtionQueueTime,formalQueueTime,callTime,mobilizedTime,passTime,cancelTime,queueNumber,isOpenDelayService,isCarryOutDelayService} = rowData
      let actions = []
      switch (queueStatus) {
        case 7:
          actions = [<a style={{color:'#1890FF'}} onClick={()=>this.cancel(id,'取消申请')}>取消申请</a>]
          break
        case 2:
          actions =
            clientId === 'kspt_driver'?
              [<a style={{color:'#1890FF'}} onClick={()=>this.cancel(id,'取消排队')}>取消排队</a>]:[] // 只有司机有取消排队功能
          break
        default:
      }
      return (
        <Card
          title={<div><img src={IconMeikuang} key={rowID} alt='' style={{height:20}} />&nbsp;&nbsp;{deptName}</div>}
          actions={actions}
          size="small"
          extra={queueStatusName}
          className='card-list'
          bordered={false}
        >
          <Col span={span} style={colSty}><Col span={labelSpan}>煤种：</Col> <Col span={wraplSpan}>{coalName}</Col></Col>
          <Col span={span} style={colSty}><Col span={labelSpan}>排队号：</Col> <Col span={wraplSpan}>{queueNumber == '-1'?'尚未进入排队':queueNumber}</Col></Col>
          <Col span={span} style={colSty}><Col span={labelSpan}>车牌号：</Col> <Col span={wraplSpan}>{vehicleno}</Col></Col>
          {
            queueStatus === 7?
              <Col span={span} style={colSty}><Col span={labelSpan}>申请时间：</Col> <Col span={wraplSpan}>{reservtionQueueTime}</Col></Col>:
              <Col span={span} style={colSty}><Col span={labelSpan}>排队时间：</Col> <Col span={wraplSpan}>{formalQueueTime}</Col></Col>
          }
          {
            queueStatus !== 7 && queueStatus !== 2 && (
              <Col span={span} style={colSty}><Col span={labelSpan}>{queueStatus === 4 ?'入厂':queueStatus === 9 ?'过号':queueStatus === 6 ?'取消':'叫号'}时间</Col>
                <Col span={wraplSpan}>{queueStatus === 4 ?mobilizedTime:queueStatus === 9?passTime:queueStatus === 6?cancelTime:callTime}</Col>
              </Col>
            )
          }
        </Card>
      )
    }

    const listView = loading? <InTheLoad />: (
      _cachedRowCount !== 0?(
        <ListView
          ref={el => {
            this.lv = el;
          }}
          dataSource={dataSource}
          renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
          renderRow={row}
          className='shop-listView'
          pageSize={4}
          style={{background:'white'}}
          useBodyScroll
          pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={10}
        />
      ):<EmptyData text='暂无排队记录' />);

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/vaccinerecords`);}}
          // rightContent={<Icon type="search" onClick={()=>this.setState({visible:true})} />}
        >排队记录
        </NavBar>
        <div className='am-list'>
          <Tabs tabs={tabs} onChange={(tab, index) => this.changeTab(tab, index)} className='mall-tabs' swipeable={false}>
            { clientId !== 'kspt' && <div key='7'>{listView}</div> }
            <div key='2'>{listView}</div>
            <div key='3'>{listView}</div>
            <div key='4'>{listView}</div>
            <div key='9'>{listView}</div>
            { clientId !== 'kspt' && <div key='6'>{listView}</div>}
          </Tabs>
          <Modal visible={visible} title={<div style={{paddingTop:10}}>查询</div>} footer={[{text:'重置',onPress:this.reset},{text:'确定',onPress:this.onOk}]} popup animationType='slide-up' onClose={()=>this.setState({visible:false})}>
            <MatrixMobileDate label='排队时间' required style={{display:'none'}} id='date' form={form} />
          </Modal>
        </div>
      </div>
    );
  }
}

export default LineUpRecord;

