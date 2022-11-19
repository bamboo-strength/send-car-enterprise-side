import React, { Component } from 'react';
import { Button, } from 'antd';
import { getEditConf } from '@/components/Matrix/MatrixEditConfig';
import styles from "./MatrixMobile.less"

class MatrixMobileAddForm extends Component {

  componentDidMount() {
    const { onRef } = this.props;
    if (onRef) onRef(this);
  }

  onAddForm = () => {
    const {showColumsText} = this.props
    const list = {}
    showColumsText.map(item=> list[item.columnName] = '')
    const {form} = this.props
    const data = form.getFieldValue('data');
    const nextList = data.concat(list);
    form.setFieldsValue({
      data: nextList,
    });
  };

  onDelete = (item, index) => {
    const {form:{getFieldsValue,setFieldsValue,getFieldValue}} = this.props
    const {list} = getFieldsValue()
    const lists = list.filter((key,num) => num !== index)
    const data = getFieldValue('data');
    setFieldsValue({
      data:data.filter((items, key) => key !== index),
      list: lists,
    });
  };

  returnForm=(form)=>{
    return form
  }

  render() {
    const { className, style, form, showColumsText, ifNeedAddBtn,methodsSub,dataSource,notNeedDelete=false } = this.props;
    const {getFieldDecorator,getFieldValue} = form
    const slist =  dataSource || []
    getFieldDecorator('data', { initialValue: slist });
    const data = getFieldValue('data');
    return (
      <div className={`${styles.MatrixMobileAddForm} ${className}`} style={style}>
        {
          ifNeedAddBtn &&
          <Button type="primary" size="small" onClick={this.onAddForm} className='matrix-add-form-btn'>新增</Button>
        }
        {
          data.map((item,index)=>{
            return (
              <div className="matrix-add-form-div" key={index}>
                {getEditConf(showColumsText, form, item, methodsSub, false, '', false, { list: 'list', index })}
                {!notNeedDelete && <Button block style={{ marginBottom: 15 }} type="danger" onClick={() => {this.onDelete(item, index);}}>删除</Button>}
              </div>
            )
          })
        }
      </div>
    );
  }
}

export default MatrixMobileAddForm;
