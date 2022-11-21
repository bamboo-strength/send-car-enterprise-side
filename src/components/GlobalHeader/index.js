import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { connect } from 'dva';
import router from 'umi/router';
import styles from './index.less';

class GlobalHeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      tit: [
        {
          icon: 'appstore',
          title: '功能',
          pathName: '/dashboard/function',
        },
        {
          icon: 'menu-fold',
          title: '我的',
          pathName: '/driverSide/personal/personalCenter',
        },
      ]
    };
  }

  changeClass = item => {
    const { location: { pathname } } = this.props;
    if (pathname === item.pathName) return;
    router.push(item.pathName);
  };

  render() {
    const { topMenuData, indexIcon } = this.props;
    const { tit } = this.state;
    return (
      <div className={styles.header}>
        <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }}>
          {tit.map((item, index) => {
            return (
              <div
                className={`${styles.triggerSmall} ${
                  item.pathName === indexIcon ? styles.changeClass : ''
                }`}
                style={{ flex: 1 }}
                key={index}
                onClick={() => {
                  this.changeClass(item);
                }}
              >
                <Icon type={item.icon} style={{ fontSize: 20 }} />
                <div style={{ textAlign: 'center' }}>{item.title}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  topMenuData: menuModel.topMenuData,
}))(GlobalHeader);
