import { List, Button, SearchBar, Flex, NavBar, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import { toInvite, listCanInvite } from '../../../services/merDriver';

const { Item } = List;

@connect(({ merDriver }) => ({
  merDriver,
}))

@createForm()
class OrderGrabbing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      driverId: '',
      drivers: [],
    };
  }

  componentWillMount() {
    this.queryDrivers();
  }

  queryDrivers = (name) => {
    // console.log(name)
    const { dispatch } = this.props;
    // dispatch(MERDRIVER_LISTWITHOUTPAGE({phone:func.isEmpty(name)?undefined:name}))
    listCanInvite({ phone: func.isEmpty(name) ? undefined : name }).then(resp => {
      if (func.notEmpty(resp) && resp.success) {
        this.setState({
          drivers: resp.data,
        });
      }
    });
  };

  invite = (driverId) => {
    toInvite({ driverId }).then(resp => {
      if (resp.success) {
        Toast.info(resp.msg);
        router.push('/driverSide/personal/myDrivers');
      }
    });
  };

  render() {
    const { location, merDriver: { listData } } = this.props;
    const { drivers } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/myDrivers')}
        >添加司机
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={11}
            placeholder="请输入司机手机号"
            onChange={(e) => this.queryDrivers(e)}
            onCancel={() => this.queryDrivers()}
          />
          <List renderHeader={() => '您可以添加认证过的平台司机'} className='static-list'>
            {drivers.map(i => (
              <Item key={i.id}>
                <Flex style={{ paddingTop: '10px' }}>
                  <Flex.Item>{i.name}</Flex.Item>
                  <Flex.Item align='start'>{i.phone}</Flex.Item>
                  <Flex.Item align='end'><Button type='primary' inline size='small'
                                                 onClick={() => this.invite(i.id)}>邀请</Button></Flex.Item>
                </Flex>
              </Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default OrderGrabbing;
