import { ListView, List, InputItem, Toast, PullToRefresh, Button, Modal, NavBar, Card, SwipeAction } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon } from 'antd';
import { requestApi } from '../../../services/api';
import { WAYBILL_LIST } from '../../../actions/waybill';
import MatrixSSQ from '../../../components/Matrix/MatrixSSQ';
import func from '@/utils/Func';

const { Item } = List;

@connect(({ waybill, loading }) => ({
  waybill,
  loading: loading.models.waybill,
}))
@Form.create()
class FindGoods extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      showSearchModal: false,
      showScroll: true,
    };
  }

  componentWillMount() {
    this.getData(false, {});
  }

  getData(ref, param) {
    const { dispatch } = this.props;
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    dispatch(WAYBILL_LIST(param)).then(() => {
      //  console.log(this.props)
      const { waybill: { data } } = this.props;
      const tempdata = data.list;
      const len = tempdata.length;
      if (len <= 0) { // 判断是否已经没有数据了
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
        //  Toast.info('没有多余的数据', 1)
        //   return false
      }
      if (ref) {
        // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        });
      } else {
        // 上拉加载
        const dataArr = realdata.concat(tempdata);
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr, // 保存新数据进state
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

  onEndReached = (event) => {
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
    // console.log('00000000000000000')
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      param.shippingAddress = fieldsValue.shippingAddresscity,
        param.receiveAddress = fieldsValue.receiveAddresscity;
      this.getData(flag, param);
      // this.onClose()
    });
  };

  orderGrabbing = (id, tenantId) => {
    router.push(
      {
        pathname: `/driverSide/driverDispatch/orderGrabbing/${id}`,
        state: {
          backUrl: '/driverSide/wayBill/findGoods',
          wayBillId: id,
          tenantId,
        },
      },
    );
  };

  viewDetail = (id) => {
    router.push(
      {
        pathname: `/driverSide/wayBill/wayBillDetail/${id}`,
        state: {
          backUrl: '/driverSide/wayBill/findGoods',
        },
      },
    );
  };

  changeshowScroll = (e) => {
    // console.log(e)
    if (e === true) {
      // 展开
      this.setState({
        showScroll: false,
      });
    } else if (e === false) {
      // 关闭
      this.setState({
        showScroll: true,
      });
    }
  };

  render() {
    const { dataSource, isLoading, refreshing, showSearchModal, showScroll } = this.state;

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
    const row = (rowData, sectionID, rowID) => {
      const aa = (
        <div>
          <div>物资：{func.notEmpty(rowData.materialnoName) ? rowData.materialnoName : rowData.materialnosName}</div>
          <div>运费：{rowData.freight} 元/吨</div>
          <div>剩余车数：{rowData.remainNumber}</div>
          <div>发货开始日期：{rowData.begintime}</div>
          {/*  <div>里程：{rowData.}</div> */}
        </div>
      );
      return (
        <div key={rowID}>
          <Card>
            <Card.Body>
              <a onClick={() => this.viewDetail(rowData.id)} style={{ color: 'black' }}>
                <div> 发货方：{rowData.shipperName}</div>
                <div><Icon type="environment" theme="twoTone" twoToneColor="#eb2f96"
                           style={{ fontSize: '18px' }}/> 发货地址：{rowData.shippingAddressName}</div>
                <div><Icon type="environment" theme="twoTone"
                           style={{ fontSize: '18px' }}/> 收货地址：{rowData.receiveAddressName}</div>
              </a>
              <Button type="primary" size='small' inline style={{ float: 'right' }}
                      onClick={() => this.orderGrabbing(rowData.id, rowData.tenantId)}>抢单</Button>
            </Card.Body>
            <Card.Footer
              content={aa}
            />
          </Card>
        </div>
      );
    };

    const serarchForm = () => {
      const { form } = this.props;
      return (
        <List className='static-list'>
          <Item>
            <MatrixSSQ
              label="发货地"
              id="shippingAddress"
              //  required
              placeholde=""
              onChange={() => this.query(true, {})}
              form={form}
              onPopupVisibleChange={(e) => {
                this.changeshowScroll(e);
              }}
            />
          </Item>
          <Item>
            <MatrixSSQ
              label="收货地"
              id="receiveAddress"
              //  required
              placeholde=""
              onChange={() => this.query(true, {})}
              form={form}
              onPopupVisibleChange={(e) => {
                this.changeshowScroll(e);
              }}
            />
          </Item>

        </List>
      );
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/dashboard/function')}
          /* rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
          ]} */
        >找货
        </NavBar>
        <div className='am-list'>
          {serarchForm()}
          {showScroll ?
            <ListView
              ref={el => this.lv = el}
              dataSource={dataSource}
              // renderHeader={serarchForm}
              renderFooter={() => (
                <div style={{ padding: 30, textAlign: 'center' }}>
                  {isLoading ? '加载中...' : '加载完毕'}
                </div>)}
              renderRow={row}
              renderSeparator={separator}
              pageSize={4}
              useBodyScroll
              pullToRefresh={<PullToRefresh
                refreshing={refreshing}
                onRefresh={this.onRefresh}
              />}
              scrollRenderAheadDistance={500}
              onEndReached={() => this.onEndReached}
              onEndReachedThreshold={10}
            /> : <ListView
              ref={el => this.lv = el}
              dataSource={dataSource}
              renderFooter={() => (
                <div style={{ padding: 30, textAlign: 'center' }}>
                  {isLoading ? '加载中...' : '加载完毕'}
                </div>)}
              renderRow={row}
              renderSeparator={separator}
              pageSize={4}
              useBodyScroll
              scrollRenderAheadDistance={500}
              onEndReached={() => this.onEndReached}
              onEndReachedThreshold={10}
            />}
        </div>
      </div>
    );
  }
}

export default FindGoods;
