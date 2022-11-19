import React, { PureComponent } from 'react';
import { Card, Empty, Icon } from 'antd';
import { List, ListView, Modal, NavBar, Popover, PullToRefresh, Tabs, Toast } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import '../ShopCenter.less';
import router from 'umi/router';
import { list } from '@/services/FreightServices';
import func from '@/utils/Func';
import {
  contractManageDelete,
  contractManageDownload,
  documentAddByFile,
  pageurl,
  queryContract,
  queryPage,
  viewurl,
} from '@/services/contract';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';


const {Item} = Popover;
const { alert } = Modal;

const routerUrl = () => {
  localStorage.removeItem('tabKeys')
  router.push(`/shopcenter/mallhomepage/list`);
};

window.gobackurl = function() {
  routerUrl();
};

class Contract extends PureComponent {

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
      loading: true,
      tabKeys:'0',
      custno_equal:JSON.parse(localStorage.getItem('sword-current-user')).customerId,
    };
  }


  componentDidMount() {
    const tabKey = localStorage.getItem('tabKeys')
    const {tabKeys} = this.state
    this.setState({
      tabKeys: tabKey || tabKeys
    },()=>{
      this.getData(false, );
    })
    this.timer = setInterval(() => {
      this.setState({
        date: new Date()
      });
    }, 1000);
  }

  componentWillUnmount() {
    clearInterval(this.timer);
  }

  /* 请求列表数据 */
  getData(ref) {
    const { pageNo, pageSize, dataSource, realdata, tabKeys ,custno_equal} = this.state;
    const pages = {current: pageNo, size: pageSize, }
    let params = {
      ...pages, labelStatus: tabKeys,
    };
    let path = queryPage;
    if (tabKeys === '4'){  // 已结算
      path = queryContract;
      params = {
        ...pages,
        custno_equal,
        contractType:"1"
      }
    }
    // if (tabKeys === '5'){  // 开票完成
    //   path = queryContract;
    //   params = {
    //     ...pages,
    //     custno_equal,
    //     contractType:"2"
    //   }
    // }
    path(params).then(resp => {
      this.setState({
        loading: false,
      });
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
      this.getData(true);
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
      this.getData(false,);
    });
  };

  changeTab = (tab) => {
    const { dataSource ,} = this.state;
    this.setState({
      pageNo: 1,
      dataSource,
      isLoading: true,
      loading: true,
      tabKeys:tab.key
    }, () => {
      localStorage.setItem('tabKeys',tab.key)
      this.getData(true);
    });
  };

  onClick = (item, type) => {
    const {tabKeys} = this.state
    const { contractLockContractId } = item;
    switch (type) {
      case 'view':
        viewurl({ contractId:contractLockContractId}).then(items => {
          if (items.success) {
            window.location.href = items.data;
          }
        });
        break;
      case 'copy':
        router.push(`/shopcenter/makesuretheorder/2`);
        break;
      case 'prepaid':
        router.push({
          pathname: '/shopcenter/contract/paymentinadvance',
          state: {
            item,
          },
        });
        break;
      case 'payRecord':
        router.push({
          pathname: `/shopcenter/contract/paymentrecord/${item.id}`,
          state: { item },
        });
        break;
      case 'initiate':
        alert('发起合同？', '确认发起合同？', [
          { text: '取消', onPress: () => console.log('取消') },
          {
            text: '确定', onPress: () => {
              Toast.loading('正在发起合同');
              documentAddByFile({ bizId: item.id }).then(i => {
                if (i.success) {
                  /* 签署页面 */
                  pageurl({ contractId: i.data.contractId, pageType: 'DIRECT_SIGN' }).then(d => {
                    if (d.success) {
                      router.push({
                        pathname: '/shopcenter/contract/signing',
                        state: {
                          contractUrl: d.data.pageUrl, contractId: i.data.contractId,
                        },
                      });
                    } else {
                      Toast.hide();
                    }
                  });
                } else {
                  Toast.hide();
                }
              });
            },
          },
        ]);
        break;
      case 'delete':
        alert('删除？', '确认删除此合同？', [
          { text: '取消', onPress: () => console.log('取消') },
          {
            text: '确定', onPress: () => {
              Toast.loading('正在删除');
              contractManageDelete({ ids: item.id }).then((i) => {
                if (i.success) {
                  Toast.hide();
                  Toast.success(i.msg);
                  this.getData(true, {});
                  this.setState({
                    pageNo: 1,
                  });
                } else {
                  Toast.hide();
                }
              });
            },
          },
        ]);
        break;
      case 'download':
        alert('下载', '确定要下载此合同？', [
          { text: '取消', style: 'default' },
          {
            text: '确定', onPress: () => {
              Toast.loading('加载中');
              const ua = navigator.userAgent.toLowerCase();
              contractManageDownload({ contractId: contractLockContractId }).then(items => {
                if (items.success) {
                  /* 苹果手机下载文件 */
                  if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
                    ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
                    ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
                    const src = items.data;
                    const iframe = document.createElement('iframe');
                    iframe.style.display = 'none';
                    iframe.src = `javascript: '<script>location.href="${src}"<\/script>'`;
                    document.getElementsByTagName('body')[0].appendChild(iframe);
                  } else {
                    window.open(items.data);
                  }
                  Toast.hide();
                } else {
                  Toast.hide();
                  Toast.fail(items.msg);
                }
              });
            },
          },
        ]);
        break;
      case 'detail':
        router.push(`/shopcenter/contract/signthestate/${contractLockContractId}`);
        break;
      default:
        console.log('未找到值！');
    }
  };

  countdown = (time) => {
    const timer = ''
    if (typeof time === 'string'|| typeof time === 'number'){
      time = time.replace(/-/g, '/')
    }
    let msg = '';
    const bb = new Date().getTime();
    const dd = new Date(time).getTime();
    const times = dd-bb
    /* 判断截止时间减去当前时间 是否 小于0，小于0就停止定时器调用 */
    if (times <= 0) {
      msg = '0 天 0 小时 0 分 0 秒'
      clearInterval(timer);
    } else {
      msg = func.countdown(time);
    }
    return msg;
  };

  // 申请结算
  settlement =(contractno,contract,contractType)=>{
    router.push({
      pathname:'/shopcenter/contract/settlement',
      state:{contractno,contract,contractType}
    })
  }

  // 查看结算账单
  settlementRecord = (contractno,contract,contractType) =>{
    router.push({
      pathname:'/shopcenter/contract/settlementrecord',
      state:{contractno,contract,contractType}
    })
  }


  // 申请开票
  // billing = (contractno,contract)=>{
  //   router.push({
  //     pathname:'/shopcenter/contract/billing',
  //     state:{contractno,contract}
  //   })
  // }

  // 开票记录
  // billingrecord = (contractno,contract)=>{
  //   router.push({
  //     pathname:'/shopcenter/contract/billingrecord',
  //     state:{contractno,contract}
  //   })
  // }



  //  申请退款
  // refund =() =>{
  //   const msg = (
  //     <div>
  //       <p>退款金额</p>
  //       <p>￥1000.0</p>
  //       <p>确定申请合同退款</p>
  //     </div>
  //   )
  //   Modal.alert(
  //     '系统检测到你还没有发运，可申请退款',
  //     msg,
  //     [
  //       { text:'取消',onPress:()=>{}},
  //       { text:'确定',onPress:()=>{}}
  //     ]
  //   )
  // }


  render() {
    const { dataSource, refreshing, isLoading, loading,tabKeys,} = this.state;
    const { _cachedRowCount } = dataSource;
    const row = (rowData, sectionID, rowID) => {
      const { contractGoodsEntityList, contractStatusName, contractStatus, contractType,} = rowData;
      /* 展示出这个合同下，所有订单的物资名称 */
      let name = '';
      contractGoodsEntityList.map((item, index) => {
        const { goodsEntity } = item;
        if (index === contractGoodsEntityList.length - 1) {
          name += `${goodsEntity.name}`;
        } else {
          name += `${goodsEntity.name}、`;
        }
        return name;
      });

      const contractno = []
      if (tabKeys === '4') {
        rowData.contractsList && rowData.contractsList.forEach(item => {
          contractno.push(`${rowData.contractNo}-${item}`)
        })
      } else {
        rowData.contractGoodsEntityList && rowData.contractGoodsEntityList.forEach((item) => {
          contractno.push(`${rowData.contractNo}-${item.contractSubNo}`)
        })
      }
      const contract = rowData.contractNo;

      return (
        <div key={rowID}>
          <Card
            title={`合同号：${rowData.contractNo}`}
            bordered={false}
            extra={<Text type="danger">{contractStatusName}</Text>}
            actions={contractStatus !== 0 ? contractStatus === 11 ? // 执行中
              [
                <div style={{display:'flex',flexDirection:'column'}}>
                  <div style={{display:'flex'}}>
                    <a onClick={() => this.onClick(rowData, 'view')}>文本合同</a>
                    <a onClick={() => this.onClick(rowData, 'prepaid')}>预付货款</a>
                    <a onClick={() => this.onClick(rowData, 'payRecord')}>支付记录</a>
                    <a onClick={() => this.settlement(contractno.toString(),contract,contractType)} return false>申请结算</a>
                  </div>
                  <div style={{display:'flex',marginTop:10}}>
                    <a onClick={() => this.onClick(rowData, 'download')}>合同下载</a>
                    <a return false>&nbsp;</a>
                    <a return false>&nbsp;</a>
                    <a return false>&nbsp;</a>
                  </div>
                </div>
              ]
              :tabKeys==='4'?[
                <div style={{display:'flex',flexDirection:'column'}}>
                  <div style={{display:'flex'}}>
                    {/* <a onClick={() => this.onClick(rowData, 'view')}>文本合同</a> */}
                    <a onClick={() => this.onClick(rowData, 'payRecord')}>支付记录</a>
                    <a onClick={() => this.settlementRecord(contractno.toString(),contract,contractType)}>查看结算单</a>
                    {/* <a onClick={() => this.onClick(rowData, 'download')}>合同下载</a> */}
                  </div>
                </div>
                ] :
                // tabKeys==='5'?[
                //   <div style={{display:'flex',flexDirection:'column'}}>
                //     <div style={{display:'flex'}}>
                //       <a onClick={() => this.onClick(rowData, 'view')}>文本合同</a>
                //       <a onClick={() => this.onClick(rowData, 'payRecord')}>支付记录</a>
                //       <a onClick={() => this.settlementRecord(contractno,contract,contractType)}>查看结算单</a>
                //       <a onClick={() => this.billingrecord(contractno,contract)} return false>开票记录</a>
                //     </div>
                //     <div style={{display:'flex',marginTop:10}}>
                //       <a onClick={() => this.onClick(rowData, 'download')}>合同下载</a>
                //     </div>
                //   </div>
                //   ]:
              [<a onClick={() => this.onClick(rowData, 'view')}>查看文本合同</a>,
                <a onClick={() => this.onClick(rowData, 'detail')}>查看签署状态</a>,
                <a onClick={() => this.onClick(rowData, 'download')}>合同下载</a>,
              ]
              : [
                <a onClick={() => this.onClick(rowData, 'initiate')}>发起合同</a>,
                <a onClick={() => this.onClick(rowData, 'delete')}>删除合同</a>,
              ]
            }
          >
            <List.Item extra={rowData.factoryName}>所属机构
            </List.Item>
            <List.Item extra={contractType === 1 ? '零售合同' : contractType === 2 ? '返利合同' :contractType===3?'优惠合同':contractType === 4 ?'协商合同':contractType === 7 ?'秒杀合同':'竞价合同'}>合同类型</List.Item>
            <List.Item extra={contractType===7||contractType===8?rowData.goodsNameStr:name}>物资</List.Item>
            <List.Item extra={`${rowData.totalPrice}元`}>合同金额</List.Item>
            {/* <List.Item extra="i.text">预付金额累计(元)</List.Item> */}
            {rowData.contractStatus ===11 && rowData.partyBStatus ===4 || rowData.endTime===''?'':<List.Item extra={rowData.endTime}>合同结束日期</List.Item>}
            {rowData.contractStatus === 2 && rowData.partyBStatus === 2 && (
              rowData.autoCancelTime && <List.Item extra={<Text type="danger">{func.countdown(rowData.autoCancelTime,'0 天 0 时 0 分 0 秒')}</Text>}>合同时效</List.Item>
            )}
            {/* <List.Item extra={<Tag color={rowData.isPush === 0?'gold':rowData.isPush === 1?'green':"red"}>{rowData.isPush === 0?'未推送':rowData.isPush === 1?'推送成功':"推送失败"}</Tag>}>推送状态</List.Item> */}
          </Card>
        </div>
      );
    };
    const separator = (sectionID, rowID) => <div key={`${sectionID}-${rowID}`} style={{ backgroundColor: '#F5F5F9', height: 8, }} />;
    const tabs = [{ title: '全部', key: '0' }, { title: '待我签署', key: '1' }, { title: '待企业审核', key: '2' }, { title: '执行中', key: '3', },{title: '已结算',key:'4'},];
    let tabsName = '';
    tabs.map(item => {
      if (tabKeys === item.key) tabsName = item.title;
      return true
    });
    const listView = loading ? <InTheLoad /> : (
      _cachedRowCount !== 0 ? (
        <ListView
          ref={el => {
            this.lv = el;
          }}
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
          className="contract-list-view"
        />
      ) : <EmptyData text={`暂无${tabsName}记录`} />
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={routerUrl}
        >在线合同
        </NavBar>
        <div className='am-list contract'>
          {
            list.length !== 0 ? (
              <div>
                <Tabs
                  tabs={tabs}
                  onChange={(tab, index) => this.changeTab(tab, index)}
                  swipeable={false}
                  activity={tabKeys}
                  page={tabKeys}
                  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}
                >
                  {
                    tabs.map(item => <div key={item.key} style={{ padding: 10 }}>{tabKeys === item.key && listView}</div>)
                  }
                </Tabs>
              </div>
            ) : <Empty
              style={{ marginTop: '30%' }}
              description={<Text>暂无合同<br />快去商城下单签署你的第一份合同吧~</Text>}
            />
          }
        </div>
      </div>
    );
  }
}

export default Contract;
