import React, { Component } from 'react';
import { NavBar } from 'antd-mobile';
import { Icon } from 'antd';
import { router } from 'umi';
import '../KsWallet.less';
import {
  billincome,
  dstbillPageAll,
  dstbillPersonalPageAll,
  personBillincome,
} from '@/services/KsWallet/AccountSerivce';
import MatrixDateSelection from '@/components/MatrixMobile/MatrixDateSelection';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import { BilllistStyle } from '@/pages/KsWallet/GeneralStyle';
import { getCurrentUser, getUserType } from '@/utils/authority';
import { clientId } from '@/defaultSettings';

class BillingList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      income: '0',
      spending: '0',
      billDate: '',
      tabKey: '',
    };
  }

  componentDidMount() {
    this.getData(false);
  }

  getData = () => {
    const { tabKey, billDate } = this.state;
    let income = 0;
    let spending = 0;
    const param = { transactionType: tabKey, billDate };
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    // 支出收入金额
    if(clientId==='kspt_shf'&&custTypeFlag===1){
      personBillincome({ ...param, size: 12,userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:'' }).then(resp => {
        if (resp.success) {
          const { records } = resp.data;
          for (let i = 0; i < records.length; i += 1) {
            if (resp.success) {
              spending += (+records[i].expenditure*100);  // 支出
              income += (+records[i].income*100);  // 收入
            }
          }
          spending/=100;
          income/=100;

          this.setState({
            spending,
            income,
          });
        }
      });
    }else{
      billincome({ ...param, size: 12 }).then(resp => {
        if (resp.success) {
          const { records } = resp.data;
          for (let i = 0; i < records.length; i += 1) {
            if (resp.success) {
              spending += (+records[i].expenditure*100);  // 支出
              income += (+records[i].income*100);  // 收入
            }
          }
          spending/=100;
          income/=100;

          this.setState({
            spending,
            income,
          });
        }
      });
    }

  };

  /* 调用子组件传过来的事件切换tab */
  changeTab = (tab) => {
    this.setState({
      tabKey: tab,
      billDate: '',
    }, () => {
      this.getData(true);
    });
  };

  /* 点击重置和确定时调用 */
  request = value => {
    this.setState({
      billDate: value.length !== 0 ? `${value[0]}-${value[1]}` : '',
    }, () => {
      this.getData(true);
      if (this.child) {
        /* 点击确定时调用外部接口 */
        this.child.onChoose();
        /* 在点击确定时将MatrixListView的下拉刷新时间设置为true，开启下拉刷新 */
        this.child.slipThrough(true);
      }
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  /* 在选择时间时将MatrixListView的下拉刷新时间设置为false，避免滑动穿透 */
  onScrollChange = () => {
    if (this.child) this.child.slipThrough(false);
  };

  render() {
    const { spending, income, billDate } = this.state;
    const {userId} = getCurrentUser()
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    const interfaceUrl = clientId==='kspt_shf'&&custTypeFlag===1? dstbillPersonalPageAll:dstbillPageAll
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID} style={{ padding: '0 15px' }}>
          <BilllistStyle rowData={rowData} />
        </div>
      );
    };
    const NetworkListItem = <MatrixDateSelection onScrollChange={this.onScrollChange} choose onRequests={this.request} spending={spending} income={income} dateText={billDate} />;
    const tabs = [{ title: '全部', key: '' }, { title: '货款', key: '1' }, { title: '充值', key: '3' }, { title: '提现', key: '4', }];
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/kswallet/wallhomepage/walletpage');
          }}
        >账单
        </NavBar>
        <div className='am-list'>
          <div>
            <div>
              <MatrixTabsListView
                tabs={tabs}
                param={{ billDate ,userId:clientId==='kspt_shf'&&custTypeFlag===1?userId:undefined}}
                onRef={this.onRef}
                options={NetworkListItem}
                interfaceUrl={interfaceUrl}
                row={row}
                tabKeyName="transactionType"
                changeTab={this.changeTab}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default BillingList;
