import React, { Component } from 'react';
import Text from 'antd/es/typography/Text';
import { Icon } from 'antd';
import { Flex } from 'antd-mobile';
import NetWorkDatePicker from '@/components/NetWorks/NetWorkDatePicker';

const date = new Date();
const resetDate = {
  value: [date.getFullYear(), date.getMonth() + 1],
  nowYears: date.getFullYear(),
  nowMonth: date.getMonth() + 1,
}

class MatrixDateSelection extends Component {

  constructor(props) {
    super(props);

    this.state = {
      modal:false,
      ...resetDate,
      yearsMonth:'',
      value:[]
    }
  }

  componentDidMount() {
    const {onRef} = this.props
    if(onRef) onRef(this)
  }


  onClick = (years,month)=>{
    this.setState({
      modal:true,
      value: [years, month],
    })
  }

  onClose = ()=>{
    this.setState({
      modal:false
    })
  }

  onChange = (value) => {
    this.setState({
      value,
    });
  };

  // 确定
  onOk = value =>{
    this.setState({
      modal:false,
      nowYears:value[0],
      nowMonth:value[1],
      yearsMonth:`${value[0]}年${value[1]}月`
    },()=>{
      this.requests()
    })
  }

  // 重置
  onReset = ()=>{
    resetDate.value = []
    this.setState({
      modal:false,
      ...resetDate,
    },()=>{
      this.requests()
    })
  }

  /* 调用父组件方法 */
  requests = ()=>{
    const {onRequests} = this.props
    const {value} = this.state
    if (value[1]<= 9) value[1] = `0${value[1]}`
    onRequests(value)
  }

  render() {
    const { spending, income,choose,style, text,dateText,onScrollChange } = this.props;
    const { modal,value,nowYears,nowMonth,yearsMonth } = this.state
    return (
      <div>
        <Flex direction='column' align='start' style={{ width: '100%', padding: style? style.padding : '3%', background: style?style.background:'#eaeaea' }}>
          <Text strong style={{ fontSize: 16, marginBottom: '1%' }}>{ dateText ? yearsMonth :'全部'}
            {choose?<Icon type="caret-down" style={{marginLeft:5}} onClick={()=>this.onClick(nowYears, nowMonth)} />:''}
            &nbsp;&nbsp;
            {
              text && <span style={{fontSize:'12px'}}>(只展示当月数据)</span>
            }
          </Text>
          <Text type="secondary" style={{ fontSize: 10 }}>
            <Text>支出：￥{spending}元</Text>&emsp;<Text>收入：￥{income}元</Text>
          </Text>
        </Flex>
        <NetWorkDatePicker
          visible={modal}
          onClose={this.onClose}
          value={value}
          onChange={this.onChange}
          onOk={() => this.onOk(value)}
          onReset={this.onReset}
          onScrollChange={onScrollChange}
        />
      </div>
    );
  }
}

export default MatrixDateSelection;
