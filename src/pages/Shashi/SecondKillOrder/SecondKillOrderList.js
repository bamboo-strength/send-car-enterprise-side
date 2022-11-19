import { ListView,Flex,PullToRefresh,Button,Modal, NavBar,Card } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Col, Form, Icon, Row } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import QRCode from 'qrcode.react'
import func from '@/utils/Func';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';
import { COMMONBUSINESS_LIST } from '../../../actions/commonBusiness';
import { getColums, getTenantId } from '../../Merchants/commontable';
import { getButton } from '../../../utils/authority';
import { FormattedMessage } from 'umi/locale';
import { requestApi } from '../../../services/api';

const FormItem = Form.Item;

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ tableExtend,commonBusiness }) => ({
  tableExtend,
  commonBusiness
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
      billId:'',
      showColums:[],
      tableCondition:[],
      buttons: getButton('shashi_dinas_seckill_info_dinasSeckillInfoQuery'),
    };
  }

  componentWillMount() {
    const { dispatch,
      match: {
        params: { tableName,modulename },
      },
    } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({ tableName,'modulename':modulename,queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        this.setState({
          showColums: aa.table_main.filter(ii=>ii.listShowFlag === 1).slice(0,6),
          tableCondition:aa.table_condition
        })
      }
    })
     setInterval(()=>{
       this.setState({
         aa:Math.floor(Math.random() * 200)
       })
     },1000)
    this.getData(false,{})
  }

  getData(ref,param) {
    const {
      dispatch,
      match: {
        params: {tableName,modulename },
      },
    } = this.props;
    const {pageNo,pageSize,dataSource,realdata} =this.state
    param.current=pageNo
    param.size=pageSize
    param['Blade-DesignatedTenant'] = getTenantId()
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:param})).then(()=>{
      const { commonBusiness:{ data },
      } = this.props;
      const tempdata = data.list?data.list.filter(d => { return d.id !== -1 }):[]
      const len = tempdata.length
      if (len <= 0) {
        this.setState({
          refreshing: false,
          isLoading: false,
          hasMore: false
        })
      }
      if (ref) {
        this.setState({
          pageNo,
          dataSource: dataSource.cloneWithRows(tempdata),
          hasMore: true,
          refreshing: false,
          isLoading: false,
          realdata: tempdata
        })
      } else {
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
      showQRCode:false,
      //  billId:''
    })
  }

  handleBtnClick = (btn, obj) => {
    this.setState({
      pageNo: 1,
      upOrDown: true,
    });
    const { path, alias } = btn;
    if (alias === 'edit') {
      router.push(`${path}/${obj.id}`);
    } else if (alias === 'view') {
      // router.push(`${path}/${obj.id}`);
      if(func.notEmpty(obj.id)){
        router.push(`${path}/${obj.id}`);
      }else {
        router.push(
          {
            pathname: `${path}/${obj.id}`,
            state: {
              data: obj,
            },
          },
        );
      }

    } else if (alias === 'delete') {
      alert('删除', '确定删除?', [
        { text: '取消', style: 'default' },
        {
          text: '确定', onPress: () => {
            requestApi(path, { ids: obj.id }).then(resp => {
              if (resp.success) {
                Toast.success(resp.msg);
                this.reset();
              }
            });
          },
        },
      ]);
    }
  };

    calulataTime=(time)=>{
      let timer='';
      const aa = new Date().getTime()
      const bb = new Date(time).getTime()
      const times = bb-aa
  //    timer=setInterval(function(){
      let msg = '秒杀进行中'
      //  },10000000);
      if(times<=0){
        clearInterval(timer);
      }else {
        const days=Math.floor(times/(24*3600*1000))
        const leave1=times%(24*3600*1000)    // 计算天数后剩余的毫秒数
        const hours=Math.floor(leave1/(3600*1000))

        const leave2=leave1%(3600*1000)        // 计算小时数后剩余的毫秒数
        const minutes=Math.floor(leave2/(60*1000))

        const leave3=leave2%(60*1000)      // 计算分钟数后剩余的毫秒数
        const seconds=Math.round(leave3/1000)
        msg = `距离秒杀还有 ${days}天:${hours}时：${minutes}分：${seconds}秒`
      }
      return msg
    }

  render() {
    const {form} = this.props
    const {dataSource,isLoading,refreshing,showSearchModal,showQRCode,billId,showColums,buttons } = this.state
    const rows =getColums(showColums,'')
    const formItemLayout = {
      labelCol: {
        xs: { span: 9 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 15 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };
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
    const actionButtons = buttons.filter(button => button.alias !== 'add' && button.alias !== 'view' && button.alias !== 'downloadExcel' && button.action !== 4);
    const viewBtn = buttons.filter(button => button.alias === 'view');
    const row = (rowData, sectionID, rowID) => {
      return (
        <div key={rowID}>
          {
            rows.length>0 ?
              <Card>
                <Card.Body key={sectionID} onClick={()=>{this.handleBtnClick(viewBtn[0], rowData)}}>
                  <Row gutter={24}>
                    {
                      rows.map(rrow => (
                        <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.key}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>{rowData[rrow.value]}</span></FormItem></Col>
                      ))
                    }
                  </Row>
                  <Row gutter={24}>
                    <Col span={24} className="view-config"><span style={{color: 'red'}}> {this.calulataTime(rowData.executeBegintime)}</span></Col>
                  </Row>
                </Card.Body>
                {
                  actionButtons.length>0?
                    <Card.Body>
                      <Flex className='flexForList'>
                        {
                          actionButtons.map(button => {
                            return (
                              <Flex.Item>
                                <Button type="primary" size='small' inline onClick={() =>this.handleBtnClick(button,rowData)}>{<FormattedMessage id={`button.${button.alias}.name`} /> === `button.${button.alias}.name` ? <FormattedMessage id={`button.${button.alias}.name`} /> : button.name}</Button>
                              </Flex.Item>
                            )
                          })
                        }
                      </Flex>
                    </Card.Body>:undefined
                }
              </Card>:undefined
          }
        </div>
      );
    };

    const serarchForm = () => {
      const {tableCondition} = this.state
      const queryItem = getQueryConf(tableCondition,form,{})
      return (
        <div>
          {queryItem}
        </div>
      )
    };

    const listView = (
      <ListView
        ref={el => this.lv = el}
        dataSource={dataSource}
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
        ><span style={{ color: '#108ee9' }}>秒杀信息</span>
        </NavBar>
        <div className='am-list'>
          {listView}
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
