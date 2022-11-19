import { ListView, PullToRefresh, NavBar, Card, Button, Toast, List, Modal } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import func from '@/utils/Func';
import { Col, Form, Icon } from 'antd';
import { ConfirmShipper, list } from '../../../services/defaultShippers';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { getCurrentUser } from '../../../utils/authority';


const { Item } = List;

@connect(({ defaultShippers, loading }) => ({
  defaultShippers,
  loading: loading.models.defaultShippers,
}))
@Form.create()
class DefaultShippersList extends React.Component {
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
    };
  }

  componentWillMount() {
    this.getData(false, {});
  }

  getData(ref, param) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    param.current = pageNo;
    param.size = pageSize;
    if (func.isEmpty(param.tenantName)) {
      param.tenantName = '';
    } else {
      param.tenantName;
    }
    list(param).then(resp => {
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

  operate = (id) => {
    const { dispatch } = this.props;
    ConfirmShipper({ relationTenant: id }).then(resp => {
      if (resp.success) {
        Toast.success('修改成功！', 1, () => {
          let tenant = '';
          if (getCurrentUser() !== null && getCurrentUser().tenantId !== undefined && getCurrentUser().tenantId !== 'undefined' && getCurrentUser().tenantId !== null) {
            tenant = getCurrentUser().tenantId;
          }
          dispatch({
            type: 'login/logout',
            payload: tenant,
          });
        });

      }
    });
  };

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal: true,
    });
  };

  onClose = () => {
    this.setState({
      showSearchModal: false,
    });
  };

  query = (flag, param) => {
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param,
      };
      this.getData(flag, values);
      console.log(values, '999999999999');
      this.onClose();
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
      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <div><Icon type="car" theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;发货方：{rowData.tenantName}</div>
              <div>
                <Button
                  type="primary"
                  size='small'
                  inline
                  style={{ float: 'right', marginRight: '10px' }}
                  onClick={() => this.operate(rowData.tenantId)}
                >
                  确认
                </Button>
              </div>
            </Card.Body>
          </Card>
        </div>
      );
    };

    const serarchForm = () => {
      const { form } = this.props;
      return (
        <List className='static-list'>
          <Col span={24} className='add-config'>
            <Item>
              <MatrixInput label="发货方" placeholder="请输入发货方" id="tenantName" form={form} />
            </Item>
          </Col>
        </List>
      );
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
          rightContent={[
            <Icon
              key="0"
              type="search"
              style={{ fontSize: '24px', marginRight: '20px' }}
              onClick={() => this.showSearch()}
            />,
          ]}
        >默认发货方
        </NavBar>
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() => this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {serarchForm()}
          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button
              type="primary"
              size='small'
              inline
              onClick={() => this.query(1)}
              style={{ marginLeft: '8px' }}
            >查询
            </Button>
            <Button
              type="primary"
              size='small'
              inline
              onClick={() => this.reset()}
              style={{ marginLeft: '15px' }}
            >重置
            </Button>
          </div>
        </Modal>
        <ListView
          ref={el => this.lv = el}
          dataSource={dataSource}
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
    );
  }
}

export default DefaultShippersList;
