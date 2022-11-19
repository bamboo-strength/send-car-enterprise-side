$(function(){
    getNowFormatDate();
    ajaxFun();
})
function ajaxFun(){
	var data=$('#minecode option:selected').val();
	$.ajax({
        type: "post",
        url: "/bigscreen/bigScreenInfo",
        data:{minecode: data},
        dataType: "json",
        async: false,
        success: function(data) {
        	console.log("data",data)
            showNum(data.truck.hd);
            clzsChart(data.truck);
            ddzsChart(data.order);
            GPSChart(data.gpsZTList);
            ZZChart(data.czZTList);
            WLChart(data.dzwlZTList);
            QYJChart(data.qyj);
            SKKPChart(data.skkp);
        }
    });
	setTimeout(ajaxFun, 30000);
}
//获取当前时间
function getNowFormatDate() {
    var date = new Date();
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var strDate = date.getDate();
    var Hour =  date.getHours();       // 获取当前小时数(0-23)
    var Minute =  date.getMinutes();     // 获取当前分钟数(0-59)
    var Second = date.getSeconds();     // 获取当前秒数(0-59)
    var show_day=new Array('星期日','星期一','星期二','星期三','星期四','星期五','星期六');
    var day=date.getDay();
    if (Hour<10) {
        Hour = "0" + Hour;
    }
    if (Minute <10) {
        Minute = "0" + Minute;
    }
    if (Second <10) {
        Second = "0" + Second;
    }
    if (month >= 1 && month <= 9) {
        month = "0" + month;
    }
    if (strDate >= 0 && strDate <= 9) {
        strDate = "0" + strDate;
    }
    var date = year + '年' + month +'月' + strDate+'日';
	var week=show_day[day];
    var HMS = Hour + ':' + Minute +':' + Second;
    $('.time').html(HMS);
    $('#date').html(date);
	$('#week').html(week);
    setTimeout(getNowFormatDate,1000);//每隔1秒重新调用一次该函数
}

const myChart1 = echarts.init(document.getElementById("clzs"));
const myChart2 = echarts.init(document.getElementById("ddzs"));
const myChart3 = echarts.init(document.getElementById("GPSTJ"));
const myChart4 = echarts.init(document.getElementById("ZZTJ"));
const myChart5 = echarts.init(document.getElementById("WLTJ"));
const myChart6 = echarts.init(document.getElementById("QYJTJ"));
const myChart7 = echarts.init(document.getElementById("SKKPTJ"));

