(function () {
    angular
        .module('svt')
        .controller('netPromoterScoreEditorCtrl', NetPromoterScoreEditorCtrl);

    NetPromoterScoreEditorCtrl.$inject = [
        '$scope', 'netPromoterScoreQuestionSvc', 'questionPreviewerSvc', 'languageStringUtilSvc',
        'questionWithOptionsSvc', 'guidUtilSvc', 'questionEditorSvc', 'surveyEditorSvc'
    ];

    function NetPromoterScoreEditorCtrl(
        $scope, netPromoterScoreQuestionSvc, questionPreviewerSvc, languageStringUtilSvc,
        questionWithOptionsSvc, guidUtilSvc, questionEditorSvc, surveyEditorSvc) {
        /* jshint -W040 */
        var vm = this;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        var updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.question = $scope.question;

        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.ckeditorLikertTextConfig = {
            extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder,svtinsertfromfilelibrary',
            oneLineMode: true,
            toolbarType: 'short',
            svtData: {
                placeholderQuestionItems: questionEditorSvc.getSvtPlaceholderQuestionItems(),
                placeholderRespondentItems: vm.placeholderRespondentItems
            }
        };

        vm.onLikertTextChange = onLikertTextChange;
        vm.init = init;

        init();

        function init() {
            var surveyId = vm.question.surveyId;

            if (!vm.question.optionList) {
                vm.question.optionList = {
                    $type: 'OptionList',
                    surveyId: surveyId,
                    options: netPromoterScoreQuestionSvc.buildDefaultOptions(surveyId),
                    optionGroups: []
                };
            }

            if (!vm.question.title) {
                vm.question.title = languageStringUtilSvc.buildLanguageString(
                    surveyId, '<p>On a scale from 0-10, how likely are you to recommend [INSERT COMPANY NAME HERE] to a friend or colleague?</p>');
            } else if (vm.question.title.items[0].text === '') {
                vm.question.title.items[0].text = '<p>On a scale from 0-10, how likely are you to recommend [INSERT COMPANY NAME HERE] to a friend or colleague?</p>';
            }
            vm.question.likertLeftText = vm.question.likertLeftText || languageStringUtilSvc.buildLanguageString(surveyId, '<p>Not at all likely</p>');
            vm.question.likertRightText = vm.question.likertRightText || languageStringUtilSvc.buildLanguageString(surveyId, '<p>Extremely likely</p>');

            if (!vm.question.hasOwnProperty('optionsMask'))
                vm.question.optionsMask = questionWithOptionsSvc.getDefaultOptionsMask();
            if (!vm.question.hasOwnProperty('displayOrientation'))
                vm.question.displayOrientation = questionWithOptionsSvc.getOptionDisplayOrientationValues().horizontal;
            vm.question.advancedSettings.isShowRenderOptionAsButton = true;

            setupGuidAndTypeForOptions();
            questionPreviewerSvc.addReloadCommand(vm.question);
            $scope.$on('event:DoneEditQuestion', function (evt, callBack) {
                callBack({ valid: true, message: '' });
            });
        }

        function onLikertTextChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(updatingCommandTypes.netPromoterScore.content, {
                leftText: vm.question.likertLeftText.items[0].text,
                rightText: vm.question.likertRightText.items[0].text
            });
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