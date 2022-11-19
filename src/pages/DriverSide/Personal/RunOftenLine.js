import { List, Button, SearchBar, Flex, NavBar, SwipeAction, WingBlank, Toast, Modal } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';
import { regularrouteList } from '../../../services/merDriver';
import { requestApi } from '../../../services/api';
import { getCurrentUser } from '@/utils/authority';

const { Item } = List;
const { alert } = Modal;

@connect(({ merDriver }) => ({
  merDriver,
}))

@createForm()
class RunOftenLine extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      lines: [],
    };
  }

  componentWillMount() {
    this.queryLines();
  }

  queryLines = () => {
    regularrouteList({ userId: getCurrentUser().userId }).then(resp => {
      //  console.log(resp)
      if (resp.success) {
        this.setState({
          lines: resp.data,
        });
      }
    });
  };

  deleteLine = (id) => {
    alert('删除', '确定删除?', [
      { text: '取消', style: 'default' },
      {
        text: '确定', onPress: () => {
          requestApi('/api/mer-driver-vehicle/regularroute/remove', { ids: id }).then(resp => {
            if (resp.success) {
              Toast.success(resp.msg);
              this.queryLines();
            }
          });
        },
      },
    ]);
  };

  render() {
    const { lines } = this.state;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
          rightContent={[
            <Icon key="1" type="plus" size='sm' onClick={() => router.push('/driverSide/personal/runOftenLineAdd')}/>,
          ]}
        >常跑路线
        </NavBar>
        {/*  <SearchBar
          maxLength={8}
          placeholder="请输入路线名称"
          onChange={(e)=>this.queryLines(e)}
          onCancel={()=>this.queryLines()}
        /> */}

        <List>
          {lines.map(i => (
            <SwipeAction
              style={{ backgroundColor: 'gray' }}
              autoClose
              right={[
                {
                  text: '删除',
                  onPress: () => this.deleteLine(i.id),
                  style: { backgroundColor: '#F4333C', color: 'white' },
                },
              ]}
              key={i.id}
            >
              <List className='static-list'>
                <Item>
                  <Flex justify='center'>
                    <Flex.Item>{i.departRegionName}</Flex.Item>
                    <Icon type="arrow-right"/>
                    <Flex.Item align='start'>{i.destinationRegionName}</Flex.Item>
                  </Flex>
                </Item>
              </List>
            </SwipeAction>
          ))}
        </List>
      </div>
    );
  }
}

export default RunOftenLine;
