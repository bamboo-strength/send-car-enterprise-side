import React, { PureComponent } from 'react';
import { Button, NavBar, Toast } from 'antd-mobile';
import { Divider, Form, Icon } from 'antd';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { router } from 'umi';
import { connect } from 'dva';
import { MAINTENACE_ACCOUNT_DETAIL, MAINTENACE_ACCOUNT_SAVE, MAINTENACE_ACCOUNT_UPDATE } from '@/actions/maintenance';

@connect(({ maintenance }) => ({
  maintenance,
}))
@Form.create()
class NewAccounts extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      detail: {},
    };
  }

  componentDidMount() {
    const { match: { params: { type } }, dispatch } = this.props;
    if (type !== 'information') {
      dispatch(MAINTENACE_ACCOUNT_DETAIL()).then(() => {
        const { maintenance: { detail: { accountDetail } } } = this.props;
        if (accountDetail && accountDetail.success) {
          this.setState({
            detail: accountDetail.data,
          });
        }
      });
    }
  }

  /* 查看跳转修改页面 */
  Information = () => {
    router.push(`/shopcenter/maintenance/newaccounts/informationEdit`);
  };

  /* 提交 */
  onBtn = () => {
    const { form, match: { params: { type } }, dispatch } = this.props;
    const { detail } = this.state;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        /* 新增开户信息提交 */
        if (type === 'information') {
          dispatch(MAINTENACE_ACCOUNT_SAVE(value)).then(() => {
            const { maintenance: { submit: { accountSave } } } = this.props;
            if (accountSave && accountSave.success) {
              Toast.success('保存成功');
              router.push(`/shopcenter/maintenance`);
              this.setState({
                loading: false,
              });
            }
          });
        } else {
          /* 修改开户信息提交 */
          const params = {
            ...value,
            id: detail.id,
          };
          dispatch(MAINTENACE_ACCOUNT_UPDATE(params)).then(() => {
            const { maintenance: { submit: { accountUpdate } } } = this.props;
            if (accountUpdate && accountUpdate.success) {
              Toast.success('修改成功');
              router.push(`/shopcenter/maintenance`);
              this.setState({
                loading: false,
              });
            }
          });
        }
      }
    });
  };

  render() {
    const { form, match: { params: { type } } } = this.props;
    const { loading, detail } = this.state;
    const labelNumber = 7;
    const dividerStyle = { margin: 0, background: 'none' };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/shopcenter/maintenance`);
          }}
        > {type === 'informationEdit' ? '修改企业信息' : type === 'informationView' ? '企业开户信息' : '新增开户信息'}
        </NavBar>
        <div className='am-list'>
          <MatrixMobileInput
            required
            id='accountBank'
            label='开户银行'
            placeholder='请输入开户银行'
            labelNumber={labelNumber}
            initialValue={type !== 'information' ? detail.accountBank : ''}
            disabled={type === 'informationView'}
            form={form}
          />
          <Divider style={dividerStyle} />
          <MatrixMobileInput
            required
            id='accountNo'
            numberType='isBankCardNo'
            label='开户银行账号'
            placeholder='请输入开户银行账号'
            labelNumber={labelNumber}
            initialValue={type !== 'information' ? detail.accountNo : ''}
            disabled={type === 'informationView'}
            form={form}
          />
          {
            type !== 'informationView' ? (
              <div style={{ padding: '15px 3px' }}>
                <Button type="primary" onClick={this.onBtn} loading={loading}>保存</Button>
              </div>
            ) : (
              <div className='goodCart cer-view' onClick={this.Information}>
                修改
              </div>
            )
          }
        </div>
      </div>
    );
  }
}

export default NewAccounts;
