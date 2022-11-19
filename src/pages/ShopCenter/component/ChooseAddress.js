import React,{PureComponent} from 'react';
import { Card, Form, Icon } from 'antd';
import Text from 'antd/es/typography/Text';
import { img198 } from '@/components/Matrix/image';
import { SHOPPING_ADDRESS_GETDEFAULTADDR, SHOPPING_ADDRESS_SQUERYLIST } from '@/actions/shoppingMall';
import { connect } from 'dva';
import { router } from 'umi';

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class ChooseAddress extends PureComponent{

  constructor(props) {
    super(props);
    this.state = {
      data:[],
      status:null,
      addDetail: {},
    }
  }

  componentDidMount() {
    this.addressData();
    const { dispatch,getAddressDetails } = this.props;
    /* 获取地址详情 */
    dispatch(SHOPPING_ADDRESS_GETDEFAULTADDR()).then(() => {
      const { shoppingmall: { detail: { addressDefaultDetail } } } = this.props;
      if (addressDefaultDetail && addressDefaultDetail.success) {
        if (getAddressDetails){
          getAddressDetails(addressDefaultDetail.data)
        }
        this.setState({
          addDetail: addressDefaultDetail.data,
          status: JSON.stringify(addressDefaultDetail.data) !== '{}' ? 0 : 1,
        });
      }
    });
  }

  /* 请求地址列表 */
  addressData = () => {
    const { dispatch } = this.props;
    dispatch(SHOPPING_ADDRESS_SQUERYLIST()).then(() => {
      const { shoppingmall: { data: { addressData } } } = this.props;
      this.setState({
        data:addressData.data
      })
    });
  };


  /* 添加收货地址 */
  addTheAddress = () => {
    router.push(`/shopcenter/addtheaddress`);
    const { state } = this.props;
    if (state) localStorage.setItem('settlementData', JSON.stringify(state));
  };

  /* 收货地址列表 */
  receivingAdd = () => {
    router.push('/shopcenter/receiving');
    const { state } = this.props;
    if (state) localStorage.setItem('settlementData', JSON.stringify(state));
  };

  render() {
    const bodyStyle = {flexDirection: 'row',marginBottom: 0,padding: 15}
    const {status,addDetail,data} = this.state
    return (
      <div>
        {
          status === 1 ? ( data.length === 0? (
            <Card className='plusAddress' bordered={false} onClick={this.addTheAddress} bodyStyle={bodyStyle}>
              <Icon type="plus" style={{ marginRight: 6 }} />
              <Text className='add-Text'>添加收货地址</Text>
            </Card>
            ):(
              <Card className='plusAddress' bordered={false} onClick={this.receivingAdd} bodyStyle={bodyStyle}>
                <Icon type="environment" style={{ marginRight: 6 }} />
                <Text className='add-Text'>设置默认地址</Text>
              </Card>
            )
          ) : (
            <Card className='plusAddress' bordered={false} onClick={this.receivingAdd} bodyStyle={bodyStyle}>
              <div className='addre-div'>
                收货地址<br />
                <Text><img src={img198} alt='' />{addDetail.province}{addDetail.city}{addDetail.district}{addDetail.address}</Text>
              </div>
              <Icon type="right" />
            </Card>
          )
        }
      </div>
    );
  }
}
export default ChooseAddress
