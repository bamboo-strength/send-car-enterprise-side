import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { Grid, NavBar } from 'antd-mobile';
import { connect } from 'dva';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';
import menu from './Menu.less';
import func from '@/utils/Func';


class SupplyHall extends PureComponent {
  constructor(props) {
    super(props);
    this.state={

    }
  }

  componentWillMount() {
  }

  goPage = (path) => {
  router.push(path.url);
};

  render() {
    const { menuData } = this.props;
    const data = [];
    return (
      <div className={menu.mobileMenu}>
        <NavBar
          mode="light"
        >
          货源大厅
        </NavBar>
        <div className='am-list' style={{paddingBottom:'84px'}}>
          {
            menuData.map((item,) => {
              if (item.name.includes('车货匹配')) {
                if (item.children) {
                  item.children.map((sub,) => {
                    const {icon} = sub;
                    const color = '#4581f5';
                    data.push({
                      icon: <div style={{ background: color }} className='iconName'>{func.notEmpty(icon) && icon.indexOf('.png') !== -1 ? <img src={`https://fhf.dachebenteng.com/menuPics/${sub.icon}`} alt='' /> : <Icon type={icon || 'plus-circle'} style={{ fontSize: '28px' }} theme="twoTone" twoToneColor="white" />}</div>,
                      text: sub.name,
                      url: sub.path,
                      alias:sub.alias,
                    });
                  });
                }
              }
            })
          }
          <Grid data={data} columnNum='3' onClick={(el) => this.goPage(el)} className={styles.gridData} />
        </div>

      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
}))(props => (
  <SupplyHall {...props} />
));

