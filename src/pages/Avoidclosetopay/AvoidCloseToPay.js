import React, { PureComponent } from 'react';
import { Icon, Divider, List, Button, Card } from 'antd';
import { NavBar } from 'antd-mobile';
import router from 'umi/router';

class AvoidCloseToPay extends PureComponent {
  constructor(props) {
    super(props);
     this.state = {
      hasChosen: true,
    };
  }

  hasChosen = (item) => {
    console.log(item)
    const aa = item.hasChosen;
    console.log(aa)
    this.setState({
      hasChosen:!item.hasChosen
    })
    console.log(aa)
  };

  render() {
    const {hasChosen} = this.state;
    const data = [{ text: '支付宝免密支付', icon: 'alipay-circle', value: 1, color: '#06b4fd',hasChosen: true }, {
      text: '微信免密支付', icon: 'wechat', value: 2, color: '#09bb07',hasChosen: true
    }, { text: '信用卡免密支付', icon: 'credit-card', value: 3, color: '#ec3a4e',hasChosen: true }];
    return (
      <div>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() => router.push('/dashboard/function')}
        >免密支付
        </NavBar>
        <div className='am-list'>
          <div className='avoid_pre'>
            <div className='pre_div'>
              <p>1</p>
              <span>请选择支付方式</span>
            </div>
            <Divider />
            <div className='pre_div pre_div2'>
              <p>2</p>
              <span>开通成功</span>
            </div>
          </div>
          <div style={{ padding: '5px 20px 0' }}>
            <h3>请选择一种支付方式</h3>
            <h4>选择的支付方式将用于系统的自动扣款功能</h4>
          </div>
          <List
            dataSource={data}
            className='avoid_list'
            renderItem={(item) => (<List.Item key={item.value}>
              <div><Icon type={item.icon} style={{ color: item.color, fontSize: '24px', marginRight: 10 }} /> {item.text}</div>
              <Button type='primary' onClick={() => this.hasChosen(item)} disabled={hasChosen === item.hasChosen ? '' : 'disabled'}>确认</Button>
            </List.Item>
            )}

          />
          {/* (<List.Item>
              <div><Icon type={item.icon} style={{color:item.color,fontSize:'24px',marginRight:10}} /> {item.text}</div>
              <Button type='primary' onClick={this.hasChosen.bind(this,item.value)} disabled={hasChosen === true?'':'disabled'}>确认</Button>
            </List.Item>
            ) */}
          <div style={{ padding: '5px 20px 0' }}>
            <h3>免密支付简介</h3>
          </div>
          <Card
            className='card_avoid'
          >&nbsp;&nbsp;&nbsp;&nbsp;小额免密免签支付，就是小额支付无须密码和消费者签名即可完成。在国际上，小额免密免签已是成熟的支付方式，在国内移动支付领域也广泛普及，支付宝、微信等支付工具均具有此功能，是银行卡默认开通的基础功能。
          </Card>
        </div>
      </div>
    );
  }
}

export default AvoidCloseToPay;
