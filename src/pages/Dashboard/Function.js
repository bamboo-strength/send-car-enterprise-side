import React, { PureComponent } from 'react';
import { Card, Icon } from 'antd';
import { Grid, List, NavBar } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';
import { clientId } from '@/defaultSettings';
import menu from './Menu.less';
import func from '@/utils/Func';
import { getToken, getCurrentDriver } from '@/utils/authority';

class Function extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  goPage = path => {
    router.push(path);
  };

  render() {
    // const { menuData } = this.props;
    const menuData = [
      {
        children: [
          {
            icon: null,
            name: '派车单查询',
            path: '/dashboard/cheliangjiankong'
          }
        ]
      }
    ]

    const data = [];
    return (
      <div className={menu.mobileMenu}>
        <NavBar mode="light">功能(客户端)</NavBar>
        <div className="am-list" style={{ paddingBottom: '84px' }}>
          {menuData.forEach(item => {
            if (item.children) {
              item.children.forEach((sub, index) => {
                const { icon } = sub;
                let color = '';
                if (index % 4 === 0) {
                  color = '#4581f5';
                } else if (index % 4 === 1) {
                  color = '#ea6930';
                } else if (index % 4 === 2) {
                  color = '#56ba88';
                } else {
                  color = '#f1ac41';
                }
                data.push({
                  icon: (
                    <div style={{ background: color }} className="iconName">
                      <Icon
                        type={icon || 'plus-circle'}
                        style={{ fontSize: '28px' }}
                        theme="twoTone"
                        twoToneColor="white"
                      />
                    </div>
                  ),
                  text: sub.name,
                  url: sub.path,
                });
              });
            }
          })}
          <Grid
            data={data}
            columnNum="3"
            onClick={el => this.goPage(el.url)}
            className={styles.gridData}
          />
        </div>
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
}))(props => <Function {...props} />);
