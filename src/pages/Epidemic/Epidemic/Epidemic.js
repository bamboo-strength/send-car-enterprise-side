import React, { PureComponent } from 'react';
import { Card, Col, Icon } from 'antd';
import { router } from 'umi';
import { Modal, NavBar } from 'antd-mobile';
import Text from 'antd/es/typography/Text';
import { IconAddress, IconContract, IconInformation, IconShopCart } from '@/components/Matrix/image';
import '../../ShopCenter/ShopCenter.less'
import style from '@/pages/ShopCenter/ShopCenter.less';

class Epidemic extends PureComponent {

  state = {
    visible:false
  }

  render() {
    const {visible} = this.state
    const toolList = [
      {image:IconInformation,bg:'#98D87D',text:'防疫申报',type:'/epidemic/epidemicAdd'},
      {image:IconContract,bg:'#65ea2d',text:'排队申请',type:'/epidemic/numeral'},
      {image:IconShopCart,bg:'#FFD86E',text:'排队记录',type:'/epidemic/lineuprecord'},
      {image:IconAddress,bg:'#49A9EE',text:'防疫记录',type:'/epidemic/vaccinerecords'},
      {image:IconContract,bg:'#65ea2d',text:'叫号管理',type:'/epidemic/queuematerial'},
    ]
    const headStyle = { minHeight: '40px', border: 'none' };
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {router.push(`/driverSide/personal/personalShipper`);}}
          rightContent={<Icon type="question-circle" onClick={()=>this.setState({visible:true})} />}
        >排队
        </NavBar>
        <div className={`${style.shopCenter} am-list`}>
          <div style={{padding:12}}>
            <Card bordered={false} headStyle={headStyle} className='shopCard' style={{position: 'static',width: '100%',padding: '10px 0'}} bodyStyle={{paddingLeft:'-10px'}}>
              {
                toolList.map(item=>{
                  return (
                    <Col span={6} style={{textAlign:'center'}} key={item.type} onClick={()=>router.push(item.type)}>
                      <div className='toolImage'>
                        <img alt='' src={item.image} />
                      </div>
                      <Text>{item.text}</Text>
                    </Col>
                  )
                })
              }
            </Card>
          </div>
          <Modal
            visible={visible}
            transparent
            maskClosable={false}
            onClose={()=>this.setState({visible:false})}
            title="排队须知"
            footer={[{ text: '我知道了', onPress: () => this.setState({visible:false}) }]}
            wrapProps={{ onTouchStart: this.onWrapTouchStart }}
          >
            <div style={{ height: 300, overflow: 'scroll',textAlign:'left', }}>
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;为了方便您快速了解并使用排队功能，请您仔细阅读以下排队须知：<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;1.使用排队功能前须先进行防疫申报，点击页面【防疫申报】按钮进入防疫申报信息提交页面，按照页面要求填写或上传的信息进行操作，全部录入完成后，点击【提交】按钮即可完成防疫申报，已提交的防疫申报可在防疫记录中查看；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;2.防疫申报提交后即可进行排队申请，点击页面【排队申请】按钮进入排队信息录入页面，按照页面要求的选择厂区、煤种等信息，点击【确定排队】按钮，进入入厂排队页面，点击【点击排队】按钮，系统会根据您当前位置距厂区的距离判断是否在厂区设置的排队范围内，若您当前位置不在厂区排队范围内，则无法进入排队，若您当前位置在厂区排队范围内，则可直接进入排队，进入等待入厂页面，您可到【排队记录】查看排队信息；<br />
              &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;3.注意：您提交的防疫申报须通过厂区人员审核才可进入被叫车队列，若防疫申报被驳回，您可到【防疫记录】修改重新提交，直至审核通过，若防疫申报一直未被审核，您可致电18809879087联系厂区。<br />
            </div>
          </Modal>
        </div>
      </div>
    );
  }
}

export default Epidemic;
