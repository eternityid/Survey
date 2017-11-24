(function() {
    'use strict';
    describe('Testing createQuestionCtrl controller', function() {
        var ctrl,
            scope, q,
            questionSvc, questionValidationSvc,
            questionDataSvc, pageSvc, errorHandlingSvc,
            questionEditorSvc, surveyEditorSvc, surveyEditorPageSvc, surveyEditorQuestionSvc,
            questionCarryOverSvc, indexSvc, spinnerUtilSvc,
            questionPreviewerSvc, languageStringUtilSvc, guidUtilSvc,
            questionAdvanceSettingSvc, questionConst, questionHistoryManagerSvc,
            modal;

        beforeEach(function () {
            module('svt');
            inject(function($rootScope, $controller, $q, $injector) {
                scope = $rootScope.$new();
                scope.pageId = 1;
                scope.questionType = 'dummy';

                q = $q;
                questionSvc = jasmine.createSpyObj('questionSvc', [
                    'getSelectedSurveyId', 'getModes',
                    'toggleIsShowQuestionCreator', 'updateStatusModes',
                    'setActiveQuestion',
                    'setupQuestionFromApi',
                    'getQuestionsWithOptions',
                    'isScale'
                ]);
                questionSvc.getSelectedSurveyId.and.returnValue('1');
                questionSvc.getQuestionsWithOptions.and.returnValue({});

                questionValidationSvc = jasmine.createSpyObj('questionValidationSvc', [
                    'validateQuestion',
                    'validateQuestionTitleAndAlias'
                ]);

                questionDataSvc = jasmine.createSpyObj('questionDataSvc', [
                    'addNew', 'getById'
                ]);

                pageSvc = jasmine.createSpyObj('pageSvc', ['setActivePage']);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);

                questionEditorSvc = jasmine.createSpyObj('questionEditorSvc', [
                    'spinnerShow', 'spinnerHide',
                    'setSvtPlaceholderQuestionItems', 'getSvtPlaceholderQuestionItems'
                ]);

                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'setSurveyEditMode', 'resetToViewMode', 'getSurvey', 'generateQuestionAliasAuto', 'getSvtPlaceholderRespondentItems'
                ]);
                surveyEditorSvc.getSurvey.and.returnValue({
                    TopFolder: {
                        ChildNodes:[{}, {}]
                        }
                });

                surveyEditorPageSvc = jasmine.createSpyObj('surveyEditorPageSvc', ['appendQuestionIntoPage']);

                surveyEditorQuestionSvc = jasmine.createSpyObj('surveyEditorQuestionSvc', ['handleDoneCreateQuestion']);

                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                    'getSelectionQuestionListForCarryOver',
                    'getAvailableCarryOverQuestions'
                ]);

                indexSvc = jasmine.createSpyObj('indexSvc', ['callbackCheckOverlay']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);

                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['getUpdatingCommandTypes']);
                languageStringUtilSvc = jasmine.createSpyObj('languageStringUtilSvc', ['buildLanguageString']);
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);

                questionAdvanceSettingSvc = jasmine.createSpyObj('questionAdvanceSettingSvc', ['getDefaultAdvanceSettings']);
                questionAdvanceSettingSvc.getDefaultAdvanceSettings.and.returnValue({
                    name: 'a'
                });

                questionConst = $injector.get('questionConst');
                questionHistoryManagerSvc = jasmine.createSpyObj('questionHistoryManagerSvc', ['updateQuestionHistory', 'setupQuestionAfterChangingType']);

                modal = jasmine.createSpyObj('$modal', ['open']);

                ctrl = $controller('createQuestionCtrl', {
                    $scope: scope,
                    questionSvc: questionSvc,
                    questionValidationSvc: questionValidationSvc,
                    questionDataSvc: questionDataSvc,
                    pageSvc: pageSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    questionEditorSvc: questionEditorSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    surveyEditorPageSvc: surveyEditorPageSvc,
                    surveyEditorQuestionSvc: surveyEditorQuestionSvc,
                    questionCarryOverSvc: questionCarryOverSvc,
                    indexSvc: indexSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    languageStringUtilSvc: languageStringUtilSvc,
                    guidUtilSvc: guidUtilSvc,
                    questionAdvanceSettingSvc: questionAdvanceSettingSvc,
                    questionConst: questionConst,
                    questionHistoryManagerSvc: questionHistoryManagerSvc,
                    $modal: modal
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.pageId).toBeDefined();
                expect(ctrl.question).toBeDefined();
                expect(ctrl.questionTypes).toBeDefined();
            });

            it('should initialize default properties by calling service successfully', function () {
                expect(questionPreviewerSvc.getUpdatingCommandTypes).toHaveBeenCalled();
                expect(surveyEditorSvc.generateQuestionAliasAuto).toHaveBeenCalled();
                expect(languageStringUtilSvc.buildLanguageString).toHaveBeenCalled();
                expect(questionSvc.getSelectedSurveyId).toHaveBeenCalled();
                expect(guidUtilSvc.createGuid).toHaveBeenCalled();
            });
        });

        describe('Testing cancelAddQuestion function', function () {
            it('should destroy create-question directive', function () {
                scope.htmlContainerId = 'dummy';

                ctrl.cancelAddQuestion();

                expect(surveyEditorSvc.resetToViewMode).toHaveBeenCalled();
            });

            it('should cancel adding question', function () {
                ctrl.cancelAddQuestion();

                expect(surveyEditorSvc.setSurveyEditMode).toHaveBeenCalledWith(false);
                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                expect(pageSvc.setActivePage).toHaveBeenCalled();
                expect(indexSvc.callbackCheckOverlay).toHaveBeenCalledWith(false);
            });
        });

        describe('Testing createNewQuestion function', function () {
            it('should show message with invalid question data', function () {
                ctrl.question.advancedSettings = { isUseQuestionMask: true };
                questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valid: false });
                spyOn(toastr, 'error');

                ctrl.createNewQuestion();

                expect(toastr.error).toHaveBeenCalled();
            });

            xdescribe('With valid data', function () {
                beforeEach(function () {
                    ctrl.question.advancedSettings = { isUseQuestionMask: false };
                    questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valid: true });
                });

                it('should process error when adding question has problem', function () {
                    questionDataSvc.addNew.and.callFake(function () {
                        var defer = q.defer();
                        defer.reject();
                        return {
                            $promise: defer.promise
                        };
                    });
                    ctrl.advancedSettings = {};
                    ctrl.createNewQuestion();
                    scope.$digest();

                    expect(questionValidationSvc.validateQuestion).toHaveBeenCalled();
                    expect(spinnerUtilSvc.showSpinner).toHaveBeenCalled();
                    expect(questionDataSvc.addNew).toHaveBeenCalled();
                    expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });

                describe('Adding new question successfully', function () {

                    beforeEach(function () {
                        questionValidationSvc.validateQuestion.and.returnValue(true);
                    });

                    it('should show error message when adding new question returns failed status', function () {
                        questionDataSvc.addNew.and.returnValue({ $promise: q.when({ status: false }) });
                        spyOn(toastr, 'error');

                        ctrl.createNewQuestion();
                        scope.$digest();

                        expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                    });

                    describe('Adding new question returns success status', function () {
                        beforeEach(function () {
                            questionDataSvc.addNew.and.returnValue({ $promise: q.when({ status: true }) });
                            spyOn(toastr, 'success');
                        });

                        it('should hide spinner when getting question with options successfully', function () {
                            scope.$parent = {};
                            questionDataSvc.getById.and.returnValue({ $promise: q.when({}) });

                            ctrl.createNewQuestion();
                            scope.$digest();

                            expect(spinnerUtilSvc.hideSpinner).toHaveBeenCalled();
                            expect(pageSvc.setActivePage).toHaveBeenCalled();
                            expect(surveyEditorQuestionSvc.handleDoneCreateQuestion).toHaveBeenCalled();
                            expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                        });
                    });
                });
            });
        });
    });
})();