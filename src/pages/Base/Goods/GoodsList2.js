import { ListView,List, InputItem,Toast,PullToRefresh,Button,Modal, NavBar, Icon,SwipeAction } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import { createForm } from 'rc-form';
import router from 'umi/router';
import { requestApi } from '../../../services/api';
import {GOODS_LIST} from '../../../actions/GoodsActions'

const {alert} = Modal;

@connect(({GoodsModels,loading}) => ({
  GoodsModels,
  loading: loading.models.GoodsModels,
}))
@createForm()
class GoodList extends React.Component {
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

  componentDidMount() {
    this.getData(false,{})
  }

  getData(ref,param) {
    const { dispatch } = this.props;
    const {pageNo,pageSize,dataSource,realdata} =this.state
    param.current=pageNo
    param.size=pageSize
    dispatch(GOODS_LIST(param)).then(() => {
      const { GoodsModels: {data} } = this.props;
      const tempdata = data.list
      const len = tempdata.length
      if (len <= 0) { // 判断是否已经没有数据了
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false
        })
      //  Toast.info('没有多余的数据', 1)
     //   return false
      }

      if (ref) {
        // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,   // 下拉刷新后，重新允许开下拉加载
          refreshing: false, // 是否在刷新数据
          isLoading: false, // 是否在加载中
          realdata: tempdata // 保存数据进state，在下拉加载时需要使用已有数据
        })
      } else {
        // 上拉加载
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr // 保存新数据进state
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
      this.onClose()
    });
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.getData(true,{})
    this.onClose()
  }

  editGood = (id) => {
    router.push(`/base/goods/edit/${id}`);
  }

  viewGood = (id) => {
    router.push(`/base/goods/view/${id}`);
  }

  deleteGood = (id) => {
    alert('删除', '确定删除?', [
      { text: '取消', style: 'default' },
      { text: '确定', onPress: () => {
          const response = requestApi('/api/base-goods/goods/remove', { ids: id });
          Toast.success(response.msg);
          this.getData(true,{})
          /* if (response.success) {
            Toast.success(response.msg);
            this.getData(true,{})
          } else {
            Toast.fail(response.msg || '删除失败');
          } */
        } },
    ]);
  }

// ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true
    })
  }

  onClose = () => {
    this.setState({
      showSearchModal:false
    })
  }

  render() {
    const {dataSource,isLoading,refreshing,showSearchModal} = this.state
    const { getFieldProps } = this.props.form;

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
        <div key={rowID} style={{ padding: '0 15px' }}>
          <div style={{ display: '-webkit-box', padding: '15px 0' }}>
            <div style={{ lineHeight: 2.5 }}>
              <div style={{fontWeight: 'bold' }}>物资名称：{rowData.name}</div>
              <div>物资编码：{rowData.code}</div>
              <div>物资简称：{rowData.shortname}</div>
              <div>检索码：{rowData.spellcode}</div>
              <div>包装方式：{rowData.packagingName}</div>
              <div style={{marginTop:'5px'}}> <Button type="primary" size='small' inline onClick={() =>this.editGood(rowData.id)}>修改</Button>
                <Button type="warning" size='small' inline style={{margin:'0px 8px'}} onClick={() =>this.deleteGood(rowData.id)}>删除</Button>
                <Button type="primary" size='small' inline onClick={() =>this.viewGood(rowData.id)}>查看</Button>
              </div>
            </div>
          </div>
          {/* <SwipeAction
            style={{ backgroundColor: 'gray' }}
            autoClose
            right={[
              {
                text: '修改',
                onPress: () => this.editGood(rowData.id),
                style: { backgroundColor: 'blue', color: 'white' },
              },
              {
                text: '删除',
                onPress: () => this.deleteGood(rowData.id),
                style: { backgroundColor: 'red', color: 'white' },
              },
              {
                text: '查看',
                onPress: () => this.viewGood(rowData.id),
                style: { backgroundColor: 'orange', color: 'white' },
              },
            ]}
          >
            <div style={{ lineHeight: 2.5 }}>
              <div style={{fontWeight: 'bold' }}>物资名称：{rowData.name}</div>
              <div>物资编码：{rowData.code}</div>
              <div>物资简称：{rowData.shortname}</div>
              <div>检索码：{rowData.spellcode}</div>
              <div>包装方式：{rowData.packagingName}</div>
            </div>
          </SwipeAction> */}
        </div>
      );
    };

    const serarchForm = () => {
    //  const { getFieldProps } = this.props.form;
      return (
        <List>
          <InputItem
            {...getFieldProps('name')}
            clear
            placeholder="请输入物资名称"
          >物资名称：
          </InputItem>
          <InputItem
            {...getFieldProps('code')}
            clear
            placeholder="请输入物资编码"
          >物资编码：
          </InputItem>

          <Button type="ghost" size='small' inline onClick={() =>this.query()} style={{marginLeft:'8px'}}>查询</Button>
          <Button type="ghost" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
        </List>
      );
    };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => console.log('onLeftClick')}
          rightContent={[
            <Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />,
            <Icon key="1" type="ellipsis" />,
          ]}
        >物资管理
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
          onClose={() =>this.onClose('modal1')}
          popup
          animationType='slide-down'
          platform='android'
        >
          <List>
            <InputItem
              {...getFieldProps('name')}
              clear
              placeholder="请输入物资名称"
            >物资名称：
            </InputItem>
            <InputItem
              {...getFieldProps('code')}
              clear
              placeholder="请输入物资编码"
            >物资编码：
            </InputItem>

            <Button type="primary" size='small' inline onClick={() =>this.query()} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </List>
        </Modal>
      </div>
    );
  }
}

export default GoodList;
