import React, { PureComponent } from 'react';
import { connect } from 'dva';
import { Button, Col, Form, Input, Row, Select, DatePicker, Tag} from 'antd';
import { formatMessage, FormattedMessage } from 'umi/locale';
import { List } from 'antd-mobile';
import { NOTICE_INIT, NOTICE_LIST } from '../../../actions/notice';
import func from '../../../utils/Func';
import { clientId } from '../../../defaultSettings';
import MatrixListView from '../../../components/Matrix/MatrixListView';
import MatrixSelect from '@/components/Matrix/MatrixSelect';

const FormItem = Form.Item;
const { RangePicker } = DatePicker;

@connect(({ notice, loading }) => ({
  notice,
  loading: loading.models.notice,
}))
@Form.create()
class Notice extends PureComponent {

  // ============ 初始化数据 ===============
  componentWillMount() {
    const { dispatch } = this.props;
    dispatch(NOTICE_INIT());

  }

  // ============ 查询 ===============
  getData = params => {
    const { dispatch } = this.props;
    const { dateRange } = params;
    let payload = {
      ...params,
    };
    if (dateRange) {
      payload = {
        ...params,
        releaseTime_gt: dateRange ? func.format(dateRange[0], 'YYYY-MM-DD hh:mm:ss') : null,
        releaseTime_lt: dateRange ? func.format(dateRange[1], 'YYYY-MM-DD hh:mm:ss') : null,
      };
      payload.dateRange = null;
    }
    dispatch(NOTICE_LIST(payload));
  };

  // ============ 查询表单 ===============
  renderSearchForm = onReset => {
    const formItemLayout = {
      labelCol: {
        xs: { span: 8 },
        sm: { span: 8 },
      },
      wrapperCol: {
        xs: { span: 16 },
        sm: { span: 11 },
        md: { span: 9 },
      },
    };
    const {
      form,
    } = this.props;
    const { getFieldDecorator } = form;

    return (
      <List style={{fontSize:'15px'}} className='static-list'>
        <Col span={24} className='add-config'>
          <MatrixSelect label={<FormattedMessage id="desk.notice.category" />} id="category" placeholder={formatMessage({ id: 'desk.notice.category.placeholder' })} form={form} dictCode='notice' style={{width:'100%'}} />
        </Col>
        <Col span={24} className='add-config'>
          <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.title" />}>
            {getFieldDecorator('title')(
              <Input placeholder={formatMessage({ id: 'desk.notice.title.placeholder' })} />
            )}
          </FormItem>
        </Col>
        {/* <Col span={24} className='add-config'>
          <FormItem {...formItemLayout} label={<FormattedMessage id="desk.notice.date" />}>
            {getFieldDecorator('dateRange')(
              <RangePicker
                placeholder={[
                  formatMessage({ id: 'desk.notice.date.start' }),
                  formatMessage({ id: 'desk.notice.date.end' }),
                ]}
                style={{ width: '100%' }}
              />
            )}
          </FormItem>
        </Col>
*/}
      </List>
    );
  };

  render() {
    const code = 'notice';

    const {
      form,
      notice: { data },location
    } = this.props;
    let notice = '';
    let aa = location.state === undefined;
    if (aa === true){
      notice = "";
    }else {
      notice = location.state.notice
    }
    const rows = [
      {
        key: formatMessage({ id: 'desk.notice.title' }),
        value: 'title',
        sorter: (a, b) => a.title.length - b.title.length,
      },
      {
        key: formatMessage({ id: 'desk.notice.category' }),
        value: 'categoryName',
        sorter: (a, b) => a.category - b.category,
      },
      {
        key: formatMessage({ id: 'desk.notice.content' }),
        value: 'content',
        sorter: (a, b) => a.content.length - b.content.length,
      },
      {
        key: formatMessage({ id: 'desk.notice.date' }),
        value: 'releaseTime',
        sorter: (a, b) => Date.parse(a.releaseTime) - Date.parse(b.releaseTime),
      },
    ];
    return (
      <MatrixListView
        data={data}
        navName='通知公告'
        rows={rows}
        form={form}
        code={code}
        renderSearchForm={this.renderSearchForm}
        getDataFromPa={this.getData}
        addPath="/desk/notice/add"
        notice={notice}
        notAdd={clientId !== 'kspt'}
        backUrl={location.state?location.state.backUrl:'/dashboard/function'}
      />
    );
  }
}
export default Notice;
