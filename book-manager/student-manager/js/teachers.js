// teachers.js - manage teacher catalog

var teachers = [];
var students = [];
var editingTeacherId = null;

function loadTeacherData() {
    teachers = getData('teachers');
    students = getData('students');
}

function saveTeachers() {
    setData('teachers', teachers);
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

function renderTeachers() {
    var tbody = document.getElementById('teacherTableBody');
    tbody.innerHTML = '';
    for (var i = 0; i < teachers.length; i++) {
        var item = teachers[i];
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + item.teacherCode + '</td>' +
            '<td>' + item.fullName + '</td>' +
            '<td>' + item.phone + '</td>' +
            '<td>' + item.email + '</td>' +
            '<td class="actions">' +
            '<button type="button" class="edit" data-id="' + item.id + '">Sửa</button>' +
            '<button type="button" class="delete" data-id="' + item.id + '">Xóa</button>' +
            '</td>';
        tbody.appendChild(tr);
    }
    bindTeacherButtons();
}

function bindTeacherButtons() {
    var editButtons = document.querySelectorAll('button.edit');
    var deleteButtons = document.querySelectorAll('button.delete');

    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            startEditTeacher(id);
        });
    }

    for (var j = 0; j < deleteButtons.length; j++) {
        deleteButtons[j].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            deleteTeacher(id);
        });
    }
}

function validateTeacherForm() {
    var code = document.getElementById('teacherCode').value.trim();
    var name = document.getElementById('teacherName').value.trim();
    var phone = document.getElementById('teacherPhone').value.trim();
    var email = document.getElementById('teacherEmail').value.trim();

    if (!code || !name || !phone || !email) {
        alert('Vui lòng nhập đầy đủ thông tin giáo viên.');
        return false;
    }
    return true;
}

function submitTeacherForm(event) {
    event.preventDefault();
    if (!validateTeacherForm()) {
        return;
    }

    var data = {
        id: editingTeacherId ? parseInt(editingTeacherId, 10) : Date.now(),
        teacherCode: document.getElementById('teacherCode').value.trim(),
        fullName: document.getElementById('teacherName').value.trim(),
        phone: document.getElementById('teacherPhone').value.trim(),
        email: document.getElementById('teacherEmail').value.trim()
    };

    if (editingTeacherId) {
        for (var i = 0; i < teachers.length; i++) {
            if (String(teachers[i].id) === String(editingTeacherId)) {
                teachers[i] = data;
                break;
            }
        }
        addLog('Sửa giáo viên', 'Cập nhật giáo viên ' + data.teacherCode);
    } else {
        teachers.push(data);
        addLog('Thêm giáo viên', 'Thêm giáo viên ' + data.teacherCode);
    }

    saveTeachers();
    renderTeachers();
    resetTeacherForm();
}

function resetTeacherForm() {
    editingTeacherId = null;
    document.getElementById('teacherForm').reset();
    document.getElementById('teacherId').value = '';
    document.getElementById('btnSaveTeacher').textContent = 'Lưu';
}

function startEditTeacher(id) {
    editingTeacherId = id;
    for (var i = 0; i < teachers.length; i++) {
        if (String(teachers[i].id) === String(id)) {
            document.getElementById('teacherId').value = teachers[i].id;
            document.getElementById('teacherCode').value = teachers[i].teacherCode;
            document.getElementById('teacherName').value = teachers[i].fullName;
            document.getElementById('teacherPhone').value = teachers[i].phone;
            document.getElementById('teacherEmail').value = teachers[i].email;
            break;
        }
    }
    document.getElementById('btnSaveTeacher').textContent = 'Cập nhật';
}

function deleteTeacher(id) {
    var related = false;
    for (var i = 0; i < students.length; i++) {
        if (String(students[i].teacherId) === String(id)) {
            related = true;
            break;
        }
    }
    if (related) {
        alert('Không thể xóa giáo viên vì đang quản lý sinh viên.');
        return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa giáo viên này?')) {
        return;
    }

    for (var j = 0; j < teachers.length; j++) {
        if (String(teachers[j].id) === String(id)) {
            var removed = teachers.splice(j, 1)[0];
            addLog('Xóa giáo viên', 'Xóa giáo viên ' + removed.teacherCode);
            break;
        }
    }

    saveTeachers();
    renderTeachers();
}

function attachTeacherEvents() {
    document.getElementById('teacherForm').addEventListener('submit', submitTeacherForm);
    document.getElementById('btnResetTeacher').addEventListener('click', function () {
        resetTeacherForm();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadTeacherData();
    attachTeacherEvents();
    renderTeachers();
});
