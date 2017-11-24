(function () {
    angular
        .module('svt')
        .controller('scaleGridQuestionCtrl', scaleGridQuestionCtrl);

    scaleGridQuestionCtrl.$inject = [
        '$scope', 'questionSvc', 'surveyContentValidation'];

    function scaleGridQuestionCtrl(
        $scope, questionSvc, surveyContentValidation) {
        var vm = this;

        init();

        function init() {
            vm.rowTitles = [];
            vm.columnTitles = [];
            onChangeQuestion();
            return;

            function onChangeQuestion() {
                $scope.$watch('gridCtrl.question', setupDisplayedTitles, true);
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

                $scope.question.optionList.options.forEach(function (option) {
                    vm.rowTitles.push(buildTitle(option));
                });
                $scope.question.subQuestionDefinition.optionList.options.forEach(function (subOption) {
                    vm.columnTitles.push(buildTitle(subOption));
                });
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