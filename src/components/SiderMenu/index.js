import React from 'react';
import { getFlatMenuKeys } from './SiderMenuUtils';

const SiderMenuWrapper = React.memo(props => {
  const { isMobile, menuData, collapsed, onCollapse } = props;
  const flatMenuKeys = getFlatMenuKeys(menuData);
  return (<div />);
});

export default SiderMenuWrapper;
