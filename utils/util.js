function formatTime(date) {
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();

    var hour = date.getHours();
    var minute = date.getMinutes();
    var second = date.getSeconds();


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString();
    return n[1] ? n : '0' + n
}

function mergeText(obj1, obj2) {
    if (obj1.type == "text" && obj2.type == "text") {
        var tempObj = {
            "type": "text",
            "value": obj1.value + '\n\n' + obj2.value
        };
        return tempObj;
    } else {
        return 'noop';
    }
}

function getArrayindx(key, array, factor) {
    for (var i = 0; i < array.length; i++) {
        if (key == array[i][factor]) {
            return i;
        } else {
            return 0;
        }
    }
}

module.exports = {
    formatTime: formatTime,
    mergeText: mergeText,
    getArrayindx: getArrayindx
};
