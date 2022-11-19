import React, { PureComponent } from 'react';
import { connect } from 'dva/index';
import { Form,message, Col } from 'antd/lib/index';
import { Button, Card, Icon, NavBar, Toast, WhiteSpace } from 'antd-mobile';
import router from 'umi/router';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {queryVehicleDetail, auditData } from '@/services/commonBusiness';
import func from '@/utils/Func';
import { getInputSetting } from '@/pages/Merchants/commontable';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import MatrixDate from '@/components/Matrix/MatrixDate';
import MatrixTextArea from '@/components/Matrix/MatrixTextArea';
import MatrixAutoComplete from '@/components/Matrix/MatrixAutoComplete';
import MatrixGroupTree from '@/components/Matrix/MatrixGroupTree';
import MatrixInput from '@/components/Matrix/MatrixInput';



@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class CommonBusinessVehicleCancel extends PureComponent {

  state = {
    showColums: [],
    showSubColums: [],
    detail:[],
    loading:false,
    showTitle:false
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const  vehicleId=id
    queryVehicleDetail({ id: vehicleId}).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
    dispatch(TABLEEXTEND_COLUMNLIST({
      tableName: 'saas_truckinfo',
      'modulename': 'manage',
      queryType: 2,
    })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined) {
        if (data.columList !== null && data.columList !== undefined) {
          const aa = data.columList;
          this.setState({
            showColums: aa.table_main,
          });
        }
      }
    });
  }


  handleAccpet = e => {
    const {loading}=this.state
    e.preventDefault();
    if (loading) {
      return;
    }
    const {
      form,
      match: {
        params: { id },
      },
    } = this.props;

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        this.setState({
          loading: true,
        });
        auditData({auditStatus:2, ids:id, remark:values.remark }).then(resp => {
          this.setState({
            loading: false,
          });
          if (resp.success) {
            message.success(resp.msg);
            router.push('/businessVehicle/businessVehicle');
          } else {
            message.error(resp.msg || '取消审核失败');
          }
        });
      }
    });
  };




  render() {
    const {
      form,
    } = this.props;
    const {showColums,detail,loading,showTitle } = this.state;


    return (
      <div className="commonAdd">
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/businessVehicle/businessVehicle')}
        >取消审核
        </NavBar>
        <div className='am-list'>
          <Card>
            <div className='labelTitle'>基本信息</div>
            <Card.Body>
              {
                showColums.map(item=>{
                  const keyValue=func.notEmpty(detail[item.columnName])?detail[item.columnName]:item.initialvalue;
                  const isReadonly = item.isReadonly === 2 || item.isReadonly === 3 || item.isReadonly === 4;
                  const isrequired = item.isrequired === 1;
                  const shownameValue=detail[item.showname];
                  const typeValue=item.columnType;
                  const types = getInputSetting(typeValue);
                  if (item.category === 1){
                    return (
                      <Col span={24} className='add-config'><MatrixSelect label={item.columnAlias} placeholder='' id={item.columnName} dictCode={item.dickKey} initialValue={keyValue} required={isrequired} style={{width: '100%'}} disabled={isReadonly} labelId={item.showname} bringData={item.bringData} form={form} /></Col>
                    )}
                  if (item.category === 2){
                    return (
                      <Col span={24} className='add-config'><MatrixDate label={item.columnAlias} placeholder='' id={item.columnName} format={item.dickKey} required={isrequired} style={{width: '100%'}} initialValue={keyValue} disabled={isReadonly} form={form} /></Col>
                    )
                  }
                  if (item.category === 3){
                    return (
                      <Col span={24} className='add-config'><MatrixTextArea label={item.columnAlias} placeholder='' id={item.columnName} maxLength={item.columnLength} style={{ minHeight: 32 }} row={2} initialValue={keyValue} required={isrequired} form={form} /></Col>
                    )}
                  if (item.category === 4) {
                    return (
                      <Col span={24} className='add-config'><MatrixAutoComplete label={item.columnAlias} placeholder='' dataType={item.dickKey} id={item.columnName} labelId={item.showname} value={keyValue} labelValue={shownameValue} required={isrequired} disabled={isReadonly} bringData={item.bringData} style={{ width: '100%' }} numberType={types} form={form} /></Col>
                    )}
                  if (item.category === 7){
                    this.setState({
                      showTitle:true
                    })
                    return (<Col span={12} className="view-config imgBg" style={{display:'none'}} />)}
                  if (item.category === 8){
                    return (
                      <Col span={24} className='add-config'><MatrixGroupTree label={item.columnAlias} placeholder='' id={item.columnName} dictCode={item.dickKey} initialValue={keyValue} required={isrequired} style={{width: '100%'}} disabled={isReadonly} form={form}  /></Col>
                    )}
                  if (item.category === 9){
                    return (
                      <Col span={24} className='add-config'><MatrixGroupTree label={item.columnAlias} placeholder='' id={item.columnName} dictCode={item.dickKey} initialValue={keyValue} required={isrequired} style={{width: '100%'}} disabled={isReadonly} form={form}  /></Col>
                    )}
                  return (
                    <Col span={24} className='add-config'><MatrixInput label={item.columnAlias} placeholder='' numberType={item.columnType} id={item.columnName} required={isrequired} style={{ width: '100%' }} initialValue={keyValue} dictCode={item.dickKey} maxLength={item.columnLength} disabled={isReadonly} realbit={item.dickKey} form={form} /></Col>
                  )
                })
              }
            </Card.Body>
            { showTitle ? <WhiteSpace style={{background:'#f0f2f5',margin:'8px 0'}} size="sm" />:null}
            { showTitle ? <div className='labelTitle labelTitle2'>证件图片</div>:null}
            {
              showTitle ? (
                <Card.Body>
                  {
                    showColums.map(item=>{
                      return item.category === 7?(
                        <Col span={12} className="view-config imgBg">
                          <Col span={24}>
                            <img src={detail[item.columnName]} alt="" onClick={(e) => this.expandImg(e, detail[item.columnName])} />
                          </Col>
                          <Col span={24} className='colabel'>
                            {item.columnAlias}
                          </Col>
                        </Col>
                      ):null
                    })
                  }
                </Card.Body>
              ):null
            }
          </Card>
          <Button icon='/image/plus.png' style={{lineHeight:'2',marginTop:'20px'}} type="primary" onClick={this.handleAccpet} block loading={loading}>
            提交
          </Button>
        </div>
      </div>
    );
  }
}

export default CommonBusinessVehicleCancel;

