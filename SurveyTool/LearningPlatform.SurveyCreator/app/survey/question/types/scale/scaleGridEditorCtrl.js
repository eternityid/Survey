(function () {
    angular
        .module('svt')
        .controller('scaleGridEditorCtrl', scaleGridEditorCtrl);

    scaleGridEditorCtrl.$inject = [
        '$scope', 'questionPreviewerSvc', 'arrayUtilSvc', 'selectionOptionListSvc',
        'scaleQuestionSvc', 'guidUtilSvc', 'questionEditorSvc', 'surveyEditorSvc'
    ];

    function scaleGridEditorCtrl($scope, questionPreviewerSvc, arrayUtilSvc, selectionOptionListSvc,
        scaleQuestionSvc, guidUtilSvc, questionEditorSvc, surveyEditorSvc) {
        /* jshint -W040 */
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        var existedSubQuestionOptions = null;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.min = 1;
        vm.max = 10;
        vm.validationResult = {
            valid: true,
            message: ''
        };
        vm.openningTopic = { guid: null };
        vm.displayLogic = {
            isTopic: true,
            canBeAddedOtherQuestion: false,
            maximumOfOptions: null
        };

        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.ckeditorLikertTextConfig = {
            extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder,svtinsertfromfilelibrary',
            toolbarType: 'short',
            svtData: {
                placeholderQuestionItems: questionEditorSvc.getSvtPlaceholderQuestionItems(),
                placeholderRespondentItems: vm.placeholderRespondentItems
            }
        };

        vm.onTopicTitleChange = onTopicTitleChange;
        vm.onScoreChange = onScoreChange;
        vm.onLikertTextChange = onLikertTextChange;
        vm.question = $scope.question;
        vm.question.advancedSettings.isShowRenderOptionAsButton = true;
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
                $scope.question.subQuestionDefinition = scaleQuestionSvc.buildDefaultSubQuestionDefinition($scope.question);
            }
            existedSubQuestionOptions = angular.copy($scope.question.subQuestionDefinition.optionList.options);

            var score = scaleQuestionSvc.getScoreByOptionList($scope.question.subQuestionDefinition.optionList);
            vm.min = score.min;
            vm.max = score.max;

            setupGuidAndTypeForTopics();
            questionPreviewerSvc.addReloadCommand($scope.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                var topicsValidationResult = selectionOptionListSvc.validateOptions(
                    $scope.question.id, $scope.question.optionList.options, $scope.question.optionList.optionGroups);
                if (!topicsValidationResult.valid) {
                    vm.openningTopic.guid = topicsValidationResult.optionGuid;
                    callBack(topicsValidationResult);
                    return;
                }

                callBack(scaleQuestionSvc.validate(vm.min, vm.max));
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

            $scope.question.subQuestionDefinition.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Option' + guidUtilSvc.createGuid();
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

            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.scaleGrid.topicTitles, topicTitles);
        }

        function onScoreChange() {
            vm.validationResult = scaleQuestionSvc.validate(vm.min, vm.max);
            if (vm.validationResult.valid) {
                $scope.question.subQuestionDefinition.optionList.options = existedSubQuestionOptions ?
                    scaleQuestionSvc.buildOptionsBasedOnExistedOptions(vm.min, vm.max, existedSubQuestionOptions) :
                    scaleQuestionSvc.buildOptions(vm.min, vm.max);
                setupGuidAndTypeForTopics();
                questionPreviewerSvc.addReloadCommand($scope.question);
            }
        }

        function onLikertTextChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.scaleGrid.likertText, [
                $scope.question.subQuestionDefinition.likertLeftText.items[0].text,
                $scope.question.subQuestionDefinition.likertCenterText.items[0].text,
                $scope.question.subQuestionDefinition.likertRightText.items[0].text
            ]);
        }
    }
})();