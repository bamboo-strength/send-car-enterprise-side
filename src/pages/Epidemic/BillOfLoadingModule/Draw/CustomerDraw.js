import React, { Component } from 'react';
import { List, NavBar, Toast, Modal, Button,Flex } from 'antd-mobile';
import { Card, Checkbox, Row, Col, Icon, Tag, Form, Modal as PcModal,Table } from 'antd';
import { router } from 'umi';
import QRCode from 'qrcode.react';
import { list,customerDrawBill,split,billDistributionList,billDistributionUpdate,isSplit} from '../../../../services/Epidemic/billOfLoadingServices';
import MatrixTabsListView from '@/components/MatrixMobile/MatrixTabsListView';
import MyModal from '@/components/Util/MyModal';
import DrawBillAgreement from './DrawBillAgreement'
import '../../Epidemic.less'
import { IconMeikuang, } from '@/components/Matrix/image';
import UseDept from '../../Components/UseDept';
import MatrixMobileDate from '@/components/Matrix/MatrixMobileDate';
import { handleDate, } from '@/components/Matrix/commonJs';
import Func from '@/utils/Func';
import MatrixMobileInput from '../../../../components/Matrix/MatrixMobileInput';
import { getButton } from '../../../../utils/authority';

@Form.create()
class CustomerDraw extends Component {
  constructor(props) {
    super(props);
    this.state = {
      billVisible:false,
      bill:{},
      deliverBill:{},
      checked:false,
      riskVisible:false,
      showSearchModal:false,
      param:{},
      showSplitBillModal:false,
      showSplitBillRecordModal:false,
      buttons:getButton('billOfLoadingdrawBillcustomerDraw'),
      splitList:[],
      billType:''
    };
  }

  onRef = ref => {
    this.child = ref;
  };

  getData=(type)=>{
    const {form} = this.props
    const formValues = form.getFieldsValue()
    if(type === 'reset'){
      delete formValues.deptId
    }
    const param = {
      ...formValues,
      beginTime:Func.formatFromStr(formValues.beginTime),
      endTime:Func.formatFromStr(formValues.endTime),
    }
    this.setState({
      param
    })
    delete param.deptName
    if (this.child) { this.child.onChoose(param,'refresh') }
    this.setState({
      showSearchModal:false
    })
  }

  drawBill=(id)=>{
    Modal.alert('领取提货单',
      <div>
        <Checkbox onChange={(e)=>this.setState({checked: e.target.checked,})}>
          风险提示：电子提货单确认领取后因各种原因导致的风险问题均由领取单位承担！
        </Checkbox>
        <a onClick={(e)=>{ e.preventDefault(); this.setState({riskVisible:true})}}>《用户服务协议》及《隐私政策》</a>
      </div>
    , [
      { text: '取消' },
      { text: '确定', onPress: () =>
          new Promise((resolve, reject) => {
            if(!this.state.checked){
              Toast.info('请同意协议')
            }else {
              this.setState({
                checked:false
              })
              customerDrawBill({id}).then(resp=>{
                if(resp.success){
                  Toast.info('领取成功')
                  resolve()
                  this.getData()
                }
              })
            }
          }),
      },
    ])
  }

  sendToDriver=(rowData)=>{ // 发给司机
    isSplit({id:rowData.id}).then(resp=>{// 判断提货单是否拆分过
      if(resp.success){
        if(resp.data.isSplit){ // 拆分过
          Toast.info('该提货单已做拆分，请在拆分列表中查看二维码')
        }else {
          this.setState({
            bill:rowData,
            billType:'1', // 主表二维码类型是1
            billVisible:true,
          })
        }
      }
    })
  }

  handleCancel = e => {
    this.setState({
      billVisible: false,
      showSearchModal:false,
      showSplitBillModal:false,
      showSplitBillRecordModal:false
    });
    if (this.child) { this.child.slipThrough(true) } // 防止滑动穿透
  };

  getAgreement=()=>{
    return <DrawBillAgreement />
  }

  showSearch = () => {
    this.setState({
      showSearchModal: true,
    });
  };

