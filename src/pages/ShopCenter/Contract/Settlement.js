import React,{PureComponent} from 'react';
import { Form, Icon, Button,} from 'antd';
import { NavBar,Toast,} from 'antd-mobile';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import {settlementpdf,applySettlement,querySettlement} from '@/services/contract';
import { MobilePDFReader } from 'react-read-pdf';

@Form.create()
class Settlement extends PureComponent{
  constructor(props) {
    super(props);
    this.state ={
      loading:false,
      url:'',
      status:'',
      reason:'',
      list:'',
      sublist:'',
    }
  }

  componentDidMount() {
    const { location:{state :{contractno,contract,contractType}}} = this.props;
    this.setState({
      loading:true,
    })
    querySettlement({contractsList:contractno,contractNo:contract}).then(resp=>{
      this.setState({
        status:resp.auditFlag,
        reason:resp.ztext1,
        list:resp,
        sublist:resp.sublist,
        loading:false
      })
    })

    settlementpdf({contractsList: contractno,contractType,contractNo:contract}).then(item=>{
      if (item.success){
        this.setState({
          url:item.data
        })
      }
    })


  }


  //  提交
   toSubmit=()=>{
    const { form } = this.props
     const {list} = this.state
     form.validateFieldsAndScroll(((err) => {
       if (!err){
         applySettlement(list).then(resp=>{
           if (resp.success){
             Toast.success('提交成功')
             window.history.back();
           }
         })
       }
     }))
   }


  render() {
    const { loading,url,status,reason,sublist} = this.state
    return (
      <div style={{display:'flex',flexDirection: 'column'}}>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() =>{
            window.history.back();
          }}
        >申请结算
        </NavBar>

        {
          loading?<InTheLoad />:(
            sublist.length ===0?<EmptyData text="暂无结算数据" />:(
              <div>
                <div>
                  {
                  !url?<InTheLoad />:(
                    <div>
                      <MobilePDFReader
                        url={url}
                        isShowHeader={false}
                        isShowFooter={false}
                      />
                    </div>
                )
              }
                </div>
                <div style={{position:'absolute',bottom:10,width:'100%'}}>
                  {
                status==="2"?(
                  <Button type='primary' onClick={this.toSubmit} style={{width:'100%'}} shape="round">
                    重新申请
                  </Button>
                ):status==="1"?
                  (
                    <Button type='primary' onClick={this.toSubmit} style={{width:'100%'}} shape="round" disabled>
                      提交申请
                    </Button>
                  ):status==="0"?
                    (
                      <Button type='primary' onClick={this.toSubmit} style={{width:'100%'}} shape="round" disabled>
                        提交申请
                      </Button>
                    )
                    :(
                      <Button type='primary' onClick={this.toSubmit} style={{width:'100%'}} shape="round">
                        提交申请
                      </Button>
                    )
              }
                </div>
                <div style={{position:'absolute',width:'100%',top:45}}>
                  {
                  status==="0"?(
                    <div style={{ width:'100%', height:'5%', backgroundColor: "#fefcec",color:'#f76a24', fontSize:16, textAlign: 'center',}}>
                      已提交申请，请等待审核
                    </div>
                  ):status==="1"?(
                    <div style={{ width:'100%', height:'5%', backgroundColor: "#fefcec",color:'#f76a24', fontSize:16, textAlign: 'center',}}>
                      审核已通过
                    </div>
                  ):status === "2"?(
                    <div style={{ width:'100%', height:'5%', backgroundColor: "#fefcec",color:'#f76a24', fontSize:16, textAlign: 'center',}}>
                      提交已驳回，原因：{reason}
                    </div>
                  ):''
                }
                </div>
              </div>
            )

          )
        }
      </div>
    )


  }
}

export default Settlement
