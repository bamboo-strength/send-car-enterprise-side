import React, { PureComponent } from 'react';
import { Icon,} from 'antd/lib/index';
import {Modal,WhiteSpace,List,Flex} from 'antd-mobile';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import styles from '../../../layouts/Sword.less';

const {Item} = List;

export default class DataList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      showQRCode:false,
      qrContent:'',
      modalTitle:''
    };

  }

  showQcode=(item)=>{
    this.setState({
      qrContent:item.id,
      showQRCode:true,
      modalTitle:item.vehicleno
    })
  }

  onClose = () => {
    this.setState({
      showQRCode:false
    })
  };

  // 跳转到详情
  toDetail = (singleUrl,id)=>{
    router.push({
      pathname: `${singleUrl}${id}`,
      state: {
        backUrl:'/dashboard/menu',
      },
    });
  }

  goPage = (path) => {
    router.push(path);
  };

  render() {
    const {showQRCode,qrContent,modalTitle } = this.state;
    const {showColums, businessSetting, getBusinessList,} =this.props
    const span = 24;

    return (
      <div className='mobileMenu'>
        <div className='am-list'>
          <WhiteSpace size='ml' style={{height:'5px'}} />
          <List
            renderHeader={
              <div style={{display: 'flex',justifyContent: 'space-between',}}><span style={{fontWeight: 'bold',fontSize: '16px'}}>{businessSetting.name}</span>
                <a onClick={() => {router.push(businessSetting.totalUrl);}}>更多</a>
              </div>}
            className="my-list"
          >
            {
              getBusinessList.map(item => {
                return (
                  <Item
                    arrow="horizontal"
                    multipleLine
                    thumb={businessSetting.isShowQrcode === 1?<span style={{color:'blue',fontSize:'30px'}}><Icon type="qrcode" onClick={() =>this.showQcode(item,)} /></span>
                      :undefined}
                    platform="android"
                  >
                    <Flex className='flexForIndex' onClick={() => {this.toDetail(businessSetting.singleUrl,item.id)}}>
                      {
                        showColums.map(rrow => {
                          return (
                            <Flex.Item>
                              <span className={`${styles.tdTitle}`}>{rrow.columnAlias}：</span>
                              <span style={{color: 'rgba(0, 0, 0, 0.75)'}}>{item[rrow.showname?rrow.showname:rrow.columnName]}</span>
                            </Flex.Item>
                          )

                        })
                      }
                    </Flex>

                  </Item>
                );
              })}
          </List>

          <Modal
            visible={showQRCode}
            transparent
            maskClosable
            onClose={() =>this.onClose()}
            animationType='fade'
            platform='android'
            title={`车号：${modalTitle}`}
          >
            <QRCode
              value={qrContent}// 生成二维码的内容
              size={220} // 二维码的大小
              fgColor="#000000"
            />
          </Modal>
        </div>
      </div>
    );
  }
}
