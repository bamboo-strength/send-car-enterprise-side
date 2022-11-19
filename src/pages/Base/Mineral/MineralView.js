import React, { PureComponent } from 'react';
import { Form, Card, Col } from 'antd';
import router from 'umi/router';
import { connect } from 'dva';
import { MINERAL_DETAIL} from '../../../actions/mineral';
import { Icon, NavBar } from 'antd-mobile';
import styles from '@/layouts/Sword.less';

const FormItem = Form.Item;



@connect(({mineral}) => ({
  mineral,
}))
@Form.create()
class MineralView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(MINERAL_DETAIL(id));
  }


  render() {
    const {
      mineral: { detail },
    } = this.props;
    const formItemLayout = {
      labelCol: {
        xs: { span: 10 },
        sm: { span: 12 },
      },
      wrapperCol: {
        xs: { span: 14 },
        sm: { span: 12 },
        md: { span: 10 },
      },
      labelAlign:'right'
    };



    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/mineral')}
        >查看
        </NavBar>
        <Form hideRequiredMark style={{ marginTop: 8 }}>
          <Card title="基本信息" className={styles.card} bordered={false} style={{ paddingBottom: '45px' }}>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="矿点">
              <span>{detail.minecode}</span>
            </FormItem>
            </Col>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="创建人">
              <span>{detail.createUserName}</span>
            </FormItem>
            </Col>
            <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="创建人">
              <span>{detail.createTime}</span>
            </FormItem>
            </Col>
          </Card>
        </Form>
      </div>
    );
  }
}

export default MineralView;
