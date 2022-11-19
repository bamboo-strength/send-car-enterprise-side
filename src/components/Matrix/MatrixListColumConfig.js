import func from '../../utils/Func';

/**
 * 动态获取显示列表
 * @returns []
 */
export function getListConf (params) {

  const items = [];
  if(params.length>0) {
    params.forEach((item)=>{
      let {columnName} = item
      const {showname,columnType,category,dickKey,columnAlias,listShowFlag} = item
      if(listShowFlag === 1){
        if(func.notEmpty(showname)){
          columnName=showname;
        }
        let aa = {
          title: columnAlias,
          dataIndex: columnName,
          width:150
        }
        if(category === 2) {  // 对时间处理
          aa = {
            title: columnAlias,
            dataIndex: columnName,
            width:150,
            render: (text,) => {
              if(func.notEmpty(text)){
                return func.formatFromStr(text,dickKey)
              }
              return text
            }
          }
        }
        if(category === 9) {  // 处理时间区间
          aa = {
            title: columnAlias,
            dataIndex: columnName,
            width:150,
            render: (text,) => {
              if(func.notEmpty(text)){
                return func.formatFromStr(text,dickKey)
              }
              return text
            }
          }
        }
        items.push(aa);
      }

    });
  }
    return items;
}





