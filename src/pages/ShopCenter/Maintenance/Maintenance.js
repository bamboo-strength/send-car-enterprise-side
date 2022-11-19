import React, { PureComponent } from 'react';
import { Card, Form, Icon, message, Tooltip } from 'antd';
import { NavBar, Toast } from 'antd-mobile';
import { img134, img3329, img3340 } from '@/components/Matrix/image';
import '../ShopCenter.less';
import Text from 'antd/lib/typography/Text';
import { router } from 'umi';
import { connect } from 'dva';
import { MAINTENACE_QUERY_COMPANY_AUTHDETAIL, MAINTENACE_QUERY_USER_AUTHDETAIL } from '@/actions/maintenance';
import { getUserType } from '@/utils/authority';

@connect(({ maintenance }) => ({
  maintenance,
}))
@Form.create()
class Maintenance extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      isPersonal: 0,
      isCompany: 0,
      isCode: false,
      isCompanyCode: false,
      companyDetail:{},
      personalDetail:{}
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    /* 企业认证结果 */
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    if(custTypeFlag!==undefined&&custTypeFlag=== 0){
      dispatch(MAINTENACE_QUERY_COMPANY_AUTHDETAIL()).then(() => {
        const { maintenance: { detail: { companyDetail } } } = this.props;
        this.setState({
          companyDetail
        })
        if (companyDetail.code === 200 && companyDetail.data.isNull) {
          this.setState({
            isCompanyCode: true,
          });
        } else if (companyDetail && companyDetail.success) {
          this.setState({
            isCompany: companyDetail.data.authStatus,
          });
        }
      });
    }

    /* 个人认证结果 */
    dispatch(MAINTENACE_QUERY_USER_AUTHDETAIL()).then(() => {
      const { maintenance: { detail: { personalDetail } } } = this.props;
      this.setState({
        personalDetail
      });
      if (personalDetail.code === 200 && personalDetail.data.isNull) {
        this.setState({
          isCode: true,
        });
      } else if (personalDetail && personalDetail.success) {
        this.setState({
          isPersonal: personalDetail.data.authStatus,
        });

      }
    });
  };

  /* 根据状态跳转不同页面 */
  onClick = (type) => {
    const { isCode, isCompany, isPersonal, isCompanyCode,personalDetail } = this.state;
    // console.log(isCompany);
    // 个人认证
    if (type === 'personal'){
      if (isCode !== true && isPersonal === 1 || isPersonal === 3) {
        router.push(`/shopcenter/maintenance/certificationview/${type}`); // 跳转详情页
      } else if(isPersonal === 0&& personalDetail.userAuthId===''){
        message.warn('未提交审核认证')
      } else if(isPersonal === 0&& personalDetail.userAuthId!==''){
        message.warn('认证中')
      } else {
        router.push(`/shopcenter/maintenance/certification/${type}`);// 跳转添加页
      }
    }
    // 企业认证
    if (type === 'company'){
      if (isCode === true){
        Toast.fail('您还未进行个人认证，请先进行个人认证！')
        return
      }
      if (isCompanyCode !== true && isCompany === 2){
        router.push(`/shopcenter/maintenance/certificationview/${type}`);// 跳转详情页
      }else if(isCompany === 4){
        router.push(`/shopcenter/maintenance/authorization`); // 法人授权
      }else {
        router.push(`/shopcenter/maintenance/certification/${type}`);// 跳转添加页
      }
    }
  };

  render() {
    const { isPersonal, isCompany, isCode, isCompanyCode,personalDetail,companyDetail } = this.state;
    let companyText; let personalText
    /* 企业认证状态 */
    switch (isCompany) {
      case 1:
        companyText = '未完成认证，去认证'
        break;
      case 2:
        companyText = '查看企业认证信息'
        break;
      case 3:
        companyText = '认证未通过'
        break
      case 4:
        companyText = '认证中'
        break;
      case -1:
        companyText = '企业认证'
        break;
      default:companyText = '企业认证'
    }
    /* 个人认证状态 */
    switch (isPersonal) {
      case 1:
        personalText = '查看个人认证信息'
        break;
      case 2:
        personalText = '认证未通过'
        break;
      case 3:
        personalText = '人工审核中'
        break
      case -1:
        personalText = '个人认证'
        break
      default:personalText = '个人认证'
    }
    const {custTypeFlag} = getUserType()!==null&&getUserType()
    const list =custTypeFlag!==undefined&&custTypeFlag=== 0 ? [
      {
        bg: '#49a9ee',
        img: img3340,
        title: '合同签署个人信息认证',
        textOne: isCode === true ? '个人认证' : personalText,
        textOneClick: 'personal',
        Tooltip: (
          <div>
            说明：<br />
            1.合同签署信息认证需进行个人认证和企业认证，认证顺序为先个人认证再企业认证；<br />
            2.个人认证是指合同签署人认证，用于保障企业认证的安全性和有效性，如遇问题可追责；<br />
            3.企业认证需先进行信息提交再进行法人授权认证，体现企业认证签署的真实意愿。
          </div>
        ),
      },
      {
        bg: '#f3857c', img: img134, title: '合同签署企业信息认证',
        textOne: isCompanyCode === true ? '企业认证' : companyText,
        textOneClick: 'company',
        Tooltip: (
          <div>
            说明：<br />
            1.合同签署信息认证需进行个人认证和企业认证，认证顺序为先个人认证再企业认证；；<br />
            2.个人认证是指合同签署人认证，用于保障企业认证的安全性和有效性，如遇问题可追责；<br />
            3.企业认证需先进行信息提交再进行法人授权认证，体现企业认证签署的真实意愿。
          </div>
        ),
      },
    ]: [
      {
        bg: '#49a9ee',
        img: img3340,
        title: '合同签署个人信息认证',
        textOne: isCode === true ? '个人认证' : personalText,
        textOneClick: 'personal',
        Tooltip: (
          <div>
            说明：<br />
            1.合同签署信息认证需进行个人认证和企业认证，认证顺序为先个人认证再企业认证；<br />
            2.个人认证是指合同签署人认证，用于保障企业认证的安全性和有效性，如遇问题可追责；<br />
            3.企业认证需先进行信息提交再进行法人授权认证，体现企业认证签署的真实意愿。
          </div>
        ),
      },
    ];
    const bodyStyle = { display: 'flex', alignItems: 'center', padding: '20px 15px' };
    // console.log(personalDetail)
    // console.log(companyDetail)
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => {
            router.push(`/shopcenter/mallhomepage/list`);
          }}
        >企业信息维护
        </NavBar>
        <div className='am-list' style={{ padding: 12 }}>
          {
            custTypeFlag!==undefined&&custTypeFlag=== 1&& JSON.stringify(personalDetail) !== '{}'?
              list.map(item => {
              return (
                <Card style={{ marginBottom: 12 }} bodyStyle={bodyStyle} bordered={false}>
                  <div style={{ background: item.bg }} className='image-bg'>
                    <img src={item.img} alt="" />
                  </div>
                  <div style={{ marginLeft: 12 }}>
                    <p className='p-cer-text'>
                      <Text strong>{item.title}</Text>
                      <Tooltip title={item.Tooltip}>
                        <img src={img3329} alt="" />
                      </Tooltip>
                    </p>
                    <Text style={{ color: '#1890FF' }}>
                      <a onClick={() => this.onClick(item.textOneClick)}>{item.textOne}</a>
                      {
                        item.textTwo ?  <a onClick={() => this.onClick(item.textTwoClick)}> | {item.textTwo}</a>:''
                      }
                    </Text>
                  </div>
                </Card>
              );
            }):''
          }
          {
            custTypeFlag!==undefined&&custTypeFlag=== 0&& JSON.stringify(personalDetail) !== '{}'&&JSON.stringify(companyDetail) !== '{}'?
              list.map(item => {
                return (
                  <Card style={{ marginBottom: 12 }} bodyStyle={bodyStyle} bordered={false}>
                    <div style={{ background: item.bg }} className='image-bg'>
                      <img src={item.img} alt="" />
                    </div>
                    <div style={{ marginLeft: 12 }}>
                      <p className='p-cer-text'>
                        <Text strong>{item.title}</Text>
                        <Tooltip title={item.Tooltip}>
                          <img src={img3329} alt="" />
                        </Tooltip>
                      </p>
                      <Text style={{ color: '#1890FF' }}>
                        <a onClick={() => this.onClick(item.textOneClick)}>{item.textOne}</a>
                        {
                          item.textTwo ?  <a onClick={() => this.onClick(item.textTwoClick)}> | {item.textTwo}</a>:''
                        }
                      </Text>
                    </div>
                  </Card>
                );
              }):''
          }
        </div>
      </div>
    );
  }
}

export default Maintenance;
