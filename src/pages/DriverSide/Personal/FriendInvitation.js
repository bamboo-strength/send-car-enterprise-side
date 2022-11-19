import { List, Button, SearchBar, Flex, NavBar, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import { approval, receiveInvitationList, removeInvitation } from '../../../services/merDriver';

const { Item } = List;

@connect(({ merDriver }) => ({
  merDriver,
}))

@createForm()
class FriendInvitation extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
    };
  }

  componentWillMount() {
    this.queryDrivers();
  }

  queryDrivers = (name) => {
    // console.log(name)
    receiveInvitationList().then(resp => {
      this.setState({
        listData: resp.data,
      });
    });
  };

  acceptReject = (inviteStatus, id) => {
    approval({ id, inviteStatus }).then(resp => {
      if (resp.success) {
        Toast.success(resp.msg);
        this.queryDrivers();
      }
    });
  };

  removeInvitation = (id) => {
    removeInvitation({ driverId: id, inviteType: '2' }).then(resp => {
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
        >好友邀请
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
              <Item key={i.id}>
                <Flex>
                  <Flex.Item style={{ lineHeight: '3' }}>
                    {i.sendInvitationDriverName}<br/>
                    {i.sendInvitationPhone}<br/>
                    <span style={{ color: 'orange' }}>{i.inviteStatusName}</span>
                    {/* 邀请你成为他的司机 */}
                  </Flex.Item>
                  {
                    i.inviteStatus === 0 ?
                      <Flex.Item align='star'>
                        <Button type="primary" size='small' inline style={{ margin: 0 }}
                                onClick={() => this.acceptReject(1, i.id)}>接受</Button> &nbsp;&nbsp;
                        <Button type="ghost" size='small' inline onClick={() => this.acceptReject(2, i.id)}
                                style={{ margin: 0 }}>拒绝</Button>
                      </Flex.Item> :
                      <Flex.Item align='star'>
                        <Button type="warning" size='small' inline style={{ margin: 0 }}
                                onClick={() => this.removeInvitation(i.id)}>删除</Button> &nbsp;&nbsp;
                      </Flex.Item>
                  }

                </Flex>
              </Item>
            ))}
          </List>
        </div>
      </div>
    );
  }
}

export default FriendInvitation;
