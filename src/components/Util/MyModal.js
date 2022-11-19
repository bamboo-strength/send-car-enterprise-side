import React, { Component } from 'react';
import { Card, Divider, Form, message, Modal, Table, Button, Icon } from 'antd';
import Func from '@/utils/Func';


// props:
// top                            距离顶部距离                默认'20'
// modaltitel                     弹出框titel
// popupwidth                     弹出框宽度           0.6
// height                         弹出框高度            0.8
// visible 				                是否打开弹出框
// onCancel                       关闭弹出框回调函数
//
// popupContent                  弹出框内容函数组件
//                                 此回调函数至少有一个弹出框高度参数 ，
//                                 放入内容组件props ，作为内容组件的高度，内容组件内部div的
//                                 width和height不要写死 px，需按 % 自适应布局，否则弹出框放大后
//                                无法自适应
// selectRow                     打开弹出框时携带的参数，可放入 popupContent 回调函数参数里

export default class MyModal extends Component {

  state = {
    photovisible : false,
    width: 0.6,
    top: '20',
    height: '0.8',
    zoom: false
  }

  componentWillMount() {
    // this.original();
    // window.removeEventListener('resize', this.handleResize.bind(this));
  }

  componentDidMount() {
    window.addEventListener('resize', () => this.updateSize());
  }

  componentWillReceiveProps(nextProps) {
    const { visible } = nextProps;
    let { popupwidth, top, height } = nextProps;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    this.setState({
      photovisible: visible,
      width: winWidth * popupwidth,
      top: top,
      height: (winHeight-103) * height,
    })

  }

  updataOriginalWidthHeight =() =>{
    let { popupwidth, top, height } = this.props;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    this.setState({
      width: winWidth * popupwidth,
      top: top,
      height: (winHeight-103) * height,
    });
  }

  // 自适应
  updateSize = () =>{
    let {top,zoom} = this.state;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    if (zoom){
      this.setState({
        width: winWidth,
        top: 0,
        height: winHeight-103,
      });
    }else {
      this.updataOriginalWidthHeight()
    }
  }

  // 原始比例
  original =()=>{
    let {popupwidth,top,height}=this.props;
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    this.setState({
      width:winWidth*popupwidth,
      top: top,
      height: (winHeight-103)*height,
      zoom: false
    });
  }

  // 放大
  fangda = ()=>{
    const winHeight = window.innerHeight;
    const winWidth = window.innerWidth;
    let {top,zoom} = this.state;
    // let zoom1 = !zoom;
    // if (zoom){
      this.setState({
        width: (winWidth),
        top: 0,
        height: winHeight-103,// winHeight*0.13
        zoom: true
      });
    // }else {
    //   this.updataOriginalWidthHeight()
    // }

  }


  magnify = ()=>{
    const {zoom} = this.state;
    if (zoom){
      this.original();
    }else {
      this.fangda();
    }
  }

  handleCancels = () =>{
    let {onCancel}=this.props;
    onCancel();
    this.setState({
      zoom: false
    });
  }

  render() {
    let {popupContent,modaltitel,selectRow,isfangdaDisplay}=this.props;
    let {photovisible,width,top,height,zoom} = this.state;

    // 放大按钮自适应位置
    const winWidth = window.innerWidth;

    let fangdaButton = ((winWidth-width)/2) + 160;

    // 弹出框内容
    if (Func.isEmpty(popupContent)){
      popupContent = (param)=>{
      }
    }

    // 携带参数
    if (Func.isEmpty(selectRow)){
      selectRow = ''
    }

    // 放大按钮top
    let maxtop = 30;
    if (Func.isEmpty(top)){
      top = 20;
    }else {
      maxtop = Func.toInt(top)+10;
    }

    // 弹出框titel
    if (Func.isEmpty(modaltitel)){
      modaltitel = ''
    }

    if (Func.isEmpty(isfangdaDisplay)){
      isfangdaDisplay = true;
    }

    return (
      <Modal
        style={{ top: `${top}px`}}
        title={modaltitel}
        width={`${width}px`}
        // height={`${height}px`}
        visible={photovisible}
        onCancel={this.handleCancels}
        footer={null}
        centered
        destroyOnClose
      >
        <div
          style={{
            width: '40px',
            height: '40px',
            // background: '#000',
            top: `${maxtop}px`,
            position:'fixed',
            right: `${fangdaButton}px`
          }}
        >
          {
            isfangdaDisplay ?
              <Button style={{border:'none'}} onClick={this.magnify}>{zoom?<Icon type="shrink" /> : <Icon type="arrows-alt" />}</Button>
              :
              ""
          }
        </div>
        <div style={{ maxHeight: 400,overflow: 'auto'}}>
          {popupContent(selectRow,height)}
        </div>
      </Modal>
    )
  }
}
