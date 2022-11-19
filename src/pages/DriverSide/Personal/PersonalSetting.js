import { List, NavBar, Toast } from 'antd-mobile';
import { Icon, Modal } from 'antd';
import React from 'react';
import { getCurrentUser } from '@/utils/authority';
import { connect } from 'dva';
import cookie from 'react-cookies';
import { logoffUser } from '../../../services/api';

const { Item } = List;

@connect(({ merDriver }) => ({
  merDriver,
}))
class PersonalCen extends React.Component {

  constructor(props) {
    super(props);
    this.state = {

    };
  }

  // versionUpdate = () => {
  //   const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/);
  //   const ifWx = window.__wxjs_environment === 'miniprogram'
  //   if(u && !ifWx){ // ios版本
  //     const message = {
  //       'versionUpdate' : 'version',
  //     }
  //     window.webkit.messageHandlers.versionUpdateClick.postMessage(message);
  //   }else {
  //     const param = { 'paramKey': project === 'wlhy'?`downloadapp.wlhy.driver`:`downloadapp.${clientId}` };
  //     param.tenantId = getTenantId();
  //
  //     getSystemParamByParamKey(param).then(resp => {
  //       console.log(resp)
  //       if (resp.success) {
  //         try {
  //           const versionName = '';
  //           const versionSplit = Version.getVersion(versionName);
  //           const verSplit = versionSplit.split('--');
  //           const {data} = resp
  //           if(func.notEmpty(data.paramValue)){
  //             // 数据库版本比安卓版本高才会更新
  //             if (parseFloat(resp.data.paramValue) <= parseFloat(verSplit[1])) {
  //               Toast.info('已经是最新的版本了')
  //             } else {
  //               this.setState({
  //                 visible: true,
  //               });
  //             }
  //           }else {
  //             Toast.info('已经是最新的版本了')
  //           }
  //         } catch (e) {
  //           Toast.info('已经是最新的版本了')
  //         }
  //       }
  //     });
  //   }
  //
  // };

  logOff=()=>{ // 账户注销
    const { dispatch } = this.props;
    let tenant = '';
    if (getCurrentUser() !== null && getCurrentUser().tenantId !== undefined && getCurrentUser().tenantId !== 'undefined' && getCurrentUser().tenantId !== null) {
      tenant = getCurrentUser().tenantId;
    }
    Modal.confirm({
      title: '注销确认',
      content: '是否确定注销登录账号？注销后,账号需要重新申请，频繁操作可能影响账号使用',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        logoffUser().then((resp)=>{
          if(resp.success){
            Toast.info('注销成功')
            // localStorage.removeItem('rememberAccount');
            // localStorage.removeItem('rememberPwd');
            cookie.remove('rememberAccount')
            cookie.remove('rememberPwd')
            dispatch({
              type: 'login/logout',
              payload: tenant,
            });
          }
        })
      },
      onCancel() {
      },
    });
  }

  // handleOk = () => { // 区分大车奔腾与砂石
  //   if(currentTenant === 'login'){
  //     if (project === 'wlhy'){
  //       window.location.href = 'https://www.pgyer.com/esnz';
  //     }else if (clientId === 'kspt_driver'){
  //       window.location.href = 'https://www.pgyer.com/PB4q';
  //     }else if (clientId === 'kspt_shf'){
  //       window.location.href = 'https://www.pgyer.com/6H9w';
  //     }else if (clientId === 'kspt_cyf'){
  //       window.location.href = 'https://www.pgyer.com/BR6H';
  //     }else { // 企业端
  //       window.location.href = 'https://www.pgyer.com/q5FX';
  //     }
  //   }else if(currentTenant === '847975') {
  //     if (clientId === 'kspt_driver'){
  //       window.location.href = 'https://www.pgyer.com/8MiF';
  //     }else if (clientId === 'kspt_shf'){
  //       window.location.href = 'https://www.pgyer.com/qS0V';
  //     }else { // 企业端
  //       window.location.href = 'https://www.pgyer.com/C4Bn';
  //     }
  //   }
  //
  //   this.setState({
  //     visible: false,
  //   });
  // };

  handleCancel = () => {
    this.setState({
      visible: false,
    });
  };

  render() {
    const {visible} = this.state
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.history.back()}
        >
          设置
        </NavBar>
        <div className='am-list' style={{paddingBottom:'84px'}}>
          <List className='static-list'>
            {/* <Item arrow="horizontal" platform="android" onClick={this.versionUpdate}> */}
            {/*  <Icon type="upload" style={{ color: '#1890ff' }} className='icon_name' /> 版本更新 */}
            {/* </Item> */}
            <Item arrow="horizontal" platform="android" onClick={this.logOff}>
              <Icon type="warning" style={{ color: 'red' }} className='icon_name' /> 账号注销
            </Item>
          </List>
        </div>
        <Modal visible={visible} onOk={this.handleOk} onCancel={this.handleCancel}>
          <p style={{ fontSize: 20, fontWeight: 'bold' }}>发现新版本</p>
          <p>是否更新下载？</p>
        </Modal>
      </div>
    );
  }
}

export default PersonalCen;
