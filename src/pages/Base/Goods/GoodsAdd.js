import React, { PureComponent } from 'react';
import { Form, Input, Card, Select, message, Switch, TreeSelect, Col } from 'antd';
import { connect } from 'dva';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import func from '@/utils/Func';
import { GOODS_DETAIL, GOODS_SUBMIT, GOODS_CLEAR_DETAIL, GOODS_DETAIL_M,UPDATESTATE } from '../../../actions/GoodsActions';
import { getCurrentUser } from '../../../utils/authority';
import MatrixSelect from '@/components/Matrix/MatrixSelect';


const FormItem = Form.Item;
const { TextArea } = Input;

@connect(({ GoodsModels }) => ({
  GoodsModels,
  // loading: loading.models.GoodsModels,
}))
@Form.create()
class GoodsAdd extends PureComponent {
  state = {
    goodsView: false,
    isView: 'none',
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    if (func.notEmpty(id)) {
      dispatch(GOODS_DETAIL(id));
    } else {
      dispatch(GOODS_CLEAR_DETAIL());
    }
    /*  dispatch(GOODS_INIT());  */
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form, dispatch } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          ...values,
          //   date: func.format(values.date),
        };
        const checkParams = {
          code: values.code,
          tenant_id: getCurrentUser().tenantId,
        };
        // 判断物资编码是否存在
        dispatch(GOODS_DETAIL_M(checkParams)).then(() => {
          const {
            GoodsModels: { detail },
          } = this.props;
          if (detail === null || detail.id == null || detail.id === 0) {
            if (!this.state.goodsView) {
              params.deptId = 0;
            };
            dispatch(UPDATESTATE({ submitLoading: true }))
            dispatch(GOODS_SUBMIT(params));
          } else {
            message.info(`${detail.name}该物资已经使用编码${values.code},请勿重复添加!`);
          }
        });
      }
    });
  };

  handleSwitch = checked => {
    console.log(`switch to ${checked}`);
    if (checked) {
      this.setState({
        isView: 'block',
      });
    } else {
      this.setState({
        isView: 'none',
      });
    }
    this.setState({
      goodsView: checked,
    });
  };

  render() {
    const {
      form: { getFieldDecorator },
      GoodsModels: {
        init: { packagingName, deptTree },
        submitLoading,
      },
      form,

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

    const action = (
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }} loading={submitLoading}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/goods')}
        >新增物料信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card bordered={false}>
              {/*    <FormItem {...formItemLayout} label="是否指定机构">
              <Switch defaultChecked={false} onChange={this.handleSwitch} />
            </FormItem>   */}

              {/*           <FormItem {...formItemLayout} label="选择机构" style={{display: this.state.isView}}>
              {
                getFieldDecorator('deptId', {
                  rules: [{ required: this.state.goodsView, message: '请选择机构', }]
                })(
                  <TreeSelect
                    disabled={!this.state.goodsView}
                    dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
                    treeData={deptTree}
                    allowClear
                    showSearch
                    treeNodeFilterProp="title"
                    placeholder="选择机构"
                  />
                )
              }
            </FormItem>    */}

              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资编码">
                  {getFieldDecorator('code', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物资编码',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入物资编码" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资名称">
                  {getFieldDecorator('name', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物资名称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入物资名称" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="物资简称">
                  {getFieldDecorator('shortname', {
                    rules: [
                      {
                        required: true,
                        message: '请输入物资简称',
                      },
                      {
                        pattern: /^[^\s]*$/,
                        message: '禁止输入空格',
                      },
                    ],
                  })(<Input placeholder="请输入物资简称" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect label="包装方式" id="packaging" form={form} xs={9} required dictCode='packaging' />
              </Col>
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="备注">
                  {getFieldDecorator('remark', {
                    rules: [
                      {
                        required: false,
                        message: '请填写备注内容',
                      },
                    ],
                  })(<TextArea style={{ minHeight: 32 }} placeholder="请填写备注内容" rows={4} maxLength={100} />)}
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

export default GoodsAdd;

