function loadExportProducts() {
    var select = document.getElementById('exportProduct');
    var products = getData('products');
    select.innerHTML = '';
    for (var i = 0; i < products.length; i++) {
        var option = document.createElement('option');
        option.value = products[i].id;
        option.textContent = products[i].productName + ' - Tồn: ' + products[i].quantity;
        select.appendChild(option);
    }
}

function saveExport(event) {
    event.preventDefault();
    var productId = document.getElementById('exportProduct').value;
    var quantity = parseInt(document.getElementById('exportQuantity').value, 10);
    var note = document.getElementById('exportNote').value.trim();

    if (!productId) {
        alert('Chọn sản phẩm.');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert('Số lượng phải lớn hơn 0.');
        return;
    }

    var products = getData('products');
    var found = false;
    for (var i = 0; i < products.length; i++) {
        if (String(products[i].id) === String(productId)) {
            if (products[i].quantity < quantity) {
                alert('Tồn kho không đủ.');
                return;
            }
            products[i].quantity -= quantity;
            found = true;
            break;
        }
    }
    if (!found) {
        alert('Không tìm thấy sản phẩm.');
        return;
    }

    setData('products', products);

    var exports = getData('exports');
    exports.push({
        id: Date.now(),
        productId: productId,
        quantity: quantity,
        note: note,
        date: new Date().toISOString()
    });
    setData('exports', exports);

    addLog('export', 'stock', 'Xuất ' + quantity + ' sản phẩm ID ' + productId);
    alert('Xuất kho thành công.');

    document.getElementById('exportForm').reset();
    loadExportProducts();
    renderExportHistory();
}

function renderExportHistory() {
    var exports = getData('exports');
    var products = getData('products');
    var tbody = document.getElementById('exportTable');
    tbody.innerHTML = '';

    for (var i = 0; i < exports.length; i++) {
        var name = 'N/A';
        for (var j = 0; j < products.length; j++) {
            if (String(products[j].id) === String(exports[i].productId)) {
                name = products[j].productName;
                break;
            }
        }
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + new Date(exports[i].date).toLocaleString() + '</td>' +
            '<td>' + name + '</td>' +
            '<td>' + exports[i].quantity + '</td>' +
            '<td>' + (exports[i].note || '') + '</td>';
        tbody.appendChild(tr);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadExportProducts();
    document.getElementById('exportForm').addEventListener('submit', saveExport);
    renderExportHistory();
});
