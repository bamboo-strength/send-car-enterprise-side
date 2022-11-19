import React from 'react';
import { formatMessage } from 'umi/locale';
import { ErrorBlock, Space } from 'antd-mobile'
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception500 = () => (
  <Exception
    type="500"
    desc={<div><div>系统发生异常，该功能暂时无法使用</div><div>你可以稍候重试</div><div>或拨打400-773-5868联系我们</div></div>}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
  // <ErrorBlock status='default' />
);

export default Exception500;
