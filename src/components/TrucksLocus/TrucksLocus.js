
import React, { PureComponent } from 'react';
import { Button, Col, DatePicker, Form, message, Row,Spin  } from 'antd';
import moment from 'moment';
import LocusMap from '@/components/AMap/Locus/LocusMap';
import Func from '@/utils/Func';

const { RangePicker } = DatePicker;
const FormItem = Form.Item;

let defaultSelectDate1 = {       // 车辆查询时间
  startTime: Func.moment(""),
  endTime: Func.moment(""),
}

@Form.create()
export default class TrucksLocus  extends PureComponent{
  state = {
    params1: [],
    autoheight1: '760',
    loading: true
  };



  componentWillMount() {
    const { dispatch, params,autoheight } = this.props;
    const truckno = params.truckno;
    this.isselect= true;
    if (params.length !== 0){
      this.setState({
        params1: params[0],
        autoheight1: autoheight,
      });
    }
    defaultSelectDate1 = {       // 车辆查询时间
      startTime: Func.moment(""),
      endTime: Func.moment(""),
    }
  }

  componentWillReceiveProps(nextProps) {
    const {dispatch,params,autoheight} = nextProps;
    const {params1,autoheight1} = this.state;
    if ((params.length !== 0 && params !== params1) || autoheight !== autoheight1){
      this.setState({
        autoheight1: autoheight,
      });
    }
  }

  handleSubmit = e => {
    e.preventDefault();
    const { form , dispatch} = this.props;
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const rangeValue = values['startenddate'];
        let secondTime = rangeValue[1].diff(rangeValue[0].format('YYYY-MM-DD HH:mm:ss'), 'second')
        if(secondTime >= 86400*30){
          message.info("只能查询近30天的轨迹！")
        }else {

          if (Func.isEmpty(rangeValue[0]) || secondTime > 86400*3){
            message.error("单次查询只能查看3天的轨迹！")
          }else {
            this.setState({
              loading: true
            })
            defaultSelectDate1 = {
              startTime: rangeValue[0].format('YYYY-MM-DD HH:mm:ss'),
              endTime: rangeValue[1].format('YYYY-MM-DD HH:mm:ss'),
            }
            this.isselect= true;
          }


        }
      }
    });
  };

  cancelselect = () =>{
    this.isselect=false
    this.setState({
      loading:false
    })
  }


  render() {
    const {params1,autoheight1,isselect,loading} =this.state;
    const {
      form: { getFieldDecorator },
    } = this.props;

    const bigdiv = {
      width: '100%',
      height: `${autoheight1}px`,
    }

    const blowediv = {
      width: '100%',
      height: "90%",
    }

    const formItemLayout = {
      labelCol: {
        // xs: { span: 24 },
        // sm: { span: 24 },
      },
      wrapperCol: {
        // xs: { span: 24 },
        sm: { span: 18 },
        // md: { span: 10 },
      },
      style:{
        marginBottom: '0',
        marginTop:'10px'
      }
    };
    return (
      <div style={bigdiv}>
        <Spin size="large" spinning={loading}>
          <Form hideRequiredMark>
            <Row style={{left:'1%'}}>
              <Col span={24}>
                <FormItem {...formItemLayout} label="">
                  {getFieldDecorator('startenddate',{
                    rules: [
                      {
                        required: true,
                        message: '请输入起止时间',
                      },
                    ],
                  })(
                    <RangePicker
                      ranges={{
                        '今天': [moment().startOf('day'), moment()],
                        '本周': [moment().startOf('week'), moment().endOf('week')],
                      }}
                      showTime
                      format="YYYY/MM/DD HH:mm:ss"
                      onChange={this.onChange}
                      placeholder={['开始时间','结束时间']}
                    />
                  )}
                  <Button type="primary" onClick={this.handleSubmit} style={{marginLeft:'20px'}}>
                    查询
                  </Button>
                </FormItem>
              </Col>
            </Row>
          </Form>
          <div style={blowediv}>
            <LocusMap
              height={autoheight1*0.9}
              params={params1}
              SelectDate={defaultSelectDate1}
              isselect={this.isselect}
              closeselect={this.cancelselect}
            />
          </div>
        </Spin>

      </div>
    )
  }

}
