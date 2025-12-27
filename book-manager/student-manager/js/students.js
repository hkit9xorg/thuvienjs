// students.js - manage student CRUD, search, filter

var students = [];
var classes = [];
var teachers = [];
var editingId = null;

function loadData() {
    students = getData('students');
    classes = getData('classes');
    teachers = getData('teachers');
}

function saveStudents() {
    setData('students', students);
}

function addLog(action, detail) {
    var logs = getData('logs');
    logs.push({
        id: Date.now(),
        action: action,
        detail: detail,
        time: new Date().toLocaleString()
    });
    setData('logs', logs);
}

function resetForm() {
    editingId = null;
    document.getElementById('studentForm').reset();
    document.getElementById('studentId').value = '';
    document.getElementById('btnSave').textContent = 'Lưu';
}

function fillSelectOptions() {
    var classSelect = document.getElementById('classId');
    var teacherSelect = document.getElementById('teacherId');
    var filterClass = document.getElementById('filterClass');
    var filterTeacher = document.getElementById('filterTeacher');

    classSelect.innerHTML = '';
    teacherSelect.innerHTML = '';

    for (var i = 0; i < classes.length; i++) {
        var opt = document.createElement('option');
        opt.value = classes[i].id;
        opt.textContent = classes[i].className + ' (' + classes[i].classCode + ')';
        classSelect.appendChild(opt);
    }

    for (var j = 0; j < teachers.length; j++) {
        var optT = document.createElement('option');
        optT.value = teachers[j].id;
        optT.textContent = teachers[j].fullName + ' (' + teachers[j].teacherCode + ')';
        teacherSelect.appendChild(optT);
    }

    filterClass.innerHTML = '<option value="">Tất cả</option>';
    filterTeacher.innerHTML = '<option value="">Tất cả</option>';

    for (var k = 0; k < classes.length; k++) {
        var opt2 = document.createElement('option');
        opt2.value = classes[k].id;
        opt2.textContent = classes[k].className;
        filterClass.appendChild(opt2);
    }

    for (var m = 0; m < teachers.length; m++) {
        var opt3 = document.createElement('option');
        opt3.value = teachers[m].id;
        opt3.textContent = teachers[m].fullName;
        filterTeacher.appendChild(opt3);
    }
}

function renderTable() {
    var tbody = document.getElementById('studentTableBody');
    tbody.innerHTML = '';

    var searchCode = document.getElementById('searchCode').value.toLowerCase();
    var searchName = document.getElementById('searchName').value.toLowerCase();
    var filterClass = document.getElementById('filterClass').value;
    var filterTeacher = document.getElementById('filterTeacher').value;

    for (var i = 0; i < students.length; i++) {
        var sv = students[i];
        var classMatch = !filterClass || String(sv.classId) === String(filterClass);
        var teacherMatch = !filterTeacher || String(sv.teacherId) === String(filterTeacher);
        var codeMatch = sv.studentCode.toLowerCase().indexOf(searchCode) !== -1;
        var nameMatch = sv.fullName.toLowerCase().indexOf(searchName) !== -1;

        if (!classMatch || !teacherMatch || !codeMatch || !nameMatch) {
            continue;
        }

        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + sv.studentCode + '</td>' +
            '<td>' + sv.fullName + '</td>' +
            '<td>' + sv.dateOfBirth + '</td>' +
            '<td>' + sv.gender + '</td>' +
            '<td>' + sv.phone + '</td>' +
            '<td>' + sv.email + '</td>' +
            '<td>' + sv.address + '</td>' +
            '<td>' + getClassName(sv.classId) + '</td>' +
            '<td>' + getTeacherName(sv.teacherId) + '</td>' +
            '<td class="actions">' +
            '<button type="button" data-id="' + sv.id + '" class="edit">Sửa</button>' +
            '<button type="button" data-id="' + sv.id + '" class="delete">Xóa</button>' +
            '</td>';
        tbody.appendChild(tr);
    }

    bindActionButtons();
}

function getClassName(id) {
    for (var i = 0; i < classes.length; i++) {
        if (String(classes[i].id) === String(id)) {
            return classes[i].className;
        }
    }
    return '';
}