// 车辆总数
let clzsChart = function(data) {
	var car = [{
        value: data.zs,
        name: '车辆总数'
    }, {
        value: data.zx,
        name: '在线车辆'
    },{
        value: data.lx,
        name: '离线车辆'
    }];
option = {
        title: {
            text: '安装车辆总数量统计',
            left: 'center',
            top: '0',
            textStyle: {
            	color: '#ffffff',
                rich: {
                    a: {
                        width:165,
                        height:20
                    }
                }
            },
            subtext: '（数据统计时间截止到：'+data.time+'）',
            subtextStyle: {
                color: '#ffffff',
                fontSize: 10
            },
            itemGap: 5
        },
        
        legend: {
            textStyle:{
                color:'#ffffff',
                fontSize:'14',
                rich:{
                    c:{
                        fontSize: '18',
                        color:'#3ffeea',
                        fontWeight: 'bold'
                    }
                }
            },
            orient:'vertical',
            left: '50%',
            top: '32%',
            data: ['车辆总数', '在线车辆', '离线车辆'],
            itemHeight:14,
            itemWidth:14,
            itemGap: 20,
            formatter:  function(name){
                var total = 0;
                var target;
                for (var i = 0, l = car.length; i < l; i++) {
                    total += car[i].value;
                    if (car[i].name === name) {
                        target = car[i].value;
                    }
                }
                return  name  + '{c| ' + target + '} 台'
            }
        },
        series: [{
            name: '',
            type: 'pie',
            center:['28%', '55%'],
            radius: ['0', '70%'],
            color: ['#1ab7d7', '#e35129'],
            startAngle: '90',
            label: {
                color: '#fff',
                position: 'inside',
                formatter: function(data){ return data.percent.toFixed(0)+"%";} ,
                align: 'right',
                fontWeight: 'bold'
            },
            clockwise: false,
            data: [{
                value: 1925,
                name: '在线车辆'
            }, {
                value: 325,
                name: '离线车辆'
            }]
        }, {
            name: '',
            type: 'pie',
            center:['28%', '55%'],
            radius: ['52%', '70%'],
            startAngle: '90',
            clockwise: false,
            label: {
                show: false
            },
            color: ['transparent','#152cdc'],
            data: [{
                value: 1925,
                name: '透明'
            },{
                value: 325,
                name: '车辆总数'
            }]
        }]
    };
  myChart1.setOption(option);
};
//订单总数
let ddzsChart = function(data) {
	var order = [{
        value: data.zs,
        name: '订单总数'
    }, {
        value: data.zc,
        name: '正常订单'
    },{
        value: data.yc,
        name: '异常订单'
    }];
  let option = {
        title: {
            text: "",
            subtext: "",
            left: "center",
            textStyle: {
                color: "#fff",
                fontSize: 14
            }
        },
        legend: [{
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            padding:[15,5],
            itemHeight:12,
            itemWidth:12
        },{
            orient:'vertical',
            top:'28%',
            left: '56%',
            textStyle:{
                color:'#ffffff',
                fontSize:'12'
            },
            data: ['订单总数', '正常订单', '异常订单'],
            formatter:  function(name){
                var total = 0;
                var target;
                for (var i = 0, l = order.length; i < l; i++) {
                    total += order[i].value;
                    if (order[i].name === name) {
                        target = order[i].value;
                    }
                }
                // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                return name + ' ' + target+' 单'
            },
            padding:[15,5],
            itemHeight:0,
            itemWidth:0,
            itemGap:20
        }],
        series: [{
            name: '',
            type: 'pie',
            center:['30%', '50%'],
            radius: ['35%', '46%'],
            color: ['#1dc1d9', '#ea572f'],
            startAngle: '270',
            label: {
                show: false,
                color: '#fff',
                formatter: '{b} {c}单',
                align: 'right',
                labelLine: {
                    lineStyle: {
                        color:'#ffffff'
                    }
                }
            },
            data: [{
                value: 19500,
                name: '正常订单'
            }, {
                value: 1182,
                name: '异常订单'
            }]
        }, {
            name: '订单总数',
            type: 'pie',
            center:['30%', '50%'],
            radius: ['50%', '60%'],
            color: ['#0079f3'],
            label: {
                textStyle: {
                    color: '#ffffff',
                    fontWeight: '80',
                    fontSize: 14,
                    fontFamily: 'Microsoft YaHei'
                },
                position: 'center',
                formatter: '订单总数'
            },
            data: [{
                value: 19582,
                name: '订单总数'
            }]
        }]
    };
  myChart2.setOption(option);
};
//gps
let GPSChart = function(info) {
	var month=new Array();
	var zcdata=new Array();
	var ycdata=new Array();
	for(var i=0;i<info.length;i++){
		month.push(getMonth(info[i].yf.substr(5)));
		zcdata.push(info[i].gpszc);
		ycdata.push(info[i].gpsyc);
	}
  let option = {
        title: {
            text: '{a|}',
            left: '5%',
            top: '6%',
            textStyle: {
                rich: {
                    a: {
                        backgroundColor: {
                            image: '/bigScreen/images/is-gps-tit.png'
                        },
                        width:158,
                        height:16
                    }
                }
            }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
                crossStyle: {
                    color: "white"
                }
            }
        },
        legend: {
            data: ['异常', '正常'],
            // align: 'center',
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            top: '18%',
            itemHeight:10,
            itemWidth:25
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
                color:'#ffffff'
                // formatter: '{value}'
            },
            splitLine: {
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'#1d5eae'
                }
            },
            data: month
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                color:'#ffffff',
                formatter: '{value}'
            },
            splitLine: {
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'#1d5eae'
                }
            }
        }],
        series: [{
            name: '异常',
            type: 'bar',
            itemStyle: {
                color: '#ff6535'
            },
            barWidth: '12',
            barGap: 0,
            data: ycdata
        }, {
            name: '正常',
            type: 'bar',
            itemStyle: {
                color: '#0fa0b3'
            },
            barWidth: '12',
            barGap: 0,
            data: zcdata
        }]
    };
  myChart3.setOption(option);
};
// 载重
let ZZChart = function(info) {
	var month=new Array();
	var zcdata=new Array();
	var ycdata=new Array();
	for(var i=0;i<info.length;i++){
		//month.push(info[i].yf);
		month.push(getMonth(info[i].yf.substr(5)));
		zcdata.push(info[i].zzzc);
		ycdata.push(info[i].zzyc);
	}
  let option = {
        title: {
            text: '{a|}',
            left: '5%',
            top: '6%',
            textStyle: {
                rich: {
                    a: {
                        backgroundColor: {
                            image: '/bigScreen/images/is-weight-tit.png'
                        },
                        width:158,
                        height:16
                    }
                }
            }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
                crossStyle: {
                    color: "white"
                }
            }
        },
        legend: {
            data: ['异常', '正常'],
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            top: '18%',
            itemHeight:10,
            itemWidth:25
            // symbolKeepAspect:'false'
            // backgroundColor:'#f00'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'category',
            axisLabel: {
                color:'#ffffff'
                // formatter: '{value}'
            },
            boundaryGap: false,
            data: month,
            axisLine:{
                lineStyle:{
                    color:'#1d5eae'
                }
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1d5eae'
                }
            }
        },
        yAxis: {
            type: 'value',
            name: '',
            axisTick: {
                show: false
            },
            axisLine: {
                lineStyle: {
                    color: '#3f7fb2'
                }
            },
            axisLabel: {
                color:'#ffffff'
                // formatter: '{value}'
            },
            splitLine: {
                show: true,
                lineStyle: {
                    color: '#1d5eae'
                }
            }

        },
        series: [
            {
                name:'正常',
                type:'line',
                data:zcdata,
                symbolSize:10,
                itemStyle: {
                    normal: {
                        color: '#25c5da'
                    }
                }
            },
            {
                name:'异常',
                type:'line',
                data:ycdata,
                symbolSize:10,
                itemStyle: {
                    normal: {
                        color: '#ff6535'
                    }
                }
            }
        ]
    };
  myChart4.setOption(option);
};

