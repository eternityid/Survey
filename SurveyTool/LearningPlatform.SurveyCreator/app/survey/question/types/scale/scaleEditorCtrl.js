(function () {
    angular.module('svt').controller('scaleEditorCtrl', scaleEditorCtrl);

    scaleEditorCtrl.$inject = [
        '$scope', 'scaleQuestionSvc', 'languageStringUtilSvc', 'questionPreviewerSvc',
        'questionWithOptionsSvc', 'guidUtilSvc', 'questionEditorSvc', 'surveyEditorSvc'
    ];

    function scaleEditorCtrl(
        $scope, scaleQuestionSvc, languageStringUtilSvc, questionPreviewerSvc,
        questionWithOptionsSvc, guidUtilSvc, questionEditorSvc, surveyEditorSvc) {
        /* jshint -W040 */
        var vm = this;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        var existedOptions = null;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.min = 1;
        vm.max = 5;
        vm.validationResult = {
            valid: true,
            message: ''
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

        vm.onScoreChange = onScoreChange;
        vm.onLikertTextChange = onLikertTextChange;
        vm.question = $scope.question;

        init();

        function init() {
            var surveyId = vm.question.surveyId;
            var score = scaleQuestionSvc.getScoreByOptionList(vm.question.optionList);

            vm.min = score.min;
            vm.max = score.max;
            if (vm.question.optionList) {
                existedOptions = vm.question.optionList.options;
                setupGuidAndTypeForOptions();
            } else {
                vm.question.optionList = {
                    $type: 'OptionList',
                    surveyId: surveyId,
                    options: [],
                    optionGroups: []
                };
                buildOptions();
            }

            vm.question.likertLeftText = vm.question.likertLeftText || languageStringUtilSvc.buildLanguageString(surveyId);
            vm.question.likertCenterText = vm.question.likertCenterText || languageStringUtilSvc.buildLanguageString(surveyId);
            vm.question.likertRightText = vm.question.likertRightText || languageStringUtilSvc.buildLanguageString(surveyId);

            if (!vm.question.hasOwnProperty('optionsMask'))
                vm.question.optionsMask = questionWithOptionsSvc.getDefaultOptionsMask();
            if (!vm.question.hasOwnProperty('displayOrientation'))
                vm.question.displayOrientation = questionWithOptionsSvc.getOptionDisplayOrientationValues().horizontal;
            vm.question.advancedSettings.isShowRenderOptionAsButton = true;

            questionPreviewerSvc.addReloadCommand(vm.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack(scaleQuestionSvc.validate(vm.min, vm.max));
            });
        }

        function onScoreChange() {
            vm.validationResult = scaleQuestionSvc.validate(vm.min, vm.max);
            if (vm.validationResult.valid === true) {
                buildOptions();
                questionPreviewerSvc.addReloadCommand(vm.question);
            }
        }

        function onLikertTextChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.scale.content, {
                leftText: vm.question.likertLeftText.items[0].text,
                centerText: vm.question.likertCenterText.items[0].text,
                rightText: vm.question.likertRightText.items[0].text
            });
        }

        function buildOptions() {
            vm.question.optionList.options = existedOptions ?
                scaleQuestionSvc.buildOptionsBasedOnExistedOptions(vm.min, vm.max, existedOptions) :
                scaleQuestionSvc.buildOptions(vm.min, vm.max);
            setupGuidAndTypeForOptions();
        }

        function setupGuidAndTypeForOptions() {
            vm.question.optionList.options.forEach(function (option) {
                if (!option.guid) {
                    option.guid = 'Option' + guidUtilSvc.createGuid();
                }
                if (option.optionsMask && option.optionsMask.questionId) {
                    option.isCarryOverOption = true;
                }
            });
        }
    }
})();