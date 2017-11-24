(function() {
    describe('Testing editQuestionCtrl controller', function() {
        var ctrl, q,
            rootScope, scope, $timeout,
            questionSvc, questionValidationSvc,
            questionDataSvc, pageSvc, errorHandlingSvc, surveyEditorSvc,
            surveyEditorQuestionSvc, settingConst, modal, questionEditorSvc,
            animateSvc, questionCarryOverSvc, constantSvc, indexSvc,
            spinnerUtilSvc, questionPreviewerSvc, guidUtilSvc, questionConst,
            questionAdvanceSettingSvc, questionHistoryManagerSvc;

        beforeEach(function() {
            module('svt');
            inject(function ($rootScope, $controller, $q, $injector) {
                rootScope = $rootScope;
                scope = $rootScope.$new();
                scope.question = {
                    id: 1,
                    $type: 'dummy'
                };
                q = $q;
                $timeout = $injector.get('$timeout');
                questionSvc = jasmine.createSpyObj('questionSvc', ['setActiveQuestion']);
                questionValidationSvc = jasmine.createSpyObj('questionValidationSvc', ['validateQuestionTitleAndAlias']);
                questionDataSvc = jasmine.createSpyObj('questionDataSvc', [
                    'updateById', 'deleteById', 'getById']);

                pageSvc = jasmine.createSpyObj('pageSvc', [
                    'setActivePage', 'hidePageEditor'
                ]);
                errorHandlingSvc = jasmine.createSpyObj('errorHandlingSvc', ['manifestError', 'writeErrorToConsole']);
                surveyEditorSvc = jasmine.createSpyObj('surveyEditorSvc', [
                    'setQuestionEditorId', 'getData',
                    'setSurveyEditMode', 'getSurveyEditMode', 'getOptions', 'resetToViewMode',
                    'getSurvey', 'getSvtPlaceholderRespondentItems'
                ]);
                surveyEditorSvc.getData.and.returnValue([]);

                surveyEditorQuestionSvc = jasmine.createSpyObj('surveyEditorQuestionSvc', [
                    'getQuestionByPageIdAndQuestionId', 'reloadQuestion', 'handleDoneUpdateQuestion']);
                surveyEditorQuestionSvc.getQuestionByPageIdAndQuestionId.and.returnValue({});

                modal = jasmine.createSpyObj('modal', ['open']);
                questionEditorSvc = jasmine.createSpyObj('questionEditorSvc', [
                    'getValidationMessageWhenChangingQuestionType',
                    'settingQuestionForUpdating', 'isQuestionChanged',
                    'setSvtPlaceholderQuestionItems', 'getSvtPlaceholderQuestionItems'
                ]);

                animateSvc = jasmine.createSpyObj('animateSvc', ['scrollToElement']);
                questionCarryOverSvc = jasmine.createSpyObj('questionCarryOverSvc', [
                    'getOptionsMaskQuestionTitle', 'setupCarryOverData',
                    'getSelectionQuestionListForCarryOver', 'getAvailableCarryOverQuestions'
                ]);
                questionCarryOverSvc.getSelectionQuestionListForCarryOver.and.returnValue([]);

                constantSvc = $injector.get('constantSvc');
                indexSvc = jasmine.createSpyObj('indexSvc', ['callbackCheckOverlay']);
                spinnerUtilSvc = jasmine.createSpyObj('spinnerUtilSvc', ['showSpinner', 'hideSpinner']);
                questionPreviewerSvc = jasmine.createSpyObj('questionPreviewerSvc', ['getUpdatingCommandTypes']);
                guidUtilSvc = jasmine.createSpyObj('guidUtilSvc', ['createGuid']);
                questionConst = $injector.get('questionConst');

                questionAdvanceSettingSvc = jasmine.createSpyObj('questionAdvanceSettingSvc', ['getDefaultAdvanceSettings']);
                questionAdvanceSettingSvc.getDefaultAdvanceSettings.and.returnValue({});
                questionHistoryManagerSvc = jasmine.createSpyObj('questionHistoryManagerSvc', [
                    'clearHistories', 'updateQuestionHistory', 'setupQuestionAfterChangingType'
                ]);

                ctrl = $controller('editQuestionCtrl', {
                    $scope: scope,
                    $timeout: $timeout,
                    questionSvc: questionSvc,
                    questionValidationSvc: questionValidationSvc,
                    questionDataSvc: questionDataSvc,
                    pageSvc: pageSvc,
                    errorHandlingSvc: errorHandlingSvc,
                    surveyEditorSvc: surveyEditorSvc,
                    surveyEditorQuestionSvc: surveyEditorQuestionSvc,
                    settingConst: settingConst,
                    $modal: modal,
                    questionEditorSvc: questionEditorSvc,
                    animateSvc: animateSvc,
                    questionCarryOverSvc: questionCarryOverSvc,
                    constantSvc: constantSvc,
                    indexSvc: indexSvc,
                    spinnerUtilSvc: spinnerUtilSvc,
                    questionPreviewerSvc: questionPreviewerSvc,
                    guidUtilSvc: guidUtilSvc,
                    questionConst: questionConst,
                    questionAdvanceSettingSvc: questionAdvanceSettingSvc,
                    questionHistoryManagerSvc: questionHistoryManagerSvc
                });
            });
        });

        describe('Testing controller properties', function () {
            it('should define required properties', function () {
                expect(ctrl.questionTypes).toBeDefined();
                expect(ctrl.question).toBeDefined();
            });

            it('should initialize default properties by calling service', function () {
                scope.question.$type = 'GridQuestionDefinition';
                ctrl.init();

                expect(questionPreviewerSvc.getUpdatingCommandTypes).toHaveBeenCalled();
                expect(surveyEditorSvc.getData).toHaveBeenCalled();
                expect(questionCarryOverSvc.getAvailableCarryOverQuestions).toHaveBeenCalled();
                expect(questionAdvanceSettingSvc.getDefaultAdvanceSettings).toHaveBeenCalled();
            });
        });

        describe('Testing cancelEditQuestion function', function () {
            beforeEach(function () {
                questionEditorSvc.settingQuestionForUpdating.and.returnValue({
                    guid: 'dummy',
                    advancedSettings: {},
                    displayedExpressionItems: []
                });
            });

            it('should cancel editing question when question has not changed', function () {
                questionEditorSvc.isQuestionChanged.and.returnValue(false);
                pageSvc.showMovingPageIcon = jasmine.createSpy();

                ctrl.cancelEditQuestion();

                expect(pageSvc.setActivePage).toHaveBeenCalledWith(null);
                expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                expect(surveyEditorSvc.resetToViewMode).toHaveBeenCalled();
            });

            describe('Question data was changed', function () {
                beforeEach(function () {
                    questionEditorSvc.settingQuestionForUpdating.and.returnValue({});
                    questionEditorSvc.isQuestionChanged.and.returnValue(true);
                });

                it('should cancel editing question when user agrees to cancel', function () {
                    modal.open.and.returnValue({ result: q.when({ status: true }) });

                    ctrl.cancelEditQuestion();
                    scope.$digest();
                    $timeout.flush();

                    expect(pageSvc.setActivePage).toHaveBeenCalledWith(null);
                    expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                    expect(surveyEditorSvc.resetToViewMode).toHaveBeenCalled();
                });

                it('should not cancel when user does not agree to cancel', function () {
                    modal.open.and.returnValue({ result: q.when({ status: false }) });

                    ctrl.cancelEditQuestion();
                    scope.$digest();

                    expect(surveyEditorSvc.resetToViewMode).not.toHaveBeenCalled();
                });

                it('should not cancel when user closed confirmation dialog', function () {
                    modal.open.and.returnValue({ result: q.reject() });

                    ctrl.cancelEditQuestion();
                    scope.$digest();

                    expect(surveyEditorSvc.resetToViewMode).not.toHaveBeenCalled();
                });
            });
        });

        describe('Testing doneEditQuestion function', function () {
            beforeEach(function () {
                ctrl.question.title = {
                    items: [{
                        text: 'a'
                    }]
                };
            });

            it('should not update invalid question title or alias', function () {
                ctrl.question.advancedSettings.isUseQuestionMask = true;
                questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valid: false });

                ctrl.doneEditQuestion();

                expect(questionDataSvc.updateById).not.toHaveBeenCalled();
            });

            it('should prepare data before updating question', function () {
                questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valie: true });
                questionDataSvc.updateById.and.returnValue({ $promise: q.when({}) });
                spyOn(rootScope, '$broadcast');

                ctrl.doneEditQuestion();

                expect(questionValidationSvc.validateQuestionTitleAndAlias).toHaveBeenCalled();
                expect(rootScope.$broadcast).toHaveBeenCalledWith('event:DoneEditQuestion', jasmine.any(Function));
            });

            xdescribe('Updating question was not successful', function () {
                it('should process error when question was changed before updating', function () {
                    questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valie: true });
                    questionDataSvc.updateById.and.returnValue({ $promise: q.reject({ status: 412 }) });

                    ctrl.doneEditQuestion();
                    scope.$digest();

                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });

                it('should process error when updating question has problem', function () {
                    questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valie: true });
                    questionDataSvc.updateById.and.returnValue({ $promise: q.reject({}) });

                    ctrl.doneEditQuestion();
                    scope.$digest();

                    expect(errorHandlingSvc.manifestError).toHaveBeenCalled();
                });
            });

            xdescribe('Updating question successfully', function () {
                beforeEach(function () {
                    questionValidationSvc.validateQuestionTitleAndAlias.and.returnValue({ valie: true });
                    questionDataSvc.updateById.and.returnValue({ $promise: q.when({ id: 1 }) });
                });

                it('should setup question when updating question successfully', function () {
                    spyOn(toastr, 'success');

                    ctrl.doneEditQuestion();
                    scope.$digest();

                    expect(questionSvc.setupQuestionFromApi).toHaveBeenCalled();
                    expect(surveyEditorQuestionSvc.reloadQuestion).toHaveBeenCalled();
                    expect(questionCarryOverSvc.setupCarryOverData).toHaveBeenCalled();
                    expect(pageSvc.setActivePage).toHaveBeenCalled();
                    expect(questionSvc.setActiveQuestion).toHaveBeenCalled();
                    expect(surveyEditorQuestionSvc.handleDoneUpdateQuestion).toHaveBeenCalled();
                });
            });
        });
    });
})();