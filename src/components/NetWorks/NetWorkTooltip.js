import React, { PureComponent } from 'react';

class NetWorkTooltip extends PureComponent {
  render() {
    const { content, style } = this.props;
    return (
      <div className='shop-tooltip-inner' style={style}>
        <div className='shop-tooltip-inner-wrapper'>
          {content}
        </div>
      </div>
    );
  }
}

export default NetWorkTooltip;