// 围栏
let WLChart = function(info) {
	var month=new Array();
	var zcdata=new Array();
	var ycdata=new Array();
	for(var i=0;i<info.length;i++){
		//month.push(info[i].yf);
		month.push(getMonth(info[i].yf.substr(5)));
		zcdata.push(info[i].wlzc);
		ycdata.push(info[i].wlyc);
	}
  let option = {
        title: {
            text: '{a|}',
            left: '5%',
            top: '6%',
            textStyle: {
                rich: {
                    a: {
                        backgroundColor: {
                            image: '/bigScreen/images/is-area-tit.png'
                        },
                        width:158,
                        height:16
                    }
                }
            }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
                crossStyle: {
                    color: "white"
                }
            }
        },
        legend: {
            data: ['异常', '正常'],
            // align: 'center',
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            top: '18%',
            itemHeight:10,
            itemWidth:25
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: [{
            type: 'category',
            axisLabel: {
                color:'#ffffff'
                // formatter: '{value}'
            },
            splitLine: {
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'#1d5eae'
                }
            },
            data: month
        }],
        yAxis: [{
            type: 'value',
            name: '',
            axisLabel: {
                color:'#ffffff',
                formatter: '{value}'
            },
            splitLine: {
                show:false
            },
            axisLine:{
                lineStyle:{
                    color:'#1d5eae'
                }
            }
        }],
        series: [{
            name: '异常',
            type: 'bar',
            itemStyle: {
                color: '#cd3c0e'
            },
            barWidth: '12',
            barGap: 0,
            data: ycdata
        }, {
            name: '正常',
            type: 'bar',
            itemStyle: {
                color: '#0fa0b3'
            },
            barWidth: '12',
            barGap: 0,
            data: zcdata
        }]
    };
  myChart5.setOption(option);
};
// 区域价
let QYJChart = function(data) {
  let option = {
        color: [
            '#1aa1ff',
            '#31c17b',
            '#ff6535'
        ],
        title: {
            text: '{a|}',
            left: '5%',
            top: '6%',
            textStyle: {
                rich: {
                    a: {
                        backgroundColor: {
                            image: '/bigScreen/images/is-qyj-tit.png'
                        },
                        width:88,
                        height:16
                    }
                }
            }
        },
        tooltip: {
            trigger: "axis",
            axisPointer: {
                type: "cross",
                crossStyle: {
                    color: "white"
                }
            },
            formatter:function(params){
            	for(var i=0;i<params.length;i++){
            		console.log("params"+i,params[i])
            		if(params[i].name=="总订单"){
            			return params[i].name+" "+data.zdds+" 笔";
            		}else if(params[i].name=="区域价订单"){
            			return params[i].name+" "+data.qyjs+" 笔";
            		}else{
            			return params[i].name+" "+data.fqyj+" 笔";
            		}
            		
            	}
            }
        },
        legend: {
            data: ['总订单', '区域价订单', '非区域价订单'],
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            top: '5%',
            itemHeight:10,
            itemWidth:25
        },
        grid: {
            left: '12%',
            right: '4%',
            bottom: '18%',
			height:'60%',
            containLabel: false
        },
        xAxis : [
            {
                type: 'value',
                name: '',
                axisLabel: {
                    color:'#ffffff'
                    // formatter: '{value}'
                },
                splitLine: {
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'#1d5eae'
                    }
                }
            }
        ],
        yAxis : [
            {
                type: 'category',
                axisLabel: {
                    color:'#ffffff',
                    fontSize: '10'
                    // formatter: '{value}'
                },
                splitLine: {
                    show:false
                },
                axisLine:{
                    lineStyle:{
                        color:'#1d5eae'
                    }
                },
                data: ['总订单', '区域价订单', '非区域价订单']
            }
        ],
        series : [
            {
                name: '总订单',
                type: 'bar',
                stack:'订单',
                data: [data.zdds, 0, 0],
                barWidth: '10'
            },
            {
                name:'区域价订单',
                type:'bar',
                stack:'订单',
                data:[0, data.qyjs, 0]
            },
            {
                name:'非区域价订单',
                type:'bar',
                stack:'订单',
                data:[0, 0, data.fqyj]
            }
        ]
    };
  myChart6.setOption(option);
};
// 收款开票
let SKKPChart = function(info) {
  let option = {
        title: [{
            text: '{a|}',
            left: '5%',
            top: '6%',
            textStyle: {
                rich: {
                    a: {
                        backgroundColor: {
                            image: '/bigScreen/images/is-pay-tit.png'
                        },
                        width:244,
                        height:16
                    }
                }
            }
        }],
        legend: [{
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            orient:'vertical',
            left: '25%',
            top: '32%',
            data:['应收款','已收款','未收款'],
            itemHeight:12,
            itemWidth:12,
            formatter:  function(name){
                var total = 0;
                var target;
                var data =  [{
                    value: info.skzs,
                    name: '应收款'
                }, {
                    value: info.ysk,
                    name: '已收款'
                },{
                    value: info.wsk,
                    name: '未收款'
                }];
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name === name) {
                        target = data[i].value;
                    }
                }
                var arr = [
                    name + ' ' + target+' 笔'
                ];
                // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                return arr.join('\n')
            }
        },{
            textStyle:{
                color:'#ffffff',
                fontSize:'10'
            },
            orient:'vertical',
            left: '72%',
            top: '32%',
            data:['应开票', '已开票', '未开票'],
            itemHeight:12,
            itemWidth:12,
            formatter:  function(name){
                var total = 0;
                var target;
                var data =  [{
                    value: info.kpzs,
                    name: '应开票'
                }, {
                    value: info.ykp,
                    name: '已开票'
                },{
                    value: info.wkp,
                    name: '未开票'
                }];
                for (var i = 0, l = data.length; i < l; i++) {
                    total += data[i].value;
                    if (data[i].name === name) {
                        target = data[i].value;
                    }
                }
                // return name + ' ' + ((target/total)*100).toFixed(2) + '%';
                return name + ' ' + target+' 笔'
            }
            }],
        series : [
            {
                name: '',
                type: 'pie',
                center:['14%', '55%'],
                radius: ['42%', '62%'],
                color: ['#1ab7d7', '#f925ae'],
                startAngle: '90',
                label: {
                    show: false
                },
                clockwise: false,
                data: [{
                    value: info.ysk,
                    name: '已收款'
                }, {
                    value: info.wsk,
                    name: '未收款'
                }]
            }, {
                name: '',
                type: 'pie',
                center:['14%', '55%'],
                radius: ['54%', '62%'],
                startAngle: '90',
                clockwise: false,
                label: {
                    show: false
                },
                color: ['transparent','#264eec'],
                data: [{
                    value: 1925,
                    name: '透明'
                },{
                    value: 325,
                    name: '应收款'
                }]
            }, {
                name: '',
                type: 'pie',
                center:['14%', '55%'],
                radius: ['54%', '62%'],
                startAngle: '90',
                clockwise: false,
                label: {
                    textStyle: {
                        color: '#ffffff',
                        fontWeight: '80',
                        fontSize: 14,
                        fontFamily: 'Microsoft YaHei'
                    },
                    position: 'center',
                    formatter: '收款'
                },
                color: 'transparent',
                data: [{
                    name:'',
                    value:''
                }]
            },
            {
                name: '',
                type: 'pie',
                center:['60%', '55%'],
                radius: ['42%', '62%'],
                color: ['#eaac13', '#f925ae'],
                startAngle: '90',
                label: {
                    show: false
                    // normal: {
                    //     formatter: '',
                    //     position: 'center',
                    //     show: true,
                    //     textStyle: {
                    //         fontSize: '35',
                    //         fontWeight: 'normal',
                    //         color: '#3dd4de'
                    //     }
                    // }
                },
                clockwise: false,
                data: [{
                    value: info.ykp,
                    name: '已开票'
                }, {
                    value: info.wkp,
                    name: '未开票'
                }]
            }, {
                name: '',
                type: 'pie',
                center:['60%', '55%'],
                radius: ['54%', '62%'],
                startAngle: '90',
                clockwise: false,
                label: {
                    show: false,
                },
                color: ['#264eec', 'transparent'],
                data: [{
                    value: 14686,
                    name: '透明'
                },{
                    value: 4896,
                    name: '应开票'
                }
                ]
            },
            {
                name: '',
                type: 'pie',
                center:['60%', '55%'],
                radius: ['54%', '62%'],
                clockwise: false,
                label: {
                    textStyle: {
                        color: '#ffffff',
                        fontWeight: '80',
                        fontSize: 14,
                        fontFamily: 'Microsoft YaHei'
                    },
                    position: 'center',
                    formatter: '开具\n发票'
                },
                color: 'transparent',
                data: [{
                    name:'',
                    value:''
                }]
            }
        ]
    };
  myChart7.setOption(option);
};

