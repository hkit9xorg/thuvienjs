var categories = [];
var expenses = [];
var logs = [];

function loadCategoryData() {
    categories = getData('categories', []);
    expenses = getData('expenses', []);
    logs = getData('logs', []);
}

function logAction(action, entity, detail) {
    var entry = {
        id: Date.now(),
        action: action,
        entity: entity,
        detail: detail,
        time: new Date().toISOString()
    };
    logs.push(entry);
    setData('logs', logs);
}

function resetCategoryForm() {
    document.getElementById('category-id').value = '';
    document.getElementById('category-name').value = '';
}

function renderCategories() {
    var tbody = document.getElementById('category-table');
    tbody.innerHTML = '';
    for (var i = 0; i < categories.length; i++) {
        var item = categories[i];
        var tr = document.createElement('tr');

        var tdIndex = document.createElement('td');
        tdIndex.textContent = i + 1;
        tr.appendChild(tdIndex);

        var tdName = document.createElement('td');
        tdName.textContent = item.categoryName;
        tr.appendChild(tdName);

        var tdAction = document.createElement('td');
        tdAction.className = 'text-right';

        var editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.addEventListener('click', (function (cat) {
            return function () {
                document.getElementById('category-id').value = cat.id;
                document.getElementById('category-name').value = cat.categoryName;
            };
        })(item));

        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'link';
        deleteBtn.addEventListener('click', (function (cat) {
            return function () {
                attemptDeleteCategory(cat.id);
            };
        })(item));

        tdAction.appendChild(editBtn);
        tdAction.appendChild(deleteBtn);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    }
}

function attemptDeleteCategory(id) {
    var inUse = false;
    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].categoryId === id) {
            inUse = true;
            break;
        }
    }
    if (inUse) {
        alert('Không thể xóa. Danh mục đang được sử dụng.');
        return;
    }
    var confirmDelete = confirm('Bạn có chắc muốn xóa danh mục này?');
    if (!confirmDelete) {
        return;
    }
    var newList = [];
    var deletedName = '';
    for (var j = 0; j < categories.length; j++) {
        if (categories[j].id !== id) {
            newList.push(categories[j]);
        } else {
            deletedName = categories[j].categoryName;
        }
    }
    categories = newList;
    setData('categories', categories);
    logAction('delete', 'category', 'Xóa danh mục ' + deletedName);
    renderCategories();
    resetCategoryForm();
}

function saveCategory(event) {
    event.preventDefault();
    var name = document.getElementById('category-name').value.trim();
    var id = document.getElementById('category-id').value;

    if (name === '') {
        alert('Tên danh mục không được để trống.');
        return;
    }

    if (id) {
        var found = false;
        for (var i = 0; i < categories.length; i++) {
            if (String(categories[i].id) === String(id)) {
                categories[i].categoryName = name;
                found = true;
                logAction('update', 'category', 'Cập nhật danh mục ' + name);
                break;
            }
        }
        if (!found) {
            alert('Không tìm thấy danh mục để cập nhật.');
            return;
        }
    } else {
        var newCategory = { id: Date.now(), categoryName: name };
        categories.push(newCategory);
        logAction('create', 'category', 'Thêm danh mục ' + name);
    }

    setData('categories', categories);
    renderCategories();
    resetCategoryForm();
}

function initCategoryPage() {
    loadCategoryData();
    renderCategories();

    var form = document.getElementById('category-form');
    form.addEventListener('submit', saveCategory);

    var resetBtn = document.getElementById('reset-category');
    resetBtn.addEventListener('click', function () {
        resetCategoryForm();
    });
}

if (document.readyState !== 'loading') {
    initCategoryPage();
} else {
    document.addEventListener('DOMContentLoaded', initCategoryPage);
}
