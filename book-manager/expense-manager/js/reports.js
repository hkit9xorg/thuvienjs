var expenses = [];
var categories = [];

function loadReportData() {
    expenses = getData('expenses', []);
    categories = getData('categories', []);
}

function formatCurrency(value) {
    return value.toLocaleString('vi-VN') + ' đ';
}

function renderOverview() {
    var wrap = document.getElementById('report-overview');
    wrap.innerHTML = '';
    if (expenses.length === 0) {
        wrap.textContent = 'Chưa có dữ liệu chi tiêu.';
        return;
    }
    var total = 0;
    for (var i = 0; i < expenses.length; i++) {
        total += expenses[i].amount;
    }

    var totalBox = document.createElement('div');
    totalBox.className = 'info-box';
    totalBox.textContent = 'Tổng chi: ' + formatCurrency(total);
    wrap.appendChild(totalBox);

    var countBox = document.createElement('div');
    countBox.className = 'info-box';
    countBox.textContent = 'Số khoản chi: ' + expenses.length;
    wrap.appendChild(countBox);
}

function renderCategoryReport() {
    var tbody = document.getElementById('report-category');
    tbody.innerHTML = '';
    var summary = {};
    var i;
    for (i = 0; i < categories.length; i++) {
        summary[categories[i].id] = 0;
    }
    for (i = 0; i < expenses.length; i++) {
        var cid = expenses[i].categoryId;
        if (summary[cid] === undefined) {
            summary[cid] = 0;
        }
        summary[cid] += expenses[i].amount;
    }

    for (var key in summary) {
        if (Object.prototype.hasOwnProperty.call(summary, key)) {
            var tr = document.createElement('tr');
            var nameCell = document.createElement('td');
            nameCell.textContent = findCategoryName(key);
            tr.appendChild(nameCell);

            var amountCell = document.createElement('td');
            amountCell.textContent = formatCurrency(summary[key]);
            tr.appendChild(amountCell);
            tbody.appendChild(tr);
        }
    }
}

function renderGroupReport(targetId, groupingFn) {
    var tbody = document.getElementById(targetId);
    tbody.innerHTML = '';
    var buckets = {};
    var i;
    for (i = 0; i < expenses.length; i++) {
        var label = groupingFn(expenses[i]);
        if (!buckets[label]) {
            buckets[label] = 0;
        }
        buckets[label] += expenses[i].amount;
    }
    var keys = Object.keys(buckets);
    keys.sort();
    for (i = 0; i < keys.length; i++) {
        var tr = document.createElement('tr');
        var labelCell = document.createElement('td');
        labelCell.textContent = keys[i];
        tr.appendChild(labelCell);

        var valueCell = document.createElement('td');
        valueCell.textContent = formatCurrency(buckets[keys[i]]);
        tr.appendChild(valueCell);
        tbody.appendChild(tr);
    }
    if (keys.length === 0) {
        var emptyRow = document.createElement('tr');
        var emptyCell = document.createElement('td');
        emptyCell.colSpan = 2;
        emptyCell.textContent = 'Chưa có dữ liệu.';
        emptyRow.appendChild(emptyCell);
        tbody.appendChild(emptyRow);
    }
}

function findCategoryName(id) {
    for (var i = 0; i < categories.length; i++) {
        if (String(categories[i].id) === String(id)) {
            return categories[i].categoryName;
        }
    }
    return 'Chưa đặt tên';
}

function renderMaxExpense() {
    var container = document.getElementById('report-max');
    container.innerHTML = '';
    if (expenses.length === 0) {
        container.textContent = 'Chưa có dữ liệu.';
        return;
    }
    var maxItem = expenses[0];
    for (var i = 1; i < expenses.length; i++) {
        if (expenses[i].amount > maxItem.amount) {
            maxItem = expenses[i];
        }
    }
    var detail = document.createElement('div');
    detail.className = 'info-box';
    detail.textContent = maxItem.title + ' - ' + formatCurrency(maxItem.amount) + ' (' + findCategoryName(maxItem.categoryId) + ', ' + maxItem.date + ')';
    container.appendChild(detail);
}

function initReportPage() {
    loadReportData();
    renderOverview();
    renderCategoryReport();
    renderGroupReport('report-date', function (item) {
        return item.date;
    });
    renderGroupReport('report-month', function (item) {
        return item.date.substring(0, 7);
    });
    renderMaxExpense();
}

if (document.readyState !== 'loading') {
    initReportPage();
} else {
    document.addEventListener('DOMContentLoaded', initReportPage);
}