function getTeacherName(id) {
    for (var i = 0; i < teachers.length; i++) {
        if (String(teachers[i].id) === String(id)) {
            return teachers[i].fullName;
        }
    }
    return '';
}

function bindActionButtons() {
    var editButtons = document.querySelectorAll('button.edit');
    var deleteButtons = document.querySelectorAll('button.delete');

    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            startEdit(id);
        });
    }

    for (var j = 0; j < deleteButtons.length; j++) {
        deleteButtons[j].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            deleteStudent(id);
        });
    }
}

function validateForm() {
    var requiredIds = ['studentCode', 'fullName', 'dateOfBirth', 'gender', 'phone', 'email', 'address', 'classId', 'teacherId'];
    for (var i = 0; i < requiredIds.length; i++) {
        var value = document.getElementById(requiredIds[i]).value;
        if (!value) {
            alert('Vui lòng nhập đầy đủ thông tin.');
            return false;
        }
    }
    return true;
}

function submitForm(event) {
    event.preventDefault();
    if (!validateForm()) {
        return;
    }

    var student = {
        id: editingId ? parseInt(editingId, 10) : Date.now(),
        studentCode: document.getElementById('studentCode').value.trim(),
        fullName: document.getElementById('fullName').value.trim(),
        dateOfBirth: document.getElementById('dateOfBirth').value,
        gender: document.getElementById('gender').value,
        phone: document.getElementById('phone').value.trim(),
        email: document.getElementById('email').value.trim(),
        address: document.getElementById('address').value.trim(),
        classId: document.getElementById('classId').value,
        teacherId: document.getElementById('teacherId').value
    };

    if (editingId) {
        for (var i = 0; i < students.length; i++) {
            if (String(students[i].id) === String(editingId)) {
                students[i] = student;
                break;
            }
        }
        addLog('Sửa sinh viên', 'Cập nhật sinh viên ' + student.studentCode);
    } else {
        students.push(student);
        addLog('Thêm sinh viên', 'Thêm sinh viên ' + student.studentCode);
    }

    saveStudents();
    renderTable();
    resetForm();
}

function startEdit(id) {
    editingId = id;
    var form = document.getElementById('studentForm');
    for (var i = 0; i < students.length; i++) {
        if (String(students[i].id) === String(id)) {
            document.getElementById('studentId').value = students[i].id;
            document.getElementById('studentCode').value = students[i].studentCode;
            document.getElementById('fullName').value = students[i].fullName;
            document.getElementById('dateOfBirth').value = students[i].dateOfBirth;
            document.getElementById('gender').value = students[i].gender;
            document.getElementById('phone').value = students[i].phone;
            document.getElementById('email').value = students[i].email;
            document.getElementById('address').value = students[i].address;
            document.getElementById('classId').value = students[i].classId;
            document.getElementById('teacherId').value = students[i].teacherId;
            break;
        }
    }
    document.getElementById('btnSave').textContent = 'Cập nhật';
    form.scrollIntoView({ behavior: 'smooth' });
}

function deleteStudent(id) {
    if (!confirm('Bạn có chắc chắn muốn xóa sinh viên này?')) {
        return;
    }
    for (var i = 0; i < students.length; i++) {
        if (String(students[i].id) === String(id)) {
            var removed = students.splice(i, 1)[0];
            addLog('Xóa sinh viên', 'Xóa sinh viên ' + removed.studentCode);
            break;
        }
    }
    saveStudents();
    renderTable();
}

function attachEvents() {
    document.getElementById('studentForm').addEventListener('submit', submitForm);
    document.getElementById('btnReset').addEventListener('click', function () {
        resetForm();
    });

    document.getElementById('searchCode').addEventListener('input', renderTable);
    document.getElementById('searchName').addEventListener('input', renderTable);
    document.getElementById('filterClass').addEventListener('change', renderTable);
    document.getElementById('filterTeacher').addEventListener('change', renderTable);
}

document.addEventListener('DOMContentLoaded', function () {
    loadData();
    fillSelectOptions();
    attachEvents();
    renderTable();
});
