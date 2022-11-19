import { Table, Input, Button, Popconfirm, Form,message,Modal, } from 'antd';
import React, { PureComponent } from 'react';
import { formatMessage, FormattedMessage } from 'umi/locale';
import moment from 'moment';
import styles from './index.less';
import MatrixAutoComplete from '../Matrix/MatrixAutoComplete';
import MatrixSelect from '../Matrix/MatrixSelect';
import MatrixInput from '../Matrix/MatrixInput';
import MatrixDate from '../Matrix/MatrixDate';

const FormItem = Form.Item;
const { Search } = Input;

const EditableContext = React.createContext();

const EditableRow = ({ form, index, ...props }) => (
  <EditableContext.Provider value={form}>
    <tr {...props} />
  </EditableContext.Provider>
);

const EditableFormRow = Form.create()(EditableRow);

class EditableCell extends React.Component {

  save = e => {
    const { record, handleSave } = this.props;
    this.form.validateFields((error, values) => {
      if (error) {
        handleSave(null);
      }else {
        const params = {
          ...values,
        };
        handleSave({ ...record, ...params });
      }
    });
  };


  renderCell = form => {
    this.form = form;
    const { children,title,dataIndex,maxlen,isrequired,dictvalue,showdataindex,record, rules, type,onShowModal,otherparam,types } = this.props;
    const realVal = record[dataIndex]===null?"":record[dataIndex]
    const msg = `请输入${title}`
    const msgauto = `拼音码输入${title}`
    if (type === 'search'){
      return (
        <div>
          <FormItem style={{ margin: 0 }}>
            {form.getFieldDecorator(showdataindex, {
              rules,
              initialValue: realVal,
            })(<Search required={isrequired===1} onBlur={this.save} onClick={(e) => onShowModal(dataIndex,record,e)} />)}
          </FormItem>
          <FormItem style={{display:'none'}}>
            {form.getFieldDecorator(dataIndex, {
              rules,
              initialValue: record[showdataindex],
            })(<Input readOnly="readOnly"  />)}
          </FormItem>
        </div>
      );
    }

    if (type === 'input'){
      return (
        <MatrixInput
          placeholder={msg}
          numberType={types}
          id={dataIndex}
          initialValue={realVal}
          required={isrequired===1}
          form={form}
          onBlur={this.save}
          maxLength={maxlen}
          style={{width: 'fit-content'}}
        />
      );
    }

    if (type === 'autocomplete'){
      return (
        <MatrixAutoComplete
          placeholder={msgauto}
          dataType={dictvalue}
          id={dataIndex}
          value={record[dataIndex]}
          labelId={showdataindex}
          labelValue={record[showdataindex]}
          form={form}
          required={isrequired===1}
          onBlur={this.save}
          style={{width: 'max-content'}}
          otherparam={otherparam}
        />
      );
    }
    if (type === 'select'){
      return (
        <MatrixSelect
          placeholder={msg}
          id={dataIndex}
          dictCode={dictvalue}
          required={isrequired===1}
          style={{width: '150px'}}
          initialValue={realVal}
          form={form}
          onBlur={this.save}
          otherparam={otherparam}
        />
      );
    }

    if (type === 'date'){
      const aa = realVal!==""?moment(realVal, 'YYYY-MM-DD HH:mm:ss'):""
      return (
        <MatrixDate
          placeholder={msg}
          id={dataIndex}
          format='YYYY-MM-DD HH:mm:ss'
          onBlur={this.save}
          required={isrequired===1}
          style={{width: '75%'}}
          initialValue={aa}
          form={form}
        />
      );
    }
    return (
      <div className="editable-cell-value-wrap" style={{ paddingRight: 24 }}>
        {children}
      </div>
    );
  };

