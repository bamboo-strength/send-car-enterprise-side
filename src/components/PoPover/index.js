import React,{PureComponent} from 'react';
import { Icon } from 'antd';
import { Popover } from 'antd-mobile';
import moment from 'moment';

const {Item} = Popover;

export default class PoPover extends PureComponent{
  constructor(props) {
    super(props);
    const {defaultValue} = this.props
    this.state={
      visible:false,
      children:defaultValue || '日期',
    }
  }

  onSelect = (opt) => {
    let starts=''
    let ends=''
    switch (opt.props.value) {
      case '1': // 昨日
        starts = moment().startOf('day').subtract('day',1)
        ends = moment().endOf('day').subtract('day',1)
        break;
      case '2': // 今日
        starts = moment().startOf('day')
        ends = moment().endOf('day')
        break;
      case '3': // 上周
        starts = moment().startOf('week').subtract('week',1)
        ends = moment().endOf('week').subtract('week',1)
        break;
      case '4': // 本周
        starts = moment().startOf('week')
        ends = moment().endOf('week')
        break;
      case '5': // 上月
        starts = moment().startOf('month').subtract('month',1)
        ends = moment().endOf('month').endOf('month').subtract('month',1).endOf('month')
        break;
      default: // 本月
        starts = moment().startOf('month')
        ends = moment().endOf('month').endOf('month')
        break;
    }
    starts = starts.format('YYYY-MM-DD HH:mm:ss')
    ends = ends.format('YYYY-MM-DD HH:mm:ss')
    this.setState({
      visible: false,
      children: opt.props.children,
    },()=>{
      const {onSelect} = this.props
      onSelect({ starts, ends },opt.props.children)
    });
  };

  render() {
    const {visible,children} = this.state
    return (
      <Popover
        mask
        overlayClassName="fortest"
        overlayStyle={{ color: 'currentColor' }}
        visible={visible}
        overlay={[
          (<Item key="1" value="1" data-seed="logId">昨日</Item>),
          (<Item key="2" value="2">今日</Item>),
          (<Item key="3" value="3">上周</Item>),
          (<Item key="4" value="4">本周</Item>),
          (<Item key="5" value="5">上月</Item>),
          (<Item key="6" value="6">本月</Item>),
        ]}
        align={{
          overflow: { adjustY: 0, adjustX: 0 },
          offset: [-10, 0],
        }}
        onSelect={this.onSelect}
      >
        <div style={{
          height: '100%',
          display: 'flex',
          alignItems: 'center',
        }}
        >
          {children}<Icon type="caret-down" />
        </div>
      </Popover>
    );
  }
}
