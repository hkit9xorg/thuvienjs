var editingCategoryId = null;

function resetCategoryForm() {
    document.getElementById('categoryForm').reset();
    document.getElementById('categoryId').value = '';
    editingCategoryId = null;
}

function saveCategory(event) {
    event.preventDefault();
    var code = document.getElementById('categoryCode').value.trim();
    var name = document.getElementById('categoryName').value.trim();
    if (!code || !name) {
        alert('Vui lòng nhập mã và tên danh mục.');
        return;
    }

    var categories = getData('categories');
    if (editingCategoryId) {
        for (var i = 0; i < categories.length; i++) {
            if (categories[i].id === editingCategoryId) {
                categories[i].categoryCode = code;
                categories[i].categoryName = name;
                break;
            }
        }
        setData('categories', categories);
        addLog('update', 'category', 'Cập nhật danh mục ' + code);
        alert('Cập nhật danh mục thành công.');
    } else {
        categories.push({
            id: Date.now(),
            categoryCode: code,
            categoryName: name
        });
        setData('categories', categories);
        addLog('create', 'category', 'Thêm danh mục ' + code);
        alert('Thêm danh mục thành công.');
    }
    resetCategoryForm();
    renderCategories();
}

function renderCategories() {
    var categories = getData('categories');
    var tbody = document.getElementById('categoryTable');
    tbody.innerHTML = '';
    for (var i = 0; i < categories.length; i++) {
        var row = document.createElement('tr');
        row.innerHTML = '<td>' + categories[i].categoryCode + '</td>' +
            '<td>' + categories[i].categoryName + '</td>' +
            '<td>' +
                '<button onclick="editCategory(' + categories[i].id + ')">Sửa</button>' +
                '<button class="danger" onclick="deleteCategory(' + categories[i].id + ')">Xóa</button>' +
            '</td>';
        tbody.appendChild(row);
    }
}

function editCategory(id) {
    var categories = getData('categories');
    for (var i = 0; i < categories.length; i++) {
        if (categories[i].id === id) {
            document.getElementById('categoryId').value = id;
            document.getElementById('categoryCode').value = categories[i].categoryCode;
            document.getElementById('categoryName').value = categories[i].categoryName;
            editingCategoryId = id;
            break;
        }
    }
}

function deleteCategory(id) {
    var products = getData('products');
    for (var i = 0; i < products.length; i++) {
        if (String(products[i].categoryId) === String(id)) {
            alert('Không thể xóa. Còn sản phẩm thuộc danh mục này.');
            return;
        }
    }
    if (!confirm('Xác nhận xóa danh mục?')) {
        return;
    }
    var categories = getData('categories');
    var filtered = [];
    var code = '';
    for (var j = 0; j < categories.length; j++) {
        if (categories[j].id === id) {
            code = categories[j].categoryCode;
            continue;
        }
        filtered.push(categories[j]);
    }
    setData('categories', filtered);
    addLog('delete', 'category', 'Xóa danh mục ' + code);
    renderCategories();
}

document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('categoryForm').addEventListener('submit', saveCategory);
    renderCategories();
});
