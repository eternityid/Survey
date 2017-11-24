(function () {
    'use strict';

    angular
        .module('svt')
        .controller('generalSettingCtrl', generalSettingCtrl);

    generalSettingCtrl.$inject = [
        '$scope', '$modal', '$rootScope',
        'questionEditorSvc', 'surveyEditorSvc', 'questionCarryOverSvc',
        'questionPreviewerSvc', 'questionAdvanceSettingSvc', 'questionConst',
        'questionHistoryManagerSvc', 'settingConst', 'stringUtilSvc'
    ];

    function generalSettingCtrl(
        $scope, $modal, $rootScope,
        questionEditorSvc, surveyEditorSvc, questionCarryOverSvc,
        questionPreviewerSvc, questionAdvanceSettingSvc, questionConst,
        questionHistoryManagerSvc, settingConst, stringUtilSvc) {
        /* jshint -W040 */
        var vm = this;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey ? survey.customColumns : null;

        vm.questionTypes = questionConst.questionTypes;
        vm.updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.selectedQuestionType = $scope.question.$type; // use for processing change question type
        vm.isEditMode = $scope.mode === 'edit';
        vm.surveyEditorData = surveyEditorSvc.getData();
        vm.maxlengthQuestionAlias = settingConst.question.alias.maxlength;

        //Setup data for ckeditor
        questionEditorSvc.setSvtPlaceholderQuestionItems($scope.question.id);
        vm.placeholderQuestionItems = questionEditorSvc.getSvtPlaceholderQuestionItems();
        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.ckeditorConfig = {
            questionTitle: {
                extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder,svtinsertfromfilelibrary',
                required: true,
                toolbarType: 'short',
                placeholder: {
                    value: "Untitled form",
                    valid: true
                },
                svtData: {
                    placeholderQuestionItems: vm.placeholderQuestionItems,
                    placeholderRespondentItems: vm.placeholderRespondentItems
                }
            },
            questionDescription: {
                extraPlugins: 'sourcedialog,svtinserthelper,svtquestionplaceholder,svtrespondentplaceholder,svtinsertfromfilelibrary',
                toolbarType: 'short',
                svtData: {
                    placeholderQuestionItems: vm.placeholderQuestionItems,
                    placeholderRespondentItems: vm.placeholderRespondentItems
                }
            }
        };

        vm.onQuestionTypeChange = onQuestionTypeChange;
        vm.onQuestionTitleChange = onQuestionTitleChange;
        vm.onQuestionDescriptionChange = onQuestionDescriptionChange;

        init();

        function init() {

            $scope.question.advancedSettings = questionAdvanceSettingSvc.getDefaultAdvanceSettings();
            vm.questionsWithOptions = questionCarryOverSvc.getAvailableCarryOverQuestions();

            $scope.$on('$destroy', function () {
                questionHistoryManagerSvc.clearHistories();
            });
        }

        function onQuestionTypeChange() {
            var validationResult = questionEditorSvc.getValidationMessageWhenChangingQuestionType(angular.copy($scope.question), vm.selectedQuestionType);
            if (validationResult.willBeAffectedOther === false) {
                changeQuestionType();
                return;
            }

            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                resolve: {
                    modalData: function () {
                        return {
                            message: validationResult.message,
                            modalTitle: 'Change Question Type Confirmation',
                            okTitle: 'Change'
                        };
                    }
                }
            }).result.then(function (result) {
                if (result.status) {
                    changeQuestionType();
                }
            }, function () {
                vm.selectedQuestionType = $scope.question.$type;
                $rootScope.$broadcast('questionTypeChange', vm.selectedQuestionType);
            });

            function changeQuestionType() {
                questionHistoryManagerSvc.updateQuestionHistory($scope.question);
                angular.copy(questionHistoryManagerSvc.setupQuestionAfterChangingType(vm.selectedQuestionType, $scope.question), $scope.question);
                angular.extend($scope.question.advancedSettings, questionAdvanceSettingSvc.getDefaultAdvanceSettings());
                $rootScope.$broadcast('event:ReInitializeAdvancedSettings');
            }
        }

        function onQuestionTitleChange() {
            var questionTitle = $scope.question.title.items[0].text;
            questionTitle = standardizeQuestionTitle(questionTitle);
            questionPreviewerSvc.addOrUpdateUpdatingCommand(vm.updatingCommandTypes.questionTitle, questionTitle);

            function standardizeQuestionTitle(questionTitle) {
                var standardizedQuestionTitle = stringUtilSvc.removeHTMLParagraphTag(questionTitle);
                standardizedQuestionTitle = stringUtilSvc.removeHTMLBreakTag(standardizedQuestionTitle);
                return stringUtilSvc.addHTMLParagraphTagWrapper(standardizedQuestionTitle);
            }
        }

        function onQuestionDescriptionChange() {
            questionPreviewerSvc.addOrUpdateUpdatingCommand(vm.updatingCommandTypes.questionDescription, $scope.question.description.items[0].text);
        }
    }
})();
