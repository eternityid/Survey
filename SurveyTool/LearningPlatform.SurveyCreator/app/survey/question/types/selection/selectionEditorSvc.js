(function () {
    angular.module('svt').service('selectionEditorSvc', SelectionEditorSvc);
    SelectionEditorSvc.$inject = [
        'selectionOptionListSvc', 'surveyContentValidation', 'questionTypeSvc', 'serverValidationSvc',
        'stringUtilSvc', 'numberUtilSvc'
    ];

    function SelectionEditorSvc(
        selectionOptionListSvc, surveyContentValidation, questionTypeSvc, serverValidationSvc,
        stringUtilSvc, numberUtilSvc) {
        var service = {
            validate: validate
        };
        return service;

        function validate(question) {
            var validationResult = selectionOptionListSvc.validateOptions(
                    question.id, question.optionList.options, question.optionList.optionGroups);
            if (validationResult.valid && question.advancedSettings.hasOwnProperty('isUseOptionMask') && question.advancedSettings.isUseOptionMask) {
                if (question.optionsMask.questionId) {
                    var questionMap = surveyContentValidation.getQuestionMapByQuestionId(question.optionsMask.questionId);
                    if (questionMap === null) {
                        setErrorMessage(validationResult, 'Options mask is using non existing question');
                    } else if (!questionTypeSvc.canUseOptionsMaskFrom(questionMap.type)) {
                        setErrorMessage(validationResult, 'Options mask is using unsupported question type');
                    }
                } else {
                    setErrorMessage(validationResult, 'Options mask is missing question');
                }
            }
            if (validationResult.valid) {
                validateSelectionRange(validationResult, question);
            }
            return validationResult;
        }

        function setErrorMessage(result, message) {
            result.valid = false;
            result.message = message;
        }

        function validateSelectionRange(result, question) {
            var validationTypes = serverValidationSvc.getServerValidationTypes();
            var selectionValidation = question.validations.filter(function (validation) {
                return validation.$type === validationTypes.selection;
            })[0];
            if (!selectionValidation) return;
            if (stringUtilSvc.isEmpty(selectionValidation.min) && stringUtilSvc.isEmpty(selectionValidation.max)) return;

            if (stringUtilSvc.isNotEmpty(selectionValidation.min)) {
                if (!numberUtilSvc.isNotNegativeInteger(selectionValidation.min)) {
                    setErrorMessage(result, 'Minimum options selected is invalid');
                    return;
                }
            }
            if (stringUtilSvc.isNotEmpty(selectionValidation.max)) {
                if (!numberUtilSvc.isNotNegativeInteger(selectionValidation.max)) {
                    setErrorMessage(result, 'Maximum options selected is invalid');
                    return;
                }
            }
            if (parseInt(selectionValidation.min) > parseInt(selectionValidation.max)) {
                setErrorMessage(result, 'Minimum options selected should be less than or equal to maximum options selected');
            }
        }
    }
})();