import React, { PureComponent } from 'react';
import NetWorkList from '@/components/NetWorks/NetWorkList';
import { Col, Icon, Row, Radio, Input, Button, Form, message } from 'antd';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import router from 'umi/router';
import { NavBar } from 'antd-mobile';
import TextArea from 'antd/es/input/TextArea';
import { feedbacksave } from '@/services/networkfeefback';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixTextArea from '@/components/Matrix/MatrixTextArea';

@Form.create()
export class NetWorkFeefBack extends PureComponent {
  onClick = e =>{
    const {form} = this.props;
    form.validateFields((error,values)=>{
      const param={...values}
      console.log(error)
      if (error){
        return
      }
      console.log(values)
      // feedbacksave(param).then(resp=>{
      //   if (resp.success){
      //     message.success(resp.msg);
      //     router.push('/driverSide/personal/personalCenter')
      //   }
      // })
    })
  }
  render() {
    const {form} = this.props;
    const { getFieldDecorator } = form;
    const contactData = [
      <Row>
        {/*<span style="color:red">*</span>*/}
        {getFieldDecorator('adviceType', {
          rules: [
            {
              required: true,
            },
          ],
          initialValue: 1,
        })(
          <Radio.Group>
            <Radio.Button value={1}>产品缺陷</Radio.Button>
            <Radio.Button value={2}>功能建议</Radio.Button>
            <Radio.Button value={3}>产品需求</Radio.Button>
          </Radio.Group>
        )}
      </Row>,
    ];
    const Suggesttitle = [<MatrixInput id={'adviceTitle'} placeholder={'请输入标题'} xs={0} required form={form} />]
    const content = [<MatrixTextArea id={'describeRemark'} placeholder={'请输入详细内容描述'} xs={0} style={{ height: 150 }} required form={form}/>]
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >建议反馈中心
        </NavBar>
        <div className='am-list networkDetail'>
          <NetWorkList dataSource={contactData}  header='建议类型'/>
          <NetWorkList dataSource={Suggesttitle} header='建议标题'/>
          <NetWorkList dataSource={content} header='详细描述'/>
          <div style={{padding:'0 3%'}}>
            <Button type="primary" block size='large' onClick={this.onClick}>提交</Button>
          </div>
        </div>
      </div>
    );
  }
}

export default NetWorkFeefBack;
