import React, { PureComponent } from 'react';
import { Form, Modal } from 'antd/lib/index';
import { Modal as MobileModal, Toast } from 'antd-mobile';
import { connect } from 'dva';
import func from '@/utils/Func';
import router from 'umi/router';
import QRCode from 'qrcode.react';
import Title from 'antd/lib/typography/Title';
import Text from 'antd/lib/typography/Text';
import { COMMONBUSINESS_LIST } from '@/actions/commonBusiness';
import { submit } from '@/services/commonBusiness';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import { getQueryConf } from '../../../components/Matrix/MatrixQueryConfig';
import { requestPostHeader } from '@/services/api';
import MatrixListViewForTable from '../../../components/Matrix/MatrixListViewForTable';
import { getButton, getToken } from '@/utils/authority';
import { getBaseUrl, getTenantId } from '../commontable';
import matrixqrcode from '../../../components/Matrix/MatrixCommon.less';
import { handleSearchParams } from '../../../components/Matrix/commonJs';

const { alert } = MobileModal;

@connect(({ commonBusiness,tableExtend,loading }) =>({
  commonBusiness,
  tableExtend,
  loading:loading.models.commonBusiness,
}))

@Form.create()
class CommonPageList extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      params: {},
      visibleCommonModal:false,
      btn:{},
      obj:{},
      parentObj:{},
      queryData:[],
      isloading:false,
      showQRCode:false,
      queryParams:{},
      settingVo:{},
      qrCodeContent:'{"deptName":"所属机构","custName":"客户","vehicleno":"车号","materialsName":"物资"}',
      qrCodeInnerContent:'id',
      childTable: undefined
    }
  }


  handleSearch = (param,tableCondition) => {
    const { dispatch,
      match: {
        params: { tableName,modulename },
      },
      form
    } = this.props;
    const { childTable } = this.state;
    const newCondation = tableCondition || this.conditions
    const params = handleSearchParams(newCondation,param,form)
    this.conditions = tableCondition && tableCondition.length>0?tableCondition:this.conditions
    const rparams = params
    rparams['Blade-DesignatedTenant'] = getTenantId()
    delete rparams.headers
    dispatch(COMMONBUSINESS_LIST({tableName,modulename,queryParam:rparams})).then(()=>{
      const { commonBusiness:{ data },
      } = this.props;
      const settingVo = func.notEmpty(data.commonBusinessDefineVO)?data.commonBusinessDefineVO:{}
      this.setState({
        queryData:data,
        settingVo,
        queryParams:rparams,
        params
      })
      childTable && childTable.onClose()
    })
  };



  handleBtnCallBack = param => {
    const { btn, obj,parentObj } = param;
    const {
      match: {
      params: { tableName,modulename },
    },
    } = this.props
    const { params } = this.state;
    const refresh = this.handleSearch;
    switch (btn.code) {
      case 'remove':
      {
        alert('删除', '确定删除?', [
          { text: '取消', style: 'default' },
          {
            text: '确定', onPress: () => {
              requestPostHeader('/api/mer-tableextend/commonBusiness/remove', { ids: obj.id,tableName,modulename }).then(resp=>{
                if (resp.success) {
                  Toast.success(resp.msg)
                  refresh(params);
                }
              })

            },
          },
        ]);

        break;
      }
      case 'onlineContract':
      {
        const a11={
          contractNo:obj.ztext3,
          contractId:obj.ztext2,
          signerId:obj.ztext1,
          "flag":"false",
        }
        const address = `${getBaseUrl()}/contract-sign/${getToken()}/${JSON.stringify(a11)}`
        window.location.href=address
        break;
      }
      default:this.handleCommonBtn(btn,obj,parentObj)
    }
  }

  handleCancel = () => {
    const { form} = this.props;
    form.resetFields()
    this.setState({
      visibleCommonModal: false,
      showQRCode:false,
    });
  };


  handBtnClick=(values,code)=>{
    const {match: {
      params: { tableName,modulename },
    },} = this.props
    const refresh = this.handleSearch;
    const {params} = this.state
    submit({tableName,modulename,submitParams:values,btnCode:code}).then(resp=>{
      if(resp.success){
        Toast.success('操作成功！');
        this.setState({
          visibleCommonModal:false
        })
        refresh(params)
      }
    })
  }

  CreateModalForm=(showColums,showSubColums)=>{
    const {btn,obj,parentObj} = this.state
    const {
      commonBusiness:{data}
    } = this.props;

    const vo = data.commonBusinessDefineVO.sublist.filter(item=>item.buttonCode === btn.code)
    let str = ''
    Object.keys(JSON.parse(vo[0].modifyFieldJson)).forEach(key => {
      str+=key
    });

    let realshowColums = []
    if(btn.action !== 4){ // 不是子表按钮
      realshowColums = showColums.filter(item=>str.includes(item.columnName))
    }else { // 子表按钮
      realshowColums = showSubColums.filter(item=>str.includes(item.columnName))
    }
    const Pop = Form.create()(props => {
      const {form} = props;
      const handleCommonBtnOK = () => {
        form.validateFieldsAndScroll((err, values) => {
          if (!err) {
            Object.keys(values).forEach(key => {
              if(typeof values[key] === 'object'){  // 时间处理
                values[key] = func.formatFromStr(values[key])
              }
            });

            let params = {
              ...parentObj
            }

            if(btn.action === 4){ // 子表传值
              params.sublist = {}
              const aa = {
                ...obj,
                ...values
              }
              const arr = []
              arr.push(aa)
              params.sublist = arr
            }else {
              params = {
                realId:obj.id,
                ...params,
                ...values
              }
            }
            this.handBtnClick(params,btn.code)
          }
        });
      };
      return (
        <Modal
          title={btn.remark}
          visible
          onOk={handleCommonBtnOK}
          onCancel={this.handleCancel}
          className="visibleCommonModal"
          width='90%'
          closable={false}
        >
          {btn.action !== 4?getEditConf(realshowColums,form,obj,{},form)
          :getQueryConf(realshowColums,form)}
        </Modal>
      );

    });
    return <Pop />
  }

  handleCommonBtn=(btn,obj,parentObj)=>{
    const { match: {
      params: { tableName,modulename },
    } } = this.props;
    const refresh = this.handleSearch;
    const { path } = btn;
    const {isloading,queryParams} = this.state
    if(btn.code.includes('withPop')){ // 弹框数据
      this.setState({
        visibleCommonModal:true,
        btn,
        obj,
        parentObj
      })
    }else if(btn.code.includes('withoutPop')){
      /* this.setState({
        isloading:true,
      }) */
      /* 防止重复提交 */
      const word = btn.name
      if (!isloading){
        alert(word, `确定${word}该数据?`, [
          { text: '取消', style: 'default' },
          {
            text: '确定', onPress: () => {
              submit({tableName,modulename,submitParams:{realId:obj.id},btnCode:btn.code}).then(resp=>{
              /*  this.setState({
                  isloading:false
                }) */
                if(resp.success){
                  Toast.success('操作成功！');
                  refresh(queryParams)
                }
              })
            },
          },
        ]);
      }
    }else if(btn.code.includes('withUrl')){
      router.push({
        pathname:`${path}/${obj.id}`,
        state:{
          object:obj,
          queryParams,
          topBarName:btn.name,
          btnCode:btn.code,
          backUrl:`/commonBusiness/commonList/${tableName}/${modulename}`
        }},
        )
    }else if(btn.code.includes('qrCode')){
      const {
        commonBusiness:{data}
      } = this.props;
      let {qrCodeContent,qrCodeInnerContent} = this.state
      const vo = data.commonBusinessDefineVO.sublist.filter(item=>item.buttonCode === btn.code) // 找到配置的字段功能
      if(vo.length>0 && vo[0].modifyFieldJson){
        const qrcontent = vo[0].modifyFieldJson.split('|')
        qrCodeContent = qrcontent[0]
        if(qrcontent.length > 1){ // 如果为两部分 则|前为二维码展示字段 |后为二维码扫描后显示的字段
          qrCodeInnerContent = qrcontent[1]
        }
      }
      const content = []
      Object.keys(JSON.parse(qrCodeContent)).map(key => {
        content.push(
          {name:JSON.parse(qrCodeContent)[key],value:obj[key]}
        )
      })
      const toAndriod = {
        id:obj[qrCodeInnerContent],
        content
      }
      const items = JSON.stringify(toAndriod)
      try {
        ScreenBright.setBrightness(items)
      }catch (e) {
        this.setState({
          showQRCode:true,
          obj,
          qrCodeContent,
          qrCodeInnerContent
        })
      }
    }
  }

  render() {
    const { form , match: { params: { tableName,modulename }, }, location} = this.props;
    const code = `${tableName}_${modulename}`
    const {visibleCommonModal,queryData,showQRCode,obj,settingVo,qrCodeContent,qrCodeInnerContent} = this.state
    const buttons = getButton(code)
    const actionButtons = buttons.filter(button => button.alias === 'add');
    const backUrl = location.state?location.state.backUrl:'/dashboard/function'
    return (
      <div className={matrixqrcode.commonPageList}>
        <MatrixListViewForTable
          locationData={location}
          data={queryData}
          navName={settingVo.functionName}
          titleName={settingVo.subTitleName}
          tableName={tableName}
          modulename={modulename}
          form={form}
          code={code}
          getDataFromPa={this.handleSearch}
          btnCallBack={this.handleBtnCallBack}
          notAdd={!actionButtons.length>0}
          addPath={actionButtons.length>0?actionButtons[0].path:''}
          visibleCommonModal={visibleCommonModal}
          CreateModalForm={this.CreateModalForm}
          backUrl={backUrl}
          xs={9}
          isShowSub={parseInt(settingVo.isShowSub,10)===1}
          appListShowNum={settingVo.appListShowNum}
          backgroundStyle={settingVo.backgroundStyle}
          onRef={(refs => this.setState({childTable: refs}))}
        />
        <Modal
          visible={showQRCode}
          transparent
          maskClosable
          animationType='fade'
          platform='android'
          onCancel={this.handleCancel}
          footer={null}
          className='QrCodeModal'
          closable={false}
        >
          <Title level={4} style={{color: '#666',fontWeight: 500,textAlign:'center'}}>二维码</Title>
          {
            Object.keys(JSON.parse(qrCodeContent)).map(key => {
              return (<Text style={{marginBottom:5}}>{JSON.parse(qrCodeContent)[key]}：{obj[key]}</Text>)
            })
          }
        </Modal>
      </div>
    );
  }
}

export default CommonPageList;
