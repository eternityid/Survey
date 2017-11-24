(function () {
    angular.module('svt')
        .service('editQuestionSvc', EditQuestionSvc);
    EditQuestionSvc.$inject = ['surveyErrorConst'];

    function EditQuestionSvc(surveyErrorConst) {
        var ERROR_TYPES = surveyErrorConst.errorTypes;
        var service = {
            isQuestionRemainError: isQuestionRemainError
        };
        return service;

        function isQuestionRemainError(errors, question) {
            if (errors.length === 0) return false;
            return haveCarryOverError() ||
                haveDisplayLogicError() ||
                haveOptionsMaskError();

            function haveCarryOverError() {
                if (!question.optionList || question.optionList.options.length === 0) return false;
                var carryOverErrors = errors.filter(function (error) {
                    return error.type === ERROR_TYPES.carryOver;
                });
                for (var m = 0; m < carryOverErrors.length; m++) {
                    for (var n = 0; n < question.optionList.options.length; n++) {
                        if (carryOverErrors[m].optionId === question.optionList.options[n].id &&
                            question.optionList.options[n].optionsMask &&
                            carryOverErrors[m].carryOverFromQuestionId === question.optionList.options[n].optionsMask.questionId) return true;
                    }
                }
                if (!question.subQuestionDefinition || !question.subQuestionDefinition.optionList) return false;
                for (var p = 0; p < carryOverErrors.length; p++) {
                    for (var q = 0; q < question.subQuestionDefinition.optionList.options.length; q++) {
                        if (carryOverErrors[p].optionId === question.subQuestionDefinition.optionList.options[q].id &&
                            question.subQuestionDefinition.optionList.options[q].optionsMask &&
                            carryOverErrors[p].carryOverFromQuestionId === question.subQuestionDefinition.optionList.options[q].optionsMask.questionId) return true;
                    }
                }
                return false;
            }

            function haveDisplayLogicError() {
                if (!question.questionMaskExpression) return false;
                if (question.advancedSettings && !question.advancedSettings.isUseQuestionMask) return false;
                var displayLogicErrors = errors.filter(function (error) {
                    return error.type === ERROR_TYPES.displayLogic;
                });
                for (var g = 0; g < displayLogicErrors.length; g++) {
                    var error = displayLogicErrors[g];
                    for (var h = 0; h < question.questionMaskExpression.expressionItems.length; h++) {
                        var item = question.questionMaskExpression.expressionItems[h];
                        if (error.expressionItem.guid === item.guid &&
                            error.expressionItem.questionId === item.questionId &&
                            error.expressionItem.optionId === item.optionId &&
                            error.expressionItem.operator === item.operator &&
                            error.expressionItem.value === item.value) return true;
                    }
                }
                return false;
            }

            function haveOptionsMaskError() {
                if (!question.optionsMask) return false;
                if (question.advancedSettings && !question.advancedSettings.isUseOptionMask) return false;
                var optionsMaskErrors = errors.filter(function (error) {
                    return error.type === ERROR_TYPES.optionsMask;
                });
                for (var i = 0; i < optionsMaskErrors.length; i++) {
                    if (optionsMaskErrors[i].optionsMaskQuestionId === question.optionsMask.questionId) return true;
                }
                return false;
            }
        }
    }
})();