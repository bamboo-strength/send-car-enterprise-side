import React, { PureComponent } from 'react';
import { NavBar,Toast } from 'antd-mobile';
import { Card, Icon, List, Avatar, Form, Tag, Button,Modal} from 'antd';
import { IconCertification, IconFailure, IconAuthentication } from '@/components/Matrix/image';
import Text from 'antd/lib/typography/Text';
import MatrixListItem from '@/components/MatrixMobile/MatrixListItem';
import { MAINTENACE_QUERY_COMPANY_AUTHDETAIL, MAINTENACE_QUERY_USER_AUTHDETAIL } from '@/actions/maintenance';
import { connect } from 'dva';
import { remove } from '@/services/maintenance';
import router from 'umi/router';
// import { stringify } from 'qs';

const { confirm } = Modal;
@connect(({ maintenance }) => ({
  maintenance,
}))
@Form.create()

class CertificationView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      isPersonal: 0,
      isCompany: 0,
      // personalDetail:{},
    };
  }

  componentDidMount() {
    const { match: { params: { type } }, dispatch } = this.props;
    if (type === 'personal') {
      /* 个人认证结果 */
      dispatch(MAINTENACE_QUERY_USER_AUTHDETAIL()).then(() => {
        const { maintenance: { detail: { personalDetail } } } = this.props;
        if (personalDetail && personalDetail.success) {
          this.setState({
            detail: personalDetail.data,
            isPersonal: personalDetail.data.authStatus,
          });
        }
      });
    } else {
      /* 企业认证结果 */
      dispatch(MAINTENACE_QUERY_COMPANY_AUTHDETAIL()).then(() => {
        const { maintenance: { detail: { companyDetail } } } = this.props;
        if (companyDetail && companyDetail.success) {
          this.setState({
            detail: companyDetail.data,
            isCompany: companyDetail.data.authStatus,
          });
        }
      });
    }
  }

  // handleBtnCallBack = ()=>{
  //   const { maintenance: { detail: { personalDetail } } } = this.props;
  //   confirm({
  //     title:'确定删除此企业成员？',
  //     okText: '确认',
  //     cancelText: '取消',
  //     onOk:()=>{
  //       const params = {
  //         // id,
  //         userAuthId:personalDetail.data.id
  //       };
  //       console.log(params)
  //       remove(params).then(item=>{
  //         if (item.success){
  //           Toast.success('删除成功')
  //           router.push('/shopcenter/maintenance');
  //         }
  //       })
  //     }
  //   })
  // }

  render() {
    const { match: { params: { type } } } = this.props;
    const { detail, isPersonal, isCompany } = this.state;
    const list = type === 'personal' ? [
      { label: '姓名', text: detail.applicant },
      { label: '身份证号', text: detail.idCard },
      { label: '手机号', text: detail.contact },
      { label: '加入企业', text: detail.companyAuthName },
    ] : [
      { label: '企业名称', text: detail.name },
      { label: '统一社会信用代码', text: detail.registerNo },
      { label: '法定代表人', text: detail.legalPerson },
      { label: '申请人姓名', text: detail.applicantName },
      { label: '申请人号码', text: detail.applicantPhone },
    ];
    let cerlist;let cerText;let cerType;let cerImg;
    if ( type === 'personal' ){
      cerlist = [
        { code: -1, text: '无认证记录', type: 'red', img: IconFailure },
        { code: 0, text: '未提交认证申请', type: 'red', img: IconFailure },
        { code: 1, text: '认证通过', type: 'green', img: IconCertification },
        { code: 2, text: '认证不通过', type: 'red', img: IconFailure },
        { code: 3, text: '人工审核中', type: 'orange', img: IconAuthentication },
      ]
    }else {
      cerlist = [
        { code: -1, text: '无认证记录', type: 'red', img: IconFailure },
        { code: 1, text: '未提交认证申请', type: 'red', img: IconFailure },
        { code: 2, text: '认证通过', type: 'green', img: IconCertification },
        { code: 3, text: '认证不通过', type: 'red', img: IconFailure },
        { code: 4, text: '认证中', type: 'orange', img: IconAuthentication },
      ]
    }
    cerlist.map(item=>{
      const cerNum = type === 'personal' ? isPersonal : isCompany
      if (item.code === cerNum) {
        cerText = item.text;
        cerType = item.type;
        cerImg = item.img;
      }
    })
    const title = (
      <List.Item.Meta
        avatar={<Avatar
          style={{ background: '#f3f5ff', color: '#4988fd' }}
          icon={type === 'personal' ? 'user' : 'usergroup-delete'}
          size={52}
        />}
        title={<Text strong>{type === 'personal' ? detail.applicant : detail.name}</Text>}
        description={
          isPersonal !== 0 || isCompany !== 0 ? (
            <Tag color={cerType} style={{ display: 'inline-flex', alignItems: 'center' }}>
              <img src={cerImg} alt='' height={12} style={{ marginRight: 5 }}/>
              {cerText}
            </Tag>
          ) : ''
        }
      >
      </List.Item.Meta>
    );
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            window.history.back();
          }}
        >{type === 'personal' ? '查看个人认证信息' : '查看企业认证信息'}
        </NavBar>
        <div className='am-list'>
          <div style={{ padding: 12 }} className='cer-div'>
            <Card title={title} bordered={false}>
              {
                list.map(item => {
                  return <MatrixListItem label={item.label} className={type} title={item.text} type={item.type} />;
                })
              }
            </Card>
            {/* {type==='personal'? <Button type="primary" onClick={this.handleBtnCallBack} style={{ marginTop: 15 }} block>注销该用户</Button> :''} */}
          </div>
        </div>
      </div>
    );
  }
}

export default CertificationView;
