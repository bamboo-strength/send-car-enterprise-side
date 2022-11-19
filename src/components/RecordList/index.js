import React, { PureComponent } from 'react';
import { Card, Col } from 'antd';
import { IconMeikuang, } from '@/components/Matrix/image';
import func from '../../utils/Func';
import ImageShow from '@/components/ImageShow/ImageShow';

export default class RecordList extends PureComponent {

  state = {
    imgPath:'',
    imgShow:false
  }

  onClick = (title)=>{
    this.setState({
      imgPath:title,
      imgShow:true
    })
  }

  onClose = ()=>{
    this.setState({
      imgShow:false
    })
  }

  renderByCategory=(rrow,rowData)=>{
    const {type,value,obj} = rrow
    if(type){
      if(type === 'img'){
        return <img alt="" style={{height: '180px',width:'180px'}} onClick={()=>this.onClick(rowData[value])} src={rowData[value]} />
      }
      return func.formatFromStr(rowData[value],type)
    }
    return obj?rowData[obj][value]:rowData[value]
  }

  render() {
    const { rows, rowData,onClick,checkedId,backgroundStyle,extra,ifDetail=false,renderBtns=[] } = this.props;
    const {imgPath,imgShow} = this.state
    // const backgroundStyle = "rowData.auditflag===1?'ghostwhite':'white'"  // 配置示例
    const cardStyle = {backgroundColor:rowData.id=== checkedId ?'#f0ecec':backgroundStyle ?eval(backgroundStyle):'white'} // border: rowData.id=== checkedId?'solid 1px #d1c6c6':'solid 1px white'
    const labelStyle = {fontSize:'15px',color:'#888'}
    const valueStyle = {fontSize:'16px',color:'#000'}
    const title = !ifDetail ?
      <div style={{display:'flex',alignItems:'center',}}><img src={IconMeikuang} alt='' style={{height:20}} />&nbsp;&nbsp;{rows[0].key}{rows[0].key && ':'} {rowData[rows[0].value]}
      </div>:<div className='labelTitle' style={{margin: '10px 0px'}}>基本信息</div>
    return (
      <Card
        title={title}
        // bordered={false}
        extra={<div style={{color:'rgb(16, 142, 233)'}}>{rowData[extra]}</div>}
        size="small"
        onClick={onClick}
        style={cardStyle}
        className='card-list'
        actions={renderBtns}
      >
        {
          rows.map((rrow,index)=>{
            if (index > 0){
              return <Col span={24} style={{padding:'5px 0'}}>
                <Col span={8} style={labelStyle}>{rrow.key}：</Col>
                <Col span={16} style={valueStyle}>
                  {this.renderByCategory(rrow,rowData)}
                </Col>
              </Col>
            }
            return true
          })
        }
        <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
      </Card>
    );
  }
}
