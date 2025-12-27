// Initialize sample data when storage is empty
function initializeData() {
    var products = getData('products');
    var categories = getData('categories');
    var suppliers = getData('suppliers');
    if (products.length || categories.length || suppliers.length) {
        alert('Dữ liệu đã tồn tại. Không cần khởi tạo.');
        return;
    }

    var now = Date.now();
    var sampleCategories = [
        { id: now, categoryCode: 'CAT01', categoryName: 'Điện tử' },
        { id: now + 1, categoryCode: 'CAT02', categoryName: 'Văn phòng' }
    ];

    var sampleSuppliers = [
        { id: now + 2, supplierCode: 'SUP01', supplierName: 'Nhà cung cấp A', phone: '0900000001', email: 'a@supplier.com', address: 'Hà Nội' },
        { id: now + 3, supplierCode: 'SUP02', supplierName: 'Nhà cung cấp B', phone: '0900000002', email: 'b@supplier.com', address: 'TP.HCM' }
    ];

    var sampleProducts = [
        { id: now + 4, productCode: 'SP01', productName: 'Laptop X', categoryId: sampleCategories[0].id, supplierId: sampleSuppliers[0].id, price: 15000000, quantity: 10, description: 'Laptop văn phòng' },
        { id: now + 5, productCode: 'SP02', productName: 'Chuột quang', categoryId: sampleCategories[0].id, supplierId: sampleSuppliers[1].id, price: 200000, quantity: 30, description: 'Chuột USB' },
        { id: now + 6, productCode: 'SP03', productName: 'Giấy A4', categoryId: sampleCategories[1].id, supplierId: sampleSuppliers[1].id, price: 80000, quantity: 50, description: 'Ram giấy A4' }
    ];

    setData('categories', sampleCategories);
    setData('suppliers', sampleSuppliers);
    setData('products', sampleProducts);
    setData('imports', []);
    setData('exports', []);
    setData('logs', []);

    addLog('init', 'system', 'Khởi tạo dữ liệu mẫu');
    alert('Khởi tạo dữ liệu thành công.');
}
