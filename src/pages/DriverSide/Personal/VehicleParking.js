import { ListView, Toast, PullToRefresh, Button, NavBar, Card, Tabs, SearchBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon } from 'antd';
import { vehicleParking } from '../../../services/merVehicle';
import func from '@/utils/Func';
import { requestListApi } from '../../../services/api';


@connect(({ merVehicle, loading }) => ({
  merVehicle,
  submitting: loading.effects['/driverSide/personal/myCars'],
}))
@Form.create()
class VehicleParking extends React.Component {

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
      path: '/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/queryshipper',
      truckno: undefined,
      tenantName: undefined,
    };
  }

  componentWillMount() {
    this.getData(false, {});

  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata, truckno, path, tenantName } = this.state;
      func.addQuery(param, 'tenantName', '_like');
      func.addQuery(param, 'truckno', '_like');
      param.current = pageNo;
      param.size = pageSize;
      param.truckno = func.isEmpty(truckno) ? undefined : truckno;
      param.tenantName = func.isEmpty(tenantName) ? undefined : tenantName;
      requestListApi(path, param).then(resp => {
        console.log(resp);
        const tempdata = resp.data.records;
        const len = tempdata.length;
        if (len <= 0) {
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
          });
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

  query = (flag, param) => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
        ...param,
      };

      this.getData(flag, values);
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
      this.getData(false, {});
    });
  };


  queryTeantName = (no) => {
    // console.log(no,'----------车号')
    this.setState({
      tenantName: no,
    }, () => {
      this.getData(true, {});
    });
  };


  queryTruckno = (no) => {
    const {
      location,
    } = this.props;
    this.setState({
      truckno: no,
    }, () => {
      this.getData(true, {truckId:location.state.truckId});
    });
  };


  changeTab = (tab, index) => {
    const {
      location,
    } = this.props;
    let path = '';
    if (index === 0) {
      path = '/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/queryshipper';
      this.setState({
        path,
      }, () => {
        this.query(true, {});
      });
    } else {
       path=`/api/mer-driver-vehicle/vehicleRelationInformationMaintenance/page`
       this.setState({
        path,
      }, () => {
        this.query(true, {truckId:location.state.truckId});
      });
    }

  };

  operate = (id, tenantIds) => {
    vehicleParking({ truckId: id, tenantId: tenantIds }).then(resp => {
      if (resp.success) {
        Toast.info(resp.msg);
      }
    });
  };


  render() {

    const { dataSource, isLoading, refreshing } = this.state;

    const {
      location,
    } = this.props;

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


      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 企业名称：{rowData.tenantName}</div>
              <div><Button type="primary" size='small' inline style={{ float: 'right', marginRight: '10px' }}
                           onClick={() => this.operate(location.state.truckId, rowData.tenantId)}>
                申请入驻</Button></div>
            </Card.Body>
            <Card.Footer
            />
          </Card>
        </div>
      );
    };

    const listView = (
      <ListView
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
        pullToRefresh={<PullToRefresh
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );

    const separators = (sectionID, rowID) => (
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
    const rows = (rowData, sectionID, rowID) => {


      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 车号：{rowData.truckno}</div>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 企业名称：{rowData.relationTenantName}</div>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 车辆类型：{rowData.trucktypeName}</div>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 入驻状态：{rowData.auditFlagName}</div>
              <div><Icon type="user" theme="twoTone" twoToneColor="#eb2f96"
                         style={{ fontSize: '18px' }}/> 审核人：{rowData.auditUserName}</div>
            </Card.Body>
            <Card.Footer
            />
          </Card>
        </div>
      );
    };


    const listViews = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (
          <div style={{ padding: 30, textAlign: 'center' }}>
            {isLoading ? '加载中...' : '加载完毕'}
          </div>)}
        renderRow={rows}
        renderSeparator={separators}
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
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/myCars')}
        >车辆入驻
        </NavBar>
        <div className='am-list'>
          <Tabs
            tabs={[
              { title: '未入驻' },
              { title: '已入驻' },
            ]}
            initialPage={0}
            onChange={(tab, index) => this.changeTab(tab, index)}
          >
            <div>
              <SearchBar
                maxLength={8}
                placeholder="请输入企业名称查询"
                onChange={(e) => this.queryTeantName(e)}
                onCancel={() => this.queryTeantName()}
              />
              {listView}
            </div>

            <div>
              <SearchBar
                maxLength={8}
                placeholder="请输入车号查询"
                onChange={(e) => this.queryTruckno(e)}
                onCancel={() => this.queryTruckno()}
              />
              {listViews}
            </div>
          </Tabs>
        </div>
      </div>

    );
  }
}

export default VehicleParking;
