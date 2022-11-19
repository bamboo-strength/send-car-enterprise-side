import React from 'react';
import { getCurrentUser } from '@/utils/authority';
import { connect } from 'dva';
import { Card, List, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import { Button, Icon, Modal } from 'antd';
import func from '@/utils/Func';
import router from 'umi/router';
import { clientId, currentTenant, logoImgUrl, project } from '../../../defaultSettings';
import { getTenantId } from '../../Merchants/commontable';
import { MERDRIVER_DETAIL } from '../../../actions/merDriver';
import { U87 } from '@/components/Matrix/image';
import style from '../../../global.less';
import { getSystemParamByParamKey } from '@/services/param';

const { Item } = List;

@connect(({ merDriver }) => ({
  merDriver,
}))
class PersonalShipper extends React.Component {

  state = {
    visible: false,
    showDownload:false
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(MERDRIVER_DETAIL(getCurrentUser().userId));
  }

  handleCancel = () => {
    this.setState({
      visible: false,
      showDownload:false
    });
  };

  // 版本更新
  versionUpdate = () => {
    const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const ifWx = window.__wxjs_environment === 'miniprogram'
    if(u && !ifWx){ // ios版本
      const message = {
        'versionUpdate' : 'version',
      }
      window.webkit.messageHandlers.versionUpdateClick.postMessage(message);
    }else {
      const param = { 'paramKey': project === 'wlhy'?`downloadapp.wlhy.driver`:`downloadapp.${clientId}` };
      param.tenantId = getTenantId();

      getSystemParamByParamKey(param).then(resp => {
        console.log(resp)
        if (resp.success) {
          try {
            const versionName = '';
            const versionSplit = Version.getVersion(versionName);
            const verSplit = versionSplit.split('--');
            const {data} = resp
            if(func.notEmpty(data.paramValue)){
              // 数据库版本比安卓版本高才会更新
              if (parseFloat(resp.data.paramValue) <= parseFloat(verSplit[1])) {
                Toast.info('已经是最新的版本了')
              } else {
                this.setState({
                  visible: true,
                });
              }
            }else {
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
    if(currentTenant === 'login'){
      if (project === 'wlhy'){
        window.location.href = 'https://www.pgyer.com/esnz';
      }else if (clientId === 'kspt_driver'){
        window.location.href = 'https://www.pgyer.com/PB4q';
      }else if (clientId === 'kspt_shf'){
        window.location.href = 'https://www.pgyer.com/6H9w';
      }else if (clientId === 'kspt_cyf'){
        window.location.href = 'https://www.pgyer.com/BR6H';
      }else { // 企业端
        window.location.href = 'https://www.pgyer.com/q5FX';
      }
    }else if(currentTenant === '847975') {
      if (clientId === 'kspt_driver'){
        window.location.href = 'https://www.pgyer.com/8MiF';
      }else if (clientId === 'kspt_shf'){
        window.location.href = 'https://www.pgyer.com/qS0V';
      }else { // 企业端
        window.location.href = 'https://www.pgyer.com/C4Bn';
      }
    }
    this.setState({
      visible: false,
    });
  };


  logOut = () => { // 退出登录
    const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
    const ifWx = window.__wxjs_environment === 'miniprogram'
    if(u && !ifWx){ // ios环境 非小程序
      const message = {
        'name' : 'loginOutClick',
      }
      window.webkit.messageHandlers.loginOutClick.postMessage(message);
    }else {
      const { dispatch } = this.props;
      let tenant = '';
      if (getCurrentUser() !== null && getCurrentUser().tenantId !== undefined && getCurrentUser().tenantId !== 'undefined' && getCurrentUser().tenantId !== null) {
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

  render() {
    const { merDriver: { detail } } = this.props;
    const {visible,showDownload} = this.state;
    const title = <div style={{ marginLeft: 10, lineHeight: '1.5' }}>
      {func.notEmpty(detail.name) ? detail.name : getCurrentUser().realname}<br />
      {func.notEmpty(detail.phone) ? detail.phone : getCurrentUser().account}
    </div>;
    const  tenantId = getTenantId()

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
        <div className='am-list'>
          <Card className='card-header'>
            <Card.Header title={title} thumb={`${logoImgUrl}/personalImg/${tenantId}.jpg`} thumbStyle={{ width: '20%' }} />
          </Card>
          {
            currentTenant === '847975' && (
              <div className={style.kswallet} onClick={()=>router.push('/kswallet/wallhomepage')}>
                <div className="imgRound"><img src={U87} alt='' /></div>
                我的钱包
              </div>
            )
          }
          <List className='static-list shipper_list'>
            {
              clientId !=='kspt'?
                <Item arrow="horizontal" onClick={() => router.push('/system/changepassword')} platform="android">
                  <Icon type="lock" theme="twoTone" className='icon_name' /> 修改密码
                </Item>:undefined
            }
            {/*   <Item arrow="horizontal" onClick={() => router.push('/driverSide/personal/myMessage')} platform="android">
            <Icon type="message" theme="twoTone" className='icon_name' /> 我的消息
          </Item> */}
            <Item arrow="horizontal" onClick={() => router.push('/driverSide/personal/feedback')} platform="android">
              <Icon type="save" theme="twoTone" className='icon_name' /> 意见反馈
            </Item>
            <Item arrow="horizontal" platform="android" onClick={this.versionUpdate}>
              <Icon type="upload" style={{ color: '#1890ff' }} className='icon_name' /> 版本更新
            </Item>
            <Item arrow="horizontal" platform="android" onClick={()=>this.setState({showDownload:true})}>
              <Icon type="appstore" theme="twoTone" className='icon_name' /> APP二维码分享
            </Item>
          </List>
          <WhiteSpace />
          <Item arrow="horizontal" platform="android" onClick={this.logOut}>
            <Icon type="logout" style={{ color: 'red' }} className='icon_name' /> 退出登录
          </Item>
        </div>

        <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p style={{ fontSize: 20, fontWeight: 'bold' }}>发现新版本</p>
          <p>是否更新下载？</p>
        </Modal>
        <Modal
          title='APP二维码'
          width={540}
          height={400}
          visible={showDownload}
          onCancel={this.handleCancel}
          bodyStyle={{textAlign: 'center'}}
          footer={[
            <Button key="submit" type="primary" onClick={this.handleCancel}>
              关闭
            </Button>,
          ]}
        >
          <img src={`${logoImgUrl}/downLoadImg/${currentTenant}_${clientId}.png`} />
          <div style={{fontWeight: 'bold',fontSize: '18px', color: '#1890FF', marginTop: '5px'}}>{clientId ==='kspt'?'企业端':'客户端'}</div>
        </Modal>
      </div>
    );
  }
}

export default PersonalShipper;


