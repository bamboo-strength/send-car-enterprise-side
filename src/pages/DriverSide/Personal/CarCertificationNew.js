import { Card, List, NavBar, WhiteSpace, Button, Toast } from 'antd-mobile';
import { Form, Icon, Col, Row } from 'antd';
import React from 'react';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import MatrixSelect from '@/components/Matrix/MatrixSelect';
import { connect } from 'dva';
import func from '../../../utils/Func';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import { requestApi } from '@/services/api';
import { detailByVehicleId } from '@/services/merDriver';
import Loading from '@/components/Loading/Loading';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import styles from '../../../global.less';

const { Item } = List;

@connect(({ merVehicle, tableExtend, loading }) => ({
  merVehicle,
  tableExtend,
  loading: loading.models.merVehicle,
}))
@Form.create()
class CarCertificationNew extends React.Component {
  state = {
    //  files: [],
    loading: false,
    showColumsText: '',
    showColumsImg: [],
    imageUrls: {},
    detail: {},
  };

  componentDidMount() {
    const { dispatch } = this.props;
    const { imageUrls } = this.state;
    dispatch(TABLEEXTEND_COLUMNLIST({
      'tableName': 'merCar',
      'modulename': 'certification',
      queryType: 1,
    })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa = data.columList;
        const showColumsText = aa.table_main.filter(item => item.category !== 7);
        const showColumsImg = aa.table_main.filter(item => item.category === 7);
        //  console.log(truckId,truckId===undefined,truckId!=='undefined','=====truckId')
        this.setState({
          showColumsText,
          showColumsImg,
        }, () => {
          const {
            match: {
              params: { truckId },
            },
          } = this.props;
          if (truckId !== 'undefined') { // 车辆详情
            detailByVehicleId({ id: truckId }).then(resp => {
              const detail = resp.data;
              if (func.notEmpty(detail)) {
                showColumsImg.map((column) => {
                  const columnname = column.columnName;
                  imageUrls[columnname] = func.notEmpty(detail[columnname]) ? detail[columnname] : '';
                  return true;
                });
                this.setState({
                  imageUrls,
                  detail,
                });
              } else {
                this.setState({
                  detail,
                });
              }
            });
          }
        });
      }
    });
  }


  toAudit = () => {
    const {
      form,
      match: {
        params: { truckId },
      },
    } = this.props;

    const { loading, showColumsImg } = this.state;
    if (loading) {
      return;
    }

    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        const param = {
          ...values,
          id: truckId === 'undefined' ? '' : truckId,
        };
        let flagImg = true;
        // 验证图片是否上传完成
        showColumsImg.map(item => {
          if (param[item.columnName] && typeof param[item.columnName] !== 'string' && typeof param[item.columnName].file === 'object') {
            flagImg = false;
          }
          if (typeof param[item.columnName] === 'object') param[item.columnName] = param[item.columnName].file;
          if (typeof param[item.columnName] === 'undefined') param[item.columnName] = '';
          return flagImg;
        });
        if (!flagImg) {
          Toast.loading('图片上传中，请等待！');
          return;
        }
        this.setState({
          loading: true,
        });
        requestApi('/api/mer-driver-vehicle/vehicleCertification/submit', { ...param }).then(data => {
          if (data.success) {
            Toast.success(data.msg);
            router.push('/driverSide/personal/personalCenter');
          }
          this.setState({
            loading: false,
          });
        });
      }
    });
  };


  render() {
    const { form } = this.props;
    const { showColumsText, showColumsImg, imageUrls, loading, detail } = this.state;
    const iteams = getEditConf(showColumsText, form, detail, {}, false, 10);
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/myCars')}
        >车辆认证
        </NavBar>
        <div className='am-list'>
          <Card>
            {
              showColumsImg.length > 0 ?
                <div>
                  <Card.Header
                    title="证件上传"
                    /* extra={<span style={{ fontSize: '12px' }}>单位（吨）</span>} */
                  />
                  <Card.Body>
                    <Row gutter={24} className='imageUploadRow'>
                      {
                        showColumsImg.map(item => {
                          return (
                            <Col span={12}>
                              <NetWorkImage labelNone upload id={item.columnName} className={styles.cerTification} label={item.columnAlias} required={item.isrequired === 1} url={imageUrls[item.columnName]} uploadIcon thumbUrl={item.initialvalue} form={form} />
                              <div className={styles.cerText}>{item.columnAlias}</div>
                            </Col>
                          );
                        })
                      }
                    </Row>
                    {/* <Card.Footer style={{ fontSize: '10px', color: 'red' }} content="上传证件(单文件最大2MB)" /> */}
                  </Card.Body>
                </div>
                : undefined
            }
            <List className='static-list'>
              <WhiteSpace size="xl" />
              {
                showColumsText ?
                  showColumsText.length < 1 ?
                    <div>
                      <Item><MatrixInput label="车牌号码" placeholder="请输入车牌号码" required id="truckno" numberType='isPlateNo' form={form} initialValue={detail.truckno} /></Item>
                      <Item><MatrixSelect label="车辆类型" placeholder='请选择车辆类型' id="trucktype" required dictCode="vehicleType" style={{ width: '100%' }} initialValue={detail.trucktype} form={form} /></Item>
                      <Item><MatrixInput label="净重" placeholder="请输入净重" required id="netWeight" initialValue={detail.netWeight} form={form} numberType='isFloatGtZero' /></Item>
                      {/*  <Item><MatrixInput label="车辆总质量" placeholder="请输入车辆总质量" required id="totalWeight" form={form}  /></Item>
                    <Item><MatrixInput label="整备质量" placeholder="请输入整备质量" required id="kerbWeight" form={form}  /></Item>
                    <Item><MatrixInput label="核定载质量" placeholder="请输入核定载质量" required id="approvedLoadWeight" form={form}  /></Item>
                    <Item><MatrixInput label="车辆识别代码" placeholder="请输入车辆识别代码" required id="vehicleNumber" form={form}  /></Item> */}
                      <Item style={{ display: 'none' }}><MatrixInput label="道路运输证" placeholder="请输入道路运输证号" initialValue='123123' id="dlyszh" form={form} maxLength='17' /></Item>
                      <Item><MatrixSelect label="车轴数" placeholder='请选择车轴数' id="axles" required dictCode="axlesName" style={{ width: '100%' }} form={form} initialValue={detail.axles} />
                      </Item>
                    </div>
                    :
                    <div className='iteams'>{iteams}</div>
                  : undefined
              }
            </List>
          </Card>
          {
            showColumsText.length > 0 ?
              <Button type="primary" style={{ width: '50%', margin: '20px auto' }} onClick={this.toAudit} loading={loading}>
                提交
              </Button>
              : <Loading isLoading />
          }
        </div>
      </div>
    );
  }
}

export default CarCertificationNew;
