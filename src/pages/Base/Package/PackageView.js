import React, { PureComponent } from 'react';
import { Form, Card, Col } from 'antd/lib/index';
import router from 'umi/router';
import { FormattedMessage } from 'umi/locale';
import { connect } from 'dva/index';
import Panel from '../../../components/Panel';
import { PACKAGE_DETAIL } from '../../../actions/package';
import { Icon, NavBar } from 'antd-mobile';


const FormItem = Form.Item;

@connect(({ packages }) => ({
  packages,
}))
@Form.create()
class PackageView extends PureComponent {
  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(PACKAGE_DETAIL(id));
  }

  handleEdit = () => {
    const {
      match: {
        params: { id },
      },
    } = this.props;
    router.push(`/base/package/edit/${id}`);
  };

  render() {
    const {
      packages: { detail },
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
          onLeftClick={() => router.push('/base/package')}
        >查看包装物信息
        </NavBar>
        <div className='am-list'>
          <Form>
            <Card bordered={false}>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装代号'>
                  <span>{detail.pkid}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='物资'>
                  <span>{detail.materialnoName}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装名称'>
                  <span>{detail.pkname}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装单位'>
                  <div style={{ wordBreak: 'break-all' }}>{detail.unit}</div>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装数量(个)'>
                  <span>{detail.pkqty}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='包装重量(kg)'>
                  <span>{detail.pkwgt}</span>
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label='备注'>
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

export default PackageView;
