import React from 'react';
import { PaginationConfig, SorterResult, TableCurrentDataSource } from 'antd/lib/table';

export interface SubTableProps {
  columns: any;
  onSelectRow: (row: any) => void;
  data: any;
  rowKey?: string;
  selectedRows: any[];
  onChange?: (
    pagination: PaginationConfig,
    filters: Record<keyof any, string[]>,
    sorter: SorterResult<any>,
    extra?: TableCurrentDataSource<any>
  ) => void;
  loading?: boolean;
}

export default class SubTable extends React.Component<SubTableProps, any> {}
