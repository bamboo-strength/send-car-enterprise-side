/* eslint-disable import/prefer-default-export */

import React from 'react';
import RecordList from '@/components/RecordList';

/**
 * 查看页面获取显示列
 * @returns
 */

export function getViewConf (params,getFieldDecorator,object) {
  const rows = []
  params.forEach(item=>{
    const {columnAlias,columnName,showname,category,dickKey} = item
     rows.push({
       key:columnAlias,
       value:showname || columnName,
       type:category===2?dickKey:category===7?'img':'' // 处理时间、图片
    })
  })

  return <RecordList rows={rows} rowData={object} ifDetail />
};




