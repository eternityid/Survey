(function () {
    angular.module('svt').service('questionAdvanceSettingSvc', QuestionAdvanceSettingSvc);
    QuestionAdvanceSettingSvc.$inject = ['serverValidationSvc', 'questionWithOptionsSvc'];

    function QuestionAdvanceSettingSvc(serverValidationSvc, questionWithOptionsSvc) {
        var service = {
            getDefaultAdvanceSettings: getDefaultAdvanceSettings,
            getDisplayOrientations: getDisplayOrientations,
            fillMissedValidations: fillMissedValidations
        };
        return service;

        function getDefaultAdvanceSettings() {
            return {
                isShowRequired: true,
                isShowKeepFixedPosition: true,
                isShowRenderOptionAsButton: false,
                isShowTransposed: false,
                isShowAlwaysHidden: true,
                isShowOptionSection: false,
                isShowLengthValidation: false,
                isShowWordsAmountValidation: false,
                isShowSizeValidation: false,
                isShowSelectionValidation: false,
                isShowPictureSetting: false,
                isUseOptionMask: false
            };
        }

        function getDisplayOrientations(forSingle) {
            var displayOrientationValues = questionWithOptionsSvc.getOptionDisplayOrientationValues();
            var displayOrientations = [
                { code: displayOrientationValues.vertical, name: 'Vertical' },
                { code: displayOrientationValues.horizontal, name: 'Horizontal' }
            ];
            if (forSingle) {
                displayOrientations.push({ code: displayOrientationValues.dropdown, name: 'Dropdown' });
                displayOrientations.push({ code: displayOrientationValues.dropdownWithFiltering, name: 'Dropdown with filtering' });
            }
            return displayOrientations;
        }

        function fillMissedValidations(validations, questionId) {
            var validationTypes = serverValidationSvc.getServerValidationTypes();
            var existedValidationTypes = validations.map(function (validation) {
                return validation.$type;
            });
            if (existedValidationTypes.indexOf(validationTypes.required) >= 0) {
                var requiredValidaiton = validations.filter(function (validation) {
                    return validation.$type === validationTypes.required;
                })[0];
                if (requiredValidaiton && requiredValidaiton.hasOwnProperty('selected') === false) {
                    requiredValidaiton.selected = true;
                }
            }
            Object.keys(validationTypes).forEach(function (key) {
                var type = validationTypes[key];
                if (existedValidationTypes.indexOf(type) >= 0) return;
                switch (type) {
                    case validationTypes.required:
                        validations.push({
                            $type: validationTypes.required,
                            questionDefinitionId: questionId,
                            selected: false
                        });
                        break;
                    case validationTypes.length:
                    case validationTypes.wordsAmount:
                    case validationTypes.selection:
                        validations.push({
                            $type: type,
                            questionDefinitionId: questionId,
                            min: '',
                            max: ''
                        });
                        break;
                    case validationTypes.rangeNumber:
                        validations.push({
                            $type: type,
                            questionDefinitionId: questionId,
                            min: '',
                            max: ''
                        });
                        break;
                    case validationTypes.decimalPlacesNumber:
                        validations.push({
                            $type: type,
                            questionDefinitionId: questionId,
                            decimalPlaces: ''
                        });
                        break;
                    default:
                }
            });

            return validations;
        }
    }
})();