  splitBill=()=>{ // 拆分功能
    let id = 1;
    const {bill,} = this.state
    const {deliveryCount,cancelCount,deliverySplitCount} = bill
    const Pop = Form.create()(props=>{
      const {form} = props
      const { getFieldDecorator, getFieldValue } = form;
      getFieldDecorator('keys', { initialValue: [0] });
      const reaminValue = parseInt(deliveryCount,10)-parseInt(deliverySplitCount,10)-parseInt(cancelCount,10)
      // console.log(reaminValue,deliveryCount,deliverySplitCount,cancelCount)
      getFieldDecorator('remainCount', { initialValue: reaminValue }); // 初始值是可拆分总量
      const keys = getFieldValue('keys');
      const remainCount = getFieldValue('remainCount');
      const calculateRemain=(operaid)=>{ // 计算
        const formValues = form.getFieldsValue()
        const numbers = formValues.list.map(item=>{return item.splitCount || 0})
        const total = numbers.reduce((n,m)=>parseInt(n,10)+parseInt(m,10))
        if(reaminValue-total <0) { // 拆分大于总量时
          Toast.info('拆分数量大于可拆分总量，请重新输入')
          if(operaid){
            form.setFieldsValue({
              [operaid]:''
            })
          }
        }else {
          form.setFieldsValue({remainCount:reaminValue-total})
        }
      }
      const remove = k => {
        form.setFieldsValue({
          keys: keys.filter(key => key !== k),
        },()=>{
          calculateRemain()
        });
      };

      const add = () => {
        const nextKeys = keys.concat(id++);
        form.setFieldsValue({
          keys: nextKeys,
        });
      };

      const handleCommonBtnOK=()=>{
        form.validateFieldsAndScroll((err, values) => {
          if(!err){
            const queueDeliveryDistributionList = values.list
            const params = { id:bill.id, queueDeliveryDistributionList }
            return new Promise((resolve, reject) => {
              Toast.loading('请稍后...')
              split(params).then(resp=>{
                if(resp.success){
                  Toast.info('操作成功')
                  resolve()
                  this.setState({
                    showSplitBillModal:false
                  })
                  this.getData()
                }
              })
            })
          }
        })

      }
      const formItems = keys.map((k, index) => (
        <Card title={`第${index+1}组`} extra={index!==0?<div style={{color:'blue'}} onClick={()=>remove(k)} headStyle={{ minHeight: '36px',backgroundColor: 'red'}}>删除</div>:undefined}>
          <MatrixMobileInput id={`list[${k}].carrierName`} label='承运商' placeholder='请输入承运方' required className='list-class' form={form} />
          <MatrixMobileInput id={`list[${k}].splitCount`} labelNumber={7} label='拆分数量(张)' maxLength={3} placeholder='请输入拆分数量' numberType='isIntGtZero' required className='list-class' onBlur={()=>calculateRemain(`list[${k}].splitCount`)} form={form} />
        </Card>
      ));
      const addBtn = (
        <span className='showRemainAndBtn'>
          <div>剩余<span style={{color:'red'}}> {remainCount} </span>张</div>
          <Button type="ghost" onClick={add} size='small' style={{width:'60%'}}><Icon type="plus" />新增</Button>
        </span>
      )
      return (
        <PcModal
          visible
          onOk={handleCommonBtnOK}
          onCancel={this.handleCancel}
          closable={false}
          bodyStyle={{padding:'10px 5px'}}
        >
          {formItems}
          {addBtn}
        </PcModal>
      );
    })
    return <Pop />
  }

