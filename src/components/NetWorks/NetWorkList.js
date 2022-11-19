import React, { PureComponent } from 'react';
import { List } from 'antd';

export default class NetWorkList extends PureComponent {
  render() {
    const { rowData,actions,onclick,dataSource,header ,grid} = this.props;
    return (<List
      size="small"
      bordered={false}
      className='networkList'
      header={header?<div>{header}</div>:null}
      grid={grid?grid:''}
      dataSource={dataSource}
      renderItem={item => <List.Item>{item}</List.Item>}>
    </List>);
  }
}
