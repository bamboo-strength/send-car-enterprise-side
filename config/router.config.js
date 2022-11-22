export default [
  // user
  {
    path: '/user',
    component: '../layouts/UserLayout',
    routes: [
      { path: '/user', redirect: '/user/login' },
      { path: '/user/login', name: 'login', component: './Login/Login' },
      { path: '/user/register', name: 'joinus', component: './JoinUs/JoinUs' },
      { path: '/user/forgetPwd', component: './Login/ForgetPwd' },
    ],
  },
  // {
  //   path: '/base',
  //   routes: [
  //     {
  //       path: '/base/customer',
  //       routes: [
  //         { path: '/base/customer', redirect: '/base/customer/list' },
  //         { path: '/base/customer/list', component: './Base/Customer/Customer' },
  //         { path: '/base/customer/add', component: './Base/Customer/CustomerAdd' },
  //         { path: '/base/customer/edit/:id', component: './Base/Customer/CustomerEdit' },
  //         { path: '/base/customer/view/:id', component: './Base/Customer/CustomerView' },
  //       ],
  //     },
  //     {
  //       path: '/base/package',
  //       routes: [
  //         { path: '/base/package', redirect: '/base/package/list' },
  //         { path: '/base/package/list', component: './Base/Package/Package' },
  //         { path: '/base/package/add', component: './Base/Package/PackageAdd' },
  //         { path: '/base/package/edit/:id', component: './Base/Package/PackageEdit' },
  //         { path: '/base/package/view/:id', component: './Base/Package/PackageView' },
  //       ],
  //     },
  //     {
  //       path: '/base/spec',
  //       routes: [
  //         { path: '/base/spec', redirect: '/base/spec/list' },
  //         { path: '/base/spec/list', component: './Base/Spec/Spec' },
  //         { path: '/base/spec/add', component: './Base/Spec/SpecAdd' },
  //         { path: '/base/spec/edit/:id', component: './Base/Spec/SpecEdit' },
  //         { path: '/base/spec/view/:id', component: './Base/Spec/SpecView' },
  //       ],
  //     },
  //     {
  //       path: '/base/materialMine',
  //       routes: [
  //         { path: '/base/materialMine', redirect: '/base/materialMine/list' },
  //         { path: '/base/materialMine/list', component: './Base/MaterialMine/MaterialMineList' },
  //         { path: '/base/materialMine/view/:id', component: './Base/MaterialMine/MaterialMineView' },
  //       ],
  //     },
  //     {
  //       path: '/base/mineral',
  //       routes: [
  //         { path: '/base/mineral', redirect: '/base/mineral/list' },
  //         { path: '/base/mineral/list', component: './Base/Mineral/Mineral' },
  //         { path: '/base/mineral/add', component: './Base/Mineral/MineralAdd' },
  //         { path: '/base/mineral/edit/:id', component: './Base/Mineral/MineralEdit' },
  //         { path: '/base/mineral/view/:id', component: './Base/Mineral/MineralView' },
  //       ],
  //     },
  //     {
  //       path: '/base/truckinfo',
  //       routes: [
  //         { path: '/base/truckinfo', redirect: '/base/truckinfo/list' },
  //         { path: '/base/truckinfo/list', component: './Base/Truckinfo/Truckinfo' },
  //         { path: '/base/truckinfo/add', component: './Base/Truckinfo/TruckinfoAdd' },
  //         { path: '/base/truckinfo/edit/:id', component: './Base/Truckinfo/TruckinfoEdit' },
  //         { path: '/base/truckinfo/view/:id', component: './Base/Truckinfo/TruckinfoView' },
  //       ],
  //     },
  //     {
  //       path: '/base/carrier',
  //       routes: [
  //         { path: '/base/carrier', redirect: '/base/carrier/list' },
  //         { path: '/base/carrier/list', component: './Base/Carrier/Carrier' },
  //         { path: '/base/carrier/add', component: './Base/Carrier/CarrierAdd' },
  //         { path: '/base/carrier/edit/:id', component: './Base/Carrier/CarrierEdit' },
  //         { path: '/base/carrier/view/:id', component: './Base/Carrier/CarrierView' },
  //       ],
  //     },
  //     {
  //       path: '/base/log',
  //       routes: [
  //         { path: '/base/log', redirect: '/base/log/list' },
  //         { path: '/base/log/edit/:id', component: './Base/Log/LogEdit' },
  //         { path: '/base/log/view/:id', component: './Base/Log/LogView' },
  //         { path: '/base/log/list', component: './Base/Log/Log' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/shashi',// 砂石
  //   routes: [
  //     {
  //       path: '/shashi/selectMinecodeOrder/:tableName/:modulename',
  //       component: './Shashi/SelectMinecodeOrder/SelectMinecodeOrder',
  //     },
  //     {
  //       path: '/shashi/showMineOrderDetail/:tableName/:modulename/:id',
  //       component: './Shashi/SelectMinecodeOrder/ShowMineOrderDetail',
  //     },
  //     { path: '/shashi/getTheTask/:tableName/:modulename/:id', component: './Shashi/GetTheTask/GetTheTask' },
  //     {
  //       path: '/shashi/secondKillOrder/:tableName/:modulename/list',
  //       component: './Shashi/SecondKillOrder/SecondKillOrderList',
  //     }, // 秒杀列表
  //     {
  //       path: '/shashi/secondKillOrder/:tableName/:modulename/:id',
  //       component: './Shashi/SecondKillOrder/SecondKillOrder',
  //     },
  //     {//电子磅单导出
  //       path: '/shashi/electronicList/:tableName/:modulename/:id',
  //       component: './Shashi/ElectronicList/ElectronicList',
  //     },
  //     {//发运数据列表功能
  //       path: '/shashi/shipmentDataSum/shipmentDataSumList',
  //       component: './Shashi/ShipmentDataSum/ShipmentDataSumList',
  //     },
  //     {//发运数据汇总 第二页
  //       path: '/shashi/shipmentDataSum/shipmentDataSum/:id',
  //       component: './Shashi/ShipmentDataSum/ShipmentDataSum',
  //     },
  //     {//发运数据汇总 - 检斤明细
  //       path: '/shashi/weight/weighing',
  //       component: './Shashi/ShipmentDataSum/Weighing',
  //     },
  //     {
  //       path: '/shashi/shipContract',  // 合同管理
  //       routes: [
  //         // { path: '/shashi/shipContract/saleContract/list', component: './Shashi/SaleContract/SaleContractList' },
  //         { path: '/shashi/shipContract/saleContract/add', component: './Shashi/SaleContract/SaleContractAdd' },
  //         { path: '/shashi/shipContract/saleContract/edit/:id', component: './Shashi/SaleContract/SaleContractEdit' },
  //       ],
  //     },
  //     {
  //       path: '/shashi/dispatchManage', // 派车管理
  //       routes: [
  //         {
  //           path: '/shashi/dispatchManage/:tableName/:modulename/add',
  //           component: './Shashi/BigCustomerSendCar/BigCustomerSendCar',
  //         },
  //         {
  //           path: '/shashi/dispatchManage/:tableName/:modulename/adds', // 散户派车新增
  //           component: './Shashi/DispatchManage/DispatchManageAdd',
  //         },
  //         {
  //           path: '/shashi/dispatchManage/add',
  //           component: './Shashi/BigCustomerSendCar/BigCustomerSendCarAdd',
  //         },
  //         {
  //           path: '/shashi/dispatchManage/:tableName/:modulename/edit/:id',
  //           component: './Shashi/DispatchManage/DispatchManageEdit',
  //         },
  //       ],
  //     },

  //     {path: '/shashi/transPort/transPort',component: './Shashi/TransPort/TransPort'}, // 乳山资质审核
  //     {path: '/shashi/Yamei/inspectVehicleForYamei/:type',component: './Shashi/TransPort/InspectVehicleForYamei'}, // 亚美车检功能
  //     {path: '/shashi/checktheweight/export',component: './Shashi/checkTheWeight/CheckTheWeight'}, // 销售检斤导出功能

  //   ],
  // },
  // {
  //   path: '/ningMei',
  //   routes: [
  //     {
  //       path: '/ningMei/bookingDetail/:tableName/:modulename/:id',
  //       component: './NingMei/BookingDetail/BookingDetail',
  //     },
  //     {
  //       path: '/ningMei/bookingOrder/bookingOrder',
  //       component: './NingMei/BookingOrder/BookingOrder',
  //     },
  //     {
  //       path: '/ningMei/nmDispatch/:tableName/:modulename',
  //       component: './NingMei/NmDispatch/NmDispatchAssign',
  //     },
  //     {
  //       path: '/ningMei/nmDispatchDetail/:tableName/:modulename/:id',
  //       component: './NingMei/NmDispatch/NmDispatchAssignView',
  //     },
  //     {
  //       path: '/ningMei/nmDispatch/test',
  //       component: './NingMei/NmDispatch/Test',
  //     },
  //     {
  //       path: '/ningMei/nmDispatchPlan',
  //       routes: [
  //         { path: '/ningMei/nmDispatchPlan', redirect: '/ningMei/nmDispatchPlan/list' },
  //         { path: '/ningMei/nmDispatchPlan/list', component: './NingMei/NmDispatchPlan/NmDispatchplanList' },
  //         { path: '/ningMei/nmDispatchPlan/view/:id', component: './NingMei/NmDispatchPlan/NmDispatchplanView' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/network',
  //   routes: [
  //     {
  //       path: '/network/waybill',
  //       routes: [
  //         { path: '/network/waybill', component: './Network/Waybill' },
  //         { path: '/network/waybill/waybillview/:id', component: './Network/WaybillView' },
  //         { path: '/network/waybill/contractmanage', component: './Network/ContractManage' },
  //         { path: '/network/waybill/contractview/:id', component: './Network/ContractView' },
  //         { path: '/network/waybill/loadConfirm/:id', component: './Network/LoadConfirm' },
  //         { path: '/network/waybill/networkfeefback', component: './Network/NetWorkFeefBack' },
  //         { path: '/network/waybill/bidding', component: './Network/Bidding/Bidding' },
  //         { path: '/network/waybill/biddingView/:id', component: './Network/Bidding/BiddingView' },
  //         { path: '/network/waybill/grabasingle', component: './Network/GrabaSingle/GrabaSingle' },
  //         { path: '/network/waybill/grabasingleView/:id', component: './Network/GrabaSingle/GrabaSingleView' },
  //         { path: '/network/waybill/grabasingleRecord', component: './Network/GrabaSingle/GrabaSingleRecord' },
  //         {
  //           path: '/network/waybill/grabasingleRecordView',
  //           component: './Network/GrabaSingle/GrabaSingleRecordView',
  //         },
  //         { path: '/network/waybill/qrcode', component: './Network/QrCode/QrCode' },
  //         { path: '/network/waybill/waybillagreement', component: './Network/WaybillAgreement' },
  //         // { path: '/network/waybill/test', component: './Network/Test' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: 'wallet',  // 网络货运钱包
  //   routes: [
  //     {
  //       path: '/wallet/wallet',
  //       routes: [
  //         { path: '/wallet/wallet', component: './Wallet/Wallet' },
  //         { path: '/wallet/wallet/openwallet', component: './Wallet/OpenWallet' },
  //         { path: '/wallet/wallet/allthebills', component: './Wallet/AllTheBills' },
  //         { path: '/wallet/wallet/billsview', component: './Wallet/BillsView' },
  //         { path: '/wallet/wallet/paypassword', component: './Wallet/PayPassword' },
  //         { path: '/wallet/wallet/withdrawal', component: './Wallet/WithDrawal' },
  //         { path: '/wallet/wallet/authentication', component: './Wallet/Authentication' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/businessVehicle',
  //   routes: [
  //     { path: '/businessVehicle/businessVehicle', redirect: '/businessVehicle/businessVehicle/list' },
  //     {
  //       path: '/businessVehicle/businessVehicle/list',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleList',
  //     },
  //     {
  //       path: '/businessVehicle/businessVehicle/view/:id',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleView',
  //     },
  //     {
  //       path: '/businessVehicle/businessVehicle/edit/:id',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleEdit',
  //     },
  //     {
  //       path: '/businessVehicle/businessVehicle/add',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleAdd',
  //     },
  //     {
  //       path: '/businessVehicle/businessVehicle/audit/:id',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleAudit',
  //     },
  //     {
  //       path: '/businessVehicle/businessVehicle/cancel/:id',
  //       component: './Merchants/CommonBusinessVehicle/CommonBusinessVehicleCancel',
  //     },
  //   ],
  // },
  // {
  //   path: '/commonDriverAudit',
  //   routes: [
  //     { path: '/commonDriverAudit/commonDriverAudit', redirect: '/commonDriverAudit/commonDriverAudit/list' },
  //     {
  //       path: '/commonDriverAudit/commonDriverAudit/list',
  //       component: './Merchants/CommonBusinessDriver/CommonBusinessDriverList',
  //     },
  //     {
  //       path: '/commonDriverAudit/commonDriverAudit/view/:id',
  //       component: './Merchants/CommonBusinessDriver/CommonBusinessDriverView',
  //     },
  //     {
  //       path: '/commonDriverAudit/commonDriverAudit/audit/:id',
  //       component: './Merchants/CommonBusinessDriver/CommonBusinessDriverAudit',
  //     },
  //   ],
  // },
  // {
  //   path: '/weiJiao', // 维焦集团
  //   routes: [
  //     {
  //       path: '/weiJiao/wjDispatchOrderByPurchase',
  //       routes: [
  //         { path: '/weiJiao/wjDispatchOrderByPurchase', redirect: '/weiJiao/wjDispatchOrderByPurchase/list' },
  //         {
  //           path: '/weiJiao/wjDispatchOrderByPurchase/list',
  //           component: './WeiJiao/WjDispatchOrderByPurchase/WjDispatchOrder',
  //         },
  //         {
  //           path: '/weiJiao/wjDispatchOrderByPurchase/add',
  //           component: './WeiJiao/WjDispatchOrderByPurchase/WjDispatchOrderEdit',
  //         },
  //         {
  //           path: '/weiJiao/wjDispatchOrderByPurchase/view/:id',
  //           component: './WeiJiao/WjDispatchOrderByPurchase/WjDispatchOrderView',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/shashi/transPort/transPort',
  //       component: './Shashi/TransPort/TransPort'
  //     }
  //   ],
  // },
  // {
  //   path: '/work',
  //   routes: [
  //     {
  //       path: '/work/start',
  //       routes: [
  //         { path: '/work/start', redirect: '/work/start/list' },
  //         { path: '/work/start/list', component: './Work/WorkStart' },
  //       ],
  //     },
  //     {
  //       path: '/work/claim',
  //       routes: [
  //         { path: '/work/claim', redirect: '/work/claim/list' },
  //         { path: '/work/claim/list', component: './Work/WorkClaim' },
  //       ],
  //     },
  //     {
  //       path: '/work/todo',
  //       routes: [
  //         { path: '/work/todo', redirect: '/work/todo/list' },
  //         { path: '/work/todo/list', component: './Work/WorkTodo' },
  //       ],
  //     },
  //     {
  //       path: '/work/send',
  //       routes: [
  //         { path: '/work/send', redirect: '/work/send/list' },
  //         { path: '/work/send/list', component: './Work/WorkSend' },
  //       ],
  //     },
  //     {
  //       path: '/work/done',
  //       routes: [
  //         { path: '/work/done', redirect: '/work/done/list' },
  //         { path: '/work/done/list', component: './Work/WorkDone' },
  //       ],
  //     },
  //     {
  //       path: '/work/process',
  //       routes: [
  //         {
  //           path: '/work/process/leave/form/:processDefinitionId',
  //           component: './Work/Process/Leave/LeaveStart',
  //         },
  //         {
  //           path: '/work/process/leave/handle/:taskId/:processInstanceId/:businessId',
  //           component: './Work/Process/Leave/LeaveHandle',
  //         },
  //         {
  //           path: '/work/process/leave/detail/:processInstanceId/:businessId',
  //           component: './Work/Process/Leave/LeaveDetail',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/businessInto',
  //   routes: [
  //     {
  //       path: '/businessInto/auditcustomer',
  //       routes: [
  //         { path: '/businessInto/auditcustomer', redirect: '/businessInto/auditcustomer/list' },
  //         { path: '/businessInto/auditcustomer/list', component: './Merchants/Auditcustomer/Auditcustomer' },
  //         { path: '/businessInto/auditcustomer/add', component: './Merchants/Auditcustomer/AuditcustomerAdd' },
  //         {
  //           path: '/businessInto/auditcustomer/edit/:id',
  //           component: './Merchants/Auditcustomer/AuditcustomerEdit',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/auditcarrier',
  //       routes: [
  //         { path: '/businessInto/auditcarrier', redirect: '/businessInto/auditcarrier/list' },
  //         { path: '/businessInto/auditcarrier/list', component: './Merchants/Auditcarrier/Auditcarrier' },
  //         { path: '/businessInto/auditcarrier/add', component: './Merchants/Auditcarrier/AuditcarrierAdd' },
  //         { path: '/businessInto/auditcarrier/edit/:id', component: './Merchants/Auditcarrier/AuditcarrierEdit' },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/businessIntoQuery',
  //       routes: [
  //         { path: '/businessInto/businessIntoQuery', redirect: '/businessInto/businessIntoQuery/list' },
  //         {
  //           path: '/businessInto/businessIntoQuery/list',
  //           component: './Merchants/BusinessIntoQuery/BusinessIntoQuery',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/carrierIntoQuery',
  //       routes: [
  //         { path: '/businessInto/carrierIntoQuery', redirect: '/businessInto/carrierIntoQuery/list' },
  //         {
  //           path: '/businessInto/carrierIntoQuery/list',
  //           component: './Merchants/CarrierIntoQuery/CarrierIntoQuery',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/settledEnterprise',
  //       routes: [
  //         { path: '/businessInto/settledEnterprise', redirect: '/businessInto/settledEnterprise/list' },
  //         {
  //           path: '/businessInto/settledEnterprise/list',
  //           component: './Merchants/SettledEnterprise/SettledEnterprise',
  //         },
  //         {
  //           path: '/businessInto/settledEnterprise/edit/:tenantId',
  //           component: './Merchants/SettledEnterprise/SettledEnterpriseEdit',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/carrierPresence',
  //       routes: [
  //         { path: '/businessInto/carrierPresence', redirect: '/businessInto/carrierPresence/list' },
  //         { path: '/businessInto/carrierPresence/list', component: './Merchants/CarrierPresence/CarrierPresence' },
  //         {
  //           path: '/businessInto/carrierPresence/edit/:tenantId',
  //           component: './Merchants/CarrierPresence/CarrierPresenceEdit',
  //         },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/auditvehicle',
  //       routes: [
  //         { path: '/businessInto/auditvehicle', redirect: '/businessInto/auditvehicle/list' },
  //         { path: '/businessInto/auditvehicle/list', component: './Merchants/Auditvehicle/Auditvehicle' },
  //         { path: '/businessInto/auditvehicle/edit/:id', component: './Merchants/Auditvehicle/AuditvehicleEdit' },
  //       ],
  //     },
  //     {
  //       path: '/businessInto/auditcustuser', // 审核客户用户
  //       routes: [
  //         { path: '/businessInto/auditcustuser', redirect: '/businessInto/auditcustuser/list' },
  //         { path: '/businessInto/auditcustuser/list', component: './Merchants/AuditCustUser/AuditCustUserList' },
  //         {
  //           path: '/businessInto/auditcustuser/audit/:id',
  //           component: './Merchants/AuditCustUser/AuditCustUserAudit',
  //         },
  //         {
  //           path: '/businessInto/auditcustuser/auditcancel/:id',
  //           component: './Merchants/AuditCustUser/AuditCustUserCancel',
  //         },
  //         {
  //           path: '/businessInto/auditcustuser/view/:id',
  //           component: './Merchants/AuditCustUser/AuditCustUserDetail',
  //         },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/flow',
  //   routes: [
  //     {
  //       path: '/flow/model',
  //       routes: [
  //         { path: '/flow/model', redirect: '/flow/model/list' },
  //         { path: '/flow/model/list', component: './Flow/FlowModel' },
  //       ],
  //     },
  //     {
  //       path: '/flow/deploy',
  //       routes: [
  //         { path: '/flow/deploy', redirect: '/flow/deploy/upload' },
  //         { path: '/flow/deploy/upload', component: './Flow/FlowDeploy' },
  //       ],
  //     },
  //     {
  //       path: '/flow/manager',
  //       routes: [
  //         { path: '/flow/manager', redirect: '/flow/manager/list' },
  //         { path: '/flow/manager/list', component: './Flow/FlowManager' },
  //       ],
  //     },
  //     {
  //       path: '/flow/follow',
  //       routes: [
  //         { path: '/flow/follow', redirect: '/flow/follow/list' },
  //         { path: '/flow/follow/list', component: './Flow/FlowFollow' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/kswallet',
  //   routes: [
  //     {
  //       path: '/kswallet/wallhomepage',
  //       routes: [
  //         // { path: '/kswallet/wallhomepage', redirect: '/kswallet/wallhomepage'},
  //         { path: '/kswallet/wallhomepage', component: './KsWallet/WalletHomePage' },
  //         { path: '/kswallet/wallhomepage/walletopen/:type', component: './KsWallet/WalletOpen' },
  //         { path: '/kswallet/wallhomepage/walletpage', component: './KsWallet/WalletPage' }, // 钱包信息
  //         { path: '/kswallet/wallhomepage/kswithdrawal', component: './KsWallet/ksWithDrawal' },
  //       ],
  //     },
  //     {
  //       path: '/kswallet/setupthe',
  //       routes: [
  //         {path: '/kswallet/setupthe',component: './KsWallet/SetUpThe/SetUpThe'},

  //       ]
  //     },
  //     //1绑定银行卡的第三方
  //     {
  //       path: '/kswallet/personalsettleaccount',
  //       routes: [
  //         {path: '/kswallet/personalsettleaccount/unboundcard/:type',component: './KsWallet/PersonalSettleAccount/UnboundCard'},
  //         //钱包账户信息
  //         {path: '/kswallet/personalsettleaccount/accountinformation',component: './KsWallet/PersonalSettleAccount/Accountinformation'},
  //       ]
  //     },
  //     {
  //       path: '/kswallet/billing',
  //       routes: [
  //         {path: '/kswallet/billing/billingList',component: './KsWallet/Billing/BillingList'},
  //         {path: '/kswallet/billing/billingdetails/:id',component: './KsWallet/Billing/BillingDetails'},
  //       ]
  //     },
  //   ],
  // },
  // {
  //   path: '/paygoods', // 支付货款 钱包
  //   routes: [
  //     {
  //       path: '/paygoods/payhomepage',
  //       routes: [
  //         { path: '/paygoods/payhomepage', component: './PayGoods/PayHomePage' },
  //       ]
  //     },
  //     {
  //       path: '/paygoods/paidgoods',
  //       routes: [
  //         { path: '/paygoods/paidgoods', component: './PayGoods/PaidGoods' },
  //       ]
  //     }
  //   ]
  // },
  // {
  //   path: '/waybill',
  //   routes: [
  //     {
  //       path: '/waybill/waybill',
  //       routes: [
  //         { path: '/waybill/waybill', redirect: '/waybill/waybill/list' },
  //         { path: '/waybill/waybill/list', component: './Merchants/Waybill/Waybillpc' },
  //         { path: '/waybill/waybill/view/:id', component: './Merchants/Waybill/WaybillpcView' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   path: '/vehicleCarMatching', // 车货匹配
  //   routes: [
  //     {
  //       path:'/vehicleCarMatching/ordergrabbingmanage', // 抢单
  //       routes:[
  //         { path: '/vehicleCarMatching/ordergrabbingmanage', redirect: '/vehicleCarMatching/ordergrabbingmanage/list' },
  //         { path: '/vehicleCarMatching/ordergrabbingmanage/list', component: './VehicleCarMatching/GrabOrders/GrabaSingle' },
  //         { path: '/vehicleCarMatching/ordergrabbingmanage/view/:id', component: './VehicleCarMatching/GrabOrders/GrabaSingleView' },
  //         { path: '/vehicleCarMatching/ordergrabbingmanage/ordergrabbingrecord', component: './VehicleCarMatching/GrabOrders/GrabaSingleRecord' },
  //         { path: '/vehicleCarMatching/ordergrabbingmanage/recordview', component: './VehicleCarMatching/GrabOrders/GrabaSingleRecordView', },
  //       ]
  //     },
  //     {
  //       path:'/vehicleCarMatching/waybillmanagement', // 运单
  //       routes:[
  //         { path: '/vehicleCarMatching/waybillmanagement', component: './VehicleCarMatching/WayBill/Waybill' },
  //         { path: '/vehicleCarMatching/waybillmanagement/view/:id', component: './VehicleCarMatching/WayBill/WaybillView' },
  //         { path: '/vehicleCarMatching/waybillmanagement/loadConfirm/:id', component: './VehicleCarMatching/WayBill/LoadConfirm' },
  //       ]
  //     }
  //   ],
  // },
  // {
  //   path: '/tool',
  //   routes: [
  //     {
  //       path: '/tool/code',
  //       routes: [
  //         { path: '/tool/code', redirect: '/tool/code/list' },
  //         { path: '/tool/code/list', component: './System/Code/Code' },
  //         { path: '/tool/code/add', component: './System/Code/CodeAdd' },
  //         { path: '/tool/code/add/:id', component: './System/Code/CodeAdd' },
  //         { path: '/tool/code/edit/:id', component: './System/Code/CodeEdit' },
  //         { path: '/tool/code/view/:id', component: './System/Code/CodeView' },
  //       ],
  //     },

  //   ],
  // },
  // {
  //   path: '/system',
  //   routes: [
  //     {
  //       path: '/system/user',
  //       routes: [
  //         { path: '/system/user', redirect: '/system/user/list' },
  //         { path: '/system/user/list', component: './System/User/User' },
  //         { path: '/system/user/add', component: './System/User/UserAdd' },
  //         { path: '/system/user/edit/:id', component: './System/User/UserEdit' },
  //         { path: '/system/user/view/:id', component: './System/User/UserView' },
  //       ],
  //     },
  //     {
  //       path: '/system/changepassword',
  //       routes: [
  //         { path: '/system/changepassword', redirect: '/system/changepassword/detail' },
  //         { path: '/system/changepassword/detail', component: './System/User/ChangePassword' },
  //       ],
  //     },
  //     {
  //       path: '/system/dict',
  //       routes: [
  //         { path: '/system/dict', redirect: '/system/dict/list' },
  //         { path: '/system/dict/list', component: './System/Dict/Dict' },
  //         { path: '/system/dict/add', component: './System/Dict/DictAdd' },
  //         { path: '/system/dict/add/:id', component: './System/Dict/DictAdd' },
  //         { path: '/system/dict/edit/:id', component: './System/Dict/DictEdit' },
  //         { path: '/system/dict/view/:id', component: './System/Dict/DictView' },
  //       ],
  //     },
  //     {
  //       path: '/system/dept',
  //       routes: [
  //         { path: '/system/dept', redirect: '/system/dept/list' },
  //         { path: '/system/dept/list', component: './System/Dept/Dept' },
  //         { path: '/system/dept/add', component: './System/Dept/DeptAdd' },
  //         { path: '/system/dept/add/:id', component: './System/Dept/DeptAdd' },
  //         { path: '/system/dept/edit/:id', component: './System/Dept/DeptEdit' },
  //         { path: '/system/dept/view/:id', component: './System/Dept/DeptView' },
  //       ],
  //     },
  //     {
  //       path: '/system/menu',
  //       routes: [
  //         { path: '/system/menu', redirect: '/system/menu/list' },
  //         { path: '/system/menu/list', component: './System/Menu/Menu' },
  //         { path: '/system/menu/add', component: './System/Menu/MenuAdd' },
  //         { path: '/system/menu/add/:id', component: './System/Menu/MenuAdd' },
  //         { path: '/system/menu/edit/:id', component: './System/Menu/MenuEdit' },
  //         { path: '/system/menu/view/:id', component: './System/Menu/MenuView' },
  //       ],
  //     },
  //     {
  //       path: '/system/topmenu',
  //       routes: [
  //         { path: '/system/topmenu', redirect: '/system/topmenu/list' },
  //         { path: '/system/topmenu/list', component: './System/TopMenu/TopMenu' },
  //         { path: '/system/topmenu/add', component: './System/TopMenu/TopMenuAdd' },
  //         { path: '/system/topmenu/add/:id', component: './System/TopMenu/TopMenuAdd' },
  //         { path: '/system/topmenu/edit/:id', component: './System/TopMenu/TopMenuEdit' },
  //         { path: '/system/topmenu/view/:id', component: './System/TopMenu/TopMenuView' },
  //       ],
  //     },
  //     {
  //       path: '/system/param',
  //       routes: [
  //         { path: '/system/param', redirect: '/system/param/list' },
  //         { path: '/system/param/list', component: './System/Param/Param' },
  //         { path: '/system/param/add', component: './System/Param/ParamAdd' },
  //         { path: '/system/param/edit/:id', component: './System/Param/ParamEdit' },
  //         { path: '/system/param/view/:id', component: './System/Param/ParamView' },
  //       ],
  //     },
  //     {
  //       path: '/system/tenant',
  //       routes: [
  //         { path: '/system/tenant', redirect: '/system/tenant/list' },
  //         { path: '/system/tenant/list', component: './System/Tenant/Tenant' },
  //         { path: '/system/tenant/add', component: './System/Tenant/TenantAdd' },
  //         { path: '/system/tenant/edit/:id', component: './System/Tenant/TenantEdit' },
  //         { path: '/system/tenant/view/:id', component: './System/Tenant/TenantView' },
  //       ],
  //     },
  //     {
  //       path: '/system/client',
  //       routes: [
  //         { path: '/system/client', redirect: '/system/client/list' },
  //         { path: '/system/client/list', component: './System/Client/Client' },
  //         { path: '/system/client/add', component: './System/Client/ClientAdd' },
  //         { path: '/system/client/edit/:id', component: './System/Client/ClientEdit' },
  //         { path: '/system/client/view/:id', component: './System/Client/ClientView' },
  //       ],
  //     },
  //   ],
  // },
  // {
  //   name: 'editor',
  //   icon: 'highlight',
  //   path: '/editor',
  //   routes: [
  //     {
  //       path: '/editor/flow',
  //       name: 'flow',
  //       component: './Editor/GGEditor/Flow',
  //     },
  //     {
  //       path: '/editor/mind',
  //       name: 'mind',
  //       component: './Editor/GGEditor/Mind',
  //     },
  //     {
  //       path: '/editor/koni',
  //       name: 'koni',
  //       component: './Editor/GGEditor/Koni',
  //     },
  //   ],
  // },//  editor
  {
    path: '/authority',
    routes: [
      {
        path: '/authority/role',
        routes: [
          { path: '/authority/role', redirect: '/authority/role/list' },
          { path: '/authority/role/list', component: './Authority/Role/Role' },
          { path: '/authority/role/add', component: './Authority/Role/RoleAdd' },
          { path: '/authority/role/add/:id', component: './Authority/Role/RoleAdd' },
          { path: '/authority/role/edit/:id', component: './Authority/Role/RoleEdit' },
          { path: '/authority/role/view/:id', component: './Authority/Role/RoleView' },
        ],
      },
      {
        path: '/authority/datascope',
        routes: [
          { path: '/authority/datascope', redirect: '/authority/datascope/list' },
          { path: '/authority/datascope/list', component: './Authority/DataScope/DataScope' },
        ],
      },
      {
        path: '/authority/apiscope',
        routes: [
          { path: '/authority/apiscope', redirect: '/authority/apiscope/list' },
          { path: '/authority/apiscope/list', component: './Authority/ApiScope/ApiScope' },
        ],
      },
    ],
  },
  {
    path: '/truck',
    routes: [
      { path: '/truck/order', component: './TruckingOrder/list' },
    ]
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/dashboard/function'
      },
      {
        path: '/result',
        routes: [
          // result
          { path: '/result/success', component: './Result/Success' },
          { path: '/result/fail', component: './Result/Error' },
        ],
      },
      {
        path: '/exception',// exception
        routes: [
          { path: '/exception/403', name: 'not-permission', component: './Exception/403' },
          { path: '/exception/404', name: 'not-find', component: './Exception/404' },
          { path: '/exception/500', name: 'server-error', component: './Exception/500' },
          { path: '/exception/503', name: 'server-error', component: './Exception/503' },
          {
            path: '/exception/trigger',
            name: 'trigger',
            component: './Exception/TriggerException',
          },
        ],
      },
      // {
      //   path: '/commonBusiness',
      //   routes: [
      //     {
      //       path: '/commonBusiness/commonList/:tableName/:modulename',
      //       component: './Merchants/CommonBusiness/CommonPageList',
      //     },
      //     {
      //       path: '/commonBusiness/commonDetail/:tableName/:modulename/:id',
      //       component: './Merchants/CommonBusiness/CommonPageView',
      //     },
      //     {
      //       path: '/commonBusiness/commonAdd/:tableName/:modulename',
      //       component: './Merchants/CommonBusiness/CommonPageAdd',
      //     },
      //     {
      //       path: '/commonBusiness/commonEdit/:tableName/:modulename/:id',
      //       component: './Merchants/CommonBusiness/CommonPageEdit',
      //     },
      //     {
      //       path: '/commonBusiness/commonPay/:tableName/:modulename/:id',
      //       component: './Merchants/CommonBusiness/CommonPagePay',
      //     },
      //     {
      //       path: '/commonBusiness/commonDispatch/:tableName/:modulename',
      //       component: './Merchants/CommonBusiness/CommonPageDispatch',
      //     },
      //     {
      //       path: '/commonBusiness/commonDispatchList/:tableName/:modulename',
      //       component: './Merchants/CommonBusiness/CommonPageDispatchList', // 对接发运项目 操作根据租户自定义
      //     },
      //     {
      //       path: '/commonBusiness/commonBringDataByParam/:tableName/:modulename', //页面先填写某字段信息 请求后台 带出数据
      //       component: './Merchants/CommonBusiness/CommonBringDataByParam',
      //     },
      //     {
      //       path: '/commonBusiness/toprotoType/:tableName/:modulename',
      //       component: './Merchants/CommonBusiness/ToProtoTypes',
      //     },
      //   ],
      // },
      // {
      //   path: '/epidemic',
      //   routes: [
      //     {path: '/epidemic/epidemic',component: './Epidemic/Epidemic/Epidemic'},
      //     {path: '/epidemic/epidemicAdd',component: './Epidemic/Epidemic/EpidemicAdd'},
      //     {path: '/epidemic/epidemicEdit/:id',component: './Epidemic/Epidemic/EpidemicEdit'},
      //     {path: '/epidemic/epidemiclineup',component: './Epidemic/EpidemicLineUp'}, //预约排队
      //     {path: '/epidemic/vaccinerecords',component: './Epidemic/VaccineRecords/VaccineRecords'}, // 防疫记录
      //     {path: '/epidemic/vaccinerecordsview/:id',component: './Epidemic/VaccineRecords/VaccineRecordsView'},
      //     {path: '/epidemic/statements',component: './Epidemic/Statements/Statements'},
      //     {path: '/epidemic/statementsview/:id',component: './Epidemic/Statements/StatementsView'},
      //     {path: '/epidemic/queuemanagement',component: './Epidemic/QueueManagement/QueueManagement'},
      //     {path: '/epidemic/queuematerial',component: './Epidemic/QueueManagement/QueueMaterial'},
      //     {path: '/epidemic/queuematerialall',component: './Epidemic/QueueManagement/QueueMaterialAll'},
      //     {path: '/epidemic/queuemanagementview/:id',component: './Epidemic/QueueManagement/QueueManagementView'},
      //     {path: '/epidemic/modifysettings',component: './Epidemic/QueueManagement/ModifySettings'},
      //     {path: '/epidemic/freightyard',component: './Epidemic/FreightYard'},
      //     {path: '/epidemic/arefund',component: './Epidemic/ARefund'},
      //     {path: '/epidemic/numeral',component: './Epidemic/Numeral'},  //排队申请
      //     {path: '/epidemic/passphrase',component: './Epidemic/Passphrase'},  //
      //     {path: '/epidemic/lineuprecord',component: './Epidemic/LineUpRecord'}, // 排队记录
      //     {
      //       path: '/epidemic/indexpage',
      //       routes: [
      //         {path: '/epidemic/indexpage/goodsByDept/:id',component: './Epidemic/IndexPage/GoodsByDept'}, // 首页厂区物资
      //         {path: '/epidemic/indexpage/showQueueMap',component: './Epidemic/IndexPage/ShowQueueMap'}, //排队地图情况
      //       ],
      //     },
      //     {
      //       path: '/epidemic/queue',
      //       routes: [
      //         {path: '/epidemic/queue/formalQueue',component: './Epidemic/QueueMap/FormalQueue2'},  //正式排队 3.21号切换为外壳获取位置
      //         {path: '/epidemic/queue/formalQueueWx',component: './Epidemic/QueueMap/FormalQueue2'},  // 正式排队 使用微信定位
      //         {path: '/epidemic/queue/cancelQueue',component: './Epidemic/QueueMap/CancelQueue'},  //取消排队
      //       ],
      //     },
      //     {
      //       path: '/epidemic/transactionrecord',   // 交易记录
      //       routes: [
      //         {path:'/epidemic/transactionrecord',component: './Epidemic/TransactionRecord/TransactionRecord'},  // 交易记录
      //         {path:'/epidemic/transactionrecord/refundDetails/:id',component: './Epidemic/TransactionRecord/RefundDetails'},  // 退款详情
      //         {path:'/epidemic/transactionrecord/PaymentDetails/:id',component: './Epidemic/TransactionRecord/PaymentDetails'},  // 支付详情

      //       ]
      //     },
      //     {
      //       path: '/epidemic/riskmanage', routes: [ // 中高风险管理
      //         { path: '/epidemic/riskmanage', redirect: '/epidemic/riskmanage/list' },
      //         { path: '/epidemic/riskmanage/list', component: './Epidemic/RiskManage/RiskList' },
      //         { path: '/epidemic/riskmanage/add', component: './Epidemic/RiskManage/RiskAdd' },
      //         { path: '/epidemic/riskmanage/edit/:id', component: './Epidemic/RiskManage/RiskEdit' },
      //         { path: '/epidemic/riskmanage/view/:id', component: './Epidemic/RiskManage/RiskView' },
      //       ],
      //     },
      //   ]
      // },
      // {
      //   path: '/account',
      //   routes: [
      //     {
      //       path: '/account/center',
      //       component: './Account/Center/Center',
      //       routes: [
      //         { path: '/account/center', redirect: '/account/center/articles' },
      //         { path: '/account/center/articles', component: './Account/Center/Articles' },
      //         { path: '/account/center/applications', component: './Account/Center/Applications' },
      //         { path: '/account/center/projects', component: './Account/Center/Projects' },
      //       ],
      //     },
      //     {
      //       path: '/account/settings',
      //       component: './Account/Settings/Info',
      //       routes: [
      //         { path: '/account/settings', redirect: '/account/settings/base' },
      //         { path: '/account/settings/base', component: './Account/Settings/BaseView' },
      //         { path: '/account/settings/security', component: './Account/Settings/SecurityView' },
      //         { path: '/account/settings/binding', component: './Account/Settings/BindingView' },
      //         {
      //           path: '/account/settings/notification',
      //           component: './Account/Settings/NotificationView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      {
        path: '/dashboard',
        routes: [
          // { path: '/dashboard/monitor', component: './Dashboard/Monitor' },
          // { path: '/dashboard/menu', component: './Dashboard/Menu' },
          { path: '/dashboard/function', component: './Dashboard/Function' },
          // { path: '/dashboard/networkfreight', component: './Dashboard/NetworkFreight' },
          // { path: '/dashboard/SupplyHall', component: './Dashboard/SupplyHall' },
          // { path: '/dashboard/Photograph', component: './PageMould/Photograph' },
          // { path: '/dashboard/zhongchepaizhao', component: './PageMould/Zhongchepaizhao' },
          // { path: '/dashboard/kongchepaizhao', component: './PageMould/Kongchepaizhao' },
          // { path: '/dashboard/shangchuanchenggong', component: './PageMould/Shangchuanchenggeng' },
          // { path: '/dashboard/yphotography', component: './PageMould/Yphotography' },
          // { path: '/dashboard/chakantupian', component: './PageMould/Chakantupian' },
          // { path: '/dashboard/shebeizijian', component: './PageMould/Shebeizijian' }
        ],
      },
      // {
      //   path: '/desk',
      //   routes: [
      //     {
      //       path: '/desk/notice',
      //       routes: [
      //         { path: '/desk/notice', redirect: '/desk/notice/list' },
      //         { path: '/desk/notice/list', component: './Desk/Notice/Notice' },
      //         { path: '/desk/notice/add', component: './Desk/Notice/NoticeAdd' },
      //         { path: '/desk/notice/edit/:id', component: './Desk/Notice/NoticeEdit' },
      //         { path: '/desk/notice/view/:id', component: './Desk/Notice/NoticeView' },
      //       ],
      //     },
      //     {
      //       path: '/desk/dataPage',
      //       routes: [
      //         { path: '/desk/dataPage', redirect: '/desk/dataPage/list' },
      //         { path: '/desk/dataPage/list', component: './Desk/DataPage/DataPage' },
      //       ],
      //     },
      //     {
      //       path: '/desk/feedbackfordp',// 企业端意见反馈查看
      //       routes: [
      //         { path: '/desk/feedbackfordp', redirect: '/desk/feedbackfordp/list' },
      //         {path: '/desk/feedbackfordp/list', component: './Shashi/FeedBackList',
      //         },
      //       ]
      //     },
      //   ],
      // },
      // {
      //   path: '/console',
      //   routes: [
      //     {
      //       path: '/console/product',
      //       routes: [
      //         { path: '/console/product/flowcontrol', component: './Console/Product/FlowControl' },
      //         { path: '/console/product/merchants', component: './Console/Product/Merchants' },
      //         { path: '/console/product/product/:product', component: './Console/Product/Product' },
      //       ],
      //     },
      //     {
      //       path: '/console/homepage',
      //       routes: [
      //         { path: '/console/homepage', redirect: '/console/homepage/homepage' },
      //         { path: '/console/homepage/homepage', component: './Console/HomePage/HomePage' },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/shipbill',
      //   routes: [
      //     {
      //       path: '/shipbill/shipbillorder',
      //       routes: [
      //         { path: '/shipbill/shipbillorder', redirect: '/shipbill/shipbillorder/list' },
      //         { path: '/shipbill/shipbillorder/list', component: './Merchants/Shipbillorder/Shipbillorder' },
      //         { path: '/shipbill/shipbillorder/view/:id', component: './Merchants/Shipbillorder/ShipbillorderView' },
      //       ],
      //     },
      //     {
      //       path: '/shipbill/shipbillplan',
      //       routes: [
      //         { path: '/shipbill/shipbillplan', redirect: '/shipbill/shipbillplan/list' },
      //         { path: '/shipbill/shipbillplan/list', component: './Merchants/Shipbillplan/Shipbillplan' },
      //         { path: '/shipbill/shipbillplan/view/:id', component: './Merchants/Shipbillplan/ShipbillplanView' },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/salebill',
      //   routes: [
      //     {
      //       path: '/salebill/salebill',
      //       routes: [
      //         { path: '/salebill/salebill', redirect: '/salebill/salebill/list' },
      //         { path: '/salebill/salebill/list', component: './Merchants/Salebill/Salebill' },
      //         { path: '/salebill/salebill/view/:id', component: './Merchants/Salebill/SalebillView' },
      //         { path: '/salebill/salebill/rs/:id', component: './Merchants/Salebill/ReleaseSource' },
      //         { path: '/salebill/salebill/edit/:id', component: './Merchants/Salebill/SalebillEdit' },
      //         { path: '/salebill/salebill/add', component: './Merchants/Salebill/SalebillAdd' },
      //         { path: '/salebill/salebill/os/:id', component: './Merchants/Salebill/OnlineShipping' },
      //         { path: '/salebill/salebill/osview/:id', component: './Merchants/Salebill/OnlineShippingView' },

      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/dispatch',
      //   routes: [
      //     {
      //       path: '/dispatch/dispatchplan',
      //       routes: [
      //         { path: '/dispatch/dispatchplan', redirect: '/dispatch/dispatchplan/list' },
      //         { path: '/dispatch/dispatchplan/list', component: './Merchants/Dispatchplan/DispatchplanList' },
      //         { path: '/dispatch/dispatchplan/add', component: './Merchants/Dispatchplan/DispatchplanAdd' },
      //         { path: '/dispatch/dispatchplan/edit/:id', component: './Merchants/Dispatchplan/DispatchplanEdit' },
      //         { path: '/dispatch/dispatchplan/view/:id', component: './Merchants/Dispatchplan/DispatchplanView' },
      //       ],
      //     },
      //     {
      //       path: '/dispatch/dispatchplanByorder',
      //       routes: [
      //         { path: '/dispatch/dispatchplanByorder', redirect: '/dispatch/dispatchplanByorder/list' },
      //         {
      //           path: '/dispatch/dispatchplanByorder/list',
      //           component: './Merchants/DispatchplanByOrder/DispatchplanByOrderList',
      //         },
      //         {
      //           path: '/dispatch/dispatchplanByorder/add',
      //           component: './Merchants/DispatchplanByOrder/DispatchplanByOrderAdd',
      //         },
      //         {
      //           path: '/dispatch/dispatchplanByorder/edit/:id',
      //           component: './Merchants/DispatchplanByOrder/DispatchplanByOrderEdit',
      //         },
      //         {
      //           path: '/dispatch/dispatchplanByorder/view/:id',
      //           component: './Merchants/DispatchplanByOrder/DispatchplanByOrderView',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/dispatch/dispatchbillbyorder',
      //       routes: [
      //         { path: '/dispatch/dispatchbillbyorder', redirect: '/dispatch/dispatchbillbyorder/list' },
      //         {
      //           path: '/dispatch/dispatchbillbyorder/list',
      //           component: './Merchants/DispatchbillByOrder/DispatchbillByOrderList',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyorder/add',
      //           component: './Merchants/DispatchbillByOrder/DispatchbillByOrderAdd',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyorder/edit/:id',
      //           component: './Merchants/DispatchbillByOrder/DispatchbillByOrderEdit',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyorder/view/:id',
      //           component: './Merchants/DispatchbillByOrder/DispatchbillByOrderView',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/dispatch/dispatchbillbyplan',
      //       routes: [
      //         { path: '/dispatch/dispatchbillbyplan', redirect: '/dispatch/dispatchbillbyplan/list' },
      //         {
      //           path: '/dispatch/dispatchbillbyplan/list',
      //           component: './Merchants/DispatchbillByPlan/DispatchbillByPlanList',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyplan/add',
      //           component: './Merchants/DispatchbillByPlan/DispatchbillByPlanAdd',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyplan/edit/:id',
      //           component: './Merchants/DispatchbillByPlan/DispatchbillByPlanEdit',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbyplan/view/:id',
      //           component: './Merchants/DispatchbillByPlan/DispatchbillByPlanView',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/dispatch/dispatchbillbywaybill',
      //       routes: [
      //         { path: '/dispatch/dispatchbillbywaybill', redirect: '/dispatch/dispatchbillbywaybill/list' },
      //         {
      //           path: '/dispatch/dispatchbillbywaybill/list',
      //           component: './Merchants/DispatchbillByWaybill/DispatchbillByWaybillList',
      //         },
      //         {
      //           path: '/dispatch/dispatchbillbywaybill/view/:id',
      //           component: './Merchants/DispatchbillByWaybill/DispatchbillByWaybillView',
      //         },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/avoidclose',
      //   routes: [{
      //     path: '/avoidclose/avoidclosetopay',
      //     routes: [
      //       { path: '/avoidclose/avoidclosetopay', redirect: '/avoidclose/avoidclosetopay/list' },
      //       { path: '/avoidclose/avoidclosetopay/list', component: './Avoidclosetopay/AvoidCloseToPay' },
      //     ],
      //   }],
      // },
      // {
      //   path: '/bhsy', // 存放维焦集团 与 渤海实业
      //   routes: [
      //     { path: '/bhsy/basic/showQrCode', component: './WeiJiao/Basic/ShowQrCode' }, // 渤海实业二维码查看
      //   ],
      // },
      // {
      //   path: '/driverSide',
      //   routes: [
      //     { path: '/driverSide/personal/personalCenter', component: './DriverSide/Personal/PersonalCen' }, //个人中心（司机）
      //     { path: '/driverSide/personal/personalShipper', component: './DriverSide/Personal/PersonalShipper' },//个人中心（三方）
      //     { path: '/driverSide/personal/personalSetting', component: './DriverSide/Personal/PersonalSetting' }, //个人中心（司机）
      //     { path: '/driverSide/personal/theReport', component: './DriverSide/Personal/TheReport' },//报表
      //     { path: '/driverSide/personal/ceshitab', component: './DriverSide/Personal/ceshitab' },//报表
      //     {
      //       path: '/driverSide/personal/driverCertification',
      //       component: './DriverSide/Personal/DriverCertification',
      //     }, // 司机认证
      //     {
      //       path: '/driverSide/personal/driverCertificationView/:id',
      //       component: './DriverSide/Personal/DriverCertificationView',
      //     }, // 司机认证信息查看
      //     {
      //       path: '/driverSide/personal/driverCertification2', // 网络货运司机认证
      //       component: './DriverSide/Personal/DriverCertification2',
      //     },
      //     //       { path: '/driverSide/personal/deviceregistered', component: './DriverSide/Personal/DeviceRegistered', }, // 设备注册
      //     { path: '/driverSide/personal/myCars', component: './DriverSide/Personal/MyCars' },//我的车辆
      //     { path: '/driverSide/personal/carLeader/:state', component: './DriverSide/Personal/CarLeader' },//车队长绑定
      //     { path: '/driverSide/personal/networkMyCars', component: './DriverSide/Personal/NetWorkMyCars' },//我的车辆
      //     { path: '/driverSide/personal/myDrivers', component: './DriverSide/Personal/MyDrivers' }, // 我的司机
      //     { path: '/driverSide/personal/inviteDrivers', component: './DriverSide/Personal/InviteDrivers' },//邀请司机
      //     { path: '/driverSide/personal/assignDrivers', component: './DriverSide/Personal/AssignDrivers' },// 分配司机
      //     { path: '/driverSide/personal/runOftenLine', component: './DriverSide/Personal/RunOftenLine' },// 常跑货源
      //     { path: '/driverSide/personal/runOftenLineAdd', component: './DriverSide/Personal/RunOftenLineAdd' },// 常跑路线
      //     { path: '/driverSide/personal/friendInvitation', component: './DriverSide/Personal/FriendInvitation' },
      //     {
      //       path: '/driverSide/personal/carCertification/:truckId',
      //       component: './DriverSide/Personal/CarCertificationNew',
      //     },
      //     {
      //       path: '/driverSide/personal/carCertification2/:truckId',
      //       component: './DriverSide/Personal/CarCertification2',
      //     },
      //     { path: '/driverSide/personal/ownerCollection', component: './DriverSide/Personal/OwnerCollection' },
      //     { path: '/driverSide/personal/feedback', component: './DriverSide/Personal/FeedBack' },
      //     { path: '/driverSide/personal/vehicleParking', component: './DriverSide/Personal/VehicleParking' },
      //     { path: '/driverSide/personal/myMessage', component: './DriverSide/Personal/MyMessage' },
      //     { path: '/driverSide/personal/myBankcard', component: './DriverSide/Personal/MyBankcard' },
      //     { path: '/driverSide/personal/myBankcardAdd', component: './DriverSide/Personal/MyBankcardAdd' },
      //     { path: '/driverSide/personal/selectShippers', component: './DriverSide/Personal/SelectShippers' },
      //     {
      //       path: '/driverSide/personal/defaultShippersList',
      //       component: './DriverSide/Personal/DefaultShippersList',
      //     },
      //     { path: '/driverSide/personal/customerSelfInfo', component: './DriverSide/Personal/CustomerSelfInfo' },// 企业信息维护
      //     { path: '/driverSide/personal/carrierSelfInfo', component: './DriverSide/Personal/CarrierSelfInfo' },//承运商信息维护
      //     /*{ path: '/driverSide/personal/smfyCarsList', component: './Smfy/SmfyCarsList' },//神木富油车辆
      //     { path: '/driverSide/personal/smfyCarsAdd', component: './Smfy/SmfyCarsAdd' },//神木富油车辆认证*/
      //     {
      //       path: '/driverSide/driverDispatch',
      //       routes: [
      //         {
      //           path: '/driverSide/driverDispatch/runOftenGoodsPage',
      //           component: './DriverSide/DriverDispatch/RunOftenGoodsPage',
      //         },
      //         { path: '/driverSide/driverDispatch/driverOrder', component: './DriverSide/DriverDispatch/DriverOrder' },
      //         {
      //           path: '/driverSide/driverDispatch/orderGrabbing/:id',
      //           component: './DriverSide/DriverDispatch/OrderGrabbing',
      //         },
      //         {
      //           path: '/driverSide/driverDispatch/driverOrderDetail/:id',
      //           component: './DriverSide/DriverDispatch/DriverOrderDetail',
      //         },
      //         {
      //           path: '/driverSide/driverDispatch/situOntheWay/:id',
      //           component: './DriverSide/DriverDispatch/SituOntheWay',
      //         },
      //       ],
      //     },
      //     {
      //       path: '/driverSide/wayBill',
      //       routes: [
      //         { path: '/driverSide/wayBill/findGoods', component: './DriverSide/WayBill/FindGoods' },
      //         { path: '/driverSide/wayBill/wayBillDetail/:id', component: './DriverSide/WayBill/WayBillDetail' },
      //       ],
      //     },
      //   ],
      // },
      // {
      //   path: '/shopcenter', // 商城
      //   routes: [
      //     {
      //       path: '/shopcenter/mallhomepage',
      //       routes: [
      //         { path: '/shopcenter/mallhomepage', redirect: '/shopcenter/mallhomepage/list' },
      //         { path: '/shopcenter/mallhomepage/list', component: './ShopCenter/MallHomepage/MallHomepage' },
      //         { path: '/shopcenter/mallhomepage/view/:id', component: './ShopCenter/MallHomepage/MallHomepageDetail' },
      //         { path: '/shopcenter/mallhomepage/search', component: './ShopCenter/MallHomepage/MallHomepageSearch' },
      //         { path: '/shopcenter/mallhomepage/geoMap', component: './ShopCenter/MallHomepage/geoMap' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/goodsdetails',
      //       routes: [
      //         { path: '/shopcenter/goodsdetails', redirect: '/shopcenter/goodsdetails/:type/:id' },
      //         { path: '/shopcenter/goodsdetails/:type/:id', component: './ShopCenter/GoodsDetails' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/makesuretheorder',
      //       routes: [
      //         { path: '/shopcenter/makesuretheorder', component: './ShopCenter/MakeSureTheOrder' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/addtheaddress',
      //       routes: [
      //         { path: '/shopcenter/addtheaddress', component: './ShopCenter/AddTheAddress' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/receiving',
      //       routes: [
      //         { path: '/shopcenter/receiving', component: './ShopCenter/ReceivingAddrManage' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/maintenance',
      //       routes: [
      //         { path: '/shopcenter/maintenance', component: './ShopCenter/Maintenance/Maintenance' },
      //         {
      //           path: '/shopcenter/maintenance/certification/:type',
      //           component: './ShopCenter/Maintenance/Certification',
      //         },
      //         {
      //           path: '/shopcenter/maintenance/certificationview/:type',
      //           component: './ShopCenter/Maintenance/CertificationView',
      //         },
      //         { path: '/shopcenter/maintenance/newaccounts/:type', component: './ShopCenter/Maintenance/NewAccounts' },
      //         { path: '/shopcenter/maintenance/authorization', component: './ShopCenter/Maintenance/Authorization' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/contract',
      //       routes: [
      //         { path: '/shopcenter/contract', component: './ShopCenter/Contract/Contract' },
      //         { path: '/shopcenter/contract/contractview/:id', component: './ShopCenter/Contract/ContractView' },
      //         {path: '/shopcenter/contract/paymentinadvance',component: './ShopCenter/Contract/PaymentInAdvance',}, // 预付货款
      //         { path: '/shopcenter/contract/settlement',component: './ShopCenter/Contract/Settlement'}, //申请结算
      //         { path: '/shopcenter/contract/billing', component: './ShopCenter/Contract/Billing'}, //申请开票
      //         { path: '/shopcenter/contract/billingrecord',component: './ShopCenter/Contract/BillingRecord'}, //开票记录
      //         { path: '/shopcenter/contract/settlementrecord',component: './ShopCenter/Contract/SettlementRecord'}, //查看结算单
      //         { path: '/shopcenter/contract/signing', component: './ShopCenter/Contract/Signing' },
      //         { path: '/shopcenter/contract/resultmobile', component: './ShopCenter/Contract/ResultMobile' },
      //         { path: '/shopcenter/contract/signthestate/:id', component: './ShopCenter/Contract/SignTheState' },
      //         { path: '/shopcenter/contract/paymentrecord/:id', component: './ShopCenter/Contract/PaymentRecord' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/shoppingcart',
      //       routes: [
      //         { path: '/shopcenter/shoppingcart', component: './ShopCenter/ShoppingCart/ShoppingCart' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/secondskill',
      //       routes: [
      //         { path: '/shopcenter/secondskill', component: './ShopCenter/SecondsKill/SecondsKill' },
      //         { path: '/shopcenter/secondskill/view/:id', component: './ShopCenter/SecondsKill/SecondsKillView' },
      //         { path: '/shopcenter/secondskill/submitorder/:id', component: './ShopCenter/SecondsKill/SecondsKillSubmitOrder' },
      //         { path: '/shopcenter/secondskill/order', component: './ShopCenter/SecondsKill/SecondsKillOrder' },
      //       ],
      //     },
      //     {
      //       path: '/shopcenter/forthezone',
      //       routes: [
      //         { path: '/shopcenter/forthezone', component: './ShopCenter/ForTheZone/ForTheZone' },
      //         { path: '/shopcenter/forthezone/view/:id', component: './ShopCenter/ForTheZone/ForTheZoneView' },
      //         { path: '/shopcenter/forthezone/forthezoneBidding', component: './ShopCenter/ForTheZone/ForTheZoneBidding' },// 竞价专区-详情
      //         { path: '/shopcenter/forthezone/forthezonebid/view/:id/:spikeStatus/:isSucceed', component: './ShopCenter/ForTheZone/ForTheZoneView' },// 我参与的-活动详情
      //         { path: '/shopcenter/forthezone/biddingrecord/:biddingWay/:activityStatus/:id', component: './ShopCenter/ForTheZone/BiddingRecord' }, // 竞价记录
      //         { path: '/shopcenter/forthezone/submitorder/:id', component: './ShopCenter/SecondsKill/SecondsKillSubmitOrder' },// 竞价确认订单
      //         { path: '/shopcenter/forthezone/uploadcashDeposit', component: './ShopCenter/ForTheZone/UploadCashDeposit' },// 保证金图片上传
      //       ]
      //     }
      //   ],
      // },
      // {
      //   path:'/billOfLoading', // 提货单模块
      //   routes:[
      //     {
      //       path: '/billOfLoading/billOfLoading',  //提煤单管理
      //       routes:[
      //         {path: '/billOfLoading/billOfLoading',redirect: '/billOfLoading/billOfLoading/list'},
      //         {path: '/billOfLoading/billOfLoading/list',component: './Epidemic/BillOfLoadingModule/BillOfLoading/BillOfLoadingList'},
      //         {path: '/billOfLoading/billOfLoading/add',component: './Epidemic/BillOfLoadingModule/BillOfLoading/BillOfLoadingAddOrEdit'},
      //         {path: '/billOfLoading/billOfLoading/edit/:id',component: './Epidemic/BillOfLoadingModule/BillOfLoading/BillOfLoadingAddOrEdit'},
      //         {path: '/billOfLoading/billOfLoading/view/:id',component: './Epidemic/BillOfLoadingModule/BillOfLoading/BillOfLoadingView'},
      //       ]
      //     },
      //     {
      //       path: '/billOfLoading/drawBill',  //提煤单领取
      //       routes:[
      //         {path: '/billOfLoading/drawBill/customerDraw',component: './Epidemic/BillOfLoadingModule/Draw/CustomerDraw'},
      //         {path: '/billOfLoading/drawBill/detail/:billId',component: './Epidemic/BillOfLoadingModule/Draw/DrawBillDetailList'},
      //         {path: '/billOfLoading/drawBill/driverDrawList',component: './Epidemic/BillOfLoadingModule/Draw/DriverDrawList'},
      //       ]
      //     },
      //   ]
      // },
    ],
  }
];
