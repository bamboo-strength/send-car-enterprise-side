import { routerRedux } from 'dva/router';
import { notification } from 'antd';
import { getFakeCaptcha, requestApiByJson } from '../services/api';
import { accountLogin } from '../services/user';
import { dynamicRoutes, dynamicButtons } from '../services/menu';
import {
  setAuthority,
  setToken,
  setCurrentUser,
  setRoutes,
  setButtons,
  removeAll,
  getToken,
} from '../utils/authority';
import { getPageQuery, formatRoutes, formatButtons } from '../utils/utils';
import { reloadAuthorized } from '../utils/Authorized';
import { clientId, project } from '../defaultSettings';
import { detail } from '../services/merDriver';

export default {
  namespace: 'login',

  state: {
    status: undefined,
  },

  effects: {
    *login({ payload }, { call, put }) {
      const response = yield call(accountLogin, payload);
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: true,
          type: 'login',
          data: { ...response },
        },
      });
      // const responseRoutes = yield call(dynamicRoutes);
      // const responseButtons = yield call(dynamicButtons);

      // yield put({
      //   type: 'saveMenuData',
      //   payload: {
      //     routes: responseRoutes.data,
      //     buttons: responseButtons.data,
      //   },
      // });

      reloadAuthorized();

      const urlParams = new URL(window.location.href);
      const params = getPageQuery();

      let { redirect } = params;
      if (redirect) {
        const redirectUrlParams = new URL(redirect);
        if (redirectUrlParams.origin === urlParams.origin) {
          redirect = redirect.substr(urlParams.origin.length);
          if (redirect.match(/^\/.*#/)) {
            redirect = redirect.substr(redirect.indexOf('#') + 1);
          }
        } else {
          redirect = null;
        }
      }

      // 简版，隐藏头和菜单
      localStorage.setItem('isSimplify', true);
      localStorage.setItem('merchantsFhfTenantId', response.tenant_id);
    },

    *getCaptcha({ payload }, { call }) {
      yield call(getFakeCaptcha, payload);
    },

    *logout({ payload }, { put }) {
      yield put({
        type: 'changeLoginStatus',
        payload: {
          status: false,
          type: 'logout',
          data: {
            authority: 'guest',
            logout: true,
          },
        },
      });
      reloadAuthorized();
      const u = !!navigator.userAgent.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); // ios版本
      const ifWx = window.__wxjs_environment === 'miniprogram';
      if (u && !ifWx) {
        // 区分外壳操作是否是ios
        window.webkit.messageHandlers.changePasswordClick.postMessage({ changePwd: '' });
      } else {
        const urlParams = window.location.href;
        const urlPathAll = urlParams.split('#');
        const urlPath = urlPathAll[0];
        window.location.href = `${urlPath}#user/login/`;
      }
    },
  },

  reducers: {
    changeLoginStatus(state, { payload }) {
      const { status, type } = payload;

      if (status) {
        const {
          data: {
            token_type,
            access_token,
            role_name,
            account,
            user_name,
            avatar,
            tenant_id,
            user_id,
            nick_name,
            dept_id,
            open_id,
            companyno,
          },
        } = payload;
        const token = `${token_type} ${access_token}`;
        setToken(token);
        setAuthority(role_name);
        setCurrentUser({
          avatar,
          account,
          name: user_name,
          authority: role_name,
          tenantId: tenant_id,
          userId: user_id,
          realname: nick_name,
          deptId: dept_id,
          openId: open_id,
          customerId: companyno,
        });

        localStorage.setItem(getToken(), new Date().getTime());
      } else {
        removeAll();
      }

      return {
        ...state,
        status: type === 'login' ? (status ? 'ok' : 'error') : '',
        type: payload.type,
      };
    },

    saveMenuData(state, { payload }) {
      const { routes, buttons } = payload;
      setRoutes(formatRoutes(routes || []));
      setButtons(formatButtons(buttons));
      return {
        ...state,
      };
    },
  },
};
