import { ListView, ActionSheet, Toast, PullToRefresh, Button, Modal, NavBar, Card, SearchBar } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon } from 'antd';
import { SMFYMERVEHIVL_LIST } from '@/actions/merVehicle';
import { requestApi } from '@/services/api';
import { getCurrentUser } from '@/utils/authority';
import func from '@/utils/Func';

const { alert } = Modal;

@connect(({ merVehicle, loading }) => ({
  merVehicle,
  loading: loading.models.merVehicle,
}))
@Form.create()
class SmfyCarsList extends React.Component {
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
      vehicleNo: undefined,
    };
  }

  componentWillMount() {
    this.getData(false, {});
  }

  getData(ref, param) {
    const user = getCurrentUser();
    const { dispatch } = this.props;
    const { pageNo, pageSize, dataSource, realdata, vehicleNo } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    param.truckno = func.isEmpty(vehicleNo) ? undefined : vehicleNo;
    dispatch(SMFYMERVEHIVL_LIST(param)).then(() => {
      // console.log(this.props)
      const { merVehicle: { data } } = this.props;
      const tempdata = data.list;
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
      this.getData(true, {});
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

  queryVehByNo = (no) => {
    // console.log(no,'----------车号')
    this.setState({
      vehicleNo: no,
    }, () => {
      this.getData(true, {});
    });
  };

  showOper = (vehicle, truckno) => {
    const {id,auditStatus} = vehicle
    // let BUTTONS = ['分配司机', '入驻发货方', '删除','取消'];
    let BUTTONS = ['删除','取消'];

    if(auditStatus !== 1){
      // BUTTONS = ['分配司机', '入驻发货方', '删除','修改','取消'];
      BUTTONS = ['删除','修改','取消'];

    }
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        message: truckno,
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps: {
          onTouchStart: e => e.preventDefault(),
        },
      },
      (buttonIndex) => {
      console.log(buttonIndex)
        if (buttonIndex === 0) {  // 删除
          alert('删除', '确定删除?', [
            { text: '取消', style: 'default' },
            {
              text: '确定', onPress: () => {
                requestApi('/api/mer-driver-vehicle/vehicleInformationMaintenance/remove', { ids: id }).then(resp => {
                  if (resp.success) {
                    Toast.success(resp.msg);
                    this.getData(true, {});
                  }
                });
              },
            },
          ]);
        }
        if ( auditStatus !== 1 && buttonIndex === 1) {  // 修改
          router.push(
            {
              pathname: `/smfy/smfyCarAdd/`,
              state: { truckId: id },
            },
          );
        }
      });
  };




  render() {
    const { dataSource, isLoading, refreshing, showSearchModal } = this.state;

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
          <div>添加时间：{rowData.createTime}</div>
        </div>
      );
      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <div><Icon type="car" theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;车号：{rowData.truckno}</div>
              <div><Icon type="smile" theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;司机：{rowData.drivername}</div>
              <div>车辆状态：{rowData.auditStatusName} </div>
              <div>&nbsp;&nbsp;&nbsp;&nbsp;净重：{rowData.netWeight} 吨</div>
              <Button type="primary" size='small' inline style={{ float: 'right' }} onClick={() => this.showOper(rowData, rowData.truckno)}>操作</Button>
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
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
          rightContent={[
            <a onClick={() => router.push('/driverSide/personal/carCertification')}>车辆认证</a>,
          ]}
        >我的车辆
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={8}
            placeholder="请输入车牌号查询"
            onChange={(e) => this.queryVehByNo(e)}
            onCancel={() => this.queryVehByNo()}
          />
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
            className="am-list"
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

export default SmfyCarsList;
