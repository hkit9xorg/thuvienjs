// init.js - seed initial data when needed
// Called from index.html via button click

function createSampleData() {
    var classes = [
        { id: Date.now(), classCode: 'CSE101', className: 'Công nghệ thông tin 1' },
        { id: Date.now() + 1, classCode: 'CSE102', className: 'Công nghệ thông tin 2' }
    ];

    var teachers = [
        { id: Date.now() + 2, teacherCode: 'GV001', fullName: 'Nguyễn Văn A', phone: '0901234567', email: 'a@example.com' },
        { id: Date.now() + 3, teacherCode: 'GV002', fullName: 'Trần Thị B', phone: '0912345678', email: 'b@example.com' }
    ];

    var students = [
        {
            id: Date.now() + 4,
            studentCode: 'SV001',
            fullName: 'Phạm Minh Khang',
            dateOfBirth: '2000-05-12',
            gender: 'Nam',
            phone: '0987654321',
            email: 'khang@example.com',
            address: 'Hà Nội',
            classId: classes[0].id,
            teacherId: teachers[0].id
        },
        {
            id: Date.now() + 5,
            studentCode: 'SV002',
            fullName: 'Lê Thu Hà',
            dateOfBirth: '2001-08-22',
            gender: 'Nữ',
            phone: '0978123456',
            email: 'ha@example.com',
            address: 'Đà Nẵng',
            classId: classes[1].id,
            teacherId: teachers[1].id
        },
        {
            id: Date.now() + 6,
            studentCode: 'SV003',
            fullName: 'Đỗ Đức Trung',
            dateOfBirth: '2000-12-01',
            gender: 'Nam',
            phone: '0966123456',
            email: 'trung@example.com',
            address: 'Hồ Chí Minh',
            classId: classes[0].id,
            teacherId: teachers[1].id
        }
    ];

    setData('classes', classes);
    setData('teachers', teachers);
    setData('students', students);
    setData('logs', []);
}

function initDataIfEmpty() {
    var hasClasses = localStorage.getItem('classes');
    var hasTeachers = localStorage.getItem('teachers');
    var hasStudents = localStorage.getItem('students');
    var hasLogs = localStorage.getItem('logs');

    if (hasClasses || hasTeachers || hasStudents || hasLogs) {
        alert('Đã có dữ liệu trong hệ thống, không cần khởi tạo.');
        return;
    }

    createSampleData();
    alert('Khởi tạo dữ liệu mẫu thành công.');
}

// Attach event listener when index page loads
function setupInitButton() {
    var btn = document.getElementById('btnInit');
    if (btn) {
        btn.addEventListener('click', function () {
            initDataIfEmpty();
        });
    }
}

document.addEventListener('DOMContentLoaded', function () {
    setupInitButton();
});
