import React, { PureComponent } from 'react';
import { EmptyData, InTheLoad } from '@/components/Stateless/Stateless';
import { ListView, PullToRefresh } from 'antd-mobile';
import PropTypes from 'prop-types';

class MatrixListView extends PureComponent {
  constructor(props) {
    super(props);
    const getSectionData = (dataBlob, sectionID) => dataBlob[sectionID];
    // 创建ListViewDataSource对象
    const dataSource = new ListView.DataSource({
      getSectionHeaderData: getSectionData,
      rowHasChanged: (row1, row2) => row1 !== row2, // rowHasChanged(prevRowData, nextRowData); 用其进行数据变更的比较
    });
    this.state = {
      loading: true,
      isLoading: true,
      refreshing: true,
      onScrollChanges: true,
      dataSource,
      realdata: [],
      hasMore: true,
      pageNo: 1,
      pageSize: props.pageSize || 5,
      param:props.param,
      total:null,
      formValues:{}
    };
  }

  componentDidMount() {
    this.getData(true);
    const {onRef} = this.props
    if (onRef) onRef(this)
  }

  /* 外部调用接口 */
  onAgain = (formValues,type)=>{
    const {param} = this.props
    this.setState({
      param,
      loading:true,
      formValues
    },()=>{
      this.getData(true,type);
    })
  }

  /* 解决和时间组件滑动穿透问题 */
  slipThroughs = (e) =>{
    this.setState({
      onScrollChanges:e
    })
  }

  /* 调用接口 */
  getData = (ref = false,type) => {
    const { interfaceUrl,RetrieveData } = this.props;
    const { pageNo, pageSize, realdata,param,formValues } = this.state;
    const params = {
      current: pageNo,
      size: pageSize,
      ...param,
      ...formValues,
    };
    if(type === 'refresh'){ // 外层点击查询时 重置current
      params.current = 1
    }
    if (!interfaceUrl) {
      console.log('请传入接口数据！');
      return;
    }
    interfaceUrl(params).then(item => {
      this.setState({
        loading: false,
      });
      if (item.success){
        const { dataSource } = this.state;
        let tempdata = ''
        // RetrieveData 在父组件定义返回来的数据从哪里取值
        if (RetrieveData){
          tempdata = RetrieveData(item)
        }else {
          tempdata = item.data?.records || item.data;
        }
        const len = tempdata.length;
        if (len <= 0) { // 判断是否已经没有数据了
          this.setState({
            refreshing: false,
            isLoading: false,
            hasMore: false,
            total:item.data.total
          });
        }
        if (ref) { // 下拉刷新
          // 下拉刷新的情况，重新添加数据即可(这里等于只直接用了第一页的数据)
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(tempdata), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            hasMore: true, // 下拉刷新后，重新允许开下拉加载
            refreshing: false, // 是否在刷新数据
            isLoading: false, // 是否在加载中
            realdata: tempdata, // 保存数据进state，在下拉加载时需要使用已有数据
            total:item.data.total
          });
        } else { // 上拉加载
          // 合并state中已有的数据和新增的数据
          const dataArr = realdata.concat(tempdata); // 关键代码
          this.setState({
            pageNo,
            dataSource: dataSource.cloneWithRows(dataArr), // 数据源中的数据本身是不可修改的,要更新datasource中的数据，请（每次都重新）调用cloneWithRows方法
            refreshing: false,
            isLoading: false,
            realdata: dataArr, // 保存新数据进state
            total:item.data.total
          });
        }
      }

    });
  };

  // 下拉刷新
  onRefresh = () => {
    const {param} = this.props
    this.setState({
      refreshing: true,
      isLoading: true,
      pageNo: 1, // 刷新嘛，一般加载第一页，或者按你自己的逻辑（比如每次刷新，换一个随机页码）
      param
    }, () => {
      this.getData(true);
    });
  };

  // 滑动到底部时加载更多
  onEndReached = () => {
    const { isLoading, hasMore, pageNo } = this.state;
    // 加载中或没有数据了都不再加载
    if (isLoading && !hasMore) {
      return;
    }
    this.setState({
      isLoading: true,
      pageNo: pageNo + 1, // 加载下一页
    }, () => {
      this.getData(false);
    });
  };

  renderHeader = () => {
    const {renderHeader} = this.props
    const {total} = this.state
    if (renderHeader) {
      return renderHeader(total)
    }
  }

  render() {
    const { row, defaultText, className, round,heights,dontShow,placeholder,renderHeader} = this.props;
    const { loading, dataSource, isLoading, onScrollChanges, refreshing } = this.state;
    const { _cachedRowCount } = dataSource;
    const height = `calc( 100vh - ${ heights || 200}px)`;
    const separator = (sectionID, rowID) => !dontShow && (
      <div
        key={`${sectionID}-${rowID}`}
        style={{
          backgroundColor: '#f0f2f5',
          height: 8,
        }}
      />
    );

    return (
      loading ? <InTheLoad height={height} /> : (
        _cachedRowCount !== 0 ? (
          <ListView
            ref={el => {
              this.lv = el;
            }}
            dataSource={dataSource}
            pullToRefresh={onScrollChanges ? <PullToRefresh refreshing={refreshing} onRefresh={this.onRefresh} /> : false}
            renderFooter={() => (
              <div style={{ padding: 30, textAlign: 'center' }}>
                {isLoading ? '加载中' : '加载完毕'}
              </div>)}
            renderHeader={renderHeader && this.renderHeader}
            renderRow={row}
            useBodyScroll
            renderSeparator={!round && separator}
            style={{ overflow: 'auto' }}
            distanceToRefresh='20'
            scrollRenderAheadDistance={500}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={10}
            className={round ? 'list-view-round' : className}
            pageSize={5}
          />
        ) : <EmptyData text={placeholder || `暂无${defaultText || ''}${ defaultText ? (!defaultText.includes('记录') ? '记录' :''):'记录'}`} height={height} />
      )
    );
  }
}

MatrixListView.defaultProps = {
  param: {},
  row: () => <div style={{ textAlign: 'center', padding: 10 }}>请传入数据源</div>,
};

MatrixListView.propTypes = {
  param: PropTypes.object,
  row: PropTypes.func,
};


export default MatrixListView;
