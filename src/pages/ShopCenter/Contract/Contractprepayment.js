import React, { PureComponent } from 'react';
import '../../ShopCenter/ShopCenter.less'

class Contractprepayment extends PureComponent{

  render() {
    const {location:{state:{url}}}=this.props

    return(
      <div>
        <iframe src={url} title='' className='cer-iframe' style={{marginBottom:50}}/>
      </div>
    );
  }
}

export default Contractprepayment;
