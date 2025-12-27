function renderAuthors() {
  var authors = getData('authors');
  var tbody = document.getElementById('authorBody');
  tbody.innerHTML = '';
  for (var i = 0; i < authors.length; i++) {
    var au = authors[i];
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + au.id + '</td><td>' + au.name + '</td>' +
      '<td><button onclick="editAuthor(' + au.id + ')">Sửa</button> ' +
      '<button onclick="deleteAuthor(' + au.id + ')">Xóa</button></td>';
    tbody.appendChild(tr);
  }
}

function saveAuthor(event) {
  event.preventDefault();
  var authors = getData('authors');
  var idField = document.getElementById('authorId');
  var name = document.getElementById('authorName').value;
  if (!name) {
    alert('Nhập tên tác giả');
    return;
  }
  if (idField.value) {
    for (var i = 0; i < authors.length; i++) {
      if (authors[i].id === parseInt(idField.value, 10)) {
        authors[i].name = name;
        logAction('update_author', 'Cập nhật tác giả #' + idField.value);
      }
    }
  } else {
    var newId = authors.length > 0 ? authors[authors.length - 1].id + 1 : 1;
    authors.push({ id: newId, name: name });
    logAction('add_author', 'Thêm tác giả #' + newId);
  }
  setData('authors', authors);
  renderAuthors();
  event.target.reset();
  document.getElementById('authorId').value = '';
}

function editAuthor(id) {
  var authors = getData('authors');
  for (var i = 0; i < authors.length; i++) {
    if (authors[i].id === id) {
      document.getElementById('authorId').value = authors[i].id;
      document.getElementById('authorName').value = authors[i].name;
    }
  }
}

function deleteAuthor(id) {
  requireAdmin(function () {
    var authors = getData('authors');
    var filtered = [];
    for (var i = 0; i < authors.length; i++) {
      if (authors[i].id !== id) {
        filtered.push(authors[i]);
      }
    }
    setData('authors', filtered);
    logAction('delete_author', 'Xóa tác giả #' + id);
    renderAuthors();
  });
}

function setupAuthorPage() {
  renderAuthors();
  document.getElementById('authorForm').onsubmit = saveAuthor;
}

if (document.readyState !== 'loading') {
  setupAuthorPage();
} else {
  document.addEventListener('DOMContentLoaded', setupAuthorPage);
}
