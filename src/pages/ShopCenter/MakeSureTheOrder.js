import React, { Component } from 'react';
import { Modal, NavBar, Toast } from 'antd-mobile';
import { Card, Form, Icon, Tag } from 'antd';
import style from '@/pages/ShopCenter/ShopCenter.less';
import Text from 'antd/es/typography/Text';
import { router } from 'umi';
import BuyNumModel from '@/pages/ShopCenter/component/BuyNumModel';
import { connect } from 'dva';
import ChooseAddress from '@/pages/ShopCenter/component/ChooseAddress';
import { commitContractOrder } from '@/services/contract';
import { CommodityStyle, SubmitOrdersBtn } from '@/pages/ShopCenter/component/ComponentStyle';
import {
  certificationResults,
  contractManageDrafts,
  documentAddByFiles,
  numbers,
  PageJudgment,
  pageurls,
  shopTitle,
} from '@/pages/ShopCenter/component/Interface';
import { getUserType } from '@/utils/authority';
import { clientId } from '@/defaultSettings';

const { alert } = Modal;

@connect(({ maintenance, shoppingmall, contract }) => ({
  maintenance,
  shoppingmall,
  contract,
}))
@Form.create()
class MakeSureTheOrder extends Component {

  constructor(props) {
    super(props);
    this.state = {
      modal1: false,
      combined: 0,
      data: {},
      number: 0,
      status: 0,
      isPersonal: false,
      isCompany: 0,
      addDetail: {},
      type: '',
      list: [],
      orderlist: {},
      loading: false,
      state:props.location.state
    };
  }

  componentDidMount() {
    const {state} = this.state
    console.log(state,'6666')
    if (state){
      /* 判断从哪个页面进入 */
      const res = PageJudgment(state,this.props)
      const { data, number, list, type } = res;
      this.setState({
        data, number, list,type,state:res
      },() => {
        this.combined();
      })
    }else {
      window.history.back();
    }
    // 请求企业认证结果和个人认证结果
    certificationResults(this.props).then(item=>{
      this.setState({
        isCompany: item[0].authStatus,
        isPersonal: item[1].authStatus,
      })
    })
  }

  /* 显示修改数量弹窗 */
  onEditNum = (item) => {
    const { form } = this.props;
    form.resetFields();
    if ((item.goodsEntity && item.goodsEntity.type !== 3) || (!item.goodsEntity && item.type !== 3)) {
      this.setState({
        modal1: true,
        orderlist: item,
      });
    } else {
      Toast.fail('优惠商品不允许修改数量');
    }
    if ((item.goodsEntity && item.goodsEntity.type !== 4) || (!item.goodsEntity && item.type !== 4)) {
      this.setState({
        modal1: true,
        orderlist: item,
      });
    } else {
      Toast.fail('协商商品不允许修改数量');
    }
  };

  /* 计算合计数 */
  combined = () => {
    const { data, number, list, type } = this.state;
    if (type === 'shopCart') {
      let combined = 0;
      for (const key in data.goodsMap) {
        const li = data.goodsMap[key];
        li.map(item => {
          list.map(i => {
            if (item.id === i) {
              let aa = 0;
              if (item.goodsEntity.type === 3) {
                aa = item.number * item.goodsEntity.discountPrice; // 优惠商品为优惠单价计算
              } else {
                aa = item.number * item.goodsEntity.price;
              }
              combined += aa;
            }
            return combined;
          });
          return true;
        });
      }
      this.setState({
        combined,
      });
    } else {
      this.setState({
        combined: data.type === 3 ? data.discountPrice * number : data.price * number,
      });
    }
  };

  /* 关闭购物车弹窗 */
  onClose = () => {
    this.setState({
      modal1: false,
    });
  };

