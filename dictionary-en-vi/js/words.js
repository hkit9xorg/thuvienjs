let editingWordId = null;

function renderCategoryOptions(selectEl) {
  const categories = getData('categories', []);
  selectEl.innerHTML = categories
    .map((c) => `<option value="${c.id}">${c.name}</option>`)
    .join('');
}

function renderWordsTable() {
  const tbody = document.getElementById('words-body');
  const words = getData('words', []);
  const categories = getData('categories', []);
  const categoriesMap = categories.reduce((acc, cur) => {
    acc[cur.id] = cur.name;
    return acc;
  }, {});

  tbody.innerHTML = '';

  if (words.length === 0) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');
    cell.colSpan = 5;
    cell.className = 'empty';
    cell.textContent = 'Chưa có từ vựng nào.';
    row.appendChild(cell);
    tbody.appendChild(row);
    return;
  }

  words.forEach((word) => {
    const row = document.createElement('tr');
    row.innerHTML = `
      <td>${word.english}</td>
      <td>${word.vietnamese}</td>
      <td><span class="badge">${categoriesMap[word.categoryId] || 'Khác'}</span></td>
      <td>${word.note || ''}</td>
      <td class="actions">
        <button class="secondary" data-action="edit" data-id="${word.id}">Sửa</button>
        <button class="danger" data-action="delete" data-id="${word.id}">Xóa</button>
      </td>
    `;
    tbody.appendChild(row);
  });
}

function resetForm() {
  const form = document.getElementById('word-form');
  form.reset();
  editingWordId = null;
  document.getElementById('submit-word').textContent = 'Thêm từ mới';
  document.getElementById('form-title').textContent = 'Thêm từ vựng';
}

function handleWordSubmit(event) {
  event.preventDefault();
  const english = document.getElementById('english').value.trim();
  const vietnamese = document.getElementById('vietnamese').value.trim();
  const categoryId = document.getElementById('category').value;
  const note = document.getElementById('note').value.trim();

  if (!english || !vietnamese) {
    alert('Vui lòng nhập đầy đủ từ tiếng Anh và nghĩa tiếng Việt.');
    return;
  }

  const words = getData('words', []);

  if (editingWordId) {
    const index = words.findIndex((w) => w.id === editingWordId);
    if (index !== -1) {
      words[index] = { ...words[index], english, vietnamese, categoryId, note };
      setData('words', words);
      resetForm();
      renderWordsTable();
    }
    return;
  }

  const newWord = {
    id: `w-${Date.now()}`,
    english,
    vietnamese,
    categoryId,
    note
  };

  words.push(newWord);
  setData('words', words);
  resetForm();
  renderWordsTable();
}

function handleTableActions(event) {
  const action = event.target.getAttribute('data-action');
  const id = event.target.getAttribute('data-id');
  if (!action || !id) return;

  const words = getData('words', []);

  if (action === 'delete') {
    if (confirm('Bạn có chắc muốn xóa từ này?')) {
      const filtered = words.filter((w) => w.id !== id);
      setData('words', filtered);
      renderWordsTable();
      resetForm();
    }
    return;
  }

  if (action === 'edit') {
    const word = words.find((w) => w.id === id);
    if (!word) return;
    editingWordId = id;
    document.getElementById('english').value = word.english;
    document.getElementById('vietnamese').value = word.vietnamese;
    document.getElementById('category').value = word.categoryId;
    document.getElementById('note').value = word.note || '';
    document.getElementById('submit-word').textContent = 'Cập nhật';
    document.getElementById('form-title').textContent = 'Cập nhật từ vựng';
  }
}

function initWordsPage() {
  const form = document.getElementById('word-form');
  const categorySelect = document.getElementById('category');
  const table = document.getElementById('words-table');
  const resetBtn = document.getElementById('reset-form');

  if (!form || !categorySelect || !table) return;

  renderCategoryOptions(categorySelect);
  renderWordsTable();

  form.addEventListener('submit', handleWordSubmit);
  table.addEventListener('click', handleTableActions);
  resetBtn.addEventListener('click', resetForm);
}

document.addEventListener('DOMContentLoaded', initWordsPage);
