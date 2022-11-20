import moment from 'moment';
import { Toast } from 'antd-mobile';
import router from 'umi/router';
import { requestApi } from '../services/api';
import { getToken } from '@/utils/authority';
import { joinQueue } from '../services/epidemic';
import { getCurrentUser } from './authority';

/**
 * 通用工具类
 */
export default class Func {
  /**
   * 不为空
   * @param val
   * @returns {boolean}
   */
  static notEmpty(val) {
    return !this.isEmpty(val);
  }

  /**
   * 为空
   * @param val
   * @returns {boolean}
   */
  static isEmpty(val) {
    if (
      val === null ||
      typeof val === 'undefined' ||
      (typeof val === 'string' && val === '' && val !== 'undefined')
    ) {
      return true;
    }
    return false;
  }

  /**
   * 强转int型
   * @param val
   * @param defaultValue
   * @returns {number}
   */
  static toInt(val, defaultValue) {
    if (this.isEmpty(val)) {
      return defaultValue === undefined ? -1 : defaultValue;
    }
    const num = parseInt(val, 0);
    return Number.isNaN(num) ? (defaultValue === undefined ? -1 : defaultValue) : num;
  }

  /**
   * Json强转为Form类型
   * @param obj
   * @returns {FormData}
   */
  static toFormData(obj) {
    const data = new FormData();
    Object.keys(obj).forEach(key => {
      data.append(key, Array.isArray(obj[key]) ? obj[key].join(',') : obj[key]);
    });
    return data;
  }

  /**
   * 字符串转为date类
   * @param date
   * @param format
   * @returns {any}
   */
  static moment(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return date ? moment(date, format) : null;
  }

  /**
   * date类转为字符串格式
   * @param date
   * @param format
   * @returns {null}
   */
  static format(date, format = 'YYYY-MM-DD HH:mm:ss') {
    return date ? date.format(format) : null;
  }

  /**
   * 字符串格式时间转为字符串
   * @param date
   * @param format
   * @returns {null}
   */
  static formatFromStr(dateStr, fmt) {
    // console.log(dateStr,'---dateStr')
    if (this.isEmpty(dateStr)) {
      return dateStr;
    }
    //  const date = new Date(dateStr);
    //  console.log(dateStr,'-------------')
    let date;
    if (typeof dateStr === 'string' || typeof dateStr === 'number') {
      if (dateStr.length > 19) {
        dateStr = dateStr.slice(0, 19);
      }
      // console.log(new Date(dateStr.replace(/\-/g, "/")))
      // date = new Date(dateStr)
      date = new Date(dateStr.replace(/\-/g, '/'));
    } else {
      try {
        date = new Date(dateStr);
      } catch (e) {
        date = dateStr;
      }
    }
    //  const date = typeof dateStr === 'string' || dateStr === 'number' ?new Date(dateStr):dateStr;
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const strDate = date
      .getDate()
      .toString()
      .padStart(2, '0');
    const format = fmt || 'YYYY-MM-DD HH:mm:ss';
    const currentTime = `${
      date.getHours() > 0
        ? date.getHours() < 10
          ? `${0}${date.getHours()}`
          : date.getHours()
        : `${date.getHours()}${0}`
    }:${
      date.getMinutes() > 0
        ? date.getMinutes() < 10
          ? `${0}${date.getMinutes()}`
          : date.getMinutes()
        : `${date.getMinutes()}${0}`
    }:${
      date.getSeconds() > 0
        ? date.getSeconds() < 10
          ? `${0}${date.getSeconds()}`
          : date.getSeconds()
        : `${date.getSeconds()}${0}`
    }`;
    const currentDay = `${
      date.getHours() > 0
        ? date.getHours() < 10
          ? `${0}${date.getHours()}`
          : date.getHours()
        : `${date.getHours()}${0}`
    }:${
      date.getMinutes() > 0
        ? date.getMinutes() < 10
          ? `${0}${date.getMinutes()}`
          : date.getMinutes()
        : `${date.getMinutes()}${0}`
    }`;
    if (format === 'YYYY-MM-DD HH:mm:ss') {
      return `${date.getFullYear()}-${month}-${strDate} ${currentTime}`;
    }
    if (format === 'YYYY-MM-DD') {
      return `${date.getFullYear()}-${month}-${strDate}`;
    }
    if (format === 'YYYY-MM' || format === 'YYYY-M') {
      return `${date.getFullYear()}-${month}`;
    }
    if (format === 'YYYY-MM-DD HH:mm') {
      return `${date.getFullYear()}-${month}-${strDate} ${currentDay}`;
    }
    return dateStr;
  }