  /* 修改购买数量 */
  onPress = (id) => {
    const { form } = this.props;
    const { data, type, orderlist, list } = this.state;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        /* 判断是否是购物车点击进来的 */
        if (type === 'shopCart') {
          if (orderlist.id === id) {
            let combined = 0;
            let flag = true
            for (const key in data.goodsMap) {
              const li = data.goodsMap[key];
              li.map(item => {
                if(item.goodsEntity.isLimit !== 1){
                  if (item.goodsEntity.type !== 1 && value.number > (item.goodsEntity.totalNum - item.goodsEntity.sales)) {
                    Toast.fail('您购买的数量大于剩余量，请修改购买数量！');
                    flag = false
                    return;
                  }
                }
                /* 替换原有订单里面的合计数为修改后的合计数 */
                if (item.id === id) {
                  item.number = value.number;
                }
                /* 计算修改购买数量后的合计数 */
                list.map(i => {
                  if (item.id === i) {
                    let aa = 0;
                    if (item.goodsEntity.type === 3) {
                      aa = item.number * item.goodsEntity.discountPrice; // 优惠商品为优惠单价计算
                    } else {
                      aa = item.number * item.goodsEntity.price;
                    }
                    combined += aa;
                  }
                  return combined;
                });
              });
            }
            if (flag){
              this.setState({
                number: value.number,
                modal1: false,
                combined,
              });
            }
          }
        } else if (data.id === id) {
          if(data.isLimit !==1){
            if (data.type !== 1 && value.number > (data.totalNum - data.sales)) {
              Toast.fail('您购买的数量大于剩余量，请修改购买数量！');
              return;
            }
          }
          this.setState({
            number: value.number,
            modal1: false,
            combined: data.type === 3 ? data.discountPrice * value.number : data.price * value.number,
          });
        }
      }
    });
  };

  /* 提交订单 */
  onSubmit = () => {
    if(window.__wxjs_environment === 'miniprogram'){
      Toast.info('小程序暂不支持下单，请使用APP操作')
      return;
    }
    const { isCompany, isPersonal, data, number, type, list, addDetail, status,state } = this.state;
    if (status === 1) {
      Toast.fail('未添加收货地址，请先去添加收货地址！');
      return;
    }
    // const { location: { state } } = this.props;
    if (state) {
      localStorage.setItem('settlementData', JSON.stringify(state));
    }
    let contractOrderVO = {};
    let numlist = [];
    /* 购物车结算订单 */
    if (type === 'shopCart') {
      let contractType = '';
      /* 从传过来的厂区数据中提取出要提交的数据 */
      for (const key in data.goodsMap) {
        const li = data.goodsMap[key];
        li.map(item => {
          /* 根据选择订单的id */
          return list.map(i => {
            if (item.id === i) {
              contractType = item.goodsType;
              const dd = {
                goodsId: item.goodsId,
                number: item.number,
                goodsName:item.goodsEntity.name,
                materialId:item.goodsEntity.materialId,
                price: item.goodsEntity.type === 3 ? item.goodsEntity.discountPrice : item.goodsEntity.price,
                cartId: item.id,
              };
              numlist.push(dd);
            }
            return numlist;
          });
        });
      }
      contractOrderVO = {
        'addressId': addDetail.id, // 关联的收货地址ID
        'contractType': contractType, // 合同类型 0-零售合同 1-返利合同 2-优惠合同
        'factoryId': data.id, // 关联的厂区ID
        'goodsOrderList': numlist,
        'orderForm': 2,
      };
    } else {
      /* 商品详情页结算订单 */
      numlist = [
        {
          goodsId: data.id,
          number,
          goodsName:data.name,
          materialId:data.materialId,
          price: data.price,
        },
      ];
      contractOrderVO = {
        'addressId': addDetail.id, // 关联的收货地址ID
        'contractType': data.type, // 合同类型 0-零售合同 1-返利合同 2-优惠合同
        'factoryId': data.factoryId, // 关联的厂区ID
        'goodsOrderList': numlist,
        'orderForm': 1,
      };
    }
    // return;
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    if (isCompany === 2 && isPersonal === 1||(clientId==='kspt_shf'&&custTypeFlag===1&&isPersonal === 1)) {
      this.setState({
        loading: true,
      });
      /* 结算订单接口 */
      commitContractOrder(contractOrderVO).then((j) => {
        if (j.success) {
          Toast.loading('加载中，请不要退出');
          contractManageDrafts(j.data).then(documentAddByFiles).then(pageurls).then(res=>{
            router.push({
              pathname: '/shopcenter/contract/signing',
              state: {
                number, type, contractUrl: res.pageUrl, contractId: res.contractId,
              },
            });
            localStorage.setItem('contractId', res.contractId);
            this.loadFalse();
          }).catch(()=>{
            this.loadFalse();
          })
        } else {
          this.loadFalse();
        }
      });
    } else if (isCompany === 4 || isPersonal === 4) {
      Toast.info('您的认证信息正在认证中，请等认证通过后再试！');
    } else {
      alert('下一步：在线合同签署', '您还未进行合同签署信息认证，请先进行合同签署信息认证后再购买商品提交订单。', [
        { text: '暂不认证' },
        { text: '去认证', onPress: () => router.push('/shopcenter/maintenance') },
      ]);
    }
  };

  loadFalse = () => {
    this.setState({
      loading: false,
    });
  };

  // 接收地址组件传递过来的详情信息
  getAddressDetails = (detail) => {
    this.setState({
      addDetail: detail,
      status: JSON.stringify(detail) !== '{}' ? 0 : 1,
    });
  }

  render() {
    const { form,} = this.props;
    const { modal1, combined, data, number, type, list, orderlist, loading,state } = this.state;
    console.log(data.imageUrl)
    const priceUnit = data.type === 3 ? `${data.discountPrice}元/${data.unitName}` : `${data.price}元/${data.unitName}`;
    const goodsMap = [];
    const listTie = (types) => <div className='listTie'><Text strong>{types === 1 ? '零售' : types === 2 ? '返利' :types === 3? '优惠':'协商'}商品</Text></div>;
    const comStyles = { marginTop: 10 };
    for (const key in data.goodsMap) {
      const li = data.goodsMap[key];
      goodsMap.push(
        <div className='listDiv'>
          {
            li.map((ii, index) => {
              return list.map(i => {
                let aa;
                let bb;
                if (ii.id === i) {
                  const { unitName } = ii.goodsEntity;
                  const priceUnits = ii.goodsEntity.type === 3 ? `${ii.goodsEntity.discountPrice}元/${unitName}` : `${ii.goodsEntity.price}元/${unitName}`;
                  const lists = {
                    title: shopTitle(ii.goodsEntity.name, priceUnits),
                    image: ii.goodsEntity.imageUrl,
                    content: [
                      { value: ii.goodsEntity.maxRuleDesc !== '' && <Tag color="orange">{ii.goodsEntity.maxRuleDesc}</Tag> },
                      { label: '型号', value: ii.goodsEntity.model },
                      { label: '购买数量', value: numbers(ii.number, ii,this.onEditNum)},
                    ],
                  };
                  bb = index === 0 && listTie(ii.goodsEntity.type);
                  aa = <CommodityStyle comlist={lists} style={comStyles} />;
                }
                return [bb, aa];
              });
            })
          }
        </div>,
      );
    }
    const comlist = {
      title: shopTitle(data.name, priceUnit),
      image: data.imageUrl,
      content: [
        { label: '型号', value: data.model },
        { label: '购买数量', value: numbers(number, data,this.onEditNum) },
      ],
    };
    const buylist = {
      detail:type === 'shopCart'?JSON.stringify(orderlist) !== '{}' && orderlist.goodsEntity:data,
      num:type === 'shopCart'?orderlist.number:number,
      id:type === 'shopCart'?orderlist.id:data.id
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            if (state && state.type === 'goodsDetails') {
              window.history.back();
            } else {
              router.push(`/shopcenter/shoppingcart`);
            }
          }}
        >确认订单
        </NavBar>
        <div className={`${style.theorder} ${style.shopCenter} am-list`}>
          <ChooseAddress state={state} getAddressDetails={this.getAddressDetails} />
          {
            type === 'shopCart' ? (
              <Card
                title={<div>{data.deptName}</div>}
                bordered={false}
                className='order-card'
              >
                {goodsMap}
              </Card>
            ) : (
              <Card
                title={<div> {data.factoryName}</div>}
                bordered={false}
                className='order-card'
              >
                <div className='listDiv'>
                  {listTie(data.type)}
                  <CommodityStyle comlist={comlist} style={comStyles} />
                </div>
              </Card>
            )
          }
        </div>
        <SubmitOrdersBtn loading={loading} onClick={this.onSubmit} amount={combined} />
        <BuyNumModel
          detail={buylist.detail}
          id='number'
          title="修改购买数量"
          number={buylist.num}
          visible={modal1}
          form={form}
          onPress={() => this.onPress(buylist.id)}
          onClose={this.onClose}
          disabled={buylist.detail.type === 3 ||buylist.detail.type ===4}
        />
      </div>
    );
  }
}

export default MakeSureTheOrder;
