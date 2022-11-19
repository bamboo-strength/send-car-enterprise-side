import {
  ListView,
  List,
  InputItem,
  Toast,
  PullToRefresh,
  Button,
  Modal,
  NavBar,
  Card,
  SwipeAction,
  WhiteSpace,
} from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon } from 'antd';
import { runOftenGoodsPage } from '../../../services/waybill';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import func from '@/utils/Func';
import { regularrouteList } from '../../../services/merDriver';
import { getCurrentUser } from '@/utils/authority';

const { Item } = List;

@connect(({ waybill, loading }) => ({
  waybill,
  loading: loading.models.waybill,
}))
@Form.create()
class RunOftenGoodsPage extends React.Component {
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
      lines: [],
    };
  }

  componentWillMount() {
    const { location } = this.props;
    if (func.notEmpty(location.state) && func.notEmpty(location.state.TenantId)) {
      this.query(false, { tenantId: location.state.TenantId });
    } else {
      this.query(false, {});
    }

  }

  componentDidMount() {
    const ll = [];
    regularrouteList({ userId: getCurrentUser().userId }).then(resp => {
      if (resp.success) {
        (resp.data || []).forEach(item => {
          ll.push({
            key: `${item.departRegionId}-${item.destinationRegionId}`,
            value: `${item.departRegionName}-${item.destinationRegionName}`,
          });
        });
        this.setState({
          lines: ll,
        });
      }
    });
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    runOftenGoodsPage(param).then(resp => {
      const tempdata = resp.data.records;
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
        //  Toast.info('没有多余的数据', 1)
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        });
      } else {
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
    const { form } = this.props;
    setTimeout(() => {
      form.validateFields(async (err, fieldsValue) => {
        if (err) {
          return;
        }
        const ll = func.notEmpty(fieldsValue.line) ? fieldsValue.line.split('-') : [];
        console.log(ll, ll[0], ll[0] ? ll[0] : '');
        param.departRegionId = ll[0] ? ll[0] : null;
        param.destinationRegionId = ll[1] ? ll[1] : null;
        this.getData(flag, param);
        //  this.onClose()
      });
    }, 0);
  };

  orderGrabbing = (id) => {
    router.push(
      {
        pathname: `/driverSide/driverDispatch/orderGrabbing/${id}`,
        state: {
          backUrl: '/driverSide/driverDispatch/runOftenGoodsPage',
          wayBillId: id,
        },
      });
  };

  viewDetail = (id) => {
    router.push(
      {
        pathname: `/driverSide/wayBill/wayBillDetail/${id}`,
        state: {
          backUrl: '/driverSide/driverDispatch/runOftenGoodsPage',
        },
      },
    );
  };


  render() {
    const { dataSource, isLoading, refreshing, showSearchModal, lines } = this.state;
    const { location, form } = this.props;
    let navName = '常跑货源';
    if (func.notEmpty(location.state) && func.notEmpty(location.state.TenantId)) {
      navName = '货主货源';
    }

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
          <div>物资：{rowData.materialnoName}</div>
          <div>运费：{rowData.freight} 元/吨</div>
          <div>剩余量：{rowData.remainNumber}</div>
          <div>发货开始日期：{rowData.begintime}</div>
          <div>里程：{rowData.packagingName}</div>
        </div>
      );
      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <a onClick={() => this.viewDetail(rowData.id)} style={{ color: 'black' }}>
                <div> 派单公司：{rowData.tenantIdName}</div>
                <div><Icon type="environment" theme="twoTone" twoToneColor="#eb2f96"
                           style={{ fontSize: '18px' }}/> 发货地址：{rowData.shippingAddressName}</div>
                <div><Icon type="environment" theme="twoTone"
                           style={{ fontSize: '18px' }}/> 收货地址：{rowData.receiveAddressName}</div>
              </a>
              <Button type="primary" size='small' inline style={{ float: 'right' }}
                      onClick={() => this.orderGrabbing(rowData.id)}>抢单</Button>
            </Card.Body>
            <Card.Footer
              content={aa}
            />
          </Card>
        </div>
      );
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push(location.state ? location.state.backUrl : '/dashboard/function')}
          /* rightContent={[
             <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
             <Icon key="1" type="ellipsis" />,
           ]} */
        >{navName}
        </NavBar>
        <div className='am-list'>
          <List className='static-list'>
            <WhiteSpace/>
            <Item>
              {lines.length>0? <MatrixSelect label="路线" placeholder="请选择路线" id="line" xs='4' options={lines} allowClear form={form} onChange={()=>this.query(true,{})} style={{width:'100%'}} />
                :<p style={{color:'red',textAlign:'center'}}>未添加常跑路线</p>}
            </Item>
          </List>

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
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
          />
        </div>
      </div>
    );
  }
}

export default RunOftenGoodsPage;
