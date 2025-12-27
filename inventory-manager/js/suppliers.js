var editingSupplierId = null;

function resetSupplierForm() {
    document.getElementById('supplierForm').reset();
    document.getElementById('supplierId').value = '';
    editingSupplierId = null;
}

function saveSupplier(event) {
    event.preventDefault();
    var code = document.getElementById('supplierCode').value.trim();
    var name = document.getElementById('supplierName').value.trim();
    var phone = document.getElementById('phone').value.trim();
    var email = document.getElementById('email').value.trim();
    var address = document.getElementById('address').value.trim();

    if (!code || !name || !phone || !email || !address) {
        alert('Vui lòng nhập đầy đủ thông tin.');
        return;
    }

    var suppliers = getData('suppliers');
    if (editingSupplierId) {
        for (var i = 0; i < suppliers.length; i++) {
            if (suppliers[i].id === editingSupplierId) {
                suppliers[i].supplierCode = code;
                suppliers[i].supplierName = name;
                suppliers[i].phone = phone;
                suppliers[i].email = email;
                suppliers[i].address = address;
                break;
            }
        }
        setData('suppliers', suppliers);
        addLog('update', 'supplier', 'Cập nhật nhà cung cấp ' + code);
        alert('Cập nhật thành công.');
    } else {
        suppliers.push({
            id: Date.now(),
            supplierCode: code,
            supplierName: name,
            phone: phone,
            email: email,
            address: address
        });
        setData('suppliers', suppliers);
        addLog('create', 'supplier', 'Thêm nhà cung cấp ' + code);
        alert('Thêm nhà cung cấp thành công.');
    }
    resetSupplierForm();
    renderSuppliers();
}

function renderSuppliers() {
    var suppliers = getData('suppliers');
    var tbody = document.getElementById('supplierTable');
    tbody.innerHTML = '';
    for (var i = 0; i < suppliers.length; i++) {
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + suppliers[i].supplierCode + '</td>' +
            '<td>' + suppliers[i].supplierName + '</td>' +
            '<td>' + suppliers[i].phone + '</td>' +
            '<td>' + suppliers[i].email + '</td>' +
            '<td>' + suppliers[i].address + '</td>' +
            '<td>' +
                '<button onclick="editSupplier(' + suppliers[i].id + ')">Sửa</button>' +
                '<button class="danger" onclick="deleteSupplier(' + suppliers[i].id + ')">Xóa</button>' +
            '</td>';
        tbody.appendChild(row);
    }
}

function editSupplier(id) {
    var suppliers = getData('suppliers');
    for (var i = 0; i < suppliers.length; i++) {
        if (suppliers[i].id === id) {
            document.getElementById('supplierId').value = id;
            document.getElementById('supplierCode').value = suppliers[i].supplierCode;
            document.getElementById('supplierName').value = suppliers[i].supplierName;
            document.getElementById('phone').value = suppliers[i].phone;
            document.getElementById('email').value = suppliers[i].email;
            document.getElementById('address').value = suppliers[i].address;
            editingSupplierId = id;
            break;
        }
    }
}

function deleteSupplier(id) {
    var products = getData('products');
    for (var i = 0; i < products.length; i++) {
        if (String(products[i].supplierId) === String(id)) {
            alert('Không thể xóa. Có sản phẩm thuộc nhà cung cấp này.');
            return;
        }
    }
    if (!confirm('Xác nhận xóa nhà cung cấp?')) {
        return;
    }
    var suppliers = getData('suppliers');
    var filtered = [];
    var code = '';
    for (var j = 0; j < suppliers.length; j++) {
        if (suppliers[j].id === id) {
            code = suppliers[j].supplierCode;
            continue;
        }
        filtered.push(suppliers[j]);
    }
    setData('suppliers', filtered);
    addLog('delete', 'supplier', 'Xóa nhà cung cấp ' + code);
    renderSuppliers();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('supplierForm').addEventListener('submit', saveSupplier);
    renderSuppliers();
});
