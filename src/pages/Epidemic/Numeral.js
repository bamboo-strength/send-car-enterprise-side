import React, { PureComponent } from 'react';
import { router } from 'umi';
import { Modal, } from 'antd-mobile';
import { antiepidemicregisterDetail, reservationqueueQueueInfo,getQueueDictByKey } from '@/services/epidemic';
import Loading from '@/components/Loading/Loading';
import { getCurrentUser } from '@/utils/authority';

class Numeral extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading:false
    }
  }

  componentDidMount() {
    const {location} = this.props
    this.setState({
      isLoading:true
    })
    if(location.state && location.state.notCheckQueueStatus){
      router.push({
        pathname:`/epidemic/EpidemicLineUp`,// 直接排队申请
        state:{ ifNeedEpidemicAdd:'Y'}
      })
      }else {
        const params = {
          current:1,size:5
        }
        reservationqueueQueueInfo(params).then(i=>{
          this.setState({
            isLoading:false
          })
          if (i.success){
            if (!i.data.queueStatusName){
              router.push({
                pathname:`/epidemic/EpidemicLineUp`,// 预约排队
                state:{ ifNeedEpidemicAdd :'Y'}
              })
            }else {
              router.push({
                pathname:'/epidemic/queue/formalQueue', // 正式排队
                state:{
                  queueInfos:i.data
                }
              })
            }
          }else {
            router.push('/dashboard/function')
          }
        })
      }
    /* antiepidemicregisterDetail().then(item=>{
      if (item.success){
        const param = {'dictCode':'isDeclare',deptId:getCurrentUser().deptId}
        getQueueDictByKey(param).then(rr => {
          if(rr.success ){ // 参数配置是否需要防疫申报 配置及返回Y 是需要防疫申报 否则不需要防疫申报
          }
        })
      }else {
        router.push('/dashboard/function')
      }
    }) */
  }

  render() {
    const {isLoading} = this.state
    return (
      <div style={{height: '100vh',display: 'flex',justifyContent: 'center',alignItems: 'center'}}>
        <Loading isLoading={isLoading} />
      </div>
    );
  }
}


export default Numeral;
