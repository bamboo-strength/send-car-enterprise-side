import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Form, Icon,Modal } from 'antd';
import router from 'umi/router';
import NetWorkListCard from '@/components/NetWorks/NetworkListCard';
import { ListView, PullToRefresh, NavBar, Tabs, ActionSheet, Toast } from 'antd-mobile';
import { list } from '../../../services/bidding';
import func from '@/utils/Func';
import { cancelbidding, remove } from '@/services/bidding';
import { orderTakeVerify } from '@/services/FreightServices';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
@Form.create()
class Bidding extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      waybillStatus: '1',
      bidStatus: '1',
      dataSource: dataSource1,
      isLoading: true,
      hasMore: true,
      refreshing: true,
      realdata: [],
      load: localStorage.getItem('load'),
    }
  }

  componentWillMount() {
    this.getData(false, {});
  }

  componentWillUnmount() {
    localStorage.removeItem('load');
  }

  onClick = (item,state)=>{
    if (item.sourceGoodsStatus=== 1){
      Toast.offline('竞价已结束,无法竞价！')
      return
    }
    orderTakeVerify({type:3}).then((resp)=>{
      if(resp.success){
        const {bidStatus} = this.state;
        localStorage.setItem('localid',"1");
        router.push(
          {
            pathname: `/network/waybill/biddingView/${item.id}`,
            state: {
              state,
              priceRecordId:item.priceRecordId,
              priceRecordWaybillId:item.priceRecordWaybillId,
              initialPage: bidStatus,
            },
          },
        );
      }
    })
  }

  /* 拨打电话 */
  onCallPhone = (e, rowData)=>{
    e.stopPropagation();
    const BUTTONS = [rowData.driverPhone, '呼叫', '取消'];
    ActionSheet.showActionSheetWithOptions({
        options: BUTTONS,
        cancelButtonIndex: BUTTONS.length - 1,
        destructiveButtonIndex: BUTTONS.length - 2,
        message: '拨打电话',
        maskClosable: true,
        'data-seed': 'logId',
        wrapProps: {
          onTouchStart: e => e.preventDefault(),
        },
      },
      (buttonIndex) => {
        console.log(buttonIndex)
      });
  }

  getData(ref,param){
    const { pageNo, dataSource, realdata, waybillStatus,load } = this.state;
    param.bidStatus=load != null && load !== undefined ? load :waybillStatus-2;
    param.carrierType=1;
    this.setState({
      bidStatus:param.bidStatus
    })
    list(param).then(resp=>{
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data)?JSON.parse(resp.data):[]):(func.notEmpty(resp.data.records)?resp.data.records:[])
      const len = tempdata.length;
      if (len <= 0){
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        })
      }
      if (ref){  // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata,
        })
      }else {  // 上拉加载
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
        })
      }
    })
  }

  changeTab = (tab,index)=>{
    this.setState({
      pageNo:1,
      waybillStatus:index + 1,
      dataSource:dataSource1,
      isLoading: true,
      load: localStorage.removeItem('load'),
    },()=>{
      this.query(true,{})
    })
  }

  query = (flag,param) =>{
    const {form} = this.props;
    form.validateFields(async (err,fieldsValue)=>{
      const values = {
        ...fieldsValue,
        ...param
      }
      this.getData(flag,values)
    })
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

  waybillview=(e,priceRecordWaybillId)=>{
    e.stopPropagation();
    router.push(`/network/waybill/waybillview/${priceRecordWaybillId}`)
  }

  onBidding = (e, rowData)=>{
    e.stopPropagation();
    const that=this
    Modal.confirm({
      title: '是否取消报价?',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        cancelbidding({id:rowData.priceRecordId,cancelRemark:'取消原因'}).then(resp=>{
          if(resp.success){
            that.onRefresh()
          }
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  onDelete = (e, rowData)=>{
    e.stopPropagation();
    Modal.confirm({
      title: '是否确认删除?',
      okText:'确定',
      cancelText:'取消',
      onOk() {
        remove({ids:rowData.id}).then(resp=>{
          console.log(resp)
        })
      },
      onCancel() {
        console.log('Cancel');
      },
    })
  }

  render() {
    const { dataSource, isLoading, refreshing,bidStatus,load } = this.state;
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
      let actions = ([]);
      const state = rowData.bidStatus+2
      switch (state) {
        case 2:
          actions = ([<div onClick={(e) => this.onBidding(e, rowData)}>取消报价</div>])
          break;
        case 3:
          // actions = ([<div  style={{color:'#4581f5'}}>查看详情</div>])
          actions = ([
            <div style={{ color: '#1890FF' }} onClick={(e) => this.waybillview(e,rowData.priceRecordWaybillId)}>查看运单</div>,
          ])
          break;
        case 4:
          actions = ([<div onClick={(e) => this.onDelete(e, rowData)}>删除</div>])
          break;
        case 5:
          actions = ([<div onClick={(e) => this.onDelete(e, rowData)}>删除</div>])
          break;
        default:console.log('没找到值！');
      }

      return (
        <div key={rowID}>
          <NetWorkListCard item={rowData} actions={actions} onClick={()=>this.onClick(rowData,state)} type={1} state={state} onCallPhone={(e) => this.onCallPhone(e, rowData)} />
        </div>
      );
    };
    const listView = (
      <ListView
        ref={el =>this.lv = el}
        dataSource={dataSource}
        renderFooter={()=>(
          <div style={{ padding: 30, textAlign: 'center' }}>
            {isLoading ? '加载中...' : '加载完毕'}
          </div>
        )}
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
    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite')
    return (
      <div id={NetWorkLess.netWork}>
        {
          ifFromOtherSite === 'ok'?undefined:
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/freight')}
          >竞价专区
          </NavBar>
        }

        <div className={ifFromOtherSite === 'ok'?'am-list-nestPage':'am-list'}>
          <Tabs
            tabs={[
            {title:'未报价'},
            {title:'已报价'},
            {title:'已中标'},
            {title:'未中标'},
            {title:'已取消'},
          ]}
            initialPage={0}
            page={load != null && load !== undefined ? Number(load)+1 : bidStatus+1}
            onChange={(tab,index)=>this.changeTab(tab,index)}
          >
            <div>{listView}</div>
            <div>{listView}</div>
            <div>{listView}</div>
            <div>{listView}</div>
            <div>{listView}</div>
          </Tabs>
        </div>
      </div>
    );
  }
}

export default Bidding;
