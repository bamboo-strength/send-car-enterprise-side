import React, { PureComponent } from 'react';
import { Card, Col, Form } from 'antd';
import { ListView, NavBar, PullToRefresh } from 'antd-mobile';
import router from 'umi/router';
import Text from 'antd/es/typography/Text';
import { connect } from 'dva';
import style from '../ShopCenter.less';
import {
  IconAddress,
  IconContract,
  IconFactory,
  IconFortheZone,
  IconInformation,
  IconShopCart,
  ImageDetails,
  img198,
  img200,
} from '@/components/Matrix/image';
import { SHOPPING_MALL_LIST } from '@/actions/shoppingMall';
import { clientId } from '@/defaultSettings';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';
import { QueryAuthentication, QueryAuthenticationForTheZone } from '@/pages/ShopCenter/component/Interface';
import { getUserType } from '@/utils/authority';

@connect(({shoppingmall,loading})=>({
  shoppingmall,
  loading:loading.models.shoppingmall
}))
@Form.create()
class MallHomepage extends PureComponent {

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
      factoryNum:0,
      // height: document.documentElement.clientHeight * 3 / 4,
      height: document.documentElement.clientHeight - 45 - 64 - 130,
    };
  }

  componentDidMount() {
    this.getData(false);
  }

  getData(ref,) {
    const { pageNo, pageSize, dataSource, realdata } = this.state;
    const {dispatch} = this.props
    dispatch(SHOPPING_MALL_LIST({current: pageNo,size:pageSize})).then(()=>{
      const {shoppingmall:{data:{pageData}}} = this.props
      if (pageData && JSON.stringify(pageData) !== '{}'){
        const tempdata = pageData.records;
        this.setState({
          factoryNum:pageData.total
        })
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
      }
    })
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

  onClick = (type)=>{
    switch (type) {
      case 'ShoppingCart':
        router.push('/shopcenter/shoppingcart')
        break;
      case 'OnlineContract':
        router.push('/shopcenter/contract')
        break;
      case 'AddressManagement':
        router.push('/shopcenter/receiving')
        break;
      case 'InformationMaintenance':
        router.push('/shopcenter/maintenance')
        break;
      case 'secondskill':
        // 点击秒杀专区时，调用接口进行判断
        // selectDeleteList().then(item=>{
        //   if (item.success){
        //     if (item.data === 1 ){
        //       Toast.fail('您已被加入黑名单，无法参与秒杀活动，如有疑问，请联系平台 0538-2720008！')
        //     }
        //   }
        // })
        QueryAuthentication()
        break;
      case 'forthezone':
        QueryAuthenticationForTheZone()
        break
      default:console.log('未找到！')
    }
  }

  render() {
    const {dataSource,isLoading,refreshing,factoryNum,height} = this.state
    const separator = (sectionID, rowID) => <div key={`${sectionID}-${rowID}`} className='separator' />;
    const row = (rowData, sectionID, rowID) => {
      const comlist = {
        title:rowData.deptName,
        image:rowData.imageUrl,
        content:[
          { value:`在售商品${rowData.goodsNum}类`,img:img200 },
          { value:`${rowData.province}${rowData.city}${rowData.district}${rowData.factoryAddress}`,img:img198 },
          { value:rowData.factoryDescribe,img:ImageDetails },
        ]
      }
      return (
        <div key={rowID} className='listDiv' onClick={()=>router.push(`/shopcenter/mallhomepage/view/${rowData.id}`)}>
          <CommodityStyle comlist={comlist} />
        </div>
      );
    };
    const headStyle = { minHeight: '40px', border: 'none' };
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    const toolList = [
      {image:IconShopCart,text:'购物车',type:'ShoppingCart'},
      {image:IconContract,text:'在线合同',type:'OnlineContract'},
      {image:IconAddress,text:'地址管理',type:'AddressManagement'},
      {image:IconInformation,text:'信息维护',type:'InformationMaintenance'},
    ]
    const clientHeight = document.getElementsByClassName('shopCard')[0] && document.getElementsByClassName('shopCard')[0].clientHeight
    const theZone = document.getElementsByClassName('theZone')[0] && document.getElementsByClassName('theZone')[0].clientHeight
    return (
      <div>
        <NavBar
          mode="light"
        >商城
        </NavBar>
        <div className={`${style.shopCenter} am-list`}>
          <div style={{ padding: 8 }}>
            {
              clientId === 'kspt_shf'?(
                <Card title="常用工具" bordered={false} headStyle={headStyle} className='shopCard' bodyStyle={{paddingLeft:'-10px'}}>
                  {
                    toolList.map(item=>{
                      return (
                        <Col span={6} style={{textAlign:'center',marginBottom:'20px'}} key={item.type} onClick={()=>this.onClick(item.type)}>
                          <div className='toolImage'>
                            <img alt='' src={item.image} />
                          </div>
                          <Text style={{marginBottom:'20px'}}>{item.text}</Text>
                        </Col>
                      )
                    })
                  }

                </Card>
              ):''
            }
            {
              (
                <div className='theZone' style={{marginTop:clientHeight + 10}}>
                  {/* <div onClick={()=>this.onClick('secondskill')} className="secondsKillBtn"> */}
                  {/*  <img src={IconSeconds} alt="" style={{height: 20,marginRight: 5}} /> 秒杀专区 */}
                  {/* </div> */}
                  <div onClick={()=>this.onClick('forthezone')} className="secondsKillBtn">
                    <img src={IconFortheZone} alt="" style={{height:20,marginRight: 5}} /> 竞价专区
                  </div>
                </div>
              )
            }
            {
              <ListView
                ref={el => {this.lv = el;}}
                dataSource={dataSource}
                renderHeader={() => (
                  <span>
                    <img src={IconFactory} alt='' /> 在营厂区（{factoryNum}）
                  </span>)}
                renderFooter={() => (
                  <div style={{ padding: 30, textAlign: 'center' }}>
                    {isLoading ? '加载中...' : '加载完毕'}
                  </div>)}
                renderRow={row}
                renderSeparator={separator}
                className="shopListView"
                pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
                pageSize={4}
                useBodyScroll={clientId !== 'kspt_shf'}
                style={clientId === 'kspt_shf'?{
                height,
                overflow: 'auto',
                top: `${clientHeight + (theZone + 15 || 0)|| 0}px`
              }:''}
                scrollRenderAheadDistance={500}
                onEndReached={this.onEndReached}
                onEndReachedThreshold={10}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

export default MallHomepage;

