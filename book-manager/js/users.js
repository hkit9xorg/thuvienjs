function renderUsers() {
  var users = getData('users');
  var tbody = document.getElementById('userBody');
  tbody.innerHTML = '';
  var current = getCurrentUser();
  for (var i = 0; i < users.length; i++) {
    var u = users[i];
    var marker = current && current.id === u.id ? ' <span class="status-badge">Đang đăng nhập</span>' : '';
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + u.id + '</td><td>' + u.name + marker + '</td><td>' + u.role + '</td>' +
      '<td><button onclick="editUser(' + u.id + ')">Sửa</button> ' +
      '<button onclick="deleteUser(' + u.id + ')">Xóa</button> ' +
      '<button onclick="setCurrent(' + u.id + ')">Chọn</button></td>';
    tbody.appendChild(tr);
  }
}

function saveUser(event) {
  event.preventDefault();
  var users = getData('users');
  var idField = document.getElementById('userId');
  var name = document.getElementById('userName').value;
  var role = document.getElementById('userRole').value;
  if (!name) {
    alert('Nhập tên người dùng');
    return;
  }
  if (idField.value) {
    for (var i = 0; i < users.length; i++) {
      if (users[i].id === parseInt(idField.value, 10)) {
        users[i].name = name;
        users[i].role = role;
        logAction('update_user', 'Cập nhật người dùng #' + idField.value);
      }
    }
  } else {
    var newId = users.length > 0 ? users[users.length - 1].id + 1 : 1;
    users.push({ id: newId, name: name, role: role });
    logAction('add_user', 'Thêm người dùng #' + newId);
  }
  setData('users', users);
  renderUsers();
  event.target.reset();
  document.getElementById('userId').value = '';
}

function editUser(id) {
  var users = getData('users');
  for (var i = 0; i < users.length; i++) {
    if (users[i].id === id) {
      document.getElementById('userId').value = users[i].id;
      document.getElementById('userName').value = users[i].name;
      document.getElementById('userRole').value = users[i].role;
    }
  }
}

function deleteUser(id) {
  requireAdmin(function () {
    var users = getData('users');
    var filtered = [];
    for (var i = 0; i < users.length; i++) {
      if (users[i].id !== id) {
        filtered.push(users[i]);
      }
    }
    setData('users', filtered);
    logAction('delete_user', 'Xóa người dùng #' + id);
    renderUsers();
  });
}

function setCurrent(id) {
  localStorage.setItem('currentUser', String(id));
  logAction('switch_user', 'Chuyển sang người dùng #' + id);
  renderUsers();
}

function setupUserPage() {
  renderUsers();
  document.getElementById('userForm').onsubmit = saveUser;
}

if (document.readyState !== 'loading') {
  setupUserPage();
} else {
  document.addEventListener('DOMContentLoaded', setupUserPage);
}
