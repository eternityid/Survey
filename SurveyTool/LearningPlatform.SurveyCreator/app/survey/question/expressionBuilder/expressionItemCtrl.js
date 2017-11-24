(function () {
    angular.module('svt').controller('expressionItemCtrl', expressionItemCtrl);

    expressionItemCtrl.$inject = [
        '$scope', 'settingConst', 'expressionBuilderSvc', 'questionTypeSvc', 'arrayUtilSvc'];

    function expressionItemCtrl(
        $scope, settingConst, expressionBuilderSvc, questionTypeSvc, arrayUtilSvc) {
        var vm = this;

        var LOGICAL_OPERATORS = $scope.builder.operators;
        var QUESTION_TYPE = settingConst.questionTypes;
        vm.questionTypesConst = QUESTION_TYPE;
        vm.isQuestionTypeNPSLikertRating = questionTypeSvc.isQuestionTypeNPSLikertRating;
        vm.onQuestionChange = onQuestionChange;
        vm.onOperatorChanged = onOperatorChanged;
        vm.onOptionChanged = onOptionChanged;
        vm.onOptionValueChange = onOptionValueChange;

        vm.init = init;
        init();

        function init() {
            if ($scope.item.questionId) {
                vm.onQuestionChange($scope.item, false);
            }
        }

        function onQuestionChange(item, isByChangeType) {
            var selectedQuestion = expressionBuilderSvc.getSelectedQuestion($scope.builder.questions, item.questionId);
            if (!selectedQuestion) return;

            $scope.item.selectedQuestion = selectedQuestion;
            $scope.item.questionType = selectedQuestion.questionType;
            $scope.item.isQuestionHasOptions = questionTypeSvc.isQuestionTypeHasOptions(selectedQuestion.questionType);
            var isNPSLikertRating = questionTypeSvc.isQuestionTypeNPSLikertRating(selectedQuestion.questionType);
            if ($scope.item.isQuestionHasOptions && isByChangeType) {
                $scope.item.optionId = isNPSLikertRating ? null : $scope.item.selectedQuestion.options[0].id;
            }
            if (!isByChangeType) return;

            if ($scope.item.isQuestionHasOptions) {
                if (isNPSLikertRating) {
                    $scope.item.operator = LOGICAL_OPERATORS.forNumericQuestion[0].value;
                    $scope.item.value = selectedQuestion.options[0].text;
                } else {
                    $scope.item.operator = LOGICAL_OPERATORS.forSelectionQuestion[0].value;
                    $scope.item.value = null;
                }
            } else {
                $scope.item.operator = selectedQuestion.questionType === QUESTION_TYPE.NumericQuestionDefinition.value ?
                    LOGICAL_OPERATORS.forNumericQuestion[0].value :
                    LOGICAL_OPERATORS.forOpenTextQuestion[0].value;
                $scope.item.value = '';
            }
            $scope.$emit('event:DetectSkipCommandEditorError');
        }

        function onOperatorChanged() {
            $scope.$emit('event:DetectSkipCommandEditorError');
        }

        function onOptionChanged() {
            $scope.$emit('event:DetectSkipCommandEditorError');
        }

        function onOptionValueChange(value) {
            var selectedQuestion = $scope.item.selectedQuestion;
            var options = selectedQuestion && selectedQuestion.options;
            var option = arrayUtilSvc.getItem(options, function (opt) {
                if (opt.text === value) return opt;
            });
            $scope.item.optionId = option && option.id;
            $scope.$emit('event:DetectSkipCommandEditorError');
        }
    }
})();