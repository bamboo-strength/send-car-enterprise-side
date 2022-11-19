import React, { PureComponent } from 'react';
import { Popconfirm, Spin, Icon,Switch, Drawer, Cascader,notification, Input } from 'antd';
import { Map,MouseTool } from 'react-amap';
import { Toast } from 'antd-mobile';


const key = "c6491852af21b06d5c821ca2b5213e6b";

const layerStyle = {
  padding: '10px',
  background: '#fff',
  border: '1px solid #ddd',
  borderRadius: '4px',
  position: 'absolute',
  top: '10px',
  right: '10px',
};

const editStyle = {
  padding: '10px',
  position: 'absolute',
  bottom: '10px',
  right: '10px',
};

const ssStyle = {
  height: 450,
  width: '100%'
}

const iconFontStyle = {
  marginRight: '15px',
  fontSize: '20px'
}

export default class MapApp extends PureComponent {
  constructor() {
    super();
    const self =this;
    this.state = {
      loading: true,
      title:'',
      what: '点击按钮开始绘制',
      mapCenter:{
        longitude: '',
        latitude: '',
      },
      visible: false,
      popVisible: false,
      condition: true,
      address: '',
      city: '',
      province:'',
      gpsInfo:[],
      checked: false,
      drawerVisible: false,
      treeNode: [],
      cascaderArray: [],
      circleArr:[],
      polygonArr:[],
      circleEditorArr:[],
      polygonEditorArr:[],
      tip: '地图正在加载中......',
    }
    this.toolEvents = {
      created: (tool) => {
        self.tool = tool;
      },
      draw({obj}) {
        self.drawWhat(obj);
      }
    }
    this.mapEvents = {
      created: (mapInstance) =>{
        self.mapInstance=mapInstance;
         mapInstance.getCity( (result) => {
           this.setState({
             address: `当前城市：${result.province+result.city+result.district} 城市编码：${result.citycode} 当前定位坐标位置点：${mapInstance.getCenter().lng},${mapInstance.getCenter().lat}`,
             city:result.city,
             province:result.province,
           })
         });
        mapInstance.plugin(["AMap.ToolBar"],() => {   // 在地图中添加ToolBar插件
          this.toolBar = new AMap.ToolBar();
          mapInstance.addControl(this.toolBar);
        });
        mapInstance.plugin(['AMap.Geocoder'],() => {
          this.geocoder = new window.AMap.Geocoder()
        })

        mapInstance.plugin(["AMap.Scale"],()=>{    // 加载比例尺插件
          this.scale = new window.AMap.Scale();
          mapInstance.addControl(this.scale);
        });
        mapInstance.plugin(['AMap.PlaceSearch'],() => {
          this.place = new window.AMap.PlaceSearch({
            map: mapInstance,
          });
        })

        mapInstance.plugin(['AMap.Autocomplete'],() => {
          this.autocomp = new window.AMap.Autocomplete({
            input: "tipinput"
          });
          new window.AMap.event.addListener(this.autocomp, "select", this.selecttest);
        })

        // 初始化行政区划级联菜单
        this.mapInstance.plugin(["AMap.DistrictSearch"], this.constructorDistrictSearch);

        const { info } = this.props;
        // 编辑时未划区域时不显示编辑
        if(info !== undefined && ((info.gps!==undefined && info.gps !== "") || (info.fenceType === "0" && info.x !== "" && info.y !== ""))) {
          this.setState({
            loading: false,
            mapCenter:{
              longitude: mapInstance.getCenter().lng,
              latitude: mapInstance.getCenter().lat,
            },
            gpsInfo:{
              fenceType: `${info.fenceType}`,
              fenceTypeName: `${info.fenceTypeName}`,
              addr: `${info.addr}`,
              x: `${info.x}`,
              y: `${info.y}`,
              radius: `${info.radius}`,
              gps:`${info.gps}`,
            },
          })
          this.switchChange(true);
          if(info.fenceType === '2'){
            const arr=info.addr.split(',').map(function(value) {
              return value;
            });
            this.setState({
              cascaderArray: arr,
            })
            this.cascaderonChange(arr);
          }
        }else {
          this.setState({
            loading: false,
            mapCenter:{
              longitude: mapInstance.getCenter().lng,
              latitude: mapInstance.getCenter().lat,
            },
          })
        }

      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const { color } = nextProps;
    if (color !== this.props.color){
      this.switchChange(true);
    }
  }

  selecttest = (e) =>{
    console.log(e)
    this.place.setCity(e.poi.adcode);
    this.place.search(e.poi.name);  // 关键字查询查询
  }

  geocoderPromise = (arrays) => {
    let text = '';
    if(this.geocoder){
      return new Promise(() => {
        this.geocoder.getAddress(arrays, (status, result) => {
          if (status === 'complete' && result.info === 'OK') {
            text = `你绘制了一个圆形，圆心位置在${result.regeocode.formattedAddress}附近`;
          }
          this.setState({
            what: text
          });
        });

      });
    }
  }

  // 绘图工具使用
  drawWhat = (obj) =>
  {
    const { getPoint } = this.props;
    let text = '';
    let gpsInfoList=[];
    if(this.state.gpsInfo.gps !== "" ||this.state.gpsInfo.x !=="" ){
        gpsInfoList  = this.state.gpsInfo;
    }
    switch(obj.CLASS_NAME) {
      case 'AMap.Marker':
        text = `你绘制了一个标记，坐标位置是 {${obj.getPosition().getLng()}}`;
        getPoint(`${obj.getPosition().getLng()},${obj.getPosition().getLat()}`);
        break;
      case 'AMap.Polygon':
        text = `你绘制了一个多边形，共计${obj.getPath().length}个端点`;

        const polygonData = {
          fenceType: '1',
          fenceTypeName: '多边形围栏',
          addr: '',
          x: '',
          y: '',
          radius: '',
          gps: `${obj}`,
        }
        gpsInfoList.push(polygonData);
        this.setState({
            gpsInfo: gpsInfoList
          })
        getPoint(this.state);
        break;
      case 'AMap.Circle':
        text = `你绘制了一个圆形，圆心位置为{${obj.getCenter()}}`;
        this.geocoderPromise([obj.getCenter().getLng(),obj.getCenter().getLat()]);
        const circleData = {
            fenceType: '0',
            fenceTypeName: '圆形围栏',
            addr: '',
            x: `${obj.getCenter().getLng()}`,
            y: `${obj.getCenter().getLat()}`,
            radius: `${obj.getRadius()}`,
            gps:'',
        }
        gpsInfoList.push(circleData)
        this.setState({
        address: `当前定位坐标位置点：${obj.getCenter().getLng()},${obj.getCenter().getLat()}`,
        mapCenter: {
          longitude: `${obj.getCenter().getLng()}`,
          latitude: `${obj.getCenter().getLat()}`,
        },
        gpsInfo:gpsInfoList

      })
        getPoint(this.state);
        break;
      default:
        text = '';
    }
    this.tool.close();// 只允许创建一次
  }

  drawCircle = () =>
  {
    const { color } = this.props;
    if(this.tool){
      /* if(Object.keys(this.mapInstance.getAllOverlays('polygon')).length>0 || Object.keys(this.mapInstance.getAllOverlays('circle')).length>0){
        Toast.info('先清除已完成电子围栏后，再绘制新的电子围栏')
        return;
      } */
      this.tool.circle({fillColor: `${color}`,strokeColor: `${color}`,});
      this.setState({
        what: '准备绘制圆形'
      });
    }
  }

   drawRectangle = () =>
   {
     const { color } = this.props;
     if(this.tool){
       if(Object.keys(this.mapInstance.getAllOverlays('polygon')).length>0 || Object.keys(this.mapInstance.getAllOverlays('circle')).length>0){
        Toast.info('先清除已完成电子围栏后，再绘制新的电子围栏')
       return;
      }
      this.tool.rectangle({fillColor: `${color}`});
       this.setState({
        what: '准备绘制多边形（矩形）'
      });

    }
   }

  // drawMarker = () =>
  // {
  //   if (this.tool){
  //     this.tool.marker();
  //     this.setState({
  //       what: '准备绘制坐标点'
  //     });
  //   }
  // }

  drawPolygon = () =>
  {
    const { color } = this.props;
    if (this.tool) {
     /* if(Object.keys(this.mapInstance.getAllOverlays('polygon')).length>0 || Object.keys(this.mapInstance.getAllOverlays('circle')).length>0){
        Toast.info('先清除已完成电子围栏后，再绘制新的电子围栏')
        return;
      } */
      this.tool.polygon({fillColor: `${color}`});
      this.setState({
        what: '准备绘制多边形'
      });
    }
  }

  close = () =>
  {
    if (this.tool){
      if(Object.keys(this.mapInstance.getAllOverlays('polygon')).length>0 || Object.keys(this.mapInstance.getAllOverlays('circle')).length>0){
        this.closeCircleEditor();
        this.closePolygonEditor();
        this.setState({
          popVisible: true,
          condition: false,
          title: '是否放弃已绘制围栏！',
        });
        // console.log('是否放弃已绘制围栏');
      }else {
        // console.log('无围栏数据了');
        this.setState({
          popVisible: false,
          condition: true,
          title: 'Are you sure closed this task?',
        })
        Toast.fail('无围栏数据无法清除，请设置电子围栏后进行清除！')
      }
    }

  }

  // 气泡工具使用
  confirm = () => {
    // const {mapCenter} =this.state;
    const { getPoint } = this.props;
    this.setState({
      popVisible: false,
      condition: true,
      what: '关闭了鼠标工具',
      title: '是否放弃已绘制围栏！',
      checked: false,
      gpsInfo: {
        fenceType: '',
        fenceTypeName: '',
        addr: '',
        x: '',
        y: '',
        radius: '',
        gps:'',
      },
      loading: false,
    },function() {
      getPoint('');
    })
    this.tool.close();
    this.mapInstance.remove(this.mapInstance.getAllOverlays());
    // const cp = new window.AMap.LngLat(mapCenter.longitude, mapCenter.latitude);
    // this.mapInstance.setCenter(cp); // 设置地图中心点
    // this.mapInstance.setZoom(13);
    Toast.success('清除围栏数据成功，请重新绘制');
  }

  cancel = () => {
    this.setState({
      popVisible: false,
      condition: true
    })
    Toast.fail('取消清除围栏数据指令')
  }

  handleVisibleChange = popVisible =>{
    const {condition} = this.state;
    if (!popVisible) {
      this.setState({ popVisible });
      return;
    }
    // Determining condition before show the popconfirm.
    if (condition) {
      this.confirm(); // next step
    } else {
      this.setState({ popVisible: true }); // show the popconfirm
    }
  }

  // Switch使用
  switchChange = (checked) =>{
    const { gpsInfo } = this.state;
    // 打开电子围栏编辑器
    if(checked){
      if(gpsInfo.fenceType === '0'){ // 打开圆形围栏编辑器
        Toast.info('已创建圆形电子围栏编辑器，请进行编辑，编辑完成后点击关闭编辑器完成围栏设置');
        this.setState({
          checked: true,
        });
        this.openCircleEditor();
        return;
      }
      if(gpsInfo.fenceType === '1'){ // 打开多边形及圆形围栏编辑器
        Toast.info('已创建多边形电子围栏编辑器，请进行编辑，编辑完成后点击关闭编辑器完成围栏设置');
        this.setState({
          checked: true,
        });
        this.openCircleEditor();
        // this.openPolygonEditor();
        return;
      }
      if(gpsInfo.fenceType === '2'){// 打开自定义围栏编辑器
        Toast.info('已创建自定义电子围栏编辑器，请进行编辑');
        this.showDrawer();
          this.setState({
            checked: true,
          })

      }else{
        this.setState({
          checked: true,
        });
        this.openCircleEditor();
    }
      // Toast.fail('先清除已完成电子围栏后，再绘制新的电子围栏')
    }
    // 关闭电子围栏开关编辑器
    else{
      if(gpsInfo.fenceType === '2'){
        Toast.info('已关闭自定义围栏编辑器！');
        this.setState({
          checked: false,
        });

      }else{
        this.setState({
        checked: false,
      });
        this.closeCircleEditor();
        this.closePolygonEditor();

      }
      // Toast.fail('未创建电子围栏，无法进行关闭')
    }
  }

  // 圆形电子围栏编辑器
  getcircleEditorData = (event) => {
    const { getPoint } = this.props;
    const gpsInfoList  = this.state.gpsInfo;
    // Toast.info(`关闭圆形围栏编辑器`);
    if(this.mapInstance.getAllOverlays().length >0 ){
      this.geocoderPromise([event.target.getCenter().getLng(),event.target.getCenter().getLat()]);

      const circleData  =  {
        fenceType: '0',
        fenceTypeName: '圆形围栏',
        addr: '',
        x: `${event.target.getCenter().getLng()}`,
        y: `${event.target.getCenter().getLat()}`,
        radius: `${event.target.getRadius()}`,
        gps:'',
      }
      gpsInfoList.push(circleData);
      this.setState({
        address: `当前定位坐标位置点：${event.target.getCenter().getLng()},${event.target.getCenter().getLat()}`,
        mapCenter:{
          longitude: `${event.target.getCenter().getLng()}`,
          latitude: `${event.target.getCenter().getLat()}`,
        },
        gpsInfo: gpsInfoList,
      },function() {
        getPoint(this.state);
      })
    }
  }

  openCircleEditor = () => {
    if(this.state.circleArr.length ==0 && this.state.polygonArr.length==0 ){
      const { color } = this.props;
      const { gpsInfo} = this.state;
      let arr=[];
      const circleArr=[];
      const polygonArr=[];
      if(this.mapInstance) {
        this.mapInstance.remove(this.mapInstance.getAllOverlays()); // 清除原图形
        if (gpsInfo.length > 0) {// 关闭编辑后再次编辑
          for (let i = 0; i < gpsInfo.length; i++) {
            if (gpsInfo[i].x && gpsInfo[i].y && gpsInfo[i].radius) {// 圆形
              this.makeCircle(gpsInfo[i].x, gpsInfo[i].y, gpsInfo[i].radius, circleArr);
            } else {// 多边形
              const arr1 = [];
              if (gpsInfo[i].gps.includes(";")) {
                arr = gpsInfo[i].gps.split(';').map(function(values) {
                  if (values.includes(",")) {
                    const lng = values.split(',')[0];
                    const lat = values.split(',')[1];
                    if (lng && lat) {
                      arr1.push(new window.AMap.LngLat(lng, lat));
                    }
                  }
                });
              }
              this.makePolygon(arr1, polygonArr);
            }
          }
        } else {
          gpsInfo.gps.split("|").map((a) => {
            if (a.includes(";")) {
              const arr1 = [];
              arr = a.split(';').map(function(values) {
                if (values.includes(",")) {
                  const lng = values.split(',')[0];
                  const lat = values.split(',')[1];
                  if (lng && lat) {
                    arr1.push(new window.AMap.LngLat(lng, lat));
                  }
                } else if (values && values.includes("-")) {
                    const lng = values.split('-')[0];
                    const lat = values.split('-')[1];
                    const radius = values.split('-')[2];
                    this.makeCircle(lng, lat, radius, circleArr);
                  }
              });
              this.makePolygon(arr1, polygonArr);

            } else if (a && a.includes("-")) {
                const lng = a.split('-')[0];
                const lat = a.split('-')[1];
                const radius = a.split('-')[2];
                this.makeCircle(lng, lat, radius, circleArr);
              } else if (gpsInfo.x && gpsInfo.y) {
                  this.makeCircle(gpsInfo.x, gpsInfo.y, gpsInfo.radius, circleArr);
                }
            return a;
          })
        }
        this.setState({
          circleArr,
          polygonArr
        })
      }
    }
          this.mapInstance.plugin(["AMap.PolyEditor"],this.constructorPolygonEditor);
          this.mapInstance.plugin(["AMap.CircleEditor"],this.constructorCircleEditor);
          this.setState({
            gpsInfo: []
          })


  }

  makeCircle= (lng,lat,radius,circleArr) =>{
    const { color } = this.props;
    const cp = new window.AMap.LngLat(lng, lat);
    const address = `中心点坐标位置：${lng},${lat}`;
    const marker= new window.AMap.Marker({
      position: cp,
      animation: 'AMAP_ANIMATION_BOUNCE',
      title: address
    });
    const circle = new window.AMap.Circle({// 历史数据
      center: cp, // 圆心位置
      radius,  // 半径
      strokeColor: color,  // 线颜色
      fillColor: color,  // 填充颜色
      fillOpacity: 0.35 // 填充透明度
    });
    this.mapInstance.setCenter(cp); // 设置地图中心点
    this.mapInstance.add(marker);
    this.mapInstance.add(circle);
    this.mapInstance.setFitView([circle]);
    circleArr.push(circle);
  }

  makePolygon= (arr1,polygonArr) =>{
    const { color } = this.props;
    const polygon =new window.AMap.Polygon({
      path: arr1,
      strokeColor: colour,
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: colour,
    });

    this.mapInstance.add(polygon);
    this.mapInstance.setFitView([polygon]);
    polygonArr.push(polygon);
  }

  constructorCircleEditor = () =>{
      const {circleArr} = this.state;
      const circleEditorArr =[];
      let circleEditor ={};
      for(let i=0;i<circleArr.length;i++){
      circleEditor= new window.AMap.CircleEditor(this.mapInstance,circleArr[i]);
      circleEditor.open();
      circleEditor.on('move', this.getcircleMoveData);
      circleEditor.on('end', this.getcircleEditorData);
      circleEditorArr.push(circleEditor);
    }
     this.setState({
      circleEditorArr
  })
  }

  getcircleMoveData = (event) =>{
    this.geocoderPromise([event.target.getCenter().getLng(),event.target.getCenter().getLat()]);
  }

  closeCircleEditor = () => {
     const {circleEditorArr} = this.state;
     circleEditorArr.map((a) =>{
       if(a){
         a.close()
       }
    })
  }

  // 多边形电子围栏编辑器
  openPolygonEditor = () => {
    const { color } = this.props;
    const { gpsInfo } = this.state;
    const { gps } = gpsInfo;
    this.mapInstance.remove(this.mapInstance.getAllOverlays()); // 清除原图形
    // const arr = gps.split(';').map(function(values) {
     // return new window.AMap.LngLat(values.split(',')[0],values.split(',')[1])
    // });
    let arr=[];
    const arr1=[];
    gps.split("|").map((a) =>{
      arr=a.split(';').filter(function(obj) {
        return obj !== '';
      }).map(function(values) {
        if(values.includes(",")) {
          const lng = values.split(',')[0];
          const lat = values.split(',')[1];
          if(lng&&lat){
            arr1.push( new window.AMap.LngLat(lng, lat));

          }
        }
      });
      return a;
    })

    const polygon =new window.AMap.Polygon({
      path: arr1,
      strokeColor: color,
      strokeWeight: 6,
      strokeOpacity: 0.2,
      fillOpacity: 0.4,
      fillColor: color,
    });
    this.mapInstance.add(polygon);
    this.polygonx=polygon;
    this.mapInstance.setFitView([polygon]);
    this.mapInstance.plugin(["AMap.PolyEditor"],this.constructorPolygonEditor);

  }

  constructorPolygonEditor = () => {
    const {polygonArr} = this.state;
    const polygonEditorArr =[];
    let polygonEditor ={};
    for(let i=0;i<polygonArr.length;i++){
      polygonEditor= new window.AMap.PolyEditor(this.mapInstance,polygonArr[i]);
      polygonEditor.open();
      polygonEditor.on('end', this.getPolygonEditorData);
      polygonEditorArr.push(polygonEditor);
    }
    this.setState({
      polygonEditorArr,
    })
  }


  closePolygonEditor = () => {
    /* if(this.polyEditor) {
      this.polyEditor.close()
    } */
    const {polygonEditorArr} = this.state;
    polygonEditorArr.map((a) =>{
      if(a){
        a.close()
      }
    })
  }

  getPolygonEditorData = (event) => {
    const { getPoint } = this.props;
    const gpsInfoList  = this.state.gpsInfo;
    // Toast.info(`关闭多边形围栏编辑器`);
    const { target } = event;
    const polygonData = {
      fenceType: '1',
      fenceTypeName: '多边形围栏',
      addr: '',
      x: '',
      y: '',
      radius: '',
      gps: `${target}`,
    }
    gpsInfoList.push(polygonData);
    this.setState({
      gpsInfo: gpsInfoList
    }, function() {
      getPoint(this.state);
    })

  }

  // 抽屉组件
  showDrawer = () => {
    this.setState({
      drawerVisible: true,
    });
    // 初始化行政区划级联菜单
    // this.mapInstance.plugin(["AMap.DistrictSearch"], this.constructorDistrictSearch);
  };

  constructorDistrictSearch = () => {
    const districtSearch = new window.AMap.DistrictSearch({
      level: 'country',
      showbiz: false,
      subdistrict: 3
    });
    districtSearch.search('中国',this.createData)
  }

  createData = (status, result) => {
    if(status === 'complete'){
      const { districtList } = result;
      // console.log("values",districtList[0].districtList)
      const tree = districtList[0].districtList.map(function(values) {
        // 从省一级开始显示省市区信息
        if(values.districtList === undefined){
          return {
            label : values.name,
            value : values.adcode,
          };
        }
        const { name,adcode } = values;
        return {
          label : name,
          value : adcode,
          children : values.districtList.map(function(provinceValues) {
            if(provinceValues.districtList === undefined){
              return {
                label : provinceValues.name,
                value : provinceValues.adcode,
              }
            }
            return {
              label : provinceValues.name,
              value : provinceValues.adcode,
              children : provinceValues.districtList.map(function(cityValues) {
                if(cityValues.districtList === undefined){
                  return {
                    label : cityValues.name,
                    value : cityValues.adcode,
                  }
                }
                return {
                  label : cityValues.name,
                  value : cityValues.adcode,
                  children : cityValues.districtList.map(function(districtValue) {
                    return {
                      label : districtValue.name,
                      value : districtValue.adcode,
                    }
                  }),
                }
              }),
            }
          }),
        }
        // 从国家一级开始显示省市区信息
        // const { name } = values;
        // const m={
        //   label : name,
        //   value : name,
        //   children : values.districtList.map(function(provinceValues) {
        //     if(provinceValues.districtList === undefined){
        //       return {
        //         label : provinceValues.name,
        //         value : provinceValues.name,
        //       }
        //     }
        //     return {
        //       label : provinceValues.name,
        //       value : provinceValues.name,
        //       children : provinceValues.districtList.map(function(cityValues) {
        //         if(cityValues.districtList === undefined){
        //           return {
        //             label : cityValues.name,
        //             value : cityValues.name,
        //           }
        //         }
        //         return {
        //           label : cityValues.name,
        //           value : cityValues.name,
        //           children : cityValues.districtList.map(function(districtValue) {
        //             return {
        //               label : districtValue.name,
        //               value : districtValue.name,
        //             }
        //           }),
        //         }
        //       }),
        //     }
        //   }),
        //
        // };
        // return m;
      });
      // console.log("tree",tree)
      this.setState({
        treeNode : tree,
      })
    }
 }

  drawerClose = () => {
    this.setState({
      drawerVisible: false,
    });
  };

  cascaderonChange = value => {
    // const { mapCenter } = this.state;
    if(value.length>0){
      this.serachCity = value[value.length-1];
      this.mapInstance.plugin(["AMap.DistrictSearch"],this.constructorCitySearch);
      this.setState({
        gpsInfo:{
          fenceType: '2',
          fenceTypeName: '自定义围栏',
          addr: `${value}`,
          x: '',
          y: '',
          radius: '',
          gps: '',
        },
        loading:true,
        tip: '一大波数据正在渲染中，请耐心等待......'
      })
    }else {
      this.confirm();
      // const cp = new window.AMap.LngLat(mapCenter.longitude, mapCenter.latitude);
      // this.mapInstance.setCenter(cp); // 设置地图中心点
      this.mapInstance.setZoom(13);
    }
  }

  constructorCitySearch  = () => {
    const districtSearch = new window.AMap.DistrictSearch({
      level: 'city',
      subdistrict: 0,
      extensions: 'all',
    });
    districtSearch.search(this.serachCity,this.getDistrictGps);
  }

  getDistrictGps = (status, result) => {
    const { color, getPoint } = this.props;
    const { gpsInfo } = this.state;
    if(status === 'complete'){
      this.mapInstance.remove(this.mapInstance.getAllOverlays());
      const { districtList } = result;
      // console.log('districtList',districtList)
      const arr = districtList[0].boundaries;
      if(arr.length === 0){
        notification.error({
          message: '高德滴地图未获取到相关坐标位置！',
          description: `高德地图未获取到${districtList[0].name}地区坐标数据，请登录高德地图进行反馈，感谢你的使用！`,
        });
        this.confirm();
      } else {
        const polygon =new window.AMap.Polygon({
          path: arr,
          strokeColor: color,
          strokeWeight: 6,
          strokeOpacity: 0.2,
          fillOpacity: 0.4,
          fillColor: color,
        });
        this.mapInstance.add(polygon);
        this.mapInstance.setFitView([polygon]);

        let returnData ='';
        arr.forEach(function(value) {
          value.forEach(function(points) {
            const {lng, lat} = points;
            returnData += `${lng},${lat};`;
          });
        });
        this.setState({
          gpsInfo:[{
            fenceType: '2',
            fenceTypeName: '自定义围栏',
            addr: `${ gpsInfo.addr}`,
            x: '',
            y: '',
            radius: '',
            gps: `${returnData}`,
          }],
          loading:false,
        }, function() {
          // const { gpsInfo } = this.state;
          // console.log(gpsInfo)
          getPoint(this.state);
        })
      }
    }
  }

  cascaderFilter= (inputValue, path) => {
    return path.some(option => option.label.toLowerCase().indexOf(inputValue.toLowerCase()) > -1);
  }

  render() {
    const { mapCenter, what, title, popVisible, loading, address, checked, drawerVisible, treeNode, cascaderArray, tip} = this.state;
    const IconFont = Icon.createFromIconfontCN({
      scriptUrl: '//at.alicdn.com/t/font_1385996_bf62yrymg2p.js',
    });

    return <div>
      <Spin spinning={loading} size="large" tip={tip}>
        <Input
          placeholder="请输入关键字:(选定后搜索)"
          style={{ width: 400,marginBottom: '10px' }}
          id="tipinput"
          addonBefore="地点搜索:"
          allowClear
        />
        <div style={ssStyle}>
          <Map
            events={this.mapEvents}
            // plugins={["ToolBar", 'Scale']}
            // center={mapCenter}
            amapkey={key}
            zoom={13}
          >
            <MouseTool events={this.toolEvents} />
            {/* <Marker position={mapCenter} animation="AMAP_ANIMATION_BOUNCE" title={address} /> */}
            <div style={layerStyle}>{what}
              {/* <IconFont type="icon-juxingxuanze" onClick={this.drawRectangle} title='绘制矩形围栏' style={iconFontStyle} /> */}
              <IconFont type="icon-dianziweilan" onClick={this.drawCircle} title='绘制圆形围栏' style={iconFontStyle} />
              <IconFont type="icon-icon-dianjiduobianxing" onClick={this.drawPolygon} title='绘制多边形围栏' style={iconFontStyle} />
              <IconFont type="icon-quyuguanli" onClick={this.showDrawer} title='绘制区域围栏' style={iconFontStyle} />
              <Drawer
                title="绘制行政区域电子围栏"
                placement="bottom"
                closable={false}
                onClose={this.drawerClose}
                visible={drawerVisible}
                width={400}
              >
                选择所在行政区域：
                <Cascader
                  options={treeNode}
                  onChange={this.cascaderonChange}
                  changeOnSelect
                  placeholder="请选择您所在的行政区域"
                  size="large"
                  expandTrigger="hover"
                  showSearch={this.cascaderFilter}
                  style={{ width: '500px'}}
                  defaultValue={cascaderArray}
                />
              </Drawer>
              <Popconfirm
                title={title}
                visible={popVisible}
                onVisibleChange={this.handleVisibleChange(popVisible)}
                onConfirm={this.confirm}
                onCancel={this.cancel}
                okText="确定"
                cancelText="取消"
              >
                <IconFont type="icon-qingchu" onClick={this.close} title='清除围栏' style={iconFontStyle} />
              </Popconfirm>
            </div>
            <div style={editStyle}>
              <Switch checkedChildren="打开编辑" unCheckedChildren="关闭编辑" onChange={this.switchChange} checked={checked} />
            </div>
          </Map>
        </div>
      </Spin>
    </div>
  }
}
