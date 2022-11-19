import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Col } from 'antd';
import { Icon, NavBar } from 'antd-mobile';
import router from 'umi/router';
import Panel from '../../../components/Panel';
import styles from '../../../layouts/Sword.less';
import { GOODS_DETAIL } from '../../../actions/GoodsActions';


const FormItem = Form.Item;

@connect(({ GoodsModels, loading }) => ({
  GoodsModels,
  loading: loading.models.GoodsModels,
}))
@Form.create()
class GoodsView extends PureComponent {
  state = {
    isView: 'none',
    // data: {},
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;

    dispatch(GOODS_DETAIL(id)).then(() => {
        const {
          GoodsModels: { detail },
        } = this.props;
        if (detail.deptId !== 0) {
          this.setState({
            isView: 'block',
          });
        } else {
          this.setState({
            isView: 'none',
          });
        }
      },
    );
  }

  render() {
    const {
      GoodsModels: { detail },
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
          onLeftClick={() => router.push('/base/goods')}
        >查看物料信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark>
            <Card title="基本信息" className={styles.card} bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资编码">
                  <span>{detail.code}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资名称">
                  <span>{detail.name}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资简称">
                  <span>{detail.shortname}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="包装方式">
                  <span>{detail.packagingName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  <div style={{ wordBreak: 'break-all' }}>{detail.remark}</div>
                </FormItem>
              </Col>
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default GoodsView;
