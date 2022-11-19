import React, { PureComponent } from 'react';
import { Form, Input, Card, Col } from 'antd';
import { connect } from 'dva';
import {  MINERAL_SUBMIT,MINERAL_DETAIL} from '../../../actions/mineral';
import { Icon, NavBar,Button } from 'antd-mobile';
import router from 'umi/router';

const FormItem = Form.Item;
@connect(({ mineral, loading }) => ({
  mineral,
  submitting: loading.effects['base/mineral'],
}))
@Form.create()
class MineralEdit extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(MINERAL_DETAIL(id));
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      dispatch,
      match: {
        params: { id },
      },
      form,
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) return;
      const params = {
        id,
        ...values,
      };
      dispatch(MINERAL_SUBMIT(params));
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      mineral: {detail},
      submitting,
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 9 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };

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
          onLeftClick={() => router.push('/base/mineral')}
        >修改矿点
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false} style={{paddingBottom:'35px'}}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="矿点">
                  {getFieldDecorator('minecode', {
                    rules: [
                      {
                        required: true,
                        message: '请输入矿点',
                      },
                      {
                        pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                        message: '前后禁止输入空格',
                      },
                    ],
                    getValueFromEvent:(event) => {
                      return  event.target.value.replace(/(^\s*)|(\s*$)/g,"")
                    },
                    initialValue: detail.minecode,
                  })(<Input placeholder="请输入矿点" maxLength={50} />)}
                </FormItem>
              </Col>
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default MineralEdit;
