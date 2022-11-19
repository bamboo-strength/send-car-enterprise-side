import React, { PureComponent } from 'react';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { Icon } from 'antd';
import router from 'umi/router';
import { NavBar } from 'antd-mobile';
import NetWorkListCard from '@/components/NetWorks/NetworkListCard';
import iconSingleRecord from '../../../../public/Network/icon_singleRecord.png';
import { list } from '@/services/grabasingle';
import { orderTakeVerify } from '@/services/FreightServices';

class GrabaSingle extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
     data:{ records: []},
    };
  }

  componentWillMount() {
    list({carrierType: 1}).then(resp=>{
      this.setState({
        data:resp.data
      })
    })
  }

  onClick = (item) => {
    orderTakeVerify({type:2}).then((resp)=>{
      if (resp.success)
      {
        router.push(
          {
            pathname: `/network/waybill/grabasingleView/${item.id}`,
            state: {
              splitBill:item.splitBill,
            },
          },
        );
      }
    })
  };

  onRecord = () => {
    router.push('/network/waybill/grabasingleRecord');
  };

  render() {
    const {data}=this.state
    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite')
    return (
      <div id={NetWorkLess.netWork}>
        {
          ifFromOtherSite === 'ok'?undefined:
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={() => router.push('/dashboard/freight')}
            rightContent={[<img src={iconSingleRecord} onClick={this.onRecord} style={{ width: 18 }} alt='' />,]}
          >抢单专区
          </NavBar>
        }

        <div className={ifFromOtherSite === 'ok'?'am-list-nestPage':'am-list'}>
          {
            data.records.map(item => {
              return <NetWorkListCard item={item} onClick={() => this.onClick(item)} type={0} />;
            })
          }
        </div>
      </div>
    );
  }
}
export default GrabaSingle;
