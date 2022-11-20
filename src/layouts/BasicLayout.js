import React from 'react';
import { Layout, notification } from 'antd';
import DocumentTitle from 'react-document-title';
import { connect } from 'dva';
import { ContainerQuery } from 'react-container-query';
import classNames from 'classnames';
import Media from 'react-media';
import { Toast } from 'antd-mobile';
import logo from '../assets/logo.svg';
import Header from './Header';
import Context from './MenuContext';
import SiderMenu from '@/components/SiderMenu';
import getPageTitle from '@/utils/getPageTitle';
import { getCurrentUser } from '@/utils/authority';
import { findNoList, readMassage } from '@/services/merDriver';
import Func from '@/utils/Func';
import { getTenantId } from '../pages/Merchants/commontable';
import { clientId } from '../defaultSettings';
import { IEVersion } from '@/utils/utils';
import 'antd/dist/antd.less';

// lazy load SettingDrawer
const SettingDrawer = React.lazy(() => import('@/components/SettingDrawer'));

const { Content } = Layout;

const query = {
  'screen-xs': {
    maxWidth: 575,
  },
  'screen-sm': {
    minWidth: 576,
    maxWidth: 767,
  },
  'screen-md': {
    minWidth: 768,
    maxWidth: 991,
  },
  'screen-lg': {
    minWidth: 992,
    maxWidth: 1199,
  },
  'screen-xl': {
    minWidth: 1200,
    maxWidth: 1599,
  },
  'screen-xxl': {
    minWidth: 1600,
  },
};
class BasicLayout extends React.Component {
  constructor(props) {
    super(props);
    this.timer = null;
  }

  componentDidMount() {
    const {
      dispatch,
      route: { routes, path, authority },
    } = this.props;
    const { userId } = ''; // getCurrentUser();
    dispatch({
      type: 'user/fetchCurrent',
    });
    dispatch({
      type: 'setting/getSetting',
    });
    dispatch({
      type: 'menu/fetchMenuData',
      payload: { routes, path, authority },
    });
    const tentid = getTenantId();
    if (clientId === 'kspt_driver' && (tentid === '257720' || tentid === '610791')) {
      const that = this;
      try {
        if (Func.notEmpty(Version) && Func.notEmpty(Version.getVersion())) {
          const versionName = '';
          const versionSplit = Version.getVersion(versionName);
          const verSplit = versionSplit.split('--');
        }
      } catch (e) {
        const param = {
          pushUserId: userId,
          tenantId: getTenantId(),
        };
        findNoList(param).then(resp => {
          if (resp.success) {
            resp.data.map(item => {
              return notification.open({
                message: item.title,
                btn: (
                  <button
                    type="button"
                    className="ant-btn ant-btn-primary ant-btn-sm"
                    onClick={() => this.btnClick(item.id)}
                  >
                    标记已读
                  </button>
                ),
                description: item.content,
                onClose: close,
                key: item.id,
                duration: null,
              });
            });
          }
        });
        that.interval = setInterval(() => {
          findNoList(param).then(resp => {
            if (resp.success) {
              resp.data.map(item => {
                return notification.open({
                  message: item.title,
                  btn: (
                    <button
                      type="button"
                      className="ant-btn ant-btn-primary ant-btn-sm"
                      onClick={() => this.btnClick(item.id)}
                    >
                      标记已读
                    </button>
                  ),
                  description: item.content,
                  onClose: close,
                  key: item.id,
                  duration: null,
                });
              });
            }
          });
        }, 60000 * 30); // 30分钟请求一次
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  getContext() {
    const { location, breadcrumbNameMap } = this.props;
    return {
      location,
      breadcrumbNameMap,
    };
  }

  btnClick = id => {
    readMassage({ id }).then(resp => {
      if (resp.success) {
        notification.close(id);
      }
    });
  };

  getLayoutStyle = () => {
    const { fixSiderbar, isMobile, collapsed, layout } = this.props;
    if (fixSiderbar && layout !== 'topmenu' && !isMobile) {
      return {
        paddingLeft: collapsed ? '80px' : '256px',
      };
    }
    return null;
  };

  handleMenuCollapse = collapsed => {
    const { dispatch } = this.props;
    dispatch({
      type: 'global/changeLayoutCollapsed',
      payload: collapsed,
    });
  };

  renderSettingDrawer = () => {
    if (process.env.NODE_ENV === 'production' && process.env.APP_TYPE !== 'site') {
      return null;
    }
    return <SettingDrawer />;
  };

  render() {
    const {
      navTheme,
      layout: PropsLayout,
      children,
      location: { pathname },
      isMobile,
      menuData,
      breadcrumbNameMap,
      fixedHeader,
    } = this.props;

    // 获取显示页面的地址
    const indexIcon = children.props.location.pathname;
    const isTop = PropsLayout === 'topmenu';
    const contentStyle = !fixedHeader ? { paddingTop: 0 } : { marginBottom: 84 };
    const layout = (
      <Layout>
        {isTop && !isMobile ? null : (
          <SiderMenu
            logo={logo}
            theme={navTheme}
            onCollapse={this.handleMenuCollapse}
            menuData={menuData}
            isMobile={isMobile}
            {...this.props}
          />
        )}
        <Layout
          style={{
            ...this.getLayoutStyle(),
            minHeight: '100vh',
          }}
        >
          <Content className="content" style={contentStyle}>
            {children}
          </Content>
          {pathname.includes('dashboard') ||
          pathname === '/network/waybill' ||
          pathname === '/shopcenter/mallhomepage/list' ||
          pathname === '/driverSide/personal/personalShipper' ||
          pathname === '/driverSide/personal/personalCenter' ? (
            <Header
              menuData={menuData}
              handleMenuCollapse={this.handleMenuCollapse}
              logo={logo}
              indexIcon={indexIcon}
              isMobile={isMobile}
              id="Header"
              {...this.props}
            />
          ) : (
            ''
          )}
        </Layout>
      </Layout>
    );
    return (
      <React.Fragment>
        <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
          <ContainerQuery query={query}>
            {params => (
              <Context.Provider value={this.getContext()}>
                <div className={classNames(params)}>{layout}</div>
              </Context.Provider>
            )}
          </ContainerQuery>
        </DocumentTitle>
      </React.Fragment>
    );
  }
}

export default connect(({ global, setting, menu: menuModel }) => ({
  collapsed: global.collapsed,
  layout: setting.layout,
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
  ...setting,
}))(props => (
  <Media query="(max-width: 599px)">
    {isMobile => <BasicLayout {...props} isMobile={isMobile} />}
  </Media>
));
