import { List, Button, SearchBar, Checkbox, NavBar, WhiteSpace, WingBlank, Toast } from 'antd-mobile';
import React, { PureComponent } from 'react';
import { createForm } from 'rc-form';
import { Card, Icon, Input, message } from 'antd';
import router from 'umi/router';
import { listWithoutPage } from '@/services/merVehicle';
import { orderGrabbing } from '../../../services/dispatchbill';
import func from '@/utils/Func';
import { getCurrentUser } from '../../../utils/authority';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { getSystemParamByParamKey } from '@/services/param';
import { getTenantId } from '../../Merchants/commontable';

const { CheckboxItem } = Checkbox;

@createForm()
class OrderGrabbing extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checkState: false,
      cars: [],
      count: 0,
      vehicleChecked: [],
      ifNeedGua: false,
      vehicleAndGua: [],
    };
  }

  componentWillMount() {
    const param = { 'paramKey': 'dispatchbill.isHasTrailer' };
    param.tenantId = getTenantId();

    getSystemParamByParamKey(param).then(resp => {
      if (resp.success) {
        this.setState({
          ifNeedGua: func.notEmpty(resp.data.id),
        });
      }
    });
    this.queryVehByNo();
  }

  queryVehByNo = (no) => {
    // console.log(no,typeof no)
    const user = getCurrentUser();
    const dd = [];
    listWithoutPage({ userId: user.userId, truckno: func.isEmpty(no) ? undefined : no }).then(resp => {
      if (resp.success) {
        resp.data.forEach(item => {
          dd.push({
            value: item.id,
            label: item.truckno,
          });
        });
        this.setState({
          cars: dd,
        });
      } else {
        message.error('未获取到车辆信息！');
      }
    });
  };

  checkAll = (e) => {
    // console.log(e,'-------------e')
    this.setState({
      checkState: e.target.checked,
    });
  };

  onChange = (e, obj) => {
    let { count, vehicleChecked } = this.state;
    if (e.target.checked) {
      count++;
      vehicleChecked = func.addWithoutReapet(vehicleChecked, obj);
    } else {
      count--;
      vehicleChecked = vehicleChecked.filter(ii => ii !== obj);
    }
    this.setState({
      count,
      vehicleChecked,
    });
  };

  grabVehi = () => {
    const { vehicleChecked, ifNeedGua, vehicleAndGua } = this.state;
    const { location } = this.props;
    if (vehicleChecked.length < 1) {
      Toast.info('请选择车辆');
      return;
    }
    const vg = [];
    if (ifNeedGua) {
      // 需要挂车
      vehicleAndGua.forEach(item => {
        vehicleChecked.forEach(item2 => {
          if (item.includes(item2)) {
            vg.push({ truckno: item.split('-')[0], trailerno: item.split('-')[1] });
          }
        });
      });
    } else {
      vehicleChecked.forEach(item => {
        vg.push({ truckno: item, trailerno: '' });
      });
    }
    // console.log(location.state.wayBillId,location.state.tenantId)
    orderGrabbing({ waybillId: location.state.wayBillId, trucknos: vg }, location.state.tenantId).then(resp => {
      if (resp.success) {
        Toast.info(resp.msg);
        router.push('/driverSide/driverDispatch/driverOrder');
      }
    });
  };

  getGuaChe = (e, vehicleNo) => {
    const { vehicleAndGua } = this.state;
    // console.log(e.target.value,vehicleNo)
    if (vehicleAndGua.toString().includes(vehicleNo)) {
      // console.log(vehicleAndGua.findIndex(value=>value.includes(vehicleNo)))
      vehicleAndGua.splice(vehicleAndGua.findIndex(value => value.includes(vehicleNo)), 1, `${vehicleNo}-${e.target.value}`);
    } else {
      vehicleAndGua.push(`${vehicleNo}-${e.target.value}`);
      this.setState({
        vehicleAndGua,
      });
    }
    // console.log(vehicleAndGua,'-----')
  };

  render() {
    const { checkState, cars, count, vehicleChecked, ifNeedGua } = this.state;
    const { location, form } = this.props;

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push(location.state.backUrl)}
        >抢单
        </NavBar>
        <div className='am-list'>
          <SearchBar
            maxLength={8}
            placeholder="请输入车牌号查询"
            onChange={(e) => this.queryVehByNo(e)}
            onCancel={() => this.queryVehByNo()}
            //  onClear={()=>this.queryVehByNo()}
          />
          <List renderHeader={() => '请选择承运车辆'} className='static-list'>
            {/* <p>请选择承运车辆 <Checkbox onChange={(e) =>this.checkAll(e)}>全选</Checkbox> </p> */}
            {cars.map(i => (
              <div>
              <span>
                <CheckboxItem key={i.value} onChange={(e) => this.onChange(e, i.label)}
                              checked={vehicleChecked.includes(i.label)}>
                  {i.label}
                </CheckboxItem>
              </span>
                <span>{ifNeedGua ?
                  <Input label='guache' placeholder="请输入挂车车号" onChange={(e) => this.getGuaChe(e, i.label)}
                         maxLength='10' style={{ padding: '0px 20px' }}/> : ''}</span>
              </div>


            ))}
          </List>
          <div style={{ marginTop: '50px' }}>
            <WhiteSpace/>
            <p style={{ textAlign: 'center' }}>我已仔细阅读并同意《运输服务合同》内容</p>
            <WingBlank><Button type="primary" onClick={() => this.grabVehi()}>确定(抢{count}车)</Button></WingBlank>
          </div>
        </div>
      </div>
    );
  }
}

export default OrderGrabbing;
