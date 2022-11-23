import { Card, List, NavBar, PullToRefresh, Toast, WhiteSpace } from 'antd-mobile';
import { Button, Icon, Modal } from 'antd';
import React from 'react';
import router from 'umi/router';
import { connect } from 'dva';
import { getCurrentUser } from '@/utils/authority';
import func from '@/utils/Func';
import { clientId, currentTenant, logoImgUrl, project } from '@/defaultSettings';
import { getTenantId } from '@/pages/Merchants/commontable';
import { getAuditStatus } from '../../../services/carleader';
import { requestListApi } from '../../../services/api';
import ghImg from './personalImg/gh_qrcode.jpg';
import { detail as getDriverDetail } from '@/services/merDriver';
import { getToken } from '../../../utils/authority';
import { getSystemParamByParamKey } from '@/services/param';
import style from '@/global.less';
import { U87 } from '@/components/Matrix/image';


const { Item } = List;
@connect(({ menu }) => ({
  menu,
}))
class PersonalCen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      leaderstate: '',
      leaderstateName: '',
      color: '',
      showCerImage: false,
      cerImage: '',
      cerStatus: '',
      showDownload: false,
      refreshing: false,
      height: document.documentElement.clientHeight,
      driverDetail: {},
      visible: false
    };
  }

  checkCertification = (path, userdetail) => {
    return;
    if (userdetail.auditStatus !== 1 && path !== '/driverSide/personal/driverCertification') { // 司机认证跳过
      Toast.info('该功能在司机认证通过后使用');
      return;
    }

    if (path === '/driverSide/personal/myCars' && userdetail.truckno === '') {
      router.push('/driverSide/personal/carCertification/undefined')
      return;
    }
    router.push(path);
  };

  logOut = () => { // 退出登录
    const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const ifWx = window.__wxjs_environment === 'miniprogram'
    if (u && !ifWx) { // ios环境 非小程序
      const message = {
        'name': 'loginOutClick',
      }
      window.webkit.messageHandlers.loginOutClick.postMessage(message);
    } else {
      const { dispatch } = this.props;
      let tenant = '';
      if (func.notEmpty(getCurrentUser())) {
        tenant = getCurrentUser().tenantId;
      }
      Modal.confirm({
        title: '退出确认',
        content: '是否确定退出登录？',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        onOk() {
          dispatch({
            type: 'login/logout',
            payload: tenant,
          });
        },
        onCancel() {
        },
      });
    }
  };

  toLx = () => { // 测试流向跳转
    if (window.__wxjs_environment === 'miniprogram') {
      wx.miniProgram.navigateTo({ url: `/pages/toLx/toLx?isBusiness=true&account=18654956398&pwd=123456` })
    }
  }

  realCertification = () => { // 实名认证
    this.setState({
      showCerImage: true
    }, () => {
      requestListApi('/freight/fre-taxinterface/livingbodycheck/getQRCode', {}).then(resp => {
        if (resp.success) {
          this.setState({
            cerImage: resp.data,
          }, () => { // 校验状态
            requestListApi('/freight/fre-taxinterface/livingbodycheck/getResult', {}).then(resp2 => {
              this.setState({
                cerStatus: resp2.msg
              })
            })
          })
        }
      });
    })
  }

  showCerImageCancel = () => {
    this.setState({
      showCerImage: false,
      showDownload: false
    })
  }

  binbWxInfo = () => { // 绑定微信信息
    const item = {
      auth: getToken()
    }
    wx.miniProgram.navigateTo({ url: `/pages/toAuthorize/toAuthorize?items=${JSON.stringify(item)}` });
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({ refreshing: true });
    getDriverDetail({ userId: getCurrentUser().userId }).then(resp => {
      this.setState(
        { refreshing: false, driverDetail: resp.data }
      );
      localStorage.setItem('currentDriver', JSON.stringify(resp.data)) // 更新缓存
    })
  }

  versionUpdate = () => {
    const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const ifWx = window.__wxjs_environment === 'miniprogram'
    if (u && !ifWx) { // ios版本
      const message = {
        'versionUpdate': 'version',
      }
      window.webkit.messageHandlers.versionUpdateClick.postMessage(message);
    } else {
      const param = { 'paramKey': project === 'wlhy' ? `downloadapp.wlhy.driver` : `downloadapp.${clientId}` };
      param.tenantId = getTenantId();

      getSystemParamByParamKey(param).then(resp => {
        if (resp.success) {
          try {
            const versionName = '';
            const versionSplit = Version.getVersion(versionName);
            const verSplit = versionSplit.split('--');
            const { data } = resp
            if (func.notEmpty(data.paramValue)) {
              // 数据库版本比安卓版本高才会更新
              if (parseFloat(resp.data.paramValue) <= parseFloat(verSplit[1])) {
                Toast.info('已经是最新的版本了')
              } else {
                this.setState({
                  visible: true,
                });
              }
            } else {
              Toast.info('已经是最新的版本了')
            }
          } catch (e) {
            Toast.info('已经是最新的版本了')
          }
        }
      });
    }
  };

  handleOk = () => { // 区分大车奔腾与砂石
    if (currentTenant === 'login') {
      if (project === 'wlhy') {
        window.location.href = 'https://www.pgyer.com/esnz';
      } else if (clientId === 'kspt_driver') {
        window.location.href = 'https://www.pgyer.com/PB4q';
      } else if (clientId === 'kspt_shf') {
        window.location.href = 'https://www.pgyer.com/6H9w';
      } else if (clientId === 'kspt_cyf') {
        window.location.href = 'https://www.pgyer.com/BR6H';
      } else { // 企业端
        window.location.href = 'https://www.pgyer.com/q5FX';
      }
    } else if (currentTenant === '847975') {
      if (clientId === 'kspt_driver') {
        window.location.href = 'https://www.pgyer.com/8MiF';
      } else if (clientId === 'kspt_shf') {
        window.location.href = 'https://www.pgyer.com/qS0V';
      } else { // 企业端
        window.location.href = 'https://www.pgyer.com/C4Bn';
      }
    }
    this.setState({
      visible: false,
    });
  };

  render() {
    const { menu: { menuData } } = this.props;
    const { leaderstate, leaderstateName, color, showCerImage, cerImage, cerStatus, showDownload, driverDetail, refreshing, visible } = this.state;
    const topMenu = menuData.length > 0 ? menuData.filter(item => item.path === '/driverSide') : []
    const secondMenu = topMenu.length > 0 ? topMenu[0].children.filter(item => item.path === '/driverSide/personal') : []
    const secondMenus = secondMenu.length > 0 ? secondMenu[0].children : []
    const tenantId = getTenantId()
    const listSty = { marginTop: '45px', width: '100%', background: '#f0f2f5', paddingBottom: '84px' }
    return (
      <div>
        <NavBar
          mode="light"
          rightContent={[
            <a onClick={() => router.push('/driverSide/personal/personalSetting')}><Icon type="setting" /></a>
          ]}
        >
          我的
        </NavBar>
        <PullToRefresh
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        >
          <div style={listSty}>
            <Card className='card-header'>
              <Card.Header
                title={
                  <div style={{ marginLeft: '10px' }}>
                    {driverDetail.name || getCurrentUser().realname}<br />
                    {driverDetail.phone || getCurrentUser().account}<br />
                    <span style={{ color: 'blue' }}> {driverDetail.auditStatusName ? `司机${driverDetail.auditStatusName}` : '司机未进行认证'}</span>
                    <div style={{ fontSize: '12px', padding: '5px 0px' }}>{driverDetail.auditStatus == 2 ? `驳回原因：${driverDetail.remark}` : undefined}</div>
                  </div>}
                thumb={project === 'wlhy' ? `${logoImgUrl}/personalImg/wlhy.jpg` : `${logoImgUrl}/personalImg/${tenantId}.jpg`}
                thumbStyle={{ width: '20%' }}
              />
            </Card>
            <WhiteSpace />
            <List className='static-list'>
              <Item arrow="horizontal" onClick={() => router.push('/system/changepassword')} platform="android">
                <Icon type="lock" theme="twoTone" className='icon_name' /> 修改密码
              </Item>
              <Item arrow="horizontal" onClick={() => router.push('/driverSide/personal/myMessage')} platform="android">
                <Icon type="message" theme="twoTone" className='icon_name' /> 我的消息
              </Item>
              <Item arrow="horizontal" onClick={() => router.push('/driverSide/personal/feedback')} platform="android"><Icon type="save" theme="twoTone" className='icon_name' /> 意见反馈</Item>
              <Item arrow="horizontal" platform="android" onClick={() => this.setState({ showDownload: true })}>
                <Icon type="appstore" theme="twoTone" className='icon_name' /> APP二维码分享
              </Item>
              <Item arrow="horizontal" platform="android" onClick={this.versionUpdate}>
                <Icon type="upload" style={{ color: '#1890ff' }} className='icon_name' /> 版本更新
              </Item>
            </List>
            <Button icon='/image/plus.png' style={{ lineHeight: '2', marginTop: '20px', height: '40px' }} type="danger" onClick={this.logOut} block>
              退出登录
            </Button>
          </div>
        </PullToRefresh>

        <Modal
          width={1024}
          height={768}
          style={{ top: 20 }}
          visible={showCerImage}
          onOk={this.showCerImageCancel}
          onCancel={this.showCerImageCancel}
        >
          <div>
            <div style={{ textAlign: 'center' }}><img src={cerImage} style={{ width: '50%' }} /></div>
            <p />
            <div style={{ textAlign: 'center' }}>{cerStatus}</div>
          </div>
        </Modal>
        <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p style={{ fontSize: 20, fontWeight: 'bold' }}>发现新版本</p>
          <p>是否更新下载？</p>
        </Modal>
        <Modal
          title='APP二维码'
          width={540}
          height={400}
          visible={showDownload}
          onCancel={this.showCerImageCancel}
          bodyStyle={{ textAlign: 'center' }}
          footer={[
            <Button key="submit" type="primary" onClick={this.showCerImageCancel}>
              关闭
            </Button>,
          ]}
        >
          <img src={`${logoImgUrl}/downLoadImg/${currentTenant}_${clientId}.png`} />
          <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#1890FF', marginTop: '5px' }}>司机端</div>
        </Modal>
      </div>
    );
  }
}

export default PersonalCen;
