import React,{PureComponent} from 'react';
import { getPageWithLicenseUrl } from '@/services/maintenance';
import { NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { router } from 'umi';

class Authorization extends PureComponent{

  state = {
    authUrl:''
  }

  componentDidMount() {
    getPageWithLicenseUrl({terminalType:1}).then(item => {
      if (item.success) {
        this.setState({
          authUrl: item.data.result.authUrl,
        });
      }
    });
  }

  render() {
    const {authUrl} = this.state
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
          router.push(`/shopcenter/maintenance`);
        }}
        >法人授权
        </NavBar>
        <div className='am-list'>
          <iframe src={authUrl} title='iframe' className='cer-iframe' />
        </div>
      </div>
    );
  }
}

export default Authorization
