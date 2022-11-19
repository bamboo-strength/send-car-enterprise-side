import React from 'react';
import { formatMessage } from 'umi/locale';
import Link from 'umi/link';
import Exception from '@/components/Exception';

const Exception503 = () => (
  <Exception
    type="503"
    desc={<div><div>系统繁忙，请稍候重试</div></div>}
    linkElement={Link}
    backText={formatMessage({ id: 'app.exception.back' })}
  />
  // <ErrorBlock status='default' />
);

export default Exception503;
