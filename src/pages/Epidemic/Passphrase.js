import React, { PureComponent } from 'react';
import { Icon } from 'antd';
import { router } from 'umi';
import { NavBar } from 'antd-mobile';
import { ImageDidNotGetTo, ImgTransportation } from '@/components/Matrix/image';
import { detailForCalledOne } from '@/services/epidemic';
import func from '@/utils/Func'
import { InTheLoad } from '@/components/Stateless/Stateless';

class Passphrase extends PureComponent {

  state = {
    isPas: false,
    msg: '',
    detail: {},
    isHaveNo:true,
    isloading:true
  };

  componentDidMount() {
    detailForCalledOne().then(item => {
      if (item.success) {
        this.setState({
          isPas: true,
          detail: item.data,
          isloading:false
        });
      } else {
        this.setState({
          msg: item.msg,
          isloading:false
        });
      }
    });

    this.timer = setInterval(()=>{
      this.setState({
        aa:Math.floor(Math.random() * 200)
      })
    },1000)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  countdown = time =>{
    const {detail:{queueStatusName,queueStatus}} = this.state
    let msg = queueStatusName
    const bb = new Date()
    const dd = new Date(time)
    /* 判断截止时间减去当前时间 是否 小于0，小于0就停止定时器调用 */
    if (queueStatus === 3){
      if ((dd.getTime() - bb.getTime()) <=0){
        this.setState({
          isHaveNo:true
        })
        clearInterval(this.timer)
      }else if (time) {
        msg = func.countdown2(time);
        this.setState({
          isHaveNo:false
        })
      }
    }else {
      this.setState({
        isHaveNo:true
      })
    }
    return msg
  }

  render() {
    const { isPas, msg, detail,isHaveNo,isloading } = this.state;
    const display = { display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center' };
    const fontWeight = { fontWeight: 'bold' };
    const bg = { background: '#0075bd', height: 'calc( 100vh - 45px)', ...display };
    const wibg = { width: '85%', height: '65vh', background: 'white', borderRadius: 5, ...display };
    const h1color = { color: '#29cca4', ...fontWeight };
    const coWhite = { color: 'white' }
    const {callTimeDeadline,callTime,vehicleno,queueStatusName,queueStatus,queueNumber} = detail
    const img = <img src={ImgTransportation} alt='' style={{ width: 220 }} />
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/dashboard/function`);
          }}
        >通行码
        </NavBar>
        <div className='am-list'>
          {
            isloading ? <InTheLoad /> : (
              isPas ? (
                <div style={bg}>
                  <h1 style={{ ...coWhite, ...fontWeight, fontSize: '2.5rem',marginBottom:0 }}>排队号：{queueNumber}</h1>
                  {
                    queueStatus === 3 && <p style={{ ...coWhite,...fontWeight,fontSize:'1.3rem',marginBottom:'0.5rem' }}>倒计时：{this.countdown(callTimeDeadline)}</p>
                  }
                  {
                    isHaveNo ? (
                      <div style={wibg}>
                        {img}
                        <h1 style={{ ...fontWeight, color: 'red', fontSize: '1.5rem', marginTop: 20 }}>车辆{queueStatusName}</h1>
                      </div>
                    ):(
                      <div style={wibg}>
                        <h1 style={{ color: 'red', ...fontWeight, fontSize: '3.2rem' }}>{callTime.split(' ')[0]}</h1>
                        {img}
                        <h1 style={{ ...h1color, fontSize: '2.5rem' }}>{vehicleno}</h1>
                      </div>
                    )
                  }
                </div>
              ) : (
                <div style={bg}>
                  <h1 style={{ ...coWhite, ...fontWeight, fontSize: '2.5rem' }}>通行码</h1>
                  <div style={wibg}>
                    <img src={ImageDidNotGetTo} alt='' style={{ width: 220 }} />
                    <h1 style={{ ...fontWeight, color: 'red', fontSize: '1.5rem', marginTop: 20 }}>{msg}</h1>
                  </div>
                </div>
              )
            )
          }
        </div>
      </div>
    );
  }
}

export default Passphrase;
