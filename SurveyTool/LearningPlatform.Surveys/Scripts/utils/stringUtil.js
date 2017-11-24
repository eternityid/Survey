var StringUtil = (function () {
    return {
        formatByArray: formatByArray,
        isEmpty: isEmpty,
        getPlainText: getPlainText,
        countWords: countWords
    };

    function formatByArray(template, values) {
        if (!values) return template;
        var returnValue = template;
        values.forEach(function (value, index) {
            returnValue = returnValue.replace(
                new RegExp("\\{" + index + "\\}", "g"), value);
        });
        return returnValue;
    }

    function isEmpty(value) {
        return value === null || value === undefined || 0 === String(value).trim().length;
    }

    function getPlainText(sourceValue) {
        var tempValue = sourceValue;
        if (!tempValue) return '';

        return tempValue.replace(/<[^>]+>/gm, '').replace(/&nbsp;/g, ' ').replace(/(?:\r\n|\r|\n)/g, ' ');
    }

    function countWords(value) {
        value = value.replace(/(^\s*)|(\s*$)/gi, "");
        value = value.replace(/[ ]{2,}/gi, " ");
        value = value.replace(/\n /, "\n");
        return value.split(' ').length;
    }
})();