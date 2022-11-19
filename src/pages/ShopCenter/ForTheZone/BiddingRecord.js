import React, { Component } from 'react';
import { Card, Form, Icon, Table } from 'antd';
import { NavBar } from 'antd-mobile';
import { bidRecord, getNum } from '@/services/shoppingMall';


@Form.create()
class ForTheZone extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data:'',
      biddingDeptCount:'',
      totalQuantity:'',
      pageSize: 0,
      total: 0,
      current:1,
    };
  }

componentDidMount() {
  const { match: { params: { id } },} = this.props;
   this.Operation()
    getNum({ id }).then(res=>{
      this.setState({
        biddingDeptCount:res.data.biddingDeptCount,
        totalQuantity:res.data.totalQuantity
      })
      console.log(res)
    })
}

  Operation=()=>{
    const { match: { params: { biddingWay,id } },} = this.props;
    // const param = {biddingWay,spikeActivityId:id}
    // console.log(this.biddingWay)
    const {current} = this.state
    const param = {
      biddingWay,
      spikeActivityId:id,
      current,
      size:10,
    }
    bidRecord(param).then(resp => {
      if (resp.success) {
        this.setState({
          data:resp.data.records,
          total:resp.data.total,
          pageSize:resp.data.size,
        })
      }
    });
  }

  /* tabs点击事件 */
  changePage = (current)=>{
    // current参数表示是点击当前的页码，
    this.setState({
      current
    },()=>{
      this.Operation() // 向后端发送请求
    })
  }

  render() {
    const {data,totalQuantity,biddingDeptCount,pageSize, total,current} = this.state
    const { match: { params: { biddingWay,activityStatus} },} = this.props;
    /* 竞价记录分页功能 */
    const paginationProps = {
      showTotal: () => `共${total}条`,
      pageSize,
      total,  // 数据的总的条数
      current,
      onChange: (currents) => this.changePage(currents), // 点击当前页码
    }
    const  columns =[
      {
        title: '序号',
        render:(text,record,index)=><span style={{fontSize:'10px'}}>{`${index+1}`}</span> ,
        align: 'center',
      },
      { title: '竞价状态',dataIndex:'isSucceed',align:'center',render:(text,record)=><span style={{fontSize:'10px'}}>{record.isSucceed=== 1?<text style={{color:'red'}}>{activityStatus==='6'?'领先':'成交'}</text>:'出局'}</span>},
      {title: '报价',dataIndex: 'materialPriceTotal',align:'center',render:(text,record)=><span style={{fontSize:'10px'}}>{text}元/{record.unit===1?'吨':record.unit===2?'车':record.unit===3?'立方':'件'}</span>},
      { title: '报价方',dataIndex:'userName',align:'center',render:(text,record)=><span style={{fontSize:'10px',whiteSpace:'pre-wrap'}}>{record.userName==='1'?<text style={{color:'red'}}>我</text>:'保密'}</span>},
      { title: '报价时间',dataIndex: 'createTime',align:'center',render:text=><span style={{fontSize:'10px',whiteSpace:'pre-wrap'}}>{text}</span>} ,
    ]
    const  columns1 =[
      {
        title: '序号',
        render:(text,record,index)=><span style={{fontSize:'10px'}}>{`${index+1}`}</span> ,
        align: 'center',
      },
      { title: '竞价状态',dataIndex:'isSucceed',align:'center',render:(text,record)=><span style={{fontSize:'10px'}}>{record.isSucceed=== 1?<text style={{color:'red'}}>{activityStatus==='6'?'领先':'成交'}</text>:'出局'}</span>},
      {title: '我的报价',dataIndex: 'materialPriceTotal',align:'center',render:(text,record)=><span style={{fontSize:'10px'}}>{text}元/{record.unit===1?'吨':record.unit===2?'车':record.unit===3?'立方':'件'}</span>},
      { title: '报价时间',dataIndex: 'createTime',align:'center',render:text=><span style={{fontSize:'10px',whiteSpace:'pre-wrap'}}>{text}</span>} ,
    ]
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => window.history.back()}
        >竞价记录
        </NavBar>
        {biddingWay=== '0' ?
          <div className='am-list'>
            <Card style={{marginTop:'6px',fontSize:'12px'}}>
              <span>本活动为公开竞价，共有{biddingDeptCount}家参与报价，报价次数共计{totalQuantity}次</span>
            </Card>
            <Card style={{marginTop:'6px'}}>
              <Table dataSource={data} size='small' ellipsis='true' columns={columns} pagination={paginationProps} />
            </Card>
          </div>
      :
          <div className='am-list'>
            <Card style={{marginTop:'6px',fontSize:'12px'}}>
              <span>本活动为封闭竞价，共有{biddingDeptCount}家参与报价，报价次数共计{totalQuantity}次</span>
            </Card>
            <Card style={{marginTop:'6px'}}>
              <Table dataSource={data} size='small' ellipsis='true' columns={columns1} pagination={paginationProps} />
            </Card>
          </div>
        }
      </div>
    );
  }
}

export default ForTheZone;
