import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Input, Card, Select, message, TreeSelect, Switch, Col } from 'antd';
import router from 'umi/router';
import { Icon, NavBar, WhiteSpace, Button } from 'antd-mobile';
import styles from '../../../layouts/Sword.less';
import { GOODS_DETAIL, GOODS_SUBMIT, GOODS_DETAIL_M } from '../../../actions/GoodsActions';
import { getCurrentUser } from '../../../utils/authority';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const FormItem = Form.Item;
const { TextArea } = Input;
const { Option } = Select;

@connect(({ GoodsModels, loading }) => ({
  GoodsModels,
  loading: loading.models.GoodsModels,
}))
@Form.create()
class GoodsEdit extends PureComponent {
  state = {
    goodsView: null,
    isView: 'none',
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
          this.handleSwitch(true);
        } else {
          this.handleSwitch(false);
        }
      },
    );
    /*  dispatch(GOODS_INIT());  */
  }

  handleSubmit = e => {
    e.preventDefault();
    const {
      form,
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const params = {
          id,
          ...values,
          //  date: func.format(values.date),
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
            dispatch(GOODS_SUBMIT(params));
          } else if (params.id !== detail.id) {
              message.info(`${detail.name}该物资已经使用编码${values.code},请勿重复添加!`);
            } else {
              if (!this.state.goodsView) {
                params.deptId = 0;
              }
              ;
              dispatch(GOODS_SUBMIT(params));
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
        detail,
        init: { packagingName, deptTree },
      },
      form,
    } = this.props;

    //   const { data } = this.state;

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
      <Button type="primary" onClick={this.handleSubmit} style={{ marginTop: '20px' }}>
        提交
      </Button>
    );

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/base/goods')}
        >修改物料信息
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card bordered={false}>
              {/*                <FormItem {...formItemLayout} label="是否指定机构">
              <Switch checked={this.state.goodsView} onChange={this.handleSwitch} />
            </FormItem>

            <FormItem {...formItemLayout} label="选择机构" style={{display: this.state.isView}}>
              {getFieldDecorator('deptId',{
                rules: [{ required: this.state.goodsView, message: '请选择机构', }],
                initialValue: detail.deptId!=="0"?detail.deptId:""
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
              )}
            </FormItem>   */}
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
                    initialValue: detail.code,
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
                    initialValue: detail.name,
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
                    initialValue: detail.shortname,
                  })(<Input placeholder="请输入物资简称" maxLength={20} />)}
                </FormItem>
              </Col>
              <Col span={24} className='add-config'>
                <MatrixSelect
                  label="包装方式"
                  id="packaging"
                  form={form}
                  xs={9}
                  dictCode='packaging'
                  required
                  initialValue={detail.packaging}
                />
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
                    initialValue: detail.remark,
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

export default GoodsEdit;
