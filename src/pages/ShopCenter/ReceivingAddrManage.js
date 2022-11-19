import React, { PureComponent } from 'react';
import { Form, Icon, Card, Radio, Empty } from 'antd';
import { NavBar, Modal, Toast } from 'antd-mobile';
import Text from 'antd/lib/typography/Text';
import RadioGroup from 'antd/es/radio/group';
import { router } from 'umi';
import { connect } from 'dva';
import { SHOPPING_ADDRESS_REMOVE, SHOPPING_ADDRESS_SETDEFAULT, SHOPPING_ADDRESS_SQUERYLIST, } from '@/actions/shoppingMall';
// import PageFault from '@/pages/ShopCenter/component/PageFault';
import { InTheLoad,PageFault } from '@/components/Stateless/Stateless';
import { IconDefault, IconIsDefault } from '@/components/Matrix/image';
import './ShopCenter.less'

const { alert } = Modal;

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class ReceivingAddrManage extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      isPageFault: false,
      data: [],
      rValue: '',
    };
  }

  componentDidMount() {
    this.addressData();
  }

  /* 请求地址列表 */
  addressData = () => {
    const { dispatch } = this.props;
    let { rValue } = this.state;
    dispatch(SHOPPING_ADDRESS_SQUERYLIST()).then(() => {
      const { shoppingmall: { data: { addressData } } } = this.props;
      if (addressData.success) {
        addressData.data.map(item => {
          if (item.isDefault === 0) {
            rValue = item.id;
          }
          return rValue;
        });
        this.setState({
          loading: true,
          data: addressData.data,
          rValue,
        });
      } else {
        this.setState({
          isPageFault: true,
        });
      }
    });
  };

  /* 跳转添加收货地址 */
  address = () => {
    router.push(`/shopcenter/addtheaddress`);
  };

  /* 跳转编辑收货地址 */
  editor = (item) => {
    router.push(
      {
        pathname: `/shopcenter/addtheaddress`,
        state: {
          data: item,
        },
      },
    );
  };

  /* 选择默认地址 */
  onChange = (e) => {
    const { dispatch } = this.props;
    dispatch(SHOPPING_ADDRESS_SETDEFAULT({ id: e.target.value })).then(() => {
      const { shoppingmall: { isDefault } } = this.props;
      if (isDefault.success) {
        Toast.success('设置默认地址成功');
        this.addressData();
      }
    });
  };

  /* 删除弹窗 */
  delete = (item) => {
    alert('删除', '确定删除该收货地址?', [
      { text: '取消' },
      {
        text: '确定', onPress: () => {
          const { dispatch } = this.props;
          Toast.loading('删除中');
          dispatch(SHOPPING_ADDRESS_REMOVE({ id: item.id })).then(() => {
            const { shoppingmall: { remove: { addresRemove } } } = this.props;
            if (addresRemove.success) {
              Toast.hide();
              Toast.success('删除地址成功');
              this.addressData();
            }
          });
        },
      },
    ]);
  };

  render() {
    const { loading, isPageFault, data, rValue } = this.state;
    const style = { marginBottom: 10 };
    const fontSize = { fontSize: 16 };
    const imgWidth = { width: 48, marginRight: 15 };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
          rightContent={[
            <Text onClick={this.address}>添加地址</Text>,
          ]}
        >收货地址管理
        </NavBar>
        {
          loading ? (
            <div className='am-list'>
              <div style={{ padding: 10 }}>
                {
                  data.length !== 0 ? (
                    <RadioGroup onChange={this.onChange} style={{ width: '100%' }} value={rValue}>
                      {
                        data.map(item => {
                          return (
                            <Card
                              style={style}
                              size="small"
                              bordered={false}
                              bodyStyle={{ display: 'flex', alignItems: 'center' }}
                            >
                              {
                                item.isDefault === 0 ? (
                                  <img src={IconDefault} alt='' style={imgWidth} />
                                ) : (
                                  <div style={{ background: `url(${IconIsDefault})`, ...imgWidth, }} className='img-address'>
                                    {item.name.substring(0,1)}
                                  </div>
                                )
                              }
                              <div style={{ width: 'calc( 100% - 63px )' }}>
                                <div style={{ ...fontSize, display: 'flex', flexWrap: 'wrap' }}><Text strong style={{marginRight:15}}>{item.name}</Text>{item.phone}</div>
                                <div style={{ ...fontSize, fontWeight: 'boid', margin: '6px 0', color: '#333',wordBreak: 'break-all' }}>
                                  {item.province}{item.city}{item.district}{item.address}
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center' }}>
                                  <Radio value={item.id}>设为默认</Radio>
                                  <div style={{ flex: '1', display: 'flex', justifyContent: 'flex-end', ...fontSize }}>
                                    <a onClick={() => this.delete(item)}>删除</a>&nbsp;&nbsp;&nbsp;&nbsp;
                                    <a onClick={() => this.editor(item)}>编辑</a>
                                  </div>
                                </div>
                              </div>
                            </Card>
                          );
                        })
                      }
                    </RadioGroup>
                  ) : <Empty style={{ marginTop: '30%' }} />
                }
              </div>
            </div>
          ) : isPageFault ? <PageFault /> : <InTheLoad />
        }
      </div>
    );
  }
}

export default ReceivingAddrManage;
