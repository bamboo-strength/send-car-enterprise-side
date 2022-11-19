import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import { List, ListView, NavBar, PullToRefresh } from 'antd-mobile';
import '../ShopCenter.less';
import { contractPage } from '@/services/contract';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';

class PaymentRecord extends PureComponent {

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
      totalPrice:0,
      loading:true
    };
  }

  componentDidMount() {
    this.getData(false, {});
  }

  /* 请求列表数据 */
  getData = (ref, param)=>{
    const {pageNo, pageSize, realdata} = this.state
    const {location:{state:{item,item:{totalPrice}}}} = this.props
    const params = param
    params.current = pageNo
    params.size = pageSize
    contractPage({ ...params,contractno:item.contractNo, }).then(resp=>{
      this.setState({
        loading:false
      })
      const {dataSource} = this.state
      if (resp.success){
        const billList = resp.data.records;
        const len = billList.length;
        const totalPrices = totalPrice - billList[len - 1].paymentTotalAmount
        billList.splice(billList.findIndex(item => item.id === -1),1) // 删除返回id为-1数据
        if (len <= 0) {
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
            totalPrice:totalPrices
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
            totalPrice:totalPrices
          });
        } else { // 上拉加载
          const dataArr = realdata.concat(billList);
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(dataArr),
            refreshing: false,
            isLoading: false,
            realdata: dataArr,
            totalPrice:totalPrices
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

  render() {
    const {location:{state:{item:{contractGoodsEntityList,contractNo,factoryName,contractType,goodsNameStr}}}} = this.props
    const { dataSource, refreshing, isLoading,totalPrice,loading } = this.state;

    /* 展示出这个合同下，所有订单的物资名称 */
    let name = '';
    contractGoodsEntityList.map((items, index) => {
      const {goodsEntity} = items
      if (index === contractGoodsEntityList.length - 1) {
        name += `${goodsEntity.name}`;
      } else {
        name += `${goodsEntity.name}、`;
      }
      return name;
    });
    const contractmsg = (
      <div>
        <Card title={<div>合同号：{contractNo}</div>} bordered={false}>
          <List.Item extra={factoryName}>所属机构</List.Item>
          <List.Item extra={contractType===7||contractType===8?goodsNameStr:name}>物资</List.Item>
          <List.Item extra={totalPrice.toFixed(2)}>合同待付金额（元）</List.Item>
        </Card>
      </div>
    )

    const row = (rowData, sectionID, rowID) => {
      const {orderNo,paymentAmount,paymentStatusName,paymentTime} = rowData
      return (
        <div key={rowID}>
          <Card bordered={false}>
            <List.Item extra={orderNo}>交易订单号：</List.Item>
            <List.Item extra={Number(paymentAmount).toFixed(2)}>支付金额(元)
            </List.Item>
            <List.Item extra={paymentStatusName}>支付状态</List.Item>
            <List.Item extra={paymentTime}>支付时间</List.Item>
          </Card>
        </div>
      );
    };
    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />);
    const {_cachedRowCount} = dataSource
    const height = 'calc( 100vh - 300px)'
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >支付记录
        </NavBar>
        <div className='am-list contract' style={{padding:12}}>
          {contractmsg}
          {
            loading? <InTheLoad height={height} />:(
              _cachedRowCount !== 0?(
                <ListView
                  ref={el => {
                    this.lv = el;
                  }}
                  dataSource={dataSource}
                  renderHeader={()=>'支付记录'}
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
              ):<EmptyData text="暂无支付记录" height={height} />
            )
           }
        </div>
      </div>
    );
  }
}

export default PaymentRecord;