//图例适应屏幕变化
let chartResize = function(){
  myChart1.resize();
  myChart2.resize();
  myChart3.resize();
  myChart4.resize();
  myChart5.resize();
  myChart6.resize();
  myChart7.resize();
}

/** 
 * 
 * 防抖动函数
 * 
 * */
function debounce(fn, delay) {
    let timer = null; 
    return function() {
      let context = this;
      let args = arguments;
      clearTimeout(timer);
      timer = setTimeout(function() {
        fn.apply(context, args);
      }, delay);
    }
  }


window.onresize = debounce(chartResize,500);


var gzl=new Array();
var obj1=new Object();
obj1.name="弋阳海螺";
obj1.minecode="101010";
obj1.value="3%";
gzl.push(obj1);

obj1=new Object();
obj1.name="建阳海螺";
obj1.minecode="101030";
obj1.value="1.8%";
gzl.push(obj1);

obj1=new Object();
obj1.name="信丰海螺";
obj1.minecode="101020";
obj1.value="2.7%";
gzl.push(obj1);

obj1=new Object();
obj1.name="潭东海螺";
obj1.minecode="101070";
obj1.value="3%";
gzl.push(obj1);

obj1=new Object();
obj1.name="龙南海螺";
obj1.minecode="101060";
obj1.value="2%";
gzl.push(obj1);

