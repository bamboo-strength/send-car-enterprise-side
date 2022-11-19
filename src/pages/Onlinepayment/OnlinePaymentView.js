import React, { PureComponent } from 'react';
import { NavBar, Card } from 'antd-mobile';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';
import { getViewConf } from '@/components/Matrix/MatrixViewConfig';
import { connect } from 'dva/index';
import { Form, Drawer, Button,Radio,Icon } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import basic from '@/layouts/BasicLayout.less'

@connect(({ onlinePayment_onlinePayment, loading }) => ({
  onlinePayment_onlinePayment,
  loading: loading.models.onlinePayment_onlinePayment,
}))
@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class OnlinePaymentView extends PureComponent {
  state = {
    showColums: [],
    visible: false,
    placement: 'bottom',
    value:1
  };

  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({
      tableName: 'onlinePayment',
      modulename: 'onlinePayment',
      queryType: 3,
    })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data != undefined) {
        if (data.columList !== null && data.columList != undefined) {
          const aa = data.columList;
          this.setState({
            showColums: aa.table_main,
          });
        }
      }
    });
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = e=>{
    console.log('radio checked',e.target.value);
    this.setState({
      value:e.target.value
    })
  }

  render() {
    const data = {
      begintime: '2020-05-01 10:51:31',
      billno: '100201',
      custno: '1300644031872634881',
      materialnos: '1',
      deptId: 1,
      endtime: '2020-11-28 10:51:35',
      vehicleno: '鲁s555',
      weightno: '222',
      money: '23',
    };
    const { form } = this.props;
    const { showColums, placement, visible,value } = this.state;
    const { getFieldDecorator } = form;
    const items = getViewConf(showColums, getFieldDecorator, data);

    const radiotmp = [{name:'支付宝支付',value:1,icon:'alipay-circle',color:'#06b4fd'},{name:'微信支付',value:2,icon:'wechat',color:'#09bb07'},
      {name:'银行卡支付',value:3,icon:'credit-card',color:'#ec3a4e'},{name:'钱包',value:4,icon:'wallet',color:'#ff7e00'}]
    const drawerTitle = <div className='drawerTitle'><span>请选择支付方式</span><Icon type="close" className='drawerIcon' onClick={this.onClose} /></div>

    return (
      <div>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() => router.push('/onlinepay/onlinepayment')}
        >支付详情
        </NavBar>
        <Card title='基本信息' className={`${styles.card} am-list`} bordered={false}>
          <Card.Header title='主信息' style={{ fontWeight: 'bold' }} />
          {items}
          <Button type="primary" block className='onlineBtn' onClick={this.showDrawer}>支付</Button>
          <Drawer
            title={drawerTitle}
            placement={placement}
            closable={false}
            onClose={this.onClose}
            visible={visible}
            className='drawerBox'
          >
            <Radio.Group onChange={this.onChange} value={value} style={{width:'100%'}}>
              {radiotmp.map(item =>{
                 return (<div className='ridioDiv'>
                   <Icon type={item.icon} style={{fontSize:'24px',marginRight:15,color:item.color}} theme="filled" />
                   <Radio className='radioStyle' value={item.value}>{item.name}</Radio>
                 </div>)
               })
             }
            </Radio.Group>
            <Button type='primary' block className='onlineBtn'>确认支付</Button>
            {/* <Button block className='onlineBtn' onClick={this.onClose}>取消</Button> */}
          </Drawer>
        </Card>
      </div>);
  }
}

export default OnlinePaymentView;
