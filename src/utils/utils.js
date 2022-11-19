import moment from 'moment';
import React from 'react';
import nzh from 'nzh/cn';
import { parse, stringify } from 'qs';

export function fixedZero(val) {
  return val * 1 < 10 ? `0${val}` : val;
}

export function getTimeDistance(type) {
  const now = new Date();
  const oneDay = 1000 * 60 * 60 * 24;

  if (type === 'today') {
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);
    return [moment(now), moment(now.getTime() + (oneDay - 1000))];
  }

  if (type === 'week') {
    let day = now.getDay();
    now.setHours(0);
    now.setMinutes(0);
    now.setSeconds(0);

    if (day === 0) {
      day = 6;
    } else {
      day -= 1;
    }

    const beginTime = now.getTime() - day * oneDay;

    return [moment(beginTime), moment(beginTime + (7 * oneDay - 1000))];
  }

  if (type === 'month') {
    const year = now.getFullYear();
    const month = now.getMonth();
    const nextDate = moment(now).add(1, 'months');
    const nextYear = nextDate.year();
    const nextMonth = nextDate.month();

    return [
      moment(`${year}-${fixedZero(month + 1)}-01 00:00:00`),
      moment(moment(`${nextYear}-${fixedZero(nextMonth + 1)}-01 00:00:00`).valueOf() - 1000),
    ];
  }

  const year = now.getFullYear();
  return [moment(`${year}-01-01 00:00:00`), moment(`${year}-12-31 23:59:59`)];
}

export function getPlainNode(nodeList, parentPath = '') {
  const arr = [];
  nodeList.forEach(node => {
    const item = node;
    item.path = `${parentPath}/${item.path || ''}`.replace(/\/+/g, '/');
    item.exact = true;
    if (item.children && !item.component) {
      arr.push(...getPlainNode(item.children, item.path));
    } else {
      if (item.children && item.component) {
        item.exact = false;
      }
      arr.push(item);
    }
  });
  return arr;
}

export function digitUppercase(n) {
  return nzh.toMoney(n);
}

function getRelation(str1, str2) {
  if (str1 === str2) {
    console.warn('Two path are equal!'); // eslint-disable-line
  }
  const arr1 = str1.split('/');
  const arr2 = str2.split('/');
  if (arr2.every((item, index) => item === arr1[index])) {
    return 1;
  }
  if (arr1.every((item, index) => item === arr2[index])) {
    return 2;
  }
  return 3;
}

function getRenderArr(routes) {
  let renderArr = [];
  renderArr.push(routes[0]);
  for (let i = 1; i < routes.length; i += 1) {
    // 去重
    renderArr = renderArr.filter(item => getRelation(item, routes[i]) !== 1);
    // 是否包含
    const isAdd = renderArr.every(item => getRelation(item, routes[i]) === 3);
    if (isAdd) {
      renderArr.push(routes[i]);
    }
  }
  return renderArr;
}

/**
 * Get router routing configuration
 * { path:{name,...param}}=>Array<{name,path ...param}>
 * @param {string} path
 * @param {routerData} routerData
 */
export function getRoutes(path, routerData) {
  let routes = Object.keys(routerData).filter(
    routePath => routePath.indexOf(path) === 0 && routePath !== path
  );
  // Replace path to '' eg. path='user' /user/name => name
  routes = routes.map(item => item.replace(path, ''));
  // Get the route to be rendered to remove the deep rendering
  const renderArr = getRenderArr(routes);
  // Conversion and stitching parameters
  const renderRoutes = renderArr.map(item => {
    const exact = !routes.some(route => route !== item && getRelation(route, item) === 1);
    return {
      exact,
      ...routerData[`${path}${item}`],
      key: `${path}${item}`,
      path: `${path}${item}`,
    };
  });
  return renderRoutes;
}

export function getPageQuery() {
  return parse(window.location.href.split('?')[1]);
}

export function getQueryPath(path = '', query = {}) {
  const search = stringify(query);
  if (search.length) {
    return `${path}?${search}`;
  }
  return path;
}

