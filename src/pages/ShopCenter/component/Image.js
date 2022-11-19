import React, { PureComponent } from 'react';
import { ImageNoPictures } from '@/components/Matrix/image';
import ImageShow from '@/components/ImageShow/ImageShow';

export default class Image extends PureComponent {
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
    const { className, imageUrl, onClick,style } = this.props;
    const { imgPath, imgShow } = this.state;
    const onError = (e) => {
      e.target.onerror = null;
      e.target.src = ImageNoPictures;
    };
    const img = imageUrl || ImageNoPictures;
    return (
      <div>
        <img
          className={className}
          src={img}
          onError={onError}
          style={style}
          alt=""
          onClick={onClick ? (e) => this.onClick(e, img) : null}
        />
        <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
      </div>
    );
  }
}
