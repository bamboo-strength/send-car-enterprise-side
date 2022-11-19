import React,{PureComponent} from 'react';
import ReactEcharts from 'echarts-for-react';

class TheReportEcharts extends PureComponent{
  getOption = (data)=>({
    grid: [{
      top: 20,
      width: '98%',
      bottom: 20,
      left: 0,
      right:0,
      containLabel: true
    }],
    xAxis: [{
      type: 'value',
      max: data.all,
      position: "top",
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#e8e8e8"
        }
      }
    }],
    yAxis: [{
      type: 'category',
      data: Object.keys(data.charts),
      axisLabel: {
        interval: 0,
        rotate: -30
      },
      splitLine: {
        show: true,
        lineStyle: {
          type: "dashed",
          color: "#e8e8e8"
        }
      }
    }, ],
    color: ["#1890ff" ],
    series: [{
      type: 'bar',
      name: "销售柱状图",
      data: Object.keys(data.charts).map(function (key) {
        return data.charts[key];
      })
    }]
  })

  render() {
    const {title} = this.props
    const builderJson = {
      "all": 10887,
      "charts": {
        "06-01": 3237,
        "06-02": 2164,
        "06-03": 7561,
        "06-04": 7778,
        "06-05": 7355,
        "06-06": 2405,
        "06-07": 1842,
        "06-08": 2090,
        "06-09": 1762,
        "06-10": 1593,
        "06-12": 2060,
        "06-13": 1537,
        "06-14": 1908,
        "06-15": 2107,
        "06-16": 1692,
        "06-17": 1578
      },
    };
    return (
      <div style={{height:500}}>
        <ReactEcharts option={this.getOption(builderJson)} style={{ width: '100%', height: '100%' }} />
      </div>
    );
  }
}
export default TheReportEcharts
