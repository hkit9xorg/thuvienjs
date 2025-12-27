function renderBookOptions() {
  var categories = getData('categories');
  var authors = getData('authors');
  var categorySelect = document.getElementById('bookCategory');
  var authorSelect = document.getElementById('bookAuthor');
  var filterCategory = document.getElementById('filterCategory');
  categorySelect.innerHTML = '';
  authorSelect.innerHTML = '';
  filterCategory.innerHTML = '<option value="">Tất cả thể loại</option>';

  for (var i = 0; i < categories.length; i++) {
    var opt = document.createElement('option');
    opt.value = categories[i].id;
    opt.textContent = categories[i].name;
    categorySelect.appendChild(opt);

    var opt2 = document.createElement('option');
    opt2.value = categories[i].id;
    opt2.textContent = categories[i].name;
    filterCategory.appendChild(opt2);
  }

  for (var j = 0; j < authors.length; j++) {
    var aopt = document.createElement('option');
    aopt.value = authors[j].id;
    aopt.textContent = authors[j].name;
    authorSelect.appendChild(aopt);
  }
}

function renderBooks() {
  var books = getData('books');
  var categories = getData('categories');
  var authors = getData('authors');
  var tbody = document.getElementById('bookBody');
  var search = document.getElementById('searchTitle').value.toLowerCase();
  var filter = document.getElementById('filterCategory').value;
  tbody.innerHTML = '';

  for (var i = 0; i < books.length; i++) {
    var book = books[i];
    if (search && book.title.toLowerCase().indexOf(search) === -1) {
      continue;
    }
    if (filter && String(book.categoryId) !== filter) {
      continue;
    }
    var tr = document.createElement('tr');
    var catName = '';
    var authorName = '';
    for (var c = 0; c < categories.length; c++) {
      if (categories[c].id === book.categoryId) {
        catName = categories[c].name;
        break;
      }
    }
    for (var a = 0; a < authors.length; a++) {
      if (authors[a].id === book.authorId) {
        authorName = authors[a].name;
        break;
      }
    }
    tr.innerHTML = '<td>' + book.id + '</td>' +
      '<td>' + book.title + '</td>' +
      '<td>' + authorName + '</td>' +
      '<td>' + catName + '</td>' +
      '<td>' + book.price + '</td>' +
      '<td>' + book.quantity + '</td>' +
      '<td><button onclick="editBook(' + book.id + ')">Sửa</button> ' +
      '<button onclick="deleteBook(' + book.id + ')">Xóa</button></td>';
    tbody.appendChild(tr);
  }
}

function saveBook(event) {
  event.preventDefault();
  var books = getData('books');
  var idField = document.getElementById('bookId');
  var idValue = idField.value;
  var title = document.getElementById('bookTitle').value;
  var authorId = parseInt(document.getElementById('bookAuthor').value, 10);
  var categoryId = parseInt(document.getElementById('bookCategory').value, 10);
  var price = parseFloat(document.getElementById('bookPrice').value);
  var quantity = parseInt(document.getElementById('bookQuantity').value, 10);

  if (!title || isNaN(authorId) || isNaN(categoryId)) {
    alert('Vui lòng nhập đủ thông tin');
    return;
  }

  if (idValue) {
    for (var i = 0; i < books.length; i++) {
      if (books[i].id === parseInt(idValue, 10)) {
        books[i].title = title;
        books[i].authorId = authorId;
        books[i].categoryId = categoryId;
        books[i].price = price;
        books[i].quantity = quantity;
        logAction('update_book', 'Cập nhật sách #' + idValue);
        break;
      }
    }
  } else {
    var newId = books.length > 0 ? books[books.length - 1].id + 1 : 1;
    var book = {
      id: newId,
      title: title,
      authorId: authorId,
      categoryId: categoryId,
      price: price,
      quantity: quantity
    };
    books.push(book);
    logAction('add_book', 'Thêm sách mới #' + newId);
  }

  setData('books', books);
  renderBooks();
  event.target.reset();
  document.getElementById('bookId').value = '';
}

function editBook(id) {
  var books = getData('books');
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === id) {
      document.getElementById('bookId').value = books[i].id;
      document.getElementById('bookTitle').value = books[i].title;
      document.getElementById('bookAuthor').value = books[i].authorId;
      document.getElementById('bookCategory').value = books[i].categoryId;
      document.getElementById('bookPrice').value = books[i].price;
      document.getElementById('bookQuantity').value = books[i].quantity;
      break;
    }
  }
}

function deleteBook(id) {
  requireAdmin(function () {
    var books = getData('books');
    var filtered = [];
    for (var i = 0; i < books.length; i++) {
      if (books[i].id !== id) {
        filtered.push(books[i]);
      }
    }
    setData('books', filtered);
    logAction('delete_book', 'Xóa sách #' + id);
    renderBooks();
  });
}

function setupBookPage() {
  renderBookOptions();
  renderBooks();
  document.getElementById('bookForm').onsubmit = saveBook;
  document.getElementById('searchTitle').oninput = renderBooks;
  document.getElementById('filterCategory').onchange = renderBooks;
}

if (document.readyState !== 'loading') {
  setupBookPage();
} else {
  document.addEventListener('DOMContentLoaded', setupBookPage);
}
