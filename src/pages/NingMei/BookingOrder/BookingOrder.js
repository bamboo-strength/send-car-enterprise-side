import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Col,  Form, Input,Select,message } from 'antd';
import { NavBar, Icon, Card,Button,Toast, } from 'antd-mobile';
import router from 'umi/router';
import styles from '@/layouts/Sword.less';
import MatrixDate from '../../../components/Matrix/MatrixDate';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { saveDispatch,surplus,queryVehicle,queryOrderDate } from '@/services/commonBusiness';
import func from '@/utils/Func';
import { clientId } from '../../../defaultSettings';
import { getCurrentUser } from '../../../utils/authority';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixSelect from '@/components/Matrix/MatrixSelect';



const FormItem = Form.Item;

@connect(({ commonBusiness,tableExtend, loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))

@Form.create()

class BookingOrder extends PureComponent {

  constructor(props) {
    super(props)
    this.state = {
      code: '',
      codeLength: 4,
      fontSizeMin: 20,
      fontSizeMax: 22,
      backgroundColorMin: 240,
      backgroundColorMax: 250,
      colorMin: 10,
      colorMax: 20,
      lineColorMin: 40,
      lineColorMax: 180,
      contentWidth: 96,
      contentHeight: 38,
      showError: false, // 默认不显示验证码的错误信息
      availableCarsflag:'',
      itemsList: [],
      itemsOrderDate:[],
      idParam:'',
      loading: false,
    }
  }




  componentWillMount() {
    this.canvas = React.createRef()
    const {
      location
    } = this.props;

    //  查找当前司机所持有的车辆
    if (clientId === 'kspt_driver'){
    queryVehicle({ userId: getCurrentUser().userId }).then(resp => {
      const listData = resp.data;
      const items = [];
      const dataLength = listData.length;
      if (dataLength >= 0) {
        listData.map(value => {
          const aa = {
            key: value.truckno,
            value: value.truckno
          }
          items.push(aa)
        })
        this.setState({
          itemsList: items
        })
      }
    })
        const detailDataList =location.state.detailData
        const params = {
          brand:detailDataList.brand,
          specification:detailDataList.specification,
          minePoint:detailDataList.minePoint,
          type:1,//  表示是现金
        };
        queryOrderDate(params).then(resp => {//现金
          const listData = resp.data;
          const items = [];
          const dataLength = listData.length;
          if (dataLength >= 0) {
            listData.map(value => {
              const aa = {
                key: value.id,
                value: value.date
              }
              items.push(aa)
            })
            this.setState({
              itemsOrderDate: items,
            })
          }
        });
    }else{
        const detailDataList =location.state.detailData
        const params = {
          brand:detailDataList.brand,
          specification:detailDataList.specification,
          minePoint:detailDataList.minePoint,
          type:0,//  煤场
        };
        queryOrderDate(params).then(resp => {
          const listData = resp.data;
          const items = [];
          const dataLength = listData.length;
          if (dataLength >= 0) {
            listData.map(value => {
              const aa = {
                key: value.id,
                value: value.date
              }
              items.push(aa)
            })
            this.setState({
              itemsOrderDate: items,
            })
          }
        })
    }
  }



  componentDidMount() {
    this.drawPic()
  }




  // 生成一个随机数
  // eslint-disable-next-line arrow-body-style
  randomNum = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min)
  }

  drawPic = () => {
    this.randomCode()
  }

  // 生成一个随机的颜色
  // eslint-disable-next-line react/sort-comp
  randomColor(min, max) {
    const r = this.randomNum(min, max)
    const g = this.randomNum(min, max)
    const b = this.randomNum(min, max)
    return `rgb(${r}, ${g}, ${b})`
  }

  drawText(ctx, txt, i) {
    ctx.fillStyle = this.randomColor(this.state.colorMin, this.state.colorMax)
    const fontSize = this.randomNum(this.state.fontSizeMin, this.state.fontSizeMax)
    ctx.font = `${fontSize  }px SimHei`
    const padding = 10;
    const offset = (this.state.contentWidth - 40) / (this.state.code.length - 1)
    let x = padding;
    if (i > 0) {
      x = padding + (i * offset)
    }
    let y = this.randomNum(this.state.fontSizeMax, this.state.contentHeight - 5)
    if (fontSize > 40) {
      y = 40
    }
    const deg = this.randomNum(-10, 10)
    // 修改坐标原点和旋转角度
    ctx.translate(x, y)
    ctx.rotate(deg * Math.PI / 180)
    ctx.fillText(txt, 0, 0)
    // 恢复坐标原点和旋转角度
    ctx.rotate(-deg * Math.PI / 180)
    ctx.translate(-x, -y)
  }

  drawLine(ctx) {
    // 绘制干扰线
    for (let i = 0; i < 1; i++) {
      ctx.strokeStyle = this.randomColor(this.state.lineColorMin, this.state.lineColorMax)
      ctx.beginPath()
      ctx.moveTo(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight))
      ctx.lineTo(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight))
      ctx.stroke()
    }
  }

  drawDot(ctx) {
    // 绘制干扰点
    for (let i = 0; i < 100; i++) {
      ctx.fillStyle = this.randomColor(0, 255)
      ctx.beginPath()
      ctx.arc(this.randomNum(0, this.state.contentWidth), this.randomNum(0, this.state.contentHeight), 1, 0, 2 * Math.PI)
      ctx.fill()
    }
  }

  reloadPic = () => {
    this.drawPic()
    this.props.form.setFieldsValue({
      sendcode: '',
    });
  }

  // 输入验证码
  changeCode = e => {
    if (e.target.value.toLowerCase() !== '' && e.target.value.toLowerCase() !== this.state.code.toLowerCase()) {
      this.setState({
        showError: true
      })
    } else if (e.target.value.toLowerCase() === '') {
      this.setState({
        showError: false
      })
    } else if (e.target.value.toLowerCase() === this.state.code.toLowerCase()) {
      this.setState({
        showError: false
      })
    }
  }

  // 随机生成验证码
  randomCode() {
    let random = ''
    // 去掉了I l i o O,可自行添加
    const str = 'QWERTYUPLKJHGFDSAZXCVBNMqwertyupkjhgfdsazxcvbnm1234567890'
    for (let i = 0; i < this.state.codeLength; i++) {
      const index = Math.floor(Math.random() * 57);
      random += str[index];
    }
    this.setState({
      code: random
    }, () => {
      const canvas = this.canvas.current;
      const ctx = canvas.getContext('2d')
      ctx.textBaseline = 'bottom'
      // 绘制背景
      ctx.fillStyle = this.randomColor(this.state.backgroundColorMin, this.state.backgroundColorMax)
      ctx.fillRect(0, 0, this.state.contentWidth, this.state.contentHeight)
      // 绘制文字
      for (let i = 0; i < this.state.code.length; i++) {
        this.drawText(ctx, this.state.code[i], i)
      }
      /* this.drawLine(ctx) */
      /* this.drawDot(ctx) */
    })
  }


  toSubimt = () => {
    const { form,
      location
    } = this.props;
    const {loading}=this.state
    if (loading) {
      return;
    }
    const detailDataList =location.state.detailData
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        if (clientId === 'kspt_driver'){
          //  现金预约
        const params = {
          ...values,
          brand:detailDataList.brand,
          specification:detailDataList.specification,
          minePoint:detailDataList.minePoint,
          ReservationId:values.id,
          isplan:0,
     //     inputtype:1, //  表示是沫煤0还是块煤1,后端已处理
          waybillStatus: 1,
          text6:0,//  表示是现金还是煤场
       //   loadtype:1
        };
        delete params.id
        saveDispatch(params).then(resp => {
          this.setState({
            loading: false,
          });
          if (resp.success) {
            Toast.info(resp.msg);
            router.push( `/dashboard/function`);
          }
        });
      }else{
          //  煤场预约
          const params = {
            ...values,
            brand:detailDataList.brand,
            specification:detailDataList.specification,
            minePoint:detailDataList.minePoint,
            ReservationId:values.id,
            isplan:1,
       //     inputtype:1,//  表示是沫煤0还是块煤1,后端已处理
            waybillStatus: 0,
            text6:1,
        //    loadtype:0
          };
          delete params.id
          saveDispatch(params).then(resp => {
            if (resp.success) {
              Toast.info(resp.msg);
              this.setState({
                loading: false,
              });
              router.push( `/dashboard/function`);
            }
          });
        }
      }
    });
  };


