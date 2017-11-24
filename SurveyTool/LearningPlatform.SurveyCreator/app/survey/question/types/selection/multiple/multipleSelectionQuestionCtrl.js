﻿(function () {
    angular.module('svt').controller('multipleSelectionQuestionCtrl', MultipleSelectionQuestionCtrl);
    MultipleSelectionQuestionCtrl.$inject = [
        '$scope', 'questionSvc', 'selectionOptionListSvc', 'surveyContentValidation'];

    function MultipleSelectionQuestionCtrl(
        $scope, questionSvc, selectionOptionListSvc, surveyContentValidation) {
        var vm = this;
        init();

        function init() {
            vm.displayOrientationValues = {
                vertical: 0,
                horizontal: 1
            };
            var optionList = $scope.question.optionList;
            vm.optionGroups = optionList && optionList.optionGroups ?
                selectionOptionListSvc.sortOptionGroups(optionList) : [];

            vm.answers = optionList && optionList.options ?
                optionList.options : [];
            updateDisplayCarryOverAnswers(vm.answers);

            $scope.$watch('question.optionList.referenceDataChanged', function () {
                if ($scope.question.optionList.referenceDataChanged) {
                    updateDisplayCarryOverAnswers(vm.answers);
                }
            });
        }

        function updateDisplayCarryOverAnswers(answers) {
            answers.forEach(function (answer) {
                if (answer.optionsMask.questionId) {
                    answer.isCarryOver = true;
                    var carryOverError = surveyContentValidation.getCarryOverErrorByOptionId(answer.id);
                    if (carryOverError === undefined) {
                        answer.isCarryOverError = false;
                        answer.carryOverFromQuestionName = questionSvc.getQuestionTitle(answer.optionsMask.questionId);
                    } else {
                        answer.isCarryOverError = true;
                        answer.errorMessage = carryOverError.message;
                    }
                }
            });
        }
    }
})();