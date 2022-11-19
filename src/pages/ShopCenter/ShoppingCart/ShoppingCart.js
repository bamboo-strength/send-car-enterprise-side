import React, { PureComponent } from 'react';
import { NavBar, NoticeBar, Toast } from 'antd-mobile';
import { Button, Empty, Form, Icon } from 'antd';
import Text from 'antd/es/typography/Text';
import CartList from '@/components/ShoppingCart/CartList';
import { router } from 'umi';
import BuyNumModel from '@/pages/ShopCenter/component/BuyNumModel';
import { SHOPPING_SHOPCART_CART_PAGE, SHOPPING_SHOPCART_EDITGOODSNUM } from '@/actions/shoppingMall';
import { connect } from 'dva';
import { InTheLoad } from '@/components/Stateless/Stateless';

@connect(({ shoppingmall }) => ({
  shoppingmall,
}))
@Form.create()
class ShoppingCart extends PureComponent {

  constructor(props) {
    super(props);
    const isNoticeBar = localStorage.getItem('isNoticeBar');
    this.state = {
      modal1: false,
      orderlist: {},
      isEditor: false,
      shopCartStatus: 2,
      combined: 0,
      isNoticeBar: isNoticeBar || true,
      data: [],
      isloading:false
    };
  }

  componentDidMount() {
    this.requestPage();
  }

  requestPage = () => {
    const { dispatch } = this.props;
    this.setState({
      isloading:true
    })
    dispatch(SHOPPING_SHOPCART_CART_PAGE()).then(() => {
      this.setState({
        isloading:false
      })
      const { shoppingmall: { data: { cartData } } } = this.props;
      if (cartData && cartData.success) {
        this.setState({
          data: cartData.data,
        });
      }
    });
  };

  onViewClick = (e, item) => {
    const activeKeys = Number(item.type) === 1 ?'retailProduct':Number(item.type) === 2 ?'rebateProduct':Number(item.type) === 3?'preferentialProduct':'consultProduct'
    e.preventDefault();
    router.push({
      pathname: `/shopcenter/goodsdetails/${activeKeys}/${item.id}`,
      state: {
        type: 'goods',
      },
    });
  };

  /* 弹出修改购买数量弹窗 */
  onEditNumCLick = (e, item) => {
    e.preventDefault();
    e.stopPropagation();
    const { form } = this.props;
    form.resetFields();
    if(item.goodsEntity.type !==3) {
      this.setState({
        modal1: true,
        orderlist: item,
      })
    }else {
      Toast.fail('优惠商品不允许修改数量')
    }
    if(item.goodsEntity.type !==4) {
      this.setState({
        modal1: true,
        orderlist: item,
      })
    }else {
      Toast.fail('协商商品不允许修改数量')
    }
  };

  /* 修改购买数量 */
  onPress = (item) => {
    const { form } = this.props;
    form.validateFieldsAndScroll((err, value) => {
      if (!err) {
        const { dispatch } = this.props;
        const params = {
          id: item.id,
          goodsNum: value.number,
        };
        if(item.goodsEntity.isLimit!==1){
          if (item.goodsEntity.type !== 1 && value.number > item.goodsEntity.totalNum){
            Toast.fail('您购买的数量大于剩余量，请修改购买数量！')
            return;
          }
        }

        dispatch(SHOPPING_SHOPCART_EDITGOODSNUM(params)).then(() => {
          const { shoppingmall: { submit: { editGoodsNum } } } = this.props;
          if (editGoodsNum && editGoodsNum.success) {
            Toast.success('修改商品数量成功');
            this.requestPage();
            this.setState({
              modal1: false,
            });
          }
        });
      }
    });
  };

  /* 关闭购物车弹窗 */
  onClose = () => {
    this.setState({
      modal1: false,
    });
  };

  /* 切换完成和编辑 */
  editor = () => {
    const { isEditor } = this.state;
    this.setState({
      isEditor: !isEditor,
    });
  };

  onRef = ref => {
    this.child = ref;
  };

