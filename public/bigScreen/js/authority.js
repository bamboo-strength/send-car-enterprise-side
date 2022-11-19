function setAuthority(authority) {
  const proAuthority = typeof authority === 'string' ? authority.split(',') : authority;
  return localStorage.setItem('sword-authority', JSON.stringify(proAuthority));
}

function getCurrentUser() {
  return JSON.parse(localStorage.getItem('sword-current-user'));
}

function setCurrentUser(account) {
  localStorage.setItem('sword-current-user', JSON.stringify(account));
}
