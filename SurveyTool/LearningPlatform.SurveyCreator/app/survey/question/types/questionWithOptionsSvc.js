(function () {
    angular.module('svt').service('questionWithOptionsSvc', QuestionWithOptionsSvc);
    function QuestionWithOptionsSvc() {
        var optionDisplayOrientationValues = {
            vertical: 0,
            horizontal: 1,
            dropdown: 2,
            dropdownWithFiltering: 3
        };
        var servive = {
            getDefaultOptionsMask: getDefaultOptionsMask,
            getOptionDisplayOrientationValues: getOptionDisplayOrientationValues
        };
        return servive;

        function getDefaultOptionsMask() {
            return {
                $type: 'OptionsMask',
                questionId: null,
                optionsMaskType: null,
                customOptionsMask: null
            };
        }

        function getOptionDisplayOrientationValues() {
            return optionDisplayOrientationValues;
        }
    }
})();