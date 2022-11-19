import { ListView,List, InputItem,Toast,PullToRefresh,Button,Modal, NavBar,Card,WhiteSpace } from 'antd-mobile';
import React from 'react';
import router from 'umi/router';
import { Form,Icon } from 'antd';
import {consignorcollection} from '../../../services/merDriver'
import MatrixInput from '@/components/Matrix/MatrixInput';
import { getCurrentUser } from '@/utils/authority';

const {Item} = List;

@Form.create()
class OwnerCollection extends React.Component {
  constructor(props) {
    super(props);
    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });
    this.state = {
      isLoading: true,
      hasMore:true,
      refreshing: true,
      dataSource,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      showSearchModal:false
    };
  }

  componentWillMount() {
    this.getData(false,{})
  }

  getData(ref,param) {
    const {pageNo,pageSize,dataSource,realdata} =this.state
    param.current=pageNo
    param.size=pageSize
    param.userId = getCurrentUser().userId
    consignorcollection(param).then(resp => {
      // console.log(resp)
      const tempdata = resp.data.records
      const len = tempdata.length
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false
        })
      //  Toast.info('没有多余的数据', 1)
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata
        })
      } else {
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr
        })
      }
    })
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1
    }, ()=>{
      this.query(true,{})
    })
  }

  onEndReached = (event) => {
    const {isLoading,hasMore,pageNo} = this.state
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, ()=> {
      this.getData(false,{})
    })
  }

  query = () => {
    const {form} = this.props
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };
      this.getData(true,values)
    //  this.onClose()
    });
  }

  orderGrabbing = (id) => {
    router.push(`/driverSide/driverDispatch/orderGrabbing`);
  }

  viewGoodsPage = (TenantId) => {
    router.push(
      {
        pathname: '/driverSide/driverDispatch/runOftenGoodsPage',
        state: {
          backUrl: '/driverSide/personal/ownerCollection',
          TenantId
        },
      }
    );
  }

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
    const {dataSource,isLoading,refreshing,showSearchModal} = this.state

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
          <div>货源：{rowData.materialnoName}</div>
        </div>
      )
      return (
        <div key={rowID}>
          <Card full>
            <Card.Body>
              <a onClick={() =>this.viewGoodsPage(rowData.consignorTenantId)} style={{color: 'black'}}>
                <div> 公司名称：{rowData.consignorTenantName}</div>
              </a>
            </Card.Body>
            {/* <Card.Footer
              content={aa}
            /> */}
          </Card>
        </div>
      );
    };

    const renderSearchForm = () => {
      const { form } = this.props;
      return (
        <List>
          <Item><MatrixInput label="车号" placeholder="车号" id="vehicleno" form={form}  /></Item>
          <Item><MatrixInput label="货源" placeholder="货源" id="vehicleno" form={form}  /></Item>
          <Item><MatrixInput label="联系人" placeholder="联系人" id="vehicleno" form={form}  /></Item>
          <Item><MatrixInput label="联系电话" placeholder="联系电话" id="vehicleno" form={form}  /></Item>
        </List>
      );
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
          /* rightContent={[
            <Icon key="0" type="search" style={{ fontSize: '24px' }} onClick={() => this.showSearch()} />,
           ]} */
        >货主收藏
        </NavBar>
        <WhiteSpace />
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
          onEndReached={()=>this.onEndReached}
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
          {renderSearchForm()}
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.query()} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
      </div>
    );
  }
}

export default OwnerCollection;
