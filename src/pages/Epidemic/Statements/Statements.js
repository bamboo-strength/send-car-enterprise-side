import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { router } from 'umi';
import { NavBar, ListView, PullToRefresh } from 'antd-mobile';
import { page } from '@/services/epidemic';
import { IconAlipay, IconWXpay, } from '@/components/Matrix/image';
import Func from '@/utils/Func';

class Statements extends PureComponent {
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
    };
  }

  componentDidMount() {
    this.getData(false, {});
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata, } = this.state;
    const params = {
      ...param,
      current: pageNo, size: pageSize,
    };
    page(params).then(item=>{
      if (item.success){
        const tempdata = typeof item.data === 'string' ? (Func.notEmpty(item.data) ? JSON.parse(item.data) : []) : (Func.notEmpty(item.data.records) ? item.data.records : []);
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


  render() {
    const { refreshing, dataSource, isLoading, } = this.state;

    const display = {display:'flex'}
    const justifyContent = {justifyContent: 'space-between'}
    const row = (rowData, sectionID, rowID) => {
      return (
        <div style={{ padding: '0 15px',background: 'white',marginBottom: 8 }} key={rowID} onClick={()=>router.push(`/epidemic/statementsview/${rowData.id}`)}>
          <div style={{ ...display, padding: '15px 0' }}>
            <img style={{ height: 32, marginRight: '15px' }} src={rowData.comeFrom === 0?IconWXpay:IconAlipay} alt="" />
            <div style={{ flex: 1}}>
              <div style={{ fontWeight: 'bold',...display,...justifyContent }}>
                <span>{rowData.comeFrom === 0?'微信':'支付宝'}支付</span><span>{rowData.totalFee}元</span>
              </div>
              <div>{rowData.orderName}</div>
              <div>{rowData.timeEnd}</div>
            </div>
          </div>
        </div>
      )
    }
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
        }}
      />
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/dashboard/function`);}}
        >账单
        </NavBar>
        <div className='am-list'>
          <ListView
            ref={el => {
              this.lv = el;
            }}
            renderSeparator={separator}
            dataSource={dataSource}
            renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
            renderRow={row}
            className='shop-listView'
            pageSize={4}
            useBodyScroll
            pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </div>
      </div>
    );
  }
}

export default Statements;
