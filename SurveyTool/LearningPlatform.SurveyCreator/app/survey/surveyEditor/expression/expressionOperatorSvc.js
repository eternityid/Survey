(function () {
    angular.module('svt').service('expressionOperatorSvc', ExpressionOperatorSvc);
    ExpressionOperatorSvc.$inject = ['expressionBuilderConst', 'questionConst'];

    function ExpressionOperatorSvc(expressionBuilderConst, questionConst) {
        var QUESTION_TYPES = questionConst.questionTypes;
        var service = {
            getExpressionLogicalOperators: getExpressionLogicalOperators,
            getExpressionOperators: getExpressionOperators,
            getOperatorsByQuestionType: getOperatorsByQuestionType
        };
        return service;

        function getExpressionLogicalOperators() {
            return [
                expressionBuilderConst.logicalOperators.and,
                expressionBuilderConst.logicalOperators.or
            ];
        }

        function getExpressionOperators() {
            return {
                forOpenTextQuestion: getOperatorsForOpenTextQuestion(),
                forNumericQuestion: getOperatorsForNumericQuestion(),
                forSelectionQuestion: getOperatorsForSelectionQuestion()
            };

            function getOperatorsForOpenTextQuestion() {
                return [
                    expressionBuilderConst.operators.isEqual,
                    expressionBuilderConst.operators.isNotEqual,
                    expressionBuilderConst.operators.contains,
                    expressionBuilderConst.operators.notContains
                ];
            }

            function getOperatorsForNumericQuestion() {
                return [
                    expressionBuilderConst.operators.isEqual,
                    expressionBuilderConst.operators.isNotEqual,
                    expressionBuilderConst.operators.greaterThan,
                    expressionBuilderConst.operators.greaterThanOrEqual,
                    expressionBuilderConst.operators.lessThan,
                    expressionBuilderConst.operators.lessThanOrEqual
                ];
            }

            function getOperatorsForSelectionQuestion() {
                return [
                    expressionBuilderConst.operators.isSelected,
                    expressionBuilderConst.operators.isNotSelected
                ];
            }
        }

        function getOperatorsByQuestionType(type) {
            var operatorGroups = getExpressionOperators();
            var operators = null;

            switch (type) {
                case QUESTION_TYPES.numeric:
                case QUESTION_TYPES.netPromoterScore:
                case QUESTION_TYPES.scale:
                case QUESTION_TYPES.rating:
                    operators = operatorGroups.forNumericQuestion;
                    break;
                case QUESTION_TYPES.singleSelection:
                case QUESTION_TYPES.multipleSelection:
                case QUESTION_TYPES.pictureSingleSelection:
                case QUESTION_TYPES.pictureMultipleSelection:
                    operators = operatorGroups.forSelectionQuestion;
                    break;
                case QUESTION_TYPES.shortText:
                case QUESTION_TYPES.longText:
                    operators = operatorGroups.forOpenTextQuestion;
                    break;
                default:
                    break;
            }
            return operators;
        }
    }
})();