import React, { Component } from 'react';
import Paragraph from 'antd/lib/typography/Paragraph';
import Text from 'antd/es/typography/Text';
import { Icon, Tag } from 'antd';
import ImageShow from '@/components/ImageShow/ImageShow';
import { CommodityStyle } from '@/pages/ShopCenter/component/ComponentStyle';

class CartListRound extends Component {

  constructor(props) {
    super(props);
    this.state = {
      imgPath: '',
      imgShow: false,
    };
  }

  onClick = (e, img) => {
    e.preventDefault();
    e.stopPropagation();
    this.setState({
      imgPath: img,
      imgShow: true,
    });
  };

  onClose = () => {
    this.setState({
      imgShow: false,
    });
  };

  render() {
    const { j, item, onEditNumCLick, onViewClick, isEditor } = this.props;
    const { imgPath, imgShow } = this.state;
    const {status,type,discountPrice,price,name,imageUrl,model,maxRuleDesc} = item.goodsEntity
    const comlist = {
      title: (
        <div className='listTie detailTie'>
          <Paragraph ellipsis className='cart-par'>{name}</Paragraph>
          <Text type={status === 2 ? 'secondary' : 'danger'}>
            {type === 3 ? discountPrice : price}元/吨
          </Text>
        </div>
      ),
      image: (
        <div>
          <img
            className='listImage'
            src={imageUrl}
            style={{ width: '100px', height: '100px' }}
            onClick={(e) => this.onClick(e, imageUrl)}
            alt=""
          />
          { status === 2 && <div className='cart-list-shelves'><div>已下架</div></div>}
        </div>
      ),
      custom: true,
      content: [
        { label: '型号', value: model },
        { value: maxRuleDesc !== '' && <Tag color="orange">{maxRuleDesc}</Tag> },
        {
          label: '购买数量',
          value: (
            <Text strong>{item.number}吨
              {
                isEditor !== true && (
                  status !== 2 && (
                    <Icon
                      type="edit"
                      theme="twoTone"
                      style={{ marginLeft: 6 }}
                      onClick={(e) => onEditNumCLick(e, j)}
                    />
                  )
                )
              }
            </Text>
          ),
        },
      ],
    };
    return (
      <div key={item.id} style={{ padding: '12px 0 0' }} onClick={(e) => onViewClick(e, item)}>
        <CommodityStyle comlist={comlist} />
        <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
      </div>
    );
  }
}

export default CartListRound;
