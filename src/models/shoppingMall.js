import { SHOPPING_MALL } from '@/actions/shoppingMall';
import {
  addCart, addresGetDefaultAddr, addresQueryDetail,
  addresQueryList, addresRemove,
  addresSave, addresSetDefault, cartQueryDetail, cartQueryPage, editGoodsNum,
  goodsQueryDetail,
  goodsQueryPage,
  queryDetail,
  queryPage, removeByIds,querySeckillPage,seckillDetail
} from '@/services/shoppingMall';

export default {
  namespace: SHOPPING_MALL,
  state: {
    data: {
      pageData: {},
      goodsData: {},
      addressData: {},
      cartData: {},
    },
    detail: {
      queryDetail: {},
      goodsDetail: {},
      addressDetail: {},
      addressDefaultDetail: {},
      cartDetail: {},
    },
    remove: {
      addresRemove: {},
      removeByIds: {},
    },
    isDefault: {},
    submit: {
      addresSave: {},
      addCart: {},
      editGoodsNum: {},
    },
  },
  effects: {
    /* 在营厂区分页列表 */
    * fetchList({ payload }, { call, put }) {
      const response = yield call(queryPage, payload);
      if (response.success) {
        yield put({
          type: 'unloadState',
          payload: {
            data: {
              pageData: response.data,
            },
          },
        });
      }
    },
    /* 在营厂区详情 */
    * fetchDetail({ payload }, { call, put }) {
      const response = yield call(queryDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            queryDetail: response,
          },
        },
      });
    },
    /* 商品分页列表 */
    * fetchGoodPage({ payload }, { call, put }) {
      const response = yield call(goodsQueryPage, payload);
      yield put({
        type: 'unloadState',
        payload: {
          data: {
            goodsData: response,
          },
        },
      });
    },
    /* 获取商品详情 */
    * fetchGoodDetail({ payload }, { call, put }) {
      const response = yield call(goodsQueryDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            goodsDetail: response,
          },
        },
      });
    },
    /* 添加收货地址 */
    * fetchAddresSave({ payload }, { call, put }) {
      const response = yield call(addresSave, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            addresSave: response,
          },
        },
      });
    },
    /* 查询收货地址列表 */
    * fetchAddresQueryList({ payload }, { call, put }) {
      const response = yield call(addresQueryList, payload);
      yield put({
        type: 'unloadState',
        payload: {
          data: {
            addressData: response,
          },
        },
      });
    },
    /* 删除收货地址 */
    * fetchAddresRemove({ payload }, { call, put }) {
      const response = yield call(addresRemove, payload);
      yield put({
        type: 'unloadState',
        payload: {
          remove: {
            addresRemove: response,
          },
        },
      });
    },
    /* 设为默认地址 */
    * fetchAddresSetDefault({ payload }, { call, put }) {
      const response = yield call(addresSetDefault, payload);
      yield put({
        type: 'unloadState',
        payload: {
          isDefault: response,
        },
      });
    },
    /* 获取收货地址详情 */
    * fetchAddresQueryDetail({ payload }, { call, put }) {
      const response = yield call(addresQueryDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            addressDetail: response,
          },
        },
      });
    },
    /* 获取默认收货地址信息 */
    * fetchAddresGetDefaultAddr({ payload }, { call, put }) {
      const response = yield call(addresGetDefaultAddr, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            addressDefaultDetail: response,
          },
        },
      });
    },
    /* 加入购物车 */
    * fetchAddCart({ payload }, { call, put }) {
      const response = yield call(addCart, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            addCart: response,
          },
        },
      });
    },
    /* 修改商品数量 */
    * fetchEditGoodsNum({ payload }, { call, put }) {
      const response = yield call(editGoodsNum, payload);
      yield put({
        type: 'unloadState',
        payload: {
          submit: {
            editGoodsNum: response,
          },
        },
      });
    },
    /* 删除购物车商品 */
    * fetchRemoveByIds({ payload }, { call, put }) {
      const response = yield call(removeByIds, payload);
      yield put({
        type: 'unloadState',
        payload: {
          remove: {
            removeByIds: response,
          },
        },
      });
    },
    /* 商品详情 */
    * fetchCartQueryDetail({ payload }, { call, put }) {
      const response = yield call(cartQueryDetail, payload);
      yield put({
        type: 'unloadState',
        payload: {
          detail: {
            cartDetail: response,
          },
        },
      });
    },
    /* 分页列表 */
    * fetchCartQueryPage({ payload }, { call, put }) {
      const response = yield call(cartQueryPage, payload);
      yield put({
        type: 'unloadState',
        payload: {
          data: {
            cartData: response,
          },
        },
      });
    },
    /* 秒杀分页列表 */
    * fetchSeckillList({ payload }, { call, put }) {
      const response = yield call(querySeckillPage, payload);
      if (response.success) {
        yield put({
          type: 'unloadState',
          payload: {
            data: {
              pageData: response.data,
            },
          },
        });
      }
    },
  },
  reducers: {
    unloadState(state, action) {
      return {
        ...state,
        ...action.payload,
      };
    },
  },
};
