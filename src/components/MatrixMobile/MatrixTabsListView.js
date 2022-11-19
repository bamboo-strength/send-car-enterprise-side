import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NoticeBar, Tabs } from 'antd-mobile';
import MatrixListView from '@/components/MatrixMobile/MatrixListView';

class MatrixTabsListView extends PureComponent {

  constructor(props) {
    super(props);
    this.state = {
      tabKey: props.tabs.length !== 0 && props.tabs[0].key,
      defaultText:props.tabs.length !== 0 && props.tabs[0].title
    }
  }

  componentDidMount() {
    const {onRef} = this.props
    if (onRef) onRef(this)
  }

  /* 重新调用MatrixListView组件接口 */
  onChoose = (formValues,type) =>{
    if (this.child) this.child.onAgain(formValues,type)
  }

  /* 解决和时间组件滑动穿透问题 */
  slipThrough = (e) =>{
    if (this.child) this.child.slipThroughs(e)
  }

  /* 切换tab */
  changeTab = (tab) => {
    this.setState({
      tabKey: tab.key,
      defaultText:tab.title
    });
    const {changeTab} = this.props
    if (changeTab) changeTab(tab.key)
  };

  onRef = ref =>{
    this.child = ref
  }

  render() {
    const {tabs,param,options,noTabKey,tabKeyName,theTabKey,form,otherTab} = this.props
    const {tabKey,defaultText} = this.state
    /* noTabKey 判断是否带tab值查询接口 */
    const params = noTabKey ? param: { [tabKeyName]:tabKey , ...param }
    return (
      <div>
        <Tabs tabs={tabs} onChange={(tab, index) => this.changeTab(tab, index)} swipeable={false} activeKey={tabKey}>
          {
            tabs.map(item => {
              return (
                <div key={item.key}>
                  {tabKey === item.key && (
                      item.key === 'otherTab'?otherTab:
                      <div>
                        {
                          theTabKey == 4 ?
                            <NoticeBar marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }} mode="closable">
                              温馨提示：中拍的活动请在中拍之时起3天内完成竞价合同签约，超时将被加入黑名单，无法再参与秒杀活动。
                            </NoticeBar> : ''
                        }
                        {options && options}
                        <MatrixListView {...this.props} onRef={this.onRef} defaultText={defaultText} param={params} form={form} />
                      </div>
                  )}
                </div>)
            })
          }
        </Tabs>
      </div>
    );
  }
}

MatrixTabsListView.defaultProps = {
  tabs:[],
  param:{}
}

MatrixTabsListView.propTypes = {
  tabs:PropTypes.array,
  param:PropTypes.object
};

export default MatrixTabsListView;
