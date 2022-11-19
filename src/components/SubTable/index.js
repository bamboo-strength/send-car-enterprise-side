import React, { PureComponent, Fragment } from 'react';
import { Table, Alert } from 'antd';
import styles from './index.less';
import { requestListApi } from '@/services/api';
import { SHOW_TOTAL_SIMPLE } from '@/utils/PaginationShowTotal';

function initTotalList(columns) {
  const totalList = [];
  columns.forEach(column => {
    if (column.needTotal) {
      totalList.push({ ...column, total: 0 });
    }
  });
  return totalList;
}

class SubTable extends PureComponent {
  constructor(props) {
    super(props);
    const { columns, rowKey = 'id' } = props;
    const needTotalList = initTotalList(columns);

    // 使用外层传入的 selectedRows 初始化选中行，避免使用 Grid 时重新初始化 SubTable 导致的状态异常
    const selectedRowKeys = props.selectedRows ? props.selectedRows.map(row => row[rowKey]) : [];

    this.state = {
      selectedRowKeys,
      needTotalList,
      expandProps: props.expandProps,
      subTabData: {},
    };
  }

  static getDerivedStateFromProps(nextProps) {
    // clean state
    if (nextProps.selectedRows.length === 0) {
      const needTotalList = initTotalList(nextProps.columns);
      return {
        selectedRowKeys: [],
        needTotalList,
      };
    }
    if (nextProps.expandProps) {
      return {
        expandProps: nextProps.expandProps,
      };
    }
    return null;
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

    this.setState({ selectedRowKeys, needTotalList });
  };

  handleTableChange = (pagination, filters, sorter) => {
    const { onChange } = this.props;
    if (onChange) {
      onChange(pagination, filters, sorter);
    }
  };

  cleanSelectedKeys = () => {
    this.handleRowSelectChange([], []);
  };

  subHandleTableChange = (pagination) => {
    const {subTabData} = this.state;
    const {
      subPath,
      subParam,
    } = this.props;
    // console.log(pagination)
    const p = {
      current: pagination.current,
      size: pagination.pageSize,
      [subParam]:pagination[subParam],
    };

    requestListApi(subPath, p).then(value => {
      if (value.success){
        const expandedData = {
          subList: value.data.records,
          subPagination: {
            total: value.data.total,
            current: value.data.current,
            pageSize: value.data.size,
            [subParam]:pagination[subParam],
            id:pagination.id,
          },
          showTotal: SHOW_TOTAL_SIMPLE,
        }
        this.setState({
          subTabData: {
            ...subTabData,
            [pagination.id]: expandedData ,
          }
        });
      }
    });
  };

  // 获取子数据
  handleTableExpand = (expended, record) => {
    // record.isShow = expended ? '展开' : '收起';
    const {subTabData} = this.state;
    const {
      subPath,
      subParam,
      rowParam,
    } = this.props;
    if (subPath !== undefined){
      const p = {
        [subParam]:record[rowParam],
      };

      if ( expended === false ) {
        // console.log('合并');
        this.setState({
          subTabData: {
            ...subTabData,
            [record.id]: [] ,
          }
        });
      }else{
        // console.log('展开');
        requestListApi(subPath, p).then(value => {
          if (value.success){
            const expandedData = {
              subList: value.data.records,
              subPagination: {
                total: value.data.total,
                current: value.data.current,
                pageSize: value.data.size,
                [subParam]:record[rowParam],
                id:record.id,
              },
              showTotal: SHOW_TOTAL_SIMPLE,
            }
            this.setState({
              subTabData: {
                ...subTabData,
                [record.id]: expandedData ,
              }
            });
          }
        });
      }
    }
  };

  render() {
    const { selectedRowKeys, needTotalList, expandProps, subTabData } = this.state;
    const { data = {}, rowKey, alert = false, selectType, ...rest } = this.props;
    const { list = [], pagination } = data;


    const paginationProps = pagination
      ? {
          showSizeChanger: true,
          showQuickJumper: true,
          ...pagination,
        }
      : false;

    const rowSelection = {
      selectedRowKeys,
      onChange: this.handleRowSelectChange,
      getCheckboxProps: record => ({
        disabled: record.disabled,
      }),
      type : selectType,
    };

    // 嵌套子表
    const expandedRowRender = (expended, record) => {

      const {
        loading,
        subColumns,
        // subParam,
      } = this.props;

      const tabData  = subTabData[expended.id];

      if (tabData !== undefined) {
        const { subList = [], subPagination } = tabData;
        const subPaginationProps = subPagination
          ? {
            showSizeChanger: true,
            showQuickJumper: true,
            ...subPagination,
          }
          : false;
        return (
          <Table
            rowKey={record}
            loading={loading}
            columns={subColumns}
            dataSource={subList}
            size="small"
            pagination={subPaginationProps}
            onChange={this.subHandleTableChange}
          />
        );
      }

    };

    return (
      <div className={styles.standardTable}>
        {alert ? (
          <div className={styles.tableAlert}>
            <Alert
              message={
                <Fragment>
                  已选择 <a style={{ fontWeight: 600 }}>{selectedRowKeys.length}</a> 项&nbsp;&nbsp;
                  {needTotalList.map(item => (
                    <span style={{ marginLeft: 8 }} key={item.dataIndex}>
                      {item.title}
                      总计&nbsp;
                      <span style={{ fontWeight: 600 }}>
                        {item.render ? item.render(item.total) : item.total}
                      </span>
                    </span>
                  ))}
                  <a onClick={this.cleanSelectedKeys} style={{ marginLeft: 24 }}>
                    清空
                  </a>
                </Fragment>
              }
              type="info"
              showIcon
            />
          </div>
        ) : null}
        <Table
          rowKey={rowKey || 'key'}
          rowSelection={rowSelection}
          dataSource={list}
          pagination={paginationProps}
          onChange={this.handleTableChange}
          {...rest}
          {...expandProps}
          onExpand={this.handleTableExpand}
          expandedRowRender={expandedRowRender}
        />
      </div>
    );
  }
}

export default SubTable;
