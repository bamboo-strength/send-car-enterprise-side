import React, { PureComponent } from 'react';
import { Form, Card, Button, Icon, } from 'antd';
import { NavBar, InputItem, WhiteSpace,} from 'antd-mobile';
import router from 'umi/router';
import NetWorkPassWord from '@/components/NetWorks/NetWorkPassWord';
import { login, submit } from '@/services/paypassword';
import md5 from 'js-md5';

@Form.create()
class Authentication extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      value: 0,
      errorchance:4
    };
  }

  onRef = (ref) => {
    this.child = ref
  }

  passwordCheck = (e)=>{
    const {location,form} =this.props
    const {errorchance}=this.state
    login({password:md5(e)}).then((resp)=>{
      if(resp.success)
      {
        if(resp.data) {
          // Toast.success('密码正确')
          router.push(
            {
              pathname: location.state.path,
            },
          )
        }else
        {
          if(errorchance-1>0) {
            alert('支付密码错误，请重试', `您还有`+(errorchance-1)+`次重试机会`, [
              { text: '重试',},
              { text: '忘记密码', onPress: () => router.push(
                  {pathname:`/wallet/wallet/paypassword`,
                    state:{passwordstate:1}}
                ) },
            ])
            this.setState({
              errorchance:errorchance-1
            })
          }else
          {
            alert('支付密码错误，已错误4次，请点击忘记密码进行找回或30分钟后重试', '', [
              { text: '取消',onPress:()=>this.handleReset},
              { text: '忘记密码', onPress: () => router.push(
                  {pathname:`/wallet/wallet/paypassword`,
                    state:{passwordstate:1}}
                ) },
            ])
          }
        }
      }
    });
  }

  goReturn = ()=>{
    router.push('/wallet/wallet');
  }

  handleReset = () => {
    const { form } = this.props;
    form.resetFields();
  }


  render() {
    const {form}= this.props
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >验证身份
        </NavBar>
        <div className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <Card>
              <WhiteSpace size="lg"/>
              <div align='center'>请输入支付密码，以验证身份</div>
              <WhiteSpace size="xl"/>
              <NetWorkPassWord id='password' onRef={this.onRef} form={form} passwordcheck={(password)=>this.passwordCheck(password)}/>
              <WhiteSpace size="xl"/>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default Authentication;