  handleBtnClick=(code,record)=>{
    switch (code) {
      case 'split': // 拆分
        this.setState({
          showSplitBillModal:true,
          bill:record
        })
        if (this.child) { this.child.slipThrough(false) } // 防止滑动穿透
        break;
      case 'splitRecording': // 拆分记录
        billDistributionList({id:record.id}).then(resp=>{
          if(resp.success){
            this.setState({
              bill:record,
              splitList:resp.data,
              showSplitBillRecordModal:true
            })
            if (this.child) { this.child.slipThrough(false) } // 防止滑动穿透
          }
        })
        break;
      case 'sendToFleed': // 发送车队
        this.setState({
          deliverBill:record,
          billType:2, // 拆分二维码类型是2
          billVisible:true,
        })
        break;
      case 'edit': // 修改
        Modal.prompt('修改', '修改拆分张数',
          [
            {text: '取消'},
            {
              text: '确定',
              onPress: value => new Promise((resolve,reject) => {
                if(!value){
                  Toast.info('请输入拆分的张数')
                  return
                }
                if (!/^\+?[1-9]\d*$/.test(value) || value.length>2) {
                  Toast.info('请输入正整数且不超过3位')
                  return;
                }
                Toast.loading('请稍后...')
                const {bill} = this.state
                billDistributionUpdate({id:record.id,deliveryId:bill.id,splitCount:value}).then(resp=>{
                  if(resp.success){
                    Toast.info('操作成功')
                    resolve();
                    this.getData()
                    this.handleBtnClick('splitRecording',bill)
                  }
                })
              }),
            }
            ])
        break;
      default:
    }
  }