/* eslint no-useless-escape:0 */
const reg = /(((^https?:(?:\/\/)?)(?:[-;:&=\+\$,\w]+@)?[A-Za-z0-9.-]+(?::\d+)?|(?:www.|[-;:&=\+\$,\w]+@)[A-Za-z0-9.-]+)((?:\/[\+~%\/.\w-_]*)?\??(?:[-\+=&;%@.\w_]*)#?(?:[\w]*))?)$/;

export function isUrl(path) {
  return reg.test(path);
}

export function formatWan(val) {
  const v = val * 1;
  if (!v || Number.isNaN(v)) return '';

  let result = val;
  if (val > 10000) {
    result = Math.floor(val / 10000);
    result = (
      <span>
        {result}
        <span
          style={{
            position: 'relative',
            top: -2,
            fontSize: 14,
            fontStyle: 'normal',
            marginLeft: 2,
          }}
        >
          万
        </span>
      </span>
    );
  }
  return result;
}

export const importCDN = (url, name) =>
  new Promise(resolve => {
    const dom = document.createElement('script');
    dom.src = url;
    dom.type = 'text/javascript';
    dom.onload = () => {
      resolve(window[name]);
    };
    document.head.appendChild(dom);
  });

export function formatTopMenus(menus) {
  return menus.map(item => {
    return {
      id: item.id,
      name: item.name,
      code: item.code,
      source: item.source,
    };
  });
}

export function formatRoutes(routes) {
  function format(arr) {
    arr.forEach(node => {
      const item = node;
      if (item.children && Array.isArray(item.children)) {
        item.routes = item.children;
        format(item.routes);
      }
      if (item.isOpen > 1) {
        item.target = '_blank';
      }
      item.cnName = item.name
      item.name = item.code;
      if (item.source) {
        item.icon = item.source;
      }
      delete item.id;
      delete item.parentId;
      delete item.sort;
      delete item.code;
      delete item.source;
      delete item.children;
    });
    return arr;
  }
  return format(routes);
}

export function formatButtons(buttons) {
  return buttons.map(item => {
    return {
      code: item.code,
      buttons: item.children,
    };
  });
}

/**
 * 获取页面宽度及高度
 * @returns {function(): {width: number, height: number}}
 */
export function getInner() {
  if (typeof window.innerWidth !== 'undefined') {
    return   {
        width : window.innerWidth,
        height : window.innerHeight
      }
  }
  return {
      width : document.documentElement.clientWidth,
      height : document.documentElement.clientHeight
  }

}

/**
 * 获取表单查询条件
 */
export function getFormValues() {
  return JSON.parse(localStorage.getItem("formValues") || '{}')
}

export function flexCenter ($justifyContent, $alignItems, $flexDirection) {
  return {
    display : 'flex',
    flexDirection : $flexDirection ? $flexDirection : 'row',
    justifyContent : $justifyContent ? $justifyContent : 'center',
    alignItems : $alignItems ? $alignItems : 'center'

  }
}

export function IEVersion (){
  const userAgents = navigator.userAgent; // 取得浏览器的userAgent字符串
  const isIE = userAgents.indexOf("compatible") > -1 && userAgents.indexOf("MSIE") > -1; // 判断是否IE<11浏览器
  const isEdge = userAgents.indexOf("Edge") > -1 && !isIE; // 判断是否IE的Edge浏览器
  const isIE11 = userAgents.indexOf('Trident') > -1 && userAgents.indexOf("rv:11.0") > -1;
  if(isIE) {
    const reIE = new RegExp("MSIE (\\d+\\.\\d+);");
    reIE.test(userAgents);
    const fIEVersion = parseFloat(RegExp["$1"]);
    if(fIEVersion === 7) {
      return 7;
    } else if(fIEVersion === 8) {
      return 8;
    } else if(fIEVersion === 9) {
      return 9;
    } else if(fIEVersion === 10) {
      return 10;
    } else {
      return 6; // IE版本<=7
    }
  } else if(isEdge) {
    return 'edge';// edge
  } else if(isIE11) {
    return 11; // IE11
  }else{
    return -1;// 不是ie浏览器
  }
}
