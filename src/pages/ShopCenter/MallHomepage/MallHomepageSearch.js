import React,{PureComponent} from 'react';
import { ListView, NavBar, PullToRefresh, SearchBar } from 'antd-mobile';
import { Empty, Form, Icon } from 'antd';
import style from '@/pages/ShopCenter/ShopCenter.less';
import router from 'umi/router';
import Text from 'antd/es/typography/Text';
import { list } from '@/services/FreightServices';
import func from '@/utils/Func';
import {img200,img198} from '@/components/Matrix/image'

@Form.create()
class MallHomepageSearch extends PureComponent{

  constructor(props) {
    super(props);

    const dataSource = new ListView.DataSource({
      rowHasChanged: (row1, row2) => row1 !== row2,
    });

    this.state = {
      dataSource,
      isLoading: true,
      hasMore: true,
      refreshing: true,
      pageNo: 1,
      pageSize: 5,
      realdata: [],
      isEmpty:true
    };
  }

  componentDidMount() {
    this.autoFocusInst.focus();
  }

  onChange= (value) => {
    console.log(value,'onChange')
    this.getData(false);
    this.setState({
      isEmpty:false
    })
  };

  // 点击取消事件
  onCancel = ()=>{
    // 点击取消清空输入框内容
    this.autoFocusInst.state.value = ''
    this.setState({
      isEmpty:true
    })
  }

  onFocus = ()=>{
    console.log('onFocus')
    this.setState({
      isEmpty:true
    })
  }

  // submit 事件 (点击键盘的 enter)
  onSubmit = (value)=>{
    console.log(value, 'onSubmit')
  }

  // 请求接口数据
  getData(ref,) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    list({ current: pageNo,size:pageSize}).then(resp => {
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
      this.query(true, );
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
      this.query(false, );
    });
  };

  query = (flag,) => {
    const { form,location } = this.props;
    form.validateFields(async () => {
      if (location.state !== undefined) {
        this.getData(flag, );

      } else {
        this.getData(flag, );
      }
    });
  };

  render() {
    const {dataSource,isLoading,refreshing,isEmpty} = this.state
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
        <div key={rowID} className='listDiv' onClick={()=>router.push(`/shopcenter/goodsdetails/${rowData.id}`)}>
          <div className='listMess'>
            <img className='listImage' src='https://zos.alipayobjects.com/rmsportal/hfVtzEhPzTUewPm.png' alt="" />
            <div className='listTitDiv'>
              <div className='listTie'>{rowData.driverName}</div>
              <div className='flexAlignC'><img src={img200} alt='' className='iconImg' /> <Text>在售商品{rowData.prepayType}类</Text></div>
              <div className='flexAlignC'><img src={img198} alt='' className='iconImg' /> <Text>{rowData.shipFullAddress}</Text></div>
            </div>
          </div>
          <div className='listCont'>{rowData.receiveAddressName}</div>
        </div>
      );
    };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {window.history.back();}}
          className='shopSearch'
        ><SearchBar
          placeholder="请输入搜索内容"
          ref={ref => {this.autoFocusInst = ref;}}
          onSubmit={value => this.onSubmit(value)}
          onFocus={() => this.onFocus}
          onBlur={() => console.log('onBlur')}
          showCancelButton
          onChange={this.onChange}
          onCancel={this.onCancel}
        />
        </NavBar>
        <div className={`${style.shopCenter} am-list`}>
          {
            isEmpty? <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} className='shopEmpty' />:(
              <ListView
                ref={el => {this.lv = el;}}
                dataSource={dataSource}
                renderFooter={() => (
                  <div style={{ padding: 30, textAlign: 'center' }}>
                    {isLoading ? '加载中...' : '加载完毕'}
                  </div>)}
                renderRow={row}
                renderSeparator={separator}
                className="shopListView"
                pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
                pageSize={4}
                useBodyScroll
                onScroll={() => { console.log('scroll'); }}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
              />
            )
          }
        </div>
      </div>
    );
  }
}
export default MallHomepageSearch
