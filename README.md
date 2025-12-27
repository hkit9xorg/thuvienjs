Bạn là lập trình viên frontend chuyên JS thuần.

Hãy tạo một WEB QUẢN LÝ SÁCH hoàn chỉnh với các yêu cầu sau:

1. Công nghệ
- Chỉ sử dụng HTML, CSS, JavaScript THUẦN
- KHÔNG dùng bất kỳ thư viện hoặc framework nào
- KHÔNG dùng CDN, KHÔNG Bootstrap, KHÔNG jQuery

2. Kiến trúc & tổ chức file
- Mỗi chức năng nằm trong 1 file HTML RIÊNG
- CSS tách riêng 1 file
- JS tách riêng theo từng chức năng
- Có 1 file JS dùng chung để thao tác LocalStorage

Cấu trúc thư mục BẮT BUỘC:

book-manager/
│
├── index.html                (Trang chính + nút khởi tạo dữ liệu)
│
├── books.html                (Quản lý sách)
├── categories.html           (Quản lý thể loại)
├── authors.html              (Quản lý tác giả)
├── users.html                (Quản lý người dùng + phân quyền)
├── borrow.html               (Mượn – trả sách)
├── inventory.html            (Quản lý kho)
├── reports.html              (Thống kê – báo cáo)
│
├── css/
│   └── style.css
│
├── js/
│   ├── storage.js            (getData / setData localStorage)
│   ├── init.js               (Khởi tạo dữ liệu ban đầu)
│   ├── books.js
│   ├── categories.js
│   ├── authors.js
│   ├── users.js
│   ├── borrow.js
│   ├── inventory.js
│   └── reports.js

3. Lưu trữ dữ liệu
- Toàn bộ dữ liệu lưu bằng localStorage
- Dùng các key:
  - books
  - categories
  - authors
  - users
  - borrows
  - logs

4. Khởi tạo dữ liệu
- index.html có nút "Khởi tạo dữ liệu"
- Chỉ khởi tạo nếu localStorage chưa có dữ liệu
- Có dữ liệu mẫu cho:
  - sách
  - tác giả
  - thể loại
  - user admin

5. Chức năng bắt buộc (1–9)

(1) Quản lý sách
- Thêm / sửa / xóa / xem danh sách
- Các trường: id, title, authorId, categoryId, price, quantity

(2) Tìm kiếm & lọc
- Tìm theo tên
- Lọc theo thể loại

(3) Quản lý thể loại
- CRUD thể loại

(4) Quản lý tác giả
- CRUD tác giả

(5) Quản lý người dùng
- Thêm user
- Phân quyền admin / user

(6) Mượn – trả sách
- Mượn sách (giảm tồn kho)
- Trả sách (tăng tồn kho)
- Lưu lịch sử mượn

(7) Quản lý kho
- Hiển thị số lượng tồn
- Cảnh báo sách sắp hết

(8) Thống kê & báo cáo
- Tổng số sách
- Tổng số lượt mượn
- Sách mượn nhiều nhất

(9) Hệ thống
- Ghi log thao tác
- Phân quyền truy cập (admin mới được xóa)

6. Yêu cầu code
- Code rõ ràng, dễ đọc, có comment
- Dùng function, không dùng class
- Không dùng arrow function
- Không dùng async/await
- Không dùng module ES6
- Chạy được trực tiếp bằng cách mở file HTML

7. Kết quả trả về
- Xuất đầy đủ nội dung TẤT CẢ file
- Mỗi file phải có tiêu đề rõ ràng
- Không bỏ sót file nào
- Không giải thích dài dòng, tập trung vào CODE
