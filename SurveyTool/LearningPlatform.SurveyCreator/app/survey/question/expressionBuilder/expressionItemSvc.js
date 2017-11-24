(function () {
    angular.module('svt')
        .service('expressionItemSvc', ExpressionItemSvc);
    ExpressionItemSvc.$inject = [
        'questionConst', 'numberUtilSvc', 'surveyContentValidation', 'questionTypeSvc',
        'expressionOperatorSvc'];

    function ExpressionItemSvc(
        questionConst, numberUtilSvc, surveyContentValidation, questionTypeSvc,
        expressionOperatorSvc) {
        var QUESTION_TYPES = questionConst.questionTypes;
        var service = {
            validateExpressionItemsInGroup: validateExpressionItemsInGroup
        };
        return service;

        function validateExpressionItemsInGroup(itemsInGroup) {
            var numOfItems = itemsInGroup.length;
            var minimumItemsInGroup = 2;
            var indexOfLastItemInGroup = numOfItems - 1;

            if (numOfItems < minimumItemsInGroup) return false;
            for (var k = 1; k < numOfItems; k++) {
                var item = itemsInGroup[k];

                if (!validateExpressionItem(item, (k === indexOfLastItemInGroup))) return false;
            }

            return true;

            function validateExpressionItem(expressionItem, isLastExpressionItem) {
                return validateLogicalOperator() &&
                    validateQuestionAndOption() &&
                    validateOperator() &&
                    validateValue();

                function validateLogicalOperator() {
                    if (isLastExpressionItem) {
                        if (expressionItem.logicalOperator !== null) return false;
                    } else {
                        if (expressionItem.logicalOperator === undefined || expressionItem.logicalOperator === null) return false;
                    }
                    return true;
                }

                function validateQuestionAndOption() {
                    if (!expressionItem.questionId) return false;
                    var questionMap = surveyContentValidation.getQuestionMapByQuestionId(expressionItem.questionId);
                    if (!questionMap || !questionTypeSvc.canUseExpressionItemFrom(questionMap.type)) return false;
                    if (questionTypeSvc.isQuestionTypeHasOptions(questionMap.type) && !questionTypeSvc.isQuestionTypeNPSLikertRating(questionMap.type)) {
                        if (!expressionItem.optionId) return false;
                        if (questionMap.optionIds.indexOf(expressionItem.optionId) < 0) return false;
                    }
                    return true;
                }

                function validateOperator() {
                    if (expressionItem.operator === undefined || expressionItem.operator === null) return false;
                    var operators = expressionOperatorSvc.getOperatorsByQuestionType(expressionItem.questionType);
                    if (!operators) return false;
                    var valid = operators.some(function (operator) {
                        return operator.value === expressionItem.operator;
                    });
                    return valid;
                }

                function validateValue() {
                    var valid = true;
                    switch (expressionItem.questionType) {
                        case QUESTION_TYPES.numeric:
                        case QUESTION_TYPES.netPromoterScore:
                        case QUESTION_TYPES.scale:
                        case QUESTION_TYPES.rating:
                            valid = numberUtilSvc.isNumeric(expressionItem.value);
                            break;
                        case QUESTION_TYPES.singleSelection:
                        case QUESTION_TYPES.multipleSelection:
                        case QUESTION_TYPES.pictureSingleSelection:
                        case QUESTION_TYPES.pictureMultipleSelection:
                            valid = expressionItem.optionId !== null;
                            break;
                        default:
                            break;
                    }
                    return valid;
                }
            }
        }
    }
})();