import React,{PureComponent} from 'react';
import { PhotoProvider, PhotoSlider } from 'react-photo-view';
import 'react-photo-view/dist/index.css';
// 图片手指触摸放大组件
class ImageShow extends PureComponent{

  constructor(props) {
    super(props);
    this.state={
      photoIndex:0,
      setPhotoIndex:0,
    }
  }


  render() {
    const {imgPath,visible,onClose} = this.props
    const {photoIndex,setPhotoIndex} = this.state;
    return (
      <PhotoProvider>
        <PhotoSlider
          photoClosable
          bannerVisible={false}
          images={[{ src: imgPath }]}
          visible={visible}
          onClose={onClose}
          index={photoIndex}
          onIndexChange={setPhotoIndex}
        />
      </PhotoProvider>
    );
  }
}
export default ImageShow
