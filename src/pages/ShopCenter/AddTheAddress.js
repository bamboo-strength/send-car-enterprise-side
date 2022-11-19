import React, { PureComponent } from 'react';
import { Divider, Form, Icon, Button } from 'antd';
import { NavBar, Toast } from 'antd-mobile';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import MatrixAddressArea from '@/components/Matrix/MatrixAddressArea';
import MatrixMobileSwitch from '@/components/MatrixMobile/MatrixMobileSwitch';
import './ShopCenter.less';
import { SHOPPING_ADDRESS_QUERYDETAIL, SHOPPING_ADDRESS_SAVE } from '@/actions/shoppingMall';
import { connect } from 'dva';

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class AddTheAddress extends PureComponent {

  state = {
    loading: false,
    data: {},
  };

  componentDidMount() {
    const { location: { state }, dispatch } = this.props;
    if (state) {
      const { location: { state: { data: { id } } } } = this.props;
      dispatch(SHOPPING_ADDRESS_QUERYDETAIL({ id })).then(() => {
        const { shoppingmall: { detail: { addressDetail } } } = this.props;
        if (addressDetail && addressDetail.success) {
          this.setState({
            data: addressDetail.data,
          });
        }
      });
    }
  }

  /* 提交 */
  submit = () => {
    const { form, dispatch, location: { state } } = this.props;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const { area, areaCode, address, isDefault,name,phone } = value;
        const names = area.split(',');
        const str = areaCode.split(',');
        const params = {
          province: names[0],
          provinceCode: str[0],
          city: names[1],
          cityCode: str[1],
          district: names[2],
          districtCode: str[2],
          address,
          isDefault: isDefault ? 0 : 1,
          id: state ? state.data.id : '',
          name,
          phone,
        };
        this.setState({
          loading: true,
        });
        dispatch(SHOPPING_ADDRESS_SAVE(params)).then(() => {
          const { shoppingmall: { submit: { addresSave } } } = this.props;
          if (addresSave && addresSave.success) {
            Toast.success(addresSave.msg);
            window.history.back();
          }else {
            Toast.fail(addresSave.msg)
          }
          this.setState({
            loading: false,
          });
        });
      }
    });
  };

  render() {
    const { form, location: { state } } = this.props;
    const { loading, data } = this.state;
    const dividerStyle = { margin: 0, background: 'none' };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >{state ? '编辑' : '添加'}收货地址
        </NavBar>
        <div className='am-list'>
          <MatrixMobileInput
            id='name'
            required
            label='收货人'
            placeholder='请输入收货人'
            className='list-class'
            form={form}
            initialValue={state ? data.name : ''}
          />
          <Divider style={dividerStyle} />
          <MatrixMobileInput
            id='phone'
            required
            label='手机号码'
            placeholder='请输入手机号码'
            className='list-class'
            numberType='isMobile'
            form={form}
            initialValue={state ? data.phone : ''}
          />
          <Divider style={dividerStyle} />
          <MatrixAddressArea
            id='area'
            idCode='areaCode'
            initialValue={state ? [data.provinceCode, data.cityCode, data.districtCode] : ''}
            required
            label='收货地址'
            placeholder='请选择地区'
            className='list-class'
            form={form}
          />
          <Divider style={dividerStyle} />
          <MatrixMobileInput
            id='address'
            required
            label='详细地址'
            placeholder='请输入详细地址'
            className='list-class'
            form={form}
            initialValue={state ? data.address : ''}
          />
          <Divider style={dividerStyle} />
          <MatrixMobileSwitch
            id='isDefault'
            disabled={false}
            initialValue={state ? data.isDefault === 0 : ''}
            label='设为默认地址'
            className='list-class'
            form={form}
          />
          <div style={{ padding: '0 12px', marginTop: 24 }}>
            <Button type="primary" shape="round" size='large' block onClick={this.submit} loading={loading}>
              保存
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

export default AddTheAddress;
