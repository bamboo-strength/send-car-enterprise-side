import React,{PureComponent} from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon } from 'antd';
import router from 'umi/router';
import NetWorkListCard from '@/components/NetWorks/NetworkListCard';
import { NavBar } from 'antd-mobile';
import { recordlist } from '@/services/grabasingle';

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
    router.push({ pathname : '/network/waybill', state : { sourceGoodsId: id}});
  }

  onClick = (splitBill,id)=>{
    router.push(
      {
        pathname: `/network/waybill/grabasingleRecordView`,
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
          onLeftClick={() => router.push('/network/waybill/grabasingle')}
        >抢单记录
        </NavBar>
        <div className='am-list'>
          {
            data.records.map(item=>{
              const actions = ([
                <div style={{ color: '#1890FF' }} onClick={(e) => this.waybillview(e,item.sourceGoodsId)}>查看运单</div>,
              ])
              return <NetWorkListCard item={item} onClick={()=>this.onClick(item.splitBill,item.id)} type={2} actions={actions} />
            })
          }
        </div>
      </div>
    );
  }
}
export default GrabaSingleRecord
