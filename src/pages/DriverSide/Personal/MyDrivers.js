import { List, Button, SearchBar, Flex, NavBar, WhiteSpace, SwipeAction, Toast } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import { initiateInvitationList, removeInvitation } from '../../../services/merDriver';

const { Item } = List;

@connect(({ merDriver }) => ({
  merDriver,
}))

@createForm()
class OrderGrabbing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      vehiNos: [],
      listData: [],
    };
  }

  componentWillMount() {
    this.queryDrivers();
  }

  queryDrivers = (phone) => {
    initiateInvitationList({ phone: func.isEmpty(phone) ? undefined : phone }).then(resp => {
      //  console.log(resp,'=============')
      this.setState({
        listData: resp.data,
      });
    });
  };

  removeInvitation = (id) => {
    removeInvitation({ driverId: id, inviteType: '1' }).then(resp => {
      if (resp.success) {
        Toast.info('解除成功');
        this.queryDrivers();
      }
    });
  };

  render() {
    const { location } = this.props;
    const { listData } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >我的司机
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={11}
            placeholder="请输入司机手机号"
            onChange={(e) => this.queryDrivers(e)}
            onCancel={() => this.queryDrivers()}
          />
          <List className='static-list'>
            {listData.map(i => (
              <SwipeAction
                style={{ backgroundColor: 'gray' }}
                autoClose
                right={[
                  {
                    text: '解除关系',
                    onPress: () => this.removeInvitation(i.id),
                    style: { backgroundColor: '#F4333C', color: 'white' },
                  },
                ]}
                key={i.id}
              >
                <List>
                  <Item key={i.id}>
                    <Flex>
                      <Flex.Item>{i.name}</Flex.Item>
                      <Flex.Item align='start'>{i.phone}</Flex.Item>
                      <Flex.Item align='end' style={{ color: 'orange' }}>{i.inviteStatusName}</Flex.Item>
                    </Flex>
                  </Item>
                </List>
              </SwipeAction>
            ))}
          </List>
          <WhiteSpace size='xl'/>
          <Button type="primary" onClick={() => {
            router.push('/driverSide/personal/inviteDrivers');
          }}>邀请司机</Button>
        </div>
      </div>
    );
  }
}

export default OrderGrabbing;
