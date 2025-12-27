function getData(key) {
  var raw = localStorage.getItem(key);
  if (!raw) {
    return [];
  }
  try {
    return JSON.parse(raw);
  } catch (e) {
    return [];
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

function logAction(action, detail) {
  var logs = getData('logs');
  var entry = {
    time: new Date().toLocaleString(),
    action: action,
    detail: detail
  };
  logs.push(entry);
  setData('logs', logs);
}

function getCurrentUser() {
  var current = localStorage.getItem('currentUser');
  if (!current) {
    return null;
  }
  var users = getData('users');
  var found = null;
  for (var i = 0; i < users.length; i++) {
    if (String(users[i].id) === String(current)) {
      found = users[i];
      break;
    }
  }
  return found;
}

function requireAdmin(callback) {
  var user = getCurrentUser();
  if (user && user.role === 'admin') {
    callback();
  } else {
    alert('Chỉ admin mới được thực hiện thao tác này');
  }
}
