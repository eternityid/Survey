(function () {
    angular
        .module('svt')
        .controller('editQuestionCtrl', editQuestionCtrl);

    editQuestionCtrl.$inject = [
        '$scope', '$rootScope', 'questionSvc', 'questionValidationSvc',
        'questionDataSvc', 'pageSvc', 'errorHandlingSvc', 'surveyEditorSvc',
        'surveyEditorQuestionSvc', 'settingConst', '$modal', 'questionEditorSvc',
        'animateSvc', 'questionCarryOverSvc', 'constantSvc', 'indexSvc',
        'spinnerUtilSvc', 'questionPreviewerSvc', 'guidUtilSvc', 'questionConst',
        'questionAdvanceSettingSvc', 'questionHistoryManagerSvc', 'surveyContentValidation',
        'editQuestionSvc', 'stringUtilSvc'
    ];

    function editQuestionCtrl(
        $scope, $rootScope, questionSvc, questionValidationSvc,
        questionDataSvc, pageSvc, errorHandlingSvc, surveyEditorSvc,
        surveyEditorQuestionSvc, settingConst, $modal, questionEditorSvc,
        animateSvc, questionCarryOverSvc, constantSvc, indexSvc,
        spinnerUtilSvc, questionPreviewerSvc, guidUtilSvc, questionConst,
        questionAdvanceSettingSvc, questionHistoryManagerSvc, surveyContentValidation,
        editQuestionSvc, stringUtilSvc) {
        var vm = this;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.questionTypes = questionConst.questionTypes;
        vm.updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.surveyEditorData = surveyEditorSvc.getData();

        vm.question = angular.copy($scope.question);
        vm.selectedQuestionType = vm.question.$type;
        vm.questionsWithOptions = questionCarryOverSvc.getAvailableCarryOverQuestions(vm.question.id);

        //Setup data for ckeditor
        questionEditorSvc.setSvtPlaceholderQuestionItems(vm.question.id);
        vm.placeholderQuestionItems = questionEditorSvc.getSvtPlaceholderQuestionItems();
        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);
        vm.questionErrors = surveyContentValidation.getErrorsByQuestionId(vm.question.id);
        vm.isQuestionRemainError = editQuestionSvc.isQuestionRemainError(vm.questionErrors, vm.question);

        vm.init = init;
        vm.getEditorClasses = getEditorClasses;
        vm.cancelEditQuestion = cancelEditQuestion;
        vm.doneEditQuestion = doneEditQuestion;
        vm.isShowValidationSetting = isShowValidationSetting;
        vm.isShowDisplaySetting = isShowDisplaySetting;

        vm.init();

        function init() {
            vm.question.guid = guidUtilSvc.createGuid(); // guid for previewing question
            vm.question.advancedSettings = questionAdvanceSettingSvc.getDefaultAdvanceSettings();

            $scope.$on('event:DetectQuestionEditorError', function () {
                vm.isQuestionRemainError = editQuestionSvc.isQuestionRemainError(vm.questionErrors, vm.question);
            });

            $scope.$on('event:ClickOnOverlayInDesigner', function () {
                cancelEditQuestion($scope.htmlContainerId);
            });

            $scope.$on('$destroy', function () {
                questionHistoryManagerSvc.clearHistories();
            });
        }

        function getEditorClasses() {
            var classes = ['question-editor'];
            if (vm.isQuestionRemainError) {
                classes.push('survey-question--error');
            }
            return classes;
        }

        function cancelEditQuestion(htmlContainerId) {
            htmlContainerId = htmlContainerId || $scope.htmlContainerId;
            var destinationQuestion = createQuestionToCompare(vm.question);

            var isQuestionChanged = questionEditorSvc.isQuestionChanged(angular.copy($scope.question), destinationQuestion);
            if (isQuestionChanged) {
                var cancelEditingQuestion = constantSvc.messages.cancelEditingQuestion;
                $modal.open({
                    templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                    controller: 'deleteDialogCtrl',
                    resolve: {
                        modalData: function () {
                            return {
                                message: cancelEditingQuestion,
                                modalTitle: 'Cancel Confirmation',
                                okTitle: 'Discard changes',
                                cancelTitle: 'Continue editing'
                            };
                        }
                    }
                }).result.then(function (result) {
                    if (!result.status) return;
                    doneCancelEditingQuestion();
                });
            } else {
                doneCancelEditingQuestion();
            }
            return;

            function createQuestionToCompare(question) {
                var tempQuestion = questionEditorSvc.settingQuestionForUpdating({
                    question: angular.copy(question)
                });
                removeClientProperties(tempQuestion);

                return tempQuestion;

                function removeClientProperties(questionModel) {
                    if (questionModel.hasOwnProperty('guid')) delete questionModel.guid;
                    if (questionModel.hasOwnProperty('advancedSettings')) delete questionModel.advancedSettings;
                    if (questionModel.hasOwnProperty('displayedExpressionItems')) delete questionModel.displayedExpressionItems;
                    if (questionModel.optionList) {
                        questionEditorSvc.cleanOptionList(questionModel);
                    }
                }
            }

            function doneCancelEditingQuestion() {
                surveyEditorSvc.resetToViewMode();
                surveyEditorSvc.setSurveyEditMode(false);
                pageSvc.setActivePage(null);
                questionSvc.setActiveQuestion(vm.question.id);
                animateSvc.scrollToElement('#Question' + vm.question.id);
                if (pageSvc.showMovingPageIcon) pageSvc.showMovingPageIcon(true);
                indexSvc.callbackCheckOverlay(false);
                return;
            }
        }

        function doneEditQuestion() {
            if (!vm.question.advancedSettings.isUseQuestionMask) vm.question.questionMaskExpression = null;
            var questionTitleAndAliasValidationResult = questionValidationSvc.validateQuestionTitleAndAlias(vm.question);
            if (questionTitleAndAliasValidationResult.valid === false) {
                toastr.error(questionTitleAndAliasValidationResult.message);
            } else {
                var questionTitle = vm.question.title.items[0].text;
                vm.question.title.items[0].text = standardizeQuestionTitle(questionTitle);
                validateQuestionContentAndSaveChanges();
            }

            function standardizeQuestionTitle(questionTitle) {
                var standardizedQuestionTitle = stringUtilSvc.removeHTMLParagraphTag(questionTitle);
                standardizedQuestionTitle = stringUtilSvc.removeHTMLBreakTag(standardizedQuestionTitle);
                return stringUtilSvc.addHTMLParagraphTagWrapper(standardizedQuestionTitle);
            }

            function validateQuestionContentAndSaveChanges() {
                $rootScope.$broadcast('event:DoneEditQuestion', function (validationResult) {
                    if (validationResult.valid === false) {
                        toastr.error(validationResult.message);
                        return;
                    }
                    var updatingQuestion = questionEditorSvc.settingQuestionForUpdating({ question: angular.copy(vm.question) });
                    var optionRangeValidationMessage = questionEditorSvc.getValidationMessageWhenChangingOptionRange(updatingQuestion);

                    if (!optionRangeValidationMessage.willBeAffectedOther) {
                        questionEditorSvc.cleanOptionList(updatingQuestion);
                        saveChanges(updatingQuestion);
                        return;
                    }

                    $modal.open({
                        templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                        controller: 'deleteDialogCtrl',
                        resolve: {
                            modalData: function () {
                                return {
                                    message: optionRangeValidationMessage.message,
                                    modalTitle: 'Change Option Range Confirmation',
                                    okTitle: 'Change'
                                };
                            }
                        }
                    }).result.then(function (callBackData) {
                        if (callBackData.status) {
                            questionEditorSvc.cleanOptionList(updatingQuestion);
                            saveChanges(updatingQuestion);
                        }
                    });
                });
            }

            function saveChanges(updatingQuestion) {
                var updatedMessages = {
                    fail: 'Updating question was not successful.'
                };

                spinnerUtilSvc.showSpinner();
                questionDataSvc.updateById(updatingQuestion.surveyId, $scope.pageId, updatingQuestion).$promise.then(function (res) {
                    var question = JSON.parse(res.data);
                    surveyEditorSvc.setSurveyVersion(res.headers['survey-etag']);

                    question.pageId = $scope.pageId;
                    angular.copy(question, $scope.question);

                    pageSvc.setActivePage(null);
                    questionSvc.setActiveQuestion(question.id);
                    indexSvc.callbackCheckOverlay(false);
                    surveyEditorSvc.resetToViewMode();
                    surveyEditorQuestionSvc.handleDoneUpdateQuestion(question);

                    questionCarryOverSvc.setupData();
                    spinnerUtilSvc.hideSpinner();
                    animateSvc.scrollToElement('#Question' + question.id);

                    surveyContentValidation.validateLatestSurvey();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === settingConst.httpMethod.preConditionFail) {
                        errorHandlingSvc.manifestError('This question has changed. Please refresh to get the newest data', error);
                    } else {
                        errorHandlingSvc.manifestError(updatedMessages.fail, error);
                    }
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            }
        }

        function isShowAdvanceSetting() {
            return $scope.hideAdvanceSetting === "false";
        }

        function isShowDisplaySetting() {
            return isShowAdvanceSetting();
        }

        function isShowValidationSetting() {
            return isShowAdvanceSetting() && vm.question.$type !== questionConst.questionTypes.information;
        }
    }
})();
