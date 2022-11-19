import React, { PureComponent } from 'react';
import { Form, Card, Col } from 'antd/lib/index';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva/index';
import Panel from '../../../components/Panel';
import { SPEC_DETAIL } from '../../../actions/spec';
import { Icon, NavBar } from 'antd-mobile';

const FormItem = Form.Item;


@connect(({ spec }) => ({
  spec,
}))
@Form.create()
class SpecView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(SPEC_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/base/spec/edit/${id}`);
  };

  render() {
    const {
      spec: { detail },
    } = this.props;

    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/base/spec')}
        >查看规格信息
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="规格">
                  <span>{detail.spec}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  <div style={{ wordBreak: 'break-all' }}>{detail.remark}</div>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="创建人">
                  <span>{detail.createUserName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="创建时间">
                  <span>{detail.createTime}</span>
                </FormItem>
              </Col>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default SpecView;
