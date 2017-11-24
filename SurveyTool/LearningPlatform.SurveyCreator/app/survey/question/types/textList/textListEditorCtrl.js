(function () {
    angular
        .module('svt')
        .controller('textListEditorCtrl', TextListEditorCtrl);

    TextListEditorCtrl.$inject = [
        '$scope', 'arrayUtilSvc', 'guidUtilSvc', 'questionConst',
        'textListQuestionSvc', 'selectionOptionListSvc', 'questionPreviewerSvc'
    ];

    function TextListEditorCtrl(
        $scope, arrayUtilSvc, guidUtilSvc, questionConst,
        textListQuestionSvc, selectionOptionListSvc, questionPreviewerSvc) {
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.openningOption = { guid: null };
        vm.displayLogic = {
            isTopic: true,
            canBeAddedOtherQuestion: false,
            maximumOfOptions: null
        };

        vm.onOptionTitleChange = onOptionTitleChange;
        vm.init = init;

        init();

        function init() {
            vm.isLongTextListQuestion = $scope.question.$type === questionConst.questionTypes.longTextList;

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
            $scope.question.advancedSettings.isShowLengthValidation = true;
            $scope.question.advancedSettings.isShowWordsAmountValidation = true;
            if (vm.isLongTextListQuestion) {
                $scope.question.advancedSettings.isShowSizeValidation = true;
            }

            if (!$scope.question.subQuestionDefinition) {
                $scope.question.subQuestionDefinition = textListQuestionSvc.buildDefaultSubQuestionDefinition($scope.question, vm.isLongTextListQuestion);
            }

            setupGuidAndTypeForTopics();
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var validationResult = textListQuestionSvc.validate($scope.question);
                if (validationResult.valid === false && validationResult.guid) {
                    vm.openningOption.guid = validationResult.optionGuid;
                }
                callBack(validationResult);
            });
        }

        function setupGuidAndTypeForTopics() {
            $scope.question.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Option' + guidUtilSvc.createGuid();
                }
                if (option.optionsMask && option.optionsMask.questionId) {
                    option.isCarryOverOption = true;
                }
            });
        }

        function onOptionTitleChange() {
            var optionTitles = $scope.question.optionList.options.map(function (o) {
                return o.text.items[0].text;
            });

            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.textList.topicTitles, optionTitles);
        }
    }
})();