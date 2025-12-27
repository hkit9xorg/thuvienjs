function buildReports() {
  var books = getData('books');
  var borrows = getData('borrows');
  var totalBooks = 0;
  var totalTitles = books.length;
  for (var i = 0; i < books.length; i++) {
    totalBooks += books[i].quantity;
  }
  var borrowCount = borrows.length;
  var countMap = {};
  for (var j = 0; j < borrows.length; j++) {
    var rec = borrows[j];
    if (rec.type === 'Mượn') {
      if (!countMap[rec.bookId]) {
        countMap[rec.bookId] = 0;
      }
      countMap[rec.bookId] += 1;
    }
  }
  var maxBook = null;
  var maxBorrow = 0;
  for (var key in countMap) {
    if (countMap.hasOwnProperty(key)) {
      if (countMap[key] > maxBorrow) {
        maxBorrow = countMap[key];
        maxBook = key;
      }
    }
  }
  var topTitle = 'Chưa có';
  if (maxBook) {
    for (var b = 0; b < books.length; b++) {
      if (String(books[b].id) === String(maxBook)) {
        topTitle = books[b].title + ' (' + maxBorrow + ' lượt mượn)';
      }
    }
  }
  document.getElementById('statTotalTitle').textContent = totalTitles;
  document.getElementById('statTotalQuantity').textContent = totalBooks;
  document.getElementById('statBorrowCount').textContent = borrowCount;
  document.getElementById('statTop').textContent = topTitle;
}

function renderLogs() {
  var logs = getData('logs');
  var tbody = document.getElementById('logBody');
  tbody.innerHTML = '';
  for (var i = logs.length - 1; i >= 0; i--) {
    var log = logs[i];
    var tr = document.createElement('tr');
    tr.innerHTML = '<td>' + log.time + '</td><td>' + log.action + '</td><td>' + log.detail + '</td>';
    tbody.appendChild(tr);
  }
}

function setupReportPage() {
  buildReports();
  renderLogs();
}

if (document.readyState !== 'loading') {
  setupReportPage();
} else {
  document.addEventListener('DOMContentLoaded', setupReportPage);
}
