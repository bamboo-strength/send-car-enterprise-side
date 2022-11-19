import { ListView,List, InputItem,Toast,PullToRefresh,Button,Modal, NavBar,Card,Tabs } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Form,Icon,Row } from 'antd';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import QRCode from 'qrcode.react'
import {reportInTransit,cancelOrder,pageForDriver} from '../../../services/dispatchbill'
import func from '@/utils/Func';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';

const {Item} = List
const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({dispatchbill,loading}) => ({
  dispatchbill,
  loading: loading.models.dispatchbill,
}))
@connect(({ tableExtend }) => ({
  tableExtend,
}))
@Form.create()
class DriverOrder extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isLoading: true,
      hasMore:true,
      refreshing: true,
      dataSource:dataSource1,
      realdata: [],
      pageNo: 1,
      pageSize: 5,
      showSearchModal:false,
      showQRCode:false,
      isfinish:'0',
      showCancel:false,
      billId:'',
      tenantId:'',
      showColums:[],
      tableCondition:[]
    };
  }

  componentWillMount() {
    const {dispatch} = this.props
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': 'mer_dispatchbill','modulename':'byDriver',queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        this.setState({
          showColums: aa.table_main,
          tableCondition:aa.table_condition
        })
      }
    })
    this.getData(false,{})
  }

  getData(ref,param) {
   // const { dispatch } = this.props;
    const {pageNo,pageSize,dataSource,realdata,isfinish} =this.state
  // console.log(param,pageNo,pageSize,dataSource,'.............')
    param.current=pageNo
    param.size=pageSize
    param.isfinish = isfinish
    delete param.reason
    pageForDriver(param).then(resp => {
      const tempdata = typeof resp.data === 'string'?(func.notEmpty(resp.data)?JSON.parse(resp.data):[]):(func.notEmpty(resp.data.records)?resp.data.records:[])
      const len = tempdata.length
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false
        })
      //  Toast.info('没有多余的数据', 1)
        //   return false
      }
      if (ref) {
        // 下拉刷新
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata
        })
      } else {
        // 上拉加载
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
      this.onClose()
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

  // 操作 派车单
  operate = (id,operNo,tenantId) => {
    if(operNo === '0'){
      // 取消
      this.setState({
        showCancel:true,
        billId:id,
        tenantId
      })
    }else{
     // console.log(operNo,id)
      reportInTransit({waybillStatus:operNo,dispatchBillId:id},tenantId).then(resp =>{
        if(resp.success){
          Toast.info(resp.msg)
          this.reset()
        }
      })
    }

  }

  cancelOrder=()=>{
    const {form} = this.props
    const {billId,tenantId} = this.state
   // console.log(billId,reason,'+++++++++++')
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        cancelOrder({dispatchBillId:billId,cancelReason:values.reason},tenantId).then(resp =>{
          if(resp.success){
            this.setState({showCancel:false})
            this.reset()
            Toast.info(resp.msg)
          }
        })
      }
    });
  }

  // 运输情况
  transSituation=(id) =>{
    router.push(`/driverSide/driverDispatch/situOntheWay/${id}`);
  }

  viewDetail = (id) => {
    router.push(
      {
        pathname: `/driverSide/driverDispatch/driverOrderDetail/${id}`,
        state: {
          backUrl: '/driverSide/driverDispatch/DriverOrder',
        },
      }
    );
  }

  showQcode=(id)=>{
    this.setState({
      billId:id,
      showQRCode:true
    })
  }

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    this.setState({
      showSearchModal:false,
      showCancel:false,
      showQRCode:false,
    //  billId:''
    })
  }

  changeTab=(tab, index) =>{
    let inn = 0
    if (index === 0){
      inn = 0
    }else{
      inn =1
    }
   // console.log(dataSource1)
    this.setState({
      pageNo:1,
      isfinish:inn,
      dataSource:dataSource1,
      isLoading:true
    },()=>{
      this.query(true,{})
    })
  }

  render() {
    const {form} = this.props
    const {dataSource,isLoading,refreshing,showSearchModal,showCancel,showQRCode,billId,showColums } = this.state
    const style={
      btnSty:{
        marginBottom:'5px'
      },
    }
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
      let operNo='error'; let operName='取消1'
      if(rowData.waybillStatus === 1){  // 已接单
          operNo = 2;operName= '到达'
      }else if (rowData.waybillStatus === 2) { // 已到达
        operNo = 3;operName= '装货'
      }else if (rowData.waybillStatus === 3) { // 已装货
        operNo = 4;operName= '送达'
      }else if (rowData.waybillStatus === 4) { // 已送达
        operNo = 5;operName= '签收'
      }

      const aa = (
        <div>
          <div> 创建日期：{func.notEmpty(rowData.createTime)?rowData.createTime:rowData.inputtime}</div>
          <div>派车单类型：{rowData.inputtype === 40 || rowData.inputtype === '40'?'抢单':'指派单'}</div>
          {
            rowData.waybillStatus ===5?'':
            <div>
              {rowData.waybillStatus === 1?
                <Button type="primary" size='small' inline className={style.btnSty} style={{float: 'right'}} onClick={() =>this.operate(rowData.id,'0',rowData.tenantId)}>取消</Button>
                :''
               /* <Button type="primary" size='small' inline style={{float: 'right'}} onClick={() =>this.transSituation(rowData.id)}>在途汇报</Button> */
              }
              {
                operNo ==='error'?'':
                <Button type="ghost" size='small' inline className={style.btnSty} style={{float: 'right',marginRight:'10px'}} onClick={() =>this.operate(rowData.id,operNo,rowData.tenantId)}>
                  {operName}
                </Button>
              }
              {/* <Button type="primary" size='small' inline style={{float: 'right',marginRight:'10px'}} onClick={() =>this.showQcode(rowData.id,)}>二维码</Button>
            */}
            </div>
          }
        </div>
      )
      return (
        <div key={rowID}>
          <Card full>
            <Card.Header
              extra={
                <span style={{color:'blue'}}>
                  {rowData.waybillStatusName} &nbsp;&nbsp;&nbsp;&nbsp;
                  <Icon type="qrcode" onClick={() =>this.showQcode(rowData.id,)} />
                </span>}
            />
            <Card.Body>
              {rowData.inputtype === 40 || rowData.inputtype === '40'?
                <a onClick={() =>this.viewDetail(rowData.id)} style={{color: 'black'}}>
                  <div>物资：{rowData.materialnosName}</div>
                  <div>车牌号：{rowData.vehicleno}</div>
                  <div>运费：{rowData.freight} 元/吨</div>
                    <div>
                      <div><Icon type="environment" theme="twoTone" twoToneColor="#eb2f96" style={{fontSize:'18px'}} />
                        发货地址： {rowData.shippingAddressName}
                      </div>
                      <div>
                        <Icon type="environment" theme="twoTone" style={{fontSize:'18px'}} /> 收货地址： {rowData.receiveAddressName}
                      </div>
                    </div>
                </a>
              :''}
              {rowData.inputtype !== 40 && rowData.inputtype !== '40'?
                <a onClick={() =>this.viewDetail(rowData.id)} style={{color: 'black'}}>
                  {
                    showColums.map(rrow => (
                      <div> {rrow.columnAlias}：{(func.notEmpty(rrow.dickKey) && func.notEmpty(rrow.showname))?rowData[rrow.showname]:rowData[rrow.columnName]}</div>
                    ))
                  }
                </a>
                :''}
            </Card.Body>
            <Card.Footer style={{paddingBottom:15}}
              content={aa}
            />
          </Card>
        </div>
      );
    };

    const serarchForm = () => {
      const {tableCondition} = this.state
      const ops=[{key:'10',value:'指派单'},{key:'40',value:'抢单'}]
      const queryItem = getQueryConf(tableCondition,form,{})
      return (
        <div>
          {queryItem}
          <Row>
            <MatrixSelect label="派车单类型" placeholder="请选择类型" id="inputtype" options={ops} form={form} style={{width:'100%'}} />
          </Row>
        </div>
      )
    /*  const ops=[{key:'10',value:'指派单'},{key:'40',value:'抢单'}]
      return (
        <List className='static-list'>
          <Item><MatrixSelect label="派车单类型" placeholder="请选择类型" id="inputtype" options={ops} form={form} style={{width:'100%'}} /> </Item>
        </List>
      ); */
    };

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
        onEndReached={()=>this.onEndReached}
        onEndReachedThreshold={10}
      />
    )
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/dashboard/function')}
          rightContent={[
            <Icon key="0" type="search" style={{fontSize:'24px',marginRight:'20px' }} onClick={() => this.showSearch()} />,
           ]}
        >派车单
        </NavBar>
        <div className='am-list'>
          <Tabs
            tabs={[
              {title:'进行中'},
              {title:'已完成'}
            ]}
            initialPage={0}
            onChange={(tab, index) => this.changeTab(tab, index)}
          >
            <div>
              {listView}
            </div>
            <div>
              {listView}
            </div>
          </Tabs>
        </div>
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          popup
          animationType='slide-down'
          platform='android'
        >
          {serarchForm()}
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.query(1)} style={{marginLeft:'8px'}}>查询</Button>
            <Button type="primary" size='small' inline onClick={() =>this.reset()} style={{marginLeft:'15px'}}>重置</Button>
          </div>
        </Modal>
        <Modal
          visible={showCancel}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          animationType='slide-down'
          platform='android'
        >
          <MatrixSelect label="取消原因" placeholder="请选择取消原因" id="reason" required form={form} dictCode='cancelOrderReasons' style={{width:'150px'}} />
          <div style={{marginTop:'8px',float:'right'}}>
            <Button type="primary" size='small' inline onClick={() =>this.cancelOrder()} style={{marginLeft:'8px'}}>确定</Button>
          </div>
        </Modal>
        <Modal
          visible={showQRCode}
          transparent
          maskClosable
          onClose={() =>this.onClose()}
          animationType='fade'
          platform='android'
        >
          <QRCode
            value={billId}// 生成二维码的内容
            size={220} // 二维码的大小
            fgColor="#000000" // 二维码的颜色
          />
        </Modal>
      </div>
    );
  }
}

export default DriverOrder;
