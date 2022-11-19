import React, { Component } from 'react';
import style from '@/pages/ShopCenter/ShopCenter.less';
import Text from 'antd/es/typography/Text';
import { Tag } from 'antd';
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { Modal } from 'antd-mobile';
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
    const {detail,pageType} = this.props
    if (pageType === 'secondskill'){
      if (val > detail.maxNum) callback('不能超过秒杀数量上限！')
      if (val < detail.minNum) callback('不能低于秒杀数量下限！')
    }
    // if (pageType === 'buyNow' && val < 5000) callback('不能低于5000吨')
    // if (pageType === 'addShopCart' && val < 1000) callback('不能低于1000吨')
  }

  render() {
    const { modal } = this.state;
    const { detail, form, onPress, onClose, number, title, id, disabled,pageType } = this.props;
    const { imageUrl, maxRuleDesc, discountPrice, unitName, price, model, totalNum, type } = detail;
    const { materialModel,remaining,materialPrice,materialImg,unit,maxNum,minNum } = detail;
    const isLimit = detail.isLimit !== 1 ? '限量' : '不限量';
    const priceUnit = type === 3 ? `${discountPrice}元/${unitName}` : `${price}元/${unitName}`; // 优惠商品用discountPrice字段
    let comlist = {
      image: imageUrl,
      title: <Text type="danger">{priceUnit}</Text>,
      content:[
        { label: '型号', value: model },
        {
          label: detail.isLimit === 1 ? '商品数量' : '剩余量',
          value: detail.isLimit === 1 ? isLimit : <Text>{totalNum && totalNum.toFixed(2)}{unitName}</Text>,
        },
      ]
    };
    if (maxRuleDesc !== '') {
      comlist.content.unshift({ value: <Tag color="orange">{maxRuleDesc}</Tag> });
    }
    if (pageType === 'secondskill'){
      comlist = {
        image: materialImg,
        title: <Text type="danger">{`${materialPrice}元/${unit===1?'吨':unit===2?'车':unit===3?'立方':'件'}`}</Text>,
        content:[
          { label: '型号', value: materialModel },
          { label: '剩余量', value: remaining, },
          { label: '购买区间', value: `${minNum} ~ ${maxNum}吨`, },
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

        <CommodityStyle comlist={comlist} style={{ marginTop: 10 }} />
        <MatrixMobileInput
          form={form}
          id={id}
          label='购买数量(吨)'
          placeholder="请输入购买数量"
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
