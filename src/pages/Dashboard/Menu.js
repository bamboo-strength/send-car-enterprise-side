import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { NavBar, WhiteSpace, Grid, Carousel,Modal } from 'antd-mobile';
import { connect } from 'dva';
import { rTree } from '@/services/RegionService';
import router from 'umi/router';
import styles from '../../layouts/Sword.less';
import menu from './Menu.less';
import { clientId } from '@/defaultSettings';
import banner02 from '../../../public/product/banner02.png';
import { gethomePageImg, getNotice } from '@/services/menu';
import func from '@/utils/Func';
import IndexDataList from '../PageMould/IndexDataList';
import { getCurrentDriver } from '@/utils/authority';

class Menu extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      homePageImg: [],
      noticeList: [],
    };

  }

  componentWillMount() {
    const param = { current: 1, size: 5 };
    /* 获取图片接口 */
    if (!localStorage.getItem('homePageImgs')) {
      gethomePageImg(func.parseQuery(param)).then(resp => {
        console.log(resp);
        if (func.notEmpty(resp)) {
          this.setState({
            homePageImg: resp.data.records,
          });
          localStorage.setItem('homePageImgs', JSON.stringify(func.notEmpty(resp.data.records) ? resp.data.records : []));
        }
      });
    } else {
      this.setState({
        homePageImg: JSON.parse(localStorage.getItem('homePageImgs')),
      });
    }
    getNotice(func.parseQuery(param)).then(resp => {
      if (func.notEmpty(resp)) {
        this.setState({
          noticeList: func.notEmpty(resp.data.records) ? resp.data.records : [],
        });
      }
    });
    /* if (!localStorage.getItem('notices')) {
      getNotice(func.parseQuery(param)).then(resp => {
        if (func.notEmpty(resp)) {
          this.setState({
            noticeList: func.notEmpty(resp.data.records) ? resp.data.records : [],
          });
          localStorage.setItem('notices', JSON.stringify(func.notEmpty(resp.data.records) ? resp.data.records : []));
        }
      });
    } else {
      this.setState({
        noticeList: JSON.parse(localStorage.getItem('notices')),
      });
    }
*/
  }

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch({
      type: 'user/fetchCurrent',
    });
    if(getCurrentDriver() && getCurrentDriver().auditStatus !== 1){ // 未完成司机认证 提示进行司机认证
      Modal.alert('提示', '您还未完成司机认证，是否先进行司机认证', [
        { text: '取消', onPress: () => console.log('cancel') },
        {
          text: '好的',
          onPress: () =>
            router.push('/driverSide/personal/driverCertification')
        },
      ])
    }
    this.getArea()
  }

  // 获取省市区数据
  getArea = () => {
    const param = { code: '100000', tenantId: '764537' };
    rTree(param).then(resp => {
      const district = resp.data[0].children;
      localStorage.setItem('areaData', JSON.stringify(district))
    });
  };

  goPage = (path) => {
    router.push(
      {
        pathname:path,
        state:{
          backUrl:'/dashboard/menu',
        }
      }
    )
  };

  render() {
    const { homePageImg, noticeList } = this.state;
    const { menuData } = this.props;
    const data = [];
    const colors = ['#4581f5', '#ea6930', '#56ba88', '#f1ac41'];
    const carStyle = {height: 'auto',whiteSpace: 'nowrap',textOverflow: 'ellipsis',overflow: 'hidden',width: '95%'}
    return (
      <div className={menu.mobileMenu}>
        <NavBar
          mode="light"
          rightContent={[
            <Icon
              key="0"
              type="bell"
              // theme="twoTone"
              style={{ marginRight: '16px', fontSize: 20 }}
              onClick={() => router.push({
                pathname:'/driverSide/personal/myMessage',
                state:{
                  backUrl:'/dashboard/menu',
                }
              })}
            />,
          ]}
        >
          首页({clientId === 'kspt' ? '企业端' : (clientId === 'kspt_shf' ? '客户端' : (clientId === 'kspt_cyf' ? '承运商' :'司机端'))})
        </NavBar>
        <div className='am-list'>
          <div className="myCarousel">
            <Icon type="sound" style={{ margin: '0 5px 0 15px', fontSize: 15 }} />
            {
              noticeList.length>0 ? (
                <Carousel vertical dots={false} dragging={false} swiping={false} autoplay infinite>
                  { noticeList.map((item) => <div
                    className="v-item"
                    style={carStyle}
                    key={item.id}
                    onClick={()=>
                    router.push({
                      pathname:'/desk/notice/list',
                      state:{
                        backUrl:'/dashboard/menu',
                      }
                    })
                  }
                  >通知：{item.title}
                  </div>) }
                </Carousel>
              ):<span>暂无通知消息</span>
            }
          </div>
          <WhiteSpace size='ml' style={{ height: '0.5px' }} />
          {
            menuData.map((item) => {
              if (item.children) {
                item.children.map((sub, index) => {
                  const { icon, isOpen } = sub;
                  if (isOpen === 3) {
                    const color = colors[index%4];
                    data.push({
                      icon: <div className='iconForIndex'> <div style={{ background: color }} className='iconNameForIndex'>{func.notEmpty(icon) && icon.indexOf('.png') !== -1 ? <img src={`https://fhf.dachebenteng.com/menuPics/${sub.icon}`} alt='' /> : <Icon type={icon || 'plus-circle'} style={{ fontSize: '18px' }} theme="twoTone" twoToneColor="white" />}</div></div>,
                      text: sub.name,
                      url: sub.path,
                    });
                  }
                  return true;
                });
              }
              return true;
            })
          }
          <Grid data={data} columnNum='4' onClick={(el) => {this.goPage(el.url);}} className={`${styles.gridData} forIndex`} />
          <Carousel autoplay>
            {(homePageImg.length === 0 ?
              <div className={styles.banner01}>
                <img src={banner02} alt='' style={{ height: '100%', objectFit: 'cover' }} />
              </div> : homePageImg.map(item => {
                return (
                  <div className={styles.banner01} key={item.id}>
                    <img src={item.pictureUrl} alt='' />
                    <span className={styles.fontTitle}>{item.imageText}</span>
                  </div>
                );
              }))}
          </Carousel>
          <IndexDataList />
        </div>
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
  menuData: menuModel.menuData,
}))(props => (
  <Menu {...props} />
));