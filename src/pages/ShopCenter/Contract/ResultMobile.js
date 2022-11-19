import React,{PureComponent} from 'react';
import { Button, Result, Toast } from 'antd-mobile';
import { Icon } from 'antd';
import '../ShopCenter.less'
import { router } from 'umi';

class ResultMobile extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      status:''
    }
  }

  componentDidMount() {
    const {location:{state:{status}}} = this.props
    this.setState({
      status
    })
  }


  onClick = type =>{
    const {location:{state:{contractId}}} = this.props
    if (type === 'mall'){
      router.push(`/shopcenter/mallhomepage/list`);
    }else {
      router.push(`/shopcenter/contract/contractview/${contractId}`)
    }
  }

  render() {
    const {status} = this.state
    return (
      <Result
        img={<Icon type="check-circle" theme="filled" style={{color:'#4bd863',fontSize:72}} />}
        title={status === 'COMPLETE'?'签署成功，等待卖家审核':'签署中'}
        message={
          <div className='btn_round'>
            {/* <Button type="ghost" inline className="am-button-borderfix" onClick={()=>this.onClick('contract')}>查看合同</Button> */}
            <Button type="ghost" inline className="am-button-borderfix" onClick={()=>this.onClick('mall')}>返回商城</Button>
          </div>}
        className='ReasultMobile'
      />
    );
  }
}
export default ResultMobile
