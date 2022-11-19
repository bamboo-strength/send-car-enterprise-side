import React, { PureComponent } from 'react';
import router from 'umi/router';
import { Icon,Button  } from 'antd';
import { NavBar } from 'antd-mobile';


export default class Shangchuanchenggong extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {

        };
    }
    chakantupian = ()=>{
        const { location: { query: { list } } } = this.props
        router.push({pathname:'/dashboard/chakantupian',query:{list:list}})
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
                   到货拍照确认 
                </NavBar>
              <div style={{width:'100%',height:'450px',display:'flex',flexDirection:'column',justifyContent: 'flex-end',alignItems: 'center'}}>
                  <img src='./image/img05.png' width={100} height={100}></img>
                  <span style={{marginTop:'40px',fontWeight: 800}}>上传成功</span>
                  <Button type="primary" style={{marginTop:'40px',background:'green',border:'none'}} onClick={this.chakantupian}>查看图片</Button>
              </div>
            </div>
        )
    }
}