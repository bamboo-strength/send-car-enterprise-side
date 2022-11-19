import { Card, List, NavBar, WhiteSpace, Button, Toast } from 'antd-mobile';
import React from 'react';
import { Col, Form, Icon, Row, } from 'antd';
import router from 'umi/router';
import MatrixInput from '@/components/Matrix/MatrixInput';
import { connect } from 'dva';
import func from '@/utils/Func';
import MatrixSSQ from '@/components/Matrix/MatrixSSQ';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import { requestApi } from '@/services/api';
import { detailDriver } from '@/services/merDriver';
import NetWorkImage from '@/components/NetWorks/NetWorkImage';
import styles from '@/global.less';
import { getCurrentDriver } from '@/utils/authority';

const { Item } = List;

@connect(({ merDriver, tableExtend }) => ({
  merDriver,
  tableExtend,
}))
@Form.create()
class DriverCertification extends React.Component {
  state = {
    loading: false,
    showColumsText: '',
    showColumsImg: [],
    imageUrls: {},
    realFiles: {},
    detail: {},
  };

  componentDidMount() {
    const { dispatch, } = this.props;
    const { imageUrls } = this.state;
    dispatch(TABLEEXTEND_COLUMNLIST({
      'tableName': 'driver',
      'modulename': 'certification',
      queryType: 1,
    })).then(() => {
      const { tableExtend: { data } } = this.props;
      if (data !== undefined && func.notEmpty(data.columList)) {
        const aa = data.columList;
        const showColumsText = aa.table_main.filter(item => item.category !== 7);
        const showColumsImg = aa.table_main.filter(item => item.category === 7);
        const currentDriver = getCurrentDriver()
        if (currentDriver.id) {
          detailDriver({ id: currentDriver.id }).then(resp => {
            const detail = resp.data;
            if (func.notEmpty(detail) && func.notEmpty(detail.certificatesList)) {
              showColumsImg.map((column,) => {
                // imageUrls[column.columnName] =  func.notEmpty(detail.certificatesList[index])?detail.certificatesList[index].imagePath:''
                const columnname = column.columnName;
                imageUrls[columnname] = func.notEmpty(detail[columnname]) ? detail[columnname] : '';
                return true;
              });
              this.setState({
                showColumsText,
                showColumsImg,
                imageUrls,
                detail,
              });
            } else {
              this.setState({
                showColumsText,
                showColumsImg,
                detail,
              });
            }
          });
        } else {
          this.setState({
            showColumsText,
            showColumsImg,
          });
        }
      }
    });
  }

  toAudit = () => {
    const { form, location } = this.props;
    const { realFiles, loading, showColumsImg, } = this.state;
    if (loading) {
      return;
    }
    form.validateFieldsAndScroll((err, values) => {
      if (!err) {
        let flagImg = true
        const param = values;
        const currentDriver = getCurrentDriver()
        param.id = JSON.stringify(currentDriver) !== '{}' ? currentDriver.id : '';
        param.jszh = param.jszh ? param.jszh.toUpperCase() : '';
        // 验证图片是否上传完成
        showColumsImg.map(item=>{
          if ( param[item.columnName] && typeof param[item.columnName] !== 'string' && typeof param[item.columnName].file === 'object') {
            flagImg = false
          }
          if (typeof param[item.columnName] === 'object') param[item.columnName] = param[item.columnName].file
          if (typeof param[item.columnName] === 'undefined') param[item.columnName] = ''
          return flagImg
        })
        if (!flagImg){
          Toast.loading('图片上传中，请等待！');
          return
        }
        this.setState({
          loading: true,
        });
        requestApi('/api/mer-driver-vehicle/driver/submit', { ...param, ...realFiles }).then(data => {
          // Toast.info(data.msg);
          this.setState({
            loading: false,
          });
          if (data.success) {
            router.push('/driverSide/personal/personalCenter');
          }
        });
      }
    });
  };


  render() {

    const { form } = this.props;
    const { loading, showColumsText, showColumsImg, imageUrls, detail, } = this.state;
    const iteams = getEditConf(showColumsText, form, detail, {});

    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/driverSide/personal/personalCenter')}
        >我的认证
        </NavBar>
        <div className='am-list'>
          <Card>
            <Card.Header
              title="资质信息"
            />
            <Card.Body>
              <Row gutter={24}>
                {
                  showColumsImg.map(item => {
                    return (
                      <Col span={12}>
                        <NetWorkImage labelNone upload id={item.columnName} className={styles.cerTification} label={item.columnAlias} required={item.isrequired === 1} uploadIcon url={imageUrls[item.columnName]} thumbUrl={item.initialvalue} form={form} />
                        <div className={styles.cerText}>{item.columnAlias}</div>
                      </Col>
                    )
                  })
                }
              </Row>
            </Card.Body>
            {/* <Card.Footer style={{ fontSize: '10px', color: 'red' }} content="请依次上传身份证正反面、驾驶证照正副页(单文件最大2MB)" /> */}
            <List className='static-list'>
              <WhiteSpace size="xl" />
              {

                showColumsText ?
                  showColumsText.length < 1 ?
                    <div>
                      <Item><MatrixInput label="姓名" maxLength={10} placeholder="请输入姓名" id="name" form={form} xs='6' required initialValue={detail.name} /></Item>
                      <Item><MatrixInput label="身份证" placeholder="请输入身份证号" id="jszh" xs='6' required form={form} numberType='isIdCardNo' initialValue={detail.jszh} /> </Item>
                      <Item><MatrixSSQ label="地区" id="regionId" required labelId="regionName" xs='6' placeholder='请输入所在地区' defaultValue={detail.regionName} style={{ width: '100%' }} defaultCodeValue={detail.regionId} form={form} /></Item>
                    </div> : <div className='iteams'>{iteams}</div> : undefined
              }
            </List>
          </Card>
          {
            showColumsText.length > 0 ?
              <Button
                type="primary"
                style={{ width: '50%', margin: '20px auto' }}
                onClick={this.toAudit}
                loading={loading}
              >
                提交审核
              </Button> : undefined}
          <List className='static-list'>
            <WhiteSpace size="lg" />
            <Item>请填写本人真实信息，该信息只用于核<br />实您的身份，不会出现泄漏，请放心填写!
            </Item>
          </List>
        </div>
      </div>
    );
  }
}

export default DriverCertification;
