(function () {
    'use strict';

    angular
        .module('svt')
        .controller('createQuestionCtrl', createQuestionCtrl);

    createQuestionCtrl.$inject = [
        '$scope', '$rootScope', 'questionSvc', 'questionValidationSvc',
        'questionDataSvc', 'pageSvc', 'errorHandlingSvc', 'questionEditorSvc',
        'surveyEditorSvc', 'surveyEditorPageSvc', 'surveyEditorQuestionSvc', 'questionCarryOverSvc',
        'indexSvc', 'spinnerUtilSvc', 'questionPreviewerSvc', 'languageStringUtilSvc',
        'guidUtilSvc', 'questionAdvanceSettingSvc', 'questionConst', 'questionHistoryManagerSvc',
        'surveyContentValidation', 'httpStatusCode', '$modal', 'constantSvc'
    ];

    function createQuestionCtrl(
        $scope, $rootScope, questionSvc, questionValidationSvc,
        questionDataSvc, pageSvc, errorHandlingSvc, questionEditorSvc,
        surveyEditorSvc, surveyEditorPageSvc, surveyEditorQuestionSvc, questionCarryOverSvc,
        indexSvc, spinnerUtilSvc, questionPreviewerSvc, languageStringUtilSvc,
        guidUtilSvc, questionAdvanceSettingSvc, questionConst, questionHistoryManagerSvc,
        surveyContentValidation, httpStatusCode, $modal, constantSvc) {
        /* jshint -W040 */
        var vm = this;
        var survey = surveyEditorSvc.getSurvey();
        var customColumns = survey && survey.customColumns;

        vm.questionTypes = questionConst.questionTypes;
        vm.updatingCommandTypes = questionPreviewerSvc.getUpdatingCommandTypes();
        vm.pageId = $scope.pageId;

        vm.question = {
            $type: $scope.questionType, // Added to make $type the first item.
            id: '0',
            optionList: null,
            orderType: 0,
            seed: 0,
            isInGrid: false,
            parentQuestionId: null,
            pageDefinitionId: vm.pageId, //TODO remove it
            alias: surveyEditorSvc.generateQuestionAliasAuto(),
            title: languageStringUtilSvc.buildLanguageString(),
            description: languageStringUtilSvc.buildLanguageString(),
            surveyId: questionSvc.getSelectedSurveyId(),
            validations: [],
            isFixedPosition: false,
            isAlwaysHidden: false,
            pageId: $scope.pageId,
            guid: guidUtilSvc.createGuid() // guid for previewing question
        };
        vm.selectedQuestionType = vm.question.$type; // use for processing change question type

        //Setup data for ckeditor
        questionEditorSvc.setSvtPlaceholderQuestionItems(vm.question.id);
        vm.placeholderQuestionItems = questionEditorSvc.getSvtPlaceholderQuestionItems();
        vm.placeholderRespondentItems = surveyEditorSvc.getSvtPlaceholderRespondentItems(customColumns);

        vm.cancelAddQuestion = cancelAddQuestion;
        vm.createNewQuestion = createNewQuestion;
        vm.isShowValidationSetting = isShowValidationSetting;

        init();

        function init() {
            if (vm.question.$type === questionConst.questionTypes.scale) vm.question.renderOptionByButton = true;
            vm.question.advancedSettings = questionAdvanceSettingSvc.getDefaultAdvanceSettings();
            vm.questionsWithOptions = questionCarryOverSvc.getAvailableCarryOverQuestions();

            $scope.$on('$destroy', function () {
                questionHistoryManagerSvc.clearHistories();
            });

            $scope.$on('questionTypeChange', function (event, type) {
                $scope.questionType = type;
            });

            $scope.$on('event:ClickOnOverlayInDesigner', function () {
                onClickOutsideOverlay();
            });
        }

        function onClickOutsideOverlay() {
            $modal.open({
                templateUrl: 'survey/common/deleteDialog/delete-dialog.html',
                controller: 'deleteDialogCtrl',
                resolve: {
                    modalData: function () {
                        return {
                            message: constantSvc.messages.cancelCreatingQuestion,
                            modalTitle: 'Cancel Confirmation',
                            okTitle: 'Discard changes',
                            cancelTitle: 'Continue editing'
                        };
                    }
                }
            }).result.then(function (result) {
                if (!result.status) return;
                cancelAddQuestion();
            });
        }

        function cancelAddQuestion() {
            surveyEditorSvc.setSurveyEditMode(false);
            surveyEditorSvc.resetToViewMode();
            questionSvc.setActiveQuestion(null);
            pageSvc.setActivePage(vm.pageId);
            indexSvc.callbackCheckOverlay(false);
        }

        function createNewQuestion() {
            if (!vm.question.advancedSettings.isUseQuestionMask) vm.question.questionMaskExpression = null;

            var questionTitleAndAliasValidationResult = questionValidationSvc.validateQuestionTitleAndAlias(vm.question);
            if (questionTitleAndAliasValidationResult.valid === false) {
                toastr.error(questionTitleAndAliasValidationResult.message);
                return;
            }

            $rootScope.$broadcast('event:DoneEditQuestion', function (validationResult) {
                if (validationResult.valid === false) {
                    toastr.error(validationResult.message);
                } else {
                    setupQuestionAndRequestToServer();
                }
            });

            function setupQuestionAndRequestToServer() {
                var creatingQuestion = angular.copy(vm.question);
                questionEditorSvc.cleanOptionList(creatingQuestion);
                creatingQuestion = questionEditorSvc.settingQuestionForCreating({
                    question: creatingQuestion, pageId: vm.pageId
                });

                spinnerUtilSvc.showSpinner();
                var addMessages = {
                    fail: 'Creating question was not successful.'
                };

                var page = pageSvc.getPageById($scope.pageId, survey.topFolder.childNodes);
                questionDataSvc.addNew(creatingQuestion, $scope.index, $scope.pageId, page.version).$promise.then(function (res) {
                    surveyEditorSvc.setSurveyVersion(res.headers['survey-etag']);
                    page.version = res.headers.etag;

                    var question = JSON.parse(res.data);
                    question.pageId = $scope.pageId;
                    surveyEditorPageSvc.appendQuestionIntoPage(vm.pageId, question, parseInt($scope.index));

                    spinnerUtilSvc.hideSpinner();
                    pageSvc.setActivePage(null);
                    questionSvc.setActiveQuestion(question.id);
                    indexSvc.callbackCheckOverlay(false);
                    questionCarryOverSvc.setupData();

                    surveyEditorSvc.resetToViewMode();
                    surveyEditorQuestionSvc.handleDoneCreateQuestion();
                    surveyContentValidation.validateLatestSurvey();
                }, function (error) {
                    spinnerUtilSvc.hideSpinner();
                    if (error.status === httpStatusCode.preConditionFail) {
                        toastr.error('This page has changed. Please refresh to get the newest data');
                    } else {
                        toastr.error(addMessages.fail);
                    }
                    surveyEditorSvc.setSurveyEditMode(false);
                });
            }
        }

        function isShowValidationSetting() {
            return $scope.questionType !== questionConst.questionTypes.information;
        }
    }
})();
