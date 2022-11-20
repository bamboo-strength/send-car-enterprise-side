import React, { PureComponent } from 'react';
import { Form, Card, Button, Icon, Select, Col, Modal, message, Row, Alert, AutoComplete, Input } from 'antd';
import { connect } from 'dva';
import styles from '../../../layouts/Sword.less';
import { NavBar, InputItem, WhiteSpace, WingBlank, Checkbox, Toast, NoticeBar, List } from 'antd-mobile';
import router from 'umi/router';
import {CARLEADER_SUBMIT,CARLEADER_REMOVE} from "@/actions/carleader";
import MatrixInput from '@/components/Matrix/MatrixInput';
import { detail, remove } from '@/services/carleader';
import MyModal from '@/components/Util/MyModal';
import CarLeaderAgreement from '@/pages/DriverSide/Personal/CarLeaderAgreement';
import { getAuditStatus } from '../../../services/carleader';
const {AgreeItem} = Checkbox;
const { Option } = Select;
import { clientId,project } from '@/defaultSettings';
import func from '@/utils/Func';
import { getCarleader } from '@/services/carleader';
const { Item } = List;

@connect(({carleader, loading}) => ({
  carleader,
  loading: loading.models.carleader
}))
@Form.create()
class CarLeader extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      checked: false,
      photovisible:false,
      detail:{},
      carcaptainName:'',
      carcaptainIdno:'',
      remark:'',
      submitloading:false
    };
  }

  handleCancel = () => {
    this.setState({
      photovisible: false,
    });
  };

  componentWillMount() {
    const {location} =this.props

    detail().then((resp)=>{
      if(resp!=={})
      {
        this.setState({
          detail: resp.data,
          carleaderstate: true,
          carcaptainName: resp.data.carcaptainName,
          carcaptainIdno: resp.data.carcaptainIdno
        })
      }
    })

    let color=''
    if (project === 'wlhy') {
      getAuditStatus().then((resp) => {
        if (resp.data.data !== undefined) {
          switch (resp.data.data.status) {
            case 0:
              color = '#FF8000';
              break;
            case 1:
              color = '#00BB00';
              break;
            case 2:
              color = '#FF0000';
              break;
          }
          this.setState({
            leaderstate: resp.data.data.status,
            leaderstateName: resp.data.data.dictionary,
            remark: resp.data.data.remark,
            color: color
          })
        } else {
          this.setState({
            // leaderstate:resp.data.data.status,
            leaderstate: -1,
            leaderstateName: '未绑定',
            color: '#FF0000'
          })
        }
      })
    }
  }
  goReturn = ()=>{
    router.push('/driverSide/personal/personalCenter')
  }

  agreeItem = a =>{
    this.setState({
      checked:a.target.checked
    })
  }

  CarLeaderAgreement =(params, autoheight)=>{
    return <CarLeaderAgreement params={params} autoheight={autoheight} />;
  }

  unBundling=(e)=>{
    const { detail } = this.state;
    Modal.confirm({
      title: '解绑确认',
      content: '确定解绑该车队长吗？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        console.log('解绑');
        const params={
          ids:detail.id
        }
        remove(params).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/driverSide/personal/personalCenter')
          } else {
            // message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {
      },
    });
  }

  agreement =()=>{
    this.setState({
      photovisible: true,
    });
  }

  handleSearchCarleader = (value) => {
    value.preventDefault();
    const { dataType, id,form} = this.props;
    const driverPhone = document.getElementById("carcaptainPhone").value
    if (func.notEmpty(driverPhone)) {
      getCarleader({driverPhone}).then(resp => {
        console.log("resp888",resp);
        if (func.notEmpty(resp) && JSON.stringify(resp.data) !== '{}') {
          this.setState({
            carcaptainName:resp.data.name,
            carcaptainIdno:resp.data.jszh,
            carleaderstate:true
          });
          form.setFieldsValue({
            carcaptainName:resp.data.name,
            carcaptainIdno:resp.data.jszh,
          })
        } else {
          form.setFieldsValue({
            carcaptainName:'',
            carcaptainIdno:'',
          })
          // document.getElementById("carcaptainName").reset()
          // document.getElementById("carcaptainIdno").reset()
          this.setState({
            carcaptainName:'',
            carcaptainIdno:'',
            carleaderstate:false
          })
          console.log('拼音码无返回值/检查参数是否正确');
        }
      });
      // }
    }
    // else {
    //   // 显示值为空时 同时去掉隐藏域的值
    //   form.setFieldsValue({
    //     [id]: '',
    //   });
    // }
  };

  handleSubmit = e => {
    const { checked,carleaderstate,submitloading} = this.state;
    if (checked === false){
      Toast.offline('请先同意代收运费协议！')
      return
    }
    const { form , dispatch,
    } = this.props;
    if(carleaderstate) {
      this.setState({
        submitloading:true
      })
      form.validateFieldsAndScroll((err, values) => {
        if (!err) {
          const params = {
            ...values
          }
          dispatch(CARLEADER_SUBMIT(params)).then((res)=>{
            console.log(res);
          });
        }
      });
    }else{
      Toast.fail('请检查此手机号是否是车队长！')
    }
  };

  render() {
    const {checked,photovisible,detail,carcaptainName,carcaptainIdno,remark,submitloading}=this.state
    const {form,
      match: {
        params: { state },
      },
    }=this.props
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
    const action1 = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} loading={submitloading} onClick={this.handleSubmit}>
          提交
        </Button>
      </WingBlank>
    );
    const action2 = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.unBundling}>
          解绑
        </Button>
      </WingBlank>
    );

    return (
      <div>
        <Form>
        {state === '-1'?
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.goReturn}
            >车队长绑定申请
            </NavBar>
            <div className='am-list'>
              <Form style={{ marginTop: 8 }}>
                <Card className={styles.card} bordered={false}>
                  <Row>
                    <WhiteSpace size="lg" />
                  </Row>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="手机号"  onChange={this.handleSearchCarleader} placeholder="请输入手机号" numberType='isMobile' maxLength={11} id="carcaptainPhone" form={form} xs='5' required />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="姓名" disabled placeholder="请输入姓名" initialValue={carcaptainName} id="carcaptainName" form={form} xs='5' required  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="身份证" disabled placeholder="请输入身份证号" initialValue={carcaptainIdno} id="carcaptainIdno" xs='5' required form={form} numberType='isIdCardNo'  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    {/*<Checkbox onChange={a => this.agreeItem(a)} style={{marginTop:10}}>*/}
                    <AgreeItem data-seed="logId" checked={checked} onChange={a => this.agreeItem(a)}>
                    同意
                      <a
                        onClick={this.agreement}
                        // router.push('/network/waybill/waybillagreement')
                      >《代收运费协议》</a>
                    </AgreeItem>
                    {/*</Checkbox>*/}
                  </Col>
                </Card>
              </Form>
              {action1}
            </div>
          </div>
          :
          (state==='1'?
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.goReturn}
            >我的车队长
            </NavBar>
            <div className='am-list'>
              <Form style={{ marginTop: 8 }}>
                <Card className={styles.card} bordered={false}>
                  <Row>
                    <WhiteSpace size="lg" />
                    <Alert message="审核通过" type="success" showIcon />
                  </Row>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="手机号" placeholder="请输入手机号" id="carcaptainPhone" form={form} xs='5' maxLength='11' numberType='isMobile' initialValue={detail.carcaptainPhone} disabled required />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="姓名" disabled placeholder="请输入姓名" id="carcaptainName" form={form} xs='5' initialValue={detail.carcaptainName} disabled required  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="身份证" disabled placeholder="请输入身份证号" id="carcaptainIdno" xs='5' initialValue={detail.carcaptainIdno} disabled required form={form} numberType='isIdCardNo'  />
                  </Col>
                </Card>
              </Form>
              {action2}
            </div>
          </div>
            :
            (state==='0'?
          <div>
            <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={this.goReturn}
            >我的车队长
            </NavBar>
            <div className='am-list'>
              <Form style={{ marginTop: 8 }}>
                <Card className={styles.card} bordered={false}>
                  <Row>
                  <WhiteSpace size="lg" />
                    <Alert message="申请审核中，请耐心等待..." type="info" showIcon />
                  </Row>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="手机号"  placeholder="请输入手机号" id="carcaptainPhone" form={form} xs='5' initialValue={detail.carcaptainPhone} disabled required />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="姓名" disabled placeholder="请输入姓名" id="carcaptainName" form={form} xs='5' initialValue={detail.carcaptainName} disabled required  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="身份证" disabled placeholder="请输入身份证号" id="carcaptainIdno" xs='5' initialValue={detail.carcaptainIdno} disabled required form={form} numberType='isIdCardNo'  />
                  </Col>
                  <WhiteSpace size="lg" />
                </Card>
              </Form>
            </div>
          </div>
                :
          <div>
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={this.goReturn}
            >我的车队长
            </NavBar>
            <div className='am-list'>
              <Form style={{ marginTop: 8 }}>
                <Card className={styles.card} bordered={false}>
                  <Row>
                    <WhiteSpace size="lg" />
                    <Alert message={'驳回原因:'+remark} type="warning" showIcon />
                  </Row>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="手机号" placeholder="请输入手机号" onChange={this.handleSearchCarleader} numberType='isMobile' id="carcaptainPhone" form={form} xs='5' initialValue={detail.carcaptainPhone} required />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="姓名" disabled placeholder="请输入姓名" id="carcaptainName" form={form} xs='5' initialValue={carcaptainName} required  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    <MatrixInput label="身份证" disabled placeholder="请输入身份证号" id="carcaptainIdno" xs='5' initialValue={carcaptainIdno} required form={form} numberType='isIdCardNo'  />
                  </Col>
                  <Col style={{ marginTop: 15 }}>
                    {/*<Checkbox onChange={a => this.agreeItem(a)} style={{marginTop:10}}>*/}
                    <AgreeItem data-seed="logId" checked={checked} onChange={a => this.agreeItem(a)}>
                      同意
                      <a
                        onClick={this.agreement}
                        // router.push('/network/waybill/waybillagreement')
                      >《代收运费协议》</a>
                    </AgreeItem>
                    {/*</Checkbox>*/}
                  </Col>
                  <WhiteSpace size="lg" />
                </Card>
              </Form>
              {action1}
            </div>
          </div>
            )
          )
        }
        <MyModal
          top='0'
          modaltitel="服务条款"
          visible={photovisible}
          onCancel={this.handleCancel}
          popupContent={this.CarLeaderAgreement}
          selectRow={[]}
          popupwidth='0.9'
          height='0.7'
          isfangdaDisplay='false'
        />
        </Form>
      </div>

    );
  }
}

export default CarLeader;
