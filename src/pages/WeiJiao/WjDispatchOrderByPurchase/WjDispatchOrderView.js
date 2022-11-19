import React, { PureComponent, } from 'react';
import {  NavBar} from 'antd-mobile';
import router from 'umi/router';
import { Icon, Form, Card, Col } from 'antd';
import {weiJiaodetail} from '@/services/dispatchbill'
import styles from '@/layouts/Sword.less';
import Func from '@/utils/Func';

const FormItem = Form.Item;

@Form.create()
class WjDispatchOrderView extends PureComponent {

  state= {
    detail:{},
  }

  componentWillMount() {
    const {
      location
    } = this.props;
    weiJiaodetail({ id:location.state.rowData }).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
  }

  render() {
    const {
    } = this.props;
  const {detail} = this.state

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
          onLeftClick={() => router.push('/weiJiao/wjDispatchOrderByPurchase')}
        >派车单详情
        </NavBar>
        <Form hideRequiredMark className='am-list'>
          <Card title="基本信息" className={styles.card} bordered={false} style={{ paddingBottom: '45px' }}>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="派车单编号">
                <span>{detail.id}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="车号">
                <span>{detail.vehicleno}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="物资">
                <span>{detail.varietyName}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="供应商">
                <span>{detail.customernoName}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="随货同行量">
                <span>{detail.preamount}</span>
              </FormItem>
            </Col>
            <Col span={24} className='add-config'>
              <FormItem {...formItemLayout} label="录入时间">
                <span>{detail.inputtime}</span>
              </FormItem>
            </Col>
            {
              Func.isEmpty(detail.picture)?
                ""
                :
                <Col span={10}>
                  <FormItem {...formItemLayout} label="图片">
                    <Card
                      className={styles.card}
                      bordered={false}
                      cover={<img alt="example" src={detail.picture} />}
                    >
                    </Card>
                  </FormItem>
                </Col>
            }
          </Card>
        </Form>
      </div>
    );
  }
}
export default WjDispatchOrderView;
