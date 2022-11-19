import { Button, List, NavBar, TextareaItem, Toast, WhiteSpace, WingBlank } from 'antd-mobile';
import React from 'react';
import { Form, Icon } from 'antd';
import router from 'umi/router';
import { submit } from '../../../services/feedback';
import { clientId, currentTenant } from '@/defaultSettings';


@Form.create()
class FeedBack extends React.Component {
  toSubimt=()=>{
    const {form} = this.props
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          userType:currentTenant === '847975' &&clientId === 'kspt_shf'?2:1,
          ...values
        };
        if (params.conment === undefined){
          Toast.info('请输入内容再提交!')
        }else {
          submit(params).then(resp =>{
            if(resp.success){
              Toast.success('提交成功',1)
              if ( clientId === 'kspt' || clientId === 'kspt_shf' ){
                router.push('/driverSide/personal/personalShipper')
              }else {
                router.push('/driverSide/personal/personalCenter')
              }
            }
          })
        }
      }
    });
  }

  render() {
    const { form:{getFieldProps}} = this.props

    let url=''
    if ( clientId === 'kspt' || clientId === 'kspt_shf' ){
      url ='/driverSide/personal/personalShipper'
    }else {
      url='/driverSide/personal/personalCenter'
    }

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(url)}
        >意见反馈
        </NavBar>

        <div className='am-list'>
          <List className='static-list'>
            <TextareaItem
              {...getFieldProps('conment', {
              })}
              rows={5}
              count={100}
            />
          </List>
          <div style={{marginTop:'50px'}}>
            <WhiteSpace />
            <WingBlank> <Button type="primary" style={{width:'100%',margin:'20px auto',padding: '9px',lineHeight: 'inherit'}} onClick={()=>this.toSubimt()}>提交</Button>
            </WingBlank>
          </div>
        </div>
      </div>
    );
  }
}

export default FeedBack;