  /* 全选事件 */
  onChange = (e) => {
    const { isEditor } = this.state;
    setTimeout(() => {
      this.child.onSelectAll(e, isEditor);
    }, 10);
  };

  /* 删除事件 */
  onDelete = () => {
    setTimeout(() => {
      this.child.onDelete();
    }, 10);
  };

  /* 结算事件 */
  onSubmit = () => {
    const { shopCartStatus } = this.state;
    setTimeout(() => {
      this.child.onSubmit(shopCartStatus);
    }, 10);
  };

  /* 接收子组件传递过来的数据 */
  getChildrenMsg = (result, msg) => {
    this.setState({
      combined: msg,
    });
  };

  combined = (e) => {
    this.setState({
      combined: e,
    });
  };

  /* 获取选择标题后，商品的合计数 */
  getCheckCombined = (result, e) => {
    this.setState({
      combined: e,
    });
  };

  onNoticeBar = () => {
    localStorage.setItem('isNoticeBar', false);
  };

  render() {
    const { orderlist, modal1, isEditor, combined, isNoticeBar, data,isloading } = this.state;
    const { form, location: { state } } = this.props;
    const btnStyle = { padding: '0 30px', height: '40px' };
    return (
      <div>
        <NavBar
          mode="light"
          icon={isEditor !== true ? <Icon type="left" /> : ''}
          onLeftClick={isEditor !== true ? () => {
            if (state && state.type === 'goodsDetails') {
              window.history.back();
            } else {
              router.push(`/shopcenter/mallhomepage/list`);
            }
          } : null}
          rightContent={[<Text onClick={this.editor}>{isEditor === true ? '完成' : '编辑'}</Text>]}
        >购物车
        </NavBar>
        {
          !isloading ? (
            <div className='am-list'>
              {
                isNoticeBar === true ? (
                  <NoticeBar
                    marqueeProps={{ loop: true, style: { padding: '0 7.5px' } }}
                    mode="closable"
                    onClick={this.onNoticeBar}
                  >
                    温馨提示：请选择同厂区、同类型、同收货地点的商品进行提交，方便生成在线合同。
                  </NoticeBar>
                ) : ''
              }
              {
                JSON.stringify(data) !== '{}' ?
                  <CartList
                    data={data}
                    onRef={this.onRef}
                    isEditor={isEditor}
                    parent={this}
                    onViewClick={this.onViewClick}
                    onEditNumCLick={this.onEditNumCLick}
                    form={form}
                    onRequestPage={this.requestPage}
                  /> : (
                    <Empty style={{ marginTop: '30%' }} description={<Text>暂无商品<br />去添加你的第一个商品吧~</Text>} />
                  )
              }
            </div>
          ):<InTheLoad />
        }

        <div className='goodCart'>
          {/* <div> {isEditor === true?<Checkbox onChange={this.onChange}>全选</Checkbox>:<Text>总计：<Text type="danger" strong style={{ fontSize: 24 }}>￥{combined}</Text></Text>} </div> */}
          <div>
            {isEditor === true ? '' :
            <Text>总计：<Text type="danger" strong style={{ fontSize: 24 }}>￥{combined.toFixed(2)}</Text></Text>}
          </div>
          {
            isEditor === true ? (
              <Button type="danger" ghost shape="round" style={btnStyle} onClick={this.onDelete}>
                删除
              </Button>
            ) : (
              <Button
                onClick={this.onSubmit}
                type="primary"
                shape="round"
                style={btnStyle}
              >结算
              </Button>
            )
          }
        </div>
        {
          JSON.stringify(orderlist) !== '{}' ? (
            <BuyNumModel
              detail={orderlist.goodsEntity}
              id='number'
              title="修改购买数量"
              number={orderlist.number}
              visible={modal1}
              form={form}
              onPress={() => this.onPress(orderlist)}
              onClose={this.onClose}
              disabled={orderlist.goodsEntity.type === 3 ||orderlist.goodsEntity.type ===4}
              pageType="addShopCart"
            />
          ) : ''
        }
      </div>
    );
  }
}

export default ShoppingCart;
