(function () {
    angular
        .module('svt')
        .controller('selectionGridEditorCtrl', SelectionGridEditorCtrl);

    SelectionGridEditorCtrl.$inject = [
        '$scope', 'arrayUtilSvc', 'guidUtilSvc', 'selectionGridQuestionSvc',
        'selectionOptionListSvc', 'questionPreviewerSvc', 'questionCarryOverSvc'
    ];

    function SelectionGridEditorCtrl($scope, arrayUtilSvc, guidUtilSvc, selectionGridQuestionSvc,
        selectionOptionListSvc, questionPreviewerSvc, questionCarryOverSvc) {
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.openningOption = { guid: null };
        vm.displayLogicForTopics = {
            isTopic: true,
            canBeAddedOtherQuestion: false,
            maximumOfOptions: null
        };
        vm.displayLogicForOptions = {
            isTopic: false,
            canBeAddedOtherQuestion: false,
            maximumOfOptions: 15
        };
        vm.init = init;
        vm.onOptionTitleChange = onOptionTitleChange;

        init();

        function init() {
            if (!$scope.question.optionList || !arrayUtilSvc.isArrayHasElement($scope.question.optionList.options)) {
                $scope.question.optionList = {
                    $type: 'OptionList',
                    surveyId: $scope.question.surveyId,
                    options: selectionOptionListSvc.buildDefaultOptions($scope.question.surveyId, vm.displayLogicForTopics.isTopic),
                    optionGroups: []
                };
            }

            if (!$scope.question.subQuestionDefinition) {
                $scope.question.subQuestionDefinition = selectionGridQuestionSvc.buildDefaultSubQuestionDefinition($scope.question, $scope.isSingleSelectionGridQuestion);
            }

            setupGuidAndTypeForTopicsAndOptions();
            $scope.question.advancedSettings.isShowTransposed = true;
            questionPreviewerSvc.addReloadCommand($scope.question);

            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var topicsValidationResult = selectionOptionListSvc.validateOptions(
                    $scope.question.id, $scope.question.optionList.options, $scope.question.optionList.optionGroups);
                if (topicsValidationResult.valid === false) {
                    vm.openningOption.guid = topicsValidationResult.optionGuid;
                    callBack(topicsValidationResult);
                } else {
                    var optionsValidationResult = selectionOptionListSvc.validateOptions(
                        $scope.question.id, $scope.question.subQuestionDefinition.optionList.options, $scope.question.subQuestionDefinition.optionList.optionGroups);
                    if (optionsValidationResult.valid === false) {
                        vm.openningOption.guid = optionsValidationResult.optionGuid;
                    }
                    callBack(optionsValidationResult);
                }
            });
        }

        function setupGuidAndTypeForTopicsAndOptions() {
            $scope.question.optionList.options.forEach(function (topic) {
                if (!topic.guid) {
                    topic.guid = 'Topic' + guidUtilSvc.createGuid();
                }
                if (topic.optionsMask && topic.optionsMask.questionId) {
                    topic.isCarryOverOption = true;
                }
            });

            $scope.question.subQuestionDefinition.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Option' + guidUtilSvc.createGuid();
                }
                if (option.optionsMask && option.optionsMask.questionId) {
                    option.isCarryOverOption = true;
                }
            });
        }

        function onOptionTitleChange() {
            var expandTopics = questionCarryOverSvc.getExpandOptions($scope.question.id, $scope.question.optionList.options);
            var topicTitles = expandTopics.map(function (t) {
                return t.text.items[0].text;
            });
            var expandOptions = questionCarryOverSvc.getExpandOptions($scope.question.id, $scope.question.subQuestionDefinition.optionList.options);
            var optionTitles = expandOptions.map(function (o) {
                return o.text.items[0].text;
            });

            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.selectionGrid.content, {
                topicTitles: topicTitles,
                optionTitles: optionTitles,
                transposed: $scope.question.Transposed
            });
        }
    }
})();