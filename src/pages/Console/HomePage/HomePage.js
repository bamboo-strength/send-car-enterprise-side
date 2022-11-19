import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Form, Card, Col, Row, Popover, message, Icon, Select, Button, Carousel } from 'antd';
import styles from '../../../layouts/Sword.less';
import { getCurrentUser, getToken } from '@/utils/authority';
import { detail as tenantDetail } from '@/services/TenantDetailServices';
import { list as tenantProductList } from '@/services/TenantProductServices';
import router from 'umi/router';
import Func from '@/utils/Func';

const { Meta } = Card;
const { Option } = Select;

@connect(({ tenantDetail, loading }) => ({
  tenantDetail,
  loading: loading.models.tenantDetail,
}))
@Form.create()
class HomePage extends PureComponent {

  state = {
    detail: {},
    productList: {},
    clicked: false,
    hovered: false,
  }

  componentWillMount() {
    const user = getCurrentUser();

    tenantDetail({createUser: user.userId, tenantId: user.tenantId,}).then((resDetail) => {
      if (resDetail.success && Func.notEmpty(resDetail.data.id)){
        tenantProductList({tenantDetailId:resDetail.data.id}).then((resProduct) => {
          if (resProduct.success){
            this.setState({
              detail:resDetail.data,
              productList:resProduct.data.records
            });
          }
        })
      }
    })
  }

  getAuditCol = (item) =>{
    return(
      <div>
        {
          item.split("<br/>").map(value =>(
              this.getAudit(value)
            )
          )
        }
      </div>
    )
  };

  getAudit = (item) =>{
    return(<div>{item}</div>)
  };

  getProduct = (detail,productList) =>{

    if (productList.length>0){
      // 循环产品
      const lxgk = [];
      const kspt = [];
      const auditlxgk = [];
      const auditkspt = [];
      productList.map(value=>{
        if(value.product === 0 && value.auditFlag === 0){
          lxgk.push(value)
        }
        if(value.product === 1 && value.auditFlag === 0){
          kspt.push(value)
        }
        if(value.product === 0){

          if (value.auditFlag === 1 || value.auditFlag === 2){
            auditlxgk.push(value)
          }
        }
        if(value.product === 1 ){
          if (value.auditFlag === 1 || value.auditFlag === 2){
            auditkspt.push(value)
          }
        }
      })

      return(
        <div>
          {
            auditlxgk.length>0||auditkspt.length>0?
              <Card title="已审核的产品" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  {auditlxgk.map(value => (
                    <Card
                      className={styles.card}
                      bordered={false}
                      // hoverable
                      // style={{width: 400,}}
                      cover={<img alt="example" src={require('../../../../public/product/lxgk.jpg')} />}
                      actions={value.auditFlag===1?[
                        <Icon type="setting" key="setting" onClick={this.handleClick.bind(this,value.product)} title="重新开通" />,
                      ]:[
                        <Icon type="login" key="login" onClick={this.doLogin.bind(this,value.product)} title="立即登录" />,
                      ]
                      }
                    >
                      <Popover
                        style={{ width: 500,height:500 }}
                        content={
                          value.auditRemark.split("<col/>").map(item =>(
                              this.getAuditCol(item)
                            )
                          )}
                        title="审核详情"
                        trigger="hover"
                        visible={this.state.clicked}
                        onVisibleChange={this.handleClickChange}
                      >
                        <Meta title="流向管控" description={value.auditFlag===1?"审核未通过":"审核通过"} />
                      </Popover>
                    </Card>
                  ))}
                  {auditkspt.map(value => (
                    <div>
                      {value.auditFlag===1?[
                        <Col>
                          <Card
                            className={styles.card}
                            bordered={false}
                            // hoverable
                            // style={{width: 400,}}
                            cover={<img alt="example" src={require('../../../../public/product/kspt.jpg')} />}
                            actions={[<Icon type="setting" key="setting" onClick={this.handleClick.bind(this,value.product)} title="重新开通" />]}
                          >
                            <Popover
                              style={{ width: 500 }}
                              content={
                                value.auditRemark.split("<col/>").map(item =>(
                                    this.getAuditCol(item)
                                  )
                                )}
                              title="审核详情"
                              trigger="hover"
                              visible={this.state.hovered}
                              onVisibleChange={this.handleHoverChange}
                            >
                              <Meta title="客商平台" description={value.auditFlag===1?"审核未通过":"审核通过"} />
                            </Popover>
                          </Card>
                        </Col>
                      ]:[
                        <div>
                          <Col span={16}>
                            <Card
                              className={styles.card}
                              bordered={false}
                              // hoverable
                              // style={{width: 400,}}
                              cover={<img alt="example" src={require('../../../../public/product/kspt.jpg')} />}
                            >
                              <Popover
                                style={{ width: 500 }}
                                content={
                                  value.auditRemark.split("<col/>").map(item =>(
                                      this.getAuditCol(item)
                                    )
                                  )}
                                title="审核详情"
                                trigger="hover"
                                visible={this.state.hovered}
                                onVisibleChange={this.handleHoverChange}
                              >
                                <Meta title="客商平台" description={value.auditFlag===1?"审核未通过":"审核通过"} />
                              </Popover>
                            </Card>
                          </Col>
                          <Col span={5}>
                            <Row className={styles.card}>
                              <Button onClick={this.doLogin.bind(this,value.product,"kspt")} type="primary">发货方登录</Button>
                            </Row>
                            <Row className={styles.card}>
                              <Button onClick={this.doLogin.bind(this,value.product,"kspt_cyf")} type="danger">承运方登录</Button>
                            </Row>
                            <Row className={styles.card}>
                              <Button onClick={this.doLogin.bind(this,value.product,"kspt_shf")} type="dashed">收货方登录</Button>
                            </Row>
                          </Col>
                        </div>
                      ]
                      }
                    </div>
                  ))}

                </Row>
              </Card>: ""
          }
          {
            lxgk.length>0||auditlxgk.length>0?
              ""
              :
              <Card title="立即开通产品" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  <Card
                    className={styles.card}
                    bordered={false}
                    // hoverable
                    cover={<img alt="example" src={require('../../../../public/product/lxgk.jpg')} />}
                    actions={[<Button onClick={this.handleClick.bind(this,0)} type="primary" block>立即开通水泥流向管控</Button>]}
                  >
                  </Card>
                </Row>
              </Card>
          }
          {
            kspt.length>0||auditkspt.length>0?
              ""
              :
              <Card title="立即开通产品" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  <Card
                    className={styles.card}
                    bordered={false}
                    // hoverable
                    cover={<img alt="example" src={require('../../../../public/product/kspt.jpg')} />}
                    actions={[<Button onClick={this.handleClick.bind(this,0)} type="primary" block>立即开通水泥客商平台</Button>]}
                  >
                  </Card>
                </Row>
              </Card>
          }
          {
            lxgk.length>0||kspt.length>0?
              <Card title="待审核的产品" className={styles.card} bordered={false}>
                <Row gutter={16}>
                  {lxgk.map(value => (
                    <Card
                      className={styles.card}
                      bordered={false}
                      // hoverable
                      // style={{width: 400,}}
                      cover={<img alt="example" src={require('../../../../public/product/lxgk.jpg')} />}
                    >
                      <Meta title="流向管控" description="系统权限申请中，业务人员稍后会和您联系" />
                    </Card>
                  ))}
                  {kspt.map(value => (
                    <Card
                      className={styles.card}
                      bordered={false}
                      // hoverable
                      // style={{width: 400,}}
                      cover={<img alt="example" src={require('../../../../public/product/kspt.jpg')} />}
                    >
                      <Meta title="客商平台" description="系统权限申请中，业务人员稍后会和您联系" />
                    </Card>
                  ))}

                </Row>
              </Card>: ""
          }
        </div>
      )
    }else {
      return(
        <Card title="立即开通产品" className={styles.card} bordered={false}>
          <Row gutter={16}>
            <Card
              className={styles.card}
              bordered={false}
              // hoverable
              cover={<img alt="example" src={require('../../../../public/product/lxgk.jpg')} />}
              actions={[<Button onClick={this.handleClick.bind(this,0)} type="primary" block>立即开通水泥流向管控</Button>]}
            >
            </Card>
            <Card
              className={styles.card}
              bordered={false}
              // hoverable
              cover={<img alt="example" src={require('../../../../public/product/kspt.jpg')} />}
              actions={[<Button onClick={this.handleClick.bind(this,1)} type="primary" block>立即开通水泥客商平台</Button>]}
            >
            </Card>
          </Row>
        </Card>
      );
    }
  }

