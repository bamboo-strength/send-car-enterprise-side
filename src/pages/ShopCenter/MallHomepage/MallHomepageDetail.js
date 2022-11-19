import React, { PureComponent } from 'react';
import { Badge, ListView, NavBar, PullToRefresh } from 'antd-mobile';
import style from '@/pages/ShopCenter/ShopCenter.less';
import { Card, Form, Icon, Modal, Tag, Typography } from 'antd';
import router from 'umi/router';
import { Tabs } from 'antd-mobile/es';
import Text from 'antd/es/typography/Text';
import { img198, img382 } from '@/components/Matrix/image';
import { connect } from 'dva';
import { SHOPPING_MALL_DETAIL, SHOPPING_MALL_GOODPAGE } from '@/actions/shoppingMall';
import '../ShopCenter.less';
import { InTheLoad, PageFault } from '@/components/Stateless/Stateless';
import Func from '@/utils/Func';
// import PageFault from '@/pages/ShopCenter/component/PageFault';
// import Image from '@/pages/ShopCenter/component/Image';
// import { getCurrentUser } from '@/utils/authority';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';

const { Paragraph } = Typography;
const { confirm } = Modal

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class MallHomepageDetail extends PureComponent {

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
      tabKey: localStorage.getItem('CommodityType') === null?'1':localStorage.getItem('CommodityType'),
      details: {},
      loading: false,
      isPageFault:false,
      height: document.documentElement.clientHeight - 45 - 64 - 146,
      viewMore:false
    };
  }

  componentDidMount() {
    this.getData(false, {});
    localStorage.removeItem('CommodityType')
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata, tabKey } = this.state;
    const { dispatch, match: { params: { id } } } = this.props;
    const params = {
      ...param,
      current: pageNo, size: pageSize, type: tabKey,factoryId:id
    };
    Func.addQuery(params, 'factoryId', '_equal');
    Func.addQuery(params, 'type', '_equal');
    /* 请求商品列表数据 */
    dispatch(SHOPPING_MALL_GOODPAGE(params)).then(() => {
      const { shoppingmall: { data:{goodsData,goodsData:{data}} } } = this.props;
      if (goodsData && goodsData.success){
        const tempdata = typeof data === 'string' ? (Func.notEmpty(data) ? JSON.parse(data) : []) : (Func.notEmpty(data.records) ? data.records : []);
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
        /* 厂区详情 */
        dispatch(SHOPPING_MALL_DETAIL( {id})).then(() => {
          const { shoppingmall: { detail:{queryDetail}, } } = this.props;
          if (queryDetail && queryDetail.success) {
            this.setState({
              loading: true,
            });
            this.setState({
              details: queryDetail.data,
            });
          }else {
            this.setState({
              isPageFault:true
            })
          }
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
      tabKey: Number(tab.key),
      dataSource,
      isLoading: true,
    }, () => {
      this.query(true, {});
    });
  };

  viewMore = ()=>{
    this.setState({
      viewMore:true
    })
  }

  handleCancel = ()=>{
    this.setState({
      viewMore:false
    })
  }

  geoMap = ()=>{
    const {details} = this.state
    router.push({
      pathname:`/shopcenter/mallhomepage/geoMap`,
      state:{
        details
      }
    })
  }

  callPhone = (text)=>{
    const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const ifWx = window.__wxjs_environment === 'miniprogram'
    if(u && !ifWx){ // ios环境 非小程序
      const message = {
        'name' : text,
      }
      window.webkit.messageHandlers.callPhoneClick.postMessage(message);
    }else {
      confirm({
        title:'确定要拨打电话？',
        onOk(){
          /* 调用安卓端方法进行拨打电话操作 */
          MakeAPhoneCall.callPhone(text)
        }
      })
    }

  }

  render() {
    const { refreshing, dataSource, isLoading, details, loading,isPageFault,height,viewMore,tabKey} = this.state;
    let tabs = [
      { title: `零售商品（${details.retailNum}）`, key: '1' },
      { title: `返利商品（${details.rebateNum}）`, key: '2' },
    ]
    if (details.discountNum !== 0) tabs.splice(2,0,{ title: `优惠商品（${details.discountNum}）`, key: '3' },)
    if (details.consultNum !== 0) tabs.splice(3,0,{ title: `协商商品（${details.consultNum}）`, key: '4' },)

    const separator = (sectionID, rowID) => <div key={`${sectionID}-${rowID}`} className='separator' />;
    const row = (rowData, sectionID, rowID) => {
      // const unit = rowData.unit === 1 ? '吨' : rowData.unit === 2 ? '车' : rowData.unit === 3 ? '立方' : '件';
      // const num = Number(rowData.price) - Number(rowData.discountPrice)
      const {unitName} = rowData
      const title = (
        <div className='listTie detailTie' style={{display: 'flex',justifyContent: 'space-between'}}>
          <span>{rowData.name}</span>
          {
          <Badge text={rowData.isLimit === 0 ? '限量' : '不限量'} className='badge-mall' />
          }
        </div>
      )
      const list = {
        title,
        image:rowData.imageUrl,
        content:[
          { value:<span style={{ fontWeight: 'normal' }}>已{rowData.type === 3 ? '购' : '售'}{rowData.sales}{unitName}</span>} ,
          { value:(
            <div style={{display: 'flex',justifyContent: 'space-between'}}>
              <Text>型号：<Text>{rowData.model}</Text></Text>
              {
                rowData.isLimit !== 1 ? (
                  <Text>剩余量：<Text>{rowData.totalNum.toFixed(2)}{unitName}</Text></Text>
                ):''
              }
            </div>
            ) },
          {
            value: rowData.type === 3 ?(
              <div className='flexAlignC' style={{justifyContent: 'space-between'}}>
                <Text>
                  市场价：<Text delete>{rowData.price}元/{unitName}</Text>
                </Text>
                {
                  rowData.maxRuleDesc !== '' ? (
                    <Tag color="orange" style={{marginLeft:15,marginRight:0}}>
                      {
                        rowData.maxRuleDesc
                      }
                    </Tag>
                  ) : ''
                }
              </div>
            ):''
          },
        ]
      }
      const aount = <Text type="danger" strong style={{fontSize:18}}>{rowData.type === 3 ? rowData.discountPrice : rowData.price}元/{unitName}</Text>
      let item = {}
      if (rowData.type === 1){
        item =  { label:'单价',value:aount, }
        list.content.push(item)
      }else if (rowData.type !== 1 ) {
        item =  { label:rowData.type === 3 ? '优惠价' : '单价',value:aount, }
        list.content.push(item)
      }
      const activeKeys = Number(tabKey) === 1 ?'retailProduct':Number(tabKey) === 2 ?'rebateProduct':Number(tabKey) === 3?'preferentialProduct':'consulyProduct'
      return (
        <div key={rowID} style={{padding:12}} onClick={() => router.push({pathname: `/shopcenter/goodsdetails/${activeKeys}/${rowData.id}`, state: { type:'factory' },})}>
          <CommodityStyle comlist={list} />
        </div>
      );
    };

    const listView = (
      <ListView
        ref={el => {
          this.lv = el;
        }}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        style={{
          height,
          overflow: 'auto',
        }}
        className='shop-listView'
        pageSize={4}
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />

    );

    const comlist = {
      title:details.deptName,
      image:details.imageUrl,
      content:[
        { value:`${details.province}${details.city}${details.district}${details.factoryAddress}`,img:img198, onClick:this.geoMap,style:{marginBottom:10}} ,
        { value:<a onClick={()=>this.callPhone(details.contactNumber)}>{details.contactNumber}</a>,img:img382 },
      ]
    }

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/shopcenter/mallhomepage')
          }}
          // rightContent={[<Icon key="0" type="search" onClick={() => router.push(`/shopcenter/mallhomepage/search`)} />]}
        >{details.deptName}
        </NavBar>
        {
          loading ? (
            <div className={`${style.shopCenter} am-list mall-tabs`}>
              <Card bodyStyle={{ padding: 0, borderBottom: ' 1px solid #ddd' }} bordered={false} style={{ position: 'absolute',width: '100%'}}>
                <div className='listDiv'>
                  <CommodityStyle comlist={comlist} />
                  <div style={{position: 'relative',marginTop: 15}}>
                    <Paragraph ellipsis style={{width: 'calc( 100% - 30px)',marginBottom:0}}>
                      {details.factoryDescribe}
                    </Paragraph>
                    <a style={{position: 'absolute',right: 0,background: 'white',top: 0}} onClick={this.viewMore}>更多</a>
                  </div>
                </div>
              </Card>
              <Tabs tabs={tabs} initialPage={tabKey}  renderTabBar={props => <Tabs.DefaultTabBar {...props} page={3} />}  onChange={(tab, index) => this.changeTab(tab, index)} className='mall-tabs' swipeable={false}>
                <div key='1'>{listView}</div>
                <div key='2'>{listView}</div>
                {details.discountNum !== 0 ? <div key='3'>{listView}</div> : ''}
                <div key='4'>{listView}</div>
              </Tabs>
            </div>
          ) : isPageFault ? <PageFault />: <InTheLoad />
        }
        <Modal visible={viewMore} title="厂区介绍" footer={null} onCancel={this.handleCancel}>
          {details.factoryDescribe}
        </Modal>
      </div>
    );
  }

}

export default MallHomepageDetail;
