export const SHOPPING_MALL = 'shoppingmall';

/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 厂区信息
 */

/* 在营厂区分页列表 */
export function SHOPPING_MALL_LIST(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchList`,
    payload,
  };
}

/* 在营厂区详情 */
export function SHOPPING_MALL_DETAIL(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchDetail`,
    payload,
  };
}

/* 商品分页列表 */
export function SHOPPING_MALL_GOODPAGE(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchGoodPage`,
    payload,
  };
}

/* 获取商品详情 */
export function SHOPPING_MALL_GOODDETAIL(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchGoodDetail`,
    payload,
  };
}



/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 收货地址管理
 */

/* 添加收货地址 */
export function SHOPPING_ADDRESS_SAVE(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresSave`,
    payload,
  };
}

/* 查询收货地址列表 */
export function SHOPPING_ADDRESS_SQUERYLIST(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresQueryList`,
    payload,
  };
}

/* 删除收货地址 */
export function SHOPPING_ADDRESS_REMOVE(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresRemove`,
    payload,
  };
}

/* 设为默认地址 */
export function SHOPPING_ADDRESS_SETDEFAULT(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresSetDefault`,
    payload,
  };
}

/* 获取收货地址详情 */
export function SHOPPING_ADDRESS_QUERYDETAIL(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresQueryDetail`,
    payload,
  };
}

/* 获取收货地址详情 */
export function SHOPPING_ADDRESS_GETDEFAULTADDR(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddresGetDefaultAddr`,
    payload,
  };
}

/**
 * @author 马静
 * @date 2021/10/11
 * @Description: 购物车
 */

/* 加入购物车 */
export function SHOPPING_SHOPCART_ADDCART(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchAddCart`,
    payload,
  };
}

/* 修改商品数量 */
export function SHOPPING_SHOPCART_EDITGOODSNUM(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchEditGoodsNum`,
    payload,
  };
}

/* 删除购物车商品 */
export function SHOPPING_SHOPCART_REMOVEBYIDS(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchRemoveByIds`,
    payload,
  };
}

/* 商品详情 */
export function SHOPPING_SHOPCART_CART_DETAIL(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchCartQueryDetail`,
    payload,
  };
}

/* 分页列表 */
export function SHOPPING_SHOPCART_CART_PAGE(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchCartQueryPage`,
    payload,
  };
}
/* 秒杀分页列表 */
export function SECKILL_LIST(payload) {
  return {
    type: `${SHOPPING_MALL}/fetchSeckillList`,
    payload,
  };
}