  static handleStrDate(dateStr) {
    if (dateStr && !dateStr.includes('-')) {
      const year = dateStr.substring(0, 4);
      const month = dateStr.substring(4, 6);
      const day = dateStr.substring(6, 8);
      const hour = dateStr.substring(8, 10);
      const minute = dateStr.substring(10, 12);
      const second = dateStr.substring(12, 14);
      const returnData = `${year}-${month}-${day} ${hour}:${minute}:${second}`;
      return returnData;
    }
    return dateStr;
  }

  /**
   * 根据逗号联合
   * @param arr
   * @returns {string}
   */
  static join(arr) {
    return arr ? arr.join(',') : '';
  }

  /**
   * 根据逗号分隔
   * @param str
   * @returns {string}
   */
  static split(str) {
    return str ? String(str).split(',') : '';
  }

  /**
   * 处理查询条件默认所有查询条件都是等于
   * @param params
   * @returns {*}
   */
  static parseQuery(params) {
    if (!this.notEmpty(params) || params === undefined) {
      return params;
    }
    const keys = Object.keys(params);
    for (let i = 0; i < keys.length; i += 1) {
      const key = keys[i];
      if (this.isQuery(key)) {
        if (key === 'Blade-DesignatedTenant') {
          const value = params[key];
          // eslint-disable-next-line no-param-reassign
          params.headers = { ...params.headers };
          params.headers[key] = value;
          // eslint-disable-next-line no-param-reassign
          delete params[key];
        }
        // eslint-disable-next-line no-continue
        continue;
      }
      const value = params[key];
      // eslint-disable-next-line no-param-reassign
      delete params[key];
      // eslint-disable-next-line no-param-reassign
      params[`${key}_equal`] = value;
    }
    // console.log(params)
    return params;
  }

  /**
   * 判断查询条件是否已经添加了关键字
   * @param key
   * @returns {boolean}
   */
  static isQuery(key) {
    const query = [
      'Blade-DesignatedTenant',
      'current',
      'size',
      '_ignore',
      '_equal',
      '_notequal',
      '_notlike',
      '_ge',
      '_le',
      '_gt',
      '_lt',
      '_datege',
      '_dategt',
      '_dateequal',
      '_datele',
      '_datelt',
      '_null',
      '_notnull',
      '_like',
    ];
    // eslint-disable-next-line no-restricted-syntax
    for (const query_key in query) {
      if (key.indexOf(query[query_key]) !== -1) {
        return true;
      }
    }
    return false;
  }

  /**
   * 添加查询条件
   * @param params 传到后台的查询对象
   * @param key 要添加的对象值
   * @param key_words 查询关键字
   */
  static addQuery(params, key, key_words) {
    const value = params[key];
    delete params[key];
    params[`${key}${key_words}`] = value;

    return params;
  }

  /**
   * 数组添加元素 且不能有重复元素
   * @param arr
   * @param str
   */
  static addWithoutReapet(arr, str) {
    if (!arr.includes(str)) {
      arr.push(str);
    }
    return arr;
  }

  /**
   * 校验json数据中是否含空数据
   */
  static checkJsonIncludeData(data) {
    let flag = false;
    const arr = Object.keys(data);
    for (const index in arr) {
      if (this.notEmpty(data[arr[index]]) && !arr[index].includes('Time')) {
        flag = true;
        break;
      }
    }
    return flag;
  }

  /**
   * 计算数组某个属性之和
   * @param arr
   * @param param
   * @returns {number}
   */
  static sumData(arr, param) {
    let sum = 0;

    if (!Array.isArray(arr)) {
      return sum;
    }

    if (arr.length < 1) {
      return sum;
    }
    arr.forEach(item => {
      const data = Number(item[param]).toFixed(2);
      // console.log(item[param],Number(item[param]),data,typeof data,typeof Number(data))
      sum += Number(data);
    });
    return sum.toFixed(2);
  }

  static NumberToString(n) {
    if (!/^(0|[1-9]\d*)(\.\d+)?$/.test(n)) {
      return '数据非法'; // 判断数据是否大于0
    }

    let unit = '千百拾亿千百拾万千百拾元角分';
    let str = '';
    n += '00';

    const indexpoint = n.indexOf('.'); // 如果是小数，截取小数点前面的位数

    if (indexpoint >= 0) {
      n = n.substring(0, indexpoint) + n.substr(indexpoint + 1, 2); // 若为小数，截取需要使用的unit单位
    }

    unit = unit.substr(unit.length - n.length); // 若为整数，截取需要使用的unit单位
    for (let i = 0; i < n.length; i++) {
      str += '零壹贰叁肆伍陆柒捌玖'.charAt(n.charAt(i)) + unit.charAt(i); // 遍历转化为大写的数字
    }

    return str
      .replace(/零(千|百|拾|角)/g, '零')
      .replace(/(零)+/g, '零')
      .replace(/零(万|亿|元)/g, '$1')
      .replace(/(亿)万|壹(拾)/g, '$1$2')
      .replace(/^元零?|零分/g, '')
      .replace(/元$/g, '元整'); // 替换掉数字里面的零字符，得到结果
  }

  /* 倒计时 */
  static countdown2(time) {
    // 处理苹果系统时间显示NaN问题
    if (typeof time === 'string' || typeof time === 'number') {
      time = time.replace(/-/g, '/');
    }
    const nowTime = new Date(); // 当前时间
    const endDate = new Date(time); // 截止时间
    let num = endDate.getTime() - nowTime.getTime();
    const day = Number.parseInt(num / (24 * 60 * 60 * 1000), 10);
    num %= 24 * 60 * 60 * 1000;
    const hour = Number.parseInt(num / (60 * 60 * 1000), 10);
    num %= 60 * 60 * 1000;
    const minute = Number.parseInt(num / (60 * 1000), 10);
    num %= 60 * 1000;
    const seconde = Number.parseInt(num / 1000, 10);
    return `${day} 天 ${hour} 时 ${minute} 分 ${seconde} 秒`;
  }

  // 获取服务器时间
  static getSeverTime() {
    let xmlHttp = new XMLHttpRequest();
    let severtime = '';
    if (!xmlHttp) {
      xmlHttp = new ActiveXObject('Microsoft.XMLHTTP');
    }
    xmlHttp.open('HEAD', location.href, false);
    xmlHttp.send();
    severtime = new Date(xmlHttp.getResponseHeader('Date'));
    return severtime;
  }

  // 倒计时
  static countdown(time, text) {
    const timer = '';
    // 处理苹果系统时间显示NaN问题
    if (typeof time === 'string' || typeof time === 'number') {
      time = time.replace(/-/g, '/');
    }
    let msg = '';
    // const bb = this.getSeverTime().getTime()
    const bb = new Date().getTime();
    const dd = new Date(time).getTime();
    const times = dd - bb;
    /* 判断截止时间减去当前时间 是否 小于0，小于0就停止定时器调用 */
    if (times <= 0) {
      msg = text || '0 天 0 时 0 分 0 秒';
      clearInterval(timer);
    } else {
      const nowTime = new Date(); // 当前时间
      const endDate = new Date(time); // 截止时间
      let num = endDate.getTime() - nowTime.getTime();
      const day = Number.parseInt(num / (24 * 60 * 60 * 1000), 10);
      num %= 24 * 60 * 60 * 1000;
      const hour = Number.parseInt(num / (60 * 60 * 1000), 10);
      num %= 60 * 60 * 1000;
      const minute = Number.parseInt(num / (60 * 1000), 10);
      num %= 60 * 1000;
      const seconde = Number.parseInt(num / 1000, 10);
      msg = `${day} 天 ${hour} 时 ${minute} 分 ${seconde} 秒`;
    }
    return msg;
  }

