import React, { PureComponent } from 'react';
import { List , SearchBar } from 'antd-mobile';
import {Card,} from  'antd'
import { getTenantList, } from '../../../services/api';

const {Item} = List;

class ChooseTenant extends PureComponent {

  constructor(props) {
    super(props);

    this.state = {
      realdata: [],
      tenantName:''
    };

  /*  const that = this
  this.amapEvents = {
      created: (mapInstance) => {
        this.mapInstance = mapInstance;
        mapInstance.plugin(['AMap.Geocoder'],() => {
          this.geocoder = new window.AMap.Geocoder()
        })
        mapInstance.plugin('AMap.Geolocation', function() {
          const geolocation = new window.AMap.Geolocation({
            enableHighAccuracy: true, // 是否使用高精度定位，默认:true
            buttonOffset: new window.AMap.Pixel(10, 20), // 定位按钮与设置的停靠位置的偏移量，默认：Pixel(10, 20)
            zoomToAccuracy: true, // 定位成功后调整地图视野范围使定位位置及精度范围视野内可见，默认：false
            buttonPosition: 'RB',
            useNative:true,
          });
          // mapInstance.addControl(geolocation);
          geolocation.getCurrentPosition()
          new window.AMap.event.addListener(geolocation, 'complete', (result) => {
            if(result.position.getLng()){
              requestListApi('/api/mer-user/client/accordingDistanceObtainArea',{longitude:result.position.getLng(),latitude:result.position.getLat()}).then(resp=>{
                if(resp.success){
                  that.setState({
                    locateTenantName:resp.data.deptName
                  })
                  // console.log(form.getFieldValue('shipperTenantId'),form.getFieldValue('shipperTenantId') !== 'login','====')
                  if(form.getFieldValue('shipperTenantId') === 'login'){
                    form.setFieldsValue({
                      shipperTenantId:resp.data.tenantId,
                      shipperTenantName:resp.data.deptName
                    })
                  }

                }
              })
            }
          })
        });
      }
    };
*/
  }

  componentDidMount() {
    this.getData()
  }

  getData() {
    const { tenantName} = this.state;
    getTenantList({tenantName}).then(resp => {
      const tempdata = resp.data
      this.setState({
        realdata:tempdata
      })
    });
  }

  bringData=(rowData)=>{
    const {handleOkBefore,form} = this.props

    if(typeof handleOkBefore === 'function'){
      handleOkBefore(rowData,)
    }
    form.setFieldsValue({
      shipperTenantId:rowData.tenantId,
      shipperTenantName:rowData.tenantName
    })
  }

  queryTenantByName = (no) => {
    this.setState({
      tenantName: no,
    }, () => {
      this.getData(true, {});
    });
  };

  queryTenantCancel = () => {
    this.setState({
      tenantName:'',
    }, () => {
      this.getData();
    });
  };

  render() {
    const {realdata} = this.state
    const {form} = this.props

    return (
      <div>
        <SearchBar
          showCancelButton={false}
          maxLength={8}
          placeholder="请输入厂区名称查询"
          onChange={(e) => this.queryTenantByName(e)}
          onClear={() => this.queryTenantCancel()}
          style={{padding:'0px'}}
        />
        <div style={{textAlign:'left',}}>
          <Card bordered={false} ><span style={{fontWeight:'bold',color:'black'}}>已选厂区：{form.getFieldValue('shipperTenantName')}</span></Card>
          <div style={{padding: '10px 15px'}}>
            {/* <span style={{fontWeight:'bold'}}>定位：</span>
            <div style={{margin:'5px 0px'}}>
              <Tag data-seed="logId"><span style={{color:'black'}}><Icon type="environment" theme="twoTone" /> {locateTenantName}</span></Tag>
            </div> */}
          </div>
        </div>
        <div>
          {
            realdata.map(item =>
              <Item style={{borderTop:'1px solid rgb(236, 236, 237)'}} onClick={() => this.bringData(item)}>{item.tenantName}</Item>
            )
          }
        </div>
        {/* <Map events={this.amapEvents} /> */}
      </div>
    )
  }

}
export default ChooseTenant
