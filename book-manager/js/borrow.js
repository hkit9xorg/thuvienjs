function renderBorrowOptions() {
  var books = getData('books');
  var users = getData('users');
  var bookSelect = document.getElementById('borrowBook');
  var userSelect = document.getElementById('borrowUser');
  var returnBook = document.getElementById('returnBook');
  var returnUser = document.getElementById('returnUser');
  bookSelect.innerHTML = '';
  userSelect.innerHTML = '';
  returnBook.innerHTML = '';
  returnUser.innerHTML = '';
  for (var i = 0; i < books.length; i++) {
    var opt = document.createElement('option');
    opt.value = books[i].id;
    opt.textContent = books[i].title + ' (tồn: ' + books[i].quantity + ')';
    bookSelect.appendChild(opt);
    var opt2 = opt.cloneNode(true);
    returnBook.appendChild(opt2);
  }
  for (var j = 0; j < users.length; j++) {
    var uopt = document.createElement('option');
    uopt.value = users[j].id;
    uopt.textContent = users[j].name + ' - ' + users[j].role;
    userSelect.appendChild(uopt);
    var uopt2 = uopt.cloneNode(true);
    returnUser.appendChild(uopt2);
  }
}

function renderBorrowHistory() {
  var borrows = getData('borrows');
  var books = getData('books');
  var users = getData('users');
  var tbody = document.getElementById('borrowBody');
  tbody.innerHTML = '';
  for (var i = 0; i < borrows.length; i++) {
    var b = borrows[i];
    var bookName = '';
    var userName = '';
    for (var j = 0; j < books.length; j++) {
      if (books[j].id === b.bookId) {
        bookName = books[j].title;
      }
    }
    for (var u = 0; u < users.length; u++) {
      if (users[u].id === b.userId) {
        userName = users[u].name;
      }
    }
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + b.id + '</td><td>' + bookName + '</td><td>' + userName + '</td><td>' + b.type + '</td><td>' + b.time + '</td>';
    tbody.appendChild(tr);
  }
}

function borrowBook(event) {
  event.preventDefault();
  var bookId = parseInt(document.getElementById('borrowBook').value, 10);
  var userId = parseInt(document.getElementById('borrowUser').value, 10);
  var books = getData('books');
  var borrows = getData('borrows');
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      if (books[i].quantity <= 0) {
        alert('Sách đã hết kho');
        return;
      }
      books[i].quantity -= 1;
      break;
    }
  }
  setData('books', books);
  var record = { id: borrows.length + 1, bookId: bookId, userId: userId, type: 'Mượn', time: new Date().toLocaleString() };
  borrows.push(record);
  setData('borrows', borrows);
  logAction('borrow', 'Mượn sách #' + bookId + ' bởi user #' + userId);
  renderBorrowOptions();
  renderBorrowHistory();
}

function returnBook(event) {
  event.preventDefault();
  var bookId = parseInt(document.getElementById('returnBook').value, 10);
  var userId = parseInt(document.getElementById('returnUser').value, 10);
  var books = getData('books');
  var borrows = getData('borrows');
  for (var i = 0; i < books.length; i++) {
    if (books[i].id === bookId) {
      books[i].quantity += 1;
    }
  }
  setData('books', books);
  var record = { id: borrows.length + 1, bookId: bookId, userId: userId, type: 'Trả', time: new Date().toLocaleString() };
  borrows.push(record);
  setData('borrows', borrows);
  logAction('return', 'Trả sách #' + bookId + ' bởi user #' + userId);
  renderBorrowOptions();
  renderBorrowHistory();
}

function setupBorrowPage() {
  renderBorrowOptions();
  renderBorrowHistory();
  document.getElementById('borrowForm').onsubmit = borrowBook;
  document.getElementById('returnForm').onsubmit = returnBook;
}

if (document.readyState !== 'loading') {
  setupBorrowPage();
} else {
  document.addEventListener('DOMContentLoaded', setupBorrowPage);
}