  static toPay(queueId, position) {
    if (window.__wxjs_environment === 'miniprogram') {
      // requestListApi('/api/mer-queue/wechat/checkWeChatIsBind',{}).then(resp=>{ // 检查是否绑定appid了
      //   if(resp.success && resp.data){ // 已绑定
      if (getCurrentUser().openId) {
        joinQueue({ id: queueId, formalQueuePosition: position }).then(rr => {
          if (rr.success) {
            requestApi('/api/mer-queue/wx/pay/unifiedorder', {
              orderId: rr.msg,
              payForm: '2',
            }).then(response => {
              // 调起微信支付
              console.log(response, '===response');
              // Toast.info(`调起支付${response.success}`)
              const { data } = response;
              // Toast.info(stringify(data))
              if (response.success) {
                Toast.info('1111 success');
                WeixinJSBridge.invoke(
                  'getBrandWCPayRequest',
                  {
                    appId: data.appId,
                    nonceStr: data.nonceStr,
                    package: data.packageValue,
                    paySign: data.paySign,
                    signType: 'MD5',
                    timeStamp: data.timeStamp,
                  },
                  function(res) {
                    Toast.info(res.err_msg);
                    if (res.err_msg === 'get_brand_wcpay_request:ok') {
                      Toast.info('排队成功');
                      router.push('/dashboard/function');
                    } else {
                      Toast.info('付费失败');
                    }
                  }
                );
              } else {
                Toast.info('微信授权有误，请联系管理员');
              }
            });
          } else {
            Toast.info('提交排队失败，请联系管理员');
          }
        });
      } else {
        // 未绑定 跳转去绑定
        // Toast.info('to Weixin')
        const item = {
          queueId,
          position,
          auth: getToken(),
        };
        const items = JSON.stringify(item);
        // console.log(item,'---------')
        wx.miniProgram.navigateTo({ url: `/pages/wxPay/wxPay?items=${items}` });
      }
      // })
    } else {
      Toast.info('不是微信支付环境');
    }
  }

  /* 身份证号中间内容用 * 号展示 */
  static bankNo(num) {
    return num.replace(/\s/g, '').replace(/(\d{4})\d+(\d{4})$/, '**** **** **** $2');
  }

  static IdentityCodeValid(value) {
    const p = /^[1-9]\d{5}(18|19|20)\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;
    const q = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/;
    if (value && value.length === 18 && p.test(value)) {
      const factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
      const parity = ['1', '0', 'X', '9', '8', '7', '6', '5', '4', '3', '2'];
      const code = value.substring(17);
      let sum = 0;
      for (let i = 0; i < 17; i += 1) {
        sum += value[i] * factor[i];
      }
      if (parity[sum % 11] === code.toUpperCase()) {
        return true;
      }
    }
    return !!(value && value.length === 15 && q.test(value));
  }

  // 判断对象是否为空
  static ifObjectNotNull(object) {
    if (object && JSON.stringify(object) !== '{}') {
      return true;
    }
    return false;
  }

  /* 当天时间的24小时之后 */
  static postpone = () => {
    return new Date((new Date() / 1000 + 86400) * 1000);
  };

  /* 当天时间的23点59分59秒 */
  static DayendTime = () => {
    return new Date().setHours(23, 59, 59);
  };

  /* 当天时间的23点59分59秒 */
  static DayendTime1 = () => {
    return new Date(new Date(new Date().toLocaleDateString()).getTime() + 24 * 60 * 60 * 1000 - 1);
  };

  // 当前月初时间
  static monthFirst = () => {
    const now = new Date(); // 当前时间
    const nowMonth = now.getMonth();
    const nowYear = now.getFullYear();
    return new Date(nowYear, nowMonth, 1);
  };

  /* 计算当前时间之前一个月的日期的0点0分0秒 */
  static MonthstartTime = () => {
    return new Date(new Date().getTime() - 30 * 24 * 60 * 60 * 1000);
  };

  // 判断字符串是否为年月日格式
  static isDate(val) {
    if (typeof val !== 'string') return false;
    return !!val.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/);
  }
}