  render() {
    const {
      editable,
      dataIndex,
      title,
      record,
      index,
      handleSave,
      children,
      ...restProps
    } = this.props;
    return (
      <td {...restProps}>
        {editable ? (
          <EditableContext.Consumer>{this.renderCell}</EditableContext.Consumer>
        ) : (
          children
        )}
      </td>
    );
  }
}
function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class EditableTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns, rowKey , data, dataNew } = props;
    const needTotalList = initTotalList(columns);

    const selectedRowKeys = props.selectedRows ? props.selectedRows.map(row => row[rowKey]) : [];
    this.state = {
      selectedRowKeys,
      needTotalList,
      selectedRows: props.selectedRows,
      dataSource: dataNew.length>0?dataNew:data,
    };
  }

  componentDidMount() {
    this.handleAdd()
  }

  handleRowSelectChange = (selectedRowKeys, selectedRows) => {
    let { needTotalList } = this.state;
    needTotalList = needTotalList.map(item => ({
      ...item,
      total: selectedRows.reduce((sum, val) => sum + parseFloat(val[item.dataIndex], 10), 0),
    }));
    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(selectedRows);
    }

    this.setState({ selectedRowKeys, needTotalList,selectedRows });
  };

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    const { pkField = 'key', childPkField = 'key' } = this.props;
    return selectedRows.map(row => {
      const selectKey = row[pkField] || row[childPkField];
      if (`${selectKey}`.indexOf(',') > 0) {
        return `${selectKey}`.split(',');
      }
      return selectKey;
    });
  };

  handleClick = () => {
    const keys = this.getSelectKeys();
    if (keys.length <= 0) {
      message.warn('请先选择要删除的记录!');
      return;
    }
    const clearKeys = (keys) =>  this.handDelete(keys);
    Modal.confirm({
      title: '删除确认',
      content: '确定删除选中记录?',
      okText: '确定',
      okType: 'danger',
      cancelText: '取消',
      async onOk() {
        clearKeys(keys);
      },
      onCancel() {},
    });
  };

  handDelete = (keys) =>{
    const { onReturnData } = this.props;
    const { dataSource } = this.state;
    const temDate = new Map();
    const newDate = [];

    dataSource.forEach(value =>{
      temDate.set(value.key,value);
    })
    keys.forEach(value =>{
      if (temDate.has(value)){
        temDate.delete(value)
      }
    })
    temDate.forEach(value => {
      newDate.push(value);
    })
    this.setState({ dataSource: newDate,selectedRowKeys: [],selectedRows:[]});
    onReturnData(newDate,true);
  }

  doDelete = (dataDelete,key) =>{
    const data = dataDelete.filter(item => item.key !== key);
    this.setState({ dataSource: data, });
    return data;
  }

  handleDelete = key => {
   /* const dataSource = [...this.state.dataSource];
    this.setState({ dataSource: dataSource.filter(item => item.key !== key) }); */
    const { onReturnData,dataNew } = this.props;
    const { dataSource } = this.state;
    if (dataNew.length>0){
       onReturnData(this.doDelete(dataNew,key),true);
    }else {
      onReturnData(this.doDelete(dataSource,key),true);
    }
  };

  handleAdd = () => {
    const { columns,onReturnData,dataNew } = this.props;
    const { dataSource } = this.state;
    if (dataNew.length>0){
      onReturnData(this.doAdd(dataNew,columns),true);
    }else {
      onReturnData(this.doAdd(dataSource,columns),true);
    }

  };

  doAdd = (dataAdd,columns) =>{
    let count = 0;
    if (dataAdd.length>0){
      count = dataAdd[dataAdd.length-1].key + 1;
    }else {
      count = dataAdd.length + 1;
    }
    let param = {};
    for (let i=0;i<columns.length;i+=1){
      if ([columns[i].dataIndex][0] === "key"){
        param = {[columns[i].dataIndex]:count,...param,};
      }else {
        param = {[columns[i].dataIndex]:null,...param,};
      }
    }
    const data = [...dataAdd,param, ];
    this.setState({
      dataSource: data,
    });
    return data;
  }

  handleSave = row => {
    const { onReturnData,dataNew } = this.props;
    if(row!==null){
      const index = dataNew.findIndex(item => row.key === item.key);
      const item = dataNew[index];
      dataNew.splice(index, 1, {
        ...item,
        ...row,
      });
      this.setState({ dataSource: dataNew });
      onReturnData(dataNew,true);
    }else{
      onReturnData(dataNew,false);
    }

  };

  render() {
    const { selectedRowKeys,dataSource } = this.state;
    const {selectType,dataNew,columns } = this.props;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type : selectType,
    };

    const components = {
      body: {
        row: EditableFormRow,
        cell: EditableCell,
      },
    };
    let newcolumns = columns.map(col => {
      if (!col.editable) {
        return col;
      }
      return {
        ...col,
        onCell: record => ({
          record,
          title: col.title,
          dataIndex: col.dataIndex,
          showdataindex:col.showDataIndex,
         // columntype:col.columnType,
          maxlen:col.maxlen,
          isrequired:col.isrequired,
          type: col.type,
          dictvalue: col.dictValue,
          rules: col.rules,
          handleSave: this.handleSave,
          editable:col.editable,
          types:col.types,
          onShowModal:col.onShowModal,
          otherparam:col.otherParam
        }),
      };
    });
    if (newcolumns && Array.isArray(newcolumns)) {
      newcolumns = [
        ...newcolumns,
        {
          title: '操作',
          dataIndex: 'operation',
          render: (text, record) =>
            //  this.state.dataSource.length >= 1 ? (
            <Popconfirm title="确定删除?" onConfirm={() => this.handleDelete(record.key)}>
              <a>删除</a>
            </Popconfirm>
          //   ) : null,
        },
      ];
    }
    return (
      <div className={styles.editableTable}>
        <div>
          <Button onClick={this.handleAdd} icon='plus' type="primary" style={{ marginBottom: 16 }}>
            <FormattedMessage id='新增' />
          </Button>
          &nbsp;&nbsp;&nbsp;&nbsp;
          <Button onClick={() => this.handleClick()} icon='delete' type="danger" style={{ marginBottom: 16 }}>
            <FormattedMessage id='删除' />
          </Button>
        </div>
        <Table
          rowSelection={rowSelection}
          components={components}
          rowClassName={() => 'editable-row'}
          bordered
          dataSource={dataNew.length>0?dataNew:dataSource}
          columns={newcolumns}
          pagination={false}
        />
      </div>
    );
  }
}

export default EditableTable;
