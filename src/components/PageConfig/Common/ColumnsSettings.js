import React,{ PureComponent } from 'react';
import { Modal,Button,Table,Checkbox } from 'antd';
import {  DndProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import update from 'immutability-helper';
import { DragableBodyRow } from './DragTable';

/**
 * 列表配置组件
 */
class ColumnsSettings extends PureComponent {
  state = {
    columnsModalVisible: false,
    columnsData: null,
    columnsName: ''
  }

  components = {
    body: {
      row: DragableBodyRow,
    },
  };

  componentWillMount() {
    const {columns,name} = this.props;
    if (columns !== null) {
      columns.forEach((item,index)=>{
        item.orderIndex = index;
        item.isVisible = true;
      })
    }

    this.setState({columnsName: name});
    const cols_data = localStorage.getItem(name)

    if (cols_data !== null) {
      const cols_data_obj = JSON.parse(cols_data);
      cols_data_obj.forEach((item,index)=>{
        item.orderIndex = index;
      })
      this.setState({columnsData: cols_data_obj});
    } else {
      this.setState({columnsData: columns});
      // localStorage.setItem(name,JSON.stringify(columns));
    }
  }

  moveRow = (dragIndex, hoverIndex) => {
    const { columnsData } = this.state;

    const temp = columnsData[dragIndex];
    columnsData[dragIndex] = columnsData[hoverIndex];
    columnsData[hoverIndex] = temp

    for (let i=0; i<columnsData.length; i++) {
      columnsData[i].orderIndex = i
    }
    this.forceUpdate();

  };

  handleOk = () => {
    this.setState({columnsModalVisible: false})
    localStorage.setItem(this.state.columnsName,JSON.stringify(this.state.columnsData));
    location.reload();
  }

  handleCancel = () => {
    this.setState({columnsModalVisible: false})
  }

  render(){

    const {columnsModalVisible,columnsData} = this.state;

    const tableColumns = [
      {
        title: '列名',
        dataIndex: 'title',
      },
      {
        title: '顺序',
        dataIndex: 'orderIndex',
      },
      {
        title: '是否显示',
        dataIndex: 'isVisible',
        render: (text,recoder)=> {
          return (
            <Checkbox
              orderid={recoder.orderIndex}
              checked={recoder.isVisible}
              onChange={e => {
                this.forceUpdate();
                console.log(e)
                columnsData[e.target.orderid].isVisible = e.target.checked;
                // 强制刷新state
                this.forceUpdate();
              }}
            />
          )
        }
      },
    ];

    return (
      <div>
        <Button
          type='primary'
          onClick={()=>{
            if (!columnsModalVisible) {
              this.setState({columnsModalVisible: true})
            }
          }}
        >
          设置表格
        </Button>
        <Modal
          title="设置表格单元格"
          visible={columnsModalVisible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
          width={720}
        >
          <span style={{color:'red',fontWeight:'bold'}}>*拖动排序</span>
          <DndProvider backend={HTML5Backend}>
            <Table
              id='components-table-demo-drag-sorting'
              dataSource={columnsData}
              columns={tableColumns}
              bordered
              pagination={false}
              size='small'
              components={this.components}
              onRow={(record, index) => ({
                index,
                moveRow: this.moveRow,
              })}
            />
          </DndProvider>
        </Modal>

      </div>
    )
  }
};

export default ColumnsSettings;
