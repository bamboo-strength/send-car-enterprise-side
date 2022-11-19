import { ListView, ActionSheet, Toast, PullToRefresh, Button, Modal, NavBar, Card } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form, Icon, Row } from 'antd';
import { queryList } from '@/services/dispatchbill';
import { getQueryConf } from '@/components/Matrix/MatrixQueryConfig';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import { requestApi } from '@/services/api';


@connect(({ merVehicle, loading }) => ({
  merVehicle,
  loading: loading.models.merVehicle,
}))
@Form.create()
class WjDispatchOrder extends React.Component {
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
    queryList(param).then(resp => {
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


  showOper = (data) => {
    const BUTTONS = ['查看','修改','取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps: {
          onTouchStart: e => e.preventDefault(),
        },
      },
      (buttonIndex) => {
        if (buttonIndex === 1) {  // 修改
          router.push(
            {
              pathname: `/weiJiao/wjDispatchOrderByPurchase/add`,
              state: { rowData: data },
            },
          );
        }
        if (buttonIndex === 0) {  // 查看
          router.push(
            {
              pathname: `/weiJiao/wjDispatchOrderByPurchase/view/${data}`,
              state: { rowData: data },
            },
          );
        }
        if (buttonIndex === 2) {  // 查看
          this.setState({
            text: '取消',
            style: 'default'
          })
        }
      });
  };



  query = (flag,param) => {
    const {form} = this.props
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param
      };
      this.getData(flag,values)
      this.onClose()
    });
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      pageNo:1
    }, ()=> {
      this.query(true,{})
    })
  }

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    this.setState({
      showSearchModal:false
    })
  }


  render() {
    const { dataSource, isLoading, refreshing, showSearchModal } = this.state;
    const {form} = this.props
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
              <div><Icon theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;派车单号：{rowData.id}</div>
              <div><Icon theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;车号：{rowData.vehicleno}</div>
              <div><Icon theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;物资：{rowData.varietyName}</div>
              <div><Icon theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;供应商：{rowData.unitno}</div>
              <div><Icon theme="twoTone" style={{ fontSize: '18px' }} /> &nbsp;录入时间：{rowData.inputtime}</div>
              <Button type="primary" size='small' inline style={{ float: 'right',padding: '4px 15px'}} onClick={() => this.showOper(rowData.id)}>操作</Button>
            </Card.Body>
          </Card>
        </div>
      );
    };

    const serarchForm = () => {

      return (
        <div>
          <Row>
            <MatrixAutoComplete label='车号' placeholder='拼音码检索' dataType='vehicle' id='vehicle' labelId='vehicleName' form={form} style={{width: '100%'}} />
            <MatrixAutoComplete label='物资' placeholder='拼音码检索' dataType='goods' id='variety' labelId='varietyName' form={form} style={{width: '100%'}} />
            <MatrixAutoComplete label='供应商' placeholder='拼音码检索' dataType='goods' id='customerno' labelId='customernoName' form={form} style={{width: '100%'}} />
          </Row>
        </div>
      )
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon key="0" type="search" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => this.showSearch()} />,
          ]}
        >派车单
        </NavBar>
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
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {serarchForm()}
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.query(1)} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default WjDispatchOrder;
