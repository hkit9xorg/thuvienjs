function createSummaryItem(title, value) {
    var div = document.createElement('div');
    div.className = 'summary-card';
    var h3 = document.createElement('h3');
    h3.textContent = title;
    var p = document.createElement('p');
    p.textContent = value;
    div.appendChild(h3);
    div.appendChild(p);
    return div;
}

function getTopProductBy(records, products) {
    var counter = {};
    for (var i = 0; i < records.length; i++) {
        var pid = String(records[i].productId);
        if (!counter[pid]) {
            counter[pid] = 0;
        }
        counter[pid] += parseInt(records[i].quantity, 10);
    }
    var topId = null;
    var max = 0;
    for (var key in counter) {
        if (counter.hasOwnProperty(key)) {
            if (counter[key] > max) {
                max = counter[key];
                topId = key;
            }
        }
    }
    if (!topId) {
        return '-';
    }
    for (var j = 0; j < products.length; j++) {
        if (String(products[j].id) === String(topId)) {
            return products[j].productName + ' (' + max + ')';
        }
    }
    return '-';
}

function renderSummary() {
    var summaryGrid = document.getElementById('summaryGrid');
    summaryGrid.innerHTML = '';
    var products = getData('products');
    var imports = getData('imports');
    var exports = getData('exports');

    summaryGrid.appendChild(createSummaryItem('Tổng số sản phẩm', products.length));
    summaryGrid.appendChild(createSummaryItem('Tổng lượt nhập', imports.length));
    summaryGrid.appendChild(createSummaryItem('Tổng lượt xuất', exports.length));
    summaryGrid.appendChild(createSummaryItem('Nhập nhiều nhất', getTopProductBy(imports, products)));
    summaryGrid.appendChild(createSummaryItem('Xuất nhiều nhất', getTopProductBy(exports, products)));
}

function renderInventory() {
    var products = getData('products');
    var categories = getData('categories');
    var tbody = document.getElementById('inventoryTable');
    tbody.innerHTML = '';

    for (var i = 0; i < products.length; i++) {
        var catName = '';
        for (var j = 0; j < categories.length; j++) {
            if (String(categories[j].id) === String(products[i].categoryId)) {
                catName = categories[j].categoryName;
                break;
            }
        }
        var tr = document.createElement('tr');
        if (products[i].quantity < 5) {
            tr.className = 'low-stock';
        }
        tr.innerHTML = '<td>' + products[i].productCode + '</td>' +
            '<td>' + products[i].productName + '</td>' +
            '<td>' + catName + '</td>' +
            '<td><span class="badge' + (products[i].quantity < 5 ? ' warn' : '') + '">' + products[i].quantity + '</span></td>';
        tbody.appendChild(tr);
    }
}

function renderLogs() {
    var logs = getData('logs');
    var tbody = document.getElementById('logTable');
    tbody.innerHTML = '';
    for (var i = 0; i < logs.length; i++) {
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + new Date(logs[i].date).toLocaleString() + '</td>' +
            '<td>' + logs[i].action + '</td>' +
            '<td>' + logs[i].entity + '</td>' +
            '<td>' + logs[i].message + '</td>';
        tbody.appendChild(tr);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    renderSummary();
    renderInventory();
    renderLogs();
});
