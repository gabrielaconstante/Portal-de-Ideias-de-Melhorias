let users = [];
// requisito 1
function registerUser(user) {
  const { email, password } = user;
  if (email && password) {
    users.push(user);
    return true;
  }
  return false;
}

function loginUser(credentials) {
  const { email, password } = credentials;
  return users.some(user => user.email === email && user.password === password);
}

function recoverPassword(email) {
  return users.some(user => user.email === email);
}

module.exports = { registerUser, loginUser, recoverPassword };
