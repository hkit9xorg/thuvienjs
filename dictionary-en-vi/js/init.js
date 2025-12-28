const DEFAULT_CATEGORIES = [
  { id: 'noun', name: 'Noun (Danh từ)' },
  { id: 'verb', name: 'Verb (Động từ)' },
  { id: 'adjective', name: 'Adjective (Tính từ)' },
  { id: 'adverb', name: 'Adverb (Trạng từ)' }
];

const DEFAULT_WORDS = [
  {
    id: 'w1',
    english: 'apple',
    vietnamese: 'quả táo',
    categoryId: 'noun',
    note: 'A common fruit'
  },
  {
    id: 'w2',
    english: 'run',
    vietnamese: 'chạy',
    categoryId: 'verb',
    note: 'Move fast on foot'
  },
  {
    id: 'w3',
    english: 'beautiful',
    vietnamese: 'đẹp',
    categoryId: 'adjective',
    note: 'Pleasing the senses or mind'
  },
  {
    id: 'w4',
    english: 'quickly',
    vietnamese: 'nhanh chóng',
    categoryId: 'adverb',
    note: 'With speed'
  }
];

function ensureInitialData() {
  const categories = getData('categories');
  const words = getData('words');

  if (!Array.isArray(categories) || categories.length === 0) {
    setData('categories', DEFAULT_CATEGORIES);
  }

  if (!Array.isArray(words) || words.length === 0) {
    setData('words', DEFAULT_WORDS);
  }
}

document.addEventListener('DOMContentLoaded', ensureInitialData);
