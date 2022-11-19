import React, { PureComponent } from 'react';
import Link from 'umi/link';
import { Descriptions, Form, Divider, Empty, Drawer,} from 'antd';
import FlowPhoto from '@/components/FloworderInfo/FlowPhoto';
import FlowPhotos from '@/components/FloworderInfo/FlowPhotos';
import LocusMap from '@/components/AMap/Locus/LocusMap';
import AuditHandle from '@/components/FlowtoAudit/AuditHandle';
import Weightchange from '@/components/FloworderInfo/Weightchange';
import Func from '@/utils/Func';
import moment from 'moment';
import { detail,flowOripicdetail } from '@/services/FloworderInfoService';
import { Toast } from 'antd-mobile';

const rigdiv_left = {
  width: '50%',
  height:'100%',
  borderLeft:'1px solid #dce0e6',
  borderTop:"1px solid #dce0e6"
}

const rigdiv_left_above = {
  width: '100%',
  height: '24%',
}

const rigdiv_left_below = {
  width: '100%',
  height: '66%',
  marginTop: '8%',
}

const rigdiv_right = {
  width: '50%',
  height: '100%',
  marginLeft:'50%',
  position:'relative',
  top: '-100%',
  borderLeft:'1px solid #dce0e6',
  borderRight:'1px solid #dce0e6',
}

const rigdiv_right_above = {
  width: '100%',
  height: '50%',
  // background: 'red'
}

const rigdiv_right_below = {
  width: '100%',
  height: '41%',
  marginTop: '7%',
  // background: 'blue',
}


const loadingStyle = {
  position: 'relative',
  height: '100%',
  width: '100%',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center'
}
const Loading = <div style={loadingStyle}>Loading Map...</div>

@Form.create()
class FloworderInfo extends PureComponent {

  constructor() {
    super();
    this.state = {
      photovisible: false,
      drawerpic :[],
      params1: {},
      autoheight1: 760,
      oripicdata:[],
    };
  }


  componentWillMount() {
    const {dispatch,params} = this.props;
    this.deviceno = params.deviceNos;
    this.isselect = true;
    this.orderId = params.id;
  }

  componentDidMount(){
    const {dispatch,params} = this.props;
    const orderId = params.id;
    this.getOrderInfo(orderId);
    // this.setState({
    //   params1: params,
    // });
    // this.isselect = true;

  }

  componentWillReceiveProps(nextProps) {
    const {autoheight} = nextProps;
    if (autoheight !== this.props.autoheight) {
      this.setState({
        autoheight1: autoheight
      });
    }
  }

  getOrderInfo =   async(orderid)=>{
    let orderdata = {};
    let picdata = [];
    if (Func.notEmpty(orderid)){
      await detail({"id": orderid}).then((res)=>{
        if (Func.notEmpty(res)) {
          if (res.success) {
            if (Func.notEmpty(res.data)){
              orderdata = res.data;
            }
          }
        }else {
          Toast.info('未查询到任务信息！')
        }
      })
      await flowOripicdetail({"orderId": orderid}).then((res)=>{
        if (Func.notEmpty(res)) {
          if (res.success) {
            if (Func.notEmpty(res.data)){
              picdata=res.data
            }
          }
        }
      })
      this.isselect = true;
      this.setState({
        params1: orderdata,
        oripicdata: picdata,
      })
    }
  }



  showDrawer = (param1) => {
    const info = [];
    info.push(param1);
    this.setState({
      photovisible: true,
      drawerpic: info
    });
  };

  onClose = () => {
    this.setState({
      photovisible: false,
    });
  };

  // gpsInfo = (detail) =>{
  //    router.replace({pathname:'/gps/locus/locus',query:{deviceno:detail.deviceNos
  //      }});
  //   // window.open(`/shippers/floworder/maptest`, '_blank')
  //   // orderid:detail.id,deviceno:detail.deviceNos,truckno:detail.truckno,intime: detail.intime,arrivaltime: detail.arrivaltime,fhdh:detail.fhdh
  //
  // }

  //  轨迹查询关闭
  cancelselect = () =>{
    this.isselect=false
  }

