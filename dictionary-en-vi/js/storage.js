function getData(key, fallback = []) {
  const raw = localStorage.getItem(key);
  if (!raw) return JSON.parse(JSON.stringify(fallback));
  try {
    return JSON.parse(raw);
  } catch (error) {
    console.warn(`Dữ liệu key "${key}" không hợp lệ, trả về fallback.`, error);
    return JSON.parse(JSON.stringify(fallback));
  }
}

function setData(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}
