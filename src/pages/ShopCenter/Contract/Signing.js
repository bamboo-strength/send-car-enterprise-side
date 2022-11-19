import React, { PureComponent } from 'react';
import { Spin } from 'antd';
import { Modal } from 'antd-mobile';
import { router } from 'umi';
import Toast from 'antd-mobile/lib/toast';
import { contractManageDetail } from '@/services/contract';

const {alert} = Modal

class Signing extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { location,  }  = this.props;
    if (location.state){
      const {location: { state: { contractUrl } }} = this.props
      window.location.href = contractUrl
    }else {
      router.push(`/shopcenter/contract`)
    }
  }

  /* 取消 */
  onClose = () => {
    const contractId = localStorage.getItem('contractId')
    contractManageDetail({ contractId }).then(item=>{
      if (item.data.status === 'COMPLETE' || item.data.status === 'SIGNING'){
        router.push({
          pathname:`/shopcenter/contract`,
          state:{
            contractId,
            status:item.data.status
          }
        });
      }else {
        alert('取消合同', '确定要取消合同？', [
          { text: '取消' },
          {
            text: '确定', onPress: () => {
              Toast.success('取消成功');
              router.push('/shopcenter/makesuretheorder');
            },
          },
        ]);
      }
    })
  };

  render() {
    return (
      <div style={{width: '100%',height: '100vh',display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <Spin size="large" />
      </div>
    )
  }
}

export default Signing;
