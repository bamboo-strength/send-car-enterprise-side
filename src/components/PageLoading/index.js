import React from 'react';
import { Spin } from 'antd';

// loading components from code split
// https://umijs.org/plugin/umi-plugin-react.html#dynamicimport
export default () => (
  <div style={{ paddingTop: 260, textAlign: 'center' }}>
    <Spin size="large" tip="加载中..." />
  </div>
);
