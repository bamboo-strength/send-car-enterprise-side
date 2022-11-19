import React, { PureComponent } from 'react';
import { Button, Col, Form, Input, message, Modal, Row, Select, Table } from 'antd';
import SearchBox from '@/components/Sword/SearchBox';
import { requestListApi } from '../../services/api';
import Func from '@/utils/Func';
import { dict } from '@/services/dict';
import { getQueryConf } from '../Matrix/MatrixQueryConfig';


/*
* props:
searchPath
titel                    弹出框名称
visible                  弹出框开启关闭控制 false关，true开
handleClose              弹出框关闭回调
onAffirm                 弹出框确认回调
popupwidth               弹出框宽度  ｛1000｝
footer                   弹出框确认取消按钮显示控制true/false    默认显示

paramValue              {key: "goodsId",otherKey: "goodsName",otherValue: 'name'}
                        key:查询的值key
                        otherKey: 拓展查询的值key
                        otherValue： 拓展查询的值所在列表的值属性

searchPath                列表查询path /api/base-goods/goods/list
searchParams              额外查询参数
searchConditionLabel      查询条件Label ['物资简称','物资编码']
searchConditionCode       查询字段Code ['shortname','code']
colName                   表头名
colCode                   列表code
size                      每页显示多少条 默认10
selectType                单选还是多选 默认单选
rowKey                    列表行key 选中行后保存的属性 默认为id
selected={["packaging","isSync"]}    下拉框查询条件的字典类型值
selectedLabel={['包装方式','是否同步']}   下拉框查询条件的label
selectedCode={['packaging','isSync']}   下拉框查询条件的值对应的请求后台参数名
* */
const FormItem = Form.Item;

