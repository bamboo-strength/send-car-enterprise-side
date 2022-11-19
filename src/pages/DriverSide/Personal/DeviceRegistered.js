import React, { PureComponent } from 'react';
import { Divider, Icon } from 'antd';
import { NavBar, WhiteSpace, WingBlank, Button, Toast, List, InputItem, Picker } from 'antd-mobile';
import router from 'umi/router';
import { isTrckno, isPhone } from '@/utils/utils.js';
import { trucksRegister } from '@/services/locus';
import _ from 'lodash';

class DeviceRegistered extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      deviceType: [1],
      itemName: '手机号',
      truckno: '',
      deviceno: '',
      deviceList: [
        { label: '手机注册', value: 1 },
        { label: '汉德', value: 3 },
        { label: '时焦', value: 15 },
      ],
    };
  }

  componentDidMount() {

  }

  handleInputChange = (filed, val) => {
    this.setState({ [filed]: val });
  };

  handleCommit = () => {
    const { deviceType, truckno, deviceno } = this.state;

    console.log(truckno)

    /*if (truckno && !isTrckno(truckno)) {
      return Toast.fail('车牌号格式不正确!', 1);
    }*/

    /*if (!deviceno) {
      return Toast.fail('请输入设备号', 1);
    }

    if (deviceType[0] === 1 && deviceno && !isPhone(deviceno)) {
      return Toast.fail('手机号格式不正确！', 1);
    }*/

    trucksRegister({ deviceType: deviceType[0], truckno, deviceno }).then(res => {
      if (res && res.success) {
        Toast.success('设备注册成功');

        this.setState({ deviceType: [1], truckno: '', deviceno: '' });
      } else {
        Toast.fail(_.replace(res.msg, 'IMEI', ''));
      }
    });
  };

  render() {
    const { deviceType, deviceList, truckno, deviceno, itemName } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/personalShipper')}
        >设备注册
        </NavBar>
        <div className='am-list'>
          <Picker
            title="设备类型"
            extra="请选择设备类型"
            data={deviceList}
            value={deviceType}
            cols={1}
            onChange={v => {
              let itemName = '设备号';
              if (v.includes(1)) {
                itemName = '手机号';
              }
              this.setState({ deviceType: v, itemName });
            }}>
            <List.Item arrow="horizontal"><span style={{ color: '#f00' }}>*</span>设备类型:</List.Item>
          </Picker>
          <InputItem
            placeholder={`请输入${itemName}`}
            onChange={(e) => {
              this.handleInputChange('deviceno', e);
            }}
            value={deviceno}
          ><span style={{ color: '#f00' }}>*</span>{itemName}:</InputItem>
          <InputItem
            placeholder="请输入车号"
            onChange={(e) => {
              this.handleInputChange('truckno', e);
            }}
            value={truckno}
          ><span style={{ color: '#f00' }}>*</span>车号:</InputItem>
          <Button type='primary' onClick={this.handleCommit} style={{marginTop:20,lineHeight:'47px'}}>提交</Button>
        </div>
      </div>
    );
  }
}

export default DeviceRegistered;
