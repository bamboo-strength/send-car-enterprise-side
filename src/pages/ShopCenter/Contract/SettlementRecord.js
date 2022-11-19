import React,{PureComponent} from 'react';
import { Form, Icon,} from 'antd';
import { NavBar,} from 'antd-mobile';
import { InTheLoad } from '@/components/Stateless/Stateless';
import {querySettlementRecord} from '@/services/contract';
import { MobilePDFReader } from 'react-read-pdf'


@Form.create()
class SettlementRecord extends PureComponent{
  constructor(props) {
    super(props);
    this.state ={
      url:'',
    }
  }

  componentDidMount() {
    const { location:{state:{contractno,contract,contractType}}} = this.props;
    querySettlementRecord({contractsList:contractno,contractNo:contract,contractType}).then((resp=>{
      this.setState({
        url:resp.data
      })
    }))
  }

  render() {
    const { url,} = this.state
    return (
      <div style={{display:'flex',flexDirection: 'column'}}>
        <NavBar
          mode='light'
          icon={<Icon type='left' />}
          onLeftClick={() =>{
            window.history.back();
          }}
        > 查看结算单
        </NavBar>
        <div style={{marginTop:40}}>
          {
            !url?<InTheLoad />:(
              <MobilePDFReader
                url={url}
                scale={0.65}
                isShowHeader={false}
                isShowFooter={false}
              />
            )
          }
        </div>
      </div>
    )
  }
}

export default SettlementRecord
