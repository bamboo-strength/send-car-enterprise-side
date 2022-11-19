import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Icon, Button } from 'antd';
import { NavBar ,Modal} from 'antd-mobile';
import {device_check} from '../../services/photograph';


const alert = Modal.alert;
export default class Shebeizijian extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    jiancha = ()=>{
        const { location: { query: { truckno } } } = this.props;
        device_check({'truckno':truckno}).then(res=>{
            if (res.success&&res.code === 200) {
                const alertInstance = alert('设备提示',<p>{res.data}</p>,[
                    { text: '确定', onPress: () => console.log('ok') },
                  ]);
                  setTimeout(() => {
                    // 可以调用close方法以在外部close
                    console.log('auto close');
                    alertInstance.close();
                  }, 500000); 
            }
        })
    }
    render() {
        return (
            <div>
                <NavBar
                    mode="light"
                    leftContent={[
                        <Icon
                            key="0"
                            type="left"
                            // theme="twoTone"
                            style={{ marginRight: '16px', fontSize: 20 }}
                            onClick={() => router.push('/dashboard/menu')}
                        />,
                    ]}
                >
                    设备自检
                </NavBar>
                <div style={{width:'100%',height:'100vh',display:'flex',justifyContent:'center',alignItems:'center'}}>
                   <div onClick={this.jiancha} style={{width:'100px',height:'100px',borderRadius:'50%',background:'rgba(22, 189, 116,0.5)',display:'flex',justifyContent:'center',alignItems:'center',color:'white'}}>
                       设备自检
                   </div>
                </div>
            </div>
        )
    }
}