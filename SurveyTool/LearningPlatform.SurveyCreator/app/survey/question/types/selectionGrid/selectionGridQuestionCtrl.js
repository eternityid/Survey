﻿(function () {
    angular.module('svt').controller('selectionGridQuestionCtrl', selectionGridQuestionCtrl);

    selectionGridQuestionCtrl.$inject = [
        '$scope', 'questionConst', 'questionSvc', 'surveyContentValidation'
    ];

    function selectionGridQuestionCtrl($scope, questionConst, questionSvc, surveyContentValidation) {
        var vm = this;

        vm.isSingleSelectionGridQuestion = $scope.question.$type === questionConst.questionTypes.singleSelectionGrid;

        vm.init = init;

        init();

        function init() {
            vm.rowTitles = [];
            vm.columnTitles = [];
            onChangeQuestion();
            return;

            function onChangeQuestion() {
                $scope.$watch('gridCtrl.question', function () {
                    setupDisplayedTitles();
                }, true);
                $scope.$watch('question.optionList.referenceDataChanged', function () {
                    if ($scope.question.optionList.referenceDataChanged) {
                        setupDisplayedTitles();
                    }
                });
                $scope.$watch('question.subQuestionDefinition.optionList.referenceDataChanged', function () {
                    if ($scope.question.subQuestionDefinition.optionList.referenceDataChanged) {
                        setupDisplayedTitles();
                    }
                });
            }

            function setupDisplayedTitles() {
                vm.rowTitles.splice(0, vm.rowTitles.length);
                vm.columnTitles.splice(0, vm.columnTitles.length);
                vm.columnTitles.push({ value: '', id: '' });

                var i;
                if (!$scope.question.transposed) {
                    $scope.question.optionList.options.forEach(function (t) {
                        vm.rowTitles.push(buildTitle(t));
                    });
                    $scope.question.subQuestionDefinition.optionList.options.forEach(function (t) {
                        vm.columnTitles.push(buildTitle(t));
                    });
                } else {
                    $scope.question.optionList.options.forEach(function (t) {
                        vm.columnTitles.push(buildTitle(t));
                    });
                    $scope.question.subQuestionDefinition.optionList.options.forEach(function (t) {
                        vm.rowTitles.push(buildTitle(t));
                    });
                }
            }

            function buildTitle(option) {
                var title = { id: option.id };

                if (option.optionsMask && option.optionsMask.questionId) {
                    title.carryOver = true;
                    var carryOverError = surveyContentValidation.getCarryOverErrorByOptionId(option.id);
                    if (carryOverError === undefined) {
                        title.isCarryOverError = false;
                        title.value = questionSvc.getQuestionTitle(option.optionsMask.questionId);
                    } else {
                        title.isCarryOverError = true;
                        title.errorMessage = carryOverError.message;
                    }
                } else {
                    title.value = option.text.items[0].text;
                    title.carryOver = false;
                }

                return title;
            }
        }
    }
})();