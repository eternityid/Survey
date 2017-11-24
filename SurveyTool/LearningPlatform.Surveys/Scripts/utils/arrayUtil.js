var ArrayUtil = (function () {
    return {
        hasValueIn: hasValueIn
    };

    function hasValueIn(array, value) {
        return array.some(function (item) {
            return item === value;
        });
    }
})();