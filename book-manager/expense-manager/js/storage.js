/* Hàm tiện ích thao tác với localStorage */
function getData(key, fallback) {
    var data = localStorage.getItem(key);
    if (!data) {
        if (fallback !== undefined) {
            return fallback;
        }
        return [];
    }
    try {
        return JSON.parse(data);
    } catch (error) {
        if (fallback !== undefined) {
            return fallback;
        }
        return [];
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
