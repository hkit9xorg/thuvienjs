// Common storage helpers for localStorage
function getData(key) {
    var raw = localStorage.getItem(key);
    if (!raw) {
        return [];
    }
    try {
        return JSON.parse(raw);
    } catch (e) {
        console.error('Invalid data for key:', key);
        return [];
    }
}

function setData(key, value) {
    localStorage.setItem(key, JSON.stringify(value));
}

function addLog(action, entity, message) {
    var logs = getData('logs');
    logs.push({
        id: Date.now(),
        action: action,
        entity: entity,
        message: message,
        date: new Date().toISOString()
    });
    setData('logs', logs);
}
