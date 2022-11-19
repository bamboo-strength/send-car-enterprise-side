import React, { PureComponent } from 'react';
import { Card, Icon, message } from 'antd';
import { Grid, List, Toast } from 'antd-mobile';
import styles from '@/layouts/Sword.less';
import { connect } from 'dva';
import router from 'umi/router';
import menu from './Menu.less';
import func from '@/utils/Func';
import { detail } from '@/services/qrCode';
import { orderTakeVerify, list, getShippingNoteInfos, saveNotify } from '@/services/FreightServices';
import {project} from '@/defaultSettings';

window["returntest"]=function(){
  return localStorage.getItem('deviceno')+','+localStorage.getItem('truckno')+','+localStorage.getItem('rememberPwd')
};

window.saveNotify = function(param){
  const params={
    waybillId:param.split(",")[0],
    vehicleno:param.split(",")[1],
    longitude:param.split(",")[2],
    latitude:param.split(",")[3],
    sdkflag:param.split(",")[4],
    flag:param.split(",")[5],
    intervalTime:param.split(",")[6],
    errorMsg:param.split(",")[7]
  }
  saveNotify(params)
  return 3;
}
class Freight extends PureComponent {
  constructor(props) {
    super(props);
    this.state={

    }
  }

  componentWillMount() {
    if(project==='wlhy'&&sessionStorage.getItem('timingstatus') === null) {
      list({ current: 1, size: 5, flag: 2, waybillStatus: 2 }).then(resp => {
        if (resp.data.total === 1) {
          sessionStorage.setItem('timingstatus', '1');
          localStorage.setItem('deviceno',resp.data.records[0].driverPhone);
          localStorage.setItem('truckno',resp.data.records[0].vehicleno);
          localStorage.setItem('waybillid',resp.data.records[0].id);

        }else{
          sessionStorage.setItem('timingstatus', '0');
        }
      }).then(()=>{
        if (sessionStorage.getItem('timingstatus') === '1') {
          getShippingNoteInfos({id:localStorage.getItem('waybillid')}).then((res)=>{
            if(res.success){
              const remark = res.data.remark
              delete res.data.remark
              TrajectoryMonitoring.restartMonitoring(JSON.stringify(res.data),remark)
            }
          })
          TimerTask.startTimerTask()
          sessionStorage.setItem('timingstatus', '0');
          Toast.success('轨迹记录已重新开启！')
        }
      })
    }
  }
  goPage = (path) => {
    if (path.alias === "network_qrcode_forFreight"){
      orderTakeVerify({type:4}).then((resp)=> {
        if (resp.success) {
        try {
          ERCode.scanErcode()
          window['content'] = (resp) => {
            detail({ id: resp }).then((res) => {
              router.push(
                {
                  pathname: `/network/waybill/qrcode`,
                  state: {
                    data: res.data,
                  },
                },
              );
            })
          };
        } catch (e) {
          console.log('浏览器不支持扫码接单')
        }
      }
      })

    }else {
      router.push(path.url);
    }
  };

  render() {
    const { menuData } = this.props;
    const data = [];
    return (
      <div className={menu.mobileMenu}>
        <List className='static-list'>
          <h2 style={{ textAlign: 'center' }}>网络货运功能</h2>
        </List>
        {
          menuData.map((item, key) => {
            if (item.alias.includes('forFreight')) {
              if (item.children) {
                item.children.map((sub, index) => {
                  const {icon} = sub;
                  const color = '#4581f5';
                  data.push({
                    icon: <div style={{ background: color }} className='iconName'>{func.notEmpty(icon) && icon.indexOf('.png') !== -1 ? <img src={`https://fhf.dachebenteng.com/menuPics/${sub.icon}`} /> : <Icon type={icon || 'plus-circle'} style={{ fontSize: '28px' }} theme="twoTone" twoToneColor="white" />}</div>,
                    text: sub.name,
                    url: sub.path,
                    alias:sub.alias,
                  });
                });
              }
            }
          })
        }
        <Grid data={data} columnNum='3' onClick={(el) => this.goPage(el)} className={styles.gridData} />
      </div>
    );
  }
}

export default connect(({ menu: menuModel }) => ({
menuData: menuModel.menuData,
}))(props => (
  <Freight {...props} />
));

