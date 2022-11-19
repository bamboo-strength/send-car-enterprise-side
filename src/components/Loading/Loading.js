import React, { PureComponent } from 'react';
import { Spin, Icon } from 'antd';

export default class Loading extends PureComponent {

  render() {
    const { isLoading, tempdata } = this.props;
    // console.log(isLoading);
    const antIcon = <Icon type="loading" style={{ fontSize: 24 }} spin />;
    return (
      <div style={{ textAlign: 'center' }}>
        {
          isLoading ?
            <div>
              <Spin indicator={antIcon} />
              <div className='Intheload'>数据加载中...</div>
            </div> :
            <div className='toload'>加载完毕，暂无数据</div>
        }
      </div>
    );
  }
}
