import React, { PureComponent } from 'react';
import { connect } from 'dva';
import {Form, Col, message, Button, Modal} from 'antd/lib/index';
import { Icon, NavBar, Card, WhiteSpace } from 'antd-mobile';
import router from 'umi/router';
import styles from '../../../layouts/Sword.less';
import { TABLEEXTEND_COLUMNLIST } from '@/actions/tableExtend';
import {queryDriverDetail,auditDriver} from '@/services/commonBusiness';

import ImageShow from '@/components/ImageShow/ImageShow';
import func from '@/utils/Func';
import MatrixTextArea from "@/components/Matrix/MatrixTextArea";

const FormItem = Form.Item;


@connect(({ tableExtend, loading }) => ({
  tableExtend,
  loading: loading.models.tableExtend,
}))
@Form.create()
class CommonBusinessDriverView extends PureComponent {

  state = {
    showColums: [],
    // tableTitle:'',
    detail:[],
    imgShow:false,
    imgPath:'',
    showTitle:false,
    unAdoptvisible:false,
  };

  componentWillMount() {
    const {
      dispatch,
      match: {
        params: { id },
      },
    } = this.props;
    const driverId=id
    queryDriverDetail({ id:driverId}).then(resp => {
      const listData = resp.data;
      this.setState({
        detail:listData
      })
    })
    dispatch(TABLEEXTEND_COLUMNLIST({tableName:'mer_driver','modulename':'manualAudit',queryType:3})).then(() => {
      const {tableExtend:{ data }} = this.props;
      if (data !== undefined) {
        if(data.columList!==null && data.columList!==undefined){
          const aa=data.columList;
          // const tc=aa.table_main[0].tableAlias
          this.setState({
            showColums: aa.table_main,
            // tableTitle:tc
          })
        }
      }
    })
  }

  expandImg=(e,img)=>{
    e.stopPropagation();
    e.preventDefault();
    this.setState({
      imgShow:true,
      imgPath:img
    })
  }

  onClose =()=>{
    this.setState({
      imgShow:false
    })
  }

  render() {
    const formItemLayout = {
      labelCol: {
        xs: { span: 11 },
        sm: { span: 7 },
      },
      wrapperCol: {
        xs: { span: 13 },
        sm: { span: 12 },
        md: { span: 10 },
      },
    };

    const {showColums,detail,imgShow,imgPath,showTitle,unAdoptvisible} = this.state;
    const { form, match: { params: { id } } } = this.props;
    return (
      <div>
        <NavBar
          mode="light"
          icon={<Icon type="left" />}
          onLeftClick={() => router.push('/commonDriverAudit/commonDriverAudit/list')}
        >查看
        </NavBar>
        <div className='am-list'>
          <Card className={styles.card} bordered={false}>
            <div className='labelTitle'>基本信息</div>
            <Card.Body>
              {
                showColums.map(item=>{
                  const keyValueTemp = detail[item.columnName];
                  const shownameValue = detail[item.showname];
                  const showFiled = func.notEmpty(shownameValue) ? shownameValue : keyValueTemp;
                  if (item.category === 2){
                    return (<Col span={24} className="view-config"><FormItem {...formItemLayout} label={item.columnAlias}><span>{func.formatFromStr(showFiled, item.dickKey)}</span></FormItem></Col>)
                  }
                  if (item.category === 7){
                    this.setState({
                      showTitle:true
                    })
                    return (<Col span={12} className="view-config imgBg" style={{display:'none'}} />)
                  }
                  if (item.category === 9){
                    return (<Col span={24} className="view-config"><FormItem {...formItemLayout} label={item.columnAlias}><span>{func.formatFromStr(showFiled, item.dickKey)}</span></FormItem></Col>)
                  }
                  return (<Col span={24} className="view-config"><FormItem {...formItemLayout} label={item.columnAlias}><span>{showFiled}</span></FormItem></Col>)
                })
              }
            </Card.Body>
            { showTitle ? <WhiteSpace style={{background:'#f0f2f5',margin:'8px 0'}} size="sm" />:null}
            { showTitle ? <div className='labelTitle labelTitle2'>证件图片</div>:null}
            {
              showTitle ? (
                <Card.Body>
                  {
                    showColums.map(item=>{
                      return item.category === 7?(
                        <Col span={12} className="view-config imgBg">
                          <Col span={24}>
                            <img src={detail[item.columnName]} alt="" onClick={(e) => this.expandImg(e, detail[item.columnName])} />
                          </Col>
                          <Col span={24} className='colabel'>
                            {item.columnAlias}
                          </Col>
                        </Col>
                      ):null
                    })
                  }
                </Card.Body>
              ):null
            }
            <ImageShow imgPath={imgPath} visible={imgShow} onClose={this.onClose} />
          </Card>
        </div>
      </div>
    );
  }
}
export default CommonBusinessDriverView;