  render() {
    const {billVisible,bill,riskVisible,showSearchModal,param,showSplitBillModal,showSplitBillRecordModal,buttons,splitList,billType,deliverBill} = this.state
    const tabs = [{ title: '待领取', key: '1' }, { title: '已领取', key: '2' }];
    const {form} =this.props
    const qrBill = billType===2?deliverBill:bill
    const row = (rowData, sectionID, rowID) => {
      const {id,deptName,custName,materialName,deliveryCount,plannedTonnage,statusName,status,bindCount,cancelCount,finshCount,beginTime,endTime,deliverySplitCount} = rowData
      let actions = []
      if(status === 1){ // 待领取
        actions = [<a style={{color:'#1890FF'}} onClick={()=>this.drawBill(id,)}>领取提货单</a>]
      }else {
        actions = [<a style={{color:'#1890FF'}} onClick={()=>this.sendToDriver(rowData)}>发给司机</a>, <a style={{color:'#1890FF'}} onClick={()=> router.push(`/billOfLoading/drawBill/detail/${id}`)}>详情</a>]
        buttons.map(item =>{
          actions.push(<a style={{color:'#1890FF'}} onClick={()=>this.handleBtnClick(item.code,rowData)}>{item.name}</a>)
        })
      }
      const listData = [{'label':'收货单位',value:custName,},{'label':'物资名称',value:materialName,},{'label':'提货单张数',value:deliveryCount,},
        {'label':'计划重量(吨)',value:plannedTonnage,},{'label':'绑定张数',value:bindCount,},{'label':'作废张数',value:cancelCount,},{'label':'已拆分数量',value:deliverySplitCount,},{'label':'完成张数',value:finshCount,}
        ,{'label':'有效开始时间',value:beginTime,},{'label':'有效结束时间',value:endTime,}]
      return (
        <div key={rowID}>
          <Card
            title={<div><img src={IconMeikuang} key={rowID} alt='' style={{height:20}} />&nbsp;&nbsp;{deptName}</div>}
            actions={actions}
            size="small"
            extra={statusName}
            className='card-list'
            bordered={false}
          >
            <List style={{position: 'static'}}>
              {
                listData.map(item=>{
                  return <List.Item style={{minHeight:38}} extra={item.value}>{item.label}：</List.Item>
                })
              }
            </List>
          </Card>
        </div>
      );
    };
    const columns = [{ title: '承运商', dataIndex: 'carrierName',align:'center',width:'50%'},{ title: '拆分数', dataIndex: 'splitCount',align:'center',width:'15%',render: (text) => <span>{text}张</span>},
      { title: '剩余数', dataIndex: 'surplusCount',align:'center',width:'15%',render: (text,) => <span>{text}张</span>},{ title: '操作',width:'30%',align:'center',
      render: (text, record) => (
          <div style={{ textAlign: 'center' }}>
            <a onClick={() => this.handleBtnClick('sendToFleed',record)}>
              发给车队
            </a> &nbsp;
            <a onClick={() => this.handleBtnClick('edit',record)}>
              修改
            </a>
          </div>
      ),}]
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push('/dashboard/function');
          }}
          rightContent={[<Icon key="0" type="search" style={{ marginRight: '16px' }} onClick={() => this.showSearch()} />]}
        >电子提货单(客户端)
        </NavBar>
        <div className='am-list'>
          <MatrixTabsListView
            tabs={tabs}
            onRef={this.onRef}
            interfaceUrl={list}
            row={row}
            tabKeyName="status"
            changeTab={this.changeTab}
            dontShow
          />
        </div>

        <PcModal
          title='电子提货单'
          visible={billVisible}
          maskClosable
          onCancel={()=>this.setState({billVisible: false,})}
          className="billModalStyle"
          footer={null}
          closeIcon={<Icon type="close-circle" style={{fontSize: '20px',color:'white'}} />}
          bodyStyle={{backgroundColor: '#7865e0',padding: '12px 12px 30px 12px'}}
        >
          <div className='sendAndReceive'>
            <p> <Tag color="#f50">发货</Tag>{qrBill.deptName}</p>
            <p> <Tag color="#2db7f5">收货</Tag>{qrBill.custName}</p>
          </div>
          <div className='sendAndReceive qrContentStyle'>
            <QRCode
              value={`${qrBill.id}@${billType}`}// 生成二维码的内容
              size={150} // 二维码的大小
              fgColor="#000000" // 二维码的颜色
              style={{margin:'0px auto'}}
            />
            <p style={{marginTop:'10px'}}>物资名称：{qrBill.materialName}</p>
            {
              billType===2? // 发给车队
                <div>
                  <p>数量(张)：{qrBill.splitCount}</p>
                  <p>承运商：{qrBill.carrierName}</p>
                  <p>结束时间：{qrBill.endTime}</p>
                </div>:
                <div>
                  <p>货单数量(张)：{qrBill.deliveryCount}</p>
                  <p>有效期：{qrBill.beginTime}至{qrBill.endTime}</p>
                </div>
            }

          </div>
        </PcModal>
        <MyModal
          top={0}
          modaltitel="服务条款"
          visible={riskVisible}
          onCancel={()=>this.setState({riskVisible:false})}
          popupContent={this.getAgreement}
          selectRow={[]}
          popupwidth={0.9}
          height={0.6}
          isfangdaDisplay={false}
        />
        <Modal
          visible={showSearchModal}
          transparent
          maskClosable
          onClose={this.handleCancel}
          popup
          animationType='slide-down'
          platform='android'
        >
          <Row>
            <UseDept form={form} span={8} detail={param} />
            <MatrixMobileDate placeholder="生效开始时间" label='生效开始时间' id='beginTime' format="YYYY-MM-DD HH:mm:ss" initialValue={handleDate('beforeDay,00:00:00,5')} form={form} />
            <MatrixMobileDate placeholder="生效结束时间" label='生效结束时间' id='endTime' format="YYYY-MM-DD HH:mm:ss" initialValue={handleDate('nextDay,23:59:59,2')} form={form} />
          </Row>

          <div style={{ marginTop: '8px', float: 'right' }}>
            <Button type="primary" size='small' inline onClick={() => this.getData()} style={{ marginLeft: '8px' }}>查询</Button>
            <Button type="primary" size='small' inline onClick={() => this.getData('reset')} style={{ marginLeft: '15px' }}>重置</Button>
          </div>
        </Modal>
        <Modal
          visible={showSplitBillRecordModal}
          transparent
          maskClosable
          onClose={this.handleCancel}
          animationType='slide-down'
          platform='android'
          className='billMobileModalStyle'
          closable
          popup
        >
          <Table dataSource={splitList} columns={columns} pagination={false} size="small" />
        </Modal>
        {showSplitBillModal?this.splitBill():undefined}
      </div>
    );
  }
}

export default CustomerDraw;
