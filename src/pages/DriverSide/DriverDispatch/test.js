import { ImagePicker, WingBlank, SegmentedControl } from 'antd-mobile/lib/index';
import React from 'react';

const data = [{
  url: 'https://zos.alipayobjects.com/rmsportal/PZUUCKTRIHWiZSY.jpeg',
  id: '2121',
}, {
  url: 'https://zos.alipayobjects.com/rmsportal/hqQWgTXdrlmVVYi.jpeg',
  id: '2122',
}];

export default class ImagePickerExample extends React.Component {
  state = {
    files: data,
  }

  onChange = (files, type, index) => {
    console.log(files, type, index);
    this.setState({
      files,
    });
  }


  render() {
    const { files } = this.state;
    return (
      {/* <WingBlank>
        <ImagePicker
          files={files}
          onChange={this.onChange}
          onImageClick={(index, fs) => console.log(index, fs)}
          selectable={files.length < 7}
          multiple={false}
          accept='camera'
        />
      </WingBlank> */}
    );
  }
}
