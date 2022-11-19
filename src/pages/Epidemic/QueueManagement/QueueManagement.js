import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar, Toast,  } from 'antd-mobile';
import { Form, Icon, Card, Tag } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import Text from 'antd/es/typography/Text';
import Func from '@/utils/Func';
import { SHOPPING_MALL_GOODPAGE } from '@/actions/shoppingMall';
import { clientId } from '@/defaultSettings';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ merDriver }) => ({
  merDriver,
}))
@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class QueueManagement extends PureComponent {

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
      cancelValue: 1,
      cancelData: {},
      merDriverdetail: {},
      rowData: {},
      rowDataOne: {},
      load: localStorage.getItem('load'),
      checked: false,
      order: false,
      confirmLoading:false,
      rateallstate:false,
      tabKey: '1'
    };
  }

  componentWillMount() {
    this.getData(false, {});
    const { merDriver: { detail, }, } = this.props;
    this.setState({
      // eslint-disable-next-line react/no-unused-state
      merDriverdetail: detail,
    });
  }

  componentWillUnmount() {
    localStorage.removeItem('load');
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

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  // 取消
  cancel = (e, rowData) => {
    e.stopPropagation();
    this.setState({
      cancelData: rowData,
    });
  };

  change=(e)=>{
    e.stopPropagation();
    Toast.show('点击了修改设置')
  }

  toView = (rowData) => {
    if (clientId === 'kspt_driver'){
      router.push('/epidemic/freightyard')
    }else {
      router.push('/epidemic/queuematerial')
    }
  };

  /* 关闭弹窗 */
  hideModal = () => {
    this.setState({
      order: false,
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
    const { dataSource, isLoading, refreshing, } = this.state;
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
      return (
        <Card key={rowID} style={{padding:'7px 0'}} bodyStyle={{display:'flex'}} bordered={false} onClick={() => this.toView(rowData)}>
          <div style={{ width:'40%'}}>
            <img src="http://test.minio.dachebenteng.com:80/077778-kspt-driver/upload/20211007/c994006cad46e98e6e252dd1f7ed81ad." alt="avatar" style={{ width: '90%', height: '100px',borderRadius:5 }} />
          </div>
          <div style={{ width:'60%',height:100,display: 'flex',flexDirection: 'column',justifyContent: 'space-between'}}>
            <h3 style={{marginBottom:0}}>丹蒙得湾图沟煤矿</h3>
            <div><Tag color="blue" style={{lineHeight:'1.5'}}>智能排队</Tag><Tag color="green" style={{lineHeight:'1.5'}}>防疫申报</Tag></div>
            <div>正在排队<Text style={{color: '#1677ff'}}>10</Text>辆</div>
            <div>
              <Text type="secondary">地址:{rowData.shipAddressName}{rowData.shipFullAddress}</Text>
            </div>
          </div>
        </Card>
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

    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite');
    return (
      <div>
        {
          ifFromOtherSite === 'ok' ? undefined :
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/function')}
          >排号管理
          </NavBar>
        }
        {/* <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}> */}
        <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
          {listView}
        </div>
      </div>
    );
  }
}

export default QueueManagement;
