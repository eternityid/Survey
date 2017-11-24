(function () {
    angular
        .module('svt')
        .controller('ratingGridEditorCtrl', RatingGridEditorCtrl);

    RatingGridEditorCtrl.$inject = [
        '$scope', 'arrayUtilSvc', 'selectionOptionListSvc', 'guidUtilSvc',
        'questionPreviewerSvc', 'ratingQuestionSvc'
    ];

    function RatingGridEditorCtrl($scope, arrayUtilSvc, selectionOptionListSvc, guidUtilSvc,
        questionPreviewerSvc, ratingQuestionSvc) {
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        var existedSubQuestionOptions = null;
        var starShape = {
            value: 'glyphicon glyphicon-star',
            displayName: 'Stars'
        };
        var heartShape = {
            value: 'glyphicon glyphicon-heart',
            displayName: 'Hearts'
        };
        vm.shapes = [starShape, heartShape];
        vm.steps = ratingQuestionSvc.getSteps();
        vm.numberOfSteps = 5;
        vm.openningTopic = { guid: null };
        vm.displayLogic = {
            isTopic: true,
            canBeAddedOtherQuestion: false,
            maximumOfOptions: null
        };

        vm.onTopicTitleChange = onTopicTitleChange;
        vm.getDisplayNameShape = getDisplayNameShape;
        vm.onShapeChange = onShapeChange;
        vm.onStepChange = onStepChange;

        init();

        function init() {
            if (!$scope.question.optionList || !arrayUtilSvc.isArrayHasElement($scope.question.optionList.options)) {
                $scope.question.optionList = {
                    $type: 'OptionList',
                    surveyId: $scope.question.surveyId,
                    options: selectionOptionListSvc.buildDefaultOptions($scope.question.surveyId, vm.displayLogic.isTopic),
                    optionGroups: []
                };
            }

            if (!$scope.question.optionsMask) {
                $scope.question.optionsMask = { $type: 'OptionsMask' };
            }

            if (!$scope.question.subQuestionDefinition) {
                $scope.question.subQuestionDefinition = ratingQuestionSvc.buildDefaultSubQuestionDefinition($scope.question);
            }
            existedSubQuestionOptions = angular.copy($scope.question.subQuestionDefinition.optionList.options);
            vm.numberOfSteps = $scope.question.subQuestionDefinition.optionList.options.length;

            setupGuidAndTypeForTopics();
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var topicsValidationResult = selectionOptionListSvc.validateOptions(
                    $scope.question.id, $scope.question.optionList.options, $scope.question.optionList.optionGroups);
                if (!topicsValidationResult.valid) {
                    vm.openningTopic.guid = topicsValidationResult.optionGuid;
                }
                callBack(topicsValidationResult);
            });
        }

        function setupGuidAndTypeForTopics() {
            $scope.question.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Topic' + guidUtilSvc.createGuid();
                }
                if (option.optionsMask && option.optionsMask.questionId) {
                    option.isCarryOverOption = true;
                }
            });
        }

        function onTopicTitleChange() {
            var topicTitles = $scope.question.optionList.options.map(function (o) {
                return o.text.items[0].text;
            });

            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.ratingGrid.topicTitles, topicTitles);
        }

        function getDisplayNameShape() {
            switch ($scope.question.subQuestionDefinition.shapeName) {
                case starShape.value:
                    return starShape.displayName;
                case heartShape.value:
                    return heartShape.displayName;
                default:
                    return starShape.displayName;
            }
        }

        function onShapeChange(shape) {
            $scope.question.subQuestionDefinition.shapeName = shape.value;
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.ratingGrid.subQuestionContent, {
                steps: vm.numberOfSteps,
                shape: $scope.question.subQuestionDefinition.shapeName
            });
        }

        function onStepChange() {
            $scope.question.subQuestionDefinition.optionList.options = existedSubQuestionOptions ?
                ratingQuestionSvc.buildOptionsBasedOnExistedOptions($scope.question.surveyId, vm.numberOfSteps, existedSubQuestionOptions) :
                ratingQuestionSvc.buildOptions($scope.question.surveyId, vm.numberOfSteps);
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.ratingGrid.subQuestionContent, {
                steps: vm.numberOfSteps,
                shape: $scope.question.subQuestionDefinition.shapeName
            });
        }
    }
})();