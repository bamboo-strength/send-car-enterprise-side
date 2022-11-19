import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import func from '@/utils/Func';
import { Form, Drawer, Radio, Icon, message } from 'antd';
import { NavBar, Card,Button } from 'antd-mobile';
import { COMMONBUSINESS_DETAIL } from '@/actions/commonBusiness';
import {getEditConf} from '@/components/Matrix/MatrixEditConfig';
import { getListConf } from '@/components/Matrix/MatrixListColumConfig';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { getBaseUrl } from '../commontable';
import { getToken } from '@/utils/authority';

@connect(({ commonBusiness,tableExtend,customer, loading }) => ({
  commonBusiness,
  tableExtend,
  customer,
  loading: loading.models.commonBusiness,
}))

@Form.create()
class CommonPagePay extends PureComponent {

  state = {
    showColums: [],
    showSubColums:[],
    visible: false,
    placement: 'bottom',
    value:1,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id,tableName,modulename },
      },
    } = this.props;
    if(id!=='withoutID'){
      dispatch(COMMONBUSINESS_DETAIL({realId:id, tableName,modulename}))
    }

    dispatch(TABLEEXTEND_COLUMNLIST({tableName,modulename,queryType:2})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(func.notEmpty(data.columList)){
          const aa=data.columList;
          this.setState({
            showColums: aa.table_main,
            showSubColums: aa.table_sub,
          })
        }
      }
    })
  }

  showDrawer = () => {
    this.setState({
      visible: true,
    });
  };

  weChatPay = (aa)=>{
    try {
      const pay = Number(aa) / 100;
    //  WXPay.startWXPay(pay);
       message.info('支付成功')
      const {location,
        customer:{
          RegistedInfo,
        },} = this.props

      if(location.state){
        if(location.state.type === 'toContract'){
          const jsonData={
            "${contractno1}":'',
            "${address1}":"网签合同",
            "${name1}":"山东矩阵软件股份有限公司",
            "${name2}": RegistedInfo.realName,
            "${timeStamp1}":"",
            "${timeStamp2}":""
          }
          const a1={
            "realName": RegistedInfo.realName,
            "cardId":RegistedInfo.cardId,
            "legalPerson":RegistedInfo.legalPerson,
            "certType":"0",
            "phoneNo":RegistedInfo.phoneNo,
            "templateId":'TEM1025026',
            "flag":"ture",
            "contractData":jsonData,

            // "signerId": "10923668"
          }
          const address = `${getBaseUrl()}/contract-sign/${getToken()}/${JSON.stringify(a1)}`
          // window.location.href=address

        }
      }

    } catch (e) {
      console.log('目前不支持');
    }
  }

  onClose = () => {
    this.setState({
      visible: false,
    });
  };

  onChange = e=>{
    this.setState({
      value:e.target.value
    })
  }

  render() {
    const {
      form,
      location,
      commonBusiness,
      match: {
        params: {tableName,modulename },
      },
    } = this.props;
    let {detail} = this.props
    detail = location.state?location.state.detail:commonBusiness.detail
    const payName = location.state?location.state.payName:'确认支付'
    const backUrl =location.state?location.state.backUrl:`/commonBusiness/commonList/${tableName}/${modulename}`
    const {showColums,showSubColums,placement, visible,value} = this.state;

    const iteams=getEditConf(showColums,form,detail);

    const columns=getListConf(showSubColums)
    const radiotmp = [{name:'微信支付',value:2,icon:'wechat',color:'#09bb07'},
      // {name:'支付宝支付',value:1,icon:'alipay-circle',color:'#06b4fd'},
      //  {name:'银行卡支付',value:3,icon:'credit-card',color:'#ec3a4e'},{name:'钱包',value:4,icon:'wallet',color:'#ff7e00'}
    ]
    const drawerTitle = <div className='drawerTitle'><span>请选择支付方式</span><Icon type="close" className='drawerIcon' onClick={this.onClose} /></div>
    return (
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(backUrl)}
        >{payName}
        </NavBar>
        <div className='am-list'>
          <Form hideRequiredMark={false}>
            <Card>
              <Card.Body title="基本信息" className={styles.card} bordered={false}>
                {iteams}
              </Card.Body>
              {
                showSubColums.length<1 ? undefined :
                  <div>
                    {
                      func.notEmpty(detail.sublist) ? detail.sublist.map(col => (
                        <Card.Body>
                          {
                            columns.map(rrow => (
                              <div key={rrow.dataIndex}>{rrow.title}：{col[rrow.dataIndex]}</div>
                            ))
                          }
                        </Card.Body>
                      )) : ''
                    }
                  </div>
              }
            </Card>
            <Button type="primary" block className='onlineBtn' onClick={this.showDrawer}>支付</Button>
            <Drawer
              title={drawerTitle}
              placement={placement}
              closable={false}
              onClose={this.onClose}
              visible={visible}
              className='drawerBox'
            >
              <Radio.Group onChange={this.onChange} value={value} style={{width:'100%'}}>
                {radiotmp.map(item =>{
                  return (<div className='ridioDiv'>
                    <Icon type={item.icon} style={{fontSize:'24px',marginRight:15,color:item.color}} theme="filled" />
                    <Radio className='radioStyle' value={item.value}>{item.name}</Radio>
                  </div>)
                })
                }
              </Radio.Group>
              <Button type='primary' block className='onlineBtn' onClick={()=>this.weChatPay(detail.money)}>支付</Button>
            </Drawer>
          </Form>
        </div>
      </div>
    );
  }
}
export default CommonPagePay;

