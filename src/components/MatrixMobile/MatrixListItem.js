import React, { PureComponent } from 'react';
import { List } from 'antd-mobile';
import '../../pages/ShopCenter/ShopCenter.less';
import Text from 'antd/lib/typography/Text';
import ImageShow from '@/components/ImageShow/ImageShow';

class MatrixListItem extends PureComponent {
  state = {
    imgPath: '',
    imgShow: false,
  };

  onClick = title => {
    this.setState({
      imgPath: title,
      imgShow: true,
    });
  };

  onClose = () => {
    this.setState({
      imgShow: false,
    });
  };

  render() {
    const { label, title, className, type, style } = this.props;
    const { imgPath, imgShow } = this.state;
    return (
      <List.Item
        style={style}
        thumb={<div>{label}：</div>}
        className={`matrix-list-item matrix-list-item-${className}`}
      >
        {type ? (
          <img
            src={title}
            alt=""
            className={`list-item-img-${className}`}
            onClick={() => this.onClick(title)}
          />
        ) : (
          <Text>{title}</Text>
        )}
        <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
      </List.Item>
    );
  }
}

export default MatrixListItem;
