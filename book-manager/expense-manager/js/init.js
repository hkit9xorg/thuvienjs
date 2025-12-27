/* Khởi tạo dữ liệu mẫu khi người dùng nhấn nút */
function createSampleData() {
    var categories = getData('categories', []);
    var expenses = getData('expenses', []);
    var logs = getData('logs', []);

    if (categories.length > 0 || expenses.length > 0) {
        alert('Dữ liệu đã tồn tại, không cần khởi tạo.');
        return;
    }

    var now = Date.now();
    categories = [
        { id: now, categoryName: 'Ăn uống' },
        { id: now + 1, categoryName: 'Di chuyển' },
        { id: now + 2, categoryName: 'Mua sắm' }
    ];

    expenses = [
        { id: now + 10, title: 'Bữa trưa', amount: 120000, categoryId: categories[0].id, date: formatDateForInput(new Date()), note: 'Cơm văn phòng' },
        { id: now + 11, title: 'GrabBike', amount: 45000, categoryId: categories[1].id, date: formatDateForInput(new Date()), note: 'Đi làm' },
        { id: now + 12, title: 'Mua áo sơ mi', amount: 350000, categoryId: categories[2].id, date: formatDateForInput(new Date()), note: 'Khuyến mãi cuối tuần' },
        { id: now + 13, title: 'Cà phê sáng', amount: 40000, categoryId: categories[0].id, date: formatDateForInput(new Date()), note: 'Cafe sữa' }
    ];

    logs = [];

    setData('categories', categories);
    setData('expenses', expenses);
    setData('logs', logs);

    alert('Đã khởi tạo dữ liệu mẫu.');
    updateStatusBox();
}

function formatDateForInput(date) {
    var year = date.getFullYear();
    var month = String(date.getMonth() + 1);
    var day = String(date.getDate());
    if (month.length < 2) {
        month = '0' + month;
    }
    if (day.length < 2) {
        day = '0' + day;
    }
    return year + '-' + month + '-' + day;
}

function updateStatusBox() {
    var categories = getData('categories', []);
    var expenses = getData('expenses', []);
    var logs = getData('logs', []);
    var statusEl = document.getElementById('status-box');
    if (!statusEl) {
        return;
    }
    statusEl.innerHTML = '';
    var info = document.createElement('div');
    info.className = 'info-box';
    info.textContent = 'Danh mục: ' + categories.length;
    statusEl.appendChild(info);

    var info2 = document.createElement('div');
    info2.className = 'info-box';
    info2.textContent = 'Khoản chi: ' + expenses.length;
    statusEl.appendChild(info2);

    var info3 = document.createElement('div');
    info3.className = 'info-box';
    info3.textContent = 'Log: ' + logs.length;
    statusEl.appendChild(info3);
}

function initPage() {
    var initBtn = document.getElementById('init-data');
    if (initBtn) {
        initBtn.addEventListener('click', function () {
            createSampleData();
        });
    }
    updateStatusBox();
}

if (document.readyState !== 'loading') {
    initPage();
} else {
    document.addEventListener('DOMContentLoaded', initPage);
}