@Form.create()
export default class SearchDataTable extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      size: 10,
      formValues: {},      //查询表单
      total: 10,
      loading: true,     //页面是否加载中
      list: [],           //数据列表
      selectedRowKeys: [],   //选中的行key
      selectedRows: [],       //选中的行信息
      pagination:true     //表格是否分页
    };
  }

  componentWillMount() {
    //设置每页多少条
    const { size, selected } = this.props;
    if (size !== undefined) {
      this.setState({
        size: size,
      });
    }
    if (Func.notEmpty(selected)) {
      let va = {};
      selected.map(a => {
        va = {
          ...va,
          [a]: [],
        };
        return va;
      });
      this.state = {
        current: 1,
        size: size,
        formValues: {},      //查询表单
        total: 10,
        loading: true,     //页面是否加载中
        list: [],           //数据列表
        selectedRowKeys: [],   //选中的行key
        selectedRows: [],       //选中的行信息
        ...va,
      };
    }
    this.handleSearch();

  }

  componentDidMount() {

    let { selected } = this.props;
    if (Func.notEmpty(selected)) {
      selected.map(v => {
        dict({ code: v }).then((a) => {
          this.setState({
            ...this.state,
            [v]: a.data,
          });
        });
      });
    }

  }

  componentWillReceiveProps(nextProps) {
    const {searchParams} = nextProps;
    if (Func.isEmpty(searchParams)){
    }else {
      if (searchParams !== this.props.searchParams && JSON.stringify(searchParams) !== JSON.stringify(this.props.searchParams)){
        this.handleFormReset();
      }
    }
  }

  //关闭弹窗
  handleCancel = (selectedRows) => {
    const { handleClose } = this.props;
    if (handleClose === undefined) {
      message.warn('SearchDataTable组件未传入必需参数handleClose!');
    } else {
      // this.handleFormReset();
      handleClose(selectedRows);
    }

  };

  //点击弹窗的确定
  handleOk = () => {
    const { paramValue, onAffirm } = this.props;
    if (Func.notEmpty(paramValue) && Func.notEmpty(onAffirm)) {
      if (Func.isEmpty(paramValue.key)) {
        message.warn('SearchDataTable组件未传入必需参数paramValue!');
      } else {
        const keyValue = this.state.selectedRowKeys;

        if (keyValue.length === 0) {
          message.warn('请选择数据！');
          return;
        }
        const selectedRows = this.state.selectedRows;

        const key = paramValue.key;
        const f = onAffirm(selectedRows);

        if (f === undefined) {

        } else {
          f.setFieldsValue({
            [key]: keyValue.toString(),
          });
          const otherKey = paramValue.otherKey;
          if (Func.notEmpty(otherKey) && Func.notEmpty(paramValue.otherValue)) {
            const o = paramValue.otherValue;
            otherKey.split(',').map((value, index, array) => {
              let otherValue = [];
              for (let i = 0; i < selectedRows.length; i += 1) {
                if (Func.isEmpty(selectedRows[i][(o.split(","))[index]])){
                  otherValue.push("");
                }else {
                  otherValue.push(selectedRows[i][(o.split(","))[index]].toString());
                }

              }
              f.setFieldsValue({
                [value]: otherValue.toString(),
              });
            });
          }
        }
        this.handleCancel(selectedRows);
      }
    } else {
      message.warn('SearchDataTable组件未传入必需参数!');
      //   this.handleCancel();
    }
  };

  //查询按钮点击
  handleSearch = (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const { form } = this.props;
    form.validateFields(async (err, fieldsValue) => {
      if (err) {
        return;
      }
      const values = {
        ...fieldsValue,
      };

      await this.setState({
        formValues: values,
      });

      this.refreshTable(true);
    });
  };

  //重置
  handleFormReset = async () => {
    const { form } = this.props;
    form.resetFields();
    await this.setState({
      current: 1,
      size: this.state.size,
      selectedRowKeys: [],   //选中的行key
      selectedRows: [],       //选中的行信息
      formValues: {},
    });
    this.refreshTable();
  };

  //设置查询参数
  refreshTable = (firstPage = false) => {
    const { current, size, formValues } = this.state;
    const params = {
      current: firstPage ? 1 : current,
      size,
      ...formValues,
    };
    this.searchList(params);
  };

  // 回调函数，切换下一页
  changePage(current) {
    const { formValues } = this.state;
    const params = {
      current: current,
      size: this.state.size,
      ...formValues,
    };
    //查询加载等待
    this.setState({
      loading: true,
    });
    this.searchList(params);
  }

  //后台查询
  async searchList(params) {
    const { searchPath, searchParams } = this.props;
    if (searchPath === undefined || searchPath === '') {
      return;
    }
    let p = {
      ...params,
    };
    if (searchParams !== undefined) {
      p = {
        ...params,
        ...searchParams,
      };
    }

    const response = await requestListApi(searchPath, p);
    if (response !== undefined) {
      if (response.success) {
        // console.log(response.data)
        if(typeof response.data === 'string'){  // 对接接口回传数据
          const data = response.data
          this.setState(
            {
              list: Func.notEmpty(data)?JSON.parse(data):[],
              pagination: false,
              loading: false,
            },
          );
        }else {
          this.setState(
            {
              list: response.data.records,
              total: response.data.total,
              current: response.data.current,
              size: response.data.size,
              loading: false,
            },
          );
        }

      }
    }
  }

  //查询表单
  renderSearchForm = onReset => {

    const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 16 },
      },
    };

    const formItemLayout1 = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
      wrapperCol: {
        // xs: { span: 24},
        sm: { span: 10 },
        // md: { span: 10 },
      },
    };

    const { form } = this.props;
    const { getFieldDecorator } = form;
    let { searchConditionLabel, searchConditionCode, selectedLabel, selectedCode, selected ,searchConditions } = this.props;
    if ((Func.isEmpty(searchConditionLabel) || Func.isEmpty(searchConditionCode) && Func.notEmpty(searchConditions))) {
      const queryItem = getQueryConf(searchConditions,form,{})
      return (
        <div>
          {queryItem}
          <Row>
            <Col>
              <div style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onReset}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>
        </div>
      );
    } else {
      return (
        <div>
          <Row>
            {
              searchConditionLabel.map((name, index) => {
                return (
                  index === 0 ?
                    <Col span={6}>
                      <FormItem  {...formItemLayout} label={name}>
                        {getFieldDecorator(searchConditionCode[index])(<Input autoFocus />)}
                      </FormItem>
                    </Col>
                    :
                    <Col span={6}>
                      <FormItem  {...formItemLayout} label={name}>
                        {getFieldDecorator(searchConditionCode[index])(<Input />)}
                      </FormItem>
                    </Col>
                );
              })
            }
            {
              Func.notEmpty(selected)
                ?
                selected.map((code, index) => {
                  return (
                    <Col span={7}>
                      <FormItem {...formItemLayout1} label={selectedLabel[index]}>
                        {getFieldDecorator(selectedCode[index])(
                          <Select style={{ width: '300%' }}>
                            {this.state[code].map(d => (
                              <Select.Option key={d.dictKey} value={d.dictKey}>
                                {d.dictValue}
                              </Select.Option>
                            ))}
                          </Select>,
                        )}
                      </FormItem>
                    </Col>
                  );

                })
                :
                <div></div>
            }
            <Col>
              <div style={{ float: 'right' }}>
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
                <Button style={{ marginLeft: 8 }} onClick={onReset}>
                  重置
                </Button>
              </div>
            </Col>
          </Row>

        </div>
      );
    }
  };

  render() {
    let { selectType, rowKey, titel, popupwidth, visible, footer } = this.props;
    //单选还是多选   默认单选
    if (selectType === undefined) {
      selectType = 'radio';
    }
    //选中行后保存的属性   默认为id
    if (rowKey === undefined) {
      rowKey = 'id';
    }
    //弹出框名称
    if (titel === undefined) {
      titel = '';
    }
    //弹出框宽度   默认1000
    if (popupwidth === undefined) {
      popupwidth = 1000;
    }
    if (footer === undefined) {
      footer = true;
    }

    let { selectedRowKeys, selectedRows, list, loading,pagination } = this.state;

    // 表格分页属性
    const paginationProps = {
      showSizeChanger: false,
      showQuickJumper: false,
      pageSize: this.state.size,
      current: this.state.current,
      total: this.state.total,
      // onShowSizeChange: (current,pageSize) => this.changePageSize(pageSize,current),
      onChange: (current) => this.changePage(current),
      showTotal: () => `共${this.state.total}条`,
    };

    // console.log(selectedRowKeys,selectedRows)
    // selectType = "checkbox"
    const rowSelection = {
      selectedRowKeys: selectedRowKeys,
      selectedRows: selectedRows,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({
          selectedRowKeys: selectedRowKeys,
          selectedRows: selectedRows,
        });
      },
      type: selectType,
    };


    //表头
    let columns = [];
    const { colName, colCode } = this.props;
    if (Func.notEmpty(colName) && Func.notEmpty(colCode)) {
      for (let i = 0; i < colName.length; i += 1) {
        columns.push(
          {
            key: colCode[i],
            title: colName[i],
            dataIndex: colCode[i],
            // render: text => <a>{text}</a>,
          });
      }
    }

    if (footer) {
      return (
        <div>
          <Modal
            title={titel}
            width={popupwidth}
            visible={visible}
            confirmLoading={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            cancelText="取消"
            destroyOnClose
          >
            <SearchBox onSubmit={this.handleSearch} onReset={this.handleFormReset}>
              {this.renderSearchForm(this.handleFormReset)}
            </SearchBox>
            <Table
              onRow={(record, rowkey) => {
                return {
                  onClick: () => {
                    selectedRowKeys = [];
                    selectedRows = [];
                    selectedRows.push(record);
                    selectedRowKeys.push(`${record[rowKey]}`);
                    this.setState({
                      selectedRowKeys: selectedRowKeys,
                      selectedRows: selectedRows,
                    });
                  },
                  // onClick : this.click.bind(this,record,rowkey)    //点击行 record 指的本行的数据内容，rowkey指的是本行的索引
                };
              }}
              onRowDoubleClick={
                (record) => {
                  selectedRowKeys = [];
                  selectedRows = [];
                  this.setState({
                    selectedRowKeys: record[rowKey],
                    selectedRows: record,
                  });
                  this.handleOk();
                }
              }
              tableLayout='fixed'
              rowKey={rowKey}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={list}
              pagination={pagination?paginationProps:false}
              loading={loading}
              scroll={{x:1600, y: 300 }}
              size='small'
            />
          </Modal>
        </div>
      );
    } else {
      return (
        <div>
          <Modal
            title={titel}
            width={popupwidth}
            visible={visible}
            confirmLoading={false}
            onOk={this.handleOk}
            onCancel={this.handleCancel}
            okText="确认"
            cancelText="取消"
            footer={null}
          >
            <SearchBox onSubmit={this.handleSearch} onReset={this.handleFormReset}>
              {this.renderSearchForm(this.handleFormReset)}
            </SearchBox>
            <Table
              rowKey={rowKey}
              rowSelection={rowSelection}
              columns={columns}
              dataSource={list}
              pagination={pagination?paginationProps:false}
              loading={loading}
            />
          </Modal>
        </div>
      );
    }


  }
}
