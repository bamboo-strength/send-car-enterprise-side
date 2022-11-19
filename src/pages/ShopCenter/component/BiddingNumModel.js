import React, { Component } from 'react';
import style from '@/pages/ShopCenter/ShopCenter.less';
import Text from 'antd/es/typography/Text';
import { Tag } from 'antd';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { Modal, NoticeBar } from 'antd-mobile';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';

function closest(el, selector) {
  const matchesSelector = el.matches || el.webkitMatchesSelector || el.mozMatchesSelector || el.msMatchesSelector;
  while (el) {
    if (matchesSelector.call(el, selector)) {
      return el;
    }
    el = el.parentElement;
  }
  return null;
}

class BuyNumModel extends Component {

  constructor(props) {
    super(props);
    const { visible } = props;
    this.state = {
      modal: visible || false,
    };
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    this.setState({
      modal: visible,
    });
  }

  onWrapTouchStart = (e) => {
    // 修复触摸滚动背景页的iOS
    if (!/iPhone|iPod|iPad/i.test(navigator.userAgent)) {
      return;
    }
    const pNode = closest(e.target, '.am-modal-content');
    if (!pNode) {
      e.preventDefault();
    }
  };

  onClose = () => {
    this.setState({
      modal: false,
    });
  };

  // 自定义校验
  validator = (rule, val, callback) => {
    const {maxPrices,pageType} = this.props
    if (pageType === 'secondskill'){
      if (val < maxPrices) callback('不能低于最高竞价！')
    }
  }

  render() {
    const { modal } = this.state;
    const { detail, form, onPress, onClose, number, title, id, disabled,pageType,maxPrices } = this.props;
    const { imageUrl, maxRuleDesc, discountPrice, unitName, price, model, totalNum, type } = detail;
    const { materialModel,remaining,biddingStartPrice,materialImg,unit } = detail;
    const isLimit = detail.isLimit !== 1 ? '限量' : '不限量';
    const labelInput =(<span style={{paddingRight:'5px',fontSize:'16px'}}>我的报价</span>)
    const priceUnit = type === 3 ? `${discountPrice}元/${unitName}` : `${price}元/${unit===1?'吨':unit===2?'车':unit===3?'立方':'件'}`; // 优惠商品用discountPrice字段
    let comlist = {
      image: imageUrl,
      title: <Text type="danger">{priceUnit}</Text>,
      content:[
        { label: '型号', value: model },
        {
          label: type === 1 ? '商品数量' : '剩余量',
          value: type === 1 ? isLimit : <Text>{totalNum && totalNum.toFixed(2)}{unitName}</Text>,
        },
      ]
    };
    if (maxRuleDesc !== '') {
      comlist.content.unshift({ value: <Tag color="orange">{maxRuleDesc}</Tag> });
    }
    if (pageType === 'secondskill'){
      comlist = {
        image: materialImg,
        title: <Text type="danger">{`${biddingStartPrice}元/${unit===1?'吨':unit===2?'车':unit===3?'立方':'件'}`}</Text>,
        content:[
          { label: '型号', value: materialModel },
          { label: '商品数量', value: remaining, },
        ]
      };
    }
    return (
      <Modal
        visible={modal}
        transparent
        maskClosable={false}
        onClose={onClose}
        closable
        style={{width:'80%'}}
        className={`${style.shopCenter} ${style.goodModal}`}
        title={title}
        footer={[{ text: '确定', onPress }]}
        wrapProps={{ onTouchStart: this.onWrapTouchStart }}
      >
        {detail.biddingWay !==1?
          <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
            {maxPrices!==0? <span>当前最高报价：<Text strong style={{color:'#F99643'}}>{maxPrices}元/吨</Text></span>:'当前未有人报价'}
          </NoticeBar>:''}
        <CommodityStyle comlist={comlist} style={{ marginTop: 10 }} />
        <MatrixMobileInput
          form={form}
          id={id}
          label={labelInput}
          placeholder="请输入报价"
          required
          maximumLength={6}
          numberType="isFloatGtZero"
          realbit={2}
          initialValue={number || ''}
          disabled={disabled}
          validator={this.validator}
          labelNumber={5}
        />
      </Modal>
    );
  }
}

export default BuyNumModel;
