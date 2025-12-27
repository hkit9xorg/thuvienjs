var editingProductId = null;

function loadOptions() {
    var categorySelect = document.getElementById('categoryId');
    var supplierSelect = document.getElementById('supplierId');
    var filterCategory = document.getElementById('filterCategory');
    var filterSupplier = document.getElementById('filterSupplier');

    var categories = getData('categories');
    var suppliers = getData('suppliers');

    categorySelect.innerHTML = '';
    supplierSelect.innerHTML = '';
    filterCategory.innerHTML = '<option value="">Tất cả</option>';
    filterSupplier.innerHTML = '<option value="">Tất cả</option>';

    for (var i = 0; i < categories.length; i++) {
        var option = document.createElement('option');
        option.value = categories[i].id;
        option.textContent = categories[i].categoryName;
        categorySelect.appendChild(option);

        var filterOption = document.createElement('option');
        filterOption.value = categories[i].id;
        filterOption.textContent = categories[i].categoryName;
        filterCategory.appendChild(filterOption);
    }

    for (var j = 0; j < suppliers.length; j++) {
        var supOpt = document.createElement('option');
        supOpt.value = suppliers[j].id;
        supOpt.textContent = suppliers[j].supplierName;
        supplierSelect.appendChild(supOpt);

        var supFilter = document.createElement('option');
        supFilter.value = suppliers[j].id;
        supFilter.textContent = suppliers[j].supplierName;
        filterSupplier.appendChild(supFilter);
    }
}

function resetForm() {
    document.getElementById('productForm').reset();
    document.getElementById('productId').value = '';
    editingProductId = null;
}

function getProductFormData() {
    return {
        productCode: document.getElementById('productCode').value.trim(),
        productName: document.getElementById('productName').value.trim(),
        categoryId: document.getElementById('categoryId').value,
        supplierId: document.getElementById('supplierId').value,
        price: parseFloat(document.getElementById('price').value),
        quantity: parseInt(document.getElementById('quantity').value, 10),
        description: document.getElementById('description').value.trim()
    };
}

function saveProduct(event) {
    event.preventDefault();
    var data = getProductFormData();

    if (!data.productCode || !data.productName) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }
    if (isNaN(data.price) || data.price < 0) {
        alert('Giá không hợp lệ.');
        return;
    }
    if (isNaN(data.quantity) || data.quantity < 0) {
        alert('Số lượng không hợp lệ.');
        return;
    }

    var products = getData('products');

    if (editingProductId) {
        var updated = false;
        for (var i = 0; i < products.length; i++) {
            if (products[i].id === editingProductId) {
                products[i].productCode = data.productCode;
                products[i].productName = data.productName;
                products[i].categoryId = data.categoryId;
                products[i].supplierId = data.supplierId;
                products[i].price = data.price;
                products[i].quantity = data.quantity;
                products[i].description = data.description;
                updated = true;
                break;
            }
        }
        if (updated) {
            setData('products', products);
            addLog('update', 'product', 'Cập nhật sản phẩm ' + data.productCode);
            alert('Cập nhật thành công.');
        }
    } else {
        var newItem = {
            id: Date.now(),
            productCode: data.productCode,
            productName: data.productName,
            categoryId: data.categoryId,
            supplierId: data.supplierId,
            price: data.price,
            quantity: data.quantity,
            description: data.description
        };
        products.push(newItem);
        setData('products', products);
        addLog('create', 'product', 'Thêm sản phẩm ' + data.productCode);
        alert('Thêm mới thành công.');
    }

    resetForm();
    renderProducts();
}

function renderProducts() {
    var products = getData('products');
    var categories = getData('categories');
    var suppliers = getData('suppliers');

    var codeSearch = document.getElementById('searchCode').value.trim().toLowerCase();
    var nameSearch = document.getElementById('searchName').value.trim().toLowerCase();
    var filterCategory = document.getElementById('filterCategory').value;
    var filterSupplier = document.getElementById('filterSupplier').value;

    var tbody = document.getElementById('productTable');
    tbody.innerHTML = '';

    for (var i = 0; i < products.length; i++) {
        var p = products[i];
        if (codeSearch && p.productCode.toLowerCase().indexOf(codeSearch) === -1) {
            continue;
        }
        if (nameSearch && p.productName.toLowerCase().indexOf(nameSearch) === -1) {
            continue;
        }
        if (filterCategory && String(p.categoryId) !== String(filterCategory)) {
            continue;
        }
        if (filterSupplier && String(p.supplierId) !== String(filterSupplier)) {
            continue;
        }

        var catName = 'N/A';
        for (var c = 0; c < categories.length; c++) {
            if (String(categories[c].id) === String(p.categoryId)) {
                catName = categories[c].categoryName;
                break;
            }
        }

        var supName = 'N/A';
        for (var s = 0; s < suppliers.length; s++) {
            if (String(suppliers[s].id) === String(p.supplierId)) {
                supName = suppliers[s].supplierName;
                break;
            }
        }

        var tr = document.createElement('tr');
        tr.innerHTML = '<td>' + p.productCode + '</td>' +
            '<td>' + p.productName + '</td>' +
            '<td>' + catName + '</td>' +
            '<td>' + supName + '</td>' +
            '<td>' + p.price.toLocaleString() + '</td>' +
            '<td><span class="badge' + (p.quantity < 5 ? ' warn' : '') + '">' + p.quantity + '</span></td>' +
            '<td>' + (p.description || '') + '</td>' +
            '<td>' +
                '<button onclick="editProduct(' + p.id + ')">Sửa</button>' +
                '<button class="danger" onclick="deleteProduct(' + p.id + ')">Xóa</button>' +
            '</td>';
        tbody.appendChild(tr);
    }
}

function editProduct(id) {
    var products = getData('products');
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            document.getElementById('productId').value = id;
            document.getElementById('productCode').value = products[i].productCode;
            document.getElementById('productName').value = products[i].productName;
            document.getElementById('categoryId').value = products[i].categoryId;
            document.getElementById('supplierId').value = products[i].supplierId;
            document.getElementById('price').value = products[i].price;
            document.getElementById('quantity').value = products[i].quantity;
            document.getElementById('description').value = products[i].description;
            editingProductId = id;
            break;
        }
    }
}

function deleteProduct(id) {
    if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
        return;
    }
    var products = getData('products');
    var newList = [];
    var code = '';
    for (var i = 0; i < products.length; i++) {
        if (products[i].id === id) {
            code = products[i].productCode;
            continue;
        }
        newList.push(products[i]);
    }
    setData('products', newList);
    addLog('delete', 'product', 'Xóa sản phẩm ' + code);
    renderProducts();
}

function bindEvents() {
    document.getElementById('productForm').addEventListener('submit', saveProduct);
    document.getElementById('searchCode').addEventListener('input', renderProducts);
    document.getElementById('searchName').addEventListener('input', renderProducts);
    document.getElementById('filterCategory').addEventListener('change', renderProducts);
    document.getElementById('filterSupplier').addEventListener('change', renderProducts);
}

document.addEventListener('DOMContentLoaded', function () {
    loadOptions();
    bindEvents();
    renderProducts();
});
