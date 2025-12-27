function loadImportProducts() {
    var select = document.getElementById('importProduct');
    var products = getData('products');
    select.innerHTML = '';
    for (var i = 0; i < products.length; i++) {
        var option = document.createElement('option');
        option.value = products[i].id;
        option.textContent = products[i].productName + ' (' + products[i].productCode + ')';
        select.appendChild(option);
    }
}

function saveImport(event) {
    event.preventDefault();
    var productId = document.getElementById('importProduct').value;
    var quantity = parseInt(document.getElementById('importQuantity').value, 10);
    var note = document.getElementById('importNote').value.trim();

    if (!productId) {
        alert('Chọn sản phẩm.');
        return;
    }
    if (isNaN(quantity) || quantity <= 0) {
        alert('Số lượng phải lớn hơn 0.');
        return;
    }

    var products = getData('products');
    var updated = false;
    for (var i = 0; i < products.length; i++) {
        if (String(products[i].id) === String(productId)) {
            products[i].quantity += quantity;
            updated = true;
            break;
        }
    }
    if (!updated) {
        alert('Không tìm thấy sản phẩm.');
        return;
    }

    setData('products', products);

    var imports = getData('imports');
    imports.push({
        id: Date.now(),
        productId: productId,
        quantity: quantity,
        note: note,
        date: new Date().toISOString()
    });
    setData('imports', imports);

    addLog('import', 'stock', 'Nhập ' + quantity + ' sản phẩm ID ' + productId);
    alert('Nhập kho thành công.');

    document.getElementById('importForm').reset();
    loadImportProducts();
    renderImportHistory();
}

function renderImportHistory() {
    var imports = getData('imports');
    var products = getData('products');
    var tbody = document.getElementById('importTable');
    tbody.innerHTML = '';

    for (var i = 0; i < imports.length; i++) {
        var name = 'N/A';
        for (var j = 0; j < products.length; j++) {
            if (String(products[j].id) === String(imports[i].productId)) {
                name = products[j].productName;
                break;
            }
        }
        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + new Date(imports[i].date).toLocaleString() + '</td>' +
            '<td>' + name + '</td>' +
            '<td>' + imports[i].quantity + '</td>' +
            '<td>' + (imports[i].note || '') + '</td>';
        tbody.appendChild(tr);
    }
}

document.addEventListener('DOMContentLoaded', function () {
    loadImportProducts();
    document.getElementById('importForm').addEventListener('submit', saveImport);
    renderImportHistory();
});
