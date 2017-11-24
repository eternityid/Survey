(function () {
    angular.module('svt').service('serverValidationSvc', ServerValidationSvc);

    function ServerValidationSvc() {
        var service = {
            getServerValidationTypes: getServerValidationTypes
        };
        return service;

        function getServerValidationTypes() {
            return {
                required: 'RequiredValidation',
                length: 'LengthValidation',
                wordsAmount: 'WordsAmountValidation',
                selection: 'SelectionValidation',
                rangeNumber: 'RangeNumberValidation',
                decimalPlacesNumber: 'DecimalPlacesNumberValidation'
            };
        }
    }
})();