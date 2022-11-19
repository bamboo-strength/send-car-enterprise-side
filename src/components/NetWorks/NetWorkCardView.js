import React,{PureComponent} from 'react';
import { Card } from 'antd';
import network from './NetWork.less';
export default class NetWorkCardView extends PureComponent{
  render() {
    const {title,content,actions,extra} = this.props
    return (
      <Card title={title} size='small' extra={extra} style={{margin:12}} className={network.networkListView} actions={actions}>
        {content}
      </Card>
    );
  }
}
