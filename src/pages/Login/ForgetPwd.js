import React, { Component } from 'react';
import { Form,  } from 'antd/lib/index';
import { currentTenant } from '../../defaultSettings';
import ForgetPwd847975 from './847975/ForgetPwd847975';
import ForgetPwd from './Normal/ForgetPwd';



@Form.create()
class JoinUs extends Component {
  state = {

  };

  render() {
    return (
      <div>
        {
          currentTenant === '847975'?
            <ForgetPwd847975 />
            :<ForgetPwd />
        }
      </div>
    );
  }
}

export default JoinUs;
