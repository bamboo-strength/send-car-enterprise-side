import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { NavBar, Toast, Modal } from 'antd-mobile';
import { contractManageDownload, viewurl } from '@/services/contract';
import { router } from 'umi';
import cookie from 'react-cookies'

const { alert } = Modal;

class ContractView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      authUrl: '',
      downloadUrl:''
    };
  }

  componentDidMount() {

    const { match: { params: { id } } } = this.props;
    viewurl({ contractId: id }).then(item => {
      if (item.success) {
        window.location.href = item.data
        // this.setState({
        //   authUrl: item.data,
        // },()=>{
        //   const aa = item.data.substr(item.data.indexOf('=') + 1);
        //   console.log(aa)
        //   document.cookie = "name=openPageToken; path= /; domain=qiyuesuo.com"
        //   cookie.save('openPageToken',aa,{path:"/"})
        // });
      }
    });
  }

  download = () => {
    const { match: { params: { id } } } = this.props;
    alert('下载', '确定要下载此合同？', [
      { text: '取消', style: 'default' },
      {
        text: '确定',onPress: () => {
          Toast.loading('加载中')
          const ua = navigator.userAgent.toLowerCase();
          contractManageDownload({ contractId: id }).then(item => {
            if (item.success) {
              /* 苹果手机下载文件 */
              if (ua.indexOf('applewebkit') > -1 && ua.indexOf('mobile') > -1 && ua.indexOf('safari') > -1 &&
                ua.indexOf('linux') === -1 && ua.indexOf('android') === -1 && ua.indexOf('chrome') === -1 &&
                ua.indexOf('ios') === -1 && ua.indexOf('browser') === -1) {
                const src = item.data
                const iframe = document.createElement('iframe');
                iframe.style.display = 'none';
                iframe.src = `javascript: '<script>location.href="${  src  }"<\/script>'`;
                document.getElementsByTagName('body')[0].appendChild(iframe);
              } else {
                window.open(item.data);
              }
              Toast.hide()
            } else {
              Toast.hide()
              Toast.fail(item.msg);
            }
          });
        },
      },
    ]);
  };

  render() {
    const { authUrl } = this.state;
    console.log(authUrl)
    // return window.open('https://cloudapi.qiyuesuo.cn/contract/share/2901386620366291088?openPageToken=bc559cba-7a0a-41ef-8e66-b78dea2066df')
    console.log(cookie.load('openPageToken')?cookie.load('openPageToken'):'222')
    // Toast.success(cookie.load('openPageToken')?cookie.load('openPageToken'):'222')
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/shopcenter/contract`);
          }}
          rightContent={<a onClick={this.download}>下载</a>}
        >合同文本
        </NavBar>
        <div className='am-list contract'>
          {/* {authUrl? window.open(authUrl, '', 'height=100, width=400, top=60, left=0, toolbar=no, menubar=no, scrollbars=no, resizable=no, location=no, status=no')  :''} */}
          {/* {authUrl? window.location.href = authUrl:''} */}
          {/* { */}
          {/*  cookie.load('openPageToken')?<iframe src={authUrl} title='iframe' className='cer-iframe' />:'' */}
          {/* } */}
          {/* <canvas id="myCanvas" width="250" height="300"/> */}
          {/* <div id='ifra' /> */}
        </div>
      </div>
    );
  }
}

export default ContractView;
