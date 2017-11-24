

function redirect(url) {
    instance.Redirect(url);
}

function isForward() {
    return instance.IsForward();
}

function contains(array, obj) {
    return instance.Contains(array, obj);
}

function containsString(answer, str) {
    if (answer == undefined || typeof(answer) !== 'string') return false;
    return answer.indexOf(str) !== -1;
}

function greaterThan(answer, val) {
    if (!isNumeric(answer)) return false;
    return answer > val;
}

function greaterThanOrEqual(answer, val) {
    if (!isNumeric(answer)) return false;
    return answer >= val;
}

function lessThan(answer, val) {
    if (!isNumeric(answer)) return false;
    return answer < val;
}

function lessThanOrEqual(answer, val) {
    if (!isNumeric(answer)) return false;
    return answer <= val;
}

function isNumeric(value) {
    if (typeof (value) === 'number') return true;
    if (typeof (value) === 'string') {
        var realValue = value.trim();
        return realValue !== '' && !isNaN(realValue);
    }
    return false;
}