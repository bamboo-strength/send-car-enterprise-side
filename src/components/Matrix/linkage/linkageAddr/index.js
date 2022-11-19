import React, { Component } from 'react';
import PropTypes from 'prop-types';
import LinkBase from '../linkageBase';
// import { provList, cityList, areaList } from './js/metadata.js';

export default class index extends Component {

  static propTypes = {
    initVal: PropTypes.array,
    isShow: PropTypes.bool.isRequired,
    cancelText: PropTypes.string,
    confirmText: PropTypes.string,
    emitConfirm: PropTypes.func,
    emitCancel: PropTypes.func,
    emitOver: PropTypes.func,
    emitInit: PropTypes.func
  };

  static defaultProps = {
    initVal: [],
    cancelText: '取消',
    confirmText: '确定',
    emitConfirm: () => {},
    emitCancel: () => {},
    emitOver: () => {},
    emitInit: () => {}
  };

  constructor(props) {
    super(props);
    const provList = props.dataSource
    const cityList = props.dataSource[0].children
    const areaList = props.dataSource[0].children[0].children
    this.state = {
      list: [provList, cityList, areaList],
      linkageVal: [],
      lastIndex: '',
      provList,
    };
  }
  
  // componentDidMount() {
  //   this.handleInitPos();
  // }
  componentDidUpdate(prevProps) {
    if (prevProps.initVal.length !== this.props.initVal.length) {
      this.handleInitPos();
    }
  }

  handleInitPos = () => {
    const { initVal } = this.props;
    const { provList } = this.state;
    if (!initVal.length) {
      return;
    }
    const [prov, city, area] = initVal;
    const oProv = provList.find(item => item.value === prov);
    // if (oProv === undefined) {
    //   return;
    // }

    const oCity = oProv.children.find(item => item.value === city);
    // if (oCity === undefined) {
    //   return;
    // }

    const oArea = oCity.children?.find(item => item.value === area);
    // if (oArea === undefined) {
    //   return;
    // }

    this.setState({ list: [provList, oProv.children, oCity.children || [oCity]] });
  };

  handleConfirm = e => {
    this.props.emitConfirm(e);
  };

  handleCancel = e => {
    this.props.emitCancel(e);
  };

  handleOver = e => {
    const { which, meta, index, bool } = e;
    const str = String(index);
    this.props.emitOver(e);

    // 这步判断是必须的，防止获取不到数据报错
    if (!bool) {
      return;
    }

    if (which === 0) {
      const citys = meta[0].children || [];
      const areas = citys[0].children || [{title: citys[0].title, value: citys[0].value}];
      const cityVal = citys[0]?.title || null;
      const areaVal = areas[0]?.title || null;

      if (this.state.lastIndex !== str) {
        this.setState({
          list: [this.state.list[0], citys, areas],
          linkageVal: [null, cityVal, areaVal]
        });
      }
    } else if (which === 1) {
      const areas = meta[1].children || [];
      const areaVal = areas[0]?.title || null;

      if (this.state.lastIndex !== str) {
        this.setState({
          list: [this.state.list[0], this.state.list[1], areas],
          linkageVal: [null, null, areaVal]
        });
      }
    }
    // 记录上次的联动索引，用以判断当前操作是否联动数据
    this.setState({ lastIndex: str });
  };

  handleInit = e => {
    this.setState({ lastIndex: String(e.index) });
    this.props.emitInit(e);
  };

  render() {
    const {
      props,
      state: { list, linkageVal },
      handleConfirm,
      handleCancel,
      handleOver,
      handleInit
    } = this;

    return <LinkBase {...props} list={list} linkageVal={linkageVal} emitConfirm={e => handleConfirm(e)} emitCancel={e => handleCancel(e)} emitOver={e => handleOver(e)} emitInit={e => handleInit(e)} />;
  }
}
