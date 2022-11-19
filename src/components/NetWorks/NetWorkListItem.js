import React, { PureComponent } from 'react';
import Text from 'antd/es/typography/Text';
import { Flex } from 'antd-mobile';
import {Icon} from 'antd';

export default class NetWorkListMeta extends PureComponent {
  render() {
    const { month, spending, income,choose,onClick,style, } = this.props;
    return (
      <Flex direction='column' align='start' style={{ width: '100%', padding: style? style.padding : '3%', background: style?style.background:'#eaeaea' }}>
        <Text strong style={{ fontSize: 16, marginBottom: '1%' }}>{month}月
          {choose?<Icon type="caret-down" style={{marginLeft:5}} onClick={onClick} />:''}
          &nbsp;&nbsp;
          <span style={{fontSize:'12px'}}>(只展示当月数据)</span>
        </Text>
        <Text type="secondary" style={{ fontSize: 10 }}>
          <Text>支出：￥{spending}元</Text>&emsp;<Text>收入：￥{income}元</Text>
        </Text>
      </Flex>
    );
  }
}
