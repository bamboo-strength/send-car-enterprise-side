import React, { Component } from 'react';
import { Card, Form, Icon } from 'antd';
import { router } from 'umi';
import { NavBar, Toast } from 'antd-mobile';
import style from '@/pages/ShopCenter/ShopCenter.less';
import ChooseAddress from '@/pages/ShopCenter/component/ChooseAddress';
import { CommodityStyle, SubmitOrdersBtn } from '@/pages/ShopCenter/component/ComponentStyle';
import {
  activitycontractManageDrafts,
  activitydocumentAddByFiles,
  numbers,
  pageurls,
  shopTitle,
} from '@/pages/ShopCenter/component/Interface';
// import { img28 } from '@/components/Matrix/image';
import Text from 'antd/es/typography/Text';
import BuyNumModel from '@/pages/ShopCenter/component/BuyNumModel';
import { commitSpikeActivityContractOrder, orderDetail } from '@/services/shoppingMall';
import { InTheLoad } from '@/components/Stateless/Stateless';

@Form.create()
class SecondsKillSubmitOrder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      state:props.location.state,
      addDetail: {},
      status:0,
      loading:false,
      combined:0,
      data: {},
      number: 0,
      orderlist:{},
      pageLoading:true
    }
  }

  componentDidMount() {
    const {match:{params:{id}}} = this.props
    orderDetail({ id }).then(item=>{
      if (item.success){
        const {data,data:{spikeMaterial,spikeActivityDTO:{materialPrice,maxPrice}}} = item
        this.setState({
          data,
          pageLoading:false,
          number:spikeMaterial,
          combined:data.activityType===1?materialPrice *spikeMaterial:maxPrice* spikeMaterial
        })
      }
    })
  }

  // 接收地址组件传递过来的详情信息
  getAddressDetails = (detail) => {
    this.setState({
      addDetail: detail,
      status: JSON.stringify(detail) !== '{}' ? 0 : 1,
    });
  }

  onSubmit = () => {
    if(window.__wxjs_environment === 'miniprogram'){
      Toast.info('小程序暂不支持下单，请使用APP操作')
      return;
    }
    const { data, addDetail, status,combined } = this.state;
    if (status === 1) {
      Toast.fail('未添加收货地址，请先去添加收货地址！');
      return;
    }
    const contractOrderVO = {
      "activityOrderId":data.id,
      "addressId": addDetail.id,
      "contractType": data.activityType === 1 ? 7 : 8,
      "factoryId": data.spikeActivityDTO.factoryId,
      "goodsOrderList": [
        {
          // "cartId": 0,
          "goodsId": data.spikeActivityDTO.id,
          "goodsName":data.spikeActivityDTO.materialName,
          "materialId":data.spikeActivityDTO.materialId,
          // "number": data.spikeMaterial,
          "number": data.spikeMaterial,
          "price": data.activityType===1?data.spikeActivityDTO.materialPrice:data.spikeActivityDTO.maxPrice,
        }
      ],
      "orderForm": 3
    }
    this.setState({
      loading: true,
    });
    commitSpikeActivityContractOrder(contractOrderVO).then(j=>{
      if (j.success) {
        Toast.loading('加载中，请不要退出');
        activitycontractManageDrafts(j.data).then(activitydocumentAddByFiles).then(pageurls).then(res=>{
          router.push({
            pathname: '/shopcenter/contract/signing',
            state: {
              number:data.spikeMaterial, type:4, contractUrl: res.pageUrl, contractId: res.contractId,
            },
          });
          localStorage.setItem('contractId', res.contractId);
          this.loadFalse();
        }).catch(()=>{
          this.loadFalse();
          this.loadFalse();
        })
      } else {
        this.loadFalse();
      }
    })
  }

  loadFalse = () => {
    this.setState({
      loading: false,
    });
  };

  /* 显示修改数量弹窗 */
  onEditNum = (item) => {
    const { form } = this.props;
    form.resetFields();
    this.showModal('modal1')
    this.setState({
      orderlist: item,
    });
  };

  // 修改购买数量确定
  onPress = () => {
    const {form} = this.props
    const {data} = this.state
    form.validateFields(['number'],(errors, values) => {
      if (!errors){
        this.setState({
          number:values.number,
          combined:data.activityType===1?data.materialPrice * values.number:data.spikeActivityDTO.maxPrice* values,
          modal1: false,
        })
      }
    })
  }

  // 弹窗显示
  showModal = key => {
    // e.preventDefault(); // 修复 Android 上点击穿透
    this.setState({
      [key]: true,
    });
  }

  /* 关闭弹窗 */
  onClose = (key) => {
    this.setState({
      [key]:false
    });
  };

  render() {
    const {form,match:{url}} = this.props
    const {state,loading,combined,data,number,modal1,orderlist,isModify,pageLoading} = this.state
    let priceUnit = '';
    let comlist = {};
    if (data?.spikeActivityDTO){
      const {materialPrice,unit,materialImg,materialModel,materialName,maxPrice} = data.spikeActivityDTO
      priceUnit = data.activityType===1?`${materialPrice}元/${unit===1?'吨':unit===2?'车':unit===3?'立方':'件'}`:`${maxPrice}元/${unit===1?'吨':unit===2?'车':unit===3?'立方':'件'}`;
      comlist = {
        image: materialImg,
        title: shopTitle(materialName, priceUnit),

        content: [
          { label: '型号', value: materialModel },
          { label: '购买数量', value: numbers(number, '',isModify && this.onEditNum) }, // isModify 控制是否显示修改购买数量
        ],
      }
    }
    const comStyles = { marginTop: 10 };

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.history.back()}
        >确认订单
        </NavBar>
        {
          pageLoading ? <InTheLoad />:(
            <>
              <div className={`${style.theorder} ${style.shopCenter} am-list`}>
                <ChooseAddress state={state} getAddressDetails={this.getAddressDetails} />
                <Card
                  title={<div>{data.factoryName}</div>}
                  bordered={false}
                  className='order-card'
                >
                  <div className='listDiv'>
                    <div className='listTie'><Text strong>{data.activityType===1?'秒杀商品':'竞价商品'}</Text></div>
                    <CommodityStyle comlist={comlist} style={comStyles} />
                  </div>
                </Card>
              </div>
              <SubmitOrdersBtn loading={loading} onClick={this.onSubmit} btnText="去签约" amount={combined} />
            </>
          )
        }
        <BuyNumModel
          detail={orderlist}
          id='number'
          title="修改购买数量"
          number={number}
          visible={modal1}
          form={form}
          onPress={() => this.onPress(data.id)}
          onClose={()=>this.onClose('modal1')}
          pageType="secondskill"
        />
      </div>
    );
  }
}

export default SecondsKillSubmitOrder;
