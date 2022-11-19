import React, { PureComponent } from 'react';
import {  NavBar, Toast, WhiteSpace,} from 'antd-mobile';
import { Form, Icon, Modal,  Button, Card,  } from 'antd';
import router from 'umi/router';
import Text from 'antd/es/typography/Text';
import { list,submit } from '@/services/queuemanagement';
import { AntOutline, } from 'antd-mobile-icons'
import MatrixMobileInput from '@/components/Matrix/MatrixMobileInput';
import { EmptyData, } from '@/components/Stateless/Stateless';

@Form.create()
class QueueMaterial extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      modifyvisible:false,
      modifyId:'',
      callParameter:'',
      dataSource: [],
      param:{}
    };
  }

  componentDidMount() {
    this.query()
  }

  query = () => {
    const {param} = this.state
    list(param).then(resp => {
      this.setState({
        dataSource:resp.data
      })
    })
  };

  // 取消
  hideModal = () => {
   this.setState({
     modifyvisible:false
   })
  };

  onOK = () => {
    const {form}=this.props
    const {modifyId}=this.state
    form.validateFieldsAndScroll((err, values) => {
      if(!err){
         submit({id:modifyId,callParameter:values.callParameter}).then((res)=>{
           if(res.success){
             this.setState({
               modifyvisible:false
             })
             Toast.success('操作成功')
             this.query(true, {});
           }
         })
      }
    })

  };

  QueueMaterialAll = () => {
    router.push('/epidemic/queuematerialall');
  };

  toSetting=(rowData)=>{
    this.setState({
      modifyvisible:true,
      callParameter:rowData.callParameter,
      modifyId:rowData.id
    })

  }

  toView = (id) => {
    router.push(`/epidemic/queuemanagementview/${id}`)
  };

  render() {
    const { callParameter,dataSource, modifyvisible, } = this.state;
    const { form } = this.props;
    const ifFromOtherSite = localStorage.getItem('ifFromOtherSite');
    return (
      <div>
        {
          ifFromOtherSite === 'ok' ? undefined :
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            rightContent={
                [<a onClick={this.QueueMaterialAll}>全部 </a>]
              }
            onLeftClick={() => router.push('/dashboard/function')}
          >叫号管理
          </NavBar>
        }
        <div className={ifFromOtherSite === 'ok' ? 'am-list-nestPage' : 'am-list'}>
          {
            dataSource.length>0?
              dataSource.map(rowData => (
                <div>
                  <Card key={rowData.id} style={{/* opacity:rowData.coalSwitch===0?1:0.3, */padding:('0 0 0 0'),borderRadius: '16px',}}>
                    <Card
                      title={
                        <div style={{ fontWeight:'600',fontSize:'large',}}>
                          <AntOutline style={{ marginRight: '4px', color: '#1677ff' }} />
                          {rowData.coalName}
                        </div>
                      }
                      bordered={false}
                      size='small'
                    >
                      <div style={{fontSize:'18px'}}> 排队中<Text style={{color:'#FFA500'}}>{rowData.inLine}</Text>辆</div>
                      <WhiteSpace size="xl" />
                      <div style={{position:'inherit'}}>
                        <Modal
                          visible={modifyvisible}
                          title='修改设置'
                          width={350}
                          mask={false}
                          // transparent
                          onCancel={this.hideModal}
                          onOk={(e)=>this.onOK(rowData)}
                          destroyOnClose
                        >
                          <div>
                            <MatrixMobileInput maxLength='8' id='callParameter' numberType='isIntGtZero' initialValue={callParameter} required label='每次叫号' placeholder='请输入每次叫号辆数' extra='辆' moneyKeyboardAlign='left' className='list-class' form={form} />
                            <WhiteSpace size="xl" />
                          </div>
                        </Modal>
                      </div>
                      <div style={{display: 'flex',justifyContent: 'space-between'}}>
                        <Button
                          style={{ borderRadius: '16px',padding:('0px 30px 0px')}}
                          onClick={() => this.toSetting(rowData)}
                        >
                          修改设置
                        </Button>
                        <Button
                          style={{background:'#1cbc7a',color:'#FCFCFC', borderRadius: '16px',padding:('0px 30px 0px')}}
                          onClick={() =>this.toView(rowData.id)}
                        >
                          叫号进厂
                        </Button>
                      </div>
                    </Card>
                  </Card>

                </div>
              )):<EmptyData text='暂无叫号车辆' />
          }

        </div>
      </div>
    );
  }
}

export default QueueMaterial;
