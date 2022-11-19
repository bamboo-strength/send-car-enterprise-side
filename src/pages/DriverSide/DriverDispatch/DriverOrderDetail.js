import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {  NavBar,List,Flex } from 'antd-mobile';
import router from 'umi/router';
import { Icon, Form, Card, Avatar } from 'antd';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {detailForDriver} from '../../../services/dispatchbill'
import func from '@/utils/Func';

@connect(({ dispatchbill,loading }) =>({
  dispatchbill,
  loading:loading.models.dispatchbill,
}))
@connect(({ tableExtend }) => ({
  tableExtend,
}))
@Form.create()
class DriverOrderDetail extends PureComponent {
  state= {
    detail:{},
    showColums: [],
    showSubColums: [],
  }

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    dispatch(TABLEEXTEND_COLUMNLIST({ 'tableName': 'mer_dispatchbill','modulename':'byOrder',queryType:0})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa=data.columList;
        this.setState({
          showColums: aa.table_main,
          showSubColums: aa.table_sub,
        })
      }
    })
    detailForDriver({id}).then(resp=>{
      this.setState({
        detail: typeof resp.data === 'string'?(func.notEmpty(resp.data)?JSON.parse(resp.data):{}):resp.data
      })
    })

 //   dispatch(DISPATCHBILL_DETAIL(id))
  }

  render() {
    const {
    //  dispatchbill: { detail },
      location
    } = this.props;
  const {detail,showColums,} = this.state
    const basic = (
      <div>
        <div>联系人：{detail.custName}</div>
        {/* <div>发货数：{detail.custName}</div> */}
      </div>
    )
    const title = (<span>发货方：{detail.tenantIdName}</span>)
    // console.log(detail,showColums,detail.sublist,'===============')
    const style={
      spanSty1:{
        width: '33%',color: 'gray',float:'left',textAlign: 'justify',textJustify:'distribute-all-lines'
  },
      spanSty2 : {
        width: '60%',
      },
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push(location.state.backUrl)}
        >派车单详情
        </NavBar>
        <Form hideRequiredMark className='am-list'>
        {/*  <Card>
            <Meta
              avatar={
                <Avatar src="https://zos.alipayobjects.com/rmsportallocal/ODTLcjxAfvqbxHnVXCYX.png" />
              }
              title={title}
              description={basic}
            />
          </Card> */}
          <Card title="基本信息">
            <List className='static-list'>
              {
                showColums.map(rrow => (
                  <Flex key={rrow.value}>
                    <span style={{width: '40%',textAlign: 'right',color: 'gray'}}>{rrow.columnAlias}：</span>
                    <span style={{width: '60%',textAlign: 'left',wordBreak: 'break-word'}}>{(func.notEmpty(rrow.dickKey) && func.notEmpty(rrow.showname))?detail[rrow.showname]:detail[rrow.columnName]}</span>
                  </Flex>
                ))
              }
            {/*  <Item><span style={style.spanSty1}>派车编号：</span>
                <span style={style.spanSty2}>{detail.id}</span>
              </Item>
              <Item><span style={style.spanSty1}>派车时间：</span>
                <span style={style.spanSty2}>{func.notEmpty(detail.createTime)?detail.createTime:detail.inputtime}</span>
              </Item>
              <Item><span style={style.spanSty1}>发货次数：</span>
                <span style={style.spanSty2}>{detail.count}</span>
              </Item>
              <Item><span style={style.spanSty1}>车牌号：</span>
                <span style={style.spanSty2}>{detail.vehicleno}</span>
              </Item>
              <Item><span style={style.spanSty1}>{detail.isplan==='0'?'计划号':'订单号'}：</span>
                <span style={style.spanSty2}>{detail.orderId}</span>
              </Item>
              <Item><span style={style.spanSty1}>有效开始时间：</span>
                <span style={style.spanSty2}>{detail.begintime}</span>
              </Item>
              <Item><span style={style.spanSty1}>有效结束时间：</span>
                <span style={style.spanSty2}>{detail.endtime}</span>
              </Item>
              <Item><span style={style.spanSty1}>备注：</span>
                <span style={style.spanSty2}>{detail.remark}</span>
              </Item>
              <Item><span style={style.spanSty1}>取消原因：</span>
                <span style={style.spanSty2}>{detail.text10}</span>
              </Item> */}
            </List>
          </Card>
      {/*    {
            detail.inputtype === 40?
              <Card title="收发货信息">
                <List>
                  <Item><Icon type="environment" theme="twoTone" twoToneColor="#eb2f96" style={{fontSize:'18px'}} /> 发货地址：{detail.shippingAddressName}</Item>
                   <Item><Icon type="environment" style={{fontSize:'18px'}} /> 途径地点：</Item>
                  <Item><Icon type="environment" theme="twoTone" style={{fontSize:'18px'}} /> 收货地址：{detail.receiveAddressName}</Item>
                </List>
              </Card>:''
          }

          <Card title="物资信息">
            {
              func.notEmpty(detail.sublist)?detail.sublist.map(rrow => (
                <List>
                  <Item>物资：{rrow.materialnoName}</Item>
                  <Item>包装：{rrow.packName}</Item>
                </List>
              )):''
          }
            {
              func.isEmpty(detail.sublist)?
                <List>
                  <Item>物资：{detail.materialnosName}</Item>
                </List>
              :''
            }
          </Card>
          {
            detail.inputtype === 40?
              <Card title="费用信息">
                <List>
                  <Item>运费（元）：{detail.freight}</Item>
                  <Item>结算依据：{detail.freightSettleTypeName}</Item>
                </List>
              </Card>:''
          }
*/}
        </Form>
      </div>
    );
  }
}
export default DriverOrderDetail;
