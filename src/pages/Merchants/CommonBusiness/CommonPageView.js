import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form, } from 'antd/lib/index';
import { Card, Icon, NavBar,  } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { COMMONBUSINESS_DETAIL } from '../../../actions/commonBusiness';
import { getViewConf } from '@/components/Matrix/MatrixViewConfig';

@connect(({ commonBusiness, tableExtend,loading }) => ({
  commonBusiness,
  tableExtend,
  loading: loading.models.commonBusiness,
}))
@Form.create()
class CommonPageView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      showColums: [],
      showSubColums:[],
      detailData:{},
      commonBusinessDefineVO:{},
    };
  }


  componentWillMount() {
    const {tableExtend:{ data }} = this.props;
    if (data && data.columList) {
        const {columList}=data;
        this.setState({
          showColums: columList.table_main,
          showSubColums: columList.table_sub
        },()=>{
          this.getDetailData()
        })
    }
  }

  getDetailData=()=>{
    const {
      dispatch,
      match: {
        params: { tableName,modulename,id, },
      },
      location
    } = this.props;
    if(location.state && location.state.data ){
      this.setState({
        detailData: location.state.data
      })
    }else {
      let diyUrl = null;
      if (tableName === 'mobileInterface' && modulename === 'MobiledispatchcardAction') {
        diyUrl = 'mer-yamei/mobileInterface/MobileCustomerAction/saleView'
      }
      dispatch(COMMONBUSINESS_DETAIL({realId:location.state?.id || decodeURIComponent(decodeURIComponent(id)), tableName,modulename, diyUrl})) .then(()=>{
        const {
          commonBusiness: { detail,init },
        } = this.props;
        this.setState({
          detailData: detail,
          commonBusinessDefineVO:init
        })
      });
    }
  }

  goReturn=()=>{
    const {
      match: {
        params: { tableName,modulename,id },
      },
      location,
    } = this.props;
    const backUrl = location.state && location.state.backUrl?location.state.backUrl :`/commonBusiness/commonList/${tableName}/${modulename}`
    const formValuesEcho = location.state && location.state.formValuesEcho?location.state.formValuesEcho :{}
    router.push({
      pathname:backUrl,
      state:{
        checkedId:id,
        formValuesEcho
      }
    })
  }

  render() {
    const {
      form,
    } = this.props;
    window.gobackurl = () => {
      this.goReturn()
    };
    const { getFieldDecorator } = form;
    const {showColums,showSubColums,detailData,commonBusinessDefineVO,} = this.state;
    const items=getViewConf(showColums?showColums.filter(ii=>ii.detailShowFlag === 1):[],getFieldDecorator,detailData);
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={this.goReturn}
        >{commonBusinessDefineVO.functionName?commonBusinessDefineVO.functionName:'详情'}
        </NavBar>
        <div className='am-list'>
          {items}
          {
            showSubColums.length >0 && detailData.sublist && detailData.sublist.map(col => (
              getViewConf(showSubColums.filter(ii=>ii.detailShowFlag === 1),getFieldDecorator,col)
            ))
        }
        </div>
      </div>
    );
  }
}
export default CommonPageView;

