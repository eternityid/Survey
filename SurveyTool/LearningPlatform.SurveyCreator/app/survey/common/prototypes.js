(function () {
    String.prototype.isEmail = function () {
        var regExp = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        var regExpForFirstCharacter = /[0-9a-zA-Z]+$/i;
        return regExp.test(this) && regExpForFirstCharacter.test(this[0]);
    };
})();