(function () {
    angular
        .module('svt')
        .controller('textListQuestionCtrl', TextListQuestionCtrl);

    TextListQuestionCtrl.$inject = [
        '$scope', 'questionSvc', 'questionConst', 'surveyContentValidation'];

    function TextListQuestionCtrl(
        $scope, questionSvc, questionConst, surveyContentValidation) {
        var vm = this;

        init();

        function init() {
            vm.isLongTextListQuestion = $scope.question.$type === questionConst.questionTypes.longTextList;
            vm.topics = $scope.question.optionList && $scope.question.optionList.options ?
                $scope.question.optionList.options : [];
            updateDisplayCarryOverTopics(vm.topics);

            $scope.$watch('question.optionList.referenceDataChanged', function () {
                if ($scope.question.optionList.referenceDataChanged) {
                    updateDisplayCarryOverTopics(vm.topics);
                }
            });
        }

        function updateDisplayCarryOverTopics(topics) {
            topics.forEach(function (topic) {
                if (topic.optionsMask.questionId) {
                    topic.isCarryOver = true;
                    var carryOverError = surveyContentValidation.getCarryOverErrorByOptionId(topic.id);
                    if (carryOverError === undefined) {
                        topic.isCarryOverError = false;
                        topic.carryOverFromQuestionName = questionSvc.getQuestionTitle(topic.optionsMask.questionId);
                    } else {
                        topic.isCarryOverError = true;
                        topic.errorMessage = carryOverError.message;
                    }
                } else {
                    topic.isCarryOver = false;
                }
            });
        }
    }
})();