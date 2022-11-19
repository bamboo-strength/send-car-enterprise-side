import React, { PureComponent } from 'react';
import { Form, Card, Button, Icon, Row } from 'antd';
import styles from '../../layouts/Sword.less';
import { NavBar, InputItem, WhiteSpace, WingBlank, Toast, Flex } from 'antd-mobile';
import router from 'umi/router';
import Text from 'antd/es/typography/Text';
import { withdrawal, list } from '@/services/mybankcard';
import { walletaccount } from '@/services/allthebill';
import { orderTake } from '@/services/FreightServices';

@Form.create()
class WithDrawal extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      bank: '',
      bankName: '',
      withdrawable: '0',
      data: [],
      price: '',
      loading: false,
    };
  }

  componentWillMount() {
    const { data } = this.state;
    const param = {
      current: 1,
      size: 5,
    };
    walletaccount().then((res) => {
      this.setState({
        withdrawable: res.data.fund,
      });
    });
    list(param).then((res) => {
      res.data.map((column, index) => {
          console.log('column', column);
          console.log('index', index);
          if (column.isDefault === 0) {
            this.setState({
              bank: column.id,
              bankName: column.bankName,
            });
          }
        },
      );
      this.setState({
        data,
      });
    });
  }

  goReturn = () => {
    router.push('/wallet/wallet');
  };

  onChangePrice = (price) => {
    this.setState({
      price,
    });
    document.getElementById('orderAmount').value = price;
  };

  onChangeBank = (bank) => {
    this.setState({
      bank,
    });
  };

  handleSubmit = e => {

    e.preventDefault();
    const { form, } = this.props;
    const { bank, } = this.state;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        if (! /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/.test(values.orderAmount)) {
          Toast.info('请输入纯数字并且最多保留两位小数！')
          this.setState({
            loading: false,
          });
          return
        }
        const param = {
          orderAmount: values.orderAmount,
          id: bank,
        };
        console.log(param);
        withdrawal(param).then((item => {
          if (item.success) {
            Toast.success('提现成功');
            router.push('/wallet/wallet');
          }
          this.setState({
            loading: false,
          });
        }));
        // dispatch(MYBANKCARD_SUBMIT(params));
      } else {
        Toast.fail('请检查提现金额！');
      }
    });

  };

  render() {
    const { form } = this.props;
    const { getFieldDecorator } = form;
    const { loading, bankName, price, withdrawable } = this.state;


    const action = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.handleSubmit} loading={loading}>
          确认提现
        </Button>
      </WingBlank>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >提现
        </NavBar>
        <div className='am-list'>
          <Form style={{ marginTop: 8 }}>
            <Card className={styles.card} bordered={false}>
              <WhiteSpace size="lg" />
              <Flex justify="space-between" direction='column' className='walletCardFLex'>
                <div>
                  <Text>可提现金额(元)</Text>
                </div>
                <h2>
                  ￥{withdrawable}
                </h2>
              </Flex>
              <WhiteSpace size="lg" />
            </Card>
            <WhiteSpace />
            <Card className={styles.card} bordered={false}>
              <div align='left'>
                提现金额
                <Row gutter={8}>
                  {getFieldDecorator('orderAmount',
                    {
                      rules: [
                        {
                          required: true,
                          message: '不能为空',
                        },
                        {
                          pattern: /^\S.*\S$|(^\S{0,1}\S$)/,
                          message: '前后禁止输入空格',
                        },
                        {
                          pattern: /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/,
                          message: '请输入纯数字且最多保留两位小数',
                        },
                      ],
                      initialValue: price,
                    },
                  )
                  (
                    <InputItem
                      form={form}
                      className='inputItemDra'
                      onChange={this.onChangePrice}
                      maxLength={10}
                    >
                      ¥
                    </InputItem>,
                  )}
                </Row>
                <Row>
                  <InputItem
                    form={form}
                    value={bankName}
                    disabled
                  >
                    提现账户：
                  </InputItem>
                </Row>
              </div>
              {/* <div align='left'> */}
              {/*  <Picker */}
              {/*    title='提现账户' */}
              {/*    data={data} */}
              {/*    value={bank} */}
              {/*    cols={1} */}
              {/*    onChange={this.onChangeBank} */}
              {/*  > */}
              {/*    <List.Item arrow="horizontal">提现账户</List.Item> */}
              {/*  </Picker> */}
              {/* </div> */}

              {action}
            </Card>
          </Form>
        </div>
      </div>
    );
  }
}

export default WithDrawal;
