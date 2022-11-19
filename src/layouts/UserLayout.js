import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Icon,message } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import SelectLang from '@/components/SelectLang';
import tenantStyle from './UserLayout.less';
import getPageTitle from '@/utils/getPageTitle';
import { clientId,loginTitle, project,currentTenant } from '../defaultSettings';


const isSimplify = false
const links = [
  {
    key: 'help',
    title: formatMessage({ id: 'layout.user.link.help' }),
    href: '',
  },
  {
    key: 'privacy',
    title: formatMessage({ id: 'layout.user.link.privacy' }),
    href: '',
  },
  {
    key: 'terms',
    title: formatMessage({ id: 'layout.user.link.terms' }),
    href: '',
  },
];
const currentYear = new Date().getFullYear()
const copyright = (
  <Fragment>
    <span style={{color:'white'}}>Copyright <Icon type="copyright" /> {currentYear} {' '}</span>
  </Fragment>
);

class UserLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isShowLoginTitle: isSimplify ? 'none':'block'
    };
    let realTenant = currentTenant
    try {
      realTenant=TenantId.getTenantId()?TenantId.getTenantId():project === 'wlhy'?'wlhy':currentTenant
    } catch (e) {
      // 通过过去前台登陆路径获取当前登陆的租户号
      const {tenantId} = this.props.location.query
   /*   Toast.info(openId)
      if(openId && !localStorage.getItem('openId')){ // openid 不为空时保存
        localStorage.setItem('openId',openId)
      } */
      if (currentTenant !== 'login'){
        realTenant = currentTenant
      }else {
        const storeTenantid = localStorage.getItem('tenantId')
        // console.log(storeTenantid,tenantId,'+++===')
        if(storeTenantid && !tenantId){
          realTenant = storeTenantid // 缓存有从缓存取出
        }else {
          realTenant = tenantId || currentTenant
          localStorage.setItem('tenantId',realTenant)
        }

      }
    }
    this.tenantId = realTenant
  }

  componentDidMount() {

    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    dispatch({
      type: 'menu/fetchMenuData',
      payload: { routes, authority },
    });
    if (isSimplify) {
      const root = document.getElementById("root")
      if (root) {
        const container = root.firstChild;
        if (container) {
          container.style.backgroundImage='123';
        }
      }
    }
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;
    // console.log(this.tenantId,'==lay')
    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={tenantStyle.container}>
          <div className={tenantStyle.lang}>
            <SelectLang />
          </div>
          <div className={tenantStyle.content}>
            <div className={tenantStyle.top}>
              <div className={tenantStyle.header}>
                <div>
                  {/* <img alt="logo" className={tenantStyle.logo} src={logo} /> */}
                  <span className={tenantStyle.title} style={{display:this.state.isShowLoginTitle}}>{loginTitle[this.tenantId]}</span>
                  <div style={{color:'white'}}>{clientId==='kspt'?'（企业端）':clientId==='kspt_shf'?'（客户端）':(clientId==='kspt_driver'?'（司机端）':'(承运端)')}</div>
                </div>
              </div>
              <div className={tenantStyle.desc} />
            </div>
            {children}
          </div>
          <GlobalFooter style={{color:'white'}} links={links} copyright={copyright} />
        </div>
      </DocumentTitle>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
  breadcrumbNameMap: menuModel.breadcrumbNameMap,
}))(UserLayout);

