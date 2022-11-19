import React, { PureComponent } from 'react';
import { Card, Col, Form, Icon } from 'antd';
import { connect } from 'dva';
import { Button, NavBar, Toast } from 'antd-mobile';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import 'antd/dist/antd.less';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import { submitAudit } from '@/services/shoppingMall';


@connect(({ dept, loading }) => ({
  dept,
  submitting: loading.effects['dept/submit'],
}))
@Form.create()
class UploadCashDeposit extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
    };
  }

  handleSubmit=()=>{
    const {form,location:{state}}= this.props
    const formvalues=form.getFieldsValue()
    // console.log(formvalues.imageUrl)
    if(formvalues.imageUrl===undefined){
      Toast.fail('请选择上传图片')
    }else {
      const params={
        ...formvalues,
        activityId:state.id,
        activityType:state.activityType,
        activityName:state.activityTitle,
      }
      submitAudit( params ).then(resp=>{
        if(resp.success){
          Toast.success('提交成功')
          router.goBack()
        }
      })
    }

  }


  render() {
    const {form,location:{state}} = this.props;
    const action = (
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.goBack()}
        >新增
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={22} className='add-config'>
                <MatrixInput form={form} label="保证金金额" initialValue={state.earnestMoney} id='money' disabled placeholder="请输入保证金金额" required />
              </Col>
              <Col span={22} className='add-config'>
                <NetWorkImage label='保证金截图' id='imageUrl' required form={form} />
              </Col>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default UploadCashDeposit;
