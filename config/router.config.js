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
      { path: '/truck/details', component: './TruckingOrder/details'}
    ]
  },
  {
    path: '/',
    component: '../layouts/BasicLayout',
    Routes: ['src/pages/Authorized'],
    routes: [
      {
        path: '/',
        redirect: '/dashboard/function',
        authority: ['administrator', 'admin', 'user'],
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
      {
        path: '/dashboard',
        routes: [
          { path: '/dashboard/function', component: './Dashboard/Function' },
        ],
      },
      {
        path: '/driverSide',
        routes: [
          { path: '/driverSide/personal/personalCenter', component: './DriverSide/Personal/PersonalCen' }, //个人中心（司机）
        ]
      }
    ]
  }
];
