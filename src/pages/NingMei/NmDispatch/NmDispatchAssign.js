import { ListView,Flex,PullToRefresh,Button,Modal, NavBar,Card } from 'antd-mobile';
import React from 'react';
import { connect } from 'dva';
import router from 'umi/router';
import { Alert, Col, Form, Icon, message, Row,List } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import QRCode from 'qrcode.react'
import func from '@/utils/Func';
import {getQueryConf} from '@/components/Matrix/MatrixQueryConfig';
import { nanoid } from 'nanoid';
import { COMMONBUSINESS_LIST } from '../../../actions/commonBusiness';
import { getColums, getTenantId } from "../../Merchants/commontable";
import { getButton } from '../../../utils/authority';
import { FormattedMessage } from 'umi/locale';
import { requestApi } from '../../../services/api';
import { getVerifyTime, submit } from '@/services/commonBusiness';
import './Matrix.less';
import refresh from '../../../../public/image/refresh.png'
import { handleDate, handleDateIsRange } from '@/components/Matrix/commonJs';

const FormItem = Form.Item;
const Item = List.Item;

const dataSource1 = new ListView.DataSource({
  rowHasChanged: (row1, row2) => row1 !== row2,
});

@connect(({ tableExtend,commonBusiness,loading }) => ({
  tableExtend,
  commonBusiness,
  loading: loading.models.commonBusiness,
}))
@Form.create()


