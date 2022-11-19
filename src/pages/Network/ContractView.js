import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Icon, List, Row, Steps } from 'antd';
import router from 'umi/router';
import { NavBar, WhiteSpace, WingBlank } from 'antd-mobile';
import NetWorkLess from '@/components/NetWorks/NetWork.less';
import { detail } from '../../services/NetContract';


import styles from '../DriverSide/Personal/PdfFile.less'

@Form.create()
export class ContractView extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      pageNumber: 1,
      pageNumberInput: 1,
      pageNumberFocus: false,
      numPages: 1,
      pageWidth: 400,
      fullscreen: false,
      // path:'http://minio.wujifd.com/wlhy/onlinecontract/pt/%E6%89%98%E8%BF%90%E5%8D%8F%E8%AE%AE%E2%80%94%E5%B9%B3%E5%8F%B0%E4%B8%8E%E5%8F%B8%E6%9C%BA%E6%A8%A1%E6%9D%BFV4%E7%94%9F%E6%88%9020210831073424.pdf',
      path:''
    };
  }

  componentWillMount() {
    const { match: { params: { id } } } = this.props;
    detail({waybillId:id}).then(resp => {
      this.setState({
        path:resp.data.path
      })
    })
  }
  goReturn = ()=>{
    const {location} = this.props
    router.push(`/network/waybill/contractmanage`);
  }
  download = ()=>{
    const{path}=this.state
    window.open(path)
    this.goReturn()
  }
  onDocumentLoadSuccess = ({ numPages }) => {//numPages是总页数
    this.setState({ numPages });
  };

  render() {
    const { pageNumber,path,pageNumberFocus, pageNumberInput,numPages, pageWidth, fullscreen } = this.state;
    const action = (
      <WingBlank>
        <Button type="primary" block style={{ marginTop: '10px' }} onClick={this.download}>
          下载
        </Button>
      </WingBlank>
    );
    return (
      <div >
        <div>
          <NavBar
            mode="light"
            icon={<Icon type="left" />}
            onLeftClick={this.goReturn}
          >合同详情
          </NavBar>
          <div className='am-list'>

            {/*<iframe id="demo" src={path} frameBorder="0" width="100%" height="600px" />*/}
          </div>
        </div>
      </div>
    );
  }
}

export default ContractView;
