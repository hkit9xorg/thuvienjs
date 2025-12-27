// storage.js - helper functions for localStorage access
// Only uses functions (no classes) per requirements

function getData(key) {
    var raw = localStorage.getItem(key);
    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        return [];
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}
