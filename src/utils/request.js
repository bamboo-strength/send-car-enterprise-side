import fetch from 'dva/fetch';
import localForage from "localforage";
import { notification } from 'antd';
import router from 'umi/router';
import hash from 'hash.js';
import { Base64 } from 'js-base64';
import { clientId, clientSecret } from '../defaultSettings';
import { getCurrentUser, getToken, removeAll } from './authority';

const codeMessage = {
  200: '服务器成功返回请求的数据。',
  201: '新建或修改数据成功。',
  202: '一个请求已经进入后台排队（异步任务）。',
  204: '删除数据成功。',
  400: '发出的请求有错误，服务器没有进行新建或修改数据的操作。',
  401: '用户没有权限（令牌、用户名、密码错误）。',
  403: '用户得到授权，但是访问是被禁止的。',
  404: '发出的请求针对的是不存在的记录，服务器没有进行操作。',
  406: '请求的格式不可得。',
  410: '请求的资源被永久删除，且不会再得到的。',
  422: '当创建一个对象时，发生一个验证错误。',
  500: '服务器发生错误，请检查服务器。',
  502: '网关错误。',
  503: '服务不可用，服务器暂时过载或维护。',
  504: '网关超时。',
};

const checkStatus = response => {
  if (
    (Number(response.status) >= 200 && Number(response.status) < 300) ||
    // 针对于要显示后端返回自定义详细信息的status, 配置跳过
    (response.status === 400 || response.status === 500 ||  response.status === 401 )
  ) {
    return response;
  }
  const errortext = codeMessage[response.status] || response.statusText;
  notification.error({
    message: `请求错误 ${response.status}: ${response.url}`,
    description: errortext,
  });
  const error = new Error(errortext);
  error.name = response.status;
  error.response = response;
  throw error;
};

const checkServerCode = response => {
  if (response.code === 200){
    return response;
  }
  if (response.code > 200 && response.code < 300) { // 商城问题
    // return response;
    notification.error({
      message: response.msg || codeMessage[response.code],
    });
  }
  if (response.code === 400) {
    notification.error({
      message: response.msg || codeMessage[response.code],
    });
  } else if (response.code === 401 ) {
    if (window.location.hash.endsWith('/user/login')) { return false; }
    if(response.error_description === '用户名或密码错误'){
      notification.error({
        message: response.msg || codeMessage[response.code],
      });
    }
    removeAll();
    router.push('/user/login');
  } else if (response.code === 404) {
    notification.error({
      message: response.msg || codeMessage[response.code],
    });
  } else if (response.code === 500 ) {
    notification.error({
      message: response.msg || codeMessage[response.code],
    });
  }
  return response;
};

const cachedSave = (response, hashcode) => {
  /**
   * Clone a response data and store it in sessionStorage
   * Does not support data other than json, Cache only json
   */
  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.match(/application\/json/i)) {
    // All data is saved as text
    response
      .clone()
      .text()
      .then(content => {
        localForage.setItem(hashcode, content);
        localForage.setItem(`${hashcode}:timestamp`, Date.now());
      });
  }
  return response;
};


function getDesignatedTenantValue(param) {
  const newQuery = {
    success: false,
    params: '',
    DesignatedTenantValue:''
  };

  const query = param;
  const vars = query.split("&");
  for (let i=0; i<vars.length; i+=1) {
    const pair = vars[i].split("=");
    if(pair[0] === 'headers%5BBlade-DesignatedTenant%5D'){
      newQuery.success = true;
      // eslint-disable-next-line prefer-destructuring
      newQuery.DesignatedTenantValue = pair[1]
    } else {
      newQuery.params = `${newQuery.params + pair[0]  }=${  pair[1]  }&`
    }
  }
  return newQuery;
}

/**
 * Requests a URL, returning a promise.
 *
 * @param  {string} url       The URL we want to request
 * @param  {object} [option] The options we want to pass to "fetch"
 * @return {object}           An object containing either "data" or "err"
 */
