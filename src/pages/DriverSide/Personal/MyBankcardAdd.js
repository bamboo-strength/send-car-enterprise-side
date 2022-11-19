import React, { PureComponent } from 'react';
import { Form, Card, Button, Icon, Select, AutoComplete, Input, message } from 'antd';
import { connect } from 'dva';
import styles from '../../../layouts/Sword.less';
import { NavBar, InputItem, WhiteSpace, WingBlank, Checkbox, List, Toast } from 'antd-mobile';
import router from 'umi/router';
import { clientId } from '@/defaultSettings';
import {MYBANKCARD_SUBMIT} from "@/actions/mybankcard";
import func from '@/utils/Func';
import { getTenantId } from '@/pages/Merchants/commontable';
import { autocomplete } from '@/services/matrixCommon';
import {getCardBin} from "@/services/mybankcard";
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const { Item } = List;
const {AgreeItem} = Checkbox;
const { Option } = Select;

@connect(({mybankcard, loading}) => ({
  mybankcard,
  loading: loading.models.mybankcard
}))
@Form.create()
class MyBankcardAdd extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bankCardType:'',
      bankName:'',
      bankCode:'',
      loading:false
    };
  }

  goReturn = ()=>{
    if (clientId === 'kspt_driver') {
      router.push('/driverSide/personal/myBankcard');
    } else {
      router.push('/driverSide/personal/myBankcard');
    }
  }

  handleSubmit = e => {
    // alert.info("信息填写有误,请修改后重试")
    e.preventDefault();
    const { form , dispatch, } = this.props;
    const{bankCardType}=this.state
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        values.bankCardType=bankCardType
        this.setState({
          loading:true
        })
        dispatch(MYBANKCARD_SUBMIT(values)).then(()=>{
          const {mybankcard:{detail}} = this.props
          console.log(detail)
          if (detail.success){
            Toast.success('添加银行成功')
            router.push('/driverSide/personal/myBankcard');
          }
          this.setState({
            loading:false
          })
        });
      }
    });
  };

  handleSearchtest = (value) => {
    this.setState({ result: [] });
    const { dataType, id,form} = this.props;
    if (func.notEmpty(value)) {
      getCardBin({ accountNo:value }).then(resp => {
        console.log("resp888",resp);
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({
            bankCardType:resp.data.bankCardType,
            bankName:resp.data.bankName,
            bankCode:resp.data.bankCode
          });
        } else {
          console.log('拼音码无返回值/检查参数是否正确');
        }
      });
      // }
    } else {
      // 显示值为空时 同时去掉隐藏域的值
      form.setFieldsValue({
        [id]: '',
      });
    }
  };


  render() {
    const { form: { getFieldProps },form, style } = this.props;
    const {bankCardType,bankName,bankCode,loading}=this.state
    const FormItem = Form.Item;
    const { getFieldDecorator } = form
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };

    const action = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.handleSubmit} loading={loading}>
        确定
        </Button>
      </WingBlank>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >添加银行卡
        </NavBar>
        <div className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <Card className={styles.card} bordered={false}>
              <WhiteSpace />
              <h4 align="center">请绑定持卡人本人的银行卡</h4>
              <WhiteSpace size="xl" />
              {/* <InputItem */}
              {/*  {...formItemLayout} */}
              {/*  {...getFieldProps('name')} */}
              {/*  style={style} */}
              {/*  clear */}
              {/*  placeholder="请输入持卡人姓名" */}
              {/* >持卡人 */}
              {/* </InputItem> */}
              {/* <InputItem */}
              {/*  {...getFieldProps('idcardNo')} */}
              {/*  clear */}
              {/*  maxLength={18} */}
              {/*  placeholder="请输入持卡人身份证号" */}
              {/* >身份证号 */}
              {/* </InputItem> */}
              {/* <FormItem {...formItemLayout} label='卡号测试'> */}
              {/*  {getFieldDecorator('accountNo') */}
              {/*  ( */}
              {/*    <AutoComplete */}
              {/*      style={style} */}
              {/*      onSearch={this.handleSearchtest} */}
              {/*      placeholder='请输入银行卡号' */}
              {/*      disabled */}
              {/*      allowClear */}
              {/*    > */}
              {/*      卡号测试 */}
              {/*    </AutoComplete>, */}
              {/*  )} */}
              {/* </FormItem> */}
              {/* <InputItem */}
              {/*  {...getFieldProps('bangkCardNo')} */}
              {/*  clear */}
              {/*  type="bankCard" */}
              {/*  placeholder="请输入持卡人本人银行卡号" */}
              {/* >卡号 */}
              {/* </InputItem> */}
              {/* <div className='am-list-item am-input-item am-list-item-middle'> */}
              {/*  <div className='cardLabel'>卡类型</div> */}
              {/*  {getFieldDecorator('cardType')( */}
              {/*    <Select placeholder='请选择卡类型'> */}
              {/*      <Option value={0}>储蓄卡</Option> */}
              {/*      <Option value={1}>信用卡</Option> */}
              {/*    </Select> */}
              {/*    )} */}
              {/* </div> */}
              {/* <InputItem */}
              {/*  {...getFieldProps('phoneNo')} */}
              {/*  type="phone" */}
              {/*  clear */}
              {/*  placeholder="请输入手机号" */}
              {/* >手机号 */}
              {/* </InputItem> */}
              <List className='static-list'>
                <WhiteSpace size="xl" />
                {
                  <div>
                    <Item>
                      <FormItem {...formItemLayout} label='银行卡号'>
                        {getFieldDecorator('accountNo',{
                       rules: [
                         {
                           required:true,
                           message: "不能为空",
                         },
                         {
                           pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                           message: '前后禁止输入空格',
                         },
                       ],
                     })(
                       <AutoComplete
                         onSearch={this.handleSearchtest}
                         placeholder='请输入银行卡号'
                         allowClear
                       />)}
                      </FormItem>
                    </Item>
                    {/* const list = [{value:'DEBIT_CARD',key:'个人账户'},{value:'ENTERPRISE_ACCOUNT',key:'对公账户'},] */}
                    {/* <Item><MatrixInput label="商户编号" placeholder="请输入商户编号" disabled required id="merchantNo" form={form}  /></Item> */}
                    <Item><MatrixInput
                      label="银行卡类型"
                      placeholder="请输入银行卡类型"
                      initialValue={bankCardType==='DEBIT_CARD'?'个人账户':bankCardType==='ENTERPRISE_ACCOUNT'?'对公账户':''}
                      disabled
                      required
                      id="bankCardType"
                      form={form}
                    />
                    </Item>
                    <Item><MatrixInput label="银行名称" placeholder="请输入银行名称" initialValue={bankName} disabled required id="bankName" form={form}  /></Item>
                    <Item><MatrixInput label="银行编码" placeholder="请输入银行编码" initialValue={bankCode} disabled required id="bankCode" form={form}  /></Item>
                    {/* <Item><MatrixInput label="卡密码" placeholder="请输入卡密码" required id="bankPass" form={form}  /></Item> */}
                  </div>
                }
              </List>
              {/* <AgreeItem data-seed="logId" align="center"> */}
              {/*  同意 <a onClick={(e) => { e.preventDefault(); alert('《用户协议》'); }}>《用户协议》</a> */}
              {/* </AgreeItem> */}
            </Card>
          </Form>
          {action}
        </div>
      </div>
    );
  }
}

export default MyBankcardAdd;
