(function() {
    angular.module('svt').factory('numberUtilSvc', numberUtilSvc);
    numberUtilSvc.$inject = [];

    function numberUtilSvc() {
        var service = {
            isInteger: isInteger,
            isNotNegativeInteger: isNotNegativeInteger,
            isNumeric: isNumeric,
            convertIntegerToAlphabet: convertIntegerToAlphabet,
            compareNumbers: compareNumbers,
            getNumberValueOrNA: getNumberValueOrNA
        };
        return service;

        function isInteger(value) {
            var newValue = '' + value;
            return ('' + parseInt(value)) === newValue;
        }

        function isNotNegativeInteger(value) {
            return isInteger(value) && value >= 0;
        }

        function isNumeric(value) {
            if (typeof (value) === 'number') return true;
            if (typeof (value) === 'string') {
                var realValue = value.trim();
                return realValue !== '' && !isNaN(realValue);
            }
            return false;
        }

        function convertIntegerToAlphabet(intValue) {
            var alphabetLength = 26,
                asciiOfA = 65;
            if (Math.floor(intValue / alphabetLength) === 0) {
                return String.fromCharCode(asciiOfA + intValue % alphabetLength);
            }
            return convertIntegerToAlphabet(Math.floor(intValue / alphabetLength) - 1) +
                String.fromCharCode(asciiOfA + intValue % alphabetLength);
        }

        function compareNumbers(firstNumb, secondNumb) {
            var first = typeof (firstNumb) === 'string' ? parseInt(firstNumb) : firstNumb;
            var second = typeof (secondNumb) === 'string' ? parseInt(secondNumb) : secondNumb;
            if (first > second) return 1;
            else if (first < second) return -1;
            else return 0;
        }

        function getNumberValueOrNA(value) {
            return value === null ? "N/A" : value;
        }
    }
})();