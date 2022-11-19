import { List, Button, SearchBar, Checkbox, NavBar, WhiteSpace, WingBlank, Radio } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Icon, message } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import { connect } from 'dva';

import { assignableDriversList, assignDriver } from '../../../services/merDriver';

const { RadioItem } = Radio;

@connect(({ merDriver }) => ({
  merDriver,
}))
@createForm()
class AssignDrivers extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      listData: [],
      driverId: '',
    };
  }

  componentWillMount() {
    this.queryDriver();
  }

  queryDriver = (name) => {
    // console.log(name)
    assignableDriversList({ name: func.isEmpty(name) ? undefined : name }).then(resp => {
      this.setState({
        listData: resp.data,
      });
    });

  };

  onChange = (driverId) => {
    this.setState({
      driverId,
    });
  };

  assignDriverc = () => {
    const { driverId } = this.state;
    const { location } = this.props;
    const { truckId } = location.state;
    assignDriver({ driverId, truckId }).then(resp => {
      if (resp.success) {
        message.success(resp.msg);
        router.push('/driverSide/personal/myCars');
      }
    });
  };

  render() {
    const { location } = this.props;
    const { driverId, listData } = this.state;

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push(location.state.backUrl)}
        >分配司机
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={8}
            placeholder="请输入司机姓名查询"
            onChange={(e) => this.queryDriver(e)}
            onCancel={() => this.queryDriver()}
          />
          <List renderHeader={() => '选中司机后点击确定即可'} className='static-list'>
            {listData.map(i => (
              <RadioItem key={i.id} checked={driverId === i.id} onChange={() => this.onChange(i.id)}>
                {i.name} <List.Item.Brief>{i.phone}</List.Item.Brief>
              </RadioItem>
            ))}
          </List>
          <div style={{ marginTop: '50px' }}>
            <WhiteSpace/>
            <WingBlank><Button type="primary" onClick={() => this.assignDriverc()}>确定</Button></WingBlank>
          </div>
        </div>
      </div>
    );
  }
}

export default AssignDrivers;
