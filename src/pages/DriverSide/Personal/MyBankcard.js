import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar, Tabs,WhiteSpace,Card,WingBlank,} from 'antd-mobile';
import {  Form, Icon, message, Modal, Radio,Button } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import NetWork from '@/components/NetWorks/NetWork.less';
import { connect } from 'dva';
import {remove,changeisDefaut,list} from "@/services/mybankcard";
import { MERDRIVER_DETAIL } from '@/actions/merDriver';
import { getCurrentUser } from '@/utils/authority';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});
@connect(({ mybankcard }) => ({
  mybankcard,
}))
@connect(({ merDriver }) => ({
  merDriver,
}))
@Form.create()
class myBankcard extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource: dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      waybillStatus: 1,
      rateShow: false,
      visibleCancel:false,
      cancelValue:1,
      cancelData:{},
    };
  }

  componentWillMount() {
    this.getData(false,{})
  }

  getData(ref, param) {
    const { merDriver: {detail}, } = this.props;
    const { pageNo, pageSize, dataSource, realdata, waybillStatus,merDriverdetail } = this.state;;
    const params={
      current : pageNo,
      size : pageSize,
      // custoMerId:detail.jszh
    }
    console.log('param',params);
    list(params).then(resp => {
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data) ? resp.data : []);
      const len = tempdata.length;
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false,
        });
      }
      if (ref) { // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata
        })
      } else { // 上拉加载
        const dataArr = realdata.concat(tempdata)
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr
        })
      }
    })
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1
    }, ()=>{
      this.query(true,{})
    })
  }

  onEndReached = (event) => {
    const {isLoading,hasMore,pageNo} = this.state
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, ()=> {
      this.query(false,{})
    })
  }

  query = (flag,param) => {
    const {form} = this.props
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param
      };
      // console.log(values,'-----------values')
      this.getData(flag,values)
    });
  }

  reset = () => {
    const {form} = this.props
    form.resetFields()
    this.setState({
      pageNo:1
    }, ()=> {
      this.query(true,{})
    })
  }

  changeTab=(tab, index) =>{
    this.setState({
      pageNo: 1,
      waybillStatus: index + 1,
      dataSource: dataSource1,
      isLoading: true,
    }, () => {
      this.query(true, {});
    });
  };

  rateChange = (e) => {
    console.log(e, '====e');
  };

  confirmRate = () => {
    this.setState({
      rateShow: false,
    });;
  };
  onChange = e=>{
    this.setState({
      cancelValue: e.target.value,
    });
  }

  unBundling=(e,rowData)=>{
    const { dispatch,
    } = this.props;
    Modal.confirm({
      title: '解绑确认',
      content: '是否确定解绑？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        remove( {accountNo:rowData.accountNo}).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/wallet/wallet')
          } else {
            // message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {
      },
    });
  }

  changeisDefaut=(rowData)=>{
    const { dispatch,
      merDriver: {detail}
    } = this.props;
    Modal.confirm({
      title: '设置默认银行卡',
      content: '是否确定设置默认银行卡？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        changeisDefaut( {custoMerId:detail.jszh,isDefault:0,accountNo:rowData.accountNo}).then(resp => {
          if (resp.success) {
            message.success(resp.msg);
            router.push('/driverSide/personal/myBankcard');
          } else {
            // message.error(resp.msg || `${str}失败`);
          }
        });
      },
      onCancel() {
      },
    });
  }

  /* 关闭弹窗 */
  hideModal = ()=>{
    this.setState({
      visibleCancel:false,
      rateShow: false,
    })
  }

  /* 跳转详情 */
  onNetWorkCard = rowData=>{
    console.log(rowData);
    // router.push(
    //   {
    //     pathname: `/network/waybill/waybillview/${rowData.id}`,
    //   },
    // );
  }

  render() {
    const { dataSource, isLoading, refreshing, waybillStatus, rateShow,visibleCancel } = this.state;
    const {form} = this.props
    const separator = (sectionID, rowID) => (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#F5F5F9',
          height: 8,
          borderTop: '1px solid #ECECED',
          borderBottom: '1px solid #ECECED',
        }}
      />
    );

    const row = (rowData, sectionID, rowID) => {
      let actions = ([]);
      actions = ([
        <button type="primary" onClick={(e) => this.unBundling(e,rowData)}>解绑</button>
      ]);

      return (
        <div key={rowID}>
          <Form style={{ marginTop: 8 }}>
            <WingBlank size="lg">
              <WhiteSpace size="lg" />
              <Card style={{color:'#FFF159'}}>
                <Card.Header
                  title={rowData.bankName}
                  thumb="https://gw.alipayobjects.com/zos/rmsportal/MRhHctKOineMbKAZslML.jpg"
                  extra={actions}
                  rowData={rowData}
                />
                <Card.Body>
                  <WhiteSpace size="xl" />
                  <div><h3 align="center">{rowData.accountNo}</h3></div>
                  <WhiteSpace size="xl" />
                </Card.Body>
                <Card.Footer>
                  <div>
                  <h5>{rowData.cardTypeName}</h5>
                  </div>
                </Card.Footer>
                {
                  rowData.isDefault===0?
                    <h3 align="center">默认卡</h3> :
                    <Button type="primary" onClick={() =>this.changeisDefaut(rowData)}>设置默认卡</Button>
                }
              </Card>
              <WhiteSpace size="xl" />
              <WhiteSpace size="lg" />
            </WingBlank>
          </Form>
        </div>
      );
    };
    const action = (
      <WingBlank>
        <Button type="primary" onClick={() => router.push('/driverSide/personal/myBankcardAdd')} block style={{ marginTop: '10px' }}>
          添加银行卡
        </Button>
      </WingBlank>
    );
    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        // renderHeader={serarchForm}
        renderFooter={() => (
          <div style={{ padding: 30, textAlign: 'center' }}>
            {isLoading ? '加载中...' : '加载完毕'}
          </div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh
          refreshing={refreshing}
          onRefresh={this.onRefresh}
        />}
        scrollRenderAheadDistance={500}
        onEndReached={() => this.onEndReached}
        onEndReachedThreshold={10}
      />
    );
    return (
      <div id={NetWork.netWork}>
        <NavBar
          mode="light"
          icon={<Icon type="left"/>}
          onLeftClick={() => router.push('/wallet/wallet')}
        >银行卡管理
        </NavBar>
        <div className='am-list'>
          <Tabs
            tabs={[
              { title: '我的银行卡' },
            ]}
            initialPage={0}
            onChange={(tab, index) => this.changeTab(tab, index)}
          >
            <div>
              {listView}
            </div>
          </Tabs>
          {action}
        </div>
      </div>
    );
  }
}

export default myBankcard;
