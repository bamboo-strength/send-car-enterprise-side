import { Toast, List, NavBar, WhiteSpace, Button } from 'antd-mobile';
import React from 'react';
import { Form, Icon } from 'antd';
import router from 'umi/router';
import MatrixSSQ from '../../../components/Matrix/MatrixSSQ';
import { addOrUpdateLine } from '../../../services/merDriver';

const { Item } = List;

@Form.create()
class RunOftenLineAdd extends React.Component {

  toSubimt = () => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          departRegionId: values.departRegionIdcity,
          destinationRegionId: values.destinationRegionIdcity,
        };
        // console.log(params,'-------------')
        addOrUpdateLine(params).then(resp => {
          if (resp.success) {
            Toast.info(resp.msg);
            router.push('/driverSide/personal/runOftenLine');
          }
        });
      }
    });
  };

  render() {
    const { form } = this.props;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/runOftenLine')}
        >添加常跑路线
        </NavBar>
        <div className='am-list'>
          <List className='static-list'>
            <WhiteSpace/>
            <Item><MatrixSSQ label="出发地" id="departRegionId" required placeholde="请选择省市" form={form}/></Item>
            <Item><MatrixSSQ label="目的地" id="destinationRegionId" required placeholde="请选择省市" form={form}/></Item>
          </List>
          <Button type="primary" style={{ width: '50%', margin: '20px auto' }} onClick={() => this.toSubimt()}>
            确定
          </Button>
        </div>
      </div>
    );
  }
}

export default RunOftenLineAdd;