  render() {
    const {photovisible,drawerpic,params1,autoheight1,oripicdata} =this.state;
    const {
      approveparam,
    } = this.props;
    //  审批控制
    let orderHandelId = undefined;
    let approvedisplay = 'none';
    if (approveparam !== undefined){
      orderHandelId = approveparam.id;
      approvedisplay = 'block';
    }
    const data3 = {
     // deviceno:params1.deviceNos,
     //  "orderid":this.orderId,"deviceno":this.deviceno,"truckno":params1.truckno,"intime": params1.intime,"arrivaltime": params1.arrivaltime,"fhdh":params1.fhdh
      "orderid":`${this.orderId}`,"deviceno":`${this.deviceno}`,"truckno":`${params1.truckno}`,"intime": `${params1.intime}`,"arrivaltime": `${params1.arrivaltime}`,"fhdh":`${params1.fhdh}`
    }

    this.isselect1 = true;
    const orderId = this.orderId;
    let selectDate1 = {    // 轨迹查询时间
      startTime: params1.intime,
      endTime: params1.finishtime
    }
    let selectweightDate = {
      startTime: Func.moment(selectDate1.startTime),
      endTime: Func.moment(selectDate1.endTime),
    }
    if (Func.notEmpty(selectDate1.startTime) && Func.isEmpty(selectDate1.endTime)){
      selectDate1 = {    // 轨迹查询时间
        startTime: params1.intime,
        endTime: moment().format('YYYY-MM-DD HH:mm:ss'),
      }
      selectweightDate = {
        startTime: moment(selectDate1.startTime),
        endTime: moment(selectDate1.endTime),
      }
    }else if (Func.isEmpty(selectDate1.startTime) && Func.isEmpty(selectDate1.endTime)){
      this.isselect = false;
      this.isselect1 = false;
      selectweightDate ={};
    }else if (Func.isEmpty(selectDate1.startTime)){
      this.isselect = false;
      this.isselect1 = false;
      selectweightDate ={};
    }


    const locusparam = {
      deviceno: this.deviceno,
      id: orderId
    }

    const bigdiv = {
      width: '100%',
      height: `${autoheight1}px`,
      overflow: "hidden",
    }

    const leftdiv = {
      width: '19%',
      height: `${autoheight1}px`,
      position:'absolute',
      overflowY: "auto",
      overflowX:"hidden"
    }

    const rightdiv = {
      width: '80%',
      height: `${autoheight1}px`,
      marginLeft:'20%',
    }

    // 图片加载
    const di = [];
    // 图片排序
    let data1 = oripicdata;
    for(let i=0;i<data1.length-1;i+=1) {
      for (let j = 0; j < data1.length - 1 - i; j += 1) {
        if (data1[j].picorder > data1[j + 1].picorder) {
          let tmp = data1[j + 1];
          data1[j + 1] = data1[j];
          data1[j] = tmp;
        }
      }
    }

    data1.map( (value,index) => {
      const picurl1 = value.picurl;
      const fahuophoto ={
        width: '32%',
        height: '100%',
        float: 'left',
        marginLeft: '1%',
      }
      di.push(
        <div style={fahuophoto} onClick={() =>{return this.showDrawer(value)}}>
          <img src={picurl1} style={{width: '100%',height: '100%'}} />
        </div>);
      return di;
    })

    if (di.length === 0){
      di.push(
        <Empty
          // image="/photo/photo.jpg"
          // imageStyle={{
          //   height: 60,
          // }}
          description={
            <b>
              暂无图片
            </b>}
        >
        </Empty>
      )
    }
// style={descriptionsstyle}
    return (
      <div style={bigdiv}>
        <div style={leftdiv}>

          <Descriptions title="基本信息" bordered='true' column={1} size='small' style={{width: '95%'}}>
            <Descriptions.Item label="车号" style={{fontSize:"1px"}}><font size="1">{params1.truckno}</font></Descriptions.Item>
            <Descriptions.Item label="客户"><font size="1">{params1.customerName}</font></Descriptions.Item>
            <Descriptions.Item label="物资"><font size="1">{params1.goodsName}({params1.packagingName})</font></Descriptions.Item>
            <Descriptions.Item label="净重"><font size="1">{params1.netweight}</font></Descriptions.Item>
            <Descriptions.Item label="发货单号"><font size="1">{params1.fhdh}</font></Descriptions.Item>
            <Descriptions.Item label="出厂编号"><font size="1">{params1.ccbh}</font></Descriptions.Item>
            <Descriptions.Item label="喷码信息"><font size="1">{params1.pmxx}</font></Descriptions.Item>
            <Descriptions.Item label="订单状态"><font size="1">{params1.orderFlagName}</font></Descriptions.Item>
            <Descriptions.Item label="监控规则"><font size="1">{params1.controlName}</font></Descriptions.Item>
            <Descriptions.Item label="离厂时间"><font size="1">{params1.outtime}</font></Descriptions.Item>
            <Descriptions.Item label="到达时间"><font size="1">{params1.arrivaltime}</font></Descriptions.Item>
          </Descriptions>
          <br />
          <Descriptions title="审批信息" bordered='true' column={1} size='small' style={{width: '95%',}}>
            <Descriptions.Item label="审核状态"><font size="1">{params1.auditStatusName}</font></Descriptions.Item>
            <Descriptions.Item label="审核结果"><font size="1">{params1.auditResultName}</font></Descriptions.Item>
          </Descriptions>
          <br />
          <div style={{display: approvedisplay}}>
            <AuditHandle orderHandelId={orderHandelId}>审批</AuditHandle>
          </div>

        </div>
        <div style={rightdiv}>
          <div style={rigdiv_left}>
            <div style={rigdiv_left_above}>
              <Divider orientation="left"><b>原始发货照片</b></Divider>
              <div style={{overflowY:'auto',width: '100%', height: '100%',}}>
                {
                  di.map((value,index) => {
                    return value;
                  })
                }
              </div>
            </div>
            <div style={rigdiv_left_below}>
              <Divider orientation="left">
                <Link
                  to={{
                    pathname: `/gps/locus/locus`,
                    search: JSON.stringify(data3)
                  }}
                  target="_blank"
                >
                  GPS轨迹
                </Link>
              </Divider>
              <LocusMap
                height={autoheight1*0.65}
                params={locusparam}
                SelectDate={selectDate1}
                isselect={this.isselect}
                closeselect={this.cancelselect()}
                isorder={true}
              />
            </div>
          </div>
          <div style={rigdiv_right}>
            <div style={rigdiv_right_above}>
              <FlowPhotos orderId={orderId} />
            </div>
            <div style={rigdiv_right_below}>
              <Divider orientation="left" style={{margin: '0 0 0 0'}}><b>重量速度曲线图</b></Divider>
              <Weightchange
                height={autoheight1*0.4}
                deviceno={this.deviceno}
                selparams={locusparam}
                SelectDate={selectweightDate}
                htmltype="orderinfo"
                isselect={this.isselect1}
              />
            </div>
          </div>
        </div>
        <Drawer
          title="照片详情"
          placement="left"
          onClose={this.onClose}
          visible={photovisible}
          width='800px'
          maskStyle={{background: 'rgba(0, 0, 0, 0.05)'}}
        >
          <FlowPhoto drawerpic={drawerpic} />
        </Drawer>
      </div>
    );
  }
}
export default FloworderInfo;
