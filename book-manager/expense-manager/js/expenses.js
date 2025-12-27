var expenses = [];
var categories = [];
var logs = [];

function loadExpenseData() {
    expenses = getData('expenses', []);
    categories = getData('categories', []);
    logs = getData('logs', []);
}

function logExpenseAction(action, detail) {
    var entry = {
        id: Date.now(),
        action: action,
        entity: 'expense',
        detail: detail,
        time: new Date().toISOString()
    };
    logs.push(entry);
    setData('logs', logs);
}

function resetExpenseForm() {
    document.getElementById('expense-id').value = '';
    document.getElementById('expense-title').value = '';
    document.getElementById('expense-amount').value = '';
    document.getElementById('expense-note').value = '';
    document.getElementById('expense-date').value = '';
    document.getElementById('expense-category').value = '';
}

function populateCategoryOptions() {
    var select = document.getElementById('expense-category');
    var filterSelect = document.getElementById('filter-category');
    select.innerHTML = '<option value="">-- Chọn danh mục --</option>';
    filterSelect.innerHTML = '<option value="">Tất cả danh mục</option>';
    for (var i = 0; i < categories.length; i++) {
        var cat = categories[i];
        var option = document.createElement('option');
        option.value = cat.id;
        option.textContent = cat.categoryName;
        select.appendChild(option);

        var filterOption = document.createElement('option');
        filterOption.value = cat.id;
        filterOption.textContent = cat.categoryName;
        filterSelect.appendChild(filterOption);
    }
}

function saveExpense(event) {
    event.preventDefault();
    var id = document.getElementById('expense-id').value;
    var title = document.getElementById('expense-title').value.trim();
    var amount = parseFloat(document.getElementById('expense-amount').value);
    var categoryId = document.getElementById('expense-category').value;
    var date = document.getElementById('expense-date').value;
    var note = document.getElementById('expense-note').value.trim();

    if (title === '' || isNaN(amount) || amount <= 0 || categoryId === '' || date === '') {
        alert('Vui lòng nhập đầy đủ và hợp lệ.');
        return;
    }

    if (id) {
        var found = false;
        for (var i = 0; i < expenses.length; i++) {
            if (String(expenses[i].id) === String(id)) {
                expenses[i].title = title;
                expenses[i].amount = amount;
                expenses[i].categoryId = parseInt(categoryId, 10);
                expenses[i].date = date;
                expenses[i].note = note;
                found = true;
                logExpenseAction('update', 'Cập nhật khoản chi ' + title);
                break;
            }
        }
        if (!found) {
            alert('Không tìm thấy khoản chi để cập nhật.');
            return;
        }
    } else {
        var newExpense = {
            id: Date.now(),
            title: title,
            amount: amount,
            categoryId: parseInt(categoryId, 10),
            date: date,
            note: note
        };
        expenses.push(newExpense);
        logExpenseAction('create', 'Thêm khoản chi ' + title);
    }

    setData('expenses', expenses);
    renderExpenseTable();
    resetExpenseForm();
}

function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + ' đ';
}

function findCategoryName(id) {
    for (var i = 0; i < categories.length; i++) {
        if (String(categories[i].id) === String(id)) {
            return categories[i].categoryName;
        }
    }
    return '';
}

function applyFilters(list) {
    var keyword = document.getElementById('search-title').value.trim().toLowerCase();
    var catFilter = document.getElementById('filter-category').value;
    var fromDate = document.getElementById('filter-from').value;
    var toDate = document.getElementById('filter-to').value;

    var filtered = [];
    for (var i = 0; i < list.length; i++) {
        var item = list[i];
        var match = true;

        if (keyword && item.title.toLowerCase().indexOf(keyword) === -1) {
            match = false;
        }

        if (catFilter && String(item.categoryId) !== String(catFilter)) {
            match = false;
        }

        if (fromDate && item.date < fromDate) {
            match = false;
        }

        if (toDate && item.date > toDate) {
            match = false;
        }

        if (match) {
            filtered.push(item);
        }
    }
    return filtered;
}

function renderExpenseTable() {
    var tbody = document.getElementById('expense-table');
    tbody.innerHTML = '';
    var list = applyFilters(expenses);

    for (var i = 0; i < list.length; i++) {
        var exp = list[i];
        var tr = document.createElement('tr');

        var tdIndex = document.createElement('td');
        tdIndex.textContent = i + 1;
        tr.appendChild(tdIndex);

        var tdTitle = document.createElement('td');
        tdTitle.textContent = exp.title;
        tr.appendChild(tdTitle);

        var tdAmount = document.createElement('td');
        tdAmount.textContent = formatCurrency(exp.amount);
        tr.appendChild(tdAmount);

        var tdCategory = document.createElement('td');
        tdCategory.textContent = findCategoryName(exp.categoryId);
        tr.appendChild(tdCategory);

        var tdDate = document.createElement('td');
        tdDate.textContent = exp.date;
        tr.appendChild(tdDate);

        var tdNote = document.createElement('td');
        tdNote.textContent = exp.note;
        tr.appendChild(tdNote);

        var tdAction = document.createElement('td');
        tdAction.className = 'text-right';

        var editBtn = document.createElement('button');
        editBtn.textContent = 'Sửa';
        editBtn.addEventListener('click', (function (item) {
            return function () {
                document.getElementById('expense-id').value = item.id;
                document.getElementById('expense-title').value = item.title;
                document.getElementById('expense-amount').value = item.amount;
                document.getElementById('expense-category').value = item.categoryId;
                document.getElementById('expense-date').value = item.date;
                document.getElementById('expense-note').value = item.note;
            };
        })(exp));

        var deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Xóa';
        deleteBtn.className = 'link';
        deleteBtn.addEventListener('click', (function (item) {
            return function () {
                deleteExpense(item.id);
            };
        })(exp));

        tdAction.appendChild(editBtn);
        tdAction.appendChild(deleteBtn);
        tr.appendChild(tdAction);
        tbody.appendChild(tr);
    }
}

function deleteExpense(id) {
    var confirmDelete = confirm('Bạn có chắc muốn xóa khoản chi này?');
    if (!confirmDelete) {
        return;
    }
    var newList = [];
    var removedTitle = '';
    for (var i = 0; i < expenses.length; i++) {
        if (expenses[i].id === id) {
            removedTitle = expenses[i].title;
        } else {
            newList.push(expenses[i]);
        }
    }
    expenses = newList;
    setData('expenses', expenses);
    logExpenseAction('delete', 'Xóa khoản chi ' + removedTitle);
    renderExpenseTable();
    resetExpenseForm();
}

function bindFilterEvents() {
    document.getElementById('apply-filter').addEventListener('click', function () {
        renderExpenseTable();
    });
    document.getElementById('clear-filter').addEventListener('click', function () {
        document.getElementById('search-title').value = '';
        document.getElementById('filter-category').value = '';
        document.getElementById('filter-from').value = '';
        document.getElementById('filter-to').value = '';
        renderExpenseTable();
    });
}

function initExpensePage() {
    loadExpenseData();
    populateCategoryOptions();
    renderExpenseTable();

    var form = document.getElementById('expense-form');
    form.addEventListener('submit', saveExpense);

    document.getElementById('reset-expense').addEventListener('click', function () {
        resetExpenseForm();
    });

    bindFilterEvents();
}

if (document.readyState !== 'loading') {
    initExpensePage();
} else {
    document.addEventListener('DOMContentLoaded', initExpensePage);
}
