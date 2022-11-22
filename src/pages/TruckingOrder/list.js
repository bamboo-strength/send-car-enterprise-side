import React, { PureComponent } from 'react';
import Text from 'antd/es/typography/Text';
import { Form, Row, Col, Button, Icon, Empty, Card } from 'antd';
import router from 'umi/router';
import { Modal, NavBar, Toast, List, ListView, PullToRefresh } from 'antd-mobile';
import MatrixInput from '@/components/Matrix/MatrixInput';
import styles from './index.less';

@Form.create()
class TruckingOrderList extends PureComponent {
  state = {
    dataSource: new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    }),
    hasMore: true,
    pageNum: 1,
    isLoading: false,
    refreshing: false,
    expand: false,
    truckOrderData: []
  };

  componentWillMount() {
    this.getData();
  }

  // 查询弹出框状态控制
  toggle = () => {
    const { expand } = this.state;
    this.setState({ expand: !expand });
  };

  handleSearch = () => {
    const { form, isLoading } = this.props;
    const values = form.getFieldsValue();
    this.isLoading = false;
  }

  reset = () => {
    const { form } = this.props;
    form.resetFields();
  }

  getData = () => {
    const { pageNum, dataSource, truckOrderData } = this.state;

    const data = truckOrderData.concat([{}, {}, {}]);
    console.log(dataSource.cloneWithRows([{}, {}, {}]));
    this.setState({
      pageNum,
      dataSource: dataSource.cloneWithRows([{}, {}, {}]),
      refreshing: false,
      isLoading: false,
      truckOrderData: data,
    });
  }

  showDetails = (item) => {
    router.push('/truck/details')
  }

  onEndReached = () => {
    console.log(111);
    const { isLoading, hasMore, pageNum } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState(
      {
        isLoading: true,
        pageNum: pageNum + 1,
      },
      () => {
        this.getData();
      }
    );
  };

  render() {
    const { truckOrderData, expand, dataSource, isLoading, refreshing } = this.state;
    const { form } = this.props;

    const row = (rowData, sectionID, rowID) => {
      return (
        <Card
          bordered
          title={<Text style={{fontSize: 14, fontWeight: 'bold', color: '#000'}}><Icon type="container" style={{ paddingRight: 12, color: 'darkorange' }} />合同编号：{rowData.id}</Text>}
          onClick={() => this.showDetails(rowData)}
        >
          <List>
            <List.Item>
              <span>物资：<b>11212121</b></span>
            </List.Item>
            <List.Item>
              <span>客户：11212121</span>
            </List.Item>
            <List.Item>
              <span>预装量：11212121</span>
            </List.Item>
            <List.Item>
              <span>车号：11212121</span>
            </List.Item>
            <List.Item>
              <span>执行方式：11212121</span>
            </List.Item>
            <List.Item>
              <span>执行状态：11212121</span>
            </List.Item>
            <List.Item>
              <span>经销商：11212121</span>
            </List.Item>
          </List>
          <div className={styles.footer}>
            <Button type="primary" ghost>执行</Button>
            <Button type="primary" style={{marginLeft: 12}} ghost>换单</Button>
          </div>
        </Card>
      )
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

    return (
      <div className={styles.truckingOrder}>
        <NavBar
          mode="light"
          style={{ zIndex: 1000 }}
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon
              key="0"
              type="search"
              style={{ fontSize: '18px' }}
              onClick={() => this.toggle()}
            />
          ]}
        >
          <span className={styles.trader}>派车单查询</span>
        </NavBar>
        <div className={styles.content}>
          { truckOrderData.length ?
              (
                <ListView
                  dataSource={dataSource}
                  renderFooter={() => (<div style={{ padding: 20, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
                  renderRow={row}
                  renderSeparator={separator}
                  pageSize={5}
                  useBodyScroll
                  style={{
                    overflow: 'auto'
                  }}
                  onScroll={() => { console.log('scroll'); }}
                  scrollRenderAheadDistance={500}
                  onEndReached={this.onEndReached}
                  onEndReachedThreshold={10}
                />

              )
            : <Empty style={{ padding: 100 }} description="暂无数据" className="list-No-data" />
          }
        </div>
        {
          expand &&
          <Modal
            visible={expand}
            style={{ marginTop: 45 }}
            transparen
            maskClosable
            onClose={() => this.toggle()}
            popup
            animationType='slide-down'
            platform='android'
          >
            <Col span={24} style={{ padding: 12 }}>
              <MatrixInput label='合同编号' id='current' form={form} />
            </Col>
            <Col span={24} style={{ padding: 12 }}>
              <Button type="primary" onClick={() => this.handleSearch()} style={{ marginLeft: '8px' }}>查询</Button>
              <Button onClick={() => this.reset()} style={{ marginLeft: '15px' }}>重置</Button>
            </Col>
          </Modal>
        }
      </div>
    );
  }
}

export default TruckingOrderList;
