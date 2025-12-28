function renderSearchResults(results, categoriesMap) {
  const list = document.getElementById('results');
  list.innerHTML = '';

  if (results.length === 0) {
    list.innerHTML = '<p class="empty">Không tìm thấy từ phù hợp.</p>';
    return;
  }

  const grid = document.createElement('div');
  grid.className = 'card-grid';

  results.forEach((word) => {
    const categoryName = categoriesMap[word.categoryId] || 'Không rõ loại từ';
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="flex" style="justify-content: space-between; align-items: flex-start;">
        <div>
          <h3 style="margin: 0 0 4px;">${word.english}</h3>
          <div class="badge">${categoryName}</div>
        </div>
        <div class="small-text">Mã: ${word.id}</div>
      </div>
      <p style="margin: 8px 0; font-weight: 600;">${word.vietnamese}</p>
      ${word.note ? `<p class="small-text">${word.note}</p>` : ''}
    `;
    grid.appendChild(card);
  });

  list.appendChild(grid);
}

function bindSearchForm() {
  const form = document.getElementById('search-form');
  const input = document.getElementById('keyword');

  if (!form || !input) return;

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    const keyword = input.value.trim().toLowerCase();
    const allWords = getData('words', []);
    const categories = getData('categories', []);
    const categoriesMap = categories.reduce((acc, cur) => {
      acc[cur.id] = cur.name;
      return acc;
    }, {});

    if (!keyword) {
      renderSearchResults([], categoriesMap);
      return;
    }

    const matches = allWords.filter((item) =>
      item.english.toLowerCase().includes(keyword)
    );

    renderSearchResults(matches, categoriesMap);
  });
}

document.addEventListener('DOMContentLoaded', bindSearchForm);
