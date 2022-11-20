module.exports = {
  title: '大车奔腾物流平台',
  name: 'admin',
  // clientId: 'kspt', // 企业端id
  // clientSecret: 'saas_kspt', // 企业端密钥
  clientId: 'kspt_shf', // 客户端id
  clientSecret: 'saas_kspt_shf', // 客户端密钥
  // clientId: 'kspt_driver', // 司机端id
  // clientSecret: 'saas_kspt_driver', // 司机端密钥
  project: 'kspt', // wlhy 判断是否是网络货运
  // project:'wlhy',
  logoImgUrl: 'https://fhf.dachebenteng.com',
  homePage: '11',
  tenantMode: true, // 开启租户模式
  pwa: false,
  navTheme: 'dark', // theme for nav menu
  primaryColor: '#1890FF', // primary color of ant design#1890FF
  layout: 'sidemenu', // nav menu position: sidemenu or topmenu
  contentWidth: 'Fluid', // layout of content: Fluid or Fixed, only works when layout is topmenu
  fixedHeader: true, // sticky header`
  autoHideHeader: false, // auto hide header
  fixSiderbar: true, // sticky siderbar
  collapse: true,
  menu: {
    disableLocal: false,
  },
  // your iconfont Symbol Scrip Url
  // eg：//at.alicdn.com/t/font_1039637_btcrd5co4w.js
  // 注意：如果需要图标多色，Iconfont图标项目里要进行批量去色处理
  iconfontUrl: '',
  ifNeedRegister: true,
  // 流程设计器地址
  flowDesignUrl: 'http://localhost:9999',
  /*  loginNameMap:{
  }, */
  // currentTenant: '847975', // 东平
  currentTenant: 'login', // 客商平台
  loginTitle: {
    '000000': '山东矩阵',
    login: '大车奔腾物流平台',
    '077778': '客商平台',
    '847975': '智慧矿山管控平台',
    '077779': '宁夏煤业公司客商平台',
    wlhy: '物迹福达网络货运平台',
    '257720': '富油科技',
    '077768': '渤海实业',
    '947229': '嬴州矿业',
    '498569': '潍焦集团',
    '131078': '杰富意物流管理平台',
    '610791': '渤海南方',
    '568698': '湛江渤海实业',
    '925650': '兖矿能源',
    '661781': '国家能源',
    '042606': '董家口',
  },
};
