import React, { Fragment, PureComponent } from 'react';
import { Card, Divider, Modal } from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import router from 'umi/router';
import { Toast } from 'antd-mobile';
import { getButton } from '../../utils/authority';
import styles from './SwordPage.less';
import ToolBar from './ToolBar';
import SearchBox from './SearchBox';
import StandardTable from '../StandardTable';
import { requestApi } from '../../services/api';
import MyModal from '@/components/Util/MyModal';
import { SHOW_TOTAL_SIMPLE } from '../../utils/PaginationShowTotal';
import Func from '@/utils/Func';

// Grid组件双击列表行打开弹出框
// 新增props
// modaltitel弹出框titel
// openmodal                                     是否允许行双击打开弹出框    true允许   默认false
// popupContent                                 弹出框内容组件
// popupwidth                                      弹出框宽度                  默认'1500'
// height                                              弹出框高度                  默认'700'
// top                                                   距离顶部距离                默认'20'
// handleResets        返回查询，保留参数以及清空选中
// isfangdaDisplay     是否显示放大按钮
// selectType     单选双选

export default class Grid extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
      buttons: getButton(props.code),
      photovisible : false,
      selectRow: [],
    };
    this.handlepage();
  }

  componentWillMount() {
    const {handleResets} = this.props;
    if (handleResets){
      handleResets(this.handleReset)
    }
  }

  componentDidMount() {
    this.handleSearch();

  }

  // 新增数据重新渲染页面之后再统计返回数据条数
  componentDidUpdate(){
    this.handlepage();
  }

  handlepage = () => {
    const { data } = this.props;

    if (data !== undefined && data.pagination !== undefined) {
      const { pagination } = data;
      if (pagination){
        if (pagination.showTotals === undefined || pagination.showTotals){
          if(pagination.total) {pagination.showTotal = () => SHOW_TOTAL_SIMPLE(pagination.total) ; }
          // if (pagination.showTotals !== false){
          // }
        }
      }
    }


  }

  handleSearch = e => {
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

  handleReset = () =>{
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
        selectedRows: [],
      });
      this.refreshTable();
    });
  }

  handleFormReset = async () => {
    const { form, onReset } = this.props;
    form.resetFields();
    await this.setState({
      current: 1,
      size: 10,
      formValues: {},
      selectedRows: [],
    });
    if (onReset) {
      onReset();
    }
    this.refreshTable();
  };

  handleStandardTableChange = async pagination => {
    await this.setState({
      current: pagination.current,
      size: pagination.pageSize,
    });

    this.refreshTable();
  };

  refreshTable = (firstPage = false) => {
    const { onSearch } = this.props;
    const { current, size, formValues } = this.state;

    const params = {
      current: firstPage ? 1 : current,
      size,
      ...formValues,
    };
    if (onSearch) {
      onSearch(params);
    }
  };

  handleSelectRows = rows => {
    this.setState({
      selectedRows: rows,
    });

    const { onSelectRow } = this.props;
    if (onSelectRow) {
      onSelectRow(rows);
    }
  };

  clearSelectKeys = () => {
    this.setState({
      selectedRows: [],
    });
  }

  getSelectKeys = () => {
    const { selectedRows } = this.state;
    const { pkField = 'id', childPkField = 'id' } = this.props;
    return selectedRows.map(row => {
      const selectKey = row[pkField] || row[childPkField];
      if (`${selectKey}`.indexOf(',') > 0) {
        return `${selectKey}`.split(',');
      }
      return selectKey;
    });
  };

  handleToolBarClick = btn => {
    const { selectedRows } = this.state;
    const keys = this.getSelectKeys();
    this.handleClick(btn, keys, selectedRows);
  };

  handleClick = (btn, keys = [], rows) => {
    const { path, alias } = btn;
    const { btnCallBack,selectcustomKey } = this.props;
    const refresh = (temp = true) => this.refreshTable(temp);
    const clearKeys = () => this.clearSelectKeys();

    const {formValues } = this.state;
    localStorage.setItem("formValues",JSON.stringify(formValues))

    if (alias === 'add') {
      if (keys.length >= 1) {
        // Toast.info('该记录无法新增信息')
        router.push(path);
      }else{
        router.push(path);
      }
      return;
    }
    if (alias === 'adds') {

      if (keys.length > 1) {
        Toast.fail('父记录只能选择一条!')
        return;
      }
      if (keys.length === 1) {
        router.push(`${path}/${keys[0]}`);
        return;
      }
      router.push(path);
      return;
    }
    if (alias === 'edit') {
      if (keys.length <= 0) {
        Toast.fail('请先选择一条数据!')
        return;
      }
      if (keys.length > 1) {
        Toast.fail('只能选择一条数据!')
        return;
      }
      router.push(`${path}/${keys[0]}`);
      return;
    }

    if (alias === 'edits') {
      if (keys.length <= 0) {
        Toast.fail('请先选择一条数据!')
        return;
      }
      if (keys.length > 1) {
        Toast.fail('只能选择一条数据!')
        return;
      }
      if(Func.notEmpty(selectcustomKey)){
        router.push(`${path}/${rows[0][selectcustomKey]}`);
      }
      return;
    }

    if (alias === 'view') {
      if (keys.length <= 0) {
        Toast.fail('请先选择一条数据!')
        return;
      }
      if (keys.length > 1) {
        Toast.fail('只能选择一条数据!')
        return;
      }
      router.push(`${path}/${keys[0]}`);
      return;
    }
    if (alias === 'delete') {
      if (keys.length <= 0) {
        Toast.fail('请先选择要删除的记录!')
        return;
      }

      Modal.confirm({
        title: '删除确认',
        content: '确定删除选中记录?',
        okText: '确定',
        okType: 'danger',
        cancelText: '取消',
        async onOk() {
          const response = await requestApi(path, { ids: keys.join(',') });
          if (response.success) {
            Toast.success(response.msg)
            clearKeys();
            refresh();
          } else {
            Toast.fail(response.msg || '删除失败')
          }
        },
        onCancel() {},
      });
      return;
    }
    if (btnCallBack) {
      btnCallBack({ btn, keys, rows, refresh });
    }
  };

  handleCancel = () => {
    this.setState({
      photovisible: false,
    });
  };

  render() {
    const { buttons, selectedRows } = this.state;
    const {
      loading = false,
      rowKey,
      pkField,
      childPkField,
      data,
      scroll,
      tblProps,
      cardProps,
      actionColumnWidth,
      renderSearchForm,
      renderLeftButton,
      renderRightButton,
      renderActionButton,
    } = this.props;
    let {popupwidth,popupContent,modaltitel,top,height,isfangdaDisplay}=this.props;
    let { columns,selectType } = this.props;

    if (Func.isEmpty(popupContent)){
      popupContent = (param)=>{
      }
    }

    if (Func.isEmpty(isfangdaDisplay)){
      isfangdaDisplay = true;
    }

    // 弹出框宽度
    if (Func.isEmpty(popupwidth)){
      popupwidth = '0.6';
    }

    // 弹出框高度
    if (Func.isEmpty(height)){
      height = '0.8';
    }

    let maxtop = 30;
    if (Func.isEmpty(top)){
      top = 20;
    }else {
      maxtop = top+10;
    }

    // 弹出框titel
    if (Func.isEmpty(modaltitel)){
      modaltitel = ''
    }


    const actionButtons = buttons.filter(button => button.action === 2 || button.action === 3);

    if (columns && Array.isArray(columns) && (actionButtons.length > 0 || renderActionButton)) {
      const key = pkField || rowKey || 'id';
      columns = [
        ...columns,
        {
          title: formatMessage({ id: 'table.columns.action' }),
          width: actionColumnWidth || 110,
          render: (text, record) => (
            <Fragment>
              <div style={{ textAlign: 'center' }}>
                {actionButtons.map((button, index) => (
                  <Fragment key={button.code}>
                    {index > 0 ? <Divider type="vertical" /> : null}
                    <a
                      title={formatMessage({ id: `button.${button.alias}.name` })}
                      onClick={() =>
                        this.handleClick(button, [record[childPkField || key]], [record])
                      }
                    >
                      <FormattedMessage id={`button.${button.alias}.name`} />
                    </a>
                  </Fragment>
                ))}
                {renderActionButton ? renderActionButton() : null}
              </div>
            </Fragment>
          ),
        },
      ];
    }

    const {photovisible,selectRow} = this.state;
    let {openmodal} = this.props;
    if (openmodal === undefined){
      openmodal = false;
    }
    return (
      <Card bordered={false} {...cardProps}>
        <div className={styles.swordPage}>
          <SearchBox onSubmit={this.handleSearch} onReset={this.handleFormReset}>
            {renderSearchForm(this.handleFormReset)}
          </SearchBox>
          <ToolBar
            buttons={buttons}
            renderLeftButton={renderLeftButton}
            renderRightButton={renderRightButton}
            onClick={this.handleToolBarClick}
          />
          {
            selectType === "radio" ?
              <StandardTable
                rowKey={rowKey || 'id'}
                selectedRows={selectedRows}
                loading={loading}
                columns={columns}
                data={data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scroll={scroll}
                tblProps={tblProps}
                size="middle"
                bordered
                selectType={selectType}
                onRowDoubleClick={
                  (record) => {
                    if (openmodal){
                      this.setState({
                        photovisible : true,
                        selectRow: record,
                      })
                    }
                  }
                }
                rowClassName={record => {
                  let className = "";
                  if (record.isyushen !== undefined && record.isyushen === 0){
                    className = styles.yellow;
                  }else if (record.auditResult !== undefined){
                    if (record.auditResult === 0){
                      className = styles.blue;
                    }
                    if (record.auditResult === 2){
                      className = styles.red;
                    }
                  }
                  return className;
                }}
              />
              :
              <StandardTable
                rowKey={rowKey || 'id'}
                selectedRows={selectedRows}
                loading={loading}
                columns={columns}
                data={data}
                onSelectRow={this.handleSelectRows}
                onChange={this.handleStandardTableChange}
                scroll={scroll}
                tblProps={tblProps}
                size="middle"
                bordered
                selectType="checkbox"
                onRowDoubleClick={
                  (record) => {
                    if (openmodal){
                      this.setState({
                        photovisible : true,
                        selectRow: record,
                      })
                    }
                  }
                }
                rowClassName={record => {
                  let className = "";
                  if (record.isyushen !== undefined && record.isyushen === 0){
                    className = styles.yellow;
                  }else if (record.auditResult !== undefined){
                    if (record.auditResult === 0){
                      className = styles.blue;
                    }
                    if (record.auditResult === 2){
                      className = styles.red;
                    }
                  }
                  return className;
                }}
              />
          }

          <MyModal
            top={top}
            modaltitel={modaltitel}
            visible={photovisible}
            onCancel={this.handleCancel}
            popupContent={popupContent}
            selectRow={selectRow}
            popupwidth={popupwidth}
            height={height}
            isfangdaDisplay={isfangdaDisplay}
          />
        </div>
      </Card>
    );
  }
}