  handleClick = (product) =>{
    // message.success('重新开通！');
    router.push(`/console/product/product/${product}`);
    return;
  }

  doLogin = (product,kspt) =>{
    const toToken = getToken();
    if(product === 0){
      message.success('立即登录流向管控！');
      window.open(`http://39.106.19.95/#/user/tokenlogin?token=${toToken}`);
    }else {

      if (kspt === 'kspt'){
        message.success('立即登录客商平台发货方！');
        window.open(`http://101.201.235.128/#/user/tokenlogin?token=${toToken}`);
      }
      if (kspt === 'kspt_cyf'){
        message.success('立即登录客商平台承运方！');
        window.open(`http://101.201.235.128:81/#/user/tokenlogin?token=${toToken}`);
      }
      if (kspt === 'kspt_shf'){
        message.success('立即登录客商平台收货方！');
        window.open(`http://101.201.235.128:82/#/user/tokenlogin?token=${toToken}`);
      }
    }

    return;
  }

  hide = () => {
    this.setState({
      clicked: false,
      hovered: false,
    });
  };

  handleHoverChange = visible => {
    this.setState({
      hovered: visible,
      // clicked: false,
    });
  };

  handleClickChange = visible => {
    this.setState({
      clicked: visible,
      // hovered: false,
    });
  };

  render() {

    const { detail, productList } = this.state;

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    return (
      <div>
        <Carousel autoplay>
          <div className={styles.carousel01}>
            <h3 className={styles.carouselh3}>公有云、私有云、 本地化部署随心所欲。</h3>
          </div>
          <div className={styles.carousel02}>
            <h3 className={styles.carouselh3}>基于微服务架构，关键应用本地部署和存储。</h3>
          </div>
          <div className={styles.carousel03}>
            <h3 className={styles.carouselh3}>公有数据在公有云上融合互通，社会价值和企业价值完美融合。</h3>
          </div>
        </Carousel>
        <Card className={styles.card} bordered={false}>
          {this.getProduct(detail,productList)}
        </Card>
      </div>
    );
  }
}
export default HomePage;
