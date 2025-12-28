let editingCategoryId = null;

function renderCategoriesTable() {
  const tbody = document.getElementById('categories-body');
  const categories = getData('categories', []);

  tbody.innerHTML = '';

  if (categories.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 3;
    cell.className = 'empty';
    cell.textContent = 'Chưa có loại từ nào.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  categories.forEach((category) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${category.name}</td>
      <td class="small-text">${category.id}</td>
      <td class="actions">
        <button class="secondary" data-action="edit" data-id="${category.id}">Sửa</button>
        <button class="danger" data-action="delete" data-id="${category.id}">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function resetCategoryForm() {
  const form = document.getElementById('category-form');
  form.reset();
  editingCategoryId = null;
  document.getElementById('category-title').textContent = 'Thêm loại từ';
  document.getElementById('category-submit').textContent = 'Thêm mới';
}

function generateIdFromName(name) {
  return name
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '') || `cat-${Date.now()}`;
}

function handleCategorySubmit(event) {
  event.preventDefault();
  const nameInput = document.getElementById('category-name');
  const name = nameInput.value.trim();
  if (!name) {
    alert('Vui lòng nhập tên loại từ.');
    return;
  }

  const categories = getData('categories', []);

  if (editingCategoryId) {
    const index = categories.findIndex((c) => c.id === editingCategoryId);
    if (index !== -1) {
      categories[index].name = name;
      setData('categories', categories);
      renderCategoriesTable();
      resetCategoryForm();
    }
    return;
  }

  const id = generateIdFromName(name);
  if (categories.some((c) => c.id === id)) {
    alert('Id loại từ đã tồn tại, vui lòng đặt tên khác.');
    return;
  }

  categories.push({ id, name });
  setData('categories', categories);
  renderCategoriesTable();
  resetCategoryForm();
}

function handleCategoryActions(event) {
  const action = event.target.getAttribute('data-action');
  const id = event.target.getAttribute('data-id');
  if (!action || !id) return;

  const categories = getData('categories', []);

  if (action === 'delete') {
    const words = getData('words', []);
    const used = words.some((w) => w.categoryId === id);
    if (used) {
      alert('Không thể xóa: loại từ đang được dùng trong danh sách từ vựng.');
      return;
    }
    if (confirm('Bạn chắc muốn xóa loại từ này?')) {
      const filtered = categories.filter((c) => c.id !== id);
      setData('categories', filtered);
      renderCategoriesTable();
      resetCategoryForm();
    }
    return;
  }

  if (action === 'edit') {
    const category = categories.find((c) => c.id === id);
    if (!category) return;
    editingCategoryId = id;
    document.getElementById('category-name').value = category.name;
    document.getElementById('category-title').textContent = 'Cập nhật loại từ';
    document.getElementById('category-submit').textContent = 'Lưu thay đổi';
  }
}

function initCategoriesPage() {
  const form = document.getElementById('category-form');
  const table = document.getElementById('categories-table');
  const resetBtn = document.getElementById('category-reset');

  if (!form || !table) return;

  renderCategoriesTable();
  form.addEventListener('submit', handleCategorySubmit);
  table.addEventListener('click', handleCategoryActions);
  resetBtn.addEventListener('click', resetCategoryForm);
}

document.addEventListener('DOMContentLoaded', initCategoriesPage);