// 司机
  getCarNum  = (v) => {
    const {form,
    } = this.props
    surplus({id:v}).then((resp) => {
      const detail = resp.data
      if (detail !== null && detail.id!=null){
        const availableCarsNum=detail.availableCars
        const idNum=detail.id
        form.setFieldsValue({
          availableCars: availableCarsNum,
          id:idNum
        });
      }
    })
  }


// 收货
  getCarNumShf  = (v) => {
    const {form,
    } = this.props
    surplus({ id: v}).then((resp) => {
      const detail = resp.data
      if (detail !== null && detail.id!=null){
        const availableCarsNum=detail.availableCars
        const idNum=detail.id
        form.setFieldsValue({
          availableCars:availableCarsNum,
          id:idNum
        });
      }
    })
  }


  render() {
    const {
      location,
      form: { getFieldDecorator },
      form
    } = this.props;


    const detailDataList =location.state.detailData
    const backUrl = `/dashboard/function`
    const {itemsList,itemsOrderDate}=this.state;
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
      labelAlign:'right',
    };

      const suffix =
        <div>
          <canvas
            onClick={this.reloadPic}
            ref={this.canvas}
            width='100'
            height='40'
          />
        </div>


    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{'预订'}
        </NavBar>
        <Card title="" bordered={false}>
          <Card.Header
            title='需求信息'
            style={{ fontWeight: 'bold' }}
          />
          <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="品牌名称:" style={{marginLeft:'11px'}}>
              <span>{detailDataList.brandName}</span>
            </FormItem>
          </Col>
          <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="品种规格:" style={{marginLeft:'11px'}}>
              <span>{detailDataList.specificationName}</span>
            </FormItem>
          </Col>
          <Col span={24} className='add-config'>
            <FormItem {...formItemLayout} label="生产矿点:" style={{marginLeft:'11px'}}>
              <span>{detailDataList.minePointName}</span>
            </FormItem>
          </Col>
          {
            clientId === 'kspt_driver' ?
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="预订日期:" >
                  {getFieldDecorator('assignTime',{
                    rules: [
                      {
                        required: true,
                        message: '请选择预订日期',
                      }
                    ],
                  })(
                    <Select
                      placeholder="请选择预订日期"
                      size="large"
                      style={{ width: '100%' }}
                      onSelect={(e)=>this.getCarNum(e)}
                    >
                      {itemsOrderDate.map(d => (
                        <Select.Option key={d.key} value={d.key}>
                          {d.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              :
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label="预订日期:">
                  {getFieldDecorator('assignTime',{
                    rules: [
                      {
                        required: true,
                        message: '请选择预订日期',
                      }
                    ],
                  })(
                    <Select
                      placeholder="请选择预订日期"
                      size="large"
                      style={{ width: '100%' }}
                      onSelect={(e)=>this.getCarNumShf(e)}
                    >
                      {itemsOrderDate.map(d => (
                        <Select.Option key={d.key} value={d.key}>
                          {d.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
          }
          <Col span={24} className='add-config'>
            <MatrixInput label="可预约车数" placeholder="请输入可预约车数" id="availableCars" form={form} style={{width: '87%', marginLeft:'29px'}} required disabled />
            <MatrixInput id="id" form={form} style={{width: '100%'}} hidden />
          </Col>
          <Card.Header
            title='车辆信息'
            style={{ fontWeight: 'bold' }}
          />
          {
            clientId === 'kspt_driver' ?
              <Col span={24} className='add-config'>
                <FormItem {...formItemLayout} label=" 车号:">
                  {getFieldDecorator('vehicleno',{
                    rules: [
                      {
                        required: true,
                        message: '请选择车号',
                      }
                    ],
                  })(
                    <Select
                      placeholder="请选择车号"
                      size="large"
                      style={{ width: '100%',top: '45%',marginTop: '4px'}}
                    >
                      {itemsList.map(d => (
                        <Select.Option key={d.key} value={d.key}>
                          {d.value}
                        </Select.Option>
                      ))}
                    </Select>
                  )}
                </FormItem>
              </Col>
              :
              <Col span={24} className='add-config'>
                <MatrixAutoComplete label='车号' placeholder='请输入车号' dataType='truck' id='vehicleno' required labelId='vehiclenoName' numberType='isPlateNo' form={form} style={{width: '100%'}} />
              </Col>
          }
          <Form.Item className='for-form'>
            {getFieldDecorator('sendcode', {
                rules: [
                  { required: true,
                    message: '请输入验证码!' },
                  {
                    validator: (rule, value, callback) => {
                      if (value) {
                        if(value.toLowerCase()===this.state.code.toLowerCase()){
                          callback()
                          this.setState({
                            sendcode: value,
                            showError: false
                          })
                        } else {
                          callback('请输入正确的验证码')
                          this.setState({
                            showError: true
                          })
                        }
                      } else {
                        callback()
                      }
                    }
                  }
                ],
              })(
                <Input
                  size="large"
                  prefix={<Icon type="lock" style={{ color: 'rgba(0,0,0,.25)' }} />}
                  suffix={suffix}
                  onChange={this.changeCode}
                  placeholder="请输入验证码"
                />,
              )}
          </Form.Item>
        </Card>
        <Button
          icon='/image/plus.png'
          block
          type="primary"
          style={{marginLeft:'-21px'}}
          onClick={() => this.toSubimt()}
        >
          预订下单
        </Button>
      </div>
    );
  }
}
export default BookingOrder;


