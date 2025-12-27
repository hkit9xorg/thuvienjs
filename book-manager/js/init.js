function initData() {
  var existing = getData('books');
  if (existing.length > 0) {
    alert('Dữ liệu đã tồn tại trong LocalStorage');
    return;
  }

  var categories = [
    { id: 1, name: 'Khoa học' },
    { id: 2, name: 'Tiểu thuyết' },
    { id: 3, name: 'Lập trình' }
  ];

  var authors = [
    { id: 1, name: 'Isaac Asimov' },
    { id: 2, name: 'Nguyễn Nhật Ánh' },
    { id: 3, name: 'Robert C. Martin' }
  ];

  var books = [
    { id: 1, title: 'Foundation', authorId: 1, categoryId: 2, price: 120, quantity: 12 },
    { id: 2, title: 'Clean Code', authorId: 3, categoryId: 3, price: 200, quantity: 5 },
    { id: 3, title: 'Mắt Biếc', authorId: 2, categoryId: 2, price: 90, quantity: 8 }
  ];

  var users = [
    { id: 1, name: 'Quản trị', role: 'admin' },
    { id: 2, name: 'Thủ thư', role: 'user' }
  ];

  setData('categories', categories);
  setData('authors', authors);
  setData('books', books);
  setData('users', users);
  setData('borrows', []);
  setData('logs', []);
  localStorage.setItem('currentUser', '1');
  logAction('init', 'Khởi tạo dữ liệu mẫu');
  alert('Đã khởi tạo dữ liệu mẫu!');
}
