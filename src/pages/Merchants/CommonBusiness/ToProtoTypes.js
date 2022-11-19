import React, { PureComponent } from 'react';
import ReactDOM from 'react-dom';
import { Form } from 'antd/lib/index';
import { Icon, NavBar, Button } from 'antd-mobile';
import router from 'umi/router';
import { clientId } from '@/defaultSettings';

@Form.create()
class ToProtoTypes extends PureComponent {

  constructor( props ){
    super();
    this.state = {

    }
  }

  componentWillMount(){
    const {
      match: {
        params: { tableName,modulename,id, },
      },
    } = this.props;
    const aa = `http://test.fhfmobile.dachebenteng.com/yx/${modulename}.html`
    //  window.open(aa);
  }

  render(){
    const {
      match: {
        params: { tableName,modulename,id, },
      },
    } = this.props;
    let aa=''
    if (clientId === 'kspt'){
       aa = `http://test.fhfmobile.dachebenteng.com/yx/${modulename}.html`
    }else if(clientId === 'kspt_shf'){
       aa = `http://test.shfmobile.dachebenteng.com/yx/${modulename}.html`
    }
 //   const aa = `http://test.fhfmobile.dachebenteng.com/yx/${modulename}.html`
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
        >{modulename}
        </NavBar>
        <iframe
          style={{width:'100%', height:'1000px', overflow:'visible',marginTop: '45px'}}
          ref="iframe"
          src={aa}
          scrolling="no"
          frameBorder="0"
          id='aaaa'
        />
      </div>

    );
  }

}
export default ToProtoTypes;