class NmDispatchAssign extends React.Component {
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
      buttons: getButton('nm_dispatch_bill_byAssign'),
      QRCodeTime:'',
      itemData:{},
      seconds: 30,
      countDown: '30秒后二维码失效',
      dateSelected:false,
      qrcodeRefreshTime:'',//  二维码提示信息
    };
  }



  componentWillMount() {
    const { dispatch,
      match: {
        params: { tableName,modulename },
      },
    } = this.props;
    const paramData={}
    dispatch(TABLEEXTEND_COLUMNLIST({ tableName,'modulename':modulename,queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        const newCondation = func.notEmpty(aa.table_condition)?aa.table_condition:this.conditions
        if(newCondation.length>0){
          newCondation.forEach((item)=>{
            if (item.category === 9) {  // 处理时间区间
              const {valueDefault,valueEndDefault} = handleDateIsRange(item.initialvalue)
              const dateValue1 = param[item.columnName]?func.formatFromStr(param[item.columnName][0]):valueDefault
              const dateValue2 = param[item.columnName]?func.formatFromStr(param[item.columnName][1]):valueEndDefault
              param[`${item.columnName}_ge`]=dateValue1
              param[`${item.columnName}_le`]=dateValue2
              delete param[item.columnName];
            }
            if (item.category === 2) {  // 处理时间
              const valueDefault = handleDate(item.initialvalue)
              const dateValue = param[item.columnName]?func.formatFromStr(param[item.columnName]):valueDefault
              if (item.conditionflag === 3) {
                param[`${item.columnName}_le`]=dateValue;
                delete param[item.columnName];
              }else if (item.conditionflag === 4) {
                param[`${item.columnName}_ge`]=dateValue;
                delete param[item.columnName];
              }else {
                param[item.columnName] = dateValue;
              }
            }
            if(func.notEmpty(item.initialvalue) || item.isReadonly === 1){
              paramData[item.columnName] = item.initialvalue
            }
          })
        }
        const  rparams = func.notEmpty(paramData)?paramData:{}
        this.setState({
          showColums: aa.table_main.filter(ii=>ii.listShowFlag === 1).slice(0,6),
          tableCondition:aa.table_condition
        })
        this.getData(true,rparams)
      }
    })
  }



  getData(ref,param) {
    const {
      dispatch,
      match: {
        params: {tableName,modulename },
      },
    } = this.props;
    const {pageNo,pageSize,dataSource,realdata,tableCondition} =this.state
    const newCondation = func.notEmpty(tableCondition)?tableCondition:this.conditions
    if(newCondation.length>0){
      newCondation.forEach((item)=>{
        if(item.conditionflag === 2){
          func.addQuery(param, item.columnName, '_like')
        }
        if(func.notEmpty(item.showname)){
          delete param[item.showname]
        }
        if (item.category === 9) {  // 处理时间区间
          const {valueDefault,valueEndDefault} = handleDateIsRange(item.initialvalue)
          const dateValue1 = param[item.columnName]?func.formatFromStr(param[item.columnName][0]):valueDefault
          const dateValue2 = param[item.columnName]?func.formatFromStr(param[item.columnName][1]):valueEndDefault
          param[`${item.columnName}_ge`]=dateValue1
          param[`${item.columnName}_le`]=dateValue2
          delete param[item.columnName];
        }
        if (item.category === 2) {  // 处理时间
          if (item.conditionflag === 3) {
            param[`${item.columnName}_le`]=func.format(param[item.columnName]);
            delete param[item.columnName];
          }else if (item.conditionflag === 4) {
            param[`${item.columnName}_ge`]=func.format(param[item.columnName]);
            delete param[item.columnName];
          }else {
            param[item.columnName] = func.format(param[item.columnName]);
          }
        }
        if(func.notEmpty(item.initialvalue) && item.isReadonly === 1){
          param[item.columnName] = item.initialvalue
        }
      })
    }
    this.conditions = func.notEmpty(tableCondition) && tableCondition.length>0?tableCondition:this.conditions
    param.current=pageNo
    param.size=pageSize
    param['Blade-DesignatedTenant'] = getTenantId()
    const rparams = func.notEmpty(param)?param:{}
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:rparams})).then(()=>{
      const { commonBusiness:{ data },
      } = this.props;
      const tempdata = data.list;
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





  showQcode=(item)=>{
    getVerifyTime({ key: nanoid(),value:item.id,timeout:30}).then(resp => {
      if (resp.success){
        const that=this
        that.timer = setInterval(() => {
          this.setState((preState) =>({
            seconds: preState.seconds - 1,
            countDown: `${preState.seconds - 1}秒后二维码失效`,
            qrcodeRefreshTime:'二维码有效时间30s',
          }),() => {
            if(this.state.seconds === 0){
              clearInterval(this.timer);
              this.setState({
                countDown:'二维码已失效',
                qrcodeRefreshTime:'点击刷新二维码',
                dateSelected:true
              })
            }
          });
        }, 1000)
      }else{
        message.error(resp.msg)
      }
    })
    this.setState({
      billId:item.id,
      itemData:item,
      showQRCode:true,
    })
  }

  RefreshTime = () => {
    getVerifyTime({ key: nanoid(),value:'',timeout:30}).then(resp => {
      if (resp.success){
      const that=this
      that.timer = setInterval(() => {
      this.setState((preState) =>({
        seconds: preState.seconds - 1,
        countDown: `${preState.seconds - 1}秒后二维码失效`,
        qrcodeRefreshTime:'二维码有效时间30s',
        dateSelected: false
      }),() => {
        if(this.state.seconds === 0){
          clearInterval(this.timer);
          this.setState({
            countDown:'二维码已失效',
            qrcodeRefreshTime:'点击刷新二维码',
            dateSelected: true
          })
        }
      });
    }, 1000)
      }else{
        message.error(resp.msg)
      }
    })
  }

  // ************ 查询框
  showSearch = () => {
    this.setState({
      showSearchModal:true,
    })
  }

  onClose = () => {
    clearInterval(this.timer);
    this.setState({
      showSearchModal:false,
      showQRCode:false,
      QRCodeTime:'',
      dateSelected: false,
      countDown:'30秒后二维码失效',
      qrcodeRefreshTime:'二维码有效时间30s',
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
        console.log(path,"==========path")
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
    }else{
      const { match: {
        params: { tableName,modulename },
      } } = this.props;
      const refresh = this.handleSearch;
      const {params} = this.state
      if(btn.code.includes('withoutPop')){
        submit({tableName,modulename,submitParams:{realId:obj.id},btnCode:btn.code}).then(resp=>{
          if(resp.success){
            message.success('操作成功！');
            refresh(params)
          }
        })
      }
    }
  };

  onFirstClick = (item) => {
    this.myclickHandler()// 给state赋值渲染
    this.showQcode(item)// 打开二维码
  };

  onButtonClick = () => {
    this.myclickHandler()// 给state赋值渲染
    this.RefreshTime();// 触发二维码倒计时
  };


  myclickHandler = () => {
    console.log(this)
    this.setState({
      seconds: 30,
      dateSelected: false
    }, () => {
    //  console.log(this.state.seconds) // 更新后的值222
    })
   // console.log(this.state.seconds) // 123
  }

  handleMask=()=>{
    this.setState({
      dateSelected: true
    })
  }


  render() {
    const {form} = this.props
    const {dataSource,isLoading,refreshing,showSearchModal,showQRCode,billId,showColums,buttons,itemData,countDown,qrcodeRefreshTime,dateSelected } = this.state



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
      console.log(rowData,"===========rowData.kkkkkkk")
      return (
        <div key={rowID}>
          {
            rows.length>0 ?
              <Card>
                {
                  rowData.waybillStatus === '3' ?
                    <Card.Header
                      extra={
                        <span style={{color:'blue'}}>
                          <Icon type="qrcode" onClick={()=> this.onFirstClick(rowData)}  />:
                        </span>
                      }
                    />:
                    <Card.Header
                      style={{display:'none'}}
                      extra={
                        <span style={{color:'blue'}}>
                          <Icon type="qrcode" onClick={()=> this.onFirstClick(rowData)} />:
                        </span>
                      }
                    />
                }
                <Card.Body key={sectionID} onClick={()=>{this.handleBtnClick(viewBtn[0], rowData)}}>
                  <Row gutter={24}>
                    {
                      rows.map(rrow => (
                        <Col span={24} className="view-config"><FormItem {...formItemLayout} label={rrow.key}><span style={{color: 'rgba(0, 0, 0, 0.85)'}}>{rowData[rrow.value]}</span></FormItem></Col>
                      ))
                    }
                  </Row>
                </Card.Body>
                {
                  actionButtons.length>0?
                    <Card.Body>
                      {
                        rowData.waybillStatus === '3' ?
                          <Flex className='flexForList' style={{display:'none'}}>
                            {
                              actionButtons.map(button => {
                                return (
                                  <Flex.Item>
                                    <Button type="primary" size='small' inline onClick={() =>this.handleBtnClick(button,rowData)}>{<FormattedMessage id={`button.${button.alias}.name`} /> === `button.${button.alias}.name` ? <FormattedMessage id={`button.${button.alias}.name`} /> : button.name}</Button>
                                  </Flex.Item>
                                )
                              })
                            }
                          </Flex>:
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
                      }
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
        ><span style={{ color: '#108ee9' }}>客户指派单</span>
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
          <div>
            <p style={{textAlign: 'center',color:'#B22222',fontWeight:'bold'}}>{countDown}</p>
          </div>
          <div className={{position: 'relative'}}>
            <div
              className={`selectMask_box ${dateSelected === true ? "mask" : ""} `}
              onClick={()=> this.onButtonClick()}>
              <img src={refresh}></img>
            </div>
            <QRCode
              value={billId}// 生成二维码的内容
              size={220} // 二维码的大小
              fgColor="#000000" // 二维码的颜色
            />
          </div>
          <div>
            <p style={{textAlign: 'center',fontSize:'12px',paddingTop: '10px'}}>{qrcodeRefreshTime}</p>
          </div>
          <Card>
            <Card.Body>
              <List className="my-list">
                <Item>客户：{itemData.custnoName}</Item>
                <Item>品牌名称：{itemData.brandName}</Item>
                <Item>车号：{itemData.vehiclenoName}</Item>
              </List>
            </Card.Body>
          </Card>
        </Modal>
      </div>
    );
  }
}

export default NmDispatchAssign;
