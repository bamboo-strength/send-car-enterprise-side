import React,{PureComponent} from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon,Empty } from 'antd';
import router from 'umi/router';
import NetWorkListCard from '@/components/NetWorks/NetworkListCard';
import { NavBar } from 'antd-mobile';
import { recordlist } from '@/services/VehicleCarMatching/GrabOrderServices';
import { EmptyData, } from '@/components/Stateless/Stateless';

class GrabaSingleRecord extends PureComponent{
  constructor(props) {
    super(props);
    this.state = {
     data:{records:[]},
    }
  }

  componentWillMount() {
    const params={
      current:1,
      size:15,
    }
    recordlist(params).then(resp=>{
      this.setState({
        data:resp.data
      })
    })
  }

  waybillview=(e,id)=>{
    e.stopPropagation();
    console.log("sourceGoodsId",id);
    router.push({ pathname : '/vehicleCarMatching/waybillmanagement', state : { sourceGoodsId: id}});
  }

  onClick = (splitBill,id)=>{
    console.log('id===',id);
    router.push(
      {
        pathname: `/vehicleCarMatching/ordergrabbingmanage/recordview`,
        // pathname: `/network/waybill/grabasingleRecordView`,

        state: {
          splitBill,
          id
        },
      },
    );
  }

  render() {
    const {data}=this.state
    return (
      <div id={NetWorkLess.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/vehicleCarMatching/ordergrabbingmanage/list')}
        >抢单记录
        </NavBar>
        <div className='am-list'>
          {
            data.records.length>0?
              data.records.map(item=>{
              const actions = ([
                <div style={{ color: '#1890FF' }} onClick={(e) => this.waybillview(e,item.sourceGoodsId)}>查看运单</div>,
              ])
              return <NetWorkListCard item={item} onClick={()=>this.onClick(item.splitBill,item.id)} type={2} actions={actions} />
            }):<Empty description="暂无数据" className="list-No-data" />

          }
        </div>
      </div>
    );
  }
}
export default GrabaSingleRecord
