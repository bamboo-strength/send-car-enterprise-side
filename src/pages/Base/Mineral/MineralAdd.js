
    import React, { PureComponent } from 'react';
    import { Form, Input, Card, Col } from 'antd';
    import { FormattedMessage } from 'umi/locale';
    import { connect } from 'dva';
    import Panel from '../../../components/Panel';
    import { MINERAL_SUBMIT ,MINERAL_INIT,UPDATESTATE} from '../../../actions/mineral';
    import { Icon, NavBar,Button } from 'antd-mobile';
    import router from 'umi/router';
    import styles from '@/layouts/Sword.less';

    const FormItem = Form.Item;
    const { TextArea } = Input;
    @connect(({ mineral, loading }) => ({
      mineral,
      submitting: loading.effects['base/mineral'],
    }))
    @Form.create()
    class MineralAdd extends PureComponent {
      componentWillMount() {
        const { dispatch } = this.props;
        dispatch(MINERAL_INIT( {
          code: []
        }));
      }

      handleSubmit = e => {

    e.preventDefault();
    const { dispatch, form } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (err) { return; }
      const params = {
        ...values,
      };
      dispatch(UPDATESTATE({ submitLoading: true }))
      dispatch(MINERAL_SUBMIT(params));
    });
  };



  render() {
    const {
      form: { getFieldDecorator },
      mineral:{submitLoading}
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
      <Button type="primary" onClick={this.handleSubmit} loading={submitLoading} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/mineral')}
        >新增矿点
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false} className={styles.card}>
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
export default MineralAdd;
