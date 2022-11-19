import React, { PureComponent } from 'react';
import { Button,NavBar } from 'antd-mobile';
import { Divider, Form, Icon } from 'antd';
import { router } from 'umi';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';

@Form.create()
class ARefund extends PureComponent {

  submit = () =>{
    const { form } = this.props
    form.validateFieldsAndScroll((errors, values) => {
      if (!errors){
        console.log(values)
      }
    })
  }

  render() {
    const { form } = this.props
    const dividerStyle = { margin: 0, background: 'none' };
    const labelNumber = 7
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/epidemic/freightyard`);}}
        >申请退款
        </NavBar>
        <div className='am-list' style={{background:'white'}}>
          <MatrixMobileInput id='name1' required label='退款车牌号' labelNumber={labelNumber} placeholder='请输入退款车牌号' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name1' required label='退款金额' labelNumber={labelNumber} placeholder='请输入退款金额' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <MatrixMobileInput id='name1' required label='退款原因' labelNumber={labelNumber} placeholder='请输入退款原因' className='list-class' form={form} />
          <Divider style={dividerStyle} />
          <NetWorkImage label='微信支付截图' id='imgUrl7' labelNumber={labelNumber} required form={form} />
          <Divider style={dividerStyle} />
          <div className='btn-bg'>
            <Button type='primary' block onClick={this.submit}>审核提交</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default ARefund;
