import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon } from 'antd';
import router from 'umi/router';
import { ListView, NavBar, PullToRefresh, Toast } from 'antd-mobile';
// import {Selector} from'antd-mobile5.0'
import NetWorkListCard from '@/components/VehicleCarMatching/NetworkListCard';
import { canDo, list } from '@/services/VehicleCarMatching/GrabOrderServices';
import func from '@/utils/Func';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
class GrabaSingle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
     data:{ records: []},
     showSearchModal:false,
      dataSource: dataSource1,
      pageNo: 1,
      pageSize: 20,
      isLoading: true,
      hasMore: true,
      refreshing: true,
      realdata: [],
    };
  }

  componentWillMount() {
    // list({current: 1,size: 15}).then(resp=>{
    //   this.setState({
    //     data:resp.data
    //   })
    // })
    this.getData(false, {});


  }

  getData(ref, param) {
      const { pageNo, pageSize, dataSource, realdata, waybillStatus, load } = this.state;
      param.current = pageNo;
      param.size = pageSize;
      param.flag = load != null && load !== undefined ? load : waybillStatus;
      delete param.loadingEfficiencyScore;
      delete param.matchDegreeScore;
      if (param.flag === 1) {
        delete param.flag
      }
      list(param).then(resp => {
        const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data.records) ? resp.data.records : []);
        const len = tempdata.length;
        if (len <= 0) {
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
          });
        }
        if (ref) { // 下拉刷新
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(tempdata),
            hasMore: true,
            refreshing: false,
            isLoading: false,
            realdata: tempdata,
          });
        } else { // 上拉加载
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

  onEndReached = () => {
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
    // console.log('flag',flag);
    const { form, location } = this.props;
    this.getData(flag, param);
  };

  onClick = (item) => {
    // orderTakeVerify({type:2}).then((resp)=>{
    //   if (resp.success)
    //   {
    console.log(item);
    if(item.distanceFlag==1){
      Toast.fail(`超出距离限制，需在厂区位置${item.distance}km距离内抢单`)
    }else{
      canDo({id:'',userType:2}).then((res)=>{
        if(res.success){
          if(res.data==true){
            router.push(
              {
                pathname: `/vehicleCarMatching/ordergrabbingmanage/view/${item.id}`,
                state: {
                  splitBill:item.splitBill,
                },
              },
            );
          }else{
            Toast.fail('您已被限制抢单')
          }
        }
      })
    }
      // }
    // })
  };

// ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    clearInterval(this.timer);
    this.setState({
      showSearchModal:false,
    })
  }

  search = (e) => {
    console.log(e);
   //  console.log("555");
   const {form}=this.props
    form.validateFields(async (err, fieldsValue) => {
      console.log('values',fieldsValue);
    })
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

  onRecord = () => {
    router.push('/vehicleCarMatching/ordergrabbingmanage/ordergrabbingrecord');
  };

  render() {
    window.gobackurl=()=>{
      router.push('/dashboard/SupplyHall')
    }
    const {data,showSearchModal,isLoading, refreshing,dataSource}=this.state
    const {form} =this.props
    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite')
    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />);
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          <NetWorkListCard item={rowData} onClick={() => this.onClick(rowData)} type={0} />
        </div>
      );
    }
    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={20}
        useBodyScroll
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
      return (
        <div id={NetWorkLess.netWork}>
          {
          ifFromOtherSite === 'ok'?undefined:
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/SupplyHall')}
            rightContent={
              [<span onClick={this.onRecord}>抢单记录</span>,
                // <Icon style={{width:"3em"}} key="0" type="search" onClick={() => this.showSearch()} />,
              ]
            }
          >抢单专区
          </NavBar>
        }
          <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
            {listView}
          </div>

        </div>
    );
  }
}
export default GrabaSingle;
