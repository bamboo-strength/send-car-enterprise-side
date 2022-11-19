import React, { Component } from 'react';
import { Table, Button, message } from 'antd';
import moment from 'moment';
import { sec_to_time, time_to_sec } from '@/components/Util/SecDate';
import Func from '@/utils/Func';
import { gpslocus, gpsstopcar } from '@/services/gps';



export default class StopCarTable extends Component {

  state = {
    filteredInfo: null,
    sortedInfo: null,
    tableheight: '400px',
    loading: true,
    data: [],
  };

  componentWillMount() {
    const {tableheight,selectParams,isselectTable,isselect} = this.props;
    if (Func.isEmpty(selectParams.deviceno)){
      isselectTable(["isstopcarTable",false])
      this.setState({
        tableheight: tableheight,
        loading: false,
        data:[],
      })
    }else {
      if(isselect){
        isselectTable(["isstopcarTable",false])
        this.setState({
          tableheight: tableheight,
          loading: true,
        })
        this.selectList(selectParams);
      }else {
        this.setState({
          loading: false,
          data:[],
        })
      }
    }
  }

  componentWillReceiveProps(nextProps) {
    const {tableheight,selectParams,isselect,isselectTable} = nextProps;
    if (selectParams.deviceno !== this.props.selectParams.deviceno ||
      selectParams.startTime !== this.props.selectParams.startTime || selectParams.endTime !== this.props.selectParams.endTime){
      if (Func.isEmpty(selectParams.deviceno)){
        isselectTable(["isstopcarTable",false])
        // data=[];
        this.setState({
          tableheight: tableheight,
          loading: false,
          data:[]
        })
      } else {
        if(isselect){
          this.setState({
            loading: isselect,
          });
          this.selectList(selectParams);
        }
      }
    }else {
      if(isselect){
        this.setState({
          loading: isselect,
        });
        this.selectList(selectParams);
      }
    }

    this.setState({
      tableheight: tableheight,
    })
  }

  // 查询停车点数据
  selectList=(selectParams)=>{

    const {isselectTable} = this.props;
    gpsstopcar({ 'deviceNo': selectParams.deviceno, 'startTime': selectParams.startTime.format('YYYY-MM-DD HH:mm:ss'),
      'endTime': selectParams.endTime.format('YYYY-MM-DD HH:mm:ss'), 'fhdh': '' }).then((res) => {
      if(Func.notEmpty(res) && Func.notEmpty(res.data)){
        let locusdata = res.data.gps;
        let data1 = [];
        if (Func.isEmpty(locusdata)){
          return;
        }
        locusdata.map((value, index, array) => {
          let d = {
            deviceno: value.deviceno,
            longitude: value.longitude,
            latitude: value.latitude,
            eventtotaltime: value.eventtotaltime,
            eventstarttime: value.eventstarttime,
            eventendtime: value.eventendtime,
            index: index,
          }
          data1.push(d);
          return value;
        });
        this.setState({
          loading: false,
          data: data1,
        })
        isselectTable(["isstopcarTable",false])
      }else {
        message.error("gps服务器异常，获取停车点信息失败")
      }

    })

  }



  handleChange = (pagination, filters, sorter) => {
    this.setState({
      filteredInfo: filters,
      sortedInfo: sorter,
    });
  };

  clickTable = (record,rowkey)=>{
    const {onclikRow} = this.props;
    if (onclikRow){
      onclikRow({type: "stopcarTable",index: record.index})
    }
  }

  render() {
    let { sortedInfo, filteredInfo,tableheight,loading,data } = this.state;
    sortedInfo = sortedInfo || {};
    filteredInfo = filteredInfo || {};
    const columns = [
      {
        title: 'IMEI',
        dataIndex: 'deviceno',
        key: 'deviceno',
      },
      {
        title: '开始时间',
        dataIndex: 'eventstarttime',
        key: 'eventstarttime',
        sorter: (a, b) => moment(a.eventstarttime).diff(b.eventstarttime, 'second'),
        sortOrder: sortedInfo.columnKey === 'eventstarttime' && sortedInfo.order,
      },
      {
        title: '时长',
        dataIndex: 'eventtotaltime',
        key: 'eventtotaltime',
        align: 'left',
        filters: [{ text: '5分钟', value: '5' }, { text: '10分钟', value: '10' },
          { text: '20分钟', value: '20' }, { text: '30分钟', value: '30' },
          { text: '1小时', value: '60' }, { text: '2小时', value: '120' },
          { text: '3小时', value: '180' }, { text: '1天', value: '1440' },
          { text: '2天', value: '2880' }, { text: '3天', value: '4320' },
          { text: '5天', value: '7200' }, { text: '10天', value: '14400' },
        ],
        filteredValue: filteredInfo.eventtotaltime || null,
        onFilter: (value, record) => {
          // return time_to_sec(record.eventtotaltime)>value
          return record.eventtotaltime > value
        },
        filterMultiple: false,
        sorter: (a, b) => {
          // return time_to_sec(a.eventtotaltime) - time_to_sec(b.eventtotaltime)
          return a.eventtotaltime - b.eventtotaltime
        },
        sortOrder: sortedInfo.columnKey === 'eventtotaltime' && sortedInfo.order,
      },
    ];

    let data1 = data.map((values)=>{
      return {
        ...values,
        // eventtotaltime: sec_to_time(values.eventtotaltime),
      }
    })

    return (
      <div style={{height: tableheight,overflowY: 'auto'}}>
        <Table
          columns={columns}
          dataSource={data1}
          onChange={this.handleChange}
          size='middle'
          rowKey="index"
          loading={loading}
          onRow={(record,rowkey)=>{
            return{
              onClick : () =>{
                this.clickTable(record,rowkey);
              }
            }
          }}
        />
      </div>
    )
  }
}
