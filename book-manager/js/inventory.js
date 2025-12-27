function renderInventory() {
  var books = getData('books');
  var categories = getData('categories');
  var tbody = document.getElementById('inventoryBody');
  tbody.innerHTML = '';
  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    var catName = '';
    for (var c = 0; c < categories.length; c++) {
      if (categories[c].id === book.categoryId) {
        catName = categories[c].name;
      }
    }
    var low = book.quantity <= 2 ? '<span class="alert">Sắp hết</span>' : '';
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + book.id + '</td><td>' + book.title + '</td><td>' + catName + '</td><td>' + book.quantity + ' ' + low + '</td>';
    tbody.appendChild(tr);
  }
}

function setupInventoryPage() {
  renderInventory();
}

if (document.readyState !== 'loading') {
  setupInventoryPage();
} else {
  document.addEventListener('DOMContentLoaded', setupInventoryPage);
}
