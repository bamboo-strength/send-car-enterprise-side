import React, { PureComponent } from 'react';
import { Button, Card, Col, Form, Icon, message, Modal, Row, Tag } from 'antd';
import MatrixInput from '@/components/Matrix/MatrixInput';
import QRCode from 'qrcode.react';
// import UseDept from '../../Components/UseDept';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';
import { NavBar, } from 'antd-mobile';
import { router } from 'umi';
import AgreeItem from 'antd-mobile/lib/checkbox/AgreeItem';
import { list,examine,cancel } from '../../../../services/Epidemic/billOfLoadingServices';
import { clientId } from '@/defaultSettings';

@Form.create()

class BillOfLoadingList extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      datas: [],
      checked:false,
      photovisible:false,
      billVisible:false,
      bill:{}
    };
  }

  handleSearch = params => {
    const param = {
      ...params,
    };

    list(param).then(resp => {
      if (resp.success) {
        this.setState({
          datas:{
            list: resp.data.records,
            pagination: {
              total: resp.data.total,
              current: resp.data.current,
              pageSize: resp.data.size,
            },
          },
        })

      }
    });
  };


  handleBtnCallBack = (code,rowData) => {
    const refresh = this.handleSearch
    const {params} = this.state
    switch (code) {
      case 'drawBill': {
        Modal.confirm({
          title: '领取提货单',
          content:
            <div className='btn-bg'>
              <AgreeItem data-seed="logId" onChange={e => e.target.checked === true?this.setState({checked:true}):this.setState({checked:false})} style={{marginRight:15}}>
                上述信息由本人申报并核实，如有瞒报，本人愿承担一切法律责任。本人同意并授权运营商查询疫情期间14天内到访地信息。
                <a onClick={(e)=>{ e.preventDefault(); this.setState({photovisible:true})}}>《用户服务协议》及《隐私政策》</a>
              </AgreeItem>
            </div>,
          onOk() {
            cancel({id:rows[0].id}).then(resp=>{
              if(resp.success){
                message.info('作废成功')
                refresh(params)
              }
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });
        break;
      }
      case 'cancel': {
        const {form} = this.props
        Modal.confirm({
          title: '作废提货单',
          content: <div>
            <MatrixInput label="提货单数量(张)" placeholder="请输入提货单数量" id="deliveryCount" maxLength={4} required numberType='isIntGtZero' form={form} />
                   </div>,
          onOk() {
            cancel({id:rows[0].id}).then(resp=>{
              if(resp.success){
                message.info('作废成功')
                refresh(params)
              }
            })
          },
          onCancel() {
            console.log('Cancel');
          },
        });

        break;
      }
      case 'showQrcode': {
        this.setState({
          bill:rowData,
          billVisible:true,
        })
        break;
      }
      case 'recover': { // 回收
        this.setState({
          bill:rowData,
          billVisible:true,
        })
        break;
      }
      default:
    }
  }

  handleCancel = e => {
    this.setState({
      billVisible: false,
    });
  };

  drawBill=()=>{ // 客户领取

  }

  renderSearchForm = onReset => {
    const { form } = this.props;
    return (
      <Form>
        <Row gutter={{ md: 8, lg: 24, xl: 48 }}>
          {/* <UseDept form={form} span={8} />*/}
          <Col span={8}>
            <MatrixInput placeholder='请输入物资名称' label='物资名称' id='coalName' form={form} />
          </Col>
          <Col style={{ float: 'right' }}>
            <Button type='primary' htmlType='submit'>查询</Button>
            <Button style={{ marginLeft: 8 }} onClick={onReset}>重置</Button>
          </Col>
        </Row>
      </Form>
    );
  };

  render() {
    const { form,  } = this.props;
    const { billVisible,bill } = this.state;

    const columns = [
      { title: '厂区名称', dataIndex: 'deptName', },
      { title: '货品名称', dataIndex: 'materialName', },
      // { title: '发货单位', dataIndex: 'sellerName', },
      { title: '客户名称', dataIndex: 'consigneeName', },
      { title: '提煤单数量(张)', dataIndex: 'deliveryCount'},
      { title: '绑定数量(张)', dataIndex: 'boundCount', },
      { title: '完成数量(张)', dataIndex: 'finshCount', },
      { title: '作废数量', dataIndex: 'cancelCount',  align: 'center', },
      { title: '计划重量(吨)', dataIndex: 'plannedTonnage',  align: 'center', },
      { title: '生效开始时间', dataIndex: 'beginTime',  align: 'center', },
      { title: '生效结束时间', dataIndex: 'endTime',  align: 'center', },
      { title: '创建人', dataIndex: 'createUserName',  align: 'center', },
      { title: '状态', dataIndex: 'statusName',  align: 'center', },
    ];
    const subColumns = [
      { title: '车牌号', dataIndex: 'vehicleNo', },
      { title: '司机姓名', dataIndex: 'driverName', },
      { title: '司机手机号', dataIndex: 'driverPhone', },
      { title: '绑定时间', dataIndex: 'deptName', },
      { title: '状态', dataIndex: 'statusName', },
    ]
    const colSty = {padding:'5px 0'}
    const row = (rowData, sectionID, rowID) => {
      return (
        <Card
          className='card-list'
          bordered={false}
          size="small"
          key={rowID}
          onClick={()=>router.push(`/billOfLoading/billOfLoading/view/${rowData.id}`)}
          actions={
            clientId === 'kspt'?
            [<a style={{color:'#1890FF'}} onClick={(e)=> router.push(`/epidemic/billOfLoading/edit/${rowData.id}`)}>修改</a>]:
            [<a style={{color:'#1890FF'}} onClick={(e)=> this.handleBtnCallBack('drawBill',rowData)}>领取</a>,
              <a style={{color:'#1890FF'}} onClick={(e)=> this.handleBtnCallBack('showQrcode',rowData)}>二维码查看</a>,
              <a style={{color:'#1890FF'}} onClick={(e)=> this.handleBtnCallBack('recover',rowData)}>回收</a>
            ]
          }
        >
          {columns.map(item =>
            <Col span={24} style={colSty}><Col span={9}> {item.title}：</Col> <Col span={15}>{rowData[item.dataIndex]}</Col></Col>
          )}
        </Card>
      )
    }
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={()=>router.push(`/shopcenter/secondskill`)}
          rightContent={[<Icon key="1" type="plus" style={{fontSize:'25px'}} onClick={() => router.push('/billOfLoading/billOfLoading/add')} />]}
        >提货单信息
        </NavBar>
        <div className='am-list'>
          <MatrixListView interfaceUrl={list} onRef={this.onRef} row={row} pageSize={10} round />
        </div>
        <Modal
          title='电子提货单'
          visible={billVisible}
          onCancel={this.handleCancel}
          className="visibleCommonModal"
          width='60%'
        >
          <QRCode
            value={bill.id}// 生成二维码的内容
            size={220} // 二维码的大小
            fgColor="#000000" // 二维码的颜色
          />
        </Modal>
      </div>
    );
  }
}

export default BillOfLoadingList;
