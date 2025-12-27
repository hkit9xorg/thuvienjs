// classes.js - manage class catalog

var classes = [];
var students = [];
var editingClassId = null;

function loadClassData() {
    classes = getData('classes');
    students = getData('students');
}

function saveClasses() {
    setData('classes', classes);
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

function renderClasses() {
    var tbody = document.getElementById('classTableBody');
    tbody.innerHTML = '';
    for (var i = 0; i < classes.length; i++) {
        var item = classes[i];
        var tr = document.createElement('tr');
        tr.innerHTML =
            '<td>' + item.classCode + '</td>' +
            '<td>' + item.className + '</td>' +
            '<td class="actions">' +
            '<button type="button" class="edit" data-id="' + item.id + '">Sửa</button>' +
            '<button type="button" class="delete" data-id="' + item.id + '">Xóa</button>' +
            '</td>';
        tbody.appendChild(tr);
    }
    bindButtons();
}

function bindButtons() {
    var editButtons = document.querySelectorAll('button.edit');
    var deleteButtons = document.querySelectorAll('button.delete');

    for (var i = 0; i < editButtons.length; i++) {
        editButtons[i].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            startEditClass(id);
        });
    }

    for (var j = 0; j < deleteButtons.length; j++) {
        deleteButtons[j].addEventListener('click', function (e) {
            var id = e.target.getAttribute('data-id');
            deleteClass(id);
        });
    }
}

function validateClassForm() {
    var code = document.getElementById('classCode').value.trim();
    var name = document.getElementById('className').value.trim();
    if (!code || !name) {
        alert('Vui lòng nhập mã lớp và tên lớp.');
        return false;
    }
    return true;
}

function submitClassForm(event) {
    event.preventDefault();
    if (!validateClassForm()) {
        return;
    }

    var data = {
        id: editingClassId ? parseInt(editingClassId, 10) : Date.now(),
        classCode: document.getElementById('classCode').value.trim(),
        className: document.getElementById('className').value.trim()
    };

    if (editingClassId) {
        for (var i = 0; i < classes.length; i++) {
            if (String(classes[i].id) === String(editingClassId)) {
                classes[i] = data;
                break;
            }
        }
        addLog('Sửa lớp', 'Cập nhật lớp ' + data.classCode);
    } else {
        classes.push(data);
        addLog('Thêm lớp', 'Thêm lớp ' + data.classCode);
    }

    saveClasses();
    renderClasses();
    resetClassForm();
}

function resetClassForm() {
    editingClassId = null;
    document.getElementById('classForm').reset();
    document.getElementById('classId').value = '';
    document.getElementById('btnSaveClass').textContent = 'Lưu';
}

function startEditClass(id) {
    editingClassId = id;
    for (var i = 0; i < classes.length; i++) {
        if (String(classes[i].id) === String(id)) {
            document.getElementById('classId').value = classes[i].id;
            document.getElementById('classCode').value = classes[i].classCode;
            document.getElementById('className').value = classes[i].className;
            break;
        }
    }
    document.getElementById('btnSaveClass').textContent = 'Cập nhật';
}

function deleteClass(id) {
    var related = false;
    for (var i = 0; i < students.length; i++) {
        if (String(students[i].classId) === String(id)) {
            related = true;
            break;
        }
    }
    if (related) {
        alert('Không thể xóa lớp vì đang có sinh viên thuộc lớp này.');
        return;
    }

    if (!confirm('Bạn có chắc chắn muốn xóa lớp này?')) {
        return;
    }

    for (var j = 0; j < classes.length; j++) {
        if (String(classes[j].id) === String(id)) {
            var removed = classes.splice(j, 1)[0];
            addLog('Xóa lớp', 'Xóa lớp ' + removed.classCode);
            break;
        }
    }

    saveClasses();
    renderClasses();
}

function attachClassEvents() {
    document.getElementById('classForm').addEventListener('submit', submitClassForm);
    document.getElementById('btnResetClass').addEventListener('click', function () {
        resetClassForm();
    });
}

document.addEventListener('DOMContentLoaded', function () {
    loadClassData();
    attachClassEvents();
    renderClasses();
});
