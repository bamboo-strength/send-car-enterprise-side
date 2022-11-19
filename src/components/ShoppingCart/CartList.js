import React, { Component } from 'react';
import Text from 'antd/es/typography/Text';
import { Card, Checkbox, Icon } from 'antd';
import style from '@/pages/ShopCenter/ShopCenter.less';
import CheckboxGroup from 'antd/es/checkbox/Group';
import '../../pages/ShopCenter/ShopCenter.less';
import CartListRound from '@/components/ShoppingCart/CartListRound';
import { Toast, Modal } from 'antd-mobile';
import { SHOPPING_SHOPCART_REMOVEBYIDS } from '@/actions/shoppingMall';
import { connect } from 'dva';
import { router } from 'umi';
import { ImageLoadFailed } from '@/components/Matrix/image';

const { alert } = Modal;

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
class CartList extends Component {

  constructor(props) {
    super(props);
    this.state = {
      checkedlist: [],
      checked: false,
      isEditor: props.isEditor,
      orderlist: [],
      data: props.data,
      isEditors: props.isEditor,
    };
  }

  componentDidMount() {
    const { onRef } = this.props;
    onRef(this);
  }

  componentWillReceiveProps(nextProps) {
    const { data } = this.state;
    this.setState({
      isEditors: nextProps.isEditor,
    });
    if (nextProps.data !== data) {
      this.setState({
        data: nextProps.data,
      });
    }
  }

  /* 全选事件 */
  onSelectAll = (e) => {
    const { list } = this.props;
    this.setState({
      isEditor: true,
    });
    const cc = [];
    list.map(item => {
      return item.orderlist.map(i => {
        this.setState({
          checked: e.target.checked ? i.subId : '',
        });
        return i.deputylist.map(j => {
          cc.push(j.id);
          return cc;
        });
      });
    });
    this.setState({
      checkedlist: e.target.checked ? cc : [],
    });
  };

  /* 列表选择 */
  onChange = (e, list, orderItem, key) => {
    const { checkedlist, isEditor } = this.state;
    const { parent } = this.props;
    /* 选择时计算合计数 */
    let combined = 0;
    const orderlist = [];
    list.map(item => {
      return e.map(j => {
        if (j === item.id) {
          const heji = item.goodsEntity.type===3?item.number * item.goodsEntity.discountPrice:item.number * item.goodsEntity.price;
          combined += heji;
          orderlist.push(item);
        }
        return combined;
      });
    });
    this.setState({
      checkedlist: isEditor ? checkedlist : e,
      checked: list.length === e.length ? key : '',
      isEditor: false,
      orderlist: orderItem,
    }, () => {
      /* 向父组件传递参数 */
      parent.getChildrenMsg(this, combined);
    });
  };

  /* 标题选择 */
  onCheckAllChange = (e, list, orderItem) => {
    const aa = [];
    let combined = 0;
    const orderlist = [];
    list.map(item => {
      const heji = item.goodsEntity.type===3?item.number * item.goodsEntity.discountPrice:item.number * item.goodsEntity.price;
      combined += heji;
      aa.push(item.id);
      orderlist.push(item);
      return aa;
    });
    const { parent } = this.props;
    // /* 向父组件传递合计数 */
    parent.getCheckCombined(this, e.target.checked ? combined : 0);
    this.setState({
      checkedlist: e.target.checked ? aa : [],
      checked: e.target.checked ? e.target.value : '',
      isEditor: false,
      orderlist: orderItem,
    });
  };

  /* 删除事件 */
  onDelete = () => {
    const { checkedlist } = this.state;
    const { dispatch } = this.props;
    if (checkedlist.length === 0) {
      Toast.fail('请选择订单！');
    } else {
      const ids = checkedlist.join();
      alert('删除商品', '确定删除所选商品？', [
        { text: '取消' },
        {
          text: '确定', onPress: () => {
            dispatch(SHOPPING_SHOPCART_REMOVEBYIDS({ ids })).then(() => {
              const { shoppingmall: { remove: { removeByIds } } } = this.props;
              if (removeByIds && removeByIds.success) {
                Toast.success('删除成功');
                const { onRequestPage } = this.props;
                onRequestPage();
                const { parent } = this.props;
                parent.combined(0);
              }
            });
          },
        },
      ]);
    }
  };

  /* 结算订单 */
  onSubmit = () => {
    const { checkedlist, orderlist } = this.state;
    if (checkedlist.length === 0) {
      Toast.fail('请选择结算商品！');
    } else {
      router.push({
        pathname: `/shopcenter/makesuretheorder`,
        state: {
          data: orderlist,
          type: 'shopCart',
          list: checkedlist,
        },
      });
    }
  };

  render() {
    const { onEditNumCLick, onViewClick } = this.props;
    const { checkedlist, checked, isEditor, data, isEditors } = this.state;
    return (
      <div className={`${style.theorder} ${style.shopCenter}`} style={{paddingBottom:'64px'}}>
        {
          data.map((item) => {
            const goodsMap = [];
            for (const key in item.goodsMap) {
              const list = item.goodsMap[key];
              goodsMap.push(
                <div className='listDiv checkBox-div'>
                  <Checkbox
                    onChange={(e) => this.onCheckAllChange(e, list, item)}
                    checked={isEditor ? checked : checked === item.id + key}
                    value={item.id + key}
                  >
                    <Text strong className='check-tit'>{key === '1' ? '零售' : key === '2' ? '返利' :key === '3' ? '优惠':'协商'}商品</Text>
                  </Checkbox>
                  <CheckboxGroup
                    className='cart-list-check-box-group'
                    value={checkedlist}
                    onChange={(e) => this.onChange(e, list, item, item.id + key)}
                  >
                    {list.map(i => {
                      return (
                        <Checkbox value={i.id} disabled={i.disabled === 1}>
                          <CartListRound
                            j={i}
                            item={i}
                            onViewClick={onViewClick}
                            isEditor={isEditors}
                            onEditNumCLick={onEditNumCLick}
                          />
                        </Checkbox>
                      );
                    })}
                  </CheckboxGroup>
                </div>,
              );
            }
            const onClick = ()=>router.push(`/shopcenter/mallhomepage/view/${item.id}`)
            return (
              <Card
                title={
                  <div onClick={onClick} style={{ width: '100%' }}>
                    <img src={item.imageUrl} alt='' onError={(e) => {e.target.onerror = null;e.target.src = ImageLoadFailed;}} /> {item.deptName}
                  </div>}
                className='order-card'
                bordered={false}
                // style={{ marginBottom: '64px'}}
                extra={<Icon type="right" style={{ color: '#999', fontSize: 12 }} onClick={onClick} />}
              >
                {
                  goodsMap
                }
              </Card>
            );
          })
        }
      </div>
    );
  }
}

export default CartList;
