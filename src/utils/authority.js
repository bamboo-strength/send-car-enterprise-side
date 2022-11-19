// use localStorage to store the authority info, which might be sent from server in actual project.
export function getAuthority(str) {
  // return localStorage.getItem('antd-pro-authority') || ['admin', 'user'];
  const authorityString =
    typeof str === 'undefined' ? localStorage.getItem('sword-authority') : str;
  // authorityString could be admin, "admin", ["admin"]
  let authority;
  try {
    authority = JSON.parse(authorityString);
  } catch (e) {
    authority = authorityString;
  }
  if (typeof authority === 'string') {
    return [authority];
  }
  return authority;
}

export function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? authority.split(',') : authority;
  return localStorage.setItem('sword-authority', JSON.stringify(proAuthority));
}

export function getToken() {
  return localStorage.getItem('sword-token') || '';
}

export function setToken(token) {
  localStorage.setItem('sword-token', token);
}

export function getTopMenus() {
  return JSON.parse(localStorage.getItem('sword-top-menus')) || [];
}

export function setTopMenus(menus) {
  localStorage.removeItem('sword-top-menus');
  localStorage.setItem('sword-top-menus', JSON.stringify(menus));
}

export function getRoutes() {
  return JSON.parse(localStorage.getItem('sword-routes')) || [];
}

export function setRoutes(routes) {
  localStorage.removeItem('sword-routes');
  localStorage.setItem('sword-routes', JSON.stringify(routes));
}

export function getButtons() {
  return JSON.parse(localStorage.getItem('sword-buttons')) || [];
}

export function getButton(code) {
  const buttons = getButtons();
  const data = buttons.filter(d => {
    return d.code === code;
  });
  return data.length === 0 ? [] : data[0].buttons;
}

export function setButtons(buttons) {
  localStorage.removeItem('sword-buttons');
  localStorage.setItem('sword-buttons', JSON.stringify(buttons));
}

export function getCurrentUser() {
  return JSON.parse(localStorage.getItem('sword-current-user'));
}

export function setCurrentUser(account) {
  localStorage.setItem('sword-current-user', JSON.stringify(account));
}

export function setUserType(userType) {
  localStorage.setItem('sword-user-type', JSON.stringify(userType));
}

export function getUserType() { //  区分用户是大客户还是个人客户  0 客户   1 个人客户
  return JSON.parse(localStorage.getItem('sword-user-type'));
}

export function getOrderGpsLous() {
  return JSON.parse(localStorage.getItem('sword-gps-locus'));
}

export function setOrderGpsLous(params) {
  localStorage.removeItem('sword-gps-locus');
  localStorage.setItem('sword-gps-locus', JSON.stringify(params));
}

export function removeOrderGpsLous() {
  localStorage.removeItem('sword-gps-locus');
}

export function getOrderInfo() {
  return JSON.parse(localStorage.getItem('sword-order-info'));
}

export function setOrderInfo(params) {
  localStorage.removeItem('sword-order-info');
  localStorage.setItem('sword-order-info', JSON.stringify(params));
}

export function removeOrderInfo() {
  localStorage.removeItem('sword-order-info');
}

export function getAuditInfo() {
  return JSON.parse(localStorage.getItem('sword-audit-info'));
}

export function setAuditInfo(params) {
  localStorage.removeItem('sword-audit-info');
  localStorage.setItem('sword-audit-info', JSON.stringify(params));
}

export function removeAuditInfo() {
  localStorage.removeItem('sword-audit-info');
}

export function removeAll() {
  localStorage.removeItem(getToken())
  localStorage.removeItem('sword-authority');
  localStorage.removeItem('sword-token');
  localStorage.removeItem('sword-top-menus');
  localStorage.removeItem('sword-routes');
  localStorage.removeItem('sword-buttons');
  localStorage.removeItem('sword-current-user');
  localStorage.removeItem('sword-user-type');
  localStorage.removeItem('sword-gps-locus');
  localStorage.removeItem('sword-audit-info');
  localStorage.removeItem('sword-order-info');
  localStorage.removeItem('currentDriver');
  localStorage.removeItem('isSimplify');
  localStorage.removeItem('merchantsFhfTenantId');
  localStorage.removeItem('notices');
  localStorage.removeItem('homePageImgs');
  localStorage.removeItem('indexDataRecord');
}

export function getCurrentDriver() {
  return JSON.parse(localStorage.getItem('currentDriver'));
}