obj1=new Object();
obj1.name="南昌海螺";
obj1.minecode="101090";
obj1.value="5%";
gzl.push(obj1);

obj1=new Object();
obj1.name="进贤海螺";
obj1.minecode="101100";
obj1.value="4%";
gzl.push(obj1);

obj1=new Object();
obj1.name="赣江海螺";
obj1.minecode="101050";
obj1.value="1.9%";
gzl.push(obj1);

obj1=new Object();
obj1.name="庐山海螺";
obj1.minecode="101040";
obj1.value="1%";
gzl.push(obj1);

obj1=new Object();
obj1.name="分宜海螺";
obj1.minecode="101080";
obj1.value="1%";
gzl.push(obj1);

function getGzlArr(m){
	var gzlArr=new Array();
	var len=gzl.length-1;
	switch(m){
		case 0:
			gzlArr=gzl.slice(0,6);
			break;
		case 1:
			gzlArr=gzl.slice(1,7);
			break;
		case 2:
			gzlArr=gzl.slice(2,8);
			break;
		case 3:
			gzlArr=gzl.slice(3,9);
			//gzlArr=gzlArr.concat(gzl.slice(0,1));
			break;
		case 4:
			gzlArr=gzl.slice(4,9);
			gzlArr=gzlArr.concat(gzl.slice(0,1));
			break;
		case 5:
			gzlArr=gzl.slice(5,9);
			gzlArr=gzlArr.concat(gzl.slice(0,2));
			break;
		case 6:
			gzlArr=gzl.slice(6,9);
			gzlArr=gzlArr.concat(gzl.slice(0,3));
			break;
		case 7:
			gzlArr=gzl.slice(7,9);
			gzlArr=gzlArr.concat(gzl.slice(0,4));
			break;
		case 8:
			gzlArr.push(gzl[len]);
			gzlArr=gzlArr.concat(gzl.slice(0,5));
			break;
	}
	console.log(m,"gzlArr",gzlArr);
	return gzlArr;
}
var count=0;
function showGzl(){
	var minecode=$('#minecode option:selected').val();
	if(parseInt(minecode)>1){//子公司
		for(var i=0;i<gzl.length;i++){
			if(gzl[i].minecode==minecode){
				$('.np-content').html("");
				$('.np-content').append("<p><span>"+gzl[i].name+"</span><span>"+gzl[i].value+"</span></p>");
				break;
			}
		}
	}else{
		if(count>8){
			count=0;
		}
		var arr=getGzlArr(count);
		$('.np-content').html("");
		var str="";
		for(var i=0;i<arr.length;i++){
			if(i<=5){
				if(i==0){
					str+="<p>"
				}
				str+="<span>"+arr[i].name+"</span><span>"+arr[i].value+"</span>";
				if((i%2)!=0 && i<5){
					str+="</p><p>";
				}
				if(i==5){
					str+="</p>"
				}
			}
		}
		console.log("value",str)
		$('.np-content').append(str);
		count++;
	}
	
	setTimeout(showGzl,60000);
}
showGzl();

function showNum(num){
	$(".device-num ul").html('');
	var len = String(num).length;
    for(var i = 0; i < len; i++) {
         $(".device-num ul").append("<li>"+String(num).charAt(i)+"</li>");
    }
}

function getMonth(month){
	return Number(month)+"月";
}



