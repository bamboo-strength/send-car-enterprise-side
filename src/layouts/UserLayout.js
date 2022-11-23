import React, { Component, Fragment } from 'react';
import { formatMessage } from 'umi/locale';
import { connect } from 'dva';
import { Icon } from 'antd';
import GlobalFooter from '@/components/GlobalFooter';
import DocumentTitle from 'react-document-title';
import tenantStyle from './UserLayout.less';
import getPageTitle from '@/utils/getPageTitle';

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
  componentDidMount() {
    const {
      dispatch,
      route: { routes, authority },
    } = this.props;
    // dispatch({
    //   type: 'menu/fetchMenuData',
    //   payload: { routes, authority },
    // });
  }

  render() {
    const {
      children,
      location: { pathname },
      breadcrumbNameMap,
    } = this.props;

    return (
      <DocumentTitle title={getPageTitle(pathname, breadcrumbNameMap)}>
        <div className={tenantStyle.container}>
          <div className={tenantStyle.lang} />
          <div className={tenantStyle.content}>
            <div className={tenantStyle.top}>
              <div className={tenantStyle.header}>
                <div>
                  <span className={tenantStyle.title}>无人值守</span>
                  <div style={{color:'white'}}>（客户端）</div>
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

