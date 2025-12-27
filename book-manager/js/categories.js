function renderCategories() {
  var categories = getData('categories');
  var tbody = document.getElementById('categoryBody');
  tbody.innerHTML = '';
  for (var i = 0; i < categories.length; i++) {
    var cat = categories[i];
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + cat.id + '</td><td>' + cat.name + '</td>' +
      '<td><button onclick="editCategory(' + cat.id + ')">Sửa</button> ' +
      '<button onclick="deleteCategory(' + cat.id + ')">Xóa</button></td>';
    tbody.appendChild(tr);
  }
}

function saveCategory(event) {
  event.preventDefault();
  var categories = getData('categories');
  var idField = document.getElementById('categoryId');
  var name = document.getElementById('categoryName').value;
  if (!name) {
    alert('Nhập tên thể loại');
    return;
  }
  if (idField.value) {
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id === parseInt(idField.value, 10)) {
        categories[i].name = name;
        logAction('update_category', 'Cập nhật thể loại #' + idField.value);
      }
    }
  } else {
    var newId = categories.length > 0 ? categories[categories.length - 1].id + 1 : 1;
    categories.push({ id: newId, name: name });
    logAction('add_category', 'Thêm thể loại #' + newId);
  }
  setData('categories', categories);
  renderCategories();
  event.target.reset();
  document.getElementById('categoryId').value = '';
}

function editCategory(id) {
  var categories = getData('categories');
  for (var i = 0; i < categories.length; i++) {
    if (categories[i].id === id) {
      document.getElementById('categoryId').value = categories[i].id;
      document.getElementById('categoryName').value = categories[i].name;
    }
  }
}

function deleteCategory(id) {
  requireAdmin(function () {
    var categories = getData('categories');
    var filtered = [];
    for (var i = 0; i < categories.length; i++) {
      if (categories[i].id !== id) {
        filtered.push(categories[i]);
      }
    }
    setData('categories', filtered);
    logAction('delete_category', 'Xóa thể loại #' + id);
    renderCategories();
  });
}

function setupCategoryPage() {
  renderCategories();
  document.getElementById('categoryForm').onsubmit = saveCategory;
}

if (document.readyState !== 'loading') {
  setupCategoryPage();
} else {
  document.addEventListener('DOMContentLoaded', setupCategoryPage);
}