export default async function request(url, option) {
  const options = {
    ...option,
  };

  const defaultOptions = {
    credentials: 'include',
  };

  const newOptions = { ...defaultOptions, ...options };


  // 不指定则默认是GET，添加指定租户号
  if (typeof newOptions.method === 'undefined') {
    const arrGetDataStr = url.split('?');
    if (arrGetDataStr.length === 2) {
      const getDataStr = arrGetDataStr[1];
      const designatedTenantValue = getDesignatedTenantValue(getDataStr);
      if (designatedTenantValue.success) {
        // eslint-disable-next-line no-param-reassign
        url = `${arrGetDataStr[0]  }?${  designatedTenantValue.params}`
        newOptions.headers= {
          ...newOptions.headers,
          'Blade-DesignatedTenant' : designatedTenantValue.DesignatedTenantValue
        }
      }
    }
  }

  /**
   * Produce fingerprints based on url and parameters
   * Maybe url has the same parameters
   */
  const fingerprint = url + (options.body ? JSON.stringify(options.body) : '');
  const hashcode = hash
    .sha256()
    .update(fingerprint)
    .digest('hex');



  newOptions.headers = {
    ...newOptions.headers,
    // 客户端认证
    Authorization: `Basic ${Base64.encode(`${clientId}:${clientSecret}`)}`,
  };

  const token = getToken();
  if (token) {
    newOptions.headers = {
      ...newOptions.headers,
      // token鉴权
      'Blade-Auth': token,
    };
  }

  if (
    newOptions.method === 'POST' ||
    newOptions.method === 'PUT' ||
    newOptions.method === 'DELETE'
  ) {
    if (!(newOptions.body instanceof FormData)) {
      newOptions.headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json;charset=utf-8',
        ...newOptions.headers,
      };
      newOptions.body = JSON.stringify(newOptions.body);
    } else {
      // newOptions.body is FormData
      newOptions.headers = {
        Accept: 'application/json',
        ...newOptions.headers,
      };
    }
  }

  const expirys = options.expirys && 60;
  // options.expirys !== false, return the cache,
  if (options.expirys !== false) {
    let cached = null;
    await localForage.getItem(hashcode).then(res=>{
      cached = res;
    });
    let whenCached = null;
    await localForage.getItem(`${hashcode}:timestamp`).then(res=>{
      whenCached = res;
    });
    if (cached !== null && whenCached !== null) {
      const age = (Date.now() - whenCached) / 1000;
      if (age < expirys) {
        const response = new Response(new Blob([cached]));
        return response.json();
      }
      localForage.removeItem(hashcode);
      localForage.removeItem(`${hashcode}:timestamp`);
    }
  }
  return fetch(url, newOptions)
    .then(checkStatus)
    .then(response => cachedSave(response, hashcode))
    .then(response => {
      // DELETE and 204 do not return data by default
      // using .json will report an error.
      if (newOptions.method === 'DELETE' || response.status === 204) {
        return response.text();
      }
      return response.json();
    })
    .then(checkServerCode)
    .catch(e => {
      // 获取当前登陆的租户号
      let tenant = '';
      if(getCurrentUser()!==null && getCurrentUser().tenantId !== undefined && getCurrentUser().tenantId !== 'undefined' && getCurrentUser().tenantId !== null){
        tenant = getCurrentUser().tenantId;
      }

      const status = e.name;
      if (status === 401 ) {
        // @HACK
        /* eslint-disable no-underscore-dangle */
        window.g_app._store.dispatch({
          type: 'login/logout',
          payload: tenant,
        });
        return;
      }
      // environment should not be used
      if (status === 403 ) {
        router.push('/exception/403');
        return;
      }
// console.log(Number(status),Number(status) === 503,'----')
      if (Number(status) === 503) {
        router.push('/exception/503');
        return;
      }
      if (Number(status) <= 504 && Number(status) >= 500) {
        router.push('/exception/500');
      }
      //  Toast.info(`其他问题，编码${status}`)
    });
}
