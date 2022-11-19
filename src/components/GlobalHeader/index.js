import React, { PureComponent } from 'react';
import { Icon, Tabs } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import Debounce from 'lodash-decorators/debounce';
import styles from './index.less';
import { MENU_REFRESH_DATA, MENU_REFRESH_ROUTE } from '../../actions/menu';
import { clientId,project } from '../../defaultSettings';
import { getTenantId } from '@/pages/Merchants/commontable';
import { getSystemParamByParamKey } from '@/services/param';
import func from '@/utils/Func';

class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tit:[]
    };
  }

  componentWillMount() {
    const { collapsed, } = this.props;
    const tit =project !== 'wlhy'?
      [{
      icon: 'home',
      title: '首页',
      pathName:'/dashboard/menu'
    }, {
      icon: 'appstore',
      title: '功能',
      pathName:'/dashboard/function'
    } ,
    {
      icon: collapsed ? 'menu-unfold' : 'menu-fold',
      title: '我的',
      pathName:clientId === 'kspt_driver'?'/driverSide/personal/personalCenter':'/driverSide/personal/personalShipper'
    },
    ]:[{
    icon: 'car',
    title: '网络货运',
    pathName:'/dashboard/freight'
  },  {
    icon: collapsed ? 'menu-unfold' : 'menu-fold',
    title: '我的',
    pathName:clientId === 'kspt_driver'?'/driverSide/personal/personalCenter':'/driverSide/personal/personalShipper'
  }];
    this.setState({
      tit
    })
  }

  componentWillUnmount() {
    this.triggerResizeEvent.cancel();
  }
  /* eslint-disable*/
  @Debounce(600)
  triggerResizeEvent() {
    // eslint-disable-line
    const event = document.createEvent('HTMLEvents');
    event.initEvent('resize', true, false);
    window.dispatchEvent(event);
  }


  getTabsByParam = ()=>{
    const param1 = {'paramKey':`ifOpenCarVehicleMatching.${clientId}`,tenantId : getTenantId()};
    const param2 = { 'paramKey': `ifOpenShoppingMall.${clientId}`,tenantId : getTenantId()};
    return Promise.all([getSystemParamByParamKey(param1),getSystemParamByParamKey(param2)]).then(resp=>{
      return resp
    })
  }

  toggle = () => {
    const { collapsed, onCollapse } = this.props;
    onCollapse(!collapsed);
    this.triggerResizeEvent();
  };

  loadMenu = id => {
    const { dispatch } = this.props;
    dispatch(
      MENU_REFRESH_ROUTE(id, () => {
        dispatch(MENU_REFRESH_DATA());
      }),
    );
  };
  changeClass = (item) => {
    switch (item.title) {
      case '首页':
        router.push('/dashboard/menu');
        break;
      case '功能':
        router.push('/dashboard/function');
        break;
      case '商城':
        router.push('/shopcenter/mallhomepage/list');
        break;
      case '货源大厅':
        router.push('/dashboard/SupplyHall');
        break;
      case '网络货运':
        router.push('/dashboard/freight');
        break;
      case '我的':
        this.goPersonalCenter();
        break;
    }

  };
  goPersonalCenter = () => {
    if (clientId === 'kspt_driver') { // 司机端个人中心
      router.push('/driverSide/personal/personalCenter');
    } else {
      router.push('/driverSide/personal/personalShipper');
    }
  };

  render() {
    const { collapsed, isMobile, logo, topMenuData, onMenuClick ,indexIcon} = this.props;
    const {tit}=this.state
    return (
      <div className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {tit.map((item,index) => {
            return <div className={`${styles.triggerSmall} ${item.pathName === indexIcon?styles.changeClass:''}`} style={{flex:1}} key={index} onClick={() => {this.changeClass(item);}}>
              <Icon type={item.icon} style={{ fontSize: 20 }}/>
              <div style={{ textAlign: 'center' }}>
                {item.title}
              </div>
            </div>;
          })}
        </div>
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  topMenuData: menuModel.topMenuData,
}))(GlobalHeader);
