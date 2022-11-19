import React, { PureComponent } from 'react';
import { Divider, Form, Icon,Card } from 'antd';
import { router } from 'umi';
import { Button, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import MatrixAddressArea from '@/components/Matrix/MatrixAddressArea';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import AgreeItem from 'antd-mobile/lib/checkbox/AgreeItem';

@Form.create()
class EpidemicAdd extends PureComponent {

  state = {
    checked:false
  }

  submit = ()=>{
    const { form } = this.props
    router.push('/epidemic/epidemiclineup')
    // form.validateFieldsAndScroll((errors, values) => {
    //   if (!errors){
    //     const {checked} = this.state
    //     if (!checked){
    //       Toast.fail('请先同意《用户服务协议》及《隐私政策》')
    //       return
    //     }
    //     const params = {
    //       ...values,
    //       checked
    //     }
    //     console.log(params)
    //     router.push('/epidemic/epidemiclineup')
    //   }
    // })
  }

  render() {
    const {form} = this.props
    const dividerStyle = { margin: 0, background: 'none' };
    const labelNumber = 7
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/queuematerial`);}}
        >修改设置
        </NavBar>
        <Card style={{borderRadius: '16px',}}>
        <div style={{margin: ('50px 17px 0px 0px')}}>
          <MatrixMobileInput id='name1' required label='货场名称' labelNumber={labelNumber} placeholder='请输入货场名称' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name2' required label='货场位置' labelNumber={labelNumber} placeholder='请输入货场位置' numberType='isMobile' type='number' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name3' required label='围栏半径' labelNumber={labelNumber} placeholder='请输入围栏半径' moneyKeyboardAlign='left' extra='公里' numberType='isIntGtZero' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name4' required label='开始时间' labelNumber={labelNumber} placeholder='请输入开始时间' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name5' required label='结束时间' labelNumber={labelNumber} placeholder='请输入结束时间' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name6' required label='排序字段' labelNumber={labelNumber} placeholder='请输入排序字段' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name7' required label='有效时长' labelNumber={labelNumber} placeholder='请输入有效时长' extra='分' moneyKeyboardAlign='left' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name8' required label='每次放行' labelNumber={labelNumber} placeholder='请输入每次放行车数' extra='辆' moneyKeyboardAlign='left' className='list-class' form={form} />
          <Divider style={dividerStyle} />

          <div className='btn-bg'>
            <Button style={{borderRadius:'20px',margin:('0px 8px 0 8px'),background:'#1cbc7a',color:'#fdfdfd'}}  onClick={this.submit}>保存</Button>
          </div>
        </div>
        </Card>
      </div>
    );
  }
}

export default EpidemicAdd;
