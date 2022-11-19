import React, { Component } from 'react';
import { Card, Icon } from 'antd';
import { List, ListView, NavBar, PullToRefresh } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import { payPage } from '@/services/commonBusiness';

class PaidGoods extends Component {
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
    };
  }

  componentDidMount() {
    this.getData(false);
  }

  /* 请求列表数据 */
  getData = (ref)=>{
    const { pageNo, pageSize, realdata, dataSource } = this.state;
    const params = {
      current: pageNo, size: pageSize
    };
    payPage(params).then(resp=>{
      this.setState({
        loading:false
      })
      if (resp.success){
        const billList = resp.data.records;
        const len = billList.length;
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
            dataSource: dataSource.cloneWithRows(billList),
            hasMore: true,
            refreshing: false,
            isLoading: false,
            realdata: billList,
          });
        } else { // 上拉加载
          const dataArr = realdata.concat(billList);
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
      this.getData(true);
    });
  };

  // 上拉加载
  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.getData(false);
    });
  };

  render() {
    const { dataSource, isLoading, refreshing, loading } = this.state;
    const { _cachedRowCount } = dataSource;
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );
    const row = (item, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <Card
            title={`派车单号：${item.weightno}`}
            extra={<Text type="danger">{item.paymentStatusName}</Text>}
            bordered={false}
          >
            <List.Item extra={item.deptIdName}>所属机构</List.Item>
            <List.Item extra={item.materialno}>物资</List.Item>
            <List.Item extra={item.unitPrice}>单价(元/吨)</List.Item>
            <List.Item extra={item.netWeight}>净重(吨)</List.Item>
            <List.Item extra={item.loadingTime}>重车时间</List.Item>
            <List.Item extra={item.unitPrice*item.netWeight}>总金额(元)</List.Item>
            <List.Item extra={item.paymentTime}>支付时间</List.Item>
          </Card>
        </div>
      );
    };
    const height = 'calc( 100vh - 200px)'
    const listView = loading ? <InTheLoad height={height} /> : (
      _cachedRowCount !== 0 ? (
        <ListView
          ref={el => {
            this.lv = el;
          }}
          dataSource={dataSource}
          pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
          renderFooter={() => (
            <div style={{ padding: 30, textAlign: 'center' }}>
              {isLoading ? '加载中' : '加载完毕'}
            </div>)}
          renderRow={row}
          useBodyScroll
          renderSeparator={separator}
          style={{ overflow: 'auto', }}
          distanceToRefresh='20'
          pageSize={5}
          scrollRenderAheadDistance={500}
          onEndReached={this.onEndReached}
          onEndReachedThreshold={30}
        />
      ) : <EmptyData text="暂无支付记录" height={height} />
    );


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >支付明细查询
        </NavBar>
        <div className='am-list'>
          {listView}
        </div>
      </div>
    );
  }
}

export default PaidGoods;
