import React, { PureComponent } from 'react';
import { Form, Icon, Tag } from 'antd';
import { NavBar,} from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import NetWorkTooltip from '@/components/NetWorks/NetWorkTooltip';
import { SHOPPING_MALL_GOODDETAIL, SHOPPING_SHOPCART_CART_DETAIL, } from '@/actions/shoppingMall';
import { connect } from 'dva';
import { InTheLoad,PageFault } from '@/components/Stateless/Stateless';
import { clientId } from '@/defaultSettings';
import EventDetailStyle from '@/pages/ShopCenter/component/ComponentStyle';
import { router } from 'umi';

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class GoodsDetails extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      loading: false,
      isPageFault: false,
    };
  }

  componentDidMount() {
    const { dispatch, match: { params: { id } }, location: { state } } = this.props;
    if (state) {
      localStorage.setItem('pageType', state.type);
    }
    const pageType = localStorage.getItem('pageType');
    if (state ? state.type === 'factory' : pageType === 'factory') {
      dispatch(SHOPPING_MALL_GOODDETAIL({ goodsId: id })).then(() => {
        const { shoppingmall: { detail: { goodsDetail } } } = this.props;
        if (goodsDetail && goodsDetail.success) {
          this.setState({
            loading: true,
            detail: goodsDetail.data,
          });
        } else {
          this.setState({
            isPageFault: true,
          });
        }
      });
    }
    if (state ? state.type === 'goods' : pageType === 'goods') {
      dispatch(SHOPPING_SHOPCART_CART_DETAIL({ id })).then(() => {
        const { shoppingmall: { detail: { cartDetail } } } = this.props;
        if (cartDetail && cartDetail.success) {
          this.setState({
            loading: true,
            detail: cartDetail.data.goodsEntity,
          });
        } else {
          this.setState({
            isPageFault: true,
          });
        }
      });
    }
  }

  render() {
    const { form } = this.props;
    const { detail, loading, isPageFault } = this.state;
    const { model } = detail;
    const {unitName,isLimitName,totalNum,sales,maxRuleDesc,ruleDesc} = detail
    const priceUnit = detail.type === 3 ? `${detail.discountPrice}元/${unitName}` : `${detail.price}元/${unitName}`; // 优惠商品用discountPrice字段
    const title = (
      <>
        <Text type="danger">{priceUnit}</Text>
        {maxRuleDesc !== '' ? <Tag color="orange" style={{ marginLeft: '5%' }}>{maxRuleDesc}</Tag> : ''}
        <Text style={{ float: 'right' }}>已{detail.type === 3 ? '购' : '售'}{sales}{unitName}</Text>
        {
          detail.type !== 3 ?
            <NetWorkTooltip content={`单价按市场价执行，当前市场价${priceUnit}`} style={{ margin: '10px 0' }} /> : ''
        }
      </>
    );
    const enlist = {
      image: detail.imageUrl,
      title,
      subtitle: detail.name,
      content: [
        { label: '型号', value: model },
        { label: detail.isLimit === 1 ? '商品数量' : '剩余量', value: detail.isLimit === 1 ? isLimitName : `${totalNum}${unitName}` },
        { label: '计量单位', value: unitName },
      ],
      introduce: [{ title: '商品介绍', context: detail.description, },],
      steps: [{ description: '购买下单' }, { description: '在线签约' }, { description: '支付货款' }, { description: '交易成功' },],
    };
    if (detail.type !== 1 || ruleDesc !== '') {
      const policy = {
        title: '优惠政策',
        context: ruleDesc,
      };
      enlist.introduce.push(policy);
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
            // router.push(`/shopcenter/mallhomepage/view/${detail.factoryId}`)
            const { match: { params: { type } } } = this.props;
            localStorage.setItem('CommodityType', type === 'retailProduct' ? 1 : type === 'rebateProduct' ? 2 :type === 'preferentialProduct' ? 3 : 4);
          }}
        >商品详情
        </NavBar>
        {loading ? <EventDetailStyle list={enlist} detail={detail} isPurchased={clientId === 'kspt_shf' && 0} form={form} /> : isPageFault ? <PageFault /> : <InTheLoad />}
      </div>
    );
  }
}

export default GoodsDetails;
