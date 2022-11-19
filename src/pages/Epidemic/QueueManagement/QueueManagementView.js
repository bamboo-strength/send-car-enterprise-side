import React, { PureComponent } from 'react';
import { ListView, PullToRefresh, NavBar, WhiteSpace,Toast } from 'antd-mobile';
import { Form, Icon, Button, Card, Tag, Modal } from 'antd';
import router from 'umi/router';
import func from '@/utils/Func';
import Text from 'antd/es/typography/Text';
import { list,callManagePage,callDriver} from '@/services/queuemanagement';

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@Form.create()
class QueueManagementView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      queuedetail:{},
      isLoading: true,
      hasMore: true,
      refreshing: true,
      dataSource: dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
    };
  }

  componentWillMount() {
    const { location } = this.props;
    const { match: { params: { id }}} = this.props;
    this.getQueuedetail()
    this.getData(false, {});
    }

  componentWillUnmount() {
  }

  getQueuedetail(){
    const { match: { params: { id }}} = this.props;
    list({id:id,isall:''}).then(resp => {
      this.setState({
        queuedetail:resp.data[0]
      })
    })
  }

  getData(ref, param, sourcegoodsid) {
    const { match: { params: { id }}} = this.props;
    const { pageNo, pageSize, dataSource, realdata, load } = this.state;
    const params={
      current:pageNo,
      size:pageSize,
      varietyOfCoalId:id,
      applyStatus:3,
      queueStatus:2,
      source:'call'
    }
    callManagePage(params).then(resp => {
      const tempdata = typeof resp.data === 'string' ? (func.notEmpty(resp.data) ? JSON.parse(resp.data) : []) : (func.notEmpty(resp.data.records) ? resp.data.records : '');
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
          realdata: tempdata,
        });
      } else { // 上拉加载
        const dataArr = realdata.concat(tempdata);
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(dataArr),
          refreshing: false,
          isLoading: false,
          realdata: dataArr,
        });
      }
    });
  }

  // 下拉刷新
  onRefresh = () => {
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };

  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.query(false, {});
    });
  };

  query = (flag, param) => {
    const { form, location } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      const values = {
        ...fieldsValue,
        ...param,
      };
      if (location.state !== undefined) {
        const sourcegoodsid = location.state.sourceGoodsId;
        this.getData(flag, values, sourcegoodsid);

      } else {
        this.getData(flag, values);
      }
      // this.getData(flag, values);
    });
  };

  reset = () => {
    const { form } = this.props;
    form.resetFields();
    this.setState({
      pageNo: 1,
    }, () => {
      this.query(true, {});
    });
  };


  toView = (rowData) => {
    router.push('/epidemic/queuemanagementview')
  };

  /* 关闭弹窗 */
  callDriver=(callParameter)=>{
    const {realdata}=this.state
    const { match: { params: { id }}} = this.props;
    const that=this
    Modal.confirm({
      // title: '',
      content: '是否确定叫车？',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      onOk() {
        callDriver({coalId:id,count:callParameter}).then((res)=>{
          if(res.success){
            Toast.success(res.msg)
            that.query(true, {});
            that.getQueuedetail()
          }
        })
      },
      onCancel() {
      },
    })
  }


  render() {
    const { queuedetail, dataSource, isLoading, refreshing } = this.state;
    const { form } = this.props;
    const separator = (sectionID, rowID) => (<div
      key={`${sectionID}-${rowID}`}
      style={{
        backgroundColor: '#F5F5F9',
        height: 8,
        borderTop: '1px solid #ECECED',
        borderBottom: '1px solid #ECECED',
      }}
    />);

    const row = (rowData, sectionID, rowID) => {
      return (
        <Card key={rowID} style={{padding:('0 0 0 0'),borderRadius: '16px',}}>
          <Card
            bordered={false}
            size='small'
            style={{ borderRadius: '16px !important'}}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between',marginBottom:2,marginTop:2 }}>
              <Text type="secondary" style={{width: '50%',color:'#20ba7a'}}>{rowData.vehicleno}&nbsp;
                {rowData.applyStatus==1?<Tag color="red">未审核</Tag>:rowData.applyStatus==3?<Tag color="green">已审核</Tag>:''}
              </Text>
              <Text type="secondary" style={{width: '50%',color:'#20ba7a'}}>
                排队号：{rowData.queueNumber}
              </Text>
              <h3 style={{width: '50%'}} type="secondary">{rowData.formalQueueTime}</h3> {/* 排队时间 */}
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text type="secondary">{rowData.deptName}</Text>
            </div>
          </Card>
        </Card>
      );
    };

    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
        renderFooter={() => (<div style={{ padding: 30, textAlign: 'center' }}>{isLoading ? '加载中...' : '加载完毕'}</div>)}
        renderRow={row}
        renderSeparator={separator}
        pageSize={4}
        useBodyScroll
        pullToRefresh={<PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} />}
        scrollRenderAheadDistance={500}
        onEndReached={this.onEndReached}
        onEndReachedThreshold={10}
      />
    );

    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite');
    return (
      <div>
        {
          ifFromOtherSite === 'ok' ? undefined :
            <NavBar
              mode="light"
              icon={<Icon type="left" />}
              onLeftClick={() => router.push('/epidemic/queuematerial')}
              style={{borderRadius: '16px !important'}}
            >叫号进厂
            </NavBar>
        }
        <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
          <Card
            // extra={}
            bordered={false}
            style={{borderRadius: '12px',background:'#1cbc7a'}}
            size='small'
            // actions={actions}
            // style={{ borderRadius: '16px !important'}}
            // onClick={() => this.toView()}
          >
            <div style={{ textAlign:'center',display: 'flex',flexDirection: 'column', justifyContent: 'space-between' }}>
              <h1 style={{color:'#FCFCFC',margin:('0px 0px -6px -12px'),fontWeight:'600'}}>&nbsp; {queuedetail.coalName}</h1>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between',marginBottom:5,marginTop:8 }}>
              <h2 style={{color:'#FCFCFC',fontWeight:'400',padding: ('0px 20px 0px')}} type="secondary">排队中(防疫信息未审核) <Text style={{color:'#FFD700'}}>{queuedetail.unapprovedInQueue}</Text> 辆</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between',marginBottom:5,marginTop:8 }}>
              <h2 style={{color:'#FCFCFC',fontWeight:'400',padding: ('0px 20px 0px')}} type="secondary">排队中(防疫信息已审核) <Text style={{color:'#FFD700'}}>{queuedetail.auditedInQueue}</Text> 辆</h2>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between',marginBottom:5,marginTop:8 }}>
               <h2 style={{color:'#FCFCFC',fontWeight:'400',padding: ('0px 20px 0px')}} type="secondary">今日已叫号 <Text style={{color:'#FFD700'}}>{queuedetail.callToday}</Text> 辆</h2>
              {/* <h2 style={{width: '45%',color:'#FCFCFC',fontWeight:'400',padding: ('0px 20 0px')}} type="secondary">已出场<Text style={{color:'#FFD700'}}>{queuedetail.factoryDeliveredNum}</Text>辆</h2> */}
            </div>
            <div style={{ textAlign:'center',}}>
              <Button
                style={{borderRadius: '16px',color:'#232323',padding:('0px 40px 0')}}
                onClick={() => this.callDriver(queuedetail.callParameter)}
              >
                叫车{queuedetail.callParameter}辆
              </Button>
              {/* <Button
                style={{color:'#000000', borderRadius: '16px',padding:('0px 30px 0px')}}
                // onClick={(e) =>this.toView(e)}
              >
                放行3辆
              </Button> */}
            </div>
          </Card>
          <WhiteSpace size="sm" />
          {listView}
        </div>
      </div>
    );
  }
}

export default QueueManagementView;